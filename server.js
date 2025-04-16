const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

// データベース接続
const { initDb } = require('./db')
initDb()

// ミドルウェア
app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json())

// データベース初期化
db.initialize()

// 認証ルート
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// バスログデータルート
const buslogRoutes = require('./routes/buslog')
app.use('/api/buslog', buslogRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
