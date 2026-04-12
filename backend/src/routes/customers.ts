import { Router } from 'express'
import { supabase } from '../supabase'

const router = Router()

// Customers
router.get('/customers', async (_req, res) => {
  const { data, error } = await supabase.from('customers').select('*').order('name')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.get('/customers/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('customers').select('*').eq('customer_id', req.params.id).single()
  if (error) return res.status(404).json({ error: 'Customer not found' })
  res.json(data)
})

router.post('/customers', async (req, res) => {
  const { data, error } = await supabase
    .from('customers').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// Suppliers
router.get('/suppliers', async (_req, res) => {
  const { data, error } = await supabase.from('suppliers').select('*').order('name')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.get('/suppliers/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('suppliers').select('*').eq('supplier_id', req.params.id).single()
  if (error) return res.status(404).json({ error: 'Supplier not found' })
  res.json(data)
})

router.post('/suppliers', async (req, res) => {
  const { data, error } = await supabase
    .from('suppliers').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router