import Layout from '../components/layout/Layout';
import AgendaSection from '../components/dashboard/AgendaSection';
import FinancialMetrics from '../components/dashboard/FinancialMetrics';
import AnnualReport from '../components/dashboard/AnnualReport';

const Dashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen pb-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
            Cases, deadlines, and firm activity in one place. Use the agenda below to stay on top of tasks and hearings.
          </p>
        </header>
        <AgendaSection />
        <FinancialMetrics />
        <AnnualReport />
      </div>
    </Layout>
  );
};

export default Dashboard;