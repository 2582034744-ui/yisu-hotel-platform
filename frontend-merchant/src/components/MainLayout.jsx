import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd'
import {
  HomeOutlined, AuditOutlined, CheckCircleOutlined,
  UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BankOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Header, Sider, Content } = Layout

const adminMenus = [
  { key: '/admin/hotels', icon: <HomeOutlined />, label: '全部酒店' },
  { key: '/admin/review', icon: <AuditOutlined />, label: '审核管理' },
  { key: '/admin/published', icon: <CheckCircleOutlined />, label: '已发布' },
]

const merchantMenus = [
  { key: '/merchant/hotels', icon: <HomeOutlined />, label: '我的酒店' },
  { key: '/merchant/add', icon: <HomeOutlined />, label: '新增酒店' },
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const menus = user?.role === 'admin' ? adminMenus : merchantMenus

  const userMenu = {
    items: [{ key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true }],
    onClick: ({ key }) => { if (key === 'logout') { logout(); navigate('/login') } }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null} collapsible collapsed={collapsed}
        width={220}
      >
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BankOutlined style={{ fontSize: 18 }} />
            {!collapsed && '酒店管理'}
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menus}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <Button
            type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          <Dropdown menu={userMenu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span style={{ fontWeight: 500 }}>{user?.name}</span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 10,
                background: user?.role === 'admin' ? '#e6f4ff' : '#fff7e6',
                color: user?.role === 'admin' ? '#1677ff' : '#fa8c16'
              }}>
                {user?.role === 'admin' ? '管理员' : '商户'}
              </span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
