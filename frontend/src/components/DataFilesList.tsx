import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface DataFilesListProps {
  onFileSelect: (filename: string) => void
  selectedFile: string | null
}

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

export default function DataFilesList({ onFileSelect, selectedFile }: DataFilesListProps) {
  const { data: filesData, isLoading, error } = useQuery({
    queryKey: ['dataFiles'],
    queryFn: () => api.get('/api/data/files').then(res => res.data)
  })

  if (isLoading) return <div>Загрузка файлов...</div>
  if (error) return <div>Ошибка загрузки файлов</div>

  const files = filesData?.files || []

  return (
    <div>
      <h3>Файлы данных</h3>
      {files.length === 0 ? (
        <p>Нет доступных файлов данных. Добавьте файлы в папку /data</p>
      ) : (
        <ul className="file-list">
          {files.map((filename: string) => (
            <li
              key={filename}
              className={`file-item ${selectedFile === filename ? 'selected' : ''}`}
              onClick={() => onFileSelect(filename)}
            >
              {filename}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}