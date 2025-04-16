import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)
  const [lastRide, setLastRide] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  // ローカルデータを取得
  const loadLocalData = () => {
    const savedData = localStorage.getItem('buslogData')
    if (savedData) {
      const data = JSON.parse(savedData)
      setCount(data.count)
      setLastRide(data.lastRide ? new Date(data.lastRide) : null)
    }
  }

  // データを読み込む
  useEffect(() => {
    loadLocalData()
  }, [])

  const handleRide = () => {
    const newCount = count + 1
    const newLastRide = new Date()
    const data = {
      count: newCount,
      lastRide: newLastRide.toISOString()
    }
    localStorage.setItem('buslogData', JSON.stringify(data))
    setCount(newCount)
    setLastRide(newLastRide)
  }

  const handleReset = () => {
    if (window.confirm('本当にデータをリセットしますか？')) {
      localStorage.removeItem('buslogData')
      setCount(0)
      setLastRide(null)
    }
  }

  const handleAuth = (e) => {
    e.preventDefault()
    // 簡易認証 (ユーザー名のみチェック)
    if (username.trim() === '') {
      alert('ユーザー名を入力してください')
      return
    }
    setToken(username)
    localStorage.setItem('token', username)
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setCount(0)
    setLastRide(null)
  }

  const formatDate = (date) => {
    if (!date) return 'まだ乗車記録がありません'
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">🚍 BusLog</h1>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ユーザー名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {isRegistering ? '登録' : 'ログイン'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-blue-500 hover:text-blue-700 text-sm"
            >
              {isRegistering ? '既にアカウントをお持ちですか？ログイン' : '新規登録はこちら'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">🚍 BusLog</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ログアウト
          </button>
        </div>
        
        <button
          onClick={handleRide}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-lg text-xl mb-6 transition-colors"
        >
          バスに乗った！
        </button>

        <div className="space-y-4 mb-6">
          <p className="text-lg">回数: {count} 回</p>
          <p className="text-lg">合計: ¥{count * 230}</p>
          <p className="text-lg">最後に乗った日: {formatDate(lastRide)}</p>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          データをリセット
        </button>
      </div>
    </div>
  )
}

export default App
