import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import routes from './routes/index.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { ERROR_GENERIC } from './utils/responseUtils.js'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 8000

const app = express()

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

connectDB()

// Use the defined routes
app.use('/api', routes)

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode
    ? err.statusCode
    : err.status
    ? err.status
    : 500
  const message = err.statusCode || err.status ? err.message : ERROR_GENERIC
  res.status(statusCode).send({ statusCode, success: false, message })
})

// Start the server
app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`
  console.log(`Server running on port ${PORT}`)
  console.log(`Web server listening at: ${baseUrl}`)
})
