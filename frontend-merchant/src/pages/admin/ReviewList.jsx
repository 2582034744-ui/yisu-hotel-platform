import { Table, Tag, Button, Space, Card, message } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHotels } from '../../utils/mockData'
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

export default function ReviewList() {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)

  // 加载数据
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true)
      const data = await getHotels()
      setHotels(data.filter(h => h.status === 'pending'))
      setLoading(false)
    }
    loadHotels()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/hotels/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      if (res.ok) {
        message.success(status === 'published' ? '审核通过' : '已拒绝')
        // 重新加载
        const data = await getHotels()
        setHotels(data.filter(h => h.status === 'pending'))
      } else {
        message.error('操作失败')
      }
    } catch (error) {
      message.error('操作失败')
    }
  }

  const statusMap = {
    pending: { color: 'orange', text: '待审核' },
    published: { color: 'green', text: '已通过' },
    rejected: { color: 'red', text: '已拒绝' },
    draft: { color: 'default', text: '草稿' },
  }

  const columns = [
    { title: '酒店名称', dataIndex: 'name', key: 'name' },
    { title: '商户', dataIndex: 'merchantName', key: 'merchantName', width: 120 },
    { title: '城市', dataIndex: 'city', key: 'city', width: 80 },
    { title: '星级', dataIndex: 'stars', key: 'stars', width: 80, render: v => '⭐'.repeat(v) },
    { title: '价格', dataIndex: 'price', key: 'price', width: 90, render: v => `¥${v}` },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 90,
      render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag>
    },
    { title: '提交时间', dataIndex: 'createdAt', key: 'createdAt', width: 110 },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/review/${r.id}`)}>详情</Button>
          <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => updateStatus(r.id, 'published')}>通过</Button>
          <Button size="small" danger icon={<CloseOutlined />} onClick={() => updateStatus(r.id, 'rejected')}>拒绝</Button>
        </Space>
      )
    }
  ]

  return (
    <Card title={`审核管理（待审核 ${hotels.length} 条）`} style={{ borderRadius: 12 }}>
      <Table dataSource={hotels} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
    </Card>
  )
}
