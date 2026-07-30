-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 28, 2026 at 02:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `safe_track_ai_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accident_reports`
--

CREATE TABLE `accident_reports` (
  `accident_id` int(11) NOT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `accident_time` datetime NOT NULL,
  `severity` enum('Low','Medium','High','Fatal') DEFAULT 'Low',
  `injury_count` int(11) DEFAULT 0,
  `death_count` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `status` enum('Pending','Investigating','Closed') DEFAULT 'Pending',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `buses`
--

CREATE TABLE `buses` (
  `bus_id` int(11) NOT NULL,
  `registration_number` varchar(20) NOT NULL,
  `bus_number` varchar(30) NOT NULL,
  `service_type` enum('Public Service','Semi Luxury','Luxury','Express','Intercity','Highway','School Service','Staff Service','Tourist') NOT NULL DEFAULT 'Public Service',
  `depot` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `chassis_number` varchar(50) DEFAULT NULL,
  `engine_number` varchar(50) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `standing_capacity` int(11) NOT NULL DEFAULT 0,
  `fuel_type` enum('Diesel','Petrol','Electric','Hybrid','CNG') DEFAULT NULL,
  `manufacture_year` year(4) DEFAULT NULL,
  `status` enum('Active','Maintenance','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `registration_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`bus_id`, `registration_number`, `bus_number`, `service_type`, `depot`, `model`, `chassis_number`, `engine_number`, `capacity`, `standing_capacity`, `fuel_type`, `manufacture_year`, `status`, `created_at`, `registration_date`) VALUES
(1, 'NB-4587', 'SLTB-001', 'Public Service', 'SLTB Main Depot - Batticaloa', 'Ashok Leyland', 'CH8976576', 'ENG854796253', 54, 0, 'Diesel', '2022', 'Active', '2026-07-16 19:34:06', NULL),
(2, 'NP NS-78', 'SLTB-45', 'Public Service', 'SLTB Main Depot - Jaffna', 'Ashok Leyland', 'CHS4578962541', 'ENG458967162', 52, 20, 'Diesel', '2026', 'Active', '2026-07-21 16:22:46', NULL),
(13, 'ND-1234', 'SLTB-011', 'Public Service', 'Colombo Central Depot', 'Ashok Leyland Viking', 'CHS-SLTB-011', 'ENG-SLTB-011', 54, 20, 'Diesel', '2015', 'Active', '2026-07-25 20:32:40', NULL),
(14, 'NA-5678', 'SLTB-012', 'Semi Luxury', 'Kandy Depot', 'Tata Marcopolo', 'CHS-SLTB-012', 'ENG-SLTB-012', 49, 15, 'Diesel', '2017', 'Active', '2026-07-25 20:32:40', NULL),
(15, 'NC-9012', 'SLTB-013', 'Express', 'Galle Depot', 'Ashok Leyland Lynx', 'CHS-SLTB-013', 'ENG-SLTB-013', 52, 18, 'Diesel', '2019', 'Maintenance', '2026-07-25 20:32:40', NULL),
(16, 'ND-3456', 'SLTB-014', 'Intercity', 'Jaffna Depot', 'Tata LPO', 'CHS-SLTB-014', 'ENG-SLTB-014', 48, 12, 'Diesel', '2020', 'Active', '2026-07-25 20:32:40', NULL),
(17, 'NB-7890', 'SLTB-015', 'Luxury', 'Trincomalee Depot', 'Yutong ZK', 'CHS-SLTB-015', 'ENG-SLTB-015', 45, 5, 'Diesel', '2021', 'Inactive', '2026-07-25 20:32:40', NULL),
(18, 'NE-2468', 'SLTB-016', 'Highway', 'Maharagama Depot', 'Volvo B9R', 'CHS-SLTB-016', 'ENG-SLTB-016', 44, 0, 'Diesel', '2022', 'Active', '2026-07-25 20:32:40', NULL),
(19, 'NC-1357', 'SLTB-017', 'School Service', 'Kurunegala Depot', 'Tata Starbus', 'CHS-SLTB-017', 'ENG-SLTB-017', 55, 20, 'CNG', '2018', 'Active', '2026-07-25 20:32:40', NULL),
(20, 'ND-8642', 'SLTB-018', 'Staff Service', 'Anuradhapura Depot', 'Ashok Leyland Falcon', 'CHS-SLTB-018', 'ENG-SLTB-018', 50, 15, 'Hybrid', '2023', 'Maintenance', '2026-07-25 20:32:40', NULL),
(21, 'NB-9753', 'SLTB-019', 'Tourist', 'Negombo Depot', 'King Long XMQ', 'CHS-SLTB-019', 'ENG-SLTB-019', 42, 0, 'Petrol', '2016', 'Inactive', '2026-07-25 20:32:40', NULL),
(22, 'NE-4321', 'SLTB-020', 'Public Service', 'Batticaloa Depot', 'BYD Electric Bus', 'CHS-SLTB-020', 'ENG-SLTB-020', 46, 18, 'Electric', '2024', 'Active', '2026-07-25 20:32:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bus_alerts`
--

CREATE TABLE `bus_alerts` (
  `bus_alert_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
  `sensor_data_id` int(11) DEFAULT NULL,
  `alert_type` enum('Forward Collision','Human Detection','Animal Detection','Headlight Reminder') NOT NULL,
  `severity` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `alert_message` varchar(255) NOT NULL,
  `distance_cm` decimal(6,2) DEFAULT NULL,
  `status` enum('Pending','Acknowledged','Resolved') DEFAULT 'Pending',
  `alert_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bus_assignments`
--

CREATE TABLE `bus_assignments` (
  `assignment_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `assigned_date` date NOT NULL,
  `status` enum('Active','Completed','Cancelled') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_assignments`
--

INSERT INTO `bus_assignments` (`assignment_id`, `bus_id`, `driver_id`, `route_id`, `assigned_date`, `status`, `created_at`) VALUES
(1, 1, 1, 1, '2026-07-23', 'Active', '2026-07-16 19:34:06'),
(2, 2, 2, 2, '2026-07-22', 'Cancelled', '2026-07-21 16:22:46'),
(3, 2, 2, 2, '2026-07-23', 'Active', '2026-07-22 15:16:40');

-- --------------------------------------------------------

--
-- Table structure for table `bus_devices`
--

CREATE TABLE `bus_devices` (
  `bus_device_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `installation_location` varchar(100) DEFAULT NULL,
  `installed_date` date DEFAULT NULL,
  `status` enum('Active','Inactive','Removed') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_devices`
--

INSERT INTO `bus_devices` (`bus_device_id`, `bus_id`, `device_id`, `installation_location`, `installed_date`, `status`, `created_at`) VALUES
(1, 1, 1, 'Front Dashboard', '2026-07-17', 'Active', '2026-07-16 19:34:06');

-- --------------------------------------------------------

--
-- Table structure for table `device_registry`
--

CREATE TABLE `device_registry` (
  `device_id` int(11) NOT NULL,
  `device_code` varchar(50) NOT NULL,
  `device_name` varchar(100) NOT NULL,
  `device_type` enum('Bus Unit','Roadside Unit') NOT NULL,
  `mac_address` varchar(50) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `firmware_version` varchar(30) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `last_seen` datetime DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT 0,
  `status` enum('Active','Inactive','Maintenance') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `device_registry`
--

INSERT INTO `device_registry` (`device_id`, `device_code`, `device_name`, `device_type`, `mac_address`, `ip_address`, `firmware_version`, `installation_date`, `last_seen`, `is_online`, `status`, `created_at`) VALUES
(1, 'BUS001', 'ESP32 Bus Unit 01', 'Bus Unit', 'AA:BB:CC:11:22:33', NULL, '1.0.0', '2026-07-17', NULL, 0, 'Active', '2026-07-16 19:34:06'),
(2, 'RS001', 'ESP32 Roadside Unit 01', 'Roadside Unit', 'AA:BB:CC:44:55:66', NULL, '1.0.0', '2026-07-17', NULL, 0, 'Active', '2026-07-16 19:34:06');

-- --------------------------------------------------------

--
-- Table structure for table `drivers`
--

CREATE TABLE `drivers` (
  `driver_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `license_number` varchar(50) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternative_phone_number` varchar(20) DEFAULT NULL,
  `email_address` varchar(100) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `join_date` date DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`driver_id`, `full_name`, `date_of_birth`, `gender`, `address`, `profile_picture`, `license_number`, `issue_date`, `expiry_date`, `nic`, `phone`, `alternative_phone_number`, `email_address`, `experience_years`, `join_date`, `status`, `created_at`) VALUES
(1, 'Mohamed Ismail', '1990-05-12', 'Male', 'No. 25, Main Street, Batticaloa', 'uploads/drivers/driver_2217211c00bb411db0ab5ee09ef1086f_1784808342.png', 'B1234567', '2018-06-15', '2028-06-14', '902345678V', '0777896555', '0771234568', 'wsrd@gmail.com', 8, '2018-07-01', 'Active', '2026-07-16 19:34:06'),
(2, 'Kamal Perera', '1988-09-25', 'Male', 'No. 102, Central Road, Kandy', NULL, 'B7654321', '2016-08-20', '2026-08-19', '199512345678', '0771122334', '0771122335', 'kamal.perera@sltb.lk', 5, '2019-01-15', 'Active', '2026-07-21 21:51:15'),
(3, 'Ruwan Silva', '1987-04-18', 'Male', 'Kurunegala', NULL, 'B9876543', '2015-05-10', '2025-05-09', '870108765V', '0773456789', '0713456789', 'ruwan.silva@sltb.lk', 10, '2017-02-01', 'Active', '2026-07-22 20:51:56'),
(4, 'Saman Kumara', '1992-11-07', 'Male', 'Matale', NULL, 'B4567891', '2019-03-20', '2029-03-19', '921110987V', '0774567891', '0714567891', 'saman.kumara@sltb.lk', 6, '2020-05-10', 'Active', '2026-07-22 20:51:56'),
(5, 'Nimal Fernando', '1985-01-30', 'Male', 'Galle', NULL, 'B8529637', '2014-09-12', '2024-09-11', '850304567V', '0775678912', '0715678912', 'nimal.fernando@sltb.lk', 12, '2015-06-01', 'Active', '2026-07-22 20:51:56'),
(6, 'Arun Madhushan', '1994-08-16', 'Male', 'Jaffna', NULL, 'B9513578', '2020-01-15', '2030-01-14', '942298765V', '0776789123', '0716789123', 'arun.madhushan@sltb.lk', 4, '2021-01-20', 'Active', '2026-07-22 20:51:56'),
(7, 'Dinesh Wijesinghe', '1989-12-11', 'Male', 'Colombo', NULL, 'B7412589', '2017-11-05', '2027-11-04', '892345678V', '0777891234', '0717891234', 'dinesh.wijesinghe@sltb.lk', 8, '2018-08-15', 'Active', '2026-07-22 20:51:56'),
(8, 'Kasun Jayawardena', '1988-03-15', 'Male', 'No.45, Galle Road, Colombo', NULL, 'B10000001', '2020-01-10', '2027-01-10', '881234001V', '0779000001', '0719000001', 'kasun.jayawardena1@sltb.lk', 12, '2014-01-15', 'Active', '2026-07-25 20:35:11'),
(9, 'Nimal Perera', '1985-07-22', 'Male', 'No.18, Peradeniya Road, Kandy', NULL, 'B10000002', '2019-02-15', '2027-02-15', '851234002V', '0779000002', '0719000002', 'nimal.perera1@sltb.lk', 15, '2012-02-10', 'Active', '2026-07-25 20:35:11'),
(10, 'Saman Kumara', '1990-11-05', 'Male', 'No.72, Matara Road, Galle', NULL, 'B10000003', '2021-03-20', '2028-03-20', '901234003V', '0779000003', '0719000003', 'saman.kumara1@sltb.lk', 9, '2017-03-05', 'Active', '2026-07-25 20:35:11'),
(11, 'Dinesh Fernando', '1987-04-18', 'Male', 'Main Street, Negombo', NULL, 'B10000004', '2018-04-12', '2026-04-12', '871234004V', '0779000004', '0719000004', 'dinesh.fernando1@sltb.lk', 13, '2013-04-12', 'Inactive', '2026-07-25 20:35:11'),
(12, 'Pradeep Silva', '1992-09-30', 'Male', 'Temple Road, Kurunegala', NULL, 'B10000005', '2022-05-18', '2029-05-18', '921234005V', '0779000005', '0719000005', 'pradeep.silva1@sltb.lk', 7, '2019-05-18', 'Active', '2026-07-25 20:35:11'),
(13, 'Chamara Wijesinghe', '1989-12-12', 'Male', 'Lake Road, Anuradhapura', NULL, 'B10000006', '2020-06-01', '2027-06-01', '891234006V', '0779000006', '0719000006', 'chamara.wijesinghe1@sltb.lk', 11, '2015-06-01', 'Active', '2026-07-25 20:35:11'),
(14, 'Aruni Fernando', '1994-06-25', 'Female', 'Hospital Road, Jaffna', NULL, 'B10000007', '2023-06-20', '2030-06-20', '941234007V', '0779000007', '0719000007', 'aruni.fernando1@sltb.lk', 5, '2021-06-20', 'Active', '2026-07-25 20:35:11'),
(15, 'Gayan Perera', '1986-01-08', 'Male', 'Beach Road, Trincomalee', NULL, 'B10000008', '2017-07-02', '2025-07-02', '861234008V', '0779000008', '0719000008', 'gayan.perera1@sltb.lk', 14, '2011-07-02', 'Inactive', '2026-07-25 20:35:11'),
(16, 'Nuwani Silva', '1996-08-17', 'Female', 'Station Road, Batticaloa', NULL, 'B10000009', '2023-07-15', '2030-07-15', '961234009V', '0779000009', '0719000009', 'nuwani.silva1@sltb.lk', 4, '2022-07-15', 'Active', '2026-07-25 20:35:11'),
(17, 'Supun Bandara', '1991-02-14', 'Male', 'New Town, Polonnaruwa', NULL, 'B10000010', '2021-08-05', '2028-08-05', '911234010V', '0779000010', '0719000010', 'supun.bandara1@sltb.lk', 8, '2018-08-05', 'Inactive', '2026-07-25 20:35:11');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `notification_type` enum('Bus Alert','Roadside Alert','Accident','System') NOT NULL,
  `priority` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `related_type` enum('BusAlert','RoadsideAlert','Accident','System') DEFAULT NULL,
  `related_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_recipients`
--

CREATE TABLE `notification_recipients` (
  `recipient_id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `officer_id` int(11) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `token`, `expires_at`, `used`, `created_at`) VALUES
(1, 4, 'E_k3yXhdZbnjBu5FZHGdmv1S-R3vYxP8r9SKTGk9XkA', '2026-07-16 22:04:29', 1, '2026-07-16 16:04:29'),
(2, 4, 'aI5MbQ9ekIiEg_89C-Vfe2cc8QNdHh8pFLXW0JrvUiE', '2026-07-16 22:06:10', 1, '2026-07-16 16:06:10'),
(3, 4, '7n3jscgisRWrbt4hvG6fvpGYNpoVwfFTYjXSFYPc3aw', '2026-07-16 22:07:10', 1, '2026-07-16 16:07:10'),
(4, 4, 'zXtmkESjaMX2gnJ0a1iHzDQKXNLSDg9gcnxm8RP46Jo', '2026-07-16 22:11:08', 1, '2026-07-16 16:11:08'),
(5, 4, 'e3GNlvlYeyDGN59oglyBmoTXqsFRVuwpk4h9LL_jHRE', '2026-07-16 22:13:35', 1, '2026-07-16 16:13:35'),
(6, 4, 'TDn6fF88377sasEU2UYcy_fqKzZuJIpHMqpFPeHpUVI', '2026-07-16 22:50:42', 1, '2026-07-16 16:50:42'),
(7, 4, 'pK3uIS7DR-iCZ5vwj1GOIYBw4uX4MuKcCMfpEvAMnfA', '2026-07-25 19:34:13', 1, '2026-07-25 13:34:13');

-- --------------------------------------------------------

--
-- Table structure for table `police_officers`
--

CREATE TABLE `police_officers` (
  `officer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `badge_number` varchar(50) NOT NULL,
  `rank` varchar(50) DEFAULT NULL,
  `police_station` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `joined_date` date DEFAULT NULL,
  `device_token` text DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT 0,
  `last_active` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `police_officers`
--

INSERT INTO `police_officers` (`officer_id`, `user_id`, `full_name`, `badge_number`, `rank`, `police_station`, `phone`, `joined_date`, `device_token`, `is_online`, `last_active`) VALUES
(1, 2, 'Nimal Perera', 'TP001', 'Inspector', 'Batticaloa Traffic Division', '0711234567', '2022-01-15', NULL, 1, NULL),
(2, 3, 'Kasun Silva', 'TP002', 'Sergeant', 'Batticaloa Traffic Division', '0779876543', '2023-03-20', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roadside_alerts`
--

CREATE TABLE `roadside_alerts` (
  `roadside_alert_id` int(11) NOT NULL,
  `roadside_unit_id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `sensor_data_id` int(11) DEFAULT NULL,
  `alert_type` enum('Unsafe U-Turn','Vehicle Detected','Traffic Warning') NOT NULL,
  `severity` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `alert_message` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Acknowledged','Resolved') DEFAULT 'Pending',
  `alert_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roadside_units`
--

CREATE TABLE `roadside_units` (
  `roadside_unit_id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `location_name` varchar(150) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `status` enum('Active','Inactive','Maintenance') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roadside_units`
--

INSERT INTO `roadside_units` (`roadside_unit_id`, `device_id`, `route_id`, `location_name`, `latitude`, `longitude`, `installation_date`, `status`, `created_at`) VALUES
(1, 2, 1, '18 Bend U-Turn', 7.71025000, 81.69242000, '2026-07-17', 'Active', '2026-07-16 19:34:06');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `description`, `created_at`) VALUES
(1, 'Police Admin', 'System Administrator - Police Department', '2026-07-16 19:32:33'),
(2, 'Traffic Police Officer', 'Traffic Police Mobile User', '2026-07-16 19:32:33'),
(3, 'SLTB Admin', 'SLTB Management User', '2026-07-16 19:32:33');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `route_id` int(11) NOT NULL,
  `route_number` varchar(20) NOT NULL,
  `route_name` varchar(150) NOT NULL,
  `start_location` varchar(100) NOT NULL,
  `end_location` varchar(100) NOT NULL,
  `distance_km` decimal(6,2) DEFAULT NULL,
  `estimated_duration` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`route_id`, `route_number`, `route_name`, `start_location`, `end_location`, `distance_km`, `estimated_duration`, `status`, `created_at`) VALUES
(1, '101', 'Batticaloa - Colombo', 'Batticaloa', 'Colombo', 330.50, 420, 'Active', '2026-07-16 19:34:06'),
(2, '102', 'Jaffna- Akkaraipathu', 'Jaffna', 'Akkaraipathu', 210.29, 300, 'Active', '2026-07-16 19:34:06'),
(3, '103', 'Batticaloa - Trincomalee', 'Batticaloa', 'Trincomalee', 115.00, 150, 'Active', '2026-07-16 19:34:06'),
(4, '105', 'Colombo to Kandy', 'Colombo', 'Kandy', 116.50, 210, 'Active', '2026-07-25 19:55:09'),
(5, '106', 'Colombo to Galle', 'Colombo', 'Galle', 126.00, 150, 'Active', '2026-07-25 19:55:09'),
(6, '112', 'Kandy to Matale', 'Kandy', 'Matale', 42.80, 75, 'Active', '2026-07-25 19:55:09'),
(7, '120', 'Negombo to Kurunegala', 'Negombo', 'Kurunegala', 102.40, 160, 'Active', '2026-07-25 19:55:09'),
(8, '138', 'Jaffna to Point Pedro', 'Jaffna', 'Point Pedro', 31.20, 55, 'Active', '2026-07-25 19:55:09'),
(9, '154', 'Colombo to Trincomalee', 'Colombo', 'Trincomalee', 244.30, 360, 'Active', '2026-07-25 19:55:09'),
(10, '176', 'Galle to Matara', 'Galle', 'Matara', 45.60, 70, 'Inactive', '2026-07-25 19:55:09'),
(11, '201', 'Batticaloa to Kalmunai', 'Batticaloa', 'Kalmunai', 41.50, 65, 'Active', '2026-07-25 19:55:09'),
(12, '225', 'Anuradhapura to Polonnaruwa', 'Anuradhapura', 'Polonnaruwa', 104.20, 145, 'Inactive', '2026-07-25 19:55:09'),
(13, '245', 'Kurunegala to Colombo', 'Kurunegala', 'Colombo', 98.70, 170, 'Active', '2026-07-25 19:55:09');

-- --------------------------------------------------------

--
-- Table structure for table `sensor_data`
--

CREATE TABLE `sensor_data` (
  `sensor_data_id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `roadside_unit_id` int(11) DEFAULT NULL,
  `pir_status` tinyint(1) DEFAULT NULL,
  `ldr_status` tinyint(1) DEFAULT NULL,
  `front_distance` decimal(6,2) DEFAULT NULL,
  `right_distance` decimal(6,2) DEFAULT NULL,
  `left_distance` decimal(6,2) DEFAULT NULL,
  `red_led_status` tinyint(1) DEFAULT 0,
  `green_led_status` tinyint(1) DEFAULT 0,
  `buzzer_status` tinyint(1) DEFAULT 0,
  `device_timestamp` datetime DEFAULT NULL,
  `recorded_at` datetime DEFAULT current_timestamp(),
  `front_approach_speed_kmh` decimal(6,2) DEFAULT NULL,
  `right_approach_speed_kmh` decimal(6,2) DEFAULT NULL,
  `left_approach_speed_kmh` decimal(6,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sensor_data`
--

INSERT INTO `sensor_data` (`sensor_data_id`, `device_id`, `bus_id`, `roadside_unit_id`, `pir_status`, `ldr_status`, `front_distance`, `right_distance`, `left_distance`, `red_led_status`, `green_led_status`, `buzzer_status`, `device_timestamp`, `recorded_at`, `front_approach_speed_kmh`, `right_approach_speed_kmh`, `left_approach_speed_kmh`) VALUES
(1, 1, 1, NULL, 1, 0, 18.50, NULL, NULL, 1, 0, 1, NULL, '2026-07-17 01:04:06', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sltb_users`
--

CREATE TABLE `sltb_users` (
  `sltb_user_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `joined_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sltb_users`
--

INSERT INTO `sltb_users` (`sltb_user_id`, `user_id`, `full_name`, `employee_id`, `department`, `designation`, `phone`, `joined_date`) VALUES
(1, 4, 'Fathima Rifka', 'SLTB001', 'Operations', 'Fleet Manager', '0754567890', '2021-08-10');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_name` varchar(100) NOT NULL,
  `setting_value` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_id`, `setting_name`, `setting_value`, `description`, `updated_at`) VALUES
(1, 'Forward Collision Distance', '20 cm', 'Alert when an object is detected within 20 cm in front of the bus', '2026-07-16 19:32:33'),
(2, 'Left U-Turn Safe Distance', '40 cm', 'Minimum safe distance for vehicles approaching from the left at a U-turn', '2026-07-16 19:32:33'),
(3, 'Right U-Turn Safe Distance', '40 cm', 'Minimum safe distance for vehicles approaching from the right at a U-turn', '2026-07-16 19:32:33'),
(4, 'Human or Animal Detection', 'Motion Detected', 'Buzzer alert when PIR sensor detects human or animal movement', '2026-07-16 19:32:33'),
(5, 'Headlight Threshold', 'Light Detected', 'LED Light reminder when low light conditions require headlights', '2026-07-16 19:32:33'),
(6, 'Notification Priority', 'High', 'Default priority level for generated system alerts', '2026-07-16 19:32:33'),
(7, 'Sensor Log Interval', '5', 'Normal sensor data save interval in seconds', '2026-07-16 19:32:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `theme_preference` enum('light','dark','system') DEFAULT 'light'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `username`, `email`, `password`, `profile_image`, `status`, `created_at`, `updated_at`, `theme_preference`) VALUES
(1, 1, 'policeadmin', 'policeadmin@safetrackai.com', '$2b$12$FP58qQIe3vrB.DtMKgEZFejlU1ilKl1mvC1iZO28jTuEIcUvEx5Iq', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-23 18:31:01', 'dark'),
(2, 2, 'officer001', 'officer001@safetrackai.com', '$2b$12$Nasrorq.iXDuCRYAzINWuOM0BGUwuxBqgdUHAH4dBbzk1F9fdIRge', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-23 18:31:01', 'dark'),
(3, 2, 'officer002', 'officer002@safetrackai.com', '$2b$12$OPDMAjvBGc1hg1v/.rpbU.qunpjIV/6KG2yKdAG8dyhH.nxbXQnei', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-23 18:31:01', 'dark'),
(4, 3, 'sltbadmin', 'sltbsafetrack.ai@gmail.com', '$2b$12$xJ/Q./HzGzrS5N1k4GPG9unRg0oYhz0NFqmHAs8CncGWjIAo3IznK', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-25 13:36:02', 'light');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity_logs`
--

CREATE TABLE `user_activity_logs` (
  `activity_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity` varchar(255) NOT NULL,
  `activity_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_activity_logs`
--

INSERT INTO `user_activity_logs` (`activity_id`, `user_id`, `activity`, `activity_time`) VALUES
(1, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 20:51:06'),
(2, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 21:01:47'),
(3, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 21:03:54'),
(4, 4, 'Requested password reset token', '2026-07-16 21:07:31'),
(5, 4, 'Requested password reset link', '2026-07-16 21:34:29'),
(6, 4, 'Successfully updated account password', '2026-07-16 21:35:06'),
(7, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 21:36:00'),
(8, 4, 'Requested password reset link', '2026-07-16 21:36:10'),
(9, 4, 'Successfully updated account password', '2026-07-16 21:36:13'),
(10, 4, 'Requested password reset link', '2026-07-16 21:37:10'),
(11, 4, 'Requested password reset link', '2026-07-16 21:41:08'),
(12, 4, 'Successfully updated account password', '2026-07-16 21:43:11'),
(13, 4, 'Requested password reset link', '2026-07-16 21:43:35'),
(14, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 21:44:18'),
(15, 4, 'Requested password reset link', '2026-07-16 22:20:42'),
(16, 4, 'Successfully updated account password', '2026-07-16 22:21:16'),
(17, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 22:21:31'),
(18, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 22:30:26'),
(19, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 22:32:05'),
(20, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-16 22:34:08'),
(21, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-20 09:17:27'),
(22, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-21 20:16:19'),
(23, 4, 'New bus SLTB-45 was registered and assigned to route 2.', '2026-07-21 21:52:46'),
(24, 4, 'Bus SLTB-001 details and route/driver assignment were updated.', '2026-07-21 22:06:13'),
(25, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-22 18:23:12'),
(26, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-22 20:31:39'),
(27, 4, 'Route 102 was deactivated. Status changed from Active to Inactive.', '2026-07-22 20:44:56'),
(28, 4, 'Updated route 102 (Jaffna- Akkaraipathu).', '2026-07-22 20:45:52'),
(29, 4, 'Bus SLTB-45 details and route/driver assignment were updated.', '2026-07-22 20:46:40'),
(30, 4, 'Bus SLTB-001 details and route/driver assignment were updated.', '2026-07-22 20:47:04'),
(31, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-23 13:45:59'),
(32, 4, 'Updated driver details for \'Mohamed Ismail\' (ID: 1).', '2026-07-23 17:34:06'),
(33, 4, 'Updated driver details for \'Mohamed Ismail\' (ID: 1).', '2026-07-23 17:35:42'),
(34, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-23 20:44:16'),
(35, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-24 20:21:12'),
(36, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-25 18:44:43'),
(37, 4, 'Requested password reset link', '2026-07-25 19:04:13'),
(38, 4, 'Successfully updated account password', '2026-07-25 19:06:02'),
(39, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-25 21:43:52'),
(40, 4, 'SLTB Admin profile updated for \'Fathima Rifka\'.', '2026-07-25 21:45:18'),
(41, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-28 12:26:44');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` datetime DEFAULT current_timestamp(),
  `logout_time` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `device_info` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`session_id`, `user_id`, `login_time`, `logout_time`, `ip_address`, `device_info`) VALUES
(1, 4, '2026-07-16 20:51:06', NULL, NULL, NULL),
(2, 4, '2026-07-16 21:01:47', '2026-07-16 21:03:46', NULL, NULL),
(3, 4, '2026-07-16 21:03:54', '2026-07-16 21:36:38', NULL, NULL),
(4, 4, '2026-07-16 21:36:00', NULL, NULL, NULL),
(5, 4, '2026-07-16 21:44:18', '2026-07-16 22:18:05', NULL, NULL),
(6, 4, '2026-07-16 22:21:31', '2026-07-16 22:30:13', NULL, NULL),
(7, 4, '2026-07-16 22:30:26', NULL, NULL, NULL),
(8, 4, '2026-07-16 22:32:05', NULL, NULL, NULL),
(9, 4, '2026-07-16 22:34:08', NULL, NULL, NULL),
(10, 4, '2026-07-20 09:17:27', NULL, NULL, NULL),
(11, 4, '2026-07-21 20:16:19', NULL, NULL, NULL),
(12, 4, '2026-07-22 18:23:12', NULL, NULL, NULL),
(13, 4, '2026-07-22 20:31:39', NULL, NULL, NULL),
(14, 4, '2026-07-23 13:45:59', NULL, NULL, NULL),
(15, 4, '2026-07-23 20:44:16', NULL, NULL, NULL),
(16, 4, '2026-07-24 20:21:12', NULL, NULL, NULL),
(17, 4, '2026-07-25 18:44:43', NULL, NULL, NULL),
(18, 4, '2026-07-25 21:43:52', NULL, NULL, NULL),
(19, 4, '2026-07-28 12:26:44', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accident_reports`
--
ALTER TABLE `accident_reports`
  ADD PRIMARY KEY (`accident_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `buses`
--
ALTER TABLE `buses`
  ADD PRIMARY KEY (`bus_id`),
  ADD UNIQUE KEY `registration_number` (`registration_number`),
  ADD UNIQUE KEY `bus_number` (`bus_number`),
  ADD UNIQUE KEY `chassis_number` (`chassis_number`),
  ADD UNIQUE KEY `engine_number` (`engine_number`);

--
-- Indexes for table `bus_alerts`
--
ALTER TABLE `bus_alerts`
  ADD PRIMARY KEY (`bus_alert_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `device_id` (`device_id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `sensor_data_id` (`sensor_data_id`);

--
-- Indexes for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assignment_bus` (`bus_id`),
  ADD KEY `fk_assignment_driver` (`driver_id`),
  ADD KEY `fk_assignment_route` (`route_id`);

--
-- Indexes for table `bus_devices`
--
ALTER TABLE `bus_devices`
  ADD PRIMARY KEY (`bus_device_id`),
  ADD KEY `fk_bus_device_bus` (`bus_id`),
  ADD KEY `fk_bus_device_device` (`device_id`);

--
-- Indexes for table `device_registry`
--
ALTER TABLE `device_registry`
  ADD PRIMARY KEY (`device_id`),
  ADD UNIQUE KEY `device_code` (`device_code`),
  ADD UNIQUE KEY `mac_address` (`mac_address`);

--
-- Indexes for table `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`driver_id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD UNIQUE KEY `nic` (`nic`),
  ADD UNIQUE KEY `email_address` (`email_address`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  ADD PRIMARY KEY (`recipient_id`),
  ADD KEY `notification_id` (`notification_id`),
  ADD KEY `officer_id` (`officer_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `police_officers`
--
ALTER TABLE `police_officers`
  ADD PRIMARY KEY (`officer_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `badge_number` (`badge_number`);

--
-- Indexes for table `roadside_alerts`
--
ALTER TABLE `roadside_alerts`
  ADD PRIMARY KEY (`roadside_alert_id`),
  ADD KEY `roadside_unit_id` (`roadside_unit_id`),
  ADD KEY `device_id` (`device_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `sensor_data_id` (`sensor_data_id`);

--
-- Indexes for table `roadside_units`
--
ALTER TABLE `roadside_units`
  ADD PRIMARY KEY (`roadside_unit_id`),
  ADD KEY `fk_roadside_device` (`device_id`),
  ADD KEY `fk_roadside_route` (`route_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`route_id`),
  ADD UNIQUE KEY `route_number` (`route_number`);

--
-- Indexes for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD PRIMARY KEY (`sensor_data_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `roadside_unit_id` (`roadside_unit_id`),
  ADD KEY `idx_sensor_device_time` (`device_id`,`device_timestamp`);

--
-- Indexes for table `sltb_users`
--
ALTER TABLE `sltb_users`
  ADD PRIMARY KEY (`sltb_user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `setting_name` (`setting_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_user_role` (`role_id`);

--
-- Indexes for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accident_reports`
--
ALTER TABLE `accident_reports`
  MODIFY `accident_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `buses`
--
ALTER TABLE `buses`
  MODIFY `bus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `bus_alerts`
--
ALTER TABLE `bus_alerts`
  MODIFY `bus_alert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bus_devices`
--
ALTER TABLE `bus_devices`
  MODIFY `bus_device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `device_registry`
--
ALTER TABLE `device_registry`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  MODIFY `recipient_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `police_officers`
--
ALTER TABLE `police_officers`
  MODIFY `officer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roadside_alerts`
--
ALTER TABLE `roadside_alerts`
  MODIFY `roadside_alert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roadside_units`
--
ALTER TABLE `roadside_units`
  MODIFY `roadside_unit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `sensor_data`
--
ALTER TABLE `sensor_data`
  MODIFY `sensor_data_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `sltb_users`
--
ALTER TABLE `sltb_users`
  MODIFY `sltb_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accident_reports`
--
ALTER TABLE `accident_reports`
  ADD CONSTRAINT `accident_reports_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `accident_reports_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `accident_reports_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `accident_reports_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bus_alerts`
--
ALTER TABLE `bus_alerts`
  ADD CONSTRAINT `bus_alerts_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bus_alerts_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `device_registry` (`device_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `bus_alerts_ibfk_3` FOREIGN KEY (`assignment_id`) REFERENCES `bus_assignments` (`assignment_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bus_alerts_ibfk_4` FOREIGN KEY (`sensor_data_id`) REFERENCES `sensor_data` (`sensor_data_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  ADD CONSTRAINT `fk_assignment_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON UPDATE CASCADE;

--
-- Constraints for table `bus_devices`
--
ALTER TABLE `bus_devices`
  ADD CONSTRAINT `fk_bus_device_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bus_device_device` FOREIGN KEY (`device_id`) REFERENCES `device_registry` (`device_id`) ON UPDATE CASCADE;

--
-- Constraints for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  ADD CONSTRAINT `notification_recipients_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`notification_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notification_recipients_ibfk_2` FOREIGN KEY (`officer_id`) REFERENCES `police_officers` (`officer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `police_officers`
--
ALTER TABLE `police_officers`
  ADD CONSTRAINT `police_officers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `roadside_alerts`
--
ALTER TABLE `roadside_alerts`
  ADD CONSTRAINT `roadside_alerts_ibfk_1` FOREIGN KEY (`roadside_unit_id`) REFERENCES `roadside_units` (`roadside_unit_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `roadside_alerts_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `device_registry` (`device_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `roadside_alerts_ibfk_3` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `roadside_alerts_ibfk_4` FOREIGN KEY (`sensor_data_id`) REFERENCES `sensor_data` (`sensor_data_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `roadside_units`
--
ALTER TABLE `roadside_units`
  ADD CONSTRAINT `fk_roadside_device` FOREIGN KEY (`device_id`) REFERENCES `device_registry` (`device_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_roadside_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD CONSTRAINT `sensor_data_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `device_registry` (`device_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `sensor_data_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sensor_data_ibfk_3` FOREIGN KEY (`roadside_unit_id`) REFERENCES `roadside_units` (`roadside_unit_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sltb_users`
--
ALTER TABLE `sltb_users`
  ADD CONSTRAINT `sltb_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE;

--
-- Constraints for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  ADD CONSTRAINT `user_activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
