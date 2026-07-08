import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { FileText, Calendar, Utensils, MessageSquare } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-bone/50 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-bone/50 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-ink">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Recipes" 
          total={stats.totalRecipes} 
          subtitle={`${stats.publishedRecipes} published`}
          icon={Utensils}
          link="/admin/recipes"
        />
        <StatCard 
          title="Blog Posts" 
          total={stats.totalBlogs} 
          subtitle={`${stats.publishedBlogs} published`}
          icon={FileText}
          link="/admin/blog"
        />
        <StatCard 
          title="Time Slots" 
          total={stats.totalTimeslots} 
          subtitle={`${stats.availableTimeslots} available`}
          icon={Calendar}
          link="/admin/timeslots"
        />
        <StatCard 
          title="Bookings" 
          total={stats.totalBookings} 
          subtitle={`${stats.slotBookings} slot, ${stats.directContacts} direct`}
          icon={MessageSquare}
          link="/admin/bookings"
        />
      </div>
    </div>
  );
}

function StatCard({ title, total, subtitle, icon: Icon, link }: { title: string, total: number, subtitle: string, icon: any, link: string }) {
  return (
    <Link href={link} className="block group">
      <div className="bg-cream border border-ink/10 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-olive/30 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] tracking-[0.1em] uppercase text-ink/50">{title}</div>
          <Icon className="w-5 h-5 text-olive/50 group-hover:text-olive transition-colors" />
        </div>
        <div className="font-display text-4xl text-ink mb-1">{total}</div>
        <div className="text-sm text-ink/50 mt-auto">{subtitle}</div>
      </div>
    </Link>
  );
}
