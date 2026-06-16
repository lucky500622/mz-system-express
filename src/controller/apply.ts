import { v4 as uuidv4 } from 'uuid'

import pool from '../config/db.ts'
import { Controller } from '../types/express.ts'
import { addApplyModel, getApplyListModel, isApplyExistModel, approveApplyModel, getApplyInfoModel } from '../model/apply.ts'
import { userRoleModelByUserName } from '../model/user.ts'
import { sendToUser } from './sseHandler.ts'
import { updateUserRoleModel } from '../model/user.ts'
import { handleWarehouseModel } from '../model/warehouse.ts'

// 添加申请
export const addApply: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 申请角色判断
      const { approve_user_name, apply_role } = req.body
      const userInfo = await userRoleModelByUserName(approve_user_name, connection)
      if (userInfo.user_role !== 'sup_admin' || !userInfo.user_role) {
        res.json({
          code: 4032,
          message: '审批用户角色必须为sup_admin',
        })
        connection.rollback()
        return
      }
      if (apply_role === 'sup_admin' || apply_role === res.locals.userInfo.user_role) {
        res.json({
          code: 4033,
          message: '申请用户角色不能为sup_admin或不变',
        })
        connection.rollback()
        return
      }

      // 判断是否已存在申请
      const isExist = await isApplyExistModel(res.locals.userInfo.user_id, connection)
      if (isExist) {
        res.json({
          code: 4031,
          message: '已存在申请，请联系管理员',
        })
        connection.rollback()
        return
      }

      // 若用户先前为上架管理员，则需判断是否存在经手仓库
      if (res.locals.userInfo.user_role === 'staff') {
        const handleInfo = await handleWarehouseModel(res.locals.userInfo.user_id, connection)
        if (handleInfo.length > 0) {
          res.json({
            code: 4034,
            message: '用户已绑定经手仓库，不能申请上架管理员',
          })
          connection.rollback()
          return
        }
      }

      // 添加申请
      const apply_id = uuidv4()
      const isAdd = await addApplyModel(apply_id, res.locals.userInfo.user_id, approve_user_name, apply_role, connection)
      if (!isAdd) throw new Error('添加申请失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    // 通知审批用户申请添加
    sendToUser(true, '成员申请')

    res.json({
      code: 200,
      message: '添加申请成功',
    })

  } catch (err) {
    next(err)
  }
}

// 获取申请列表
export const getApplyList: Controller<void> = async (req, res, next) => {
  try {
    // 获取申请列表
    const applyList = await getApplyListModel()

    res.json({
      code: 200,
      message: '获取申请列表成功',
      data: {
        applyList
      },
    })
  } catch (err) {
    next(err)
  }
}

// 审批申请
export const approveApply: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 审批申请
      const { m_id, apply_status } = req.body
      const isApprove = await approveApplyModel(m_id, apply_status, connection)
      if (!isApprove) throw new Error('审批申请失败')

      // 获取申请人ID
      const { user_name } = req.body
      const userInfo = await userRoleModelByUserName(user_name, connection)
      if (!userInfo) throw new Error('用户不存在')

      if (apply_status === 1) {
        // 更新用户角色
        const { apply_role } = req.body
        const isUpdate = await updateUserRoleModel(userInfo.user_id, apply_role, connection)
        if (!isUpdate) throw new Error('更新用户角色失败')
      }

      sendToUser(false, '申请完成', user_name)

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '审批申请成功',
    })
  } catch (err) {
    next(err)
  }
}

// 获取某用户的申请信息
export const getApplyInfo: Controller<void> = async (req, res, next) => {
  try {
    const applyInfo = await getApplyInfoModel(res.locals.userInfo.user_id)

    res.json({
      code: 200,
      message: '获取申请信息成功',
      data: applyInfo || {}
    })
  } catch (err) {
    next(err)
  }
}
