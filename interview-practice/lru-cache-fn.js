// ===== LRU Cache — function style (factory + closure, no class, no `this`) =====
// Same logic as the class version, but `map` and `capacity` are captured by closure.
// Fill in get() and put(), then run:  node lru-cache-fn.js

function createLRU(capacity) {
  const map = new Map(); // captured by closure — no `this` needed

  function get(key) {
    // TODO: not there -> -1; else read val, delete+set (bump to newest), return val
    if (!map.has(key)) return -1;

    const val = map.get(key);
    map.delete(key);
    map.set(key, val);
    return val;
  }

  function put(key, value) {
    // TODO: if exists delete; set at end; if size > capacity, delete the first (oldest) key
    if (map.has(key)) map.delete(key);

    map.set(key, value);

    if (map.size > capacity) {
      const oldest = map.keys().next().value;
      map.delete(oldest);
    }
  }

  return { get, put }; // expose the two operations
}

// ===================== tests (don't edit) =====================
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(
    `${ok ? '✅ PASS' : '❌ FAIL'}  ${name}` +
      (ok ? '' : `  got=${JSON.stringify(got)} want=${JSON.stringify(want)}`),
  );
}

const cache = createLRU(2);
cache.put(1, 1);
cache.put(2, 2);
check('get(1)', cache.get(1), 1);
cache.put(3, 3); // evicts 2
check('get(2) evicted', cache.get(2), -1);
cache.put(4, 4); // evicts 1
check('get(1) evicted', cache.get(1), -1);
check('get(3)', cache.get(3), 3);
check('get(4)', cache.get(4), 4);
