-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 16, 2026 at 10:15 PM
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
  `depot` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `manufacture_year` year(4) DEFAULT NULL,
  `status` enum('Active','Maintenance','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buses`
--

INSERT INTO `buses` (`bus_id`, `registration_number`, `bus_number`, `depot`, `model`, `capacity`, `manufacture_year`, `status`, `created_at`) VALUES
(1, 'NB-4587', 'SLTB-001', 'Batticaloa Depot', 'Ashok Leyland', 54, '2022', 'Active', '2026-07-16 19:34:06');

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
(1, 1, 1, 1, '2026-07-17', 'Active', '2026-07-16 19:34:06');

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
  `license_number` varchar(50) NOT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`driver_id`, `full_name`, `license_number`, `nic`, `phone`, `experience_years`, `status`, `created_at`) VALUES
(1, 'Mohamed Ismail', 'B1234567', '902345678V', '0771234567', 8, 'Active', '2026-07-16 19:34:06');

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
(2, '102', 'Batticaloa - Kandy', 'Batticaloa', 'Kandy', 210.30, 300, 'Active', '2026-07-16 19:34:06'),
(3, '103', 'Batticaloa - Trincomalee', 'Batticaloa', 'Trincomalee', 115.00, 150, 'Active', '2026-07-16 19:34:06');

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
(1, 4, 'Mohamed Rauf', 'SLTB001', 'Operations', 'Fleet Manager', '0754567890', '2021-08-10');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `username`, `email`, `password`, `profile_image`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'policeadmin', 'policeadmin@safetrackai.com', '6481f8e1a060d56eeb7c10ac7809d316800dce013713c412e1d22076505b11a8', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-16 19:34:06'),
(2, 2, 'officer001', 'officer001@safetrackai.com', '6481f8e1a060d56eeb7c10ac7809d316800dce013713c412e1d22076505b11a8', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-16 19:34:06'),
(3, 2, 'officer002', 'officer002@safetrackai.com', '6481f8e1a060d56eeb7c10ac7809d316800dce013713c412e1d22076505b11a8', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-16 19:34:06'),
(4, 3, 'sltbadmin', 'sltbadmin@safetrackai.com', '6481f8e1a060d56eeb7c10ac7809d316800dce013713c412e1d22076505b11a8', NULL, 'Active', '2026-07-16 19:34:06', '2026-07-16 19:34:06');

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
  ADD UNIQUE KEY `bus_number` (`bus_number`);

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
  ADD UNIQUE KEY `nic` (`nic`);

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
  MODIFY `bus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bus_alerts`
--
ALTER TABLE `bus_alerts`
  MODIFY `bus_alert_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bus_assignments`
--
ALTER TABLE `bus_assignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `driver_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

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
