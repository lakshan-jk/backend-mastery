// ===== LRU Cache (Map-based, O(1)) =====
// LRU = Least Recently Used. Fixed capacity; when full, evict the least-recently-used item.
// JS Map keeps insertion order → first key = oldest, last key = most recent.
// Fill in get() and put(), then run:  node lru-cache.js

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    // TODO:
    // 1. if key not in map -> return -1
    // 2. read the value, delete the key, re-set it (moves it to "most recent")
    // 3. return the value
    if (!this.map.has(key)) {
      return -1;
    }
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  put(key, value) {
    // TODO:
    // 1. if key already exists -> delete it (so we can re-add at the end)
    // 2. set key->value (now it's most recent)
    // 3. if size > capacity -> evict the FIRST key (oldest): this.map.keys().next().value
    if (this.map.has(key)) return this.map.delete(key);

    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}

// ===================== tests (don't edit) =====================
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? '✅ PASS' : '❌ FAIL'}  ${name}` +
      (ok ? '' : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`),
  );
}

const c = new LRUCache(2); // capacity 2
c.put(1, 1); // {1}
c.put(2, 2); // {1,2}
check('get(1)', c.get(1), 1); // 1 is used -> now most recent. order: {2,1}
c.put(3, 3); // full -> evict LRU (2). order: {1,3}
check('get(2) evicted', c.get(2), -1);
c.put(4, 4); // full -> evict LRU (1). order: {3,4}
check('get(1) evicted', c.get(1), -1);
check('get(3)', c.get(3), 3);
check('get(4)', c.get(4), 4);
