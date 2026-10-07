-- ============================================================================
-- SQL PART 3 — modifying data (DML) + concepts.  Completes the core.
-- NOTE: this CHANGES data. Rebuild anytime:  sqlite3 practice.db < sql-seed.sql
-- Run:  sqlite3 practice.db < sql-learn-3.sql
-- ============================================================================


SELECT '===== L13: INSERT — add rows =====' AS lesson;
INSERT INTO vendors (id, name, country, tier, onboarded_date)
VALUES (7, 'Vandelay', 'USA', 'medium', '2026-06-01');
SELECT * FROM vendors WHERE id = 7;
-- You can insert multiple rows at once:
--   INSERT INTO vendors (...) VALUES (...), (...), (...);
-- >>> YOUR TURN 13a: insert a vendor id=8, 'Pied Piper', 'India', 'high', '2026-06-15'.


SELECT '===== L14: UPDATE — change rows (ALWAYS use WHERE!) =====' AS lesson;
-- Without WHERE, UPDATE changes EVERY row. The #1 SQL footgun.
UPDATE vendors SET tier = 'high' WHERE id = 7;
SELECT id, name, tier FROM vendors WHERE id = 7;
-- Update multiple columns:
--   UPDATE vendors SET tier='low', country='UK' WHERE id=7;
-- >>> YOUR TURN 14a: set vendor id=8's country to 'Singapore'.


SELECT '===== L15: DELETE — remove rows (ALWAYS use WHERE!) =====' AS lesson;
DELETE FROM vendors WHERE id = 7;
SELECT COUNT(*) AS vendors_left FROM vendors;
-- >>> YOUR TURN 15a: delete vendor id=8.


SELECT '===== L16: UNION — stack two result sets =====' AS lesson;
-- Same columns from each; UNION removes duplicates, UNION ALL keeps them.
SELECT name, 'vendor' AS kind FROM vendors WHERE tier = 'high'
UNION
SELECT name, 'vendor' AS kind FROM vendors WHERE country = 'USA';
-- >>> YOUR TURN 16a: (optional) list India vendors and UK vendors in one result.


SELECT '===== L17: HANDY EXTRAS =====' AS lesson;
-- COALESCE / IFNULL — default value when NULL:
SELECT name, COALESCE(country, 'unknown') AS country FROM vendors;
-- ROUND:
SELECT ROUND(AVG(risk_score), 1) AS avg_risk FROM assessments;
-- GROUP_CONCAT — join grouped values into a string (MySQL: GROUP_CONCAT, Postgres: STRING_AGG):
SELECT tier, GROUP_CONCAT(name, ', ') AS vendors FROM vendors GROUP BY tier;


-- ============================================================================
-- 📌 CONCEPTS TO KNOW (say these in interviews — no query needed)
--
-- INDEX: a lookup structure (B-tree) that makes WHERE/JOIN/ORDER BY fast.
--   Trade-off: faster reads, slightly slower writes + more storage.
--   "I'd add an index on the column I filter/join on most."
--
-- TRANSACTION (ACID): BEGIN ... COMMIT (or ROLLBACK). All statements succeed
--   together or none do. Essential for money (debit + credit atomically).
--   BEGIN; UPDATE a SET bal=bal-100 WHERE id=1; UPDATE a SET bal=bal+100 WHERE id=2; COMMIT;
--
-- NORMALIZATION: split data to avoid duplication (vendors separate from transactions,
--   linked by vendor_id). DENORMALIZATION: duplicate on purpose for read speed.
--
-- PRIMARY KEY: unique row id.  FOREIGN KEY: a column pointing to another table's PK.
--
-- N+1 PROBLEM: looping queries instead of one JOIN. Fix with a single JOIN / IN query.
-- ============================================================================

-- SOLUTIONS
-- 13a) INSERT INTO vendors (id,name,country,tier,onboarded_date) VALUES (8,'Pied Piper','India','high','2026-06-15');
-- 14a) UPDATE vendors SET country='Singapore' WHERE id=8;
-- 15a) DELETE FROM vendors WHERE id=8;
-- 16a) SELECT name FROM vendors WHERE country='India' UNION SELECT name FROM vendors WHERE country='UK';
