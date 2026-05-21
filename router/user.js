import express from 'express'
const router = express.Router()

import { register } from '../controller/user.js'
import { registerValidator } from '../validator/user.js'

// 用户注册
router.post('/register', registerValidator, register)

export default router
