// ===== Coding Warm-up (Set 4: settlements flavor) =====
// From the mock interview. Write each, then run:  node coding-warmup-4.js
// Approach out loud first: clarify -> narrate -> code.

// ---------------------------------------------------------------------------
// P1) Net balance per vendor (credit adds, debit subtracts).  [MOCK Q5]
//     netBalance([{vendor:"A",type:"credit",amount:100},{vendor:"B",type:"credit",amount:50},{vendor:"A",type:"debit",amount:30}])
//     -> { A: 70, B: 50 }
function netBalance(txns) {
  // TODO

  let balacne = {};
  for (const txn of txns) {
    const change = txn.type === 'debit' ? -txn.amount : txn.amount;
    balacne[txn.vendor] = (balacne[txn.vendor] || 0) + change;
  }
  return balacne;
}

// ---------------------------------------------------------------------------
// P2) Vendors whose balance is NEGATIVE (they owe money).  (filter an object)
//     negativeVendors({A:70,B:-20,C:-5}) -> ["B","C"]
function negativeVendors(balances) {
  let result = [];
  for (const [vendor, bal] of Object.entries(balances)) {
    if (bal < 0) {
      result.push(vendor);
    }
  }
  return result;
  // TODO
}

// ---------------------------------------------------------------------------
// P3) Total settlement amount across ALL txns (ignore type).  (sum)
//     totalAmount([{amount:100},{amount:50},{amount:30}]) -> 180
function totalAmount(txns) {
  // TODO
  let sum = 0;

  for (const txn of txns) {
    sum += txn.amount;
  }
  return sum;
}

// ---------------------------------------------------------------------------
// P4) Count credits vs debits.  (count by type)
//     countTypes([{type:"credit"},{type:"debit"},{type:"credit"}]) -> { credit: 2, debit: 1 }
function countTypes(txns) {
  // TODO
  let count = {};

  for (const txn of txns) {
    count[txn.type] = (count[txn.type] || 0) + 1;
  }
  return count;
}

// ---------------------------------------------------------------------------
// P5) Highest single credit amount.  (max on a filtered set)
//     maxCredit([{type:"credit",amount:100},{type:"debit",amount:500},{type:"credit",amount:250}]) -> 250
function maxCredit(txns) {
  // TODO
  // return txns.filter((t) => t.type === 'credit').sort((a, b) => b.amount - a.amount)[0].amount;
  let max = 0;

  for (const txn of txns) {
    if (txn.type === 'credit' && txn.amount > max) {
      max = txn.amount;
    }
  }
  return max;
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
  'P1 netBalance',
  netBalance([
    { vendor: 'A', type: 'credit', amount: 100 },
    { vendor: 'B', type: 'credit', amount: 50 },
    { vendor: 'A', type: 'debit', amount: 30 },
  ]),
  { A: 70, B: 50 },
);
check('P2 negativeVendors', negativeVendors({ A: 70, B: -20, C: -5 }), ['B', 'C']);
check('P3 totalAmount', totalAmount([{ amount: 100 }, { amount: 50 }, { amount: 30 }]), 180);
check('P4 countTypes', countTypes([{ type: 'credit' }, { type: 'debit' }, { type: 'credit' }]), {
  credit: 2,
  debit: 1,
});
check(
  'P5 maxCredit',
  maxCredit([
    { type: 'credit', amount: 100 },
    { type: 'debit', amount: 500 },
    { type: 'credit', amount: 250 },
  ]),
  250,
);
