import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewProjectWizardPage } from './pages/NewProjectWizardPage';
import { DemoWorkflowPage } from './pages/DemoWorkflowPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';

function App() {
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage onToast={setToast} />} />
        <Route path="/wizard" element={<NewProjectWizardPage onToast={setToast} />} />
        <Route path="/demo" element={<DemoWorkflowPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage onToast={setToast} />} />
      </Routes>
      {toast && <Toast message={toast} />}
    </Layout>
  );
}

export default App;
