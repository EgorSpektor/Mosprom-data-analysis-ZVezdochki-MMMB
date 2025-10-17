import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

interface DataPreviewProps {
  filename: string
  onAnalysisComplete: (data: any) => void
}

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export default function DataPreview({ filename, onAnalysisComplete }: DataPreviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { data: previewData, isLoading, error } = useQuery({
    queryKey: ['dataPreview', filename],
    queryFn: () => api.get(`/api/data/${filename}`).then(res => res.data),
    enabled: !!filename
  })

  const runAnalysis = async () => {
    if (!previewData?.preview) return

    setIsAnalyzing(true)
    try {
      const response = await api.post('/api/analysis/basic', {
        filename,
        data: previewData.preview
      })
      onAnalysisComplete(response.data)
    } catch (error) {
      console.error('Ошибка анализа:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) return <div>Загрузка данных...</div>
  if (error) return <div>Ошибка загрузки данных</div>
  if (!previewData) return null

  const { info, preview } = previewData

  return (
    <div className="data-preview">
      <h2>Превью данных: {filename}</h2>
      
      <div className="data-info">
        <div className="info-grid">
          <div className="info-item">
            <div className="info-value">{info.shape[0]}</div>
            <div className="info-label">Строк</div>
          </div>
          <div className="info-item">
            <div className="info-value">{info.shape[1]}</div>
            <div className="info-label">Столбцов</div>
          </div>
          <div className="info-item">
            <div className="info-value">{Object.values(info.missing_values).reduce((a: any, b: any) => a + b, 0)}</div>
            <div className="info-label">Пропущенных значений</div>
          </div>
        </div>
      </div>

      <button 
        className="button" 
        onClick={runAnalysis}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? 'Анализ...' : 'Запустить анализ'}
      </button>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {info.columns.map((col: string) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.slice(0, 10).map((row: any, index: number) => (
              <tr key={index}>
                {info.columns.map((col: string) => (
                  <td key={col}>{String(row[col] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}