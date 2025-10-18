import { useState, useEffect } from "react";
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

interface DataItem {
  inn: string;
  year: number;
  employees: number;
  avgSalary: number;
  revenue: number;
  netProfit: number;
  taxesPaid: number;
  investments: number;
  exportVolume: number;
  landArea: number;
  productionArea: number;
  excises: number;
}

const colors = ["#007acc", "#28a745", "#ffc107", "#17a2b8", "#6f42c1", "#fd7e14", "#20c997", "#e83e8c", "#6610f2", "#dc3545"];

const Dashboard = () => {
  const [input, setInput] = useState(""); // поле для нескольких ИНН
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);

  // Получаем данные компаний по ИНН
  const fetchCompanyData = async (inn: string) => {
    try {
      const response = await api.get(`/company/companies/${inn}/full`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка получения данных для ИНН ${inn}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const inns = input.split(/\s+/).map((s) => s.trim()).filter(Boolean);
    
    if (inns.length === 0) {
      setFilteredData([]);
      return;
    }

    // Загружаем данные для каждого ИНН
    Promise.all(inns.map(inn => fetchCompanyData(inn)))
      .then(results => {
        const validResults = results.filter(result => result && !result.error);
        
        // Преобразуем данные в формат для графиков
        const transformedData: DataItem[] = [];
        
        validResults.forEach(companyInfo => {
          if (companyInfo.company && companyInfo.revenues) {
            const inn = companyInfo.company.inn.toString();
            
            // Группируем данные по годам
            const revenuesByYear: { [year: number]: any } = {};
            companyInfo.revenues.forEach((rev: any) => {
              const year = new Date(rev.date).getFullYear();
              if (!revenuesByYear[year]) {
                revenuesByYear[year] = [];
              }
              revenuesByYear[year].push(rev);
            });

            // Создаем записи для каждого года
            Object.entries(revenuesByYear).forEach(([year, revenues]) => {
              const yearRevenues = revenues as any[];
              const totalRevenue = yearRevenues.reduce((sum, rev) => sum + (rev.amount || 0), 0);
              
              transformedData.push({
                inn,
                year: parseInt(year),
                employees: companyInfo.staff?.length || 0,
                avgSalary: companyInfo.staff?.reduce((sum: number, s: any) => sum + (s.salary || 0), 0) / (companyInfo.staff?.length || 1) || 0,
                revenue: totalRevenue,
                netProfit: companyInfo.profits?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0,
                taxesPaid: companyInfo.taxes?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0,
                investments: companyInfo.investments?.reduce((sum: number, i: any) => sum + (i.amount || 0), 0) || 0,
                exportVolume: 0, // Нет данных в API
                landArea: companyInfo.lands?.reduce((sum: number, l: any) => sum + (l.area || 0), 0) || 0,
                productionArea: 0, // Нет данных в API
                excises: 0, // Нет данных в API
              });
            });
          }
        });
        
        setFilteredData(transformedData);
      })
      .catch(error => {
        console.error('Ошибка загрузки данных компаний:', error);
        setFilteredData([]);
      });
  }, [input]);

  const charts = [
    { key: "revenue", label: "Выручка" },
    { key: "netProfit", label: "Чистая прибыль" },
    { key: "employees", label: "Среднее количество сотрудников" },
    { key: "avgSalary", label: "Средняя зарплата сотрудников" },
    { key: "taxesPaid", label: "Уплаченные налоги" },
    { key: "investments", label: "Инвестиции" },
    { key: "exportVolume", label: "Объём экспорта" },
    { key: "landArea", label: "ЗУ (земельный участок)" },
    { key: "productionArea", label: "Площадь производственных помещений" },
    { key: "excises", label: "Акцизы" },
  ];

  // Получаем уникальные ИНН
  const uniqueInns = Array.from(new Set(filteredData.map((d) => d.inn)));

  // Формируем данные для LineChart по годам
  const chartDataByYear = (metric: string) => {
    const years = Array.from(new Set(filteredData.map((d) => d.year))).sort();
    return years.map((year) => {
      const entry: any = { year };
      filteredData
        .filter((d) => d.year === year)
        .forEach((d) => {
          entry[d.inn] = d[metric as keyof DataItem];
        });
      return entry;
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Дашборд предприятий</h1>

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Введите ИНН через пробел"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "0.5rem", width: "400px" }}
        />
      </div>{filteredData.length === 0 ? (
        <p>Введите ИНН для отображения данных.</p>
      ) : (
        charts.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: "3rem" }}>
            <h2>{label} по годам</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataByYear(key)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                {uniqueInns.map((inn, idx) => (
                  <Line
                    key={inn}
                    type="monotone"
                    dataKey={inn}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2}
                    name={inn}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
