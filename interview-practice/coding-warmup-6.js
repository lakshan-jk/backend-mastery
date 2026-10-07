// ===== Coding Warm-up 6 — hashmaps & stacks (Coderbyte-style) =====
// Fill in each function, then run:  node coding-warmup-6.js   → PASS/FAIL. (type it yourself!)
//
// Patterns:
//   • Hashmap one-pass lookup: for each item, check if the "complement" was seen.
//   • Stack: push openers; on a closer, the top of the stack must be the match.

// ---------------------------------------------------------------------------
// P1) Two Sum. Return indices of the two numbers that add to target.
//     Exactly one solution; can't reuse an element.
//     twoSum([2,7,11,15], 9) -> [0,1]
//     twoSum([3,2,4], 6)     -> [1,2]
//     twoSum([3,3], 6)       -> [0,1]
//     Pattern: seen = {value -> index}; need = target - n; check seen BEFORE adding n.
function twoSum(nums, target) {
  // TODO
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const balance = target - nums[i];
    if (map.has(balance)) {
      return [map.get(balance), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// ---------------------------------------------------------------------------
// P2) Balanced Brackets. Return true if all (), [], {} are correctly matched/nested.
//     isBalanced("([]{})") -> true
//     isBalanced("([)]")   -> false
//     isBalanced("(((")    -> false
//     isBalanced("")       -> true
//     Pattern: push openers onto a stack; on a closer, stack.pop() must be its match.
function isBalanced(str) {
  // TODO
}

// ---------------------------------------------------------------------------
// P3) Group Anagrams. Group words that are anagrams of each other.
//     groupAnagrams(["eat","tea","tan","ate","nat","bat"])
//       -> [["eat","tea","ate"],["tan","nat"],["bat"]]   (order within/among groups not important)
//     Pattern: key each word by its sorted letters; bucket into a map {sortedKey -> [words]}.
function groupAnagrams(words) {
  // TODO
}

// ===========================================================================
// Checker — do not edit below.
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name}  got=${JSON.stringify(got)}  want=${JSON.stringify(want)}`,
  );
}
// For group anagrams, compare as sorted sets so order doesn't matter.
function checkGroups(name, got, want) {
  const norm = (g) => JSON.stringify((g || []).map((x) => [...x].sort()).sort());
  const ok = norm(got) === norm(want);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  got=${JSON.stringify(got)}`);
}

check('twoSum 1', twoSum([2, 7, 11, 15], 9), [0, 1]);
check('twoSum 2', twoSum([3, 2, 4], 6), [1, 2]);
check('twoSum 3', twoSum([3, 3], 6), [0, 1]);

check('isBalanced 1', isBalanced('([]{})'), true);
check('isBalanced 2', isBalanced('([)]'), false);
check('isBalanced 3', isBalanced('((('), false);
check('isBalanced 4', isBalanced(''), true);

checkGroups('groupAnagrams', groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']), [
  ['eat', 'tea', 'ate'],
  ['tan', 'nat'],
  ['bat'],
]);
