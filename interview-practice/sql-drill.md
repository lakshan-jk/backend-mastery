# SQL Drill — for the Certa Coderbyte OA (FDE is data-heavy)
Covers the patterns that show up: WHERE, JOIN, GROUP BY, aggregates, HAVING, ORDER BY/LIMIT, LEFT JOIN, subqueries.

## Setup
```bash
cd ~/backend-mastery/interview-practice
sqlite3 practice.db < sql-seed.sql     # build the DB
sqlite3 practice.db                     # interactive — type queries, end with ;
# (or one-off)  sqlite3 practice.db "SELECT * FROM vendors;"
```
Schema: `vendors(id,name,country,tier,onboarded_date)` · `assessments(id,vendor_id,status,risk_score,submitted_date)` · `transactions(id,vendor_id,amount,status,txn_date)`

---

## Questions (write the query yourself, then check Solutions)
1. All vendors in India.
2. Count of vendors by tier (tier, count).
3. Total transaction amount per vendor **counting only 'paid'** — show vendor name + total.
4. Average risk_score per vendor, only vendors whose average is **above 50** (name + avg).
5. Top 3 vendors by total **paid** amount (name + total), highest first.
6. Vendors with **no assessments** at all (name).
7. Count of assessments by status.
8. Vendors onboarded in **2026** who have at least one **rejected or pending** assessment (distinct names).

---

## Solutions (peek only after trying)

<details><summary>1</summary>

```sql
SELECT * FROM vendors WHERE country = 'India';
```
</details>

<details><summary>2</summary>

```sql
SELECT tier, COUNT(*) AS cnt FROM vendors GROUP BY tier;
```
</details>

<details><summary>3</summary>

```sql
SELECT v.name, SUM(t.amount) AS total
FROM vendors v
JOIN transactions t ON t.vendor_id = v.id
WHERE t.status = 'paid'
GROUP BY v.id, v.name;
```
</details>

<details><summary>4</summary>

```sql
SELECT v.name, AVG(a.risk_score) AS avg_risk
FROM vendors v
JOIN assessments a ON a.vendor_id = v.id
GROUP BY v.id, v.name
HAVING AVG(a.risk_score) > 50;
```
*(WHERE filters rows before grouping; HAVING filters groups after aggregation — key distinction.)*
</details>

<details><summary>5</summary>

```sql
SELECT v.name, SUM(t.amount) AS total
FROM vendors v
JOIN transactions t ON t.vendor_id = v.id
WHERE t.status = 'paid'
GROUP BY v.id, v.name
ORDER BY total DESC
LIMIT 3;
```
</details>

<details><summary>6</summary>

```sql
-- LEFT JOIN + NULL check
SELECT v.name
FROM vendors v
LEFT JOIN assessments a ON a.vendor_id = v.id
WHERE a.id IS NULL;

-- or: SELECT name FROM vendors WHERE id NOT IN (SELECT vendor_id FROM assessments);
```
</details>

<details><summary>7</summary>

```sql
SELECT status, COUNT(*) AS cnt FROM assessments GROUP BY status;
```
</details>

<details><summary>8</summary>

```sql
SELECT DISTINCT v.name
FROM vendors v
JOIN assessments a ON a.vendor_id = v.id
WHERE v.onboarded_date >= '2026-01-01'
  AND a.status IN ('rejected', 'pending');
```
</details>

---

## The 5 things interviewers check in SQL
1. **JOIN** correctly (ON the right keys) — and know LEFT vs INNER.
2. **GROUP BY** every non-aggregated selected column.
3. **WHERE vs HAVING** — WHERE before grouping, HAVING after.
4. **Aggregates** — COUNT, SUM, AVG, MIN, MAX.
5. **ORDER BY + LIMIT** for "top N".
