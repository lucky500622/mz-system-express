import { Controller } from '../types/express.ts'

import { productInfoModel } from '../model/product.ts'

// 分页获取商品信息
export const pageProductInfo: Controller<void> = async (req, res, next) => {
  try {
    const { offset = 0, limit = 10 } = req.query
    const pageOffset = Number(offset)
    const pageLimit = Number(limit)
    const productInfo = await productInfoModel(pageOffset, pageLimit)
    res.json({
      code: 200,
      message: '商品信息获取成功',
      data: {
        productInfo
      }
    })
  } catch (err) {
    next(err)
  }
}
