interface AnalysisResultsProps {
  data: {
    summary: any
    statistics: any
  }
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  const { summary, statistics } = data

  return (
    <div className="analysis-results">
      <h2>Результаты анализа</h2>
      
      <div className="analysis-section">
        <h3>Общая информация</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-value">{summary.total_rows}</div>
            <div className="info-label">Всего строк</div>
          </div>
          <div className="info-item">
            <div className="info-value">{summary.total_columns}</div>
            <div className="info-label">Всего столбцов</div>
          </div>
          <div className="info-item">
            <div className="info-value">{summary.numeric_columns}</div>
            <div className="info-label">Числовых столбцов</div>
          </div>
          <div className="info-item">
            <div className="info-value">{summary.categorical_columns}</div>
            <div className="info-label">Категориальных столбцов</div>
          </div>
          <div className="info-item">
            <div className="info-value">{summary.missing_values_total}</div>
            <div className="info-label">Пропущенных значений</div>
          </div>
          <div className="info-item">
            <div className="info-value">{Math.round(summary.memory_usage / 1024)} KB</div>
            <div className="info-label">Использование памяти</div>
          </div>
        </div>
      </div>

      {Object.keys(statistics).length > 0 && (
        <div className="analysis-section">
          <h3>Описательная статистика</h3>
          <div className="stats-grid">
            {Object.entries(statistics).map(([column, stats]: [string, any]) => (
              <div key={column} className="stat-card">
                <h4>{column}</h4>
                <div>
                  <strong>Среднее:</strong> {stats.mean?.toFixed(2) || 'N/A'}
                </div>
                <div>
                  <strong>Медиана:</strong> {stats['50%']?.toFixed(2) || 'N/A'}
                </div>
                <div>
                  <strong>Мин:</strong> {stats.min?.toFixed(2) || 'N/A'}
                </div>
                <div>
                  <strong>Макс:</strong> {stats.max?.toFixed(2) || 'N/A'}
                </div>
                <div>
                  <strong>Ст. отклонение:</strong> {stats.std?.toFixed(2) || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}