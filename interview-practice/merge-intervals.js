// ===== Merge Intervals (sort + scan) =====
// Merge all overlapping intervals.
//   [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]
// Idea: SORT by start, then scan — if current overlaps the last merged, extend it; else push new.
// Fill in merge(), then run:  node merge-intervals.js

function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    const last = result[result.length - 1];
    if (next[0] <= last[1]) {
      last[1] = Math.max(last[1], next[1]);
    } else {
      result.push(next);
    }
  }
  return result;
}

// ===================== tests (don't edit) =====================
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? '✅ PASS' : '❌ FAIL'}  ${name}` +
      (ok ? '' : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`),
  );
}

check(
  'basic overlap',
  merge([
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ]),
  [
    [1, 6],
    [8, 10],
    [15, 18],
  ],
);
check(
  'touching merges',
  merge([
    [1, 4],
    [4, 5],
  ]),
  [[1, 5]],
);
check(
  'no overlap',
  merge([
    [1, 2],
    [3, 4],
  ]),
  [
    [1, 2],
    [3, 4],
  ],
);
check(
  'all overlap',
  merge([
    [1, 4],
    [2, 3],
    [3, 6],
  ]),
  [[1, 6]],
);
check('single', merge([[5, 7]]), [[5, 7]]);
check(
  'unsorted input',
  merge([
    [8, 10],
    [1, 3],
    [2, 6],
  ]),
  [
    [1, 6],
    [8, 10],
  ],
);
