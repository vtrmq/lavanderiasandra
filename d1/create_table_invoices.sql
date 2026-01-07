CREATE TABLE invoices (
  invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
  laundry_id INTEGER DEFAULT 0,
  admin_id INTEGER DEFAULT 0,
  user_id INTEGER DEFAULT 0,
  invoice_number INTEGER,
  items TEXT NOT NULL,
  garment_number INTEGER,
  price INTEGER,
  pay INTEGER DEFAULT 0,
  visible TEXT DEFAULT 'S' CHECK(visible IN ('S','N')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
