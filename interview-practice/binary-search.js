// ===== Binary Search (sorted array, O(log n)) =====
// Return the INDEX of target in a sorted array, or -1 if not found.
// Idea: check the middle, throw away the half that can't contain target, repeat.
// Fill in binarySearch(), then run:  node binary-search.js

function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1; // target is in the right half
    else right = mid - 1; // target is in the left half
  }
  return -1; // not found
}

// ===================== tests (don't edit) =====================
function check(name, got, want) {
  const ok = got === want;
  console.log(`${ok ? "✅ PASS" : "❌ FAIL"}  ${name}` + (ok ? "" : `  got=${got} want=${want}`));
}

const a = [1, 3, 5, 7, 9, 11];
check("find 7", binarySearch(a, 7), 3);
check("find 1 (first)", binarySearch(a, 1), 0);
check("find 11 (last)", binarySearch(a, 11), 5);
check("find 5 (middle)", binarySearch(a, 5), 2);
check("not found (4)", binarySearch(a, 4), -1);
check("not found (0)", binarySearch(a, 0), -1);
check("empty array", binarySearch([], 5), -1);
