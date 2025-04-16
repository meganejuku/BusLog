const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('./db')

const app = express()
const PORT = 3001

// ミドルウェア設定
app.use(cors())
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
