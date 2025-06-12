const express = require('express')
const app = express()
const cors = require('cors')

// データベース接続
const { db, initialize } = require('../db')

// 環境変数
const PORT = process.env.PORT || 3001

// データベース初期化
initialize()

// ミドルウェア
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true
}))

// 認証ルート
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// バスログデータルート
const buslogRoutes = require('./routes/buslog')
app.use('/api/buslog', buslogRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
