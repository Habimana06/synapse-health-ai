-- Synapse Health AI — Seed Data
-- Default password for all demo accounts: Password123!

USE synapse_health_ai;

SET @pwd = '$2a$10$WcwdqhLyd6UAVbfujotd4uHoKhqr6X7tAykLfo2uPrS1rapRVqTH6';

-- Admin
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES
  ('admin@synapse.rw', @pwd, 'admin', 'Jean', 'Mukamana', '+250788000001', 'en');

-- Doctors
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES
  ('doctor@synapse.rw', @pwd, 'doctor', 'Patrick', 'Niyonsaba', '+250788000002', 'en');

INSERT INTO hospitals (name, address, city, district, phone) VALUES
  ('King Faisal Hospital', 'KG 544 St, Kigali', 'Kigali', 'Gasabo', '+250788111111');

INSERT INTO doctor_profiles (user_id, hospital_id, license_number, specialization, years_experience) VALUES
  ((SELECT id FROM users WHERE email = 'doctor@synapse.rw'), 1, 'RMDA-DOC-001', 'General Medicine', 12);

-- Pharmacist
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES
  ('pharmacist@synapse.rw', @pwd, 'pharmacist', 'Alice', 'Uwase', '+250788000003', 'rw');

INSERT INTO pharmacist_profiles (user_id, pharmacy_id, license_number) VALUES
  ((SELECT id FROM users WHERE email = 'pharmacist@synapse.rw'), 1, 'RMDA-PHM-001');

-- Patients
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language) VALUES
  ('patient@synapse.rw', @pwd, 'patient', 'Eric', 'Habimana', '+250788000004', 'en'),
  ('patient2@synapse.rw', @pwd, 'patient', 'Marie', 'Claire', '+250788000005', 'fr');

INSERT INTO patient_profiles (user_id, date_of_birth, gender, blood_type, emergency_contact, emergency_phone) VALUES
  ((SELECT id FROM users WHERE email = 'patient@synapse.rw'), '1995-03-15', 'male', 'O+', 'Parent Habimana', '+250788999999'),
  ((SELECT id FROM users WHERE email = 'patient2@synapse.rw'), '1988-07-22', 'female', 'A+', 'Jean Claire', '+250788888888');

-- Patient health records
INSERT INTO allergies (patient_id, allergen, reaction, severity, recorded_at) VALUES
  (1, 'Penicillin', 'Skin rash', 'severe', '2020-01-10'),
  (1, 'Peanuts', 'Anaphylaxis risk', 'severe', '2018-05-20');

INSERT INTO medical_history (patient_id, condition_name, diagnosis_date, status, notes, recorded_by) VALUES
  (1, 'Hypertension', '2022-06-01', 'chronic', 'Controlled with medication', (SELECT id FROM users WHERE email = 'doctor@synapse.rw')),
  (1, 'Malaria', '2024-01-15', 'resolved', 'Treated successfully', (SELECT id FROM users WHERE email = 'doctor@synapse.rw'));

INSERT INTO lab_results (patient_id, test_name, result_value, unit, reference_range, status, test_date, ordered_by) VALUES
  (1, 'Blood Glucose Fasting', '105', 'mg/dL', '70-100', 'abnormal', '2025-12-01', (SELECT id FROM users WHERE email = 'doctor@synapse.rw')),
  (1, 'HbA1c', '5.8', '%', '4.0-5.6', 'abnormal', '2025-12-01', (SELECT id FROM users WHERE email = 'doctor@synapse.rw'));

INSERT INTO vaccinations (patient_id, vaccine_name, dose_number, administered_date, next_due_date) VALUES
  (1, 'COVID-19', 3, '2023-10-01', NULL),
  (1, 'Tetanus', 1, '2024-03-15', '2034-03-15');

-- Pharmacy inventory
INSERT INTO pharmacy_inventory (pharmacy_id, medicine_id, quantity, unit_price, last_updated_by) VALUES
  (1, 1, 500, 150.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw')),
  (1, 2, 200, 800.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw')),
  (1, 3, 150, 2500.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw')),
  (2, 1, 300, 160.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw')),
  (2, 6, 400, 300.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw')),
  (3, 1, 100, 155.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw')),
  (3, 3, 80, 2600.00, (SELECT id FROM users WHERE email = 'pharmacist@synapse.rw'));

-- Drug interactions
INSERT INTO drug_interactions (medicine_a_id, medicine_b_id, severity, description) VALUES
  (2, 6, 'moderate', 'Amoxicillin may reduce effectiveness of ibuprofen absorption when taken together.'),
  (4, 5, 'mild', 'Metformin and Amlodipine may cause mild additive blood pressure lowering effects.'),
  (2, 1, 'mild', 'No significant interaction between Amoxicillin and Paracetamol in most patients.');

-- Sample prescription
INSERT INTO prescriptions (patient_id, doctor_id, diagnosis, notes, status) VALUES
  (1, 1, 'Upper Respiratory Infection', 'Rest and hydration recommended', 'approved');

INSERT INTO prescription_items (prescription_id, medicine_id, dosage, frequency, duration, quantity, instructions) VALUES
  (1, 1, '500mg', 'Every 6 hours', '5 days', 20, 'Take after meals'),
  (1, 2, '500mg', 'Three times daily', '7 days', 21, 'Complete full course');

-- Analytics events
INSERT INTO analytics_events (event_type, event_data, region) VALUES
  ('symptom_check', '{"symptoms":["fever","cough"]}', 'Kigali'),
  ('medicine_search', '{"medicine":"Paracetamol"}', 'Kigali'),
  ('prescription_created', '{"diagnosis":"Malaria"}', 'Huye'),
  ('symptom_check', '{"symptoms":["headache"]}', 'Gasabo'),
  ('medicine_search', '{"medicine":"Amoxicillin"}', 'Nyarugenge');
