import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { routerCrud } from './routes/crud.js'


dotenv.config()

const port = process.env.EXPRESS_PORT
const app = express()

app.use(cors())
app.use(express.json())

app.use('/', routerCrud)

app.listen(port)

console.log('App corriendo')