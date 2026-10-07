// ===== Coding Warm-up 5 — String parsing (Coderbyte-style) =====
// Realistic screen-style string problems. Write your solution in each function,
// then run:  node coding-warmup-5.js   → it prints PASS/FAIL.  (AI off — type it!)
//
// Key patterns:
//   • Tokenize on spaces AND punctuation in ONE step:  str.match(/[a-z0-9]+/gi)
//     (returns null if nothing matches → guard it)
//   • "First on a tie" → compare with > (strictly greater), never >=, so the
//     first winner stays.
//   • Frequency map (object or Map) → then a SECOND pass over the original
//     string to preserve order.

// ---------------------------------------------------------------------------
// P1) Longest Word.  Strip punctuation (letters/digits only). First wins on a tie.
//     longestWord("Hello world!")            -> "Hello"
//     longestWord("What a wonderful day")    -> "wonderful"
//     longestWord("abc 12345 de")            -> "12345"
function longestWord(sentence) {
  const words = sentence.match(/[a-z0-9]+/gi);

  if (!words) return '';

  let longest = '';
  for (const word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }
  return longest;
}

// ---------------------------------------------------------------------------
// P2) First Non-Repeating Character.  Return the first char that appears once,
//     else "".  (frequency map, then scan the ORIGINAL string for order)
//     firstUnique("leetcode") -> "l"
//     firstUnique("aabbcc")   -> ""
//     firstUnique("swiss")    -> "w"
function firstUnique(str) {
  // TODO: 1) build a count map  2) scan str again, return first char with count 1
  const counts = {};
  for (const ch of str) counts[ch] = (counts[ch] || 0) + 1;
  for (const ch of str) if (counts[ch] === 1) return ch;
  return '';
}

// ===========================================================================
// Checker — do not edit below.
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name}  got=${JSON.stringify(got)}  want=${JSON.stringify(want)}`,
  );
}

check('longestWord 1', longestWord('Hello world!'), 'Hello');
check('longestWord 2', longestWord('What a wonderful day it is'), 'wonderful');
check('longestWord 3', longestWord('abc 12345 de'), '12345');
check('longestWord edge', longestWord('!!! ???'), '');

check('firstUnique 1', firstUnique('leetcode'), 'l');
check('firstUnique 2', firstUnique('aabbcc'), '');
check('firstUnique 3', firstUnique('swiss'), 'w');
