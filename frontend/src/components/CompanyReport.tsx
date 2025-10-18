import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

interface CompanyReportProps {
  selectedYear: string | null;
  setSelectedYear: (year: string | null) => void;
  companyInn: string;
  setCompanyInn: (inn: string) => void;
}

export default function CompanyReport({ 
  selectedYear, 
  setSelectedYear, 
  companyInn, 
  setCompanyInn 
}: CompanyReportProps) {
  const [companyData, setCompanyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Получение данных компании
  const fetchCompanyData = async () => {
    if (!companyInn) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/company/companies/${companyInn}/full`);
      if (response.data.error) {
        setCompanyData(null);
      } else {
        setCompanyData(response.data);
      }
    } catch (error) {
      console.error('Ошибка получения данных компании:', error);
      setCompanyData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyInn) {
      fetchCompanyData();
    } else {
      setCompanyData(null);
    }
  }, [companyInn]);

  // Получение доступных годов из данных компании
  const getAvailableYears = () => {
    if (!companyData) return [];
    
    const years = new Set<number>();
    
    // Собираем годы из всех источников данных
    if (companyData.revenues) {
      companyData.revenues.forEach((rev: any) => {
        years.add(new Date(rev.date).getFullYear());
      });
    }
    
    if (companyData.profits) {
      companyData.profits.forEach((profit: any) => {
        years.add(new Date(profit.date).getFullYear());
      });
    }
    
    if (companyData.taxes) {
      companyData.taxes.forEach((tax: any) => {
        years.add(new Date(tax.date).getFullYear());
      });
    }

    return Array.from(years).sort((a, b) => b - a);
  };

  // Фильтрация данных по году
  const getDataForYear = (year: string) => {
    if (!companyData || !year) return null;

    const yearNum = parseInt(year);
    
    const revenues = companyData.revenues?.filter((rev: any) => 
      new Date(rev.date).getFullYear() === yearNum
    ) || [];
    
    const profits = companyData.profits?.filter((profit: any) => 
      new Date(profit.date).getFullYear() === yearNum
    ) || [];
    
    const taxes = companyData.taxes?.filter((tax: any) => 
      new Date(tax.date).getFullYear() === yearNum
    ) || [];

    const investments = companyData.investments?.filter((inv: any) => 
      new Date(inv.date).getFullYear() === yearNum
    ) || [];

    return {
      revenues,
      profits,
      taxes,
      investments,
      totalRevenue: revenues.reduce((sum: number, rev: any) => sum + (rev.amount || 0), 0),
      totalProfit: profits.reduce((sum: number, profit: any) => sum + (profit.amount || 0), 0),
      totalTaxes: taxes.reduce((sum: number, tax: any) => sum + (tax.amount || 0), 0),
      totalInvestments: investments.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
    };
  };

  const availableYears = getAvailableYears();
  const yearData = selectedYear ? getDataForYear(selectedYear) : null;

  return (
    <div className="content full-width" style={{ padding: '2rem' }}>
      <h2>Отчет по году и компании</h2>

      {/* Ввод ИНН компании */}
      <div style={{ marginBottom: '1rem' }}>
        <label>
          Компания (ИНН):
          <input
            type="text"
            placeholder="Введите ИНН компании"
            value={companyInn}
            onChange={(e) => setCompanyInn(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '5px', width: '200px' }}
          />
        </label>
        {companyInn && (
          <button 
            onClick={fetchCompanyData}
            style={{ marginLeft: '0.5rem', padding: '5px 10px' }}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Поиск'}
          </button>
        )}
      </div>

      {/* Информация о компании */}
      {companyData && companyData.company && (
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <h3>Информация о компании</h3>
          <p><strong>Название:</strong> {companyData.company.name}</p>
          <p><strong>ИНН:</strong> {companyData.company.inn}</p>
          <p><strong>Адрес:</strong> {companyData.company.address}</p>
          {companyData.company.leader && (
            <p><strong>Руководитель:</strong> {companyData.company.leader}</p>
          )}
        </div>
      )}

      {/* Выбор года */}
      {availableYears.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <label>
            Год:
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value || null)}
              style={{ marginLeft: '0.5rem', padding: '5px' }}
            >
              <option value="">--Выберите год--</option>
              {availableYears.map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Отображение отчета */}
      {loading && <p>Загрузка данных компании...</p>}
      
      {companyInn && !loading && !companyData && (
        <p>Компания с ИНН {companyInn} не найдена</p>
      )}
      
      {companyData && !selectedYear && availableYears.length > 0 && (
        <p>Выберите год для просмотра отчета</p>
      )}
      
      {companyData && availableYears.length === 0 && (
        <p>Нет данных для отображения отчета</p>
      )}

      {yearData && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Отчет за {selectedYear} год</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h4>Выручка</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                {yearData.totalRevenue.toLocaleString()} ₽
              </p>
              <p>Записей: {yearData.revenues.length}</p>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h4>Прибыль</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007acc' }}>
                {yearData.totalProfit.toLocaleString()} ₽
              </p>
              <p>Записей: {yearData.profits.length}</p>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h4>Налоги</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
                {yearData.totalTaxes.toLocaleString()} ₽
              </p>
              <p>Записей: {yearData.taxes.length}</p>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h4>Инвестиции</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
                {yearData.totalInvestments.toLocaleString()} ₽
              </p>
              <p>Записей: {yearData.investments.length}</p>
            </div>
          </div>

          {/* Дополнительная информация */}
          {companyData.staff && companyData.staff.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Персонал</h4>
              <p>Количество сотрудников: {companyData.staff.length}</p>
              <p>Средняя зарплата: {(companyData.staff.reduce((sum: number, s: any) => sum + (s.salary || 0), 0) / companyData.staff.length).toLocaleString()} ₽</p>
            </div>
          )}

          {companyData.lands && companyData.lands.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Земельные участки</h4>
              <p>Количество участков: {companyData.lands.length}</p>
              <p>Общая площадь: {companyData.lands.reduce((sum: number, l: any) => sum + (l.area || 0), 0)} м²</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}