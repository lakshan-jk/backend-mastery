-- SQL drill seed — FDE / TPRM-flavored schema (vendors, assessments, transactions)
-- Build the DB:   sqlite3 practice.db < sql-seed.sql
-- Then query:     sqlite3 practice.db   (interactive)  OR  sqlite3 practice.db "YOUR QUERY;"

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS assessments;
DROP TABLE IF EXISTS vendors;

CREATE TABLE vendors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  tier TEXT NOT NULL,            -- 'high' | 'medium' | 'low'
  onboarded_date TEXT NOT NULL  -- YYYY-MM-DD
);

CREATE TABLE assessments (
  id INTEGER PRIMARY KEY,
  vendor_id INTEGER NOT NULL,
  status TEXT NOT NULL,          -- 'approved' | 'pending' | 'rejected'
  risk_score INTEGER NOT NULL,   -- 0..100
  submitted_date TEXT NOT NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  vendor_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,          -- 'paid' | 'pending' | 'failed'
  txn_date TEXT NOT NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

INSERT INTO vendors (id, name, country, tier, onboarded_date) VALUES
  (1, 'Acme Corp',   'USA',   'high',   '2026-01-15'),
  (2, 'Globex',      'India', 'medium', '2026-02-20'),
  (3, 'Initech',     'USA',   'low',    '2025-11-05'),
  (4, 'Umbrella',    'UK',    'high',   '2026-03-10'),
  (5, 'Soylent',     'India', 'medium', '2026-04-01'),
  (6, 'Hooli',       'USA',   'low',    '2026-05-12');  -- Hooli has no assessments

INSERT INTO assessments (id, vendor_id, status, risk_score, submitted_date) VALUES
  (1, 1, 'approved', 30, '2026-01-20'),
  (2, 1, 'approved', 25, '2026-06-20'),
  (3, 2, 'pending',  60, '2026-02-25'),
  (4, 3, 'approved', 15, '2025-11-10'),
  (5, 4, 'rejected', 85, '2026-03-15'),
  (6, 4, 'pending',  70, '2026-07-01'),
  (7, 5, 'approved', 45, '2026-04-10');

INSERT INTO transactions (id, vendor_id, amount, status, txn_date) VALUES
  (1, 1, 1000.00, 'paid',    '2026-02-01'),
  (2, 1,  500.50, 'paid',    '2026-03-01'),
  (3, 2,  250.00, 'pending', '2026-03-05'),
  (4, 2,  750.00, 'paid',    '2026-04-05'),
  (5, 3,  100.00, 'failed',  '2026-02-10'),
  (6, 4, 2000.00, 'paid',    '2026-04-01'),
  (7, 4,  300.00, 'paid',    '2026-05-01'),
  (8, 5,  125.00, 'paid',    '2026-05-15');
