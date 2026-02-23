const express = require('express')
const router = express.Router()
const { hotels, bookings, users } = require('../data/mockData')

// 工具函数：生成用户ID
const generateUserId = () => {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
}

// 1. 用户登录
router.post('/auth/login', (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({
                message: '请提供用户名和密码',
                code: 400,
            })
        }

        const user = users.find(u => u.username === username && u.password === password)

        if (!user) {
            return res.status(401).json({
                message: '用户名或密码错误',
                code: 401,
            })
        }

        res.json({
            data: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                merchantId: user.merchantId,
            },
            message: '登录成功',
        })
    } catch (error) {
        res.status(500).json({
            message: '登录失败',
            code: 500,
        })
    }
})

// 2. 用户注册
router.post('/auth/register', (req, res) => {
    try {
        const { username, password, name } = req.body

        if (!username || !password || !name) {
            return res.status(400).json({
                message: '请提供完整的注册信息',
                code: 400,
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: '密码长度至少6位',
                code: 400,
            })
        }

        const existingUser = users.find(u => u.username === username)
        if (existingUser) {
            return res.status(400).json({
                message: '用户名已存在',
                code: 400,
            })
        }

        const newUser = {
            id: generateUserId(),
            username,
            password,
            name,
            role: 'merchant',
            merchantId: 1000 + users.length,
        }

        users.push(newUser)

        res.status(201).json({
            data: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                role: newUser.role,
                merchantId: newUser.merchantId,
            },
            message: '注册成功',
        })
    } catch (error) {
        res.status(500).json({
            message: '注册失败',
            code: 500,
        })
    }
})

module.exports = router
