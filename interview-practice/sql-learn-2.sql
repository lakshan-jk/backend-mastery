-- ============================================================================
-- SQL PART 2 — intermediate (the interview sweet spot)
-- Run:  sqlite3 practice.db < sql-seed.sql   then   sqlite3 practice.db < sql-learn-2.sql
-- Covers: DISTINCT, IN/BETWEEN/LIKE/NULL, subqueries, CASE, JOIN types, window functions.
-- ============================================================================


SELECT '===== L7: DISTINCT — unique values =====' AS lesson;
SELECT DISTINCT country FROM vendors;            -- each country once
SELECT DISTINCT tier FROM vendors;
-- >>> YOUR TURN 7a: the distinct list of transaction statuses.


SELECT '===== L8: IN / BETWEEN / LIKE / IS NULL =====' AS lesson;
-- IN = matches any in a list
SELECT name, tier FROM vendors WHERE tier IN ('high', 'medium');
-- BETWEEN = range (inclusive)
SELECT * FROM transactions WHERE amount BETWEEN 100 AND 800;
-- LIKE = pattern match.  % = any chars,  _ = one char
SELECT name FROM vendors WHERE name LIKE '%e%';   -- names containing 'e'
SELECT name FROM vendors WHERE name LIKE 'A%';    -- names starting with 'A'
-- IS NULL / IS NOT NULL (never use = NULL)
SELECT name FROM vendors WHERE country IS NOT NULL;
-- >>> YOUR TURN 8a: vendors onboarded BETWEEN '2026-01-01' AND '2026-03-31'.
-- >>> YOUR TURN 8b: vendors whose name contains the letter 'o'.


SELECT '===== L9: SUBQUERIES — a query inside a query =====' AS lesson;
-- Use the result of one query inside another.
-- Vendors who HAVE at least one assessment:
SELECT name FROM vendors
WHERE id IN (SELECT vendor_id FROM assessments);
-- Vendors with NO transactions:
SELECT name FROM vendors
WHERE id NOT IN (SELECT vendor_id FROM transactions);
-- Scalar subquery (returns one value) — vendors with risk above the average:
SELECT v.name, a.risk_score
FROM vendors v JOIN assessments a ON a.vendor_id = v.id
WHERE a.risk_score > (SELECT AVG(risk_score) FROM assessments);
-- >>> YOUR TURN 9a: names of vendors who have at least one 'paid' transaction (subquery).


SELECT '===== L10: CASE — if/else inside SQL =====' AS lesson;
-- Bucket rows into labels.
SELECT name, risk_score,
  CASE
    WHEN risk_score >= 70 THEN 'HIGH RISK'
    WHEN risk_score >= 40 THEN 'MEDIUM'
    ELSE 'LOW'
  END AS risk_band
FROM assessments a JOIN vendors v ON v.id = a.vendor_id;
-- CASE inside an aggregate = conditional counting:
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid_count
FROM transactions;
-- >>> YOUR TURN 10a: label each transaction amount as 'BIG' (>=1000) or 'SMALL'.


SELECT '===== L11: JOIN TYPES =====' AS lesson;
-- INNER JOIN (default): only matching rows on both sides.
-- LEFT JOIN: all left rows, NULLs where no match on the right.
SELECT v.name, COUNT(a.id) AS num_assessments
FROM vendors v
LEFT JOIN assessments a ON a.vendor_id = v.id
GROUP BY v.id, v.name;      -- Hooli shows 0 (LEFT keeps it)
-- (SQLite has no RIGHT/FULL JOIN; Postgres/MySQL do — know they exist.)
-- >>> YOUR TURN 11a: each vendor name + their count of transactions (0 if none).


SELECT '===== L12: WINDOW FUNCTIONS — advanced, high-value =====' AS lesson;
-- Like GROUP BY but keeps every row (adds a computed column per "window").
-- Rank transactions by amount within each vendor:
SELECT vendor_id, amount,
  ROW_NUMBER() OVER (PARTITION BY vendor_id ORDER BY amount DESC) AS rn
FROM transactions;
-- Running total of paid amounts over time:
SELECT txn_date, amount,
  SUM(amount) OVER (ORDER BY txn_date) AS running_total
FROM transactions WHERE status = 'paid';
-- >>> YOUR TURN 12a: for each vendor, number their transactions oldest→newest (ROW_NUMBER).


-- ============================================================================
-- SOLUTIONS (try first!)
-- 7a)  SELECT DISTINCT status FROM transactions;
-- 8a)  SELECT * FROM vendors WHERE onboarded_date BETWEEN '2026-01-01' AND '2026-03-31';
-- 8b)  SELECT name FROM vendors WHERE name LIKE '%o%';
-- 9a)  SELECT name FROM vendors WHERE id IN (SELECT vendor_id FROM transactions WHERE status='paid');
-- 10a) SELECT id, amount, CASE WHEN amount >= 1000 THEN 'BIG' ELSE 'SMALL' END AS size FROM transactions;
-- 11a) SELECT v.name, COUNT(t.id) AS txns FROM vendors v LEFT JOIN transactions t ON t.vendor_id=v.id GROUP BY v.id, v.name;
-- 12a) SELECT vendor_id, txn_date, ROW_NUMBER() OVER (PARTITION BY vendor_id ORDER BY txn_date) AS n FROM transactions;
-- ============================================================================
