import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Dashboard from './components/Dashboard'; //дашборд с гистограммами и поиском по ИНН
import './App.css';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'report'>('main');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [companyInn, setCompanyInn] = useState<string>(''); //поиск компании по инн

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
            

            {/* Дашборд с двумя гистограммами */}
            <Dashboard innFilter={companyInn} />
          </div>
        )}

        {activeTab === 'report' && (
          <div className="content full-width" style={{ padding: '2rem' }}>
            <h2>Отчет по году и компании</h2>

            {/* Выбор года */}
            <label>
              Год:
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ marginLeft: '0.5rem', padding: '5px' }}
              >
                <option value="">--Выберите год--</option>
                {/* Сюда можно подгружать список годов с бэкенда */}
              </select>
            </label>

            {/* Ввод ИНН компании */}
            <label style={{ marginLeft: '1rem' }}>
              Компания (ИНН):
              <input
                type="text"
                placeholder="Введите ИНН компании"
                value={companyInn}
                onChange={(e) => setCompanyInn(e.target.value)}
                style={{ marginLeft: '0.5rem', padding: '5px' }}
              />
            </label>

            {/* Здесь будет отображение отчета */}
            <div style={{ marginTop: '2rem' }}>
              {selectedYear && companyInn ? (
                <p>Здесь будет отчет для компании с ИНН {companyInn} за {selectedYear} год</p>
              ) : (
                <p>Выберите год и введите ИНН компании, чтобы увидеть отчет</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
