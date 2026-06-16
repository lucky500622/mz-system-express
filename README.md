# MZ-System Express 后端服务

基于 **Express 5 + TypeScript + MySQL** 构建的现代化仓库管理系统后端服务，为前端 MZ-System 提供 RESTful API 接口，支持多角色权限管理与操作日志记录。

## 🛠️ 快速启动

### 数据库初始化

- CREATE DATABASE IF NOT EXISTS mz_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
- USE mz_system;

- mysql -u** -p** mz_system < "..\mz-system-express\db\mz-system-schema.sql"

### 项目启动

- npm install

开发
- npm run dev

部署
- 通过内外穿透部署(此项目前端已经配置了ngrok的对应参数配置，故后端建议使用ngrok进行部署)
- npm run dev后，打开ngrok对应的终端，输入ngrok http 3000


## 🚀 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Express** | ^5.2 | Web 框架 |
| **TypeScript** | ^6.0 | 类型安全 |
| **MySQL2** | ^3.22 | MySQL 驱动 |
| **Express Validator** | ^7.3 | 请求参数验证 |
| **uuid** | ^14.0 | UUID 生成 |
| **CORS** | ^2.8 | 跨域支持 |
| **Morgan** | ^1.10 | HTTP 请求日志 |
| **tsx** | ^4.22 | TypeScript 运行时 |
| **Dotenv** | ^17.4 | 环境变量管理 |

## ✨ 功能模块

### 🔐 用户认证
- 用户登录 / 登出
- Token 会话管理
- Token 过期自动失效
- 基于角色的访问控制（超级管理员 `sup_admin` / 公司管理员 `com_admin` / 员工 `staff`）

### 👥 用户管理
- 用户信息管理
- 角色申请与审批流程
- 用户登录状态维护

### 🏭 仓库管理
- 仓库新增、删除、重命名
- 仓库经手人设置与移除
- 仓库操作日志记录

### 📦 产品管理
- 产品新增、删除
- 产品信息维护
- 库存数量自动计算
- 产品上下架管理

### 📝 操作日志
- 所有仓库与产品操作记录操作日志
- 基于事务ID追溯操作历史

### 📋 待办事项
- 员工待办事项管理
- 待办事项增删改查

## 🗄️ 数据库结构

项目使用 MySQL 数据库，包含以下核心表：

| 表名 | 说明 |
|------|------|
| `t_user` | 用户信息表 |
| `t_user_session` | 用户 Token 会话表 |
| `t_apply_info` | 角色申请表 |
| `t_warehouse` | 仓库信息表 |
| `t_warehouse_action_info` | 仓库操作日志表 |
| `t_product` | 产品信息表 |
| `t_product_action_info` | 产品操作日志表 |
| `t_issue_info` | 操作事务信息表 |
| `t_todo_info` | 待办事项表 |

完整的数据库结构请参考 [`db/mz-system-schema.sql`](./db/mz-system-schema.sql)。

## ⚙️ 环境变量

在 `.env` 中配置：

## 📝 License

此项目为个人项目，仅供学习与内部使用。