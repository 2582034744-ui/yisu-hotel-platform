import { Table, Tag, Button, Space, Popconfirm, message, Card, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, PoweroffOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'orange', text: '审核中' },
  published: { color: 'green', text: '已通过（上线中）' },
  approved: { color: 'green', text: '已通过（上线中）' },
  rejected: { color: 'red', text: '不通过' },
  offline: { color: 'gray', text: '已下线' },
}

export default function MerchantHotels() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)

  // 加载数据
  const loadHotels = async () => {
    setLoading(true)
    try {
      // 使用商户API获取自己的酒店
      const res = await fetch(`http://localhost:3001/api/merchant/hotels?merchantId=${user.id}`)
      const data = await res.json()
      
      // 转换数据格式
      const formattedHotels = (data.data || []).map(h => {
        // 标准化状态值
        let status = h.status
        if (status === 'approved') status = 'published'
        
        return {
          id: h.id,
          name: h.name,
          merchantId: h.merchant_id || user.id,
          merchantName: user.name,
          address: h.address,
          city: h.city,
          stars: h.stars || h.star_rating,
          price: h.price || h.min_price,
          phone: h.phone,
          description: h.description,
          facilities: h.facilities?.split('、') || [],
          images: h.images || [],
          status: status,
          reject_reason: h.reject_reason,
          createdAt: h.createdAt || h.created_at?.split(' ')[0],
        }
      })
      
      setHotels(formattedHotels)
    } catch (error) {
      console.error('加载失败:', error)
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadHotels()
    } else {
      console.log('等待用户信息...', user)
    }
  }, [user?.id])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/hotels/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        message.success('删除成功')
        loadHotels()
      } else {
        message.error('删除失败')
      }
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 上下线操作
  const toggleOnlineStatus = async (hotelId, action) => {
    try {
      const res = await fetch(`http://localhost:3001/api/merchant/hotels/${hotelId}/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: user.id, action }),
      })
      const data = await res.json()
      if (res.ok) {
        message.success(data.message)
        loadHotels()
      } else {
        message.error(data.message || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      message.error('操作失败')
    }
  }

  // 渲染状态列
  const renderStatus = (status, record) => {
    const statusInfo = statusMap[status] || { color: 'default', text: status }
    
    // 如果不通过且有原因，显示提示
    if (status === 'rejected' && record.reject_reason) {
      return (
        <Tooltip title={`原因：${record.reject_reason}`}>
          <Tag color={statusInfo.color} style={{ cursor: 'help' }}>
            {statusInfo.text}
            <InfoCircleOutlined style={{ marginLeft: 4, fontSize: 12 }} />
          </Tag>
        </Tooltip>
      )
    }
    
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
  }

  const columns = [
    { title: '酒店名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '城市', dataIndex: 'city', key: 'city', width: 100 },
    { title: '星级', dataIndex: 'stars', key: 'stars', width: 80, render: v => '⭐'.repeat(v) },
    { title: '价格/晚', dataIndex: 'price', key: 'price', width: 100, render: v => `¥${v}` },
    {
      title: '审核状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 120,
      render: renderStatus
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
    {
      title: '操作', key: 'action', width: 240,
      render: (_, record) => {
        // 判断显示哪些按钮
        const canOnline = record.status === 'offline'
        const canOffline = record.status === 'published' || record.status === 'approved'
        const isPending = record.status === 'pending'
        const isRejected = record.status === 'rejected'
        
        return (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/merchant/edit/${record.id}`)}>
              编辑
            </Button>
            
            {/* 上线按钮 - 只有已下线状态显示 */}
            {canOnline && (
              <Button 
                size="small" 
                type="primary"
                icon={<CheckCircleOutlined />} 
                onClick={() => toggleOnlineStatus(record.id, 'online')}
              >
                上线
              </Button>
            )}
            
            {/* 下线按钮 - 只有已上线状态显示 */}
            {canOffline && (
              <Popconfirm 
                title="确认下线？" 
                description="下线后用户将无法预订该酒店"
                onConfirm={() => toggleOnlineStatus(record.id, 'offline')}
              >
                <Button size="small" icon={<PoweroffOutlined />}>
                  下线
                </Button>
              </Popconfirm>
            )}
            
            {/* 审核中或不通过状态显示提示 */}
            {(isPending || isRejected) && (
              <Tooltip title={isPending ? '审核中，无法操作' : '审核不通过，请修改后重新提交'}>
                <Button size="small" disabled>待审核</Button>
              </Tooltip>
            )}
            
            <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
              <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <Card
      title="我的酒店"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/merchant/add')}>新增酒店</Button>}
      style={{ borderRadius: 12 }}
    >
      <Table 
        dataSource={hotels} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
        loading={loading}
        expandable={{
          expandedRowRender: record => {
            if (record.reject_reason) {
              return (
                <div style={{ margin: 0, padding: '8px 16px', background: '#fff2f0', borderRadius: 4 }}>
                  <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>审核不通过原因：</span>
                  <span style={{ color: '#666' }}>{record.reject_reason}</span>
                </div>
              )
            }
            return null
          },
          rowExpandable: record => !!record.reject_reason,
        }}
      />
    </Card>
  )
}
