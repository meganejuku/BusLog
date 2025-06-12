const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { db } = require('../../db')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'

// JWT認証ミドルウェア
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ error: '認証が必要です' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: '無効なトークンです' })
  }
}

// 乗車記録を更新
router.post('/ride', authenticate, (req, res) => {
  const userId = req.userId
  const now = new Date().toISOString()

  db.run(
    `UPDATE buslogs 
     SET ride_count = ride_count + 1,
         last_ride = ?
     WHERE user_id = ?`,
    [now, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'データ更新に失敗しました' })
      }
      res.json({ message: '乗車記録を更新しました' })
    }
  )
})

// 統計データを取得
router.get('/stats', authenticate, (req, res) => {
  const userId = req.userId

  db.get(
    'SELECT ride_count, last_ride FROM buslogs WHERE user_id = ?',
    [userId],
    (err, row) => {
      if (err || !row) {
        return res.status(500).json({ error: 'データ取得に失敗しました' })
      }
      
      res.json({
        rideCount: row.ride_count,
        totalAmount: row.ride_count * 230,
        lastRide: row.last_ride
      })
    }
  )
})

// データリセット
router.post('/reset', authenticate, (req, res) => {
  const userId = req.userId

  db.run(
    `UPDATE buslogs 
     SET ride_count = 0,
         last_ride = NULL
     WHERE user_id = ?`,
    [userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'リセットに失敗しました' })
      }
      res.json({ message: 'データをリセットしました' })
    }
  )
})

module.exports = router
