-- ==============================================================================
-- EAV GITWE TSS - STUDENT ADMISSION & REGISTRATION MANAGEMENT SYSTEM (SARMS)
-- DATABASE SCHEMA DEFINITION FOR XAMPP (MySQL / MariaDB / phpMyAdmin)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `eav_gitwe_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `eav_gitwe_db`;

-- 1. TRADES / DEPARTMENTS TABLE (Amashami 4 ya RTB)
CREATE TABLE IF NOT EXISTS `trades` (
    `code` VARCHAR(10) PRIMARY KEY, -- 'SOD', 'BCN', 'ANH', 'AGR'
    `name_rw` VARCHAR(150) NOT NULL,
    `name_en` VARCHAR(150) NOT NULL,
    `description` TEXT,
    `head_of_department` VARCHAR(100),
    `capacity_l3` INT DEFAULT 45,
    `capacity_l4` INT DEFAULT 40,
    `capacity_l5` INT DEFAULT 35,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. DORMITORY BLOCKS TABLE (Amacumbi y'Abanyeshuri)
CREATE TABLE IF NOT EXISTS `dormitories` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `total_beds` INT NOT NULL DEFAULT 100,
    `occupied_beds` INT NOT NULL DEFAULT 0,
    `warden_name` VARCHAR(100),
    `warden_phone` VARCHAR(20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. STUDENTS MASTER REGISTER (Imyirondoro y'Abanyeshuri)
CREATE TABLE IF NOT EXISTS `students` (
    `id` VARCHAR(50) PRIMARY KEY,
    `student_code` VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'EAV/2026/SOD/001'
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `dob` DATE NOT NULL,
    `national_id_or_index` VARCHAR(30) UNIQUE NOT NULL,
    `previous_school` VARCHAR(100),
    `trade_code` VARCHAR(10) NOT NULL,
    `level` ENUM('L3', 'L4', 'L5') NOT NULL,
    `boarding_type` ENUM('boarding', 'day_scholar') NOT NULL,
    `dormitory_block` VARCHAR(100),
    `room_number` VARCHAR(20),
    `bed_number` VARCHAR(20),
    `parent_name` VARCHAR(100) NOT NULL,
    `parent_phone` VARCHAR(20) NOT NULL,
    `parent_email` VARCHAR(100),
    `district` VARCHAR(50) DEFAULT 'Ruhango',
    `sector` VARCHAR(50),
    `admission_status` ENUM('pending', 'incomplete_docs', 'verified', 'admitted') DEFAULT 'pending',
    `application_date` DATE DEFAULT (CURRENT_DATE),
    `admin_notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`trade_code`) REFERENCES `trades`(`code`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. STUDENT DOCUMENTS (Ibyangombwa 5 bya Dosiye)
CREATE TABLE IF NOT EXISTS `student_documents` (
    `id` VARCHAR(50) PRIMARY KEY,
    `student_id` VARCHAR(50) NOT NULL,
    `doc_type` VARCHAR(50) NOT NULL,
    `file_name` VARCHAR(255),
    `status` ENUM('verified', 'missing', 'under_review') DEFAULT 'under_review',
    `verified_at` TIMESTAMP NULL,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. SCHOOL FEES & TRANSACTIONS (Amafaranga y'Ishuri n'Inyemezabwishyu)
CREATE TABLE IF NOT EXISTS `fee_payments` (
    `id` VARCHAR(50) PRIMARY KEY,
    `student_id` VARCHAR(50) NOT NULL,
    `receipt_number` VARCHAR(50) UNIQUE NOT NULL,
    `total_expected` DECIMAL(10,2) NOT NULL,
    `amount_paid` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NOT NULL,
    `payment_channel` VARCHAR(30) NOT NULL, -- 'momo', 'bk', 'equity', 'cash'
    `reference_slip` VARCHAR(100) NOT NULL,
    `payment_date` DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. PARENT NOTIFICATIONS LOG (Ubutumwa bwa SMS bwoherejwe)
CREATE TABLE IF NOT EXISTS `sms_notifications` (
    `id` VARCHAR(50) PRIMARY KEY,
    `student_id` VARCHAR(50) NOT NULL,
    `recipient_phone` VARCHAR(20) NOT NULL,
    `recipient_name` VARCHAR(100) NOT NULL,
    `message_type` VARCHAR(30) NOT NULL,
    `message_body` TEXT NOT NULL,
    `dispatch_status` ENUM('delivered', 'sent', 'failed') DEFAULT 'delivered',
    `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================================================
-- INITIAL SEED DATA FOR EAV GITWE TSS (XAMPP / MySQL)
-- ==============================================================================

-- Trades
INSERT IGNORE INTO `trades` (`code`, `name_rw`, `name_en`, `head_of_department`, `capacity_l3`, `capacity_l4`, `capacity_l5`) VALUES 
('SOD', 'Ikoranabuhanga rya Porogaramu', 'Software Development', 'Eng. Eric Habimana', 45, 40, 35),
('BCN', 'Ubwubatsi bw''Inzu', 'Building Construction', 'Eng. Jean Baptiste N.', 50, 45, 40),
('ANH', 'Ubuzima bw''Amatungo', 'Animal Health & Veterinary', 'Dr. Clarisse Mukandoli', 40, 35, 30),
('AGR', 'Ubuhinzi Bugezweho', 'General Agriculture', 'Agronome Alexis Mutabazi', 45, 40, 35);

-- Dormitories
INSERT IGNORE INTO `dormitories` (`id`, `name`, `gender`, `total_beds`, `occupied_beds`, `warden_name`, `warden_phone`) VALUES
('block_a', 'Block A (Intwari - Boys)', 'Male', 120, 104, 'Murenzi Alexis', '0788203040'),
('block_b', 'Block B (Ingenzi - Boys)', 'Male', 100, 82, 'Kamanzi Vedaste', '0788708090'),
('block_c', 'Block C (Indatwa - Girls)', 'Female', 120, 110, 'Matron Jeanne Mukakimenyi', '0788506070'),
('block_d', 'Block D (Inyange - Girls)', 'Female', 100, 75, 'Matron Christine Nyiranziza', '0788919293');

-- Students
INSERT IGNORE INTO `students` (`id`, `student_code`, `first_name`, `last_name`, `gender`, `dob`, `national_id_or_index`, `previous_school`, `trade_code`, `level`, `boarding_type`, `dormitory_block`, `room_number`, `bed_number`, `parent_name`, `parent_phone`, `parent_email`, `district`, `sector`, `admission_status`) VALUES
('std_001', 'EAV/2026/SOD/001', 'Kevin', 'Mugisha', 'Male', '2008-04-12', '1200880193821092', 'GS Gitwe Protestant', 'SOD', 'L3', 'boarding', 'Block A (Boys)', 'Room 102', 'Bed A-04', 'Emmanuel Hakizimana', '0788451290', 'hakiza.e@gmail.com', 'Ruhango', 'Bweramana', 'admitted'),
('std_002', 'EAV/2026/SOD/002', 'Diane', 'Uwase', 'Female', '2007-09-23', '1200770144910214', 'ES Nyanza', 'SOD', 'L3', 'boarding', 'Block C (Girls)', 'Room 204', 'Bed C-11', 'Marie Claire Mukamana', '0783112244', NULL, 'Nyanza', 'Busasamana', 'admitted'),
('std_003', 'EAV/2026/ANH/001', 'Jean Paul', 'Niyonkuru', 'Male', '2006-11-05', '1200680188921104', 'GS Karambi', 'ANH', 'L4', 'boarding', 'Block B (Boys)', 'Room 105', 'Bed B-08', 'Celestin Karemera', '0788654321', NULL, 'Ruhango', 'Kinihira', 'verified'),
('std_004', 'EAV/2026/BCN/001', 'Sandrine', 'Ingabire', 'Female', '2008-01-18', '1200870199201145', 'GS Ruhango Catholique', 'BCN', 'L3', 'boarding', 'Block C (Girls)', 'Room 201', 'Bed C-03', 'Francoise Mukarwego', '0782998877', NULL, 'Ruhango', 'Ruhango', 'incomplete_docs'),
('std_005', 'EAV/2026/AGR/001', 'Patrick', 'Ganza', 'Male', '2007-06-30', '1200780165432091', 'GS Munini', 'AGR', 'L3', 'day_scholar', NULL, NULL, NULL, 'Vedaste Nsengimana', '0785123987', NULL, 'Ruhango', 'Bweramana', 'admitted');

-- Payments
INSERT IGNORE INTO `fee_payments` (`id`, `student_id`, `receipt_number`, `total_expected`, `amount_paid`, `balance`, `payment_channel`, `reference_slip`, `payment_date`) VALUES
('pay_001', 'std_001', 'REC-2026-081', 145000.00, 145000.00, 0.00, 'bk', 'BK_Slip_Registration_145k', '2026-10-14'),
('pay_002', 'std_002', 'REC-2026-094', 145000.00, 100000.00, 45000.00, 'momo', 'MoMo_Payment_100k', '2026-10-15');
