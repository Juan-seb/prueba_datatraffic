import { Router } from 'express'
import { getEntitiesAll, getEntityById, upsertEntity, deleteEntity } from '../services/crud.js'

const routerCrud = Router()

/* router.get('/migrate/:entity', async (req, res) => {
  let { entity } = req.params

  crud.migrateEntity(entity)

  res
    .status(200)
    .send(`200: ${entity} migrated`)
}) */

router.get('/:entity', async (req, res) => {
  const { page } = req.query

  const { entity } = req.params

  let options = {
    db_entity: entity,
    page
  }

  try {
    const data = await getEntitiesAll(options)

    res
      .status(200)
      .json(data)

  } catch (error) {

    res.status(500).json({ error })

  }

})

router.get('/:entity/:id', async (req, res) => {

  const { entity, id } = req.params;

  try {
    const data = await getEntityById(entity, id);

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({ error })
  }

})

router.post('/:entity', async (req, res) => {
  const { entity } = req.params

  const data = req.body

  try {
    await upsertEntity(entity, { data })

    res.status(200)
      .json({
        error: false,
        msg: 'Registro creado'
      })

  } catch (error) {

    res.status(500).json({ error })

  }

})

router.patch('/:entity', async (req, res) => {

  const { entity } = req.params

  const data = req.body

  try {
    await service.upsertEntity(entity, { data })

    res.status(200).json({
      error: false,
      msg: 'Registro creado'
    })
  } catch (error) {

    res.status(500).json({ error })

  }

})

router.delete('/:entity', async (req, res) => {
  const { entity } = req.params

  const { id } = req.query

  try {

    await deleteEntity(entity, id);
    res.status(200).json({
      error: false,
      msg: 'Registro eliminado'
    })

  } catch (error) {
    res.status(500).json({ error })
  }

})

export {routerCrud}
