import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export default function Analytics() {
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['analyticsEvents'],
    queryFn: () => api.get('/api/analytics/events?limit=10').then(res => res.data),
    refetchInterval: 30000 // Обновление каждые 30 секунд
  })

  const { data: performance, isLoading: perfLoading } = useQuery({
    queryKey: ['performanceMetrics'],
    queryFn: () => api.get('/api/analytics/performance?hours=24').then(res => res.data),
    refetchInterval: 60000 // Обновление каждую минуту
  })

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['analysisJobs'],
    queryFn: () => api.get('/api/jobs?limit=10').then(res => res.data),
    refetchInterval: 10000 // Обновление каждые 10 секунд
  })

  if (eventsLoading || perfLoading || jobsLoading) {
    return <div>Загрузка аналитики...</div>
  }

  return (
    <div className="analytics">
      <h2>Аналитика и мониторинг</h2>
      
      {/* Метрики производительности */}
      <div className="analysis-section">
        <h3>Производительность (24 часа)</h3>
        <div className="stats-grid">
          {performance?.metrics?.map((metric: any, index: number) => (
            <div key={index} className="stat-card">
              <h4>Час: {new Date(metric[0]).toLocaleTimeString()}</h4>
              <div><strong>Среднее время:</strong> {Math.round(metric[1])} мс</div>
              <div><strong>Всего анализов:</strong> {metric[2]}</div>
              <div><strong>Успешных:</strong> {metric[3]}</div>
              <div><strong>Успешность:</strong> {((metric[3] / metric[2]) * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Последние события */}
      <div className="analysis-section">
        <h3>Последние события анализа</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Время</th>
                <th>Файл</th>
                <th>Тип анализа</th>
                <th>Время выполнения</th>
                <th>Строк обработано</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {events?.events?.map((event: any, index: number) => (
                <tr key={index}>
                  <td>{new Date(event[1]).toLocaleString()}</td>
                  <td>{event[3]}</td>
                  <td>{event[4]}</td>
                  <td>{event[5]} мс</td>
                  <td>{event[6]}</td>
                  <td>
                    <span className={event[8] ? 'status-success' : 'status-error'}>
                      {event[8] ? '✅ Успешно' : '❌ Ошибка'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Задачи анализа */}
      <div className="analysis-section">
        <h3>Задачи анализа (PostgreSQL)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Тип</th>
                <th>Статус</th>
                <th>Создано</th>
                <th>Завершено</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.jobs?.map((job: any) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.job_type}</td>
                  <td>
                    <span className={`status-${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.created_at).toLocaleString()}</td>
                  <td>{job.completed_at ? new Date(job.completed_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}