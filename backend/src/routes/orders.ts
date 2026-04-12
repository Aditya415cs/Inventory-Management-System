import { Router } from 'express'
import { supabase } from '../supabase'

const router = Router()


router.get('/', async (req, res) => {
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (req.query.type)   query = query.eq('type', req.query.type)
  if (req.query.status) query = query.eq('status', req.query.status)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', req.params.id)
    .single()
  if (error) return res.status(404).json({ error: 'Order not found' })
  res.json(data)
})


router.post('/', async (req, res) => {
  const { type, customer_id, supplier_id, products, notes } = req.body
  if (!type || !products?.length) {
    return res.status(400).json({ error: 'type and products are required' })
  }
  const { data, error } = await supabase
    .from('orders')
    .insert([{ type, customer_id, supplier_id, products, notes }])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})


router.patch('/:id/status', async (req, res) => {
  const { status } = req.body
  const validStatuses = ['quotation','confirmed','packing','dispatched','completed','cancelled']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_id', req.params.id)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('order_id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Order deleted' })
})

export default router