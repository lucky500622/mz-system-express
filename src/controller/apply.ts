import { v4 as uuidv4 } from 'uuid'

import pool from '../config/db.ts'
import { Controller } from '../types/express.ts'
import { addApplyModel } from '../model/apply.ts'
import { userRoleModel, userInfoModel } from '../model/user.ts'

// 添加申请
export const addApply: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 申请角色判断
      const { approve_user_name, apply_role } = req.body
      const approve_role = await userRoleModel(approve_user_name, connection)
      if (approve_role !== 'sup_admin' || !approve_role) throw new Error('审批用户角色必须为sup_admin或不存在')
      if (apply_role === 'sup_admin' || apply_role === res.locals.userInfo.user_role) throw new Error('申请用户角色不能为sup_admin或不变')

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

    res.json({
      code: 200,
      message: '添加申请成功',
    })

  } catch (err) {
    next(err)
  }
}
