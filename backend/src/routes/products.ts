import { Router } from 'express'
import { supabase } from '../supabase'

const router = Router()


router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


router.get('/:code', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('product_code', req.params.code)
    .single()
  if (error) return res.status(404).json({ error: 'Product not found' })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { product_code, name, description, weight, price, quantity } = req.body
  if (!product_code || !name || !price) {
    return res.status(400).json({ error: 'product_code, name and price are required' })
  }
  const { data, error } = await supabase
    .from('products')
    .insert([{ product_code, name, description, weight, price, quantity: quantity ?? 0 }])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})


router.put('/:code', async (req, res) => {
  const { name, description, weight, price, quantity } = req.body
  const { data, error } = await supabase
    .from('products')
    .update({ name, description, weight, price, quantity })
    .eq('product_code', req.params.code)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


router.delete('/:code', async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('product_code', req.params.code)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Product deleted' })
})

export default router