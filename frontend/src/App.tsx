import { useState } from "react";
import Dashboard from "./components/Dashboard";
import CompanyReport from "./components/CompanyReport";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"main" | "report">("main");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [companyInn, setCompanyInn] = useState<string>("");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mosprom Data Analysis</h1>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "main" ? "active" : ""}`}
            onClick={() => setActiveTab("main")}
          >
            Основная
          </button>

          <button
            className={`nav-tab ${activeTab === "report" ? "active" : ""}`}
            onClick={() => setActiveTab("report")}
          >
            Отчет
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === "main" && (
          <div className="content full-width" style={{ padding: "2rem" }}>
            <Dashboard />
          </div>
        )}

        {activeTab === "report" && (
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

