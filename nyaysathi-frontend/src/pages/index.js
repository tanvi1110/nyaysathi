import Layout from '../components/layout/Layout';
import AgendaSection from '../components/dashboard/AgendaSection';
import FinancialMetrics from '../components/dashboard/FinancialMetrics';
import AnnualReport from '../components/dashboard/AnnualReport';

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6 bg-[#F4F5FF] min-h-screen">
        <AgendaSection />
        <FinancialMetrics />
        <AnnualReport />
      </div>
    </Layout>
  );
};

export default Dashboard;