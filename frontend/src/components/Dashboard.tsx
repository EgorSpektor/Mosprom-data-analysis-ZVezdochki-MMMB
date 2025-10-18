import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  year: number;
  employees: number;
  revenue: number;
}

interface DashboardProps {
  innFilter: string; // фильтр по ИНН компании
}

const Dashboard: React.FC<DashboardProps> = ({ innFilter }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // --- ПОДКЛЮЧИТЬ API ЗДЕСЬ ---
    // Пример запроса к бэкенду (уточнить URL и параметры)
    axios
      .get<DataItem[]>("http://localhost:8000/api/dashboard-data", {
        params: { inn: innFilter } // отправляем фильтр ИНН
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки данных:", err);
        setError("Не удалось загрузить данные с сервера");
        setLoading(false);
      });
  }, [innFilter]); // эффект срабатывает при изменении ИНН

  if (loading) return <div>Загрузка данных...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Дашборд предприятий Москвы</h1>

      {/* Гистограмма сотрудников */}
      <h2>Среднее количество сотрудников по годам</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="employees" fill="#007acc" />
        </BarChart>
      </ResponsiveContainer>

      {/* Гистограмма выручки */}
      <h2 style={{ marginTop: "3rem" }}>Выручка по годам</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#28a745" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
