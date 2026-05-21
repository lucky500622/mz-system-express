import crypto from 'crypto'

// 导出md5加密函数，hex为16进制字符串
export default function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

// 通过明文加密后进行存储，避免明文存储密码
// 登录则通过同一加密函数加密，比对是否一致

// 为什么可以通过加密后比对密码是否一致？？
// 原因是，同一字符串md5加密后是固定的，不会改变