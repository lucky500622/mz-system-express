import express from 'express'
const router = express.Router()

import { register, checkUsername, login } from '../controller/user.ts'
import { registerValidator, loginValidator, checkUsernameValidator } from '../validator/user.ts'

// 用户注册
router.post('/register', registerValidator, register)

// 用户名查重
router.get('/register/checkUsername', checkUsernameValidator, checkUsername)

// 用户登录
router.post('/login', loginValidator, login)

export default router
