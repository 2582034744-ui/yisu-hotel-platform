import { Table, Tag, Button, Space, Popconfirm, message, Card } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'orange', text: '待审核' },
  published: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已拒绝' },
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
      const formattedHotels = (data.data || []).map(h => ({
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
        status: h.status === 'approved' ? 'published' : h.status === 'pending' ? 'pending' : 'draft',
        createdAt: h.createdAt || h.created_at?.split(' ')[0],
      }))
      
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

  const columns = [
    { title: '酒店名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '城市', dataIndex: 'city', key: 'city', width: 100 },
    { title: '星级', dataIndex: 'stars', key: 'stars', width: 80, render: v => '⭐'.repeat(v) },
    { title: '价格/晚', dataIndex: 'price', key: 'price', width: 100, render: v => `¥${v}` },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag>
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 120 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => navigate(`/merchant/edit/${record.id}`)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card
      title="我的酒店"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/merchant/add')}>新增酒店</Button>}
      style={{ borderRadius: 12 }}
    >
      <Table dataSource={hotels} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
    </Card>
  )
}
