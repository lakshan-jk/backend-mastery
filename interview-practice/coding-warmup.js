// ===== Coding Warm-up =====
// Realistic backend-style problems (like settlements / order data).
// Write your solution in each function, then run:  node coding-warmup.js
// It checks your answers and prints PASS/FAIL.  (AI off — type it yourself!)
//
// Mindset for live coding: ask clarifying Qs → narrate out loud → start simple → improve.

// ---------------------------------------------------------------------------
// P1) Total amount per vendor.  (map/reduce + object as a hashmap)
//     totalByVendor([{vendor:"A",amount:100},{vendor:"B",amount:50},{vendor:"A",amount:30}])
//     -> { A: 130, B: 50 }
function totalByVendor(orders) {
  // TODO: write this
  const totals = {};

  for (const order of orders) {
    totals[order.vendor] = (totals[order.vendor] || 0) + order.amount;
  }
  return totals;
}

// ---------------------------------------------------------------------------
// P2) Count orders by status.  (group + count)
//     countByStatus([{status:"paid"},{status:"pending"},{status:"paid"}])
//     -> { paid: 2, pending: 1 }
function countByStatus(orders) {
  // TODO

  const counts = {};
  for (const order of orders) {
    counts[order.status] = (counts[order.status] || 0) + 1;
  }
  return counts;
}

// ---------------------------------------------------------------------------
// P3) Top vendor by revenue.  (aggregate then find max)
//     topVendor([{vendor:"A",amount:100},{vendor:"B",amount:250},{vendor:"A",amount:30}])
//     -> "B"
function topVendor(orders) {
  // TODO
  const revenue = totalByVendor(orders);
  return Object.entries(revenue).sort((a, b) => b[1] - a[1])[0][0];
}

// ---------------------------------------------------------------------------
// P4) Deduplicate orders by id, keep the FIRST seen.  (Set / Map — idempotency flavor)
//     dedupeById([{id:1},{id:2},{id:1}])  -> [{id:1},{id:2}]
function dedupeById(orders) {
  // TODO
  let seen = new Set();
  let result = [];

  for (i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (seen.has(order.id)) continue;

    seen.add(order.id);
    result.push(order);
  }
  return result;
}

// ---------------------------------------------------------------------------
// P5) Two Sum (classic warm-up).  nums=[2,7,11,15], target=9 -> [0,1]
function twoSum(nums, target) {
  // TODO
  let map = new Map();
  for (i = 0; i < nums.length; i++) {
    const balance = target - nums[i];
    if (map.has(balance)) {
      return [map.get(balance), i];
    }
    map.set(nums[i], i);
  }
  return map;
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
  'P1 totalByVendor',
  totalByVendor([
    { vendor: 'A', amount: 100 },
    { vendor: 'B', amount: 50 },
    { vendor: 'A', amount: 30 },
  ]),
  { A: 130, B: 50 },
);
check(
  'P2 countByStatus',
  countByStatus([{ status: 'paid' }, { status: 'pending' }, { status: 'paid' }]),
  { paid: 2, pending: 1 },
);
check(
  'P3 topVendor',
  topVendor([
    { vendor: 'A', amount: 100 },
    { vendor: 'B', amount: 250 },
    { vendor: 'A', amount: 30 },
  ]),
  'B',
);
check('P4 dedupeById', dedupeById([{ id: 1 }, { id: 2 }, { id: 1 }]), [{ id: 1 }, { id: 2 }]);
check('P5 twoSum', twoSum([2, 7, 11, 15], 9), [0, 1]);
