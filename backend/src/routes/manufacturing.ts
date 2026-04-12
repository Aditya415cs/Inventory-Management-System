import { Router } from 'express'
import { supabase } from '../supabase'

const router = Router()


router.get('/', async (req, res) => {
  let query = supabase.from('manufacturing').select('*').order('start_date', { ascending: false })
  if (req.query.status) query = query.eq('status', req.query.status)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


router.get('/:batch', async (req, res) => {
  const { data, error } = await supabase
    .from('manufacturing')
    .select('*')
    .eq('batch_number', req.params.batch)
    .single()
  if (error) return res.status(404).json({ error: 'Batch not found' })
  res.json(data)
})


router.post('/', async (req, res) => {
  const { batch_number, raw_materials, output, notes } = req.body
  if (!batch_number || !raw_materials?.length) {
    return res.status(400).json({ error: 'batch_number and raw_materials are required' })
  }
  
  for (const item of raw_materials) {
    const { error } = await supabase.rpc('adjust_stock', {
      p_code: item.product_code,
      p_qty: -item.qty
    })
    if (error) return res.status(500).json({ error: 'Stock deduction failed: ' + error.message })
  }
  const { data, error } = await supabase
    .from('manufacturing')
    .insert([{ batch_number, raw_materials, output: output ?? [], notes }])
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})


router.patch('/:batch/complete', async (req, res) => {
  const { data: batch, error: fetchErr } = await supabase
    .from('manufacturing')
    .select('*')
    .eq('batch_number', req.params.batch)
    .single()
  if (fetchErr) return res.status(404).json({ error: 'Batch not found' })

  for (const item of batch.output) {
    await supabase.rpc('adjust_stock', { p_code: item.product_code, p_qty: item.qty })
  }
  const { data, error } = await supabase
    .from('manufacturing')
    .update({ status: 'completed', end_date: new Date().toISOString() })
    .eq('batch_number', req.params.batch)
    .select()
    .single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})


router.delete('/:batch', async (req, res) => {
  const { error } = await supabase
    .from('manufacturing')
    .delete()
    .eq('batch_number', req.params.batch)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Batch deleted' })
})

export default router