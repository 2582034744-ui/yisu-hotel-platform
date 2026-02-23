import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Toast, Tag, Button, PullToRefresh } from 'antd-mobile';
import { LeftOutline, EnvironmentOutline, UnorderedListOutline } from 'antd-mobile-icons';
import { getHotelList } from '../api/hotel';
import type { Hotel } from '../types';
import './MapView.css';

// 城市中心坐标
const cityCenters: Record<string, { lat: number; lng: number }> = {
  '全部': { lat: 35.0, lng: 105.0 },
  '上海': { lat: 31.2304, lng: 121.4737 },
  '北京': { lat: 39.9042, lng: 116.4074 },
  '广州': { lat: 23.1291, lng: 113.2644 },
  '深圳': { lat: 22.5431, lng: 114.0579 },
  '杭州': { lat: 30.2741, lng: 120.1551 },
  '成都': { lat: 30.5728, lng: 104.0668 },
  '西安': { lat: 34.3416, lng: 108.9398 },
  '厦门': { lat: 24.4798, lng: 118.0894 },
  '桂林': { lat: 25.2740, lng: 110.2993 },
  '丽江': { lat: 26.8721, lng: 100.2295 },
};

// 声明腾讯地图类型
declare global {
  interface Window {
    TMap: any;
  }
}

export default function MapView() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [currentCity, setCurrentCity] = useState('全部');
  
  // 地图相关
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 加载酒店数据
  const loadHotels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHotelList({ page: 1, pageSize: 50 });
      const hotelList = (res.data as any)?.list || res.data || [];
      setHotels(hotelList);
    } catch (error) {
      console.error('加载失败:', error);
      Toast.show({ content: '加载失败', position: 'center' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || !window.TMap) return;

    // 初始化地图
    const center = cityCenters[currentCity] || cityCenters['全部'];
    mapInstance.current = new window.TMap.Map(mapRef.current, {
      center: new window.TMap.LatLng(center.lat, center.lng),
      zoom: currentCity === '全部' ? 4 : 12,
      mapStyleId: 'style1', // 浅色风格
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  // 城市切换时更新地图中心和标记
  useEffect(() => {
    if (mapInstance.current && window.TMap) {
      const center = cityCenters[currentCity] || cityCenters['全部'];
      mapInstance.current.setCenter(new window.TMap.LatLng(center.lat, center.lng));
      mapInstance.current.setZoom(currentCity === '全部' ? 4 : 13);
    }
  }, [currentCity]);

  // 过滤后的酒店
  const filteredHotels = currentCity === '全部' 
    ? hotels 
    : hotels.filter(h => h.city === currentCity || h.address?.includes(currentCity));

  // 添加酒店标记
  useEffect(() => {
    if (!mapInstance.current || !window.TMap || hotels.length === 0) return;

    // 清除旧标记
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    console.log('当前城市:', currentCity, '酒店数:', filteredHotels.length);

    // 为每个酒店创建标记（使用真实经纬度）
    filteredHotels.forEach((hotel: any) => {
      // 使用酒店的真实经纬度
      let lat = hotel.latitude;
      let lng = hotel.longitude;
      
      // 确保坐标有效（所有酒店现在都有真实坐标）
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.warn('酒店缺少有效坐标:', hotel.name, hotel.city);
        // 回退到城市中心
        const cityCenter = cityCenters[hotel.city] || cityCenters['全部'];
        lat = cityCenter.lat;
        lng = cityCenter.lng;
      }

      console.log('创建标记:', hotel.name, lat, lng, hotel.city);

      const marker = new window.TMap.MultiMarker({
        map: mapInstance.current,
        styles: {
          'default': new window.TMap.MarkerStyle({
            width: 60,
            height: 30,
            anchor: { x: 30, y: 30 },
            color: '#fff',
            backgroundColor: '#1677ff',
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 15,
            fontSize: 12,
            fontWeight: 'bold',
          }),
        },
        geometries: [{
          id: String(hotel.id),
          position: new window.TMap.LatLng(lat, lng),
          properties: hotel,
          content: `¥${hotel.min_price || 0}`,
        }],
      });

      // 点击事件
      marker.on('click', (e: any) => {
        const hotelData = e.geometry.properties;
        setSelectedHotel(hotelData);
        // 将地图中心移到该标记
        mapInstance.current.setCenter(e.geometry.position);
      });

      markersRef.current.push(marker);
    });
  }, [hotels, currentCity, filteredHotels]);

  // 刷新
  const onRefresh = async () => {
    await loadHotels();
  };

  return (
    <div className="map-view-page">
      <NavBar
        back={<LeftOutline />}
        onBack={() => navigate(-1)}
        right={
          <div className="nav-right" onClick={() => navigate('/list')}>
            <UnorderedListOutline /> 列表
          </div>
        }
      >
        地图找房
      </NavBar>

      <PullToRefresh onRefresh={onRefresh}>
        {/* 真实地图区域 */}
        <div 
          ref={mapRef} 
          className="map-container"
          style={{ height: '400px', width: '100%' }}
        />

        {/* 城市切换 */}
        <div className="city-tabs-wrapper">
          <div className="city-tabs">
            <div
              className={`city-tab ${currentCity === '全部' ? 'active' : ''}`}
              onClick={() => setCurrentCity('全部')}
            >
              全部
            </div>
            {Object.keys(cityCenters).filter(c => c !== '全部').map(city => (
              <div
                key={city}
                className={`city-tab ${currentCity === city ? 'active' : ''}`}
                onClick={() => setCurrentCity(city)}
              >
                {city}
              </div>
            ))}
          </div>
        </div>

        {/* 底部酒店面板 */}
        <div className="map-hotel-panel">
          {loading ? (
            <div className="loading-text">加载中...</div>
          ) : selectedHotel ? (
            <div
              className="selected-hotel-card"
              onClick={() => navigate(`/detail/${selectedHotel.id}`)}
            >
              <img
                src={selectedHotel.images?.[0] || 'https://via.placeholder.com/200'}
                alt={selectedHotel.name}
                className="hotel-thumb"
              />
              <div className="hotel-info">
                <h4>{selectedHotel.name}</h4>
                <div className="hotel-meta">
                  <Tag color="primary">{'★'.repeat(selectedHotel.star_rating || 0)}</Tag>
                  <span className="hotel-rating">{selectedHotel.rating || '4.5'}分</span>
                </div>
                <p className="hotel-address">
                  <EnvironmentOutline /> {selectedHotel.address}
                </p>
                <div className="hotel-footer">
                  <span className="hotel-price">
                    ¥<strong>{selectedHotel.min_price || 0}</strong>起
                  </span>
                  <Button size="small" color="primary">
                    查看详情
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <EnvironmentOutline className="no-icon" />
              <p>点击地图上的价格标签查看酒店</p>
              <p className="hotel-count">
                {currentCity === '全部' 
                  ? `共找到 ${filteredHotels.length} 家酒店` 
                  : `${currentCity}有 ${filteredHotels.length} 家酒店`
                }
              </p>
            </div>
          )}
        </div>

        {/* 附近推荐 */}
        {!loading && filteredHotels.length > 0 && (
          <div className="nearby-section">
            <h3 className="section-title">
              {currentCity === '全部' ? '附近热门' : `${currentCity}热门`}
            </h3>
            <div className="nearby-list">
              {filteredHotels.slice(0, 5).map(hotel => (
                <div
                  key={hotel.id}
                  className="nearby-item"
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <img
                    src={hotel.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={hotel.name}
                  />
                  <div className="nearby-info">
                    <span className="nearby-name">{hotel.name}</span>
                    <span className="nearby-price">¥{hotel.min_price || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PullToRefresh>
    </div>
  );
}
