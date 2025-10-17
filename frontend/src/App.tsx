import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import DataFilesList from './components/DataFilesList'
import DataPreview from './components/DataPreview'
import AnalysisResults from './components/AnalysisResults'
import Analytics from './components/Analytics'
import './App.css'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'data' | 'analytics'>('data')

  const { data: healthCheck } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then(res => res.data)
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mosprom Data Analysis</h1>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Данные
          </button>
          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Аналитика
          </button>
        </nav>
        <div className="status">
          API Status: {healthCheck ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'data' ? (
          <>
            <div className="sidebar">
              <DataFilesList 
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
              />
            </div>

            <div className="content">
              {selectedFile && (
                <DataPreview 
                  filename={selectedFile}
                  onAnalysisComplete={setAnalysisData}
                />
              )}
              
              {analysisData && (
                <AnalysisResults data={analysisData} />
              )}
            </div>
          </>
        ) : (
          <div className="content full-width">
            <Analytics />
          </div>
        )}
      </main>
    </div>
  )
}

export default App