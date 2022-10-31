import { open } from 'sqlite3'
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'
import path from 'path'
import sqlite from 'sqlite'
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

const getRecordsInEntity = async ({ db_entity, page }) => {

  let perPage = 20

  const sqlToGetTotalRecords = `SELECT COUNT(*) as total FROM ${db_entity};`
  const sqlToGetRecords = `SELECT * FROM ${db_entity} LIMIT ${perPage} OFFSET ${(page - 1) * perPage};`

  if (db_entity === '' || page === '') {
    throw new Error('Not entity in the request')
  }


  try {
    let count = resSqlTotal[0].total || 0;

    const resSqlTotal = await knexConnection.raw(sqlToGetTotalRecords)
    const resSqlRecords = await knexConnection.raw(sqlToGetRecords)


    const jsonRecords = resSqlRecords.map(record => {

      let regOut = {}

      Object.keys(record).forEach(field => {
        regOut[field] = record[field];

        try {
          regOut[field] = JSON.parse(reg[field])
        } catch (error) {
          throw new Error(`Error in parsing json at field: ${field}`)
        }

      });

      return regOut;
    });

    let results = {
      info: {
        count,
        pages: Math.ceil(count / perPage)
      },
      results: jsonRecords
    }

    knexConnection.destroy();
    return results;

  } catch (error) {
    throw new Error('Error in the sql query')
  }

}

const getEntityById = async (db_entity, id, options) => {

}

const deleteRecordInEntity = async (db_entity, id) => {

  const sqlToDeleteRecord = `DELETE FROM ${db_entity} WHERE id=${id};`

  if (db_entity === '' || id === '') {
    throw new Error('Not entity or id in the request')
  }

  try {

    const result = await knexConnection.raw(sqlToDeleteRecord);
    knexConnection.destroy();
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

    console.log({ sqlToUpsertARecord });
    console.log(result);

    knexConnection.destroy();

  } catch (error) {
    throw new Error('Error in the upsert entity')
  }
}

/* const migrateEntity = async (entity) => {
  let dbname = process.env.CRUD_DBNAME || 'data';
  let db_entity = entity;
  if (entity.slice(-1) == 's') {
    entity = entity.slice(0, -1);
  }

  // abrir / crear la BD
  let db = await open({
    filename: path.resolve(`./data/${dbname}.db`),
    driver: sqlite.Database
  })
    .catch(err => {
      console.log({ err });
      res
        .status(500)
        .json({
          error: true,
          ...err
        });
    });

  // consulta para obtener el modelo
  let jsonRsp = await getMigrateEntityById(entity, 1);
  let keys = Object.keys(jsonRsp);

  // crear la entidad
  let entityCols = keys.map(key => {
    let type = key === 'id' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'TEXT';
    return `${key} ${type}`
  })
    .join(',');

  let sql = `
        CREATE TABLE IF NOT EXISTS ${db_entity} (${entityCols});
    `;
  let table = await db.exec(sql)
    .catch(err => {
      console.log({ err });
    });

  // poblar la entidad
  let optionsRS = { entity, page: 1 };
  let jsonRS = await getMigrateEntitiesAll(optionsRS);
  let cols = keys.join(',');

  jsonRS.results.map(async reg => {
    let vals = "'" + Object.keys(reg)
      .map(col => {
        let value = (typeof reg[col] === 'object')
          ? JSON.stringify(reg[col])
          : reg[col]
          ;
        value = String(value).replace(/'/g, '');
        return value;
      }).join("','") + "'"
      ;
    let sql = `
            INSERT INTO
                ${db_entity}
                (${cols})
            VALUES
                (${vals})
        ;`;
    const result = await db.run(sql);
  });

  db.close();
}
 */
const getRecordsEntityPerPage = async (options) => {
  const { entity, page } = options;

  const url = `${apiBaseURL}/${entity}/?page=${page || '1'}`;

  const data = await fetch(url)
    .then(res => res.json())
    .catch(err => {
      console.log({ err })
    })
    
  return data

}

const getRecordInEntityById = async (entity, id) => {

  const url = `${apiBaseURL}/${entity}/${id}`;
  
  const data = await fetch(url)
    .then(res => res.json())
    .catch(err => {
      console.log({ err })
    })

  return data
}

export {
  getRecordsInEntity,
  getEntityById,
  deleteRecordInEntity,
  upsertRecordInEntity,
  /* migrateEntity, */
  getRecordsEntityPerPage,
  getRecordInEntityById
}
