// ===== Coding Warm-up (Set 2) =====
// New patterns: filter, group-into-arrays, average, max-by-count, string.
// Write each function, then run:  node coding-warmup-2.js   (AI off — type it!)

// ---------------------------------------------------------------------------
// P1) Filter orders with amount >= min.  (filter)
//     highValue([{id:1,amount:100},{id:2,amount:40},{id:3,amount:200}], 100)
//     -> [{id:1,amount:100},{id:3,amount:200}]
function highValue(orders, min) {
  // TODO
  // return orders.filter((order) => order.amount >= min);
  const result = [];

  for (const order of orders) {
    if (order.amount >= min) {
      result.push(order);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// P2) Group orders by vendor into arrays.  (group -> arrays)
//     groupByVendor([{vendor:"A",id:1},{vendor:"B",id:2},{vendor:"A",id:3}])
//     -> { A: [{vendor:"A",id:1},{vendor:"A",id:3}], B: [{vendor:"B",id:2}] }
function groupByVendor(orders) {
  // portable across Node versions (Object.groupBy needs Node 21+)
  const grouped = {};
  for (const order of orders) {
    (grouped[order.vendor] ??= []).push(order);
  }
  return grouped;
}

// ---------------------------------------------------------------------------
// P3) Average order amount (rounded to nearest integer).  (sum / count)
//     averageAmount([{amount:100},{amount:50},{amount:30}]) -> 60
function averageAmount(orders) {
  // TODO
  let sum = 0;
  for (const order of orders) {
    sum = sum + order.amount;
  }
  return Math.round(sum / orders.length);
}

// ---------------------------------------------------------------------------
// P4) Most frequent status.  (count, then find max count)
//     mostFrequentStatus([{status:"paid"},{status:"paid"},{status:"pending"}]) -> "paid"
function mostFrequentStatus(orders) {
  // TODO

  const mfs = {};
  for (const order of orders) {
    mfs[order.status] = (mfs[order.status] || 0) + 1;
  }
  return Object.entries(mfs).sort((a, b) => b[1] - a[1])[0][0];
}

// ---------------------------------------------------------------------------
// P5) First non-repeating character in a string.  (count chars, find first with count 1)
//     firstUnique("swiss") -> "w"      firstUnique("aabb") -> null
function firstUnique(str) {
  // TODO
  const count = {};
  for (const ch of str) {
    count[ch] = (count[ch] || 0) + 1;
  }
  for (const ch of str) {
    if (count[ch] === 1) return ch;
  }
  return null;
}

// ===================== test runner (don't edit) =====================
function eq(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function check(name, got, want) {
  const ok = eq(got, want);
  console.log(
    `${ok ? '✅ PASS' : '❌ FAIL'}  ${name}` +
      (ok ? '' : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`),
  );
}

check(
  'P1 highValue',
  highValue(
    [
      { id: 1, amount: 100 },
      { id: 2, amount: 40 },
      { id: 3, amount: 200 },
    ],
    100,
  ),
  [
    { id: 1, amount: 100 },
    { id: 3, amount: 200 },
  ],
);
check(
  'P2 groupByVendor',
  groupByVendor([
    { vendor: 'A', id: 1 },
    { vendor: 'B', id: 2 },
    { vendor: 'A', id: 3 },
  ]),
  {
    A: [
      { vendor: 'A', id: 1 },
      { vendor: 'A', id: 3 },
    ],
    B: [{ vendor: 'B', id: 2 }],
  },
);
check('P3 averageAmount', averageAmount([{ amount: 100 }, { amount: 50 }, { amount: 30 }]), 60);
check(
  'P4 mostFrequentStatus',
  mostFrequentStatus([{ status: 'paid' }, { status: 'paid' }, { status: 'pending' }]),
  'paid',
);
check('P5 firstUnique', firstUnique('swiss'), 'w');
check('P5 firstUnique (none)', firstUnique('aabb'), null);
