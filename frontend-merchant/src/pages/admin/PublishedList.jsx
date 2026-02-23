import { Table, Tag, Button, Card, message, Popconfirm, Select, Space } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHotels } from '../../utils/mockData'
import { EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons'

const statusMap = {
  published: { color: 'green', text: '已发布' },
  approved: { color: 'green', text: '已发布' },
  offline: { color: 'gray', text: '已下线' },
}

export default function PublishedList() {
  const navigate = useNavigate()
  const [allHotels, setAllHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // all, published, offline

  // 加载数据
  const loadHotels = async () => {
    setLoading(true)
    const data = await getHotels()
    // 只显示已发布和已下线的
    const publishedAndOffline = data.filter(h => h.status === 'published' || h.status === 'approved' || h.status === 'offline')
    setAllHotels(publishedAndOffline)
    setFilteredHotels(publishedAndOffline)
    setLoading(false)
  }

  useEffect(() => {
    loadHotels()
  }, [])

  // 筛选状态变化
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredHotels(allHotels)
    } else if (statusFilter === 'published') {
      setFilteredHotels(allHotels.filter(h => h.status === 'published' || h.status === 'approved'))
    } else if (statusFilter === 'offline') {
      setFilteredHotels(allHotels.filter(h => h.status === 'offline'))
    }
  }, [statusFilter, allHotels])

  // 上下线操作
  const toggleStatus = async (id, action) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/hotels/${id}/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (res.ok) {
        message.success(data.message)
        loadHotels()
      } else {
        message.error(data.message || '操作失败')
      }
    } catch (error) {
      message.error('操作失败')
    }
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
      width: 100,
      render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag>
    },
    { title: '发布时间', dataIndex: 'createdAt', key: 'createdAt', width: 110 },
    {
      title: '操作', key: 'action', width: 180,
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/review/${r.id}`)}>详情</Button>
          {(r.status === 'published' || r.status === 'approved') && (
            <Popconfirm title="确认下线？" onConfirm={() => toggleStatus(r.id, 'offline')}>
              <Button size="small" danger icon={<StopOutlined />}>下线</Button>
            </Popconfirm>
          )}
          {r.status === 'offline' && (
            <Button 
              size="small" 
              type="primary"
              icon={<CheckCircleOutlined />} 
              onClick={() => toggleStatus(r.id, 'online')}
            >
              上线
            </Button>
          )}
        </Space>
      )
    }
  ]

  return (
    <Card 
      title={
        <Space>
          <span>酒店状态管理（共 {filteredHotels.length} 条）</span>
          <Select 
            value={statusFilter} 
            onChange={setStatusFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部' },
              { value: 'published', label: '已发布' },
              { value: 'offline', label: '已下线' },
            ]}
          />
        </Space>
      } 
      style={{ borderRadius: 12 }}
    >
      <Table dataSource={filteredHotels} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
    </Card>
  )
}
