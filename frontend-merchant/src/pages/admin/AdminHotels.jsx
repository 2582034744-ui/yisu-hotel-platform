import { Table, Tag, Button, Space, Card, Input, Select, Row, Col, Statistic } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHotels } from '../../utils/mockData'
import { EyeOutlined, HomeOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'

const statusMap = {
  draft: { color: 'default', text: '草稿' },
  pending: { color: 'orange', text: '待审核' },
  published: { color: 'green', text: '已发布' },
  rejected: { color: 'red', text: '已拒绝' },
}

export default function AdminHotels() {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // 加载酒店数据
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true)
      const data = await getHotels()
      setHotels(data)
      setLoading(false)
    }
    loadHotels()
  }, [])

  const filtered = hotels.filter(h =>
    (!search || h.name.includes(search) || h.city.includes(search)) &&
    (!statusFilter || h.status === statusFilter)
  )

  const stats = {
    total: hotels.length,
    published: hotels.filter(h => h.status === 'published').length,
    pending: hotels.filter(h => h.status === 'pending').length,
  }

  const columns = [
    { title: '酒店名称', dataIndex: 'name', key: 'name' },
    { title: '商户', dataIndex: 'merchantName', key: 'merchantName', width: 100 },
    { title: '城市', dataIndex: 'city', key: 'city', width: 80 },
    { title: '星级', dataIndex: 'stars', key: 'stars', width: 80, render: v => '⭐'.repeat(v) },
    { title: '价格', dataIndex: 'price', key: 'price', width: 90, render: v => `¥${v}` },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag>
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 110 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_, r) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/review/${r.id}`)}>
          查看
        </Button>
      )
    }
  ]

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Row gutter={16}>
        {[
          { title: '全部酒店', value: stats.total, icon: <HomeOutlined />, color: '#1677ff' },
          { title: '已发布', value: stats.published, icon: <CheckCircleOutlined />, color: '#52c41a' },
          { title: '待审核', value: stats.pending, icon: <ClockCircleOutlined />, color: '#fa8c16' },
        ].map(s => (
          <Col span={8} key={s.title}>
            <Card style={{ borderRadius: 12, borderLeft: `4px solid ${s.color}` }}>
              <Statistic title={s.title} value={s.value} prefix={s.icon} valueStyle={{ color: s.color }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card style={{ borderRadius: 12 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search placeholder="搜索酒店名/城市" onSearch={setSearch} allowClear style={{ width: 220 }} />
          <Select placeholder="筛选状态" allowClear style={{ width: 120 }} onChange={setStatusFilter}
            options={Object.entries(statusMap).map(([k, v]) => ({ value: k, label: v.text }))} />
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
      </Card>
    </Space>
  )
}
