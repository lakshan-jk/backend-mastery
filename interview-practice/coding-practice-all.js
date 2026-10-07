// ===== Coding Practice — FULL SET (warm-ups 5+6+7, all fresh) =====
// 12 problems. Fill each, then run:  node coding-practice-all.js   → PASS/FAIL.
//
// YOUR FOCUS: read each problem TWICE, restate it in your own words, trace the
// example by hand, note input/output/edge cases, THEN code. Slow is smooth.

// === STRINGS & MAPS ========================================================

// P1) Longest word (strip punctuation; first wins on a tie).
//     longestWord("What a wonderful day") -> "wonderful"
//     Hint: words = str.match(/[a-z0-9]+/gi) || []; track longest with > (not >=).
function longestWord(sentence) {
  // TODO
}

// P2) First non-repeating character, else "".
//     firstUnique("swiss") -> "w"
//     Hint: frequency map, then scan the ORIGINAL string for the first count===1.
function firstUnique(str) {
  // TODO
}

// P3) Total 'paid' amount per vendor (round each total to 2dp).
//     totalPaidByVendor([{vendor:"A",amount:100.5,status:"paid"},{vendor:"A",amount:29.25,status:"paid"},{vendor:"B",amount:50,status:"pending"}])
//       -> { A: 129.75 }
//     Hint: filter status==='paid'; accumulate (obj[v]||0)+amount; round at the END.
function totalPaidByVendor(orders) {
  // TODO
}

// === HASHMAP / STACK / BUCKETING ===========================================

// P4) Two Sum — indices of the two numbers adding to target.
//     twoSum([2,7,11,15], 9) -> [0,1]
//     Hint: seen={value->index}; need=target-n; check seen BEFORE adding n.
function twoSum(nums, target) {
  // TODO
}

// P5) Balanced brackets — are () [] {} correctly matched/nested?
//     isBalanced("([]{})") -> true ;  isBalanced("([)]") -> false
//     Hint: push openers to a stack; on a closer, stack.pop() must be its match.
function isBalanced(str) {
  // TODO
}

// P6) Group anagrams.
//     groupAnagrams(["eat","tea","tan","ate","nat","bat"]) -> [["eat","tea","ate"],["tan","nat"],["bat"]]
//     Hint: key each word by its sorted letters; bucket into a map {key -> [words]}.
function groupAnagrams(words) {
  // TODO
}

// === SLIDING WINDOW / SEARCH / POINTERS / RECURSION ========================

// P7) Max sum of a subarray of size k. (fixed sliding window)
//     maxSubarraySum([2,1,5,1,3,2], 3) -> 9
//     Hint: sum first k; slide: +nums[i] -nums[i-k]; track max.
function maxSubarraySum(nums, k) {
  // TODO
}

// P8) Longest substring without repeating chars — return LENGTH. (variable window)
//     longestUnique("abcabcbb") -> 3
//     Hint: grow window with a Set; on duplicate, shrink from left until gone.
function longestUnique(s) {
  // TODO
}

// P9) Binary search — index of target in SORTED array, else -1.
//     binarySearch([1,3,5,7,9], 7) -> 3
//     Hint: lo/hi; mid=(lo+hi)>>1; compare; halve. O(log n).
function binarySearch(nums, target) {
  // TODO
}

// P10) Valid palindrome (letters/digits only, ignore case/punct).
//      isPalindrome("A man, a plan, a canal: Panama") -> true
//      Hint: clean string, then two pointers from both ends.
function isPalindrome(s) {
  // TODO
}

// P11) Valid anagram.
//      isAnagram("listen","silent") -> true ; isAnagram("rat","car") -> false
//      Hint: length check; frequency-count a, decrement with b.
function isAnagram(a, b) {
  // TODO
}

// P12) Fibonacci with memo. fib(0)=0, fib(1)=1.  fib(10) -> 55
//      Hint: recursion + memo object → O(n).
function fib(n, memo = {}) {
  // TODO
}

// ===========================================================================
// Checker — do not edit below.
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  got=${JSON.stringify(got)}`);
}
function checkGroups(name, got, want) {
  const norm = (g) => JSON.stringify((g || []).map((x) => [...x].sort()).sort());
  console.log(`${norm(got) === norm(want) ? "PASS" : "FAIL"}  ${name}  got=${JSON.stringify(got)}`);
}

check("P1 longestWord", longestWord("What a wonderful day"), "wonderful");
check("P2 firstUnique", firstUnique("swiss"), "w");
check("P3 totalPaidByVendor", totalPaidByVendor([{vendor:"A",amount:100.5,status:"paid"},{vendor:"A",amount:29.25,status:"paid"},{vendor:"B",amount:50,status:"pending"}]), {A:129.75});
check("P4 twoSum", twoSum([2,7,11,15], 9), [0,1]);
check("P5 isBalanced", isBalanced("([]{})"), true);
check("P5 isBalanced neg", isBalanced("([)]"), false);
checkGroups("P6 groupAnagrams", groupAnagrams(["eat","tea","tan","ate","nat","bat"]), [["eat","tea","ate"],["tan","nat"],["bat"]]);
check("P7 maxSubarraySum", maxSubarraySum([2,1,5,1,3,2], 3), 9);
check("P8 longestUnique", longestUnique("abcabcbb"), 3);
check("P9 binarySearch", binarySearch([1,3,5,7,9], 7), 3);
check("P9 binarySearch -1", binarySearch([1,3,5,7,9], 4), -1);
check("P10 isPalindrome", isPalindrome("A man, a plan, a canal: Panama"), true);
check("P11 isAnagram", isAnagram("listen","silent"), true);
check("P12 fib", fib(10), 55);
