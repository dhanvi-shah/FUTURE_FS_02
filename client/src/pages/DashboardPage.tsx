import { Link } from 'react-router-dom';
import { Users, UserPlus, TrendingUp, Target, XCircle, Calendar, Plus, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { StatCard, StaggerContainer, StaggerItem } from '../components/dashboard/StatCard';
import { StatusPieChart, SourceBarChart, TrendAreaChart } from '../components/dashboard/Charts';
import { Card, CardSkeleton } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { formatDate, formatRelativeTime } from '../utils';

export const DashboardPage = () => {
  const { data, isLoading, error } = useAnalytics();

  if (error) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description={error}
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const { stats, statusBreakdown, sourceBreakdown, monthlyTrend, upcomingFollowUps, recentLeads } = data;

  return (
    <div className="space-y-8">
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={Users}
            gradient="bg-gradient-to-br from-accent-purple to-accent-blue"
            change={stats.monthlyGrowth}
            delay={0}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            icon={UserPlus}
            gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
            delay={0.1}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Converted"
            value={stats.convertedLeads}
            icon={Target}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            delay={0.2}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Conversion Rate"
            value={stats.conversionRate}
            suffix="%"
            decimals={1}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-amber-500 to-orange-500"
            delay={0.3}
          />
        </StaggerItem>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusPieChart data={statusBreakdown} />
        <SourceBarChart data={sourceBreakdown} />
      </div>

      <TrendAreaChart data={monthlyTrend} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" delay={0.2}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold">Recent Leads</h3>
            <Link to="/leads">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View all
              </Button>
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead, i) => (
                <Link
                  key={lead._id}
                  to={`/leads/${lead._id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-4">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-text-muted">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} size="sm" />
                    <span className="text-xs text-text-muted hidden sm:block">
                      {formatRelativeTime(lead.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card delay={0.3}>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-accent-cyan" />
            <h3 className="text-sm font-semibold">Upcoming Follow-ups</h3>
          </div>
          {upcomingFollowUps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted">You&apos;re all caught up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingFollowUps.map((lead) => (
                <Link
                  key={lead._id}
                  to={`/leads/${lead._id}`}
                  className="block p-3 rounded-xl bg-white/[0.02] border border-border/50 hover:border-accent-purple/20 transition-colors"
                >
                  <p className="text-sm font-medium">{lead.name}</p>
                  <p className="text-xs text-text-muted">{lead.company}</p>
                  <p className="text-xs text-accent-cyan mt-1">
                    {formatDate(lead.followUpDate)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card delay={0.4}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Quick Actions</h3>
            <p className="text-xs text-text-muted">Get started with common tasks</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/leads">
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add Lead
              </Button>
            </Link>
            <Link to="/leads">
              <Button variant="secondary" size="sm" leftIcon={<Users className="w-4 h-4" />}>
                View Leads
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{stats.lostLeads}</p>
            <p className="text-xs text-text-muted flex items-center justify-center gap-1 mt-1">
              <XCircle className="w-3 h-3" /> Lost Leads
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-purple">{stats.thisMonthCount}</p>
            <p className="text-xs text-text-muted mt-1">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">+{stats.monthlyGrowth}%</p>
            <p className="text-xs text-text-muted mt-1">Monthly Growth</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-cyan">{upcomingFollowUps.length}</p>
            <p className="text-xs text-text-muted mt-1">Follow-ups (7d)</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
