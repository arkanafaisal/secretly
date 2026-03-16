import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from "cors"
import http from 'http'


const app = express()
app.use(express.json())
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

import path from 'path'
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/dist")))

// app.use(cors({
//     origin: process.env.NODE_ENV === "development"? "http://localhost:5173" : "https://secretly.arkanafaisal.my.id",
//     credentials: true,
//     preflightContinue: false,
//     optionsSuccessStatus: 204
// }))


app.listen(process.env.NODE_ENV === "development"? 3000 : 3003, ()=>{console.log("ready")})





import authRouter from './router/auth-router.js'
import usersRouter from './router/users-router.js'
import messagesRouter from './router/messages-router.js'

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/messages', messagesRouter)