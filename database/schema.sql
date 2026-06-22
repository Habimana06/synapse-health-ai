-- Synapse Health AI — MySQL Database Schema
-- Version: 1.0.0 (Step 1 Foundation)

CREATE DATABASE IF NOT EXISTS synapse_health_ai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE synapse_health_ai;

-- ============================================================
-- USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('patient', 'doctor', 'pharmacist', 'admin') NOT NULL DEFAULT 'patient',
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20),
  language      ENUM('en', 'rw', 'fr') NOT NULL DEFAULT 'en',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_email (email)
);

-- ============================================================
-- HOSPITALS & PHARMACIES
-- ============================================================

CREATE TABLE hospitals (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  address     TEXT NOT NULL,
  city        VARCHAR(100) NOT NULL,
  district    VARCHAR(100),
  phone       VARCHAR(20),
  email       VARCHAR(255),
  latitude    DECIMAL(10, 8),
  longitude   DECIMAL(11, 8),
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE pharmacies (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  address       TEXT NOT NULL,
  city          VARCHAR(100) NOT NULL DEFAULT 'Kigali',
  district      VARCHAR(100),
  phone         VARCHAR(20),
  email         VARCHAR(255),
  latitude      DECIMAL(10, 8),
  longitude     DECIMAL(11, 8),
  opening_hours JSON,
  is_partner    TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pharmacies_city (city),
  INDEX idx_pharmacies_partner (is_partner)
);

-- ============================================================
-- ROLE PROFILES
-- ============================================================

CREATE TABLE patient_profiles (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  date_of_birth   DATE,
  gender          ENUM('male', 'female', 'other'),
  blood_type      ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  emergency_contact VARCHAR(255),
  emergency_phone   VARCHAR(20),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE doctor_profiles (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  hospital_id     INT UNSIGNED,
  license_number  VARCHAR(100) NOT NULL,
  specialization  VARCHAR(255),
  years_experience INT UNSIGNED DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
);

CREATE TABLE pharmacist_profiles (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL UNIQUE,
  pharmacy_id     INT UNSIGNED,
  license_number  VARCHAR(100) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE SET NULL
);

-- ============================================================
-- MEDICINES & INVENTORY
-- ============================================================

CREATE TABLE medicines (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  generic_name    VARCHAR(255),
  category        VARCHAR(100),
  description     TEXT,
  dosage_form     VARCHAR(100),
  strength        VARCHAR(50),
  manufacturer    VARCHAR(255),
  requires_prescription TINYINT(1) NOT NULL DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_medicines_name (name),
  INDEX idx_medicines_category (category)
);

CREATE TABLE pharmacy_inventory (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pharmacy_id     INT UNSIGNED NOT NULL,
  medicine_id     INT UNSIGNED NOT NULL,
  quantity        INT UNSIGNED NOT NULL DEFAULT 0,
  unit_price      DECIMAL(10, 2),
  last_updated_by INT UNSIGNED,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (last_updated_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uk_pharmacy_medicine (pharmacy_id, medicine_id),
  INDEX idx_inventory_medicine (medicine_id)
);

CREATE TABLE drug_interactions (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  medicine_a_id     INT UNSIGNED NOT NULL,
  medicine_b_id     INT UNSIGNED NOT NULL,
  severity          ENUM('mild', 'moderate', 'severe', 'contraindicated') NOT NULL,
  description       TEXT NOT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_a_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_b_id) REFERENCES medicines(id) ON DELETE CASCADE,
  UNIQUE KEY uk_drug_pair (medicine_a_id, medicine_b_id)
);

-- ============================================================
-- PATIENT HEALTH RECORDS
-- ============================================================

CREATE TABLE allergies (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED NOT NULL,
  allergen        VARCHAR(255) NOT NULL,
  reaction        TEXT,
  severity        ENUM('mild', 'moderate', 'severe') DEFAULT 'moderate',
  recorded_at     DATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
  INDEX idx_allergies_patient (patient_id)
);

CREATE TABLE medical_history (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED NOT NULL,
  condition_name  VARCHAR(255) NOT NULL,
  diagnosis_date  DATE,
  status          ENUM('active', 'resolved', 'chronic') DEFAULT 'active',
  notes           TEXT,
  recorded_by     INT UNSIGNED,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_history_patient (patient_id)
);

CREATE TABLE lab_results (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED NOT NULL,
  test_name       VARCHAR(255) NOT NULL,
  result_value    VARCHAR(255),
  unit            VARCHAR(50),
  reference_range VARCHAR(100),
  status          ENUM('normal', 'abnormal', 'critical') DEFAULT 'normal',
  test_date       DATE NOT NULL,
  notes           TEXT,
  ordered_by      INT UNSIGNED,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (ordered_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_lab_patient (patient_id)
);

CREATE TABLE vaccinations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED NOT NULL,
  vaccine_name    VARCHAR(255) NOT NULL,
  dose_number     TINYINT UNSIGNED DEFAULT 1,
  administered_date DATE NOT NULL,
  next_due_date   DATE,
  administered_by INT UNSIGNED,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (administered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- PRESCRIPTIONS & CLINICAL
-- ============================================================

CREATE TABLE prescriptions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED NOT NULL,
  doctor_id       INT UNSIGNED NOT NULL,
  diagnosis       VARCHAR(255) NOT NULL,
  notes           TEXT,
  status          ENUM('pending', 'approved', 'dispensed', 'cancelled') DEFAULT 'pending',
  prescribed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at      DATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id) ON DELETE CASCADE,
  INDEX idx_prescriptions_patient (patient_id),
  INDEX idx_prescriptions_doctor (doctor_id),
  INDEX idx_prescriptions_status (status)
);

CREATE TABLE prescription_items (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prescription_id INT UNSIGNED NOT NULL,
  medicine_id     INT UNSIGNED NOT NULL,
  dosage          VARCHAR(100) NOT NULL,
  frequency       VARCHAR(100) NOT NULL,
  duration        VARCHAR(100),
  quantity        INT UNSIGNED,
  instructions    TEXT,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- ============================================================
-- AI & ANALYTICS
-- ============================================================

CREATE TABLE symptom_assessments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED,
  user_id         INT UNSIGNED NOT NULL,
  symptoms        JSON NOT NULL,
  age             TINYINT UNSIGNED,
  gender          ENUM('male', 'female', 'other'),
  existing_conditions TEXT,
  ai_suggestions  JSON,
  disclaimer_accepted TINYINT(1) NOT NULL DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE health_risk_assessments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_id      INT UNSIGNED NOT NULL,
  risk_type       ENUM('diabetes', 'hypertension', 'heart_disease', 'kidney_disease') NOT NULL,
  risk_score      DECIMAL(5, 2) NOT NULL,
  risk_level      ENUM('low', 'moderate', 'high', 'critical') NOT NULL,
  factors         JSON,
  recommendations TEXT,
  assessed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
  INDEX idx_risk_patient (patient_id)
);

CREATE TABLE chat_messages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  role            ENUM('user', 'assistant') NOT NULL,
  content         TEXT NOT NULL,
  language        ENUM('en', 'rw', 'fr') NOT NULL DEFAULT 'en',
  session_id      VARCHAR(64) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_chat_session (session_id),
  INDEX idx_chat_user (user_id)
);

CREATE TABLE analytics_events (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_type      VARCHAR(100) NOT NULL,
  event_data      JSON,
  user_id         INT UNSIGNED,
  region          VARCHAR(100),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_analytics_type (event_type),
  INDEX idx_analytics_created (created_at)
);

-- ============================================================
-- SEED DATA — Common medicines (Rwanda context)
-- ============================================================

INSERT INTO medicines (name, generic_name, category, dosage_form, strength, requires_prescription) VALUES
  ('Paracetamol', 'Acetaminophen', 'Analgesic', 'Tablet', '500mg', 0),
  ('Amoxicillin', 'Amoxicillin', 'Antibiotic', 'Capsule', '500mg', 1),
  ('Artemether/Lumefantrine', 'Coartem', 'Antimalarial', 'Tablet', '20/120mg', 1),
  ('Metformin', 'Metformin', 'Antidiabetic', 'Tablet', '500mg', 1),
  ('Amlodipine', 'Amlodipine', 'Antihypertensive', 'Tablet', '5mg', 1),
  ('Ibuprofen', 'Ibuprofen', 'NSAID', 'Tablet', '400mg', 0),
  ('Omeprazole', 'Omeprazole', 'PPI', 'Capsule', '20mg', 1),
  ('Cetirizine', 'Cetirizine', 'Antihistamine', 'Tablet', '10mg', 0);

INSERT INTO pharmacies (name, address, city, district, phone, latitude, longitude, is_partner, opening_hours) VALUES
  ('Kigali Health Pharmacy', 'KN 4 Ave, Kigali', 'Kigali', 'Nyarugenge', '+250788123456', -1.9403, 29.8739, 1, '{"mon-fri": "8:00-20:00", "sat": "8:00-18:00", "sun": "9:00-14:00"}'),
  ('Remera MedPlus', 'KG 11 Ave, Remera', 'Kigali', 'Gasabo', '+250788234567', -1.9536, 30.1044, 1, '{"mon-fri": "7:30-21:00", "sat": "8:00-19:00", "sun": "closed"}'),
  ('Huye Community Pharmacy', 'NR1 Road, Huye', 'Huye', 'Huye', '+250788345678', -2.5967, 29.7389, 1, '{"mon-fri": "8:00-18:00", "sat": "8:00-16:00", "sun": "closed"}');
