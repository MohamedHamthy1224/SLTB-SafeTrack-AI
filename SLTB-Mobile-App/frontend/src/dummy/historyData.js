/**
 * Dummy Data — Alert History Feed
 * Matches reference mockup Image exactly.
 */

export const historyData = [
  {
    id: 1,
    type: 'bus',
    title: 'Bus Alert',
    description: 'The system has identified a potential collision risk for bus.',
    busNo: 'Bus No: #742',
    priority: 'High',
    date: 'Oct 27',
    time: '02:14 PM',
    unread: true,
  },
  {
    id: 2,
    type: 'u_turn',
    title: 'U-Turn Alert',
    description: 'The system has identified a potential collision risk for u-turn.',
    location: 'Location: Broadway & 42nd',
    priority: 'Medium',
    date: 'Oct 27',
    time: '01:52 PM',
    unread: true,
  },
  {
    id: 3,
    type: 'bus',
    title: 'Bus Alert',
    description: 'The system has identified a potential collision risk for bus.',
    busNo: 'Bus No: #109',
    priority: 'Low',
    date: 'Oct 23',
    time: '11:20 AM',
    unread: true,
  },
];

export default historyData;
