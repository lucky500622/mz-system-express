import express from 'express'
import { addApplyValidator, approveApplyValidator } from '../validator/apply.ts'
import { addApply, getApplyList, approveApply, getApplyInfo } from '../controller/apply.ts'

const router = express.Router()

// 添加申请路由
router.post('/add', addApplyValidator, addApply)

// 获取申请列表路由
router.get('/list', getApplyList)

// 审批申请路由
router.patch('/approve', approveApplyValidator, approveApply)

// 获取某用户的申请信息路由
router.get('/info', getApplyInfo)

export default router