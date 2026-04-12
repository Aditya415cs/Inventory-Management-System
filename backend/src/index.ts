import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import manufacturingRoutes from './routes/manufacturing'
import contactRoutes from './routes/customers'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Health check
app.get('/', (_req, res) => res.json({ status: 'Inventory API running' }))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/manufacturing', manufacturingRoutes)
app.use('/api', contactRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})