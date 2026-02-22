# 易宿酒店预订平台 - API 接口文档

## 基础信息

- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **响应格式**: JSON

---

## 通用响应格式

### 成功响应
```json
{
  "data": {},
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "message": "错误信息",
  "code": 400
}
```

### 分页响应
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

---

## 认证接口

### 1. 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应示例**:
```json
{
  "data": {
    "id": 1,
    "username": "admin",
    "name": "系统管理员",
    "role": "admin",
    "merchantId": null
  },
  "message": "登录成功"
}
```

**错误响应**:
- `400`: 请提供用户名和密码
- `401`: 用户名或密码错误
- `500`: 登录失败

---

### 2. 用户注册

**接口地址**: `POST /auth/register`

**请求参数**:
```json
{
  "username": "merchant1",
  "password": "123456",
  "name": "商户名称"
}
```

**响应示例**:
```json
{
  "data": {
    "id": 2,
    "username": "merchant1",
    "name": "商户名称",
    "role": "merchant",
    "merchantId": 1001
  },
  "message": "注册成功"
}
```

**错误响应**:
- `400`: 请提供完整的注册信息 / 密码长度至少6位 / 用户名已存在
- `500`: 注册失败

---

## 酒店接口

### 3. 获取酒店列表

**接口地址**: `GET /hotels`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| keyword | string | 否 | 搜索关键词（酒店名/地址） |
| city | string | 否 | 城市筛选 |
| star_rating | number | 否 | 星级筛选（1-5） |
| min_price | number | 否 | 最低价格 |
| max_price | number | 否 | 最高价格 |
| sort_by | string | 否 | 排序方式（id/price_asc/price_desc/rating） |
| nearby_type | string | 否 | 周边类型（attraction/transport/shopping） |

**请求示例**:
```
GET /api/hotels?page=1&pageSize=10&keyword=外滩&city=上海&star_rating=5&min_price=500&max_price=2000&sort_by=price_asc&nearby_type=attraction
```

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "上海外滩华尔道夫酒店",
      "name_en": "Waldorf Astoria Shanghai",
      "address": "上海市黄浦区中山东一路2号",
      "star_rating": 5,
      "images": ["/uploads/hotel1-1.jpg", "/uploads/hotel1-2.jpg"],
      "min_price": 1288,
      "rating": 4.9,
      "review_count": 2341,
      "distance": "距外滩500米",
      "facilities": "免费WiFi、游泳池、健身房、停车场、餐厅、SPA、商务中心",
      "description": "酒店坐落于外滩核心地带，拥有绝佳的黄浦江景观。",
      "phone": "021-63229988",
      "email": "shanghai.waldorf@hilton.com",
      "nearby_places": [
        {
          "id": 10001,
          "name": "外滩",
          "type": "attraction",
          "distance": "步行约5分钟"
        }
      ]
    }
  ],
  "pagination": {
    "total": 18,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  }
}
```

**说明**:
- 只返回状态为 `approved` 的酒店
- `nearby_type` 筛选周边信息包含指定类型的酒店
- `sort_by` 排序选项：
  - `id`: 按ID排序
  - `price_asc`: 价格从低到高
  - `price_desc`: 价格从高到低
  - `rating`: 评分从高到低

---

### 4. 获取推荐酒店

**接口地址**: `GET /hotels/recommended`

**说明**: 获取评分最高的6个已上线酒店

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "上海外滩华尔道夫酒店",
      "name_en": "Waldorf Astoria Shanghai",
      "address": "上海市黄浦区中山东一路2号",
      "star_rating": 5,
      "images": ["/uploads/hotel1-1.jpg"],
      "min_price": 1288,
      "rating": 4.9,
      "review_count": 2341,
      "distance": "距外滩500米",
      "facilities": "免费WiFi、游泳池、健身房、停车场、餐厅、SPA、商务中心",
      "description": "酒店坐落于外滩核心地带，拥有绝佳的黄浦江景观。",
      "phone": "021-63229988",
      "email": "shanghai.waldorf@hilton.com"
    }
  ]
}
```

---

### 5. 搜索酒店

**接口地址**: `GET /hotels/search`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |

**请求示例**:
```
GET /api/hotels/search?keyword=外滩
```

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "上海外滩华尔道夫酒店",
      "address": "上海市黄浦区中山东一路2号",
      "city": "上海",
      "star_rating": 5,
      "images": ["/uploads/hotel1-1.jpg"],
      "min_price": 1288,
      "rating": 4.9
    }
  ]
}
```

**错误响应**:
- `400`: 请提供搜索关键词

**说明**:
- 搜索范围：酒店名称、地址、城市、英文名
- 只返回状态为 `approved` 的酒店

---

### 6. 获取酒店详情

**接口地址**: `GET /hotels/:id`

**请求示例**:
```
GET /api/hotels/1
```

**响应示例**:
```json
{
  "data": {
    "id": 1,
    "name": "上海外滩华尔道夫酒店",
    "name_en": "Waldorf Astoria Shanghai",
    "address": "上海市黄浦区中山东一路2号",
    "city": "上海",
    "star_rating": 5,
    "images": ["/uploads/hotel1-1.jpg", "/uploads/hotel1-2.jpg", "/uploads/hotel1-3.jpg"],
    "description": "酒店坐落于外滩核心地带，拥有绝佳的黄浦江景观。装修风格融合了古典与现代元素，为宾客提供奢华的住宿体验。",
    "facilities": "免费WiFi、游泳池、健身房、停车场、餐厅、SPA、商务中心",
    "phone": "021-63229988",
    "email": "shanghai.waldorf@hilton.com",
    "rating": 4.9,
    "review_count": 2341,
    "status": "approved",
    "merchant_id": 1001,
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-12-01 15:30:00",
    "min_price": 1288,
    "distance": "距外滩500米",
    "rooms": [
      {
        "id": 101,
        "name": "豪华江景大床房",
        "price": 1688,
        "discount_price": 1288,
        "bed_type": "大床2m",
        "area": 45,
        "max_guests": 2,
        "description": "45平方米，外滩景观，配备智能马桶、浴缸",
        "images": ["/uploads/room101-1.jpg", "/uploads/room101-2.jpg"]
      }
    ],
    "nearby_places": [
      {
        "id": 10001,
        "name": "外滩",
        "type": "attraction",
        "distance": "步行约5分钟"
      },
      {
        "id": 10002,
        "name": "南京东路地铁站",
        "type": "transport",
        "distance": "步行约5分钟"
      }
    ]
  }
}
```

**错误响应**:
- `404`: 酒店不存在 / 酒店已下线

**说明**:
- 只返回状态为 `approved` 的酒店
- 房间按价格从低到高排序

---

### 7. 创建酒店（商户）

**接口地址**: `POST /hotels`

**请求参数**:
```json
{
  "name": "酒店名称",
  "name_en": "Hotel Name",
  "address": "酒店地址",
  "city": "城市",
  "star_rating": 5,
  "images": ["/uploads/hotel1-1.jpg"],
  "description": "酒店描述",
  "facilities": "设施列表",
  "phone": "联系电话",
  "email": "邮箱",
  "merchant_id": 1001,
  "min_price": 1288,
  "distance": "距离",
  "rooms": [
    {
      "id": 101,
      "name": "房型名称",
      "price": 1688,
      "discount_price": 1288,
      "bed_type": "大床2m",
      "area": 45,
      "max_guests": 2,
      "description": "房型描述",
      "images": ["/uploads/room101-1.jpg"]
    }
  ],
  "nearby_places": [
    {
      "id": 10001,
      "name": "周边地点名称",
      "type": "attraction",
      "distance": "步行约5分钟"
    }
  ]
}
```

**响应示例**:
```json
{
  "data": {
    "id": 19,
    "name": "酒店名称",
    "status": "pending",
    "created_at": "2024-12-22 10:00:00",
    "updated_at": "2024-12-22 10:00:00"
  },
  "message": "酒店创建成功，等待审核"
}
```

**错误响应**:
- `400`: 请提供完整的酒店信息
- `500`: 创建酒店失败

**说明**:
- 创建后酒店状态为 `pending`（待审核）
- 必填字段：name, address, city, star_rating

---

### 8. 更新酒店（商户）

**接口地址**: `PUT /hotels/:id`

**请求参数**: 与创建酒店相同

**请求示例**:
```
PUT /api/hotels/1
```

**响应示例**:
```json
{
  "data": {
    "id": 1,
    "name": "更新后的酒店名称",
    "status": "pending",
    "updated_at": "2024-12-22 10:00:00"
  },
  "message": "酒店更新成功，等待审核"
}
```

**错误响应**:
- `404`: 酒店不存在
- `500`: 更新酒店失败

**说明**:
- 更新后酒店状态变为 `pending`（待审核）
- 需要重新审核

---

### 9. 删除酒店（商户）

**接口地址**: `DELETE /hotels/:id`

**请求示例**:
```
DELETE /api/hotels/1
```

**响应示例**:
```json
{
  "message": "删除成功"
}
```

**错误响应**:
- `404`: 酒店不存在
- `500`: 删除酒店失败

---

### 10. 管理员获取所有酒店

**接口地址**: `GET /admin/hotels`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| keyword | string | 否 | 搜索关键词 |
| city | string | 否 | 城市筛选 |
| status | string | 否 | 状态筛选（draft/pending/published/rejected） |

**请求示例**:
```
GET /api/admin/hotels?page=1&pageSize=10&keyword=外滩&status=pending
```

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "上海外滩华尔道夫酒店",
      "merchantName": "上海外滩酒店管理有限公司",
      "city": "上海",
      "stars": 5,
      "price": 1288,
      "status": "pending",
      "createdAt": "2024-01-01 10:00:00"
    }
  ],
  "pagination": {
    "total": 18,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  }
}
```

**说明**:
- 返回所有状态的酒店（包括待审核、已发布、已拒绝等）
- 用于管理员审核和管理酒店

---

### 11. 商户获取自己的酒店

**接口地址**: `GET /merchant/hotels`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| merchantId | number | 是 | 商户ID |

**请求示例**:
```
GET /api/merchant/hotels?merchantId=1001
```

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "上海外滩华尔道夫酒店",
      "city": "上海",
      "stars": 5,
      "price": 1288,
      "status": "published",
      "createdAt": "2024-01-01 10:00:00"
    }
  ]
}
```

**错误响应**:
- `400`: 请提供商户ID

**说明**:
- 只返回该商户的酒店
- 包含所有状态的酒店

---

### 12. 审核酒店（管理员）

**接口地址**: `PUT /admin/hotels/:id/status`

**请求参数**:
```json
{
  "status": "published"
}
```

**请求示例**:
```
PUT /api/admin/hotels/1/status
```

**响应示例**:
```json
{
  "message": "审核通过"
}
```

**错误响应**:
- `400`: 无效的状态值
- `404`: 酒店不存在
- `500`: 审核酒店失败

**说明**:
- `status` 可选值：`published`（通过）、`rejected`（拒绝）
- 审核后酒店状态更新

---

## 预订接口

### 13. 创建预订

**接口地址**: `POST /bookings`

**请求参数**:
```json
{
  "hotel_id": 1,
  "room_id": 101,
  "checkin_date": "2024-12-25",
  "checkout_date": "2024-12-27",
  "guest_info": {
    "name": "张三",
    "phone": "13800138000"
  }
}
```

**响应示例**:
```json
{
  "data": {
    "booking_id": "BK202412221234",
    "status": "confirmed",
    "total_price": 2576,
    "created_at": "2024-12-22 10:00:00"
  },
  "message": "预订成功"
}
```

**错误响应**:
- `400`: 请提供完整的预订信息 / 入住日期无效
- `404`: 酒店不存在 / 房型不存在
- `500`: 创建预订失败

**说明**:
- 自动计算入住天数和总价
- 使用优惠价（如果有）计算总价
- 生成唯一预订号（格式：BK+年月日+随机数）

---

## 数据模型

### 酒店状态

| 状态 | 说明 |
|------|------|
| draft | 草稿 |
| pending | 待审核 |
| approved | 已上线（用户端可见） |
| published | 已发布（管理员端可见） |
| rejected | 已拒绝 |

### 周边类型

| 类型 | 说明 |
|------|------|
| attraction | 景点周边 |
| transport | 交通枢纽 |
| shopping | 购物中心 |

### 用户角色

| 角色 | 说明 |
|------|------|
| admin | 系统管理员 |
| merchant | 商户 |

---

## 测试账号

| 角色 | 用户名 | 密码 | 商户ID |
|------|--------|------|--------|
| 管理员 | admin | 123456 | null |
| 商户1 | merchant1 | 123456 | 1001 |
| 商户2 | merchant2 | 123456 | 1002 |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 注意事项

1. 所有日期格式为 `YYYY-MM-DD`
2. 所有时间格式为 `YYYY-MM-DD HH:mm:ss`
3. 价格单位为人民币（元）
4. 分页从1开始
5. 删除操作不可逆，请谨慎操作
6. 更新酒店后需要重新审核
7. 预订号格式：BK+年月日+4位随机数
