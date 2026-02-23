import { Table, Tag, Button, Card, message, Popconfirm } from 'antd'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHotels } from '../../utils/mockData'
import { EyeOutlined, StopOutlined } from '@ant-design/icons'

export default function PublishedList() {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)

  // 加载数据
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true)
      const data = await getHotels()
      setHotels(data.filter(h => h.status === 'published'))
      setLoading(false)
    }
    loadHotels()
  }, [])

  const handleUnpublish = async (id) => {
    message.success('已下架')
    // 重新加载
    const data = await getHotels()
    setHotels(data.filter(h => h.status === 'published'))
  }

  const columns = [
    { title: '酒店名称', dataIndex: 'name', key: 'name' },
    { title: '商户', dataIndex: 'merchantName', key: 'merchantName', width: 100 },
    { title: '城市', dataIndex: 'city', key: 'city', width: 80 },
    { title: '星级', dataIndex: 'stars', key: 'stars', width: 80, render: v => '⭐'.repeat(v) },
    { title: '价格', dataIndex: 'price', key: 'price', width: 90, render: v => `¥${v}` },
    { title: '发布时间', dataIndex: 'createdAt', key: 'createdAt', width: 110 },
    {
      title: '操作', key: 'action', width: 160,
      render: (_, r) => (
        <span style={{ display: 'flex', gap: 8 }}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/admin/review/${r.id}`)}>详情</Button>
          <Popconfirm title="确认下架？" onConfirm={() => handleUnpublish(r.id)}>
            <Button size="small" danger icon={<StopOutlined />}>下架</Button>
          </Popconfirm>
        </span>
      )
    }
  ]

  return (
    <Card title={`已发布酒店（共 ${hotels.length} 条）`} style={{ borderRadius: 12 }}>
      <Table dataSource={hotels} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} loading={loading} />
    </Card>
  )
}
