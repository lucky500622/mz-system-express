import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan'
import cors from 'cors'

import router from './router/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 3000

// 挂载工具中间件
app.use(cors(), express.json(), morgan('dev'))

// 挂载路由中间件
app.use('/api', router)

// 挂载错误处理中间件
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`)
})
