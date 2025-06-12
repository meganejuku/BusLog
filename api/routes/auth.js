const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { db } = require('../../db')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

// ユーザー登録
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'ユーザー名が既に使用されています' })
        }
        
        // ユーザー作成後に空のバスログレコードを作成
        db.run(
          'INSERT INTO buslogs (user_id) VALUES (?)',
          [this.lastID],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'データベースエラー' })
            }
            res.status(201).json({ message: 'ユーザー登録が完了しました' })
          }
        )
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラー' })
  }
})

// ログイン
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err || !user) {
          return res.status(401).json({ error: '認証に失敗しました' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return res.status(401).json({ error: '認証に失敗しました' })
        }

        // JWTトークン発行
        const token = jwt.sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        res.json({ token })
      }
    )
  } catch (error) {
    res.status(500).json({ error: 'サーバーエラー' })
  }
})

module.exports = router
