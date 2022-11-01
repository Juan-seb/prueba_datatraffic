import * as dotenv from 'dotenv'
import path from 'path'
import knex from 'knex'

dotenv.config();

const dbname = process.env.CRUD_DBNAME || 'data';
const port = process.env.EXPRESS_PORT || ''
const apiBaseURL = process.env.API_BASE_URL || `http://localhost:${port}`

const knexConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(`./data/${dbname}.db`),
  },
})

const getNextPage = (quantity, page) => {

  const pages = Math.trunc(quantity/20) + 1

  if(parseInt(page) < pages) {
    return parseInt(page) + 1
  }

  return null

}

const getPrevPage = (page) => {

  if(parseInt(page) === 1){
    return null
  }

  return parseInt(page) - 1

}

const getRecordsInEntity = async ({ db_entity, page }) => {

  let perPage = 20
  let pageToRequest = page || '1'


  const sqlToGetTotalRecords = `SELECT COUNT(*) as total FROM ${db_entity};`
  const sqlToGetRecords = `SELECT * FROM ${db_entity} LIMIT ${perPage} OFFSET ${(pageToRequest - 1) * perPage};`

  if (db_entity === '') {
    throw new Error('Not entity in the request')
  }


  try {
 
    const resSqlTotal = await knexConnection.raw(sqlToGetTotalRecords)
    const resSqlRecords = await knexConnection.raw(sqlToGetRecords)

    let count = resSqlTotal[0].total || 0;

    const jsonRecords = resSqlRecords.map(record => {

      let regOut = {}

      Object.keys(record).forEach(field => {
        regOut[field] = record[field];

        try {
          regOut[field] = JSON.parse(record[field])
        } catch (error) {}

      });

      return regOut;
    });

    const results = {
      info: {
        count,
        pages: Math.ceil(count / perPage),
        next: getNextPage(count, pageToRequest) ? `${apiBaseURL}/${db_entity}/?page=${getNextPage(count, pageToRequest)}` : null,
        prev: getPrevPage(pageToRequest) ? `${apiBaseURL}/${db_entity}/?page=${getPrevPage(pageToRequest)}` : null
      },
      results: jsonRecords
    }

    return results;

  } catch (error) {
    /* throw new Error('Error in the sql query') */
    console.log(error)
  }

}

const getEntityById = async (db_entity, id) => {

  const sqlToQuery = `SELECT * FROM ${db_entity} WHERE id=${id};`

  if (db_entity === '' || id === '') {
    throw new Error('Not entity or id in the request')
  }

  try {

    const result = await knexConnection.raw(sqlToQuery)

    const jsonRecord = result.map(record => {

      let regOut = {}

      Object.keys(record).forEach(field => {
        regOut[field] = record[field];
        try {
          regOut[field] = JSON.parse(record[field])
        } catch (error) {}

      });

      return regOut
    })

    return jsonRecord

  } catch (error) {
    throw new Error('Error in the sql query')
  }

}

const deleteRecordInEntity = async (db_entity, id) => {

  const sqlToDeleteRecord = `DELETE FROM ${db_entity} WHERE id=${id};`
  
  if (db_entity === '' || id === '') {
    throw new Error('Not entity or id in the request')
  }

  try {

    const result = await knexConnection.raw(sqlToDeleteRecord);
    console.log(result);

  } catch (error) {
    throw new Error('Error in the sql query')
  }

}

// * Upsert: Update - insert

const upsertRecordInEntity = async (db_entity, options) => {

  const { data } = options
  const vals = []
  const valsUpdate = []
  const cols = Object.keys(data).join(',')

  if (Object.keys(data).length === '0') {
    throw new Error('The request doesnt send any information')
  }
  
  Object.keys(data).forEach(key => {

    let value = data[key]

    vals.push(`'${value}'`)
    valsUpdate.push(`${key}='${value}'`)

  });

  try {

    let valsToUpdate = vals.join(',')
    let valsToSet = valsUpdate.join(',')

    const sqlToUpsertARecord = `INSERT INTO ${db_entity} (${cols}) VALUES (${valsToUpdate}) ON CONFLICT (id) DO UPDATE SET ${valsToSet};`

    const result = await knexConnection.raw(sqlToUpsertARecord);

    console.log(result)

  } catch (error) {
    console.log(error)
    throw new Error('Error in the upsert entity')
  }
}

export {
  getRecordsInEntity,
  getEntityById,
  deleteRecordInEntity,
  upsertRecordInEntity,
}
