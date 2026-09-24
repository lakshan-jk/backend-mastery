// ===== S3 event router: handle create/delete + classify by file format =====
// A more complete Lambda handler:
//   - routes on EVENT TYPE (ObjectCreated -> write, ObjectRemoved -> delete)
//   - classifies by FILE FORMAT (extension / content-type) and branches
// Run:  node s3-event-router.js   (mocks the DB; fires several mock events)

const db = new Map(); // stand-in for DynamoDB (key = fileId)

// --- classify a file by its extension (in real life, prefer Content-Type metadata) ---
function classify(fileId) {
  const ext = fileId.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return "document";
  if (["csv", "json", "xlsx"].includes(ext)) return "data";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  return "other";
}

// --- what to do per format (branching) ---
function processByFormat(type, fileId) {
  switch (type) {
    case "image":    return `generate thumbnail for ${fileId}`;
    case "document": return `extract text from ${fileId}`;
    case "data":     return `parse & import ${fileId}`;
    case "video":    return `queue transcoding for ${fileId}`;
    default:         return `store ${fileId} as-is`;
  }
}

exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records) {
    const eventName = record.eventName;                 // e.g. "ObjectCreated:Put"
    const fileId = decodeURIComponent(record.s3.object.key);

    // ---- route on EVENT TYPE ----
    if (eventName.startsWith("ObjectCreated")) {
      const type = classify(fileId);                    // classify by format
      const action = processByFormat(type, fileId);     // branch
      db.set(fileId, { fileId, type });                 // upsert metadata (overwrite = re-index)
      results.push({ fileId, event: "created", type, action });

    } else if (eventName.startsWith("ObjectRemoved")) {
      db.delete(fileId);                                // clean up metadata on delete
      results.push({ fileId, event: "removed", action: "deleted metadata row" });
    }
  }

  return results;
};

// ================= local demo =================
if (require.main === module) {
  const ev = (name, key) => ({ eventName: name, s3: { object: { key } } });
  const event = { Records: [
    ev("ObjectCreated:Put", "vacation.jpg"),      // image
    ev("ObjectCreated:Put", "invoice.pdf"),       // document
    ev("ObjectCreated:Put", "sales.csv"),         // data
    ev("ObjectCreated:Put", "clip.mp4"),          // video
    ev("ObjectCreated:Put", "vacation.jpg"),      // re-upload (overwrite) → re-index
    ev("ObjectRemoved:Delete", "invoice.pdf"),    // delete → clean up
  ]};

  exports.handler(event).then((res) => {
    console.log(JSON.stringify(res, null, 2));
    console.log("\n→ DB rows now:", [...db.keys()], "(invoice.pdf removed) ✅");
  });
}
