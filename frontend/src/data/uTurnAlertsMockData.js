/**
 * Mock Data Source for Police U-Turn Alerts Module
 * Contains static mock records for U-Turn alerts, roadside units, charts, and recent notifications.
 */

export const mockUTurnAlertsData = [
  {
    id: '100001',
    roadsideAlertId: '100001',
    roadsideUnitId: 'RU-0012',
    deviceId: 'DV-1023',
    routeId: 'R-05',
    sensorDataId: 'SD-55678',
    alertTime: '07 Jun 2025 10:25 AM',
    notificationTitle: 'Unsafe Distance Alert',
    priority: 'High',
    createdAt: '07 Jun 2025 10:25 AM',
    description: 'A vehicle is following too closely to the vehicle ahead. Minimum safe distance has been violated.',
    actionRequired: 'Please take immediate action to ensure road safety.',
    locationInfo: {
      roadsideUnitId: 'RU-0012',
      deviceId: 'DV-1023',
      routeId: 'R-05',
      locationName: 'Kandy-Matale U-Turn Point',
      latitude: '7.29640000',
      longitude: '80.63500000',
      city: 'Kandy',
      province: 'Central Province',
      roadName: 'Kandy-Matale Main Road',
      direction: 'Northbound',
      speedZone: '60 km/h',
      installationDate: '15 Jan 2025',
      status: 'Active',
      createdAt: '15 Jan 2025, 09:30 AM'
    }
  },
  {
    id: '100002',
    roadsideAlertId: '100002',
    roadsideUnitId: 'RU-0008',
    deviceId: 'DV-1034',
    routeId: 'R-02',
    sensorDataId: 'SD-55679',
    alertTime: '07 Jun 2025 09:58 AM',
    notificationTitle: 'Wrong-Side Detection',
    priority: 'High',
    createdAt: '07 Jun 2025 09:58 AM',
    description: 'Vehicle detected driving against prescribed traffic flow at U-Turn junction.',
    actionRequired: 'Issue immediate automated traffic alert to dispatch unit.',
    locationInfo: {
      roadsideUnitId: 'RU-0008',
      deviceId: 'DV-1034',
      routeId: 'R-02',
      locationName: 'Colombo-Galle Highway Point B',
      latitude: '6.92710000',
      longitude: '79.86120000',
      installationDate: '10 Feb 2025',
      status: 'Active',
      createdAt: '10 Feb 2025, 08:15 AM'
    }
  },
  {
    id: '100003',
    roadsideAlertId: '100003',
    roadsideUnitId: 'RU-0015',
    deviceId: 'DV-1011',
    routeId: 'R-07',
    sensorDataId: 'SD-55680',
    alertTime: '07 Jun 2025 09:42 AM',
    notificationTitle: 'U-Turn Warning',
    priority: 'Medium',
    createdAt: '07 Jun 2025 09:42 AM',
    description: 'Sudden sharp U-turn maneuver executed in high-density lane.',
    actionRequired: 'Log maneuver event for safety evaluation.',
    locationInfo: {
      roadsideUnitId: 'RU-0015',
      deviceId: 'DV-1011',
      routeId: 'R-07',
      locationName: 'Kurunegala Junction U-Turn',
      latitude: '7.48630000',
      longitude: '80.36470000',
      installationDate: '22 Feb 2025',
      status: 'Active',
      createdAt: '22 Feb 2025, 11:00 AM'
    }
  },
  {
    id: '100004',
    roadsideAlertId: '100004',
    roadsideUnitId: 'RU-0009',
    deviceId: 'DV-1045',
    routeId: 'R-11',
    sensorDataId: 'SD-55681',
    alertTime: '07 Jun 2025 09:15 AM',
    notificationTitle: 'Vehicle Detected',
    priority: 'Medium',
    createdAt: '07 Jun 2025 09:15 AM',
    description: 'Vehicle lingering in U-turn buffer zone exceeding safe clearance threshold.',
    actionRequired: 'Automated monitoring log recorded.',
    locationInfo: {
      roadsideUnitId: 'RU-0009',
      deviceId: 'DV-1045',
      routeId: 'R-11',
      locationName: 'Negombo Main Road U-Turn',
      latitude: '7.20830000',
      longitude: '79.83580000',
      installationDate: '01 Mar 2025',
      status: 'Active',
      createdAt: '01 Mar 2025, 10:00 AM'
    }
  },
  {
    id: '100005',
    roadsideAlertId: '100005',
    roadsideUnitId: 'RU-0013',
    deviceId: 'DV-1007',
    routeId: 'R-03',
    sensorDataId: 'SD-55682',
    alertTime: '07 Jun 2025 08:47 AM',
    notificationTitle: 'Unsafe Distance Alert',
    priority: 'High',
    createdAt: '07 Jun 2025 08:47 AM',
    description: 'Follow distance warning triggered by radar sensor.',
    actionRequired: 'Reduce speed and maintain safe distance.',
    locationInfo: {
      roadsideUnitId: 'RU-0013',
      deviceId: 'DV-1007',
      routeId: 'R-03',
      locationName: 'Galle Road Panadura U-Turn',
      latitude: '6.71060000',
      longitude: '79.90740000',
      installationDate: '12 Mar 2025',
      status: 'Active',
      createdAt: '12 Mar 2025, 08:30 AM'
    }
  },
  {
    id: '100006',
    roadsideAlertId: '100006',
    roadsideUnitId: 'RU-0007',
    deviceId: 'DV-1031',
    routeId: 'R-09',
    sensorDataId: 'SD-55683',
    alertTime: '07 Jun 2025 08:20 AM',
    notificationTitle: 'Wrong-Side Detection',
    priority: 'Medium',
    createdAt: '07 Jun 2025 08:20 AM',
    description: 'Near-miss event recorded near U-turn divider.',
    actionRequired: 'Automated notification recorded.',
    locationInfo: {
      roadsideUnitId: 'RU-0007',
      deviceId: 'DV-1031',
      routeId: 'R-09',
      locationName: 'Ratnapura Expressway Exit U-Turn',
      latitude: '6.68280000',
      longitude: '80.39920000',
      installationDate: '18 Mar 2025',
      status: 'Active',
      createdAt: '18 Mar 2025, 09:15 AM'
    }
  },
  {
    id: '100007',
    roadsideAlertId: '100007',
    roadsideUnitId: 'RU-0010',
    deviceId: 'DV-1009',
    routeId: 'R-01',
    sensorDataId: 'SD-55684',
    alertTime: '07 Jun 2025 07:55 AM',
    notificationTitle: 'Vehicle Detected',
    priority: 'Low',
    createdAt: '07 Jun 2025 07:55 AM',
    description: 'Normal U-turn movement logged safely.',
    actionRequired: 'No action required.',
    locationInfo: {
      roadsideUnitId: 'RU-0010',
      deviceId: 'DV-1009',
      routeId: 'R-01',
      locationName: 'Borella Junction U-Turn',
      latitude: '6.91470000',
      longitude: '79.87780000',
      installationDate: '25 Mar 2025',
      status: 'Active',
      createdAt: '25 Mar 2025, 07:00 AM'
    }
  },
  {
    id: '100008',
    roadsideAlertId: '100008',
    roadsideUnitId: 'RU-0014',
    deviceId: 'DV-1020',
    routeId: 'R-06',
    sensorDataId: 'SD-55685',
    alertTime: '07 Jun 2025 07:30 AM',
    notificationTitle: 'U-Turn Warning',
    priority: 'Medium',
    createdAt: '07 Jun 2025 07:30 AM',
    description: 'Rapid acceleration during U-turn maneuver.',
    actionRequired: 'Warning issued to driver.',
    locationInfo: {
      roadsideUnitId: 'RU-0014',
      deviceId: 'DV-1020',
      routeId: 'R-06',
      locationName: 'Trincomalee Coastal Road U-Turn',
      latitude: '8.58740000',
      longitude: '81.21520000',
      installationDate: '02 Apr 2025',
      status: 'Active',
      createdAt: '02 Apr 2025, 10:45 AM'
    }
  },
  {
    id: '100009',
    roadsideAlertId: '100009',
    roadsideUnitId: 'RU-0006',
    deviceId: 'DV-1050',
    routeId: 'R-12',
    sensorDataId: 'SD-55686',
    alertTime: '07 Jun 2025 07:05 AM',
    notificationTitle: 'Wrong-Side Detection',
    priority: 'High',
    createdAt: '07 Jun 2025 07:05 AM',
    description: 'Vehicle moving in wrong direction near lane merger.',
    actionRequired: 'Immediate police intervention requested.',
    locationInfo: {
      roadsideUnitId: 'RU-0006',
      deviceId: 'DV-1050',
      routeId: 'R-12',
      locationName: 'Anuradhapura Clock Tower U-Turn',
      latitude: '8.31140000',
      longitude: '80.40370000',
      installationDate: '10 Apr 2025',
      status: 'Active',
      createdAt: '10 Apr 2025, 11:30 AM'
    }
  },
  {
    id: '100010',
    roadsideAlertId: '100010',
    roadsideUnitId: 'RU-0011',
    deviceId: 'DV-1036',
    routeId: 'R-04',
    sensorDataId: 'SD-55687',
    alertTime: '07 Jun 2025 06:45 AM',
    notificationTitle: 'Vehicle Detected',
    priority: 'Low',
    createdAt: '07 Jun 2025 06:45 AM',
    description: 'Routine U-turn passage recorded.',
    actionRequired: 'Logged successfully.',
    locationInfo: {
      roadsideUnitId: 'RU-0011',
      deviceId: 'DV-1036',
      routeId: 'R-04',
      locationName: 'Batticaloa Lagoon Bridge U-Turn',
      latitude: '7.71700000',
      longitude: '81.70000000',
      installationDate: '15 Apr 2025',
      status: 'Active',
      createdAt: '15 Apr 2025, 08:00 AM'
    }
  }
];

export const mockUTurnPriorityDistribution = [
  { name: 'High', value: 54, percentage: '42.9%', color: '#EF4444' },
  { name: 'Medium', value: 42, percentage: '33.3%', color: '#F97316' },
  { name: 'Low', value: 30, percentage: '23.8%', color: '#10B981' }
];

export const mockUTurnWeeklyOverview = [
  { day: 'Mon', date: '02 Jun', count: 18 },
  { day: 'Tue', date: '03 Jun', count: 24 },
  { day: 'Wed', date: '04 Jun', count: 30 },
  { day: 'Thu', date: '05 Jun', count: 28 },
  { day: 'Fri', date: '06 Jun', count: 16 },
  { day: 'Sat', date: '07 Jun', count: 10 },
  { day: 'Sun', date: '08 Jun', count: 0 }
];

export const mockUTurnRecentNotifications = [
  {
    id: 'ut_n1',
    title: 'Unsafe Distance Alert',
    desc: 'Minimum safe distance violated.',
    priority: 'High',
    time: '10:25 AM',
    type: 'distance'
  },
  {
    id: 'ut_n2',
    title: 'Wrong-Side Detection',
    desc: 'Vehicle moving in wrong direction.',
    priority: 'High',
    time: '09:58 AM',
    type: 'wrong_side'
  },
  {
    id: 'ut_n3',
    title: 'U-Turn Warning',
    desc: 'U-turn movement detected.',
    priority: 'Medium',
    time: '09:42 AM',
    type: 'uturn'
  },
  {
    id: 'ut_n4',
    title: 'Vehicle Detected',
    desc: 'Vehicle detected in monitored area.',
    priority: 'Low',
    time: '09:15 AM',
    type: 'vehicle'
  },
  {
    id: 'ut_n5',
    title: 'Unsafe Distance Alert',
    desc: 'Minimum safe distance violated.',
    priority: 'High',
    time: '08:47 AM',
    type: 'distance'
  }
];
