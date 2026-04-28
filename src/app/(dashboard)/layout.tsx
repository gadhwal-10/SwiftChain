import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="dashboard-layout">
      <Sidebar />
      <Topbar />
      <main className="main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
}
