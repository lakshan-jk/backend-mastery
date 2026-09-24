# AWS — S3 → Lambda → DynamoDB (event-driven) + IAM

A file lands in **S3** → S3 fires an **event** → **Lambda** runs → writes metadata to **DynamoDB**.
Classic serverless, event-driven pattern. See [`s3-to-dynamodb.js`](s3-to-dynamodb.js).

```
[ Client ] --upload--> [ S3 ] --event--> [ Lambda ] --putItem--> [ DynamoDB ]
```

- **S3** = object storage (the files)
- **Lambda** = serverless compute (runs on the event, no server to manage)
- **DynamoDB** = fast NoSQL metadata store (keyed by a partition key)
- Make the write **idempotent** — S3 events can fire more than once.

---

## IAM — who can do what

Lambda doesn't use passwords to reach S3/DynamoDB — it **assumes a role** whose **policy** grants
specific permissions. A policy is JSON built from three parts:

```
Effect    → Allow / Deny
Action    → service:operation   (e.g. s3:GetObject, dynamodb:PutItem)
Resource  → the ARN (unique address of the resource)
```

See [`iam-policy.json`](iam-policy.json) — the **least-privilege** policy for this flow. It grants the
Lambda role exactly three things:

| Permission | Why |
|---|---|
| `s3:GetObject` on `uploads-bucket/*` | read the uploaded file |
| `dynamodb:PutItem` on `table/files` | write the metadata row |
| `logs:*` | write CloudWatch logs |

Nothing else — that's **least privilege**: give only the permissions actually needed.

### The 3 IAM identities
- **User** — a person, with login credentials
- **Role** — an identity a *service* assumes (Lambda → role → access) — no long-lived secrets
- **Group** — a set of users sharing the same policies

### ARN (Amazon Resource Name)
The unique address of any AWS resource, e.g. `arn:aws:s3:::uploads-bucket/*`
→ `arn:aws:<service>:<region>:<account>:<resource>`

**One-liner:** *IAM policies are Effect + Action + Resource; services use roles (not passwords) with
least-privilege policies.*
