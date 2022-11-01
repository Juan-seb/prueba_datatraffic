import { Router } from 'express'
import { getRecordsInEntity, getEntityById, upsertRecordInEntity, deleteRecordInEntity } from '../services/crud.js'

const routerCrud = Router()

routerCrud.get('/:entity', async (req, res) => {

  const { page } = req.query
  const { entity } = req.params

  let options = {
    db_entity: entity,
    page
  }

  try {
    const data = await getRecordsInEntity(options)

    res.status(200).json(data)

  } catch (error) {
    res.status(500).json({ error })
  }

})

routerCrud.get('/:entity/:id', async (req, res) => {

  const { entity, id } = req.params;

  try {
    const data = await getEntityById(entity, id);

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({ error })
  }

})

routerCrud.post('/:entity', async (req, res) => {
  const { entity } = req.params

  const data = req.body

  try {
    await upsertRecordInEntity(entity, { data })

    res.status(200).json({
      error: false,
      msg: 'Registro creado'
    })

  } catch (error) {

    console.log(error)

  }

})

routerCrud.patch('/:entity', async (req, res) => {

  const { entity } = req.params

  const data = req.body

  try {
    await upsertRecordInEntity(entity, { data })

    res.status(200).json({
      error: false,
      msg: 'Registro creado o modificado'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ error })

  }

})

routerCrud.delete('/:entity', async (req, res) => {
  const { entity } = req.params

  const { id } = req.query

  try {

    await deleteRecordInEntity(entity, id);
    res.status(200).json({
      error: false,
      msg: 'Registro eliminado'
    })

  } catch (error) {
    res.status(500).json({ error })
  }

})

export { routerCrud }
