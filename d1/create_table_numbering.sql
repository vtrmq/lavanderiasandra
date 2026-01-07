CREATE TABLE numbering (
  numeration_id INTEGER PRIMARY KEY AUTOINCREMENT,
  laundry_id INTEGER UNIQUE NOT NULL,
  invoice_number INTEGER
);
