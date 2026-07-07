import { Lead } from '../models/Lead.js';

export const getAnalytics = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalLeads,
    newLeads,
    convertedLeads,
    lostLeads,
    thisMonthCount,
    lastMonthCount,
    statusBreakdown,
    sourceBreakdown,
    monthlyTrend,
    upcomingFollowUps,
    recentLeads,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'New' }),
    Lead.countDocuments({ status: 'Converted' }),
    Lead.countDocuments({ status: 'Lost' }),
    Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Lead.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    }),
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    getMonthlyTrend(),
    Lead.find({
      followUpDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
    })
      .sort({ followUpDate: 1 })
      .limit(5)
      .select('name company followUpDate status priority')
      .lean(),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
  const monthlyGrowth =
    lastMonthCount > 0
      ? (((thisMonthCount - lastMonthCount) / lastMonthCount) * 100).toFixed(1)
      : thisMonthCount > 0
        ? '100'
        : '0';

  return {
    stats: {
      totalLeads,
      newLeads,
      convertedLeads,
      lostLeads,
      conversionRate: parseFloat(conversionRate),
      monthlyGrowth: parseFloat(monthlyGrowth),
      thisMonthCount,
    },
    statusBreakdown: statusBreakdown.map((s) => ({ name: s._id, value: s.count })),
    sourceBreakdown: sourceBreakdown.map((s) => ({ name: s._id, value: s.count })),
    monthlyTrend,
    upcomingFollowUps,
    recentLeads,
  };
};

async function getMonthlyTrend() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const trend = await Lead.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        leads: { $sum: 1 },
        converted: {
          $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return trend.map((t) => ({
    month: `${monthNames[t._id.month - 1]} ${t._id.year}`,
    leads: t.leads,
    converted: t.converted,
  }));
}
