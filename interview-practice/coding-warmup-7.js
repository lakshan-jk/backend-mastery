// ===== Coding Warm-up 7 — core DSA patterns =====
// Fill each function, then run:  node coding-warmup-7.js   → PASS/FAIL. (type it yourself!)
//
// REMEMBER (your focus area): read each problem TWICE, trace the example by hand,
// note input/output/edge cases, THEN code.
//
// Patterns covered: sliding window (fixed + variable), binary search, two pointers,
// frequency map, recursion + memo.

// ---------------------------------------------------------------------------
// P1) Max sum of a subarray of size k.  (FIXED sliding window)
//     maxSubarraySum([2,1,5,1,3,2], 3) -> 9   (5+1+3)
//     maxSubarraySum([2,3,4,1,5], 2)   -> 7   (3+4)
//     Pattern: sum first k; then slide — add nums[i], subtract nums[i-k]; track max.
function maxSubarraySum(nums, k) {
  // TODO
}

// ---------------------------------------------------------------------------
// P2) Longest substring WITHOUT repeating characters. Return its LENGTH. (VARIABLE window)
//     longestUnique("abcabcbb") -> 3  ("abc")
//     longestUnique("bbbbb")    -> 1  ("b")
//     longestUnique("pwwkew")   -> 3  ("wke")
//     Pattern: grow a window with a Set; on a duplicate, shrink from the left until it's gone.
function longestUnique(s) {
  // TODO
}

// ---------------------------------------------------------------------------
// P3) Binary search. Return the INDEX of target in a SORTED array, or -1.
//     binarySearch([1,3,5,7,9], 7) -> 3
//     binarySearch([1,3,5,7,9], 4) -> -1
//     Pattern: lo/hi pointers; mid = (lo+hi)>>1; compare; halve the range. O(log n).
function binarySearch(nums, target) {
  // TODO
}

// ---------------------------------------------------------------------------
// P4) Valid palindrome. Only consider letters/digits; ignore case & punctuation.
//     isPalindrome("A man, a plan, a canal: Panama") -> true
//     isPalindrome("race a car")                      -> false
//     isPalindrome("")                                 -> true
//     Pattern: clean the string, then two pointers from both ends moving inward.
function isPalindrome(s) {
  // TODO
}

// ---------------------------------------------------------------------------
// P5) Valid anagram — do a and b use the exact same letters/counts?
//     isAnagram("listen","silent") -> true
//     isAnagram("rat","car")       -> false
//     Pattern: if lengths differ -> false; else frequency-count a, decrement with b.
function isAnagram(a, b) {
  // TODO
}

// ---------------------------------------------------------------------------
// P6) Fibonacci (0-indexed) with memoization.  fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)
//     fib(10) -> 55   fib(0) -> 0   fib(1) -> 1
//     Pattern: recursion + a memo object so you don't recompute (turns O(2^n) into O(n)).
function fib(n, memo = {}) {
  // TODO
}

// ===========================================================================
// Checker — do not edit below.
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  got=${JSON.stringify(got)}  want=${JSON.stringify(want)}`);
}

check("maxSubarraySum 1", maxSubarraySum([2, 1, 5, 1, 3, 2], 3), 9);
check("maxSubarraySum 2", maxSubarraySum([2, 3, 4, 1, 5], 2), 7);

check("longestUnique 1", longestUnique("abcabcbb"), 3);
check("longestUnique 2", longestUnique("bbbbb"), 1);
check("longestUnique 3", longestUnique("pwwkew"), 3);

check("binarySearch 1", binarySearch([1, 3, 5, 7, 9], 7), 3);
check("binarySearch 2", binarySearch([1, 3, 5, 7, 9], 4), -1);

check("isPalindrome 1", isPalindrome("A man, a plan, a canal: Panama"), true);
check("isPalindrome 2", isPalindrome("race a car"), false);
check("isPalindrome 3", isPalindrome(""), true);

check("isAnagram 1", isAnagram("listen", "silent"), true);
check("isAnagram 2", isAnagram("rat", "car"), false);

check("fib 1", fib(10), 55);
check("fib 2", fib(0), 0);
check("fib 3", fib(1), 1);
