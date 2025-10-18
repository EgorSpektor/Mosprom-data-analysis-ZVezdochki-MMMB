import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Dashboard from './components/Dashboard'; //дашборд с гистограммами и поиском по ИНН
import CompanyReport from './components/CompanyReport';
import './App.css';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'report'>('main');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [companyInn, setCompanyInn] = useState<string>(''); // для отчета

  // Проверка статуса API
  const { data: healthCheck } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then(res => res.data)
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mosprom Data Analysis</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'main' ? 'active' : ''}`}
            onClick={() => setActiveTab('main')}
          >
            Основная
          </button>
          <button
            className={`nav-tab ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Отчет
          </button>
        </nav>
        <div className="status">
          API Status: {healthCheck ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'main' && (
          <div className="content full-width" style={{ padding: '2rem' }}>


            {/* Дашборд с гистограммами */}
            <Dashboard />
          </div>
        )}

        {activeTab === 'report' && (
          <CompanyReport
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            companyInn={companyInn}
            setCompanyInn={setCompanyInn}
          />
        )}
      </main>
    </div>
  );
}

export default App;
