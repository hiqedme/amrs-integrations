CREATE TABLE IF NOT EXISTS rde_sync_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  patient_id INT,
  reporting_month VARCHAR(255),
  last_updated TIMESTAMP,
  date_created TIMESTAMP,
  status VARCHAR(255)
);

CREATE INDEX user_id_index ON rde_sync_queue (user_id);
CREATE INDEX patient_id_index ON rde_sync_queue (patient_id);
