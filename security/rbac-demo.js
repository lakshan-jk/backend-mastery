// ===== Security: RBAC + ownership check (Authorization) =====
// Shows the real pattern: permissions map -> authorize() middleware -> ownership check.
// AuthN (who you are) is faked here via an "x-user" header so we can focus on AuthZ.
//
// Run:  node rbac-demo.js   ->  http://localhost:4500
//
// Try it (see how the SAME endpoint allows/denies based on role + ownership):
//   curl -H "x-user: vendorA" localhost:4500/settlements/s1     -> 200 (his own)
//   curl -H "x-user: vendorA" localhost:4500/settlements/s2     -> 403 (NOT his -> IDOR blocked)
//   curl -H "x-user: admin"   localhost:4500/settlements/s2     -> 200 (admin sees all)
//   curl -H "x-user: vendorA" localhost:4500/admin/settlements  -> 403 (no permission)
//   curl -H "x-user: admin"   localhost:4500/admin/settlements  -> 200

const express = require('express');
const app = express();

// ---- fake user directory (normally from DB after login/AuthN) ----
const users = {
  vendorA: { id: 'vendorA', role: 'vendor' },
  vendorB: { id: 'vendorB', role: 'vendor' },
  admin: { id: 'admin', role: 'admin' },
};

// ---- fake settlements (money records) ----
const settlements = {
  s1: { id: 's1', vendorId: 'vendorA', amount: 5000 },
  s2: { id: 's2', vendorId: 'vendorB', amount: 8000 },
};

// ---- STEP 1: permissions map (single source of truth) ----
const permissions = {
  customer: ['order:view-own'],
  vendor: ['settlement:view-own'],
  admin: ['settlement:view-own', 'settlement:view-all', 'refund:any'],
};

// ---- STEP 2: the "can" helper ----
function can(user, permission) {
  return permissions[user.role]?.includes(permission);
}

// ---- fake AUTHENTICATION: read who the user is from a header ----
// (in production this decodes a JWT or looks up a session)
app.use((req, res, next) => {
  const u = users[req.headers['x-user']];
  if (!u) return res.status(401).json({ error: 'Not logged in (send x-user header)' });
  req.user = u;
  next();
});

// ---- STEP 3: AUTHORIZATION middleware (our own code, not the framework's) ----
function authorize(permission) {
  return (req, res, next) => {
    if (!can(req.user, permission)) {
      return res.status(403).json({ error: `Forbidden: need ${permission}` });
    }
    next();
  };
}

// admin-only: view ALL settlements (RBAC alone is enough here)
app.get('/admin/settlements', authorize('settlement:view-all'), (req, res) => {
  res.json(Object.values(settlements));
});

// view ONE settlement: RBAC (can view settlements) + OWNERSHIP (must be yours)
app.get('/settlements/:id', authorize('settlement:view-own'), (req, res) => {
  const s = settlements[req.params.id];
  if (!s) return res.status(404).json({ error: 'Not found' });

  // ---- STEP 4: OWNERSHIP check — the layer that blocks IDOR ----
  // role says "you can view settlements"; this says "you can view YOURS"
  if (s.vendorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not your settlement (IDOR blocked)' });
  }
  res.json(s);
});

app.listen(4500, () => console.log('🔐 RBAC demo on http://localhost:4500'));
