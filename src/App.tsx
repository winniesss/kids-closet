import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex justify-center gap-6">
          <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
            <img src={reactLogo} className="h-16 w-16 animate-spin" alt="React logo" style={{ animationDuration: '3s' }} />
          </a>
        </div>
        
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Vite + React
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            count is {count}
          </button>
          
          <p className="text-center text-gray-600">
            Edit <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-gray-800">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          Click on the Vite and React logos to learn more
        </p>
        
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✅ Tailwind CSS 已成功配置！这些样式都是使用 Tailwind 类名实现的。
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
