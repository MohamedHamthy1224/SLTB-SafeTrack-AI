/**
 * Mock Data for Police System Logs Module
 */

export const systemLogsSummaryStats = {
  totalActivities: 12845,
  uniqueUsers: 128,
  todayActivities: 256,
  todayDate: '05 Jun 2025',
  weekActivities: 1842,
  weekRange: '01 Jun - 07 Jun 2025',
};

export const mockSystemLogs = [
  {
    id: 10001,
    activityId: '10001',
    userId: 'police.admin',
    activity: 'User logged in',
    activityTime: '05 Jun 2025, 10:30:45 AM',
  },
  {
    id: 10002,
    activityId: '10002',
    userId: 'tp.officer02',
    activity: 'Viewed bus alerts',
    activityTime: '05 Jun 2025, 10:28:12 AM',
  },
  {
    id: 10003,
    activityId: '10003',
    userId: 'police.admin',
    activity: 'Exported report',
    activityTime: '05 Jun 2025, 10:25:37 AM',
  },
  {
    id: 10004,
    activityId: '10004',
    userId: 'system',
    activity: 'Changed theme to dark mode',
    activityTime: '05 Jun 2025, 10:20:11 AM',
  },
  {
    id: 10005,
    activityId: '10005',
    userId: 'tp.officer05',
    activity: 'Viewed system logs',
    activityTime: '05 Jun 2025, 10:18:05 AM',
  },
  {
    id: 10006,
    activityId: '10006',
    userId: 'police.admin',
    activity: 'Updated profile information',
    activityTime: '05 Jun 2025, 10:15:22 AM',
  },
  {
    id: 10007,
    activityId: '10007',
    userId: 'tp.officer03',
    activity: 'Viewed U-Turn alerts',
    activityTime: '05 Jun 2025, 10:10:44 AM',
  },
  {
    id: 10008,
    activityId: '10008',
    userId: 'system',
    activity: 'User logged out',
    activityTime: '05 Jun 2025, 10:05:18 AM',
  },
  {
    id: 10009,
    activityId: '10009',
    userId: 'ai.officer01',
    activity: 'Viewed AI analysis reports',
    activityTime: '05 Jun 2025, 10:00:33 AM',
  },
  {
    id: 10010,
    activityId: '10010',
    userId: 'tp.officer02',
    activity: 'User logged in',
    activityTime: '05 Jun 2025, 09:58:07 AM',
  },
];

export const mockActivityByDay = [
  { day: '31 May', date: '31 May', count: 1256 },
  { day: '01 Jun', date: '01 Jun', count: 1842 },
  { day: '02 Jun', date: '02 Jun', count: 1736 },
  { day: '03 Jun', date: '03 Jun', count: 2015 },
  { day: '04 Jun', date: '04 Jun', count: 1974 },
  { day: '05 Jun', date: '05 Jun', count: 2022 },
];

export const mockUserDistribution = [
  { name: 'police.admin', count: 2845, percentage: 22.2, color: '#3B82F6' },
  { name: 'tp.officer02', count: 1985, percentage: 15.5, color: '#8B5CF6' },
  { name: 'tp.officer05', count: 1642, percentage: 12.8, color: '#F59E0B' },
  { name: 'tp.officer03', count: 1436, percentage: 11.2, color: '#6366F1' },
  { name: 'ai.officer01', count: 1225, percentage: 9.5, color: '#10B981' },
  { name: 'Others (123 users)', count: 3712, percentage: 28.8, color: '#CBD5E1' },
];

export const mockRecentActivities = [
  { activity: 'User logged in', user: 'police.admin', time: '10:30:45 AM' },
  { activity: 'Viewed bus alerts', user: 'tp.officer02', time: '10:28:12 AM' },
  { activity: 'Exported report', user: 'police.admin', time: '10:25:37 AM' },
  { activity: 'Changed theme to dark mode', user: 'system', time: '10:20:11 AM' },
  { activity: 'Viewed system logs', user: 'tp.officer05', time: '10:18:05 AM' },
];

export const mockUserOptions = [
  'All Users',
  'police.admin',
  'tp.officer02',
  'tp.officer03',
  'tp.officer05',
  'ai.officer01',
  'system',
];
