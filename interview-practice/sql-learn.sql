-- ============================================================================
-- SQL FROM SCRATCH — a runnable course.  (schema: vendors, assessments, transactions)
--
-- HOW TO USE:
--   1) Build the DB once:   sqlite3 practice.db < sql-seed.sql
--   2) Run this whole tour: sqlite3 practice.db < sql-learn.sql
--      (it prints each lesson's example output so you learn by seeing)
--   3) PRACTICE: scroll to each "-- >>> YOUR TURN" block, write your query under it,
--      then re-run the file. Solutions are at the very bottom (peek only after trying).
--
-- Mental model:   SELECT <columns>  FROM <table>  WHERE <row filter>
--                 GROUP BY <col>  HAVING <group filter>  ORDER BY <col>  LIMIT <n>
-- ============================================================================


SELECT '===== LESSON 1: SELECT — getting data =====' AS lesson;
-- * means all columns. Pick columns by naming them.
SELECT name, country, tier FROM vendors;
-- >>> YOUR TURN 1a: select just the name and onboarded_date of all vendors.


SELECT '===== LESSON 2: WHERE — filtering rows =====' AS lesson;
-- Conditions: =  !=  >  <  >=  <=   (text in 'single quotes')
SELECT * FROM vendors WHERE country = 'India';
SELECT name, tier FROM vendors WHERE tier = 'high';
-- Combine with AND / OR:
SELECT name FROM vendors WHERE country = 'USA' AND tier = 'low';
-- >>> YOUR TURN 2a: all vendors from the USA.
-- >>> YOUR TURN 2b: vendors that are tier 'medium' OR tier 'high'.


SELECT '===== LESSON 3: ORDER BY + LIMIT — sort & cap =====' AS lesson;
SELECT name, onboarded_date FROM vendors ORDER BY onboarded_date;        -- oldest first (ASC default)
SELECT name, onboarded_date FROM vendors ORDER BY onboarded_date DESC;    -- newest first
SELECT * FROM transactions ORDER BY amount DESC LIMIT 3;                  -- top 3 by amount
-- >>> YOUR TURN 3a: vendor names sorted alphabetically (A→Z).
-- >>> YOUR TURN 3b: the 2 most recent transactions (by txn_date).


SELECT '===== LESSON 4: AGGREGATES — COUNT/SUM/AVG/MIN/MAX =====' AS lesson;
SELECT COUNT(*) AS total_vendors FROM vendors;
SELECT SUM(amount) AS total_amount FROM transactions WHERE status = 'paid';
SELECT AVG(risk_score) AS avg_risk, MIN(risk_score) AS lowest, MAX(risk_score) AS highest FROM assessments;
-- >>> YOUR TURN 4a: how many transactions have status 'paid'?
-- >>> YOUR TURN 4b: the total amount of ALL transactions (any status).


SELECT '===== LESSON 5: GROUP BY (+HAVING) — per-group summaries =====' AS lesson;
-- GROUP BY collapses rows that share a value, so aggregates run PER group.
SELECT tier, COUNT(*) AS cnt FROM vendors GROUP BY tier;
SELECT status, COUNT(*) AS cnt FROM transactions GROUP BY status;
-- HAVING filters GROUPS (after aggregation). WHERE filters ROWS (before).
SELECT vendor_id, SUM(amount) AS total
FROM transactions
WHERE status = 'paid'            -- row filter FIRST
GROUP BY vendor_id
HAVING SUM(amount) > 700;        -- group filter AFTER
-- >>> YOUR TURN 5a: count of assessments per status.
-- >>> YOUR TURN 5b: vendor_id and their total PAID amount, only groups totaling > 1000.


SELECT '===== LESSON 6: JOIN — combining tables =====' AS lesson;
-- Transactions only have vendor_id (a number). JOIN pulls the vendor's name from vendors.
SELECT v.name, t.amount, t.status
FROM transactions t
JOIN vendors v ON v.id = t.vendor_id          -- match rows where ids line up
ORDER BY v.name;
-- JOIN + GROUP BY = the classic combo: paid total per vendor NAME.
SELECT v.name, SUM(t.amount) AS total_paid
FROM vendors v
JOIN transactions t ON t.vendor_id = v.id
WHERE t.status = 'paid'
GROUP BY v.id, v.name
ORDER BY total_paid DESC;
-- LEFT JOIN keeps vendors even if they have no match (NULL on the right):
SELECT v.name, a.status
FROM vendors v
LEFT JOIN assessments a ON a.vendor_id = v.id;
-- >>> YOUR TURN 6a: each assessment's vendor NAME + its risk_score.
-- >>> YOUR TURN 6b: vendors with NO assessments (hint: LEFT JOIN ... WHERE a.id IS NULL).


-- ============================================================================
-- SOLUTIONS (try first!). Uncomment one to run it.
-- 1a) SELECT name, onboarded_date FROM vendors;
-- 2a) SELECT * FROM vendors WHERE country = 'USA';
-- 2b) SELECT name FROM vendors WHERE tier = 'medium' OR tier = 'high';
-- 3a) SELECT name FROM vendors ORDER BY name;
-- 3b) SELECT * FROM transactions ORDER BY txn_date DESC LIMIT 2;
-- 4a) SELECT COUNT(*) FROM transactions WHERE status = 'paid';
-- 4b) SELECT SUM(amount) FROM transactions;
-- 5a) SELECT status, COUNT(*) FROM assessments GROUP BY status;
-- 5b) SELECT vendor_id, SUM(amount) AS total FROM transactions WHERE status='paid' GROUP BY vendor_id HAVING SUM(amount) > 1000;
-- 6a) SELECT v.name, a.risk_score FROM assessments a JOIN vendors v ON v.id = a.vendor_id;
-- 6b) SELECT v.name FROM vendors v LEFT JOIN assessments a ON a.vendor_id = v.id WHERE a.id IS NULL;
-- ============================================================================
