-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Sep 05, 2026 at 08:53 PM
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
(1, 'NB-4587', 'SLTB-001', 'Luxury', 'SLTB Main Depot - Batticaloa', 'Ashok Leyland', 'CH8976576', 'ENG854796253', 54, 0, 'Diesel', '2022', 'Active', '2026-07-16 19:34:06', NULL),
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
  `alert_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_alerts`
--

INSERT INTO `bus_alerts` (`bus_alert_id`, `bus_id`, `device_id`, `assignment_id`, `sensor_data_id`, `alert_time`) VALUES
(1, 1, 1, 1, 1, '2026-09-05 16:09:23'),
(2, 1, 1, 1, 1, '2026-09-05 15:54:23'),
(3, 1, 1, 1, 1, '2026-09-05 15:19:23'),
(4, 1, 1, 1, 1, '2026-09-05 14:19:23'),
(8, 1, 1, NULL, NULL, '2026-09-05 11:03:01'),
(9, 1, 1, NULL, NULL, '2026-09-05 11:03:13'),
(10, 1, 1, NULL, NULL, '2026-09-05 11:05:10'),
(11, 1, 1, NULL, NULL, '2026-09-05 11:14:00'),
(12, 1, 1, NULL, NULL, '2026-09-05 11:20:45'),
(13, 1, 1, NULL, NULL, '2026-09-05 13:00:48'),
(14, 1, 1, NULL, NULL, '2026-09-05 13:00:56'),
(15, 1, 1, NULL, NULL, '2026-09-05 13:04:05'),
(16, 1, 1, NULL, NULL, '2026-09-05 13:05:08'),
(17, 1, 1, NULL, NULL, '2026-09-05 13:13:16'),
(18, 1, 1, NULL, NULL, '2026-09-05 13:22:04');

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
(1, 1, 1, 1, '2026-08-13', 'Active', '2026-07-16 19:34:06'),
(2, 2, 2, 2, '2026-07-22', 'Cancelled', '2026-07-21 16:22:46'),
(3, 2, 2, 2, '2026-07-23', 'Active', '2026-07-22 15:16:40');

-- --------------------------------------------------------

--
-- Table structure for table `bus_assignment_history`
--

CREATE TABLE `bus_assignment_history` (
  `assignment_history_id` int(11) NOT NULL,
  `bus_id` int(11) NOT NULL,
  `driver_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime DEFAULT NULL,
  `assigned_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bus_assignment_history`
--

INSERT INTO `bus_assignment_history` (`assignment_history_id`, `bus_id`, `driver_id`, `route_id`, `start_datetime`, `end_datetime`, `assigned_by`) VALUES
(16, 13, 8, 1, '2026-07-23 05:30:00', '2026-07-23 18:30:00', 4),
(17, 14, 9, 2, '2026-07-23 06:00:00', '2026-07-23 19:00:00', 4),
(18, 15, 10, 3, '2026-07-23 06:30:00', '2026-07-23 18:30:00', 4),
(19, 16, 11, 4, '2026-07-23 07:00:00', '2026-07-23 20:00:00', 4),
(20, 17, 12, 5, '2026-07-23 07:30:00', '2026-07-23 19:30:00', 4),
(21, 18, 13, 6, '2026-07-23 08:00:00', '2026-07-23 20:00:00', 4),
(22, 19, 14, 7, '2026-07-23 08:30:00', '2026-07-23 21:00:00', 4),
(23, 20, 15, 8, '2026-07-23 09:00:00', '2026-07-23 21:30:00', 4),
(24, 21, 16, 9, '2026-07-23 09:30:00', '2026-07-23 22:00:00', 4),
(25, 22, 17, 10, '2026-07-23 10:00:00', NULL, 4);

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
(1, 1, 1, 'Front Dashboard', '2026-07-17', 'Inactive', '2026-07-16 19:34:06'),
(2, 2, 4, 'Rear Window', '2026-08-11', 'Active', '2026-09-05 04:08:31'),
(3, 2, 6, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 04:12:25'),
(4, 2, 8, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 04:12:53'),
(5, 2, 10, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 04:15:30'),
(6, 14, 11, 'Back Side Door', '2026-09-05', 'Active', '2026-09-05 04:20:37'),
(7, 2, 13, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 04:39:23'),
(8, 2, 15, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 05:02:37'),
(9, 2, 17, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 05:05:48'),
(10, 2, 19, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 05:08:37'),
(11, 2, 21, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 05:33:13'),
(12, 2, 23, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 05:44:01'),
(13, 2, 25, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 05:50:46'),
(14, 2, 27, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 07:30:57'),
(15, 2, 29, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 07:35:08'),
(16, 2, 31, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 07:43:17'),
(17, 2, 33, 'Driver Dashboard Left', '2026-07-25', 'Active', '2026-09-05 07:52:04');

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
(1, 'BUS001', 'ESP32 Bus Unit 01', 'Bus Unit', 'AA:BB:CC:11:22:33', NULL, '1.0.0', '2026-07-17', NULL, 0, 'Inactive', '2026-07-16 19:34:06'),
(2, 'RS001', 'ESP32 Roadside Unit 01', 'Roadside Unit', 'AA:BB:CC:44:55:66', NULL, '1.0.0', '2026-07-17', NULL, 0, 'Active', '2026-07-16 19:34:06'),
(3, 'TEST-RSU-4358C9', 'Updated Test RSU Camera', 'Roadside Unit', '02:4F:DF:84:40:44', '192.168.1.151', 'v1.0.1', '2026-08-01', NULL, 0, 'Inactive', '2026-09-05 04:08:31'),
(4, 'TEST-BUS-A703BB', 'Updated Test Bus Unit Telematics', 'Bus Unit', '02:AC:69:29:62:05', '10.0.0.51', 'v2.1.0', '2026-08-10', NULL, 1, 'Active', '2026-09-05 04:08:31'),
(5, 'RSU-TEST-48F188', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:73:90:85:9B', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 04:12:24'),
(6, 'BUS-TEST-63E2A9', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:E3:AE:E8:F2', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 04:12:25'),
(7, 'RSU-TEST-DE61D3', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:AE:BD:11:45', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 04:12:53'),
(8, 'BUS-TEST-EB1F41', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:DC:1E:6C:B7', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 04:12:53'),
(9, 'RSU-TEST-887E3C', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:2D:36:9A:85', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 04:15:30'),
(10, 'BUS-TEST-7C74A8', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:92:65:54:AA', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 04:15:30'),
(11, 'DEV-BUS-124', 'Back bus unit ', 'Bus Unit', '450.25.02.201.3', '10.100.12.01', 'v3.5.4', '2026-01-05', NULL, 0, 'Active', '2026-09-05 04:20:37'),
(12, 'RSU-TEST-AF29F3', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:34:66:47:88', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 04:39:23'),
(13, 'BUS-TEST-B03600', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:32:BA:50:52', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 04:39:23'),
(14, 'RSU-TEST-E96818', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:74:0F:19:A5', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 05:02:37'),
(15, 'BUS-TEST-50E7E3', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:ED:47:C1:25', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 05:02:37'),
(16, 'RSU-TEST-D0B750', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:8F:08:91:E9', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 05:05:48'),
(17, 'BUS-TEST-0CD693', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:80:30:23:D4', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 05:05:48'),
(18, 'RSU-TEST-D58969', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:A7:D5:9A:DC', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 05:08:36'),
(19, 'BUS-TEST-A78D23', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:01:04:31:08', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 05:08:37'),
(20, 'RSU-TEST-5678FA', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:B1:8B:28:86', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 05:33:13'),
(21, 'BUS-TEST-CE699A', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:0F:30:A5:4A', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 05:33:13'),
(22, 'RSU-TEST-3309D9', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:54:3A:5D:0C', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 05:44:01'),
(23, 'BUS-TEST-A255C0', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:8E:45:C6:05', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 05:44:01'),
(24, 'RSU-TEST-0F55E0', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:5F:F8:4E:FB', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 05:50:46'),
(25, 'BUS-TEST-0C8135', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:59:78:EE:3E', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 05:50:46'),
(26, 'RSU-TEST-7DE364', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:28:90:A3:F1', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 07:30:56'),
(27, 'BUS-TEST-FDC7B7', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:3F:1D:5B:C7', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 07:30:57'),
(28, 'RSU-TEST-C44CD7', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:7B:5B:28:BD', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 07:35:08'),
(29, 'BUS-TEST-BFF829', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:02:9F:BB:71', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 07:35:08'),
(30, 'RSU-TEST-DA1E55', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:BE:0E:BD:4F', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 07:43:17'),
(31, 'BUS-TEST-BC0B74', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:40:C4:3E:64', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 07:43:17'),
(32, 'RSU-TEST-B42A6B', 'Highway Junction Unit 12 - Upgraded', 'Roadside Unit', '00:1A:12:C4:3E:3B', '192.168.10.21', 'v1.5.0', '2026-06-15', NULL, 0, 'Inactive', '2026-09-05 07:52:04'),
(33, 'BUS-TEST-4E42BF', 'Express Bus Cabin Sensor - Reassigned', 'Bus Unit', '00:1B:B0:45:76:90', '10.20.1.89', 'v3.1.0', '2026-07-20', NULL, 1, 'Active', '2026-09-05 07:52:04');

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
(17, 'Supun Bandara', '1991-02-14', 'Male', 'New Town, Polonnaruwa', NULL, 'B10000010', '2021-08-05', '2028-08-05', '911234010V', '0779000010', '0719000010', 'supun.bandara1@sltb.lk', 8, '2018-08-05', 'Inactive', '2026-07-25 20:35:11'),
(18, 'Kumar', '1999-12-04', 'Male', 'ajdcoiybc@gmail.com', NULL, '569655', '1899-12-04', '2000-05-06', '184651', '078965412', '215602495', 'hsbcuybcuyv@gmail.com', 14, '2026-04-12', 'Active', '2026-07-31 00:38:02');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` varchar(500) NOT NULL,
  `priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  `bus_alert_id` int(11) DEFAULT NULL,
  `roadside_alert_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `title`, `message`, `priority`, `bus_alert_id`, `roadside_alert_id`, `created_at`) VALUES
(2, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 8, NULL, '2026-09-05 11:03:01'),
(3, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 9, NULL, '2026-09-05 11:03:13'),
(4, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 10, NULL, '2026-09-05 11:05:10'),
(5, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 11, NULL, '2026-09-05 11:14:00'),
(6, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 12, NULL, '2026-09-05 11:20:45'),
(7, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 13, NULL, '2026-09-05 13:00:48'),
(8, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 14, NULL, '2026-09-05 13:00:56'),
(9, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 15, NULL, '2026-09-05 13:04:05'),
(10, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 16, NULL, '2026-09-05 13:05:08'),
(11, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 17, NULL, '2026-09-05 13:13:16'),
(12, 'Forward Object Collision Warning', 'Proximity violation detected by ultrasound sensors.', 'High', 18, NULL, '2026-09-05 13:22:04');

-- --------------------------------------------------------

--
-- Table structure for table `notification_recipients`
--

CREATE TABLE `notification_recipients` (
  `recipient_id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `officer_id` int(11) NOT NULL,
  `sent_at` datetime DEFAULT current_timestamp()
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
(7, 4, 'pK3uIS7DR-iCZ5vwj1GOIYBw4uX4MuKcCMfpEvAMnfA', '2026-07-25 19:34:13', 1, '2026-07-25 13:34:13'),
(8, 4, 'Sg0E3oySRPKbKCc02T65h4G0YIGDDMyHBLpbmO5quWk', '2026-07-28 20:40:23', 1, '2026-07-28 14:40:23'),
(9, 4, 's0Q-lt8v4IzNEsGLOdVA_SLUKr_y44Knx4nwLVxjALo', '2026-08-04 15:01:17', 1, '2026-08-04 09:01:17'),
(10, 4, 'zGDe0RWiGlqpr1080GS1ZxsCa581eiP2AC08UjG_Qpg', '2026-08-13 16:10:55', 0, '2026-08-13 10:10:55'),
(11, 9, 'dQIhk2zXEK-IU35OqPthjc6WzXsjwEHdq7208fNvtUc', '2026-09-04 20:27:14', 0, '2026-09-04 14:27:14');

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
(2, 3, 'Kasun Silva', 'TP002', 'Sergeant', 'Batticaloa Traffic Division', '0779876543', '2023-03-20', NULL, 1, '2026-08-02 09:11:49'),
(4, 7, 'Kumar Dharmasena', '123654', 'Sergeant', 'Colombo', '764589321', '2026-07-31', '••••••••A9F4', 0, NULL),
(5, 8, 'Pinky Harsha', '789654', '', 'System', '0764513012', NULL, '', 0, NULL),
(6, 1, 'police', 'PO001', 'Police Admin', 'Police Headquarters', '775489654', '2026-07-17', NULL, 0, NULL);

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
  `alert_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roadside_alerts`
--

INSERT INTO `roadside_alerts` (`roadside_alert_id`, `roadside_unit_id`, `device_id`, `route_id`, `sensor_data_id`, `alert_time`) VALUES
(2, 1, 1, 1, 1, '2026-09-05 16:15:01'),
(3, 1, 1, 1, 1, '2026-09-05 15:50:01'),
(4, 1, 1, 1, 1, '2026-09-05 15:20:01'),
(5, 1, 1, 1, 1, '2026-09-05 13:20:01');

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
  `pir_detection_status` enum('Safe','Detected') DEFAULT NULL,
  `pir_buzzer_status` tinyint(1) DEFAULT NULL,
  `ldr_detection_status` enum('Safe','Detected') DEFAULT NULL,
  `ldr_led_status` tinyint(1) DEFAULT NULL,
  `front_distance_cm` decimal(7,2) DEFAULT NULL,
  `front_risk_percentage` decimal(5,2) DEFAULT NULL,
  `front_risk_level` enum('Low','Medium','High') DEFAULT NULL,
  `front_led_status` tinyint(1) DEFAULT NULL,
  `front_detection_status` enum('Safe','Detected') DEFAULT NULL,
  `right_distance_cm` decimal(7,2) DEFAULT NULL,
  `right_risk_percentage` decimal(5,2) DEFAULT NULL,
  `right_risk_level` enum('Low','Medium','High') DEFAULT NULL,
  `right_led_status` tinyint(1) DEFAULT NULL,
  `right_detection_status` enum('Safe','Detected') DEFAULT NULL,
  `left_distance_cm` decimal(7,2) DEFAULT NULL,
  `left_risk_percentage` decimal(5,2) DEFAULT NULL,
  `left_risk_level` enum('Low','Medium','High') DEFAULT NULL,
  `left_led_status` tinyint(1) DEFAULT NULL,
  `left_detection_status` enum('Safe','Detected') DEFAULT NULL,
  `device_timestamp` datetime DEFAULT NULL,
  `recorded_at` datetime DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `sensor_data`
--

INSERT INTO `sensor_data` (`sensor_data_id`, `device_id`, `bus_id`, `roadside_unit_id`, `pir_detection_status`, `pir_buzzer_status`, `ldr_detection_status`, `ldr_led_status`, `front_distance_cm`, `front_risk_percentage`, `front_risk_level`, `front_led_status`, `front_detection_status`, `right_distance_cm`, `right_risk_percentage`, `right_risk_level`, `right_led_status`, `right_detection_status`, `left_distance_cm`, `left_risk_percentage`, `left_risk_level`, `left_led_status`, `left_detection_status`, `device_timestamp`, `recorded_at`) VALUES
(1, 1, 1, NULL, 'Detected', 1, 'Safe', NULL, 18.50, NULL, NULL, 1, 'Detected', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-17 01:04:06');

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
(1, 4, 'FathimaRifka', 'SLTB001', NULL, NULL, NULL, '2021-08-10'),
(3, 9, 'Fathi Abiya manal', '12436', 'System', 'Sub-Inspector', '0764852123', '2026-09-04');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_name` varchar(100) NOT NULL,
  `setting_value` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`setting_id`, `setting_name`, `setting_value`, `description`, `updated_by`, `updated_at`) VALUES
(1, 'Forward Collision Distance', '20 cm', 'Alert when an object is detected within 20 cm in front of the bus', NULL, '2026-07-16 19:32:33'),
(2, 'Left U-Turn Safe Distance', '40 cm', 'Minimum safe distance for vehicles approaching from the left at a U-turn', NULL, '2026-07-16 19:32:33'),
(3, 'Right U-Turn Safe Distance', '40 cm', 'Minimum safe distance for vehicles approaching from the right at a U-turn', NULL, '2026-07-16 19:32:33'),
(4, 'Human or Animal Detection', 'Motion Detected', 'Buzzer alert when PIR sensor detects human or animal movement', NULL, '2026-07-16 19:32:33'),
(5, 'Headlight Threshold', 'Light Detected', 'LED Light reminder when low light conditions require headlights', NULL, '2026-07-16 19:32:33'),
(6, 'Notification Priority', 'High', 'Default priority level for generated system alerts', NULL, '2026-07-16 19:32:33'),
(7, 'Sensor Log Interval', '5', 'Normal sensor data save interval in seconds', NULL, '2026-07-16 19:32:33');

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
(1, 1, 'police', 'mohammed@gmail.com', '$2b$12$IsQOEWx5051tNRIiGL0vEeLMNd3g7eIeUkKzZeToSbmr.BjZnmVD2', 'uploads/profiles/profile_300ddeac36c249bab49d61bd3692165a_1788409208.png', 'Active', '2026-07-16 19:34:06', '2026-09-02 23:55:27', 'light'),
(3, 2, 'officer002', 'naaifaissadeen@gmail.com', '$2b$12$OPDMAjvBGc1hg1v/.rpbU.qunpjIV/6KG2yKdAG8dyhH.nxbXQnei', NULL, 'Active', '2026-07-16 19:34:06', '2026-08-02 19:09:00', 'dark'),
(4, 3, 'sltbadmin', 'sltbsafetrack.ai@gmail.com', '$2b$12$pZYBf6sXM.uDTmsOrhWUNON4M.JKbskvEoqY1nwGTnagwjtCTBw8e', NULL, 'Active', '2026-07-16 19:34:06', '2026-09-02 23:12:04', 'light'),
(7, 1, 'Kumar Dharmsena', 'kumar@gmail.com', '$2b$12$zTQ51WTJIQCdu0vvKQtBC.AJQKbqRfQW7AwNfmjPOSfzdyuNQk10e', NULL, 'Active', '2026-07-31 14:17:34', '2026-07-31 14:18:19', 'light'),
(8, 1, 'Pincky', 'pinky@gmail.com', '$2b$12$uCLEBCctfASaBQyuXAz3.Okk/ls6z56wL4J1ZoAsy6eJ9UYkV0KAS', NULL, 'Active', '2026-09-02 23:26:27', '2026-09-02 23:56:00', 'light'),
(9, 3, 'Abiya manal', 'abiyaaboo@gmail.com', '$2b$12$21QTWpidepMpvfgqZxPefOq/kV/0HGZEOS0RkMG2596YXWUPRCEA6', NULL, 'Active', '2026-09-04 14:24:32', '2026-09-04 14:25:16', 'dark');

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
(41, 4, 'User logged in to SLTB Admin Dashboard', '2026-07-28 12:26:44'),
(42, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-07-28 13:10:44'),
(43, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 13:22:20'),
(44, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 13:27:34'),
(45, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 14:02:09'),
(46, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 18:56:04'),
(47, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 19:05:41'),
(48, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 19:06:27'),
(49, 4, 'Requested password reset link', '2026-07-28 20:10:23'),
(50, 4, 'Successfully updated account password', '2026-07-28 20:10:57'),
(51, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-07-28 20:11:20'),
(52, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-28 20:12:40'),
(53, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-29 06:55:30'),
(54, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-29 15:28:51'),
(55, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-30 09:16:05'),
(56, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-07-30 12:21:31'),
(57, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-07-31 06:05:33'),
(58, 4, 'Registered new driver \'Kumar\' (ID: 18).', '2026-07-31 06:08:02'),
(59, 4, 'Theme preference changed from light to system.', '2026-07-31 06:56:58'),
(60, 4, 'Theme preference changed from system to light.', '2026-07-31 06:57:05'),
(61, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-31 08:46:26'),
(62, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-07-31 09:50:59'),
(63, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-31 09:53:15'),
(64, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-07-31 19:43:27'),
(65, 4, 'Requested password reset link', '2026-08-04 14:31:17'),
(66, 4, 'Successfully updated account password', '2026-08-04 14:32:13'),
(67, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-04 14:33:05'),
(68, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-11 06:53:21'),
(69, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-12 04:34:48'),
(70, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-12 04:35:03'),
(71, 4, 'SLTB Admin profile updated for \'FathimaRifka\'.', '2026-08-12 04:39:34'),
(72, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-12 04:57:38'),
(73, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-12 07:26:33'),
(74, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-12 15:50:38'),
(75, 4, 'Requested password reset link', '2026-08-13 15:40:55'),
(76, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module', '2026-08-13 15:50:13'),
(77, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 16:42:06'),
(78, 4, 'Bus SLTB-001 details and route/driver assignment were updated.', '2026-08-13 16:42:45'),
(79, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 16:50:22'),
(80, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:08:25'),
(81, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:09:46'),
(82, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:11:05'),
(83, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:12:25'),
(84, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:15:49'),
(85, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:41:55'),
(86, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 18:42:42'),
(87, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:09:25'),
(88, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:11:10'),
(89, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:26:51'),
(90, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:31:42'),
(91, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:40:23'),
(92, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:40:42'),
(93, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-13 19:41:12'),
(94, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 18:56:26'),
(95, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 18:58:22'),
(96, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 18:58:38'),
(97, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 18:58:48'),
(98, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 18:58:57'),
(99, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 18:59:08'),
(100, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 19:00:04'),
(101, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 19:04:11'),
(102, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-14 19:06:25'),
(103, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-15 13:44:39'),
(104, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-15 14:20:49'),
(105, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-15 14:32:22'),
(106, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-15 14:33:27'),
(107, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-15 16:17:13'),
(108, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-08-15 16:37:26'),
(109, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-03 03:47:48'),
(110, 1, 'Theme preference changed from dark to light.', '2026-09-03 04:16:05'),
(113, 4, 'Profile updated for user \'sltbadmin\'.', '2026-09-03 04:16:23'),
(114, 4, 'Profile updated for user \'sltbadmin\'.', '2026-09-03 04:16:23'),
(116, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:17:55'),
(117, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:19:13'),
(118, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:20:08'),
(119, 1, 'Theme preference changed from light to dark.', '2026-09-03 04:20:21'),
(120, 1, 'Theme preference changed from dark to light.', '2026-09-03 04:20:33'),
(121, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:24:22'),
(122, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:30:23'),
(125, 4, 'Profile updated for user \'sltbadmin\'.', '2026-09-03 04:35:50'),
(126, 4, 'Profile updated for user \'sltbadmin\'.', '2026-09-03 04:35:50'),
(131, 4, 'Profile updated for user \'sltbadmin\'.', '2026-09-03 04:42:04'),
(132, 4, 'Profile updated for user \'sltbadmin\'.', '2026-09-03 04:42:04'),
(135, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:43:19'),
(136, 1, 'User \'policeadmin\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-03 04:47:15'),
(141, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:51:00'),
(142, 1, 'Profile updated for user \'policeadmin\'.', '2026-09-03 04:51:18'),
(143, 8, 'User \'Pincky\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-03 04:56:58'),
(144, 8, 'Profile updated for user \'Pincky\'.', '2026-09-03 04:57:51'),
(145, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-03 05:01:55'),
(146, 1, 'Profile updated for user \'police\'.', '2026-09-03 05:02:18'),
(147, 1, 'Profile updated for user \'police\'.', '2026-09-03 05:04:06'),
(148, 8, 'User \'Pincky\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-03 05:11:29'),
(149, 8, 'Profile updated for user \'Pincky\'.', '2026-09-03 05:16:50'),
(150, 8, 'Profile updated for user \'Pincky\'.', '2026-09-03 05:16:50'),
(151, 8, 'Theme preference changed from light to dark.', '2026-09-03 05:16:50'),
(156, 8, 'Profile updated for user \'Pincky\'.', '2026-09-03 05:17:57'),
(157, 8, 'Profile updated for user \'Pincky\'.', '2026-09-03 05:19:29'),
(158, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-03 05:21:01'),
(159, 1, 'Profile updated for user \'police\'.', '2026-09-03 05:21:24'),
(160, 1, 'Theme preference changed from light to dark.', '2026-09-03 05:22:25'),
(161, 1, 'Theme preference changed from dark to light.', '2026-09-03 05:25:27'),
(162, 8, 'Theme preference changed from dark to light.', '2026-09-03 05:26:00'),
(163, 1, 'Performed automated system log verification test.', '2026-09-03 05:42:49'),
(164, 1, 'Performed automated system log verification test.', '2026-09-03 05:49:51'),
(165, 1, 'Performed automated system log verification test.', '2026-09-03 05:56:55'),
(166, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-04 19:44:19'),
(167, 9, 'Requested password reset link', '2026-09-04 19:57:14'),
(168, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-04 19:59:35'),
(169, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module from IP 127.0.0.1', '2026-09-05 09:44:07'),
(170, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-05 09:47:18'),
(171, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:28:24'),
(172, 1, 'Exported System Logs PDF report.', '2026-09-05 10:28:24'),
(173, 1, 'Exported System Logs PDF report.', '2026-09-05 10:28:24'),
(174, 1, 'Exported User Management PDF report.', '2026-09-05 10:28:25'),
(175, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:28:25'),
(176, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:28:25'),
(177, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:28:25'),
(178, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:28:25'),
(179, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:31:05'),
(180, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:31:05'),
(181, 1, 'Exported System Logs PDF report.', '2026-09-05 10:31:05'),
(182, 1, 'Exported System Logs PDF report.', '2026-09-05 10:31:05'),
(183, 1, 'Exported User Management PDF report.', '2026-09-05 10:31:05'),
(184, 1, 'Exported User Management PDF report.', '2026-09-05 10:31:05'),
(185, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:31:05'),
(186, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:31:05'),
(187, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:31:05'),
(188, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:31:05'),
(196, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:32:26'),
(197, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:32:26'),
(198, 1, 'Exported System Logs PDF report.', '2026-09-05 10:32:26'),
(199, 1, 'Exported System Logs PDF report.', '2026-09-05 10:32:26'),
(200, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:26'),
(201, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:26'),
(202, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:26'),
(203, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:26'),
(204, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:32:26'),
(205, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:32:26'),
(206, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:32:27'),
(207, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:32:27'),
(208, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:27'),
(209, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:27'),
(210, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:27'),
(211, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:27'),
(212, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:27'),
(213, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:27'),
(214, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:27'),
(215, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:27'),
(216, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:27'),
(217, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:27'),
(218, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:27'),
(219, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:27'),
(220, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:32:27'),
(221, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:32:27'),
(222, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:32:27'),
(223, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:32:27'),
(224, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:32:36'),
(225, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:32:36'),
(226, 1, 'Exported System Logs PDF report.', '2026-09-05 10:32:36'),
(227, 1, 'Exported System Logs PDF report.', '2026-09-05 10:32:36'),
(228, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:36'),
(229, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:36'),
(230, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:36'),
(231, 1, 'Exported User Management PDF report.', '2026-09-05 10:32:36'),
(232, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:32:36'),
(233, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:32:36'),
(234, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:32:36'),
(235, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:32:36'),
(236, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:36'),
(237, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:36'),
(238, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:36'),
(239, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:32:36'),
(240, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:36'),
(241, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:36'),
(242, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:36'),
(243, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:32:36'),
(244, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:37'),
(245, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:37'),
(246, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:37'),
(247, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:32:37'),
(248, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:32:37'),
(249, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:32:37'),
(250, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:32:37'),
(251, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:32:37'),
(252, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:32:38'),
(253, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:33:57'),
(254, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:34:09'),
(255, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:34:58'),
(256, 1, 'Exported System Logs PDF report.', '2026-09-05 10:35:15'),
(257, 1, 'Exported System Logs PDF report.', '2026-09-05 10:35:23'),
(258, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:35:46'),
(259, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:35:46'),
(260, 1, 'Exported System Logs PDF report.', '2026-09-05 10:35:46'),
(261, 1, 'Exported System Logs PDF report.', '2026-09-05 10:35:46'),
(262, 1, 'Exported User Management PDF report.', '2026-09-05 10:35:46'),
(263, 1, 'Exported User Management PDF report.', '2026-09-05 10:35:46'),
(264, 1, 'Exported User Management PDF report.', '2026-09-05 10:35:46'),
(265, 1, 'Exported User Management PDF report.', '2026-09-05 10:35:46'),
(266, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:35:47'),
(267, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:35:47'),
(268, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:35:47'),
(269, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:35:47'),
(270, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:35:47'),
(271, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:35:47'),
(272, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:35:47'),
(273, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:35:47'),
(274, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:35:47'),
(275, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:35:47'),
(276, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:35:47'),
(277, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:35:47'),
(278, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:35:47'),
(279, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:35:47'),
(280, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:35:47'),
(281, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:35:47'),
(282, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:35:47'),
(283, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:35:47'),
(284, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:35:47'),
(285, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:35:47'),
(286, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:35:49'),
(287, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:38:35'),
(288, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:38:35'),
(289, 1, 'Exported System Logs PDF report.', '2026-09-05 10:38:35'),
(290, 1, 'Exported System Logs PDF report.', '2026-09-05 10:38:35'),
(291, 1, 'Exported User Management PDF report.', '2026-09-05 10:38:35'),
(292, 1, 'Exported User Management PDF report.', '2026-09-05 10:38:35'),
(293, 1, 'Exported User Management PDF report.', '2026-09-05 10:38:35'),
(294, 1, 'Exported User Management PDF report.', '2026-09-05 10:38:35'),
(295, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:38:35'),
(296, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:38:35'),
(297, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:38:35'),
(298, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 10:38:35'),
(299, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:38:35'),
(300, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:38:35'),
(301, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:38:35'),
(302, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 10:38:35'),
(303, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:38:35'),
(304, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:38:36'),
(305, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:38:36'),
(306, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 10:38:36'),
(307, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:38:36'),
(308, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:38:36'),
(309, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:38:36'),
(310, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 10:38:36'),
(311, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:38:36'),
(312, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 10:38:36'),
(313, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:38:36'),
(314, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 10:38:36'),
(315, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:38:38'),
(316, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:39:14'),
(317, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 10:39:20'),
(318, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 10:50:37'),
(319, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:03:00'),
(320, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:03:10'),
(321, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:03:10'),
(322, 1, 'Exported System Logs PDF report.', '2026-09-05 11:03:10'),
(323, 1, 'Exported System Logs PDF report.', '2026-09-05 11:03:10'),
(324, 1, 'Exported User Management PDF report.', '2026-09-05 11:03:11'),
(325, 1, 'Exported User Management PDF report.', '2026-09-05 11:03:11'),
(326, 1, 'Exported User Management PDF report.', '2026-09-05 11:03:11'),
(327, 1, 'Exported User Management PDF report.', '2026-09-05 11:03:11'),
(328, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:03:11'),
(329, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:03:11'),
(330, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 11:03:11'),
(331, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 11:03:11'),
(332, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:03:11'),
(333, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:03:11'),
(334, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:03:11'),
(335, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:03:11'),
(336, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:03:11'),
(337, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:03:11'),
(338, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:03:11'),
(339, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:03:11'),
(340, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:03:11'),
(341, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:03:11'),
(342, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:03:11'),
(343, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:03:11'),
(344, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 11:03:11'),
(345, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 11:03:11'),
(346, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 11:03:11'),
(347, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 11:03:11'),
(348, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:03:12'),
(349, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:03:14'),
(350, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:05:08'),
(351, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:10:17'),
(352, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:13:58'),
(353, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:13:58'),
(354, 1, 'Exported System Logs PDF report.', '2026-09-05 11:13:58'),
(355, 1, 'Exported System Logs PDF report.', '2026-09-05 11:13:58'),
(356, 1, 'Exported User Management PDF report.', '2026-09-05 11:13:58'),
(357, 1, 'Exported User Management PDF report.', '2026-09-05 11:13:58'),
(358, 1, 'Exported User Management PDF report.', '2026-09-05 11:13:58'),
(359, 1, 'Exported User Management PDF report.', '2026-09-05 11:13:58'),
(360, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:13:58'),
(361, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:13:58'),
(362, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 11:13:58'),
(363, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 11:13:58'),
(364, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:13:58'),
(365, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:13:58'),
(366, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:13:58'),
(367, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:13:58'),
(368, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:13:58'),
(369, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:13:58'),
(370, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:13:58'),
(371, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:13:58'),
(372, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:13:59'),
(373, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:13:59'),
(374, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:13:59'),
(375, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:13:59'),
(376, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 11:13:59'),
(377, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 11:13:59'),
(378, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 11:13:59'),
(379, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 11:13:59'),
(380, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:13:59'),
(381, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:14:02'),
(382, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:20:43'),
(383, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:20:43'),
(384, 1, 'Exported System Logs PDF report.', '2026-09-05 11:20:43'),
(385, 1, 'Exported System Logs PDF report.', '2026-09-05 11:20:43'),
(386, 1, 'Exported User Management PDF report.', '2026-09-05 11:20:43'),
(387, 1, 'Exported User Management PDF report.', '2026-09-05 11:20:43'),
(388, 1, 'Exported User Management PDF report.', '2026-09-05 11:20:43'),
(389, 1, 'Exported User Management PDF report.', '2026-09-05 11:20:43'),
(390, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:20:43'),
(391, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:20:43'),
(392, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 11:20:43'),
(393, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 11:20:43'),
(394, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:20:43'),
(395, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:20:43'),
(396, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:20:43'),
(397, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 11:20:43'),
(398, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:20:43'),
(399, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:20:44'),
(400, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:20:44'),
(401, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 11:20:44'),
(402, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:20:44'),
(403, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:20:44'),
(404, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:20:44'),
(405, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 11:20:44'),
(406, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 11:20:44'),
(407, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 11:20:44'),
(408, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 11:20:44'),
(409, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 11:20:44'),
(410, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 11:20:45'),
(411, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 11:20:47'),
(412, 4, 'User \'sltbadmin\' (Role: SLTB Admin) logged in to SLTB module', '2026-09-05 11:28:03'),
(413, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module', '2026-09-05 11:28:03'),
(414, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-05 11:30:01'),
(415, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:00:15'),
(416, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:00:47'),
(417, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:00:55'),
(418, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:00:55'),
(419, 1, 'Exported System Logs PDF report.', '2026-09-05 13:00:55'),
(420, 1, 'Exported System Logs PDF report.', '2026-09-05 13:00:55'),
(421, 1, 'Exported User Management PDF report.', '2026-09-05 13:00:55'),
(422, 1, 'Exported User Management PDF report.', '2026-09-05 13:00:55'),
(423, 1, 'Exported User Management PDF report.', '2026-09-05 13:00:55'),
(424, 1, 'Exported User Management PDF report.', '2026-09-05 13:00:55'),
(425, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:00:55'),
(426, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:00:55'),
(427, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:00:55'),
(428, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:00:55'),
(429, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:00:55'),
(430, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:00:55'),
(431, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:00:55'),
(432, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:00:55'),
(433, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:00:55'),
(434, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:00:55'),
(435, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:00:55'),
(436, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:00:55'),
(437, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:00:55'),
(438, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:00:55'),
(439, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:00:55'),
(440, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:00:55'),
(441, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:00:55'),
(442, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:00:55'),
(443, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:00:56'),
(444, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:00:56'),
(445, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:00:56'),
(446, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:00:57'),
(447, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-05 13:01:52'),
(448, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-05 13:02:00'),
(449, 1, 'User \'police\' (Role: Police Admin) logged in to POLICE module from IP 127.0.0.1', '2026-09-05 13:02:10'),
(450, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:02:22'),
(451, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:02:24'),
(452, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:02:27'),
(453, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:02:29'),
(454, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:04:04'),
(455, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:05:06'),
(456, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:05:06'),
(457, 1, 'Exported System Logs PDF report.', '2026-09-05 13:05:06'),
(458, 1, 'Exported System Logs PDF report.', '2026-09-05 13:05:06'),
(459, 1, 'Exported User Management PDF report.', '2026-09-05 13:05:06'),
(460, 1, 'Exported User Management PDF report.', '2026-09-05 13:05:06'),
(461, 1, 'Exported User Management PDF report.', '2026-09-05 13:05:06'),
(462, 1, 'Exported User Management PDF report.', '2026-09-05 13:05:06'),
(463, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:05:06'),
(464, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:05:06'),
(465, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:05:06'),
(466, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:05:06'),
(467, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:05:07'),
(468, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:05:07'),
(469, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:05:07'),
(470, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:05:07'),
(471, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:05:07'),
(472, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:05:07'),
(473, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:05:07'),
(474, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:05:07'),
(475, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:05:07'),
(476, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:05:07'),
(477, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:05:07'),
(478, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:05:07'),
(479, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:05:07'),
(480, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:05:07'),
(481, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:05:07'),
(482, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:05:07'),
(483, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:05:07'),
(484, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:05:09'),
(485, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:13:06'),
(486, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:13:15'),
(487, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:13:15'),
(488, 1, 'Exported System Logs PDF report.', '2026-09-05 13:13:15'),
(489, 1, 'Exported System Logs PDF report.', '2026-09-05 13:13:15'),
(490, 1, 'Exported User Management PDF report.', '2026-09-05 13:13:15'),
(491, 1, 'Exported User Management PDF report.', '2026-09-05 13:13:15'),
(492, 1, 'Exported User Management PDF report.', '2026-09-05 13:13:15'),
(493, 1, 'Exported User Management PDF report.', '2026-09-05 13:13:15'),
(494, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:13:15'),
(495, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:13:15'),
(496, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:13:15'),
(497, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:13:15'),
(498, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:13:15'),
(499, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:13:15'),
(500, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:13:15'),
(501, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:13:15'),
(502, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:13:15'),
(503, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:13:15'),
(504, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:13:15'),
(505, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:13:15'),
(506, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:13:16'),
(507, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:13:16'),
(508, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:13:16'),
(509, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:13:16'),
(510, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:13:16'),
(511, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:13:16'),
(512, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:13:16'),
(513, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:13:16'),
(514, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:13:16'),
(515, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:13:17'),
(516, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:13:18'),
(517, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:14:19'),
(518, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:14:19'),
(519, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:16:11'),
(520, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:19:07'),
(521, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:19:07'),
(522, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:19:10'),
(523, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:19:11'),
(524, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:21:38'),
(525, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:22:02'),
(526, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:22:02'),
(527, 1, 'Exported System Logs PDF report.', '2026-09-05 13:22:02'),
(528, 1, 'Exported System Logs PDF report.', '2026-09-05 13:22:02'),
(529, 1, 'Exported User Management PDF report.', '2026-09-05 13:22:02'),
(530, 1, 'Exported User Management PDF report.', '2026-09-05 13:22:02'),
(531, 1, 'Exported User Management PDF report.', '2026-09-05 13:22:02'),
(532, 1, 'Exported User Management PDF report.', '2026-09-05 13:22:02'),
(533, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:22:02'),
(534, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:22:02'),
(535, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:22:02'),
(536, 1, 'Exported U-Turn Management PDF report.', '2026-09-05 13:22:02'),
(537, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:22:03'),
(538, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:22:03'),
(539, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:22:03'),
(540, 4, 'Exported SLTB Buses Inventory PDF report.', '2026-09-05 13:22:03'),
(541, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:22:03'),
(542, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:22:03'),
(543, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:22:03'),
(544, 4, 'Exported SLTB Routes Performance PDF report.', '2026-09-05 13:22:03'),
(545, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:22:03'),
(546, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:22:03'),
(547, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:22:03'),
(548, 4, 'Exported SLTB Drivers Roster PDF report.', '2026-09-05 13:22:03'),
(549, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:22:03'),
(550, 4, 'Exported SLTB Bus Assignment History PDF report.', '2026-09-05 13:22:03'),
(551, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:22:03'),
(552, 4, 'Exported SLTB Sensors and Alerts PDF report.', '2026-09-05 13:22:03'),
(553, 1, 'Exported Police Bus Alerts PDF report.', '2026-09-05 13:22:03'),
(554, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:22:04'),
(555, 1, 'Exported U-Turn Alerts PDF report.', '2026-09-05 13:22:05'),
(556, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:27:56'),
(557, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:27:56'),
(558, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:33:43'),
(559, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:33:43'),
(560, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:34:01'),
(561, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:34:01'),
(562, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:34:44'),
(563, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:34:50'),
(564, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:34:53'),
(565, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:35:00'),
(566, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:36:04'),
(567, 1, 'Viewed Police Admin Dashboard.', '2026-09-05 13:36:04');

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
(19, 4, '2026-07-28 12:26:44', '2026-07-28 13:09:34', NULL, NULL),
(20, 4, '2026-07-28 13:10:44', '2026-07-28 13:10:55', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(21, 1, '2026-07-28 13:22:20', '2026-07-28 13:22:32', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(22, 1, '2026-07-28 13:27:34', '2026-07-28 14:06:22', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(23, 1, '2026-07-28 14:02:09', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(24, 1, '2026-07-28 18:56:04', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(25, 1, '2026-07-28 19:05:41', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(26, 1, '2026-07-28 19:06:27', '2026-07-28 20:07:53', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(27, 4, '2026-07-28 20:11:20', '2026-07-28 20:11:41', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(28, 1, '2026-07-28 20:12:40', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(29, 1, '2026-07-29 06:55:30', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(30, 1, '2026-07-29 15:28:51', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(31, 1, '2026-07-30 09:16:05', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(32, 4, '2026-07-30 12:21:31', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(33, 4, '2026-07-31 06:05:33', '2026-07-31 08:45:55', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(34, 1, '2026-07-31 08:46:26', '2026-07-31 09:50:46', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(35, 4, '2026-07-31 09:50:59', '2026-07-31 09:53:04', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(36, 1, '2026-07-31 09:53:15', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(37, 1, '2026-07-31 19:43:27', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(38, 4, '2026-08-04 14:33:05', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(39, 4, '2026-08-11 06:53:21', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'),
(40, 4, '2026-08-12 04:34:48', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.130.0 Chrome/148.0.7778.280 Electron/42.6.0 Safari/537.36'),
(41, 4, '2026-08-12 04:35:03', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(42, 4, '2026-08-12 04:57:38', NULL, '127.0.0.1', 'PostmanRuntime/7.56.0'),
(43, 4, '2026-08-12 07:26:33', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(44, 4, '2026-08-12 15:50:38', NULL, '127.0.0.1', 'Werkzeug/3.1.8'),
(45, 4, '2026-08-13 15:50:13', NULL, NULL, NULL),
(46, 4, '2026-08-13 16:42:06', '2026-08-13 18:15:30', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(47, 4, '2026-08-13 16:50:22', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(48, 4, '2026-08-13 18:08:25', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(49, 4, '2026-08-13 18:09:46', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(50, 4, '2026-08-13 18:11:05', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(51, 4, '2026-08-13 18:12:25', NULL, '127.0.0.1', 'Werkzeug/3.1.8'),
(52, 4, '2026-08-13 18:15:49', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(53, 4, '2026-08-13 18:41:55', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(54, 4, '2026-08-13 18:42:42', NULL, '127.0.0.1', 'Werkzeug/3.1.8'),
(55, 4, '2026-08-13 19:09:25', NULL, '127.0.0.1', 'Werkzeug/3.1.8'),
(56, 4, '2026-08-13 19:11:10', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(57, 4, '2026-08-13 19:26:51', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(58, 4, '2026-08-13 19:31:42', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(59, 4, '2026-08-13 19:40:23', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(60, 4, '2026-08-13 19:40:42', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(61, 4, '2026-08-13 19:41:12', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(62, 4, '2026-08-14 18:56:26', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(63, 4, '2026-08-14 18:58:22', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(64, 4, '2026-08-14 18:58:38', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(65, 4, '2026-08-14 18:58:48', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(66, 4, '2026-08-14 18:58:57', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(67, 4, '2026-08-14 18:59:08', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(68, 4, '2026-08-14 19:00:04', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(69, 4, '2026-08-14 19:04:11', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(70, 4, '2026-08-14 19:06:25', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(71, 4, '2026-08-15 13:44:39', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(72, 4, '2026-08-15 14:20:49', '2026-08-15 16:22:51', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(73, 4, '2026-08-15 14:32:22', NULL, '127.0.0.1', 'node'),
(74, 4, '2026-08-15 14:33:27', NULL, '127.0.0.1', 'node'),
(75, 4, '2026-08-15 16:17:13', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(76, 4, '2026-08-15 16:37:26', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36'),
(77, 1, '2026-09-03 03:47:48', '2026-09-03 04:45:27', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(78, 1, '2026-09-03 04:47:15', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(79, 8, '2026-09-03 04:56:58', '2026-09-03 05:00:55', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(80, 1, '2026-09-03 05:01:55', '2026-09-03 05:11:21', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(81, 8, '2026-09-03 05:11:29', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(82, 1, '2026-09-03 05:21:01', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(83, 1, '2026-09-04 19:44:19', '2026-09-04 19:56:57', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(84, 1, '2026-09-04 19:59:35', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(85, 4, '2026-09-05 09:44:07', NULL, '127.0.0.1', 'Werkzeug/3.1.8'),
(86, 1, '2026-09-05 09:47:18', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(87, 4, '2026-09-05 11:28:03', NULL, NULL, NULL),
(88, 1, '2026-09-05 11:28:03', NULL, NULL, NULL),
(89, 1, '2026-09-05 11:30:01', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'),
(90, 1, '2026-09-05 13:01:52', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(91, 1, '2026-09-05 13:02:00', NULL, '127.0.0.1', 'Python-urllib/3.14'),
(92, 1, '2026-09-05 13:02:10', NULL, '127.0.0.1', 'Python-urllib/3.14');

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
-- Indexes for table `bus_assignment_history`
--
ALTER TABLE `bus_assignment_history`
  ADD PRIMARY KEY (`assignment_history_id`),
  ADD KEY `fk_history_bus` (`bus_id`),
  ADD KEY `fk_history_driver` (`driver_id`),
  ADD KEY `fk_history_route` (`route_id`),
  ADD KEY `fk_history_assigned_by` (`assigned_by`);

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
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `fk_notification_bus_alert` (`bus_alert_id`),
  ADD KEY `fk_notification_roadside_alert` (`roadside_alert_id`);

--
-- Indexes for table `notification_recipients`
--
ALTER TABLE `notification_recipients`
  ADD PRIMARY KEY (`recipient_id`),
  ADD UNIQUE KEY `uq_notification_officer` (`notification_id`,`officer_id`),
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
  ADD UNIQUE KEY `setting_name` (`setting_name`),
  ADD KEY `fk_setting_updated_by` (`updated_by`);

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
  MODIFY `bus_alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bus_assignment_history`
--
ALTER TABLE `bus_assignment_history`
  MODIFY `assignment_history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `bus_devices`
--
ALTER TABLE `bus_devices`
  MODIFY `bus_device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `device_registry`
--
ALTER TABLE `device_registry`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `drivers`
--
ALTER TABLE `drivers`
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `police_officers`
--
ALTER TABLE `police_officers`
  MODIFY `officer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roadside_alerts`
--
ALTER TABLE `roadside_alerts`
  MODIFY `roadside_alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `sensor_data_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sltb_users`
--
ALTER TABLE `sltb_users`
  MODIFY `sltb_user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_activity_logs`
--
ALTER TABLE `user_activity_logs`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=568;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

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
-- Constraints for table `bus_assignment_history`
--
ALTER TABLE `bus_assignment_history`
  ADD CONSTRAINT `fk_history_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`driver_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`route_id`) ON UPDATE CASCADE;

--
-- Constraints for table `bus_devices`
--
ALTER TABLE `bus_devices`
  ADD CONSTRAINT `fk_bus_device_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`bus_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bus_device_device` FOREIGN KEY (`device_id`) REFERENCES `device_registry` (`device_id`) ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_bus_alert` FOREIGN KEY (`bus_alert_id`) REFERENCES `bus_alerts` (`bus_alert_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notification_roadside_alert` FOREIGN KEY (`roadside_alert_id`) REFERENCES `roadside_alerts` (`roadside_alert_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `fk_setting_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
