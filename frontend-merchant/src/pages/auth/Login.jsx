import { Form, Input, Button, Card, Tabs, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, IdcardOutlined, BankOutlined } from '@ant-design/icons'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsers, registerUser } from '../../utils/mockData'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginForm] = Form.useForm()
  const [regForm] = Form.useForm()

  const onLogin = ({ username, password }) => {
    const user = getUsers().find(u => u.username === username && u.password === password)
    if (!user) return message.error('用户名或密码错误')
    login(user)
    navigate(user.role === 'admin' ? '/admin/hotels' : '/merchant/hotels')
  }

  const onRegister = ({ username, password, name }) => {
    const result = registerUser({ username, password, name })
    if (result.error) return message.error(result.error)
    message.success('注册成功，请登录')
    regForm.resetFields()
    loginForm.setFieldsValue({ username })
  }

  const loginTab = (
    <Form form={loginForm} onFinish={onLogin} size="large" style={{ marginTop: 24 }}>
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">登录</Button>
      </Form.Item>
      <Divider plain style={{ color: '#bbb', fontSize: 12 }}>测试账号</Divider>
      <div style={{ color: '#999', fontSize: 12, textAlign: 'center', lineHeight: 2 }}>
        管理员：admin / 123456 &nbsp;|&nbsp; 商户：merchant1 / 123456
      </div>
    </Form>
  )

  const registerTab = (
    <Form form={regForm} onFinish={onRegister} size="large" style={{ marginTop: 24 }}>
      <Form.Item name="name" rules={[{ required: true, message: '请输入商户名称' }]}>
        <Input prefix={<IdcardOutlined />} placeholder="商户名称" />
      </Form.Item>
      <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="密码（至少6位）" />
      </Form.Item>
      <Form.Item name="confirm" dependencies={['password']} rules={[
        { required: true, message: '请确认密码' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) return Promise.resolve()
            return Promise.reject('两次密码不一致')
          }
        })
      ]}>
        <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">注册商户账号</Button>
      </Form.Item>
    </Form>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 420, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} bodyStyle={{ padding: '32px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <BankOutlined style={{ fontSize: 40, color: '#1677ff' }} />
          <h2 style={{ margin: '8px 0 0', fontWeight: 700 }}>酒店管理系统</h2>
        </div>
        <Tabs centered items={[
          { key: 'login', label: '登录', children: loginTab },
          { key: 'register', label: '注册', children: registerTab },
        ]} />
      </Card>
    </div>
  )
}
