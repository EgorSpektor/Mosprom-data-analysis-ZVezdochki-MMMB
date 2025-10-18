import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportItem {
  inn: string;
  year: number;
  revenue: number;
  netProfit: number;
  employees: number;
  avgSalary: number;
  taxesPaid: number;
  investments: number;
  exportVolume: number;
  landArea: number;
  productionArea: number;
  excises: number;
}

interface CompanyReportProps {
  selectedYear: string | null;
  setSelectedYear: (value: string | null) => void;
  companyInn: string;
  setCompanyInn: (value: string) => void;
}

const api = axios.create({
  baseURL: "http://localhost:8000", //ссылочка бэкендик
});

const CompanyReport: React.FC<CompanyReportProps> = ({
  selectedYear,
  setSelectedYear,
  companyInn,
  setCompanyInn,
}) => {
  const cleanInn = companyInn.trim();
  const cleanYear = Number(selectedYear);

  //апишка
  const { data, isLoading, isError } = useQuery<ReportItem[], Error>(
    ["companyReport", cleanInn, cleanYear],
    async () => {
      if (!cleanInn || !cleanYear) return [];
      const res = await api.get(`/reports/${cleanInn}?year=${cleanYear}`);
      return res.data;
    },
    { enabled: !!cleanInn && !!cleanYear } //инн и год обязательно выбрать, чтобы сработал запрос
  );

  const report = data && data.length > 0 ? data[0] : null;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Отчет по компании</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label>
          Год:
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "5px" }}
          >
            <option value="">--Выберите год--</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
          </select>
        </label>

        <label style={{ marginLeft: "1rem" }}>
          Компания (ИНН):
          <input
            type="text"
            placeholder="Введите ИНН компании"
            value={companyInn}
            onChange={(e) => setCompanyInn(e.target.value)}
            style={{ marginLeft: "0.5rem", padding: "5px" }}
          />
        </label>
      </div>

      {isLoading && <p>Загрузка данных...</p>}
      {isError && <p>Ошибка при загрузке данных</p>}
      {!selectedYear || !companyInn ? (
        <p>Выберите год и введите ИНН компании, чтобы увидеть отчет</p>
      ) : !report ? (
        <p>Нет данных для ИНН {companyInn} за {selectedYear} год.</p>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h3>Показатели компании</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <tbody>
              <tr><td>ИНН</td><td>{report.inn}</td></tr>
              <tr><td>Год</td><td>{report.year}</td></tr>
              <tr><td>Выручка</td><td>{report.revenue.toLocaleString()} ₽</td></tr>
              <tr><td>Чистая прибыль</td><td>{report.netProfit.toLocaleString()} ₽</td></tr>
              <tr><td>Среднесписочная численность</td><td>{report.employees}</td></tr>
              <tr><td>Средняя зарплата</td><td>{report.avgSalary.toLocaleString()} ₽</td></tr>
              <tr><td>Уплаченные налоги</td><td>{report.taxesPaid.toLocaleString()} ₽</td></tr>
              <tr><td>Инвестиции</td><td>{report.investments.toLocaleString()} ₽</td></tr>
              <tr><td>Объем экспорта</td><td>{report.exportVolume.toLocaleString()} ₽</td></tr>
              <tr><td>Земельный участок</td><td>{report.landArea.toLocaleString()} м²</td></tr>
              <tr><td>Производственные помещения</td><td>{report.productionArea.toLocaleString()} м²</td></tr>
              <tr><td>Акцизы</td><td>{report.excises.toLocaleString()} ₽</td></tr>
            </tbody>
          </table>

          <div style={{ marginTop: "3rem" }}>
            <h3>Динамика выручки и прибыли по годам</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Выручка" stroke="#007acc" strokeWidth={2} />
                <Line type="monotone" dataKey="netProfit" name="Чистая прибыль" stroke="#28a745" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyReport;

