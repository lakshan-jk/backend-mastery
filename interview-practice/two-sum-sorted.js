// ===== Two Sum II — sorted array (two pointers, O(n)) =====
// Find two numbers that add up to target; return their indices.
//   [2,7,11,15], target 9  ->  [0,1]  (2+7=9)
// Idea: pointer at start + pointer at end. Sum too big -> move right left.
//       Sum too small -> move left right. Works because the array is SORTED.
// Fill in twoSumSorted(), then run:  node two-sum-sorted.js

function twoSumSorted(nums, target) {
  // TODO:
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let sum = nums[left] + nums[right];

    if (sum === target) {
      return [left, right];
    }
    if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}

// ===================== tests (don't edit) =====================
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? '✅ PASS' : '❌ FAIL'}  ${name}` +
      (ok ? '' : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`),
  );
}

check('basic', twoSumSorted([2, 7, 11, 15], 9), [0, 1]);
check('ends', twoSumSorted([1, 2, 5, 8, 9], 10), [0, 4]);
check('first two', twoSumSorted([2, 3, 4], 5), [0, 1]);
check('last two', twoSumSorted([1, 2, 3, 9], 12), [2, 3]);
check('no pair', twoSumSorted([1, 2, 3], 100), []);
