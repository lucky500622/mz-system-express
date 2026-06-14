import express from 'express'
import { addApplyValidator } from '../validator/apply.ts'
import { addApply } from '../controller/apply.ts'

const router = express.Router()

// 添加申请路由
router.post('/add', addApplyValidator, addApply)

export default router