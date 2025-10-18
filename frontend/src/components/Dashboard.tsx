import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  useEffect(() => {
    const inns = input.split(/\s+/).map((s) => s.trim()).filter(Boolean);
    if (inns.length === 0) {
      setFilteredData([]);
    } else {
      const result = mockData.filter((item) => inns.includes(item.inn));
      setFilteredData(result);
    }
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
      <h1>Дашборд предприятий (Mock Data)</h1>

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
