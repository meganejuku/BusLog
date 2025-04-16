const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'buslog.db')
const db = new sqlite3.Database(dbPath)

const initialize = () => {
  db.serialize(() => {
    // ユーザーテーブル作成
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // バスログテーブル作成
    db.run(`
      CREATE TABLE IF NOT EXISTS buslogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        ride_count INTEGER DEFAULT 0,
        last_ride DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `)
  })
}

module.exports = {
  db,
  initialize
}
