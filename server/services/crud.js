import { open } from 'sqlite3'
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'
import path from 'path'
import sqlite from 'sqlite'
import knex from 'knex'

dotenv.config();

const apiBaseURL = process.env.API_BASE_URL || 'http://localhost'

const knexConnection = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(`./data/${dbname}.db`),
  },
})

const getEntitiesAll = async ({ db_entity, page }) => {

  let count
  let perPage = 20

  const sqlToGetTotalRecords = `SELECT COUNT(*) as total FROM ${db_entity};`
  const sqlToGetRecords = `SELECT * FROM ${db_entity} LIMIT ${perPage} OFFSET ${(page - 1) * perPage};`

  if (db_entity === '' || page === '') {
    throw new Error('Not entity in the request')
  }


  try {
    const resSqlTotal = await knexConnection.raw(sqlToGetTotalRecords)
    const resSqlRecords = await knexConnection.raw(sql)

    count = resSqlTotal[0].total || 0;

    const jsonRecords = resSqlRecords.map(record => {

      let regOut = {};

      Object.keys(record).forEach(field => {
        regOut[field] = record[field];

        try {
          regOut[field] = JSON.parse(reg[field]);
        } catch { }

      });
      return regOut;
    });

    let results = {
      info: {
        count,
        pages: Math.ceil(count / perPage)
      },
      results: jsonRs
    }

    knex.destroy();
    return results;
    
  } catch (error) {
    throw new Error('Error in the sql query')
  }

}

const getEntityById = async (db_entity, id, options) => {

}

const deleteEntity = async (entity, id) => {

  let dbname = process.env.CRUD_DBNAME || 'data';
  let db_entity = entity;

  const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: path.resolve(`./data/${dbname}.db`),
    },
  });

  let sql = `
        DELETE FROM
            ${db_entity}
        WHERE
            id=${id}
    ;`;
  const result = await knex.raw(sql);

  knex.destroy();

  console.log(result);
}

const upsertEntity = async (db_entity, options = {}) => {
  let dbname = process.env.CRUD_DBNAME || 'data';
  let db_entity = entity;

  const {
    data = {}
  } = options;

  let cols = Object.keys(data).join(',');

  let vals = [];
  let valsUpdate = [];
  Object.keys(data).forEach(k => {
    let value = data[k];
    vals.push(`'${value}'`);
    valsUpdate.push(`${k}='${value}'`);
  });
  vals = vals.join(',');

  const knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: path.resolve(`./data/${dbname}.db`),
    },
  });

  let sql = `
        INSERT INTO
            ${db_entity}
            (${cols})
        VALUES
            (${vals})
        
        ON CONFLICT (id) 
        DO 
            UPDATE SET 
            ${valsUpdate}
    ;`;
  console.log({ sql });
  const result = await knex.raw(sql);

  knex.destroy();

  console.log(result);
}

const migrateEntity = async (entity) => {
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

const getMigrateEntitiesAll = async (options) => {
  const {
    entity = '',
    page = 1
  } = options;

  let url = `${apiBaseURL}/${entity}/?page=${page}`;

  let rspJson = await fetch(url)
    .then(rslt => rslt.json())
    .catch(err => {
      console.log({ err });
    })
    ;
  return rspJson;
}

const getMigrateEntityById = async (entity, id) => {
  let url = `${apiBaseURL}/${entity}/${id}`;
  let rspJson = await fetch(url)
    .then(rslt => rslt.json())
    .catch(err => {
      console.log({ err });
    });
  return rspJson;
}

export {
  getEntitiesAll,
  getEntityById,
  deleteEntity,
  upsertEntity,
  migrateEntity,
  getMigrateEntitiesAll,
  getMigrateEntityById
}
