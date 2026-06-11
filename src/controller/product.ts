import { v4 as uuidv4 } from 'uuid'

import { Controller } from '../types/express.ts'

import pool from '../config/db.ts'
import { productPageInfoModel, productPageActionInfoModel, addProductModel, addProductActionInfoModel, productInfoModel, deleteProductModel, adjustProductNumModel, editProductDescriptionModel, productNameModel, warehouseProductModel, listProductModel, productOverviewModel, productDayActionInfoModel } from '../model/product.ts'
import { warehouseInfoModel } from '../model/warehouse.ts'
import { addIssueInfoModel } from '../model/issue.ts'

// 分页获取产品信息
export const productPageInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, m_id, product_name, product_type, warehouse_m_id } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const productInfo = await productPageInfoModel(pageOffset, pageLimit, Number(m_id), String(product_name || ''), String(product_type || ''), Number(warehouse_m_id))
    res.json({
      code: 200,
      message: '产品信息获取成功',
      data: {
        productInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 分页获取产品操作信息
export const productPageActionInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10, m_id, product_m_id, product_name, action_type, user_name } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const actionInfo = await productPageActionInfoModel(pageOffset, pageLimit, Number(m_id), Number(product_m_id), String(product_name || ''), Number(action_type), String(user_name || ''))
    res.json({
      code: 200,
      message: '产品操作信息获取成功',
      data: {
        actionInfo
      }
    })
  } catch (err) {
    next(err)
  }
}

// 新增产品
export const addProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 验证仓库是否存在
      const m_id = req.body.m_id
      const warehouseInfo = await warehouseInfoModel(m_id, connection)
      if (!warehouseInfo) {
        res.json({
          code: 4021,
          message: '仓库不存在'
        })
        connection.rollback()
        return
      }

      // 新增产品
      const { product_name, product_type, product_num, product_description } = req.body
      const product_id = uuidv4()
      const product_isAdd = await addProductModel(product_id, warehouseInfo.warehouse_id, product_name, product_type, product_num, product_description, connection)
      if (!product_isAdd) throw new Error('产品新增失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增产品操作信息
      const product_action_isAdd = await addProductActionInfoModel(issue_id, product_id, 1, product_num, connection)
      if (!product_action_isAdd) throw new Error('产品操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }
    res.json({
      code: 200,
      message: '产品新增成功'
    })
  } catch (err) {
    next(err)
  }
}

// 删除产品
export const deleteProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 验证产品是否存在
      const m_id = Number(req.query.m_id)
      const productInfo = await productInfoModel(m_id, connection)
      if (!productInfo) throw new Error('产品不存在')
      if (productInfo.product_list_num) {
        res.json({
          code: 4023,
          message: '产品已上架，不能删除'
        })
        connection.rollback()
        return
      }

      // 删除产品
      const product_isDelete = await deleteProductModel(m_id, connection)
      if (!product_isDelete) throw new Error('产品删除失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增产品操作信息
      const product_action_isAdd = await addProductActionInfoModel(issue_id, productInfo.product_id, 2, productInfo.product_num, connection)
      if (!product_action_isAdd) throw new Error('产品操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }
    res.json({
      code: 200,
      message: '产品删除成功'
    })
  } catch (err) {
    next(err)
  }
}

// 调整产品数量
export const adjustProductNum: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    // 最终库存数量
    let endNum = 0
    try {
      // 获取产品信息
      const { m_id } = req.body
      const productInfo = await productInfoModel(m_id, connection)
      if (!productInfo) throw new Error('产品不存在')

      // 校验库存是否充足
      const { action_type, product_num } = req.body
      if (action_type === 4) {
        if (productInfo.product_num < product_num) {
          res.json({
            code: 4022,
            message: '库存不足'
          })
          connection.rollback()
          return
        }
        if (productInfo.product_list_num && productInfo.product_diff_num < product_num) {
          res.json({
            code: 4022,
            message: '库存不足'
          })
          connection.rollback()
          return
        }
      }

      // 调整产品数量
      if (action_type === 3) {
        endNum = productInfo.product_num + product_num
      } else if (action_type === 4) {
        endNum = productInfo.product_num - product_num
      }
      const product_isUpdate = await adjustProductNumModel(m_id, endNum, connection)
      if (!product_isUpdate) throw new Error('产品数量调整失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增产品操作信息
      const product_action_isAdd = await addProductActionInfoModel(issue_id, productInfo.product_id, action_type, product_num, connection)
      if (!product_action_isAdd) throw new Error('产品操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '产品数量调整成功',
      data: {
        endNum: endNum
      }
    })
  } catch (err) {
    next(err)
  }
}

// 编辑产品描述
export const editProductDescription: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      // 获取产品信息
      const { m_id } = req.body
      const productInfo = await productInfoModel(m_id, connection)
      if (!productInfo) throw new Error('产品不存在')

      // 编辑产品描述
      const { description } = req.body
      const product_description = `${description} --- ${res.locals.userInfo.user_name}`
      const product_isUpdate = await editProductDescriptionModel(m_id, product_description, connection)
      if (!product_isUpdate) throw new Error('产品描述编辑失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
      throw err
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '产品描述编辑成功'
    })
  } catch (err) {
    next(err)
  }
}

// 获取产品名称
export const getProductName: Controller<void> = async (req, res, next) => {
  try {
    // 获取产品名
    const { text, limit = 10 } = req.query
    const productName = await productNameModel(String(text || ''), Number(limit))

    res.json({
      code: 200,
      message: '产品名获取成功',
      data: {
        name: productName
      }
    })
  } catch (err) {
    next(err)
  }
}

// 获取某个仓库下所属全部产品信息
export const getWarehouseProduct: Controller<void> = async (req, res, next) => {
  try {
    // 获取仓库信息
    const warehouseInfo = await warehouseInfoModel(Number(res.locals.warehouseInfo.m_id))
    if (!warehouseInfo) throw new Error('仓库不存在')

    // 获取仓库产品信息
    const { product_m_id, product_name, product_type } = req.query
    const warehouseProduct = await warehouseProductModel(Number(res.locals.warehouseInfo.m_id), Number(product_m_id), String(product_name || ''), String(product_type || ''))

    res.json({
      code: 200,
      message: '仓库产品信息获取成功',
      data: {
        warehouse_name: warehouseInfo.warehouse_name,
        warehouse_type: warehouseInfo.warehouse_type,
        warehouseProduct: warehouseProduct
      }
    })
  } catch (err) {
    next(err)
  }
}

// 上下架产品
export const listProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {

      // 获取产品信息
      const { m_id, product_num, action_type, action_all } = req.body
      const productInfo = await productInfoModel(m_id, connection)
      if (!productInfo) throw new Error('产品不存在')

      let endNum = 0
      let actionAll_actionNum = 0
      // 检查产品上架数量是否超过库存数量
      if (action_type === 5) {
        if (action_all) {
          // 全部上架产品
          if (productInfo.product_num === 0) {
            res.json({
              code: 4024,
              message: '操作数量不足'
            })
            return
          }
          endNum = productInfo.product_num
          actionAll_actionNum = productInfo.product_diff_num
        } else {
          // 上架产品
          if (product_num > productInfo.product_diff_num) {
            res.json({
              code: 4024,
              message: '操作数量不足'
            })
            return
          }
          endNum = productInfo.product_list_num + product_num
        }
      } else if (action_type === 6) {
        if (action_all) {
          // 全部下架产品
          if (productInfo.product_list_num === 0) {
            res.json({
              code: 4024,
              message: '操作数量不足'
            })
            return
          }
          endNum = 0
          actionAll_actionNum = productInfo.product_list_num
        } else {
          // 下架产品
          if (product_num > productInfo.product_list_num) {
            res.json({
              code: 4024,
              message: '操作数量不足'
            })
            return
          }
          endNum = productInfo.product_list_num - product_num
        }
      }

      // 上下架产品
      const product_isUpdate = await listProductModel(m_id, endNum, connection)
      if (!product_isUpdate) throw new Error('产品上架失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增产品操作信息
      if (action_all) {
        // 全部操作产品
        const product_action_isAdd = await addProductActionInfoModel(issue_id, productInfo.product_id, action_type, actionAll_actionNum, connection)
        if (!product_action_isAdd) throw new Error('产品操作信息新增失败')
      } else {
        // 操作产品
        const product_action_isAdd = await addProductActionInfoModel(issue_id, productInfo.product_id, action_type, product_num, connection)
        if (!product_action_isAdd) throw new Error('产品操作信息新增失败')
      }

      connection.commit()
    } catch (err) {
      connection.rollback()
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '产品上架成功'
    })
  } catch (err) {
    next(err)
  }
}

// 售出产品
export const saleProduct: Controller<void> = async (req, res, next) => {
  try {
    const connection = await pool.getConnection()
    connection.beginTransaction()
    try {
      const { m_id, product_num } = req.body
      let listEndNum = 0
      let stoEndNum = 0
      const productInfo = await productInfoModel(m_id, connection)
      if (!productInfo) throw new Error('产品不存在')

      // 检查产品是否足够
      if (product_num > productInfo.product_list_num) {
        res.json({
          code: 4024,
          message: '操作数量不足'
        })
        return
      }
      listEndNum = productInfo.product_list_num - product_num
      stoEndNum = productInfo.product_num - product_num

      // 售出产品
      // 产品数量调整
      const product_isUpdate = await adjustProductNumModel(m_id, stoEndNum, connection)
      if (!product_isUpdate) throw new Error('产品售出失败')
      // 下架产品
      const list_isUpdate = await listProductModel(m_id, listEndNum, connection)
      if (!list_isUpdate) throw new Error('产品售架失败')

      // 新增操作信息
      const issue_id = uuidv4()
      const issue_isAdd = await addIssueInfoModel(issue_id, res.locals.userInfo.user_id, connection)
      if (!issue_isAdd) throw new Error('操作信息新增失败')

      // 新增产品操作信息
      const product_action_isAdd = await addProductActionInfoModel(issue_id, productInfo.product_id, 7, product_num, connection)
      if (!product_action_isAdd) throw new Error('产品操作信息新增失败')

      connection.commit()
    } catch (err) {
      connection.rollback()
    } finally {
      connection.release()
    }

    res.json({
      code: 200,
      message: '产品售出成功'
    })
  } catch (err) {
    next(err)
  }
}

// 获取产品概览信息
export const getProductOverview: Controller<void> = async (req, res, next) => {
  try {
    const productOverview = await productOverviewModel()
    res.json({
      code: 200,
      message: '产品概览信息获取成功',
      data: {
        count: productOverview.count,
        total_product_num: Number(productOverview.total_product_num),
        listed_product_num: Number(productOverview.listed_product_num)
      }
    })
  } catch (err) {
    next(err)
  }
}

// 获取某一日产品新增总量、减少总量、售出总量操作信息
export const getProductDayActionInfo: Controller<void> = async (req, res, next) => {
  try {
    const productDayActionInfo = await productDayActionInfoModel()
    res.json({
      code: 200,
      message: '产品操作信息获取成功',
      data: {
        productDayActionInfo
      }
    })
  } catch (err) {
    next(err)
  }
}