// ===== Coding Warm-up (Set 3) =====
// New patterns: sort, filter+sum, find, every/some, palindrome.
// Write each function, then run:  node coding-warmup-3.js   (AI off — type it!)

// ---------------------------------------------------------------------------
// P1) Sort orders by amount, highest first.  (sort)
//     sortByAmountDesc([{id:1,amount:50},{id:2,amount:200},{id:3,amount:100}])
//     -> [{id:2,amount:200},{id:3,amount:100},{id:1,amount:50}]
function sortByAmountDesc(orders) {
  // TODO
  return orders.sort((a, b) => b.amount - a.amount);
}

// ---------------------------------------------------------------------------
// P2) Total of only PAID orders.  (filter idea + sum)
//     totalPaid([{amount:100,status:"paid"},{amount:50,status:"pending"},{amount:30,status:"paid"}])
//     -> 130
function totalPaid(orders) {
  let sum = 0;
  for (const order of orders) {
    if (order.status == 'paid') {
      sum = sum + order.amount;
    }
  }
  return sum;
  // TODO
}

// ---------------------------------------------------------------------------
// P3) Find an order by id (or null if not found).  (find)
//     findById([{id:1},{id:2},{id:3}], 2) -> {id:2}
//     findById([{id:1}], 9) -> null
function findById(orders, id) {
  // TODO
  // return orders.find((order) => order.id === id) || null;
  const map = new Map();

  for (const order of orders) {
    map.set(order.id, order);
  }
  return map.get(id) || null;
}

// ---------------------------------------------------------------------------
// P4) Are ALL orders above a min amount?  (every)
//     allAbove([{amount:100},{amount:200}], 50) -> true
//     allAbove([{amount:100},{amount:20}], 50)  -> false
function allAbove(orders, min) {
  // TODO
  for (const order of orders) {
    if (order.amount <= min) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// P5) Is the string a palindrome? (reads same forwards & backwards)  (two pointers)
//     isPalindrome("level") -> true      isPalindrome("hello") -> false
function isPalindrome(str) {
  // TODO
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
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
  'P1 sortByAmountDesc',
  sortByAmountDesc([
    { id: 1, amount: 50 },
    { id: 2, amount: 200 },
    { id: 3, amount: 100 },
  ]),
  [
    { id: 2, amount: 200 },
    { id: 3, amount: 100 },
    { id: 1, amount: 50 },
  ],
);
check(
  'P2 totalPaid',
  totalPaid([
    { amount: 100, status: 'paid' },
    { amount: 50, status: 'pending' },
    { amount: 30, status: 'paid' },
  ]),
  130,
);
check('P3 findById', findById([{ id: 1 }, { id: 2 }, { id: 3 }], 2), { id: 2 });
check('P3 findById (missing)', findById([{ id: 1 }], 9), null);
check('P4 allAbove (true)', allAbove([{ amount: 100 }, { amount: 200 }], 50), true);
check('P4 allAbove (false)', allAbove([{ amount: 100 }, { amount: 20 }], 50), false);
check('P5 isPalindrome (true)', isPalindrome('level'), true);
check('P5 isPalindrome (false)', isPalindrome('hello'), false);
