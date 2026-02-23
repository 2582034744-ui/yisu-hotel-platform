import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Empty, Button, Checkbox, Tag, Modal } from 'antd-mobile';
import { LeftOutline, DeleteOutline, PayCircleOutline } from 'antd-mobile-icons';
import { useFavoriteStore } from '../store/favoriteStore';
import type { Hotel } from '../types';
import './Favorites.css';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavoriteStore();
  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  const handleSelect = (hotelId: number) => {
    setSelectedHotels(prev => 
      prev.includes(hotelId) 
        ? prev.filter(id => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHotels.length === favorites.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(favorites.map(h => h.id));
    }
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      content: `确定要删除选中的 ${selectedHotels.length} 个收藏吗？`,
      onConfirm: () => {
        selectedHotels.forEach(id => removeFavorite(id));
        setSelectedHotels([]);
      }
    });
  };

  const handleCompare = () => {
    if (selectedHotels.length < 2) {
      return;
    }
    setCompareModalVisible(true);
  };

  const compareHotels = favorites.filter(h => selectedHotels.includes(h.id));

  return (
    <div className="favorites-page">
      <NavBar
        back={<LeftOutline />}
        onBack={() => navigate(-1)}
        right={
          favorites.length > 0 && (
            <span className="nav-action" onClick={handleSelectAll}>
              {selectedHotels.length === favorites.length ? '取消全选' : '全选'}
            </span>
          )
        }
      >
        我的收藏 ({favorites.length})
      </NavBar>

      {favorites.length === 0 ? (
        <Empty
          style={{ padding: '64px 0' }}
          imageStyle={{ width: 128 }}
          description="暂无收藏的酒店"
        >
          <Button color="primary" onClick={() => navigate('/list')}>
            去浏览酒店
          </Button>
        </Empty>
      ) : (
        <>
          <div className="favorites-toolbar">
            <span className="select-count">
              已选择 {selectedHotels.length} 个
            </span>
            {selectedHotels.length > 0 && (
              <div className="toolbar-actions">
                {selectedHotels.length >= 2 && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={handleCompare}
                  >
                    <PayCircleOutline /> 对比
                  </Button>
                )}
                <Button
                  size="small"
                  color="danger"
                  onClick={handleDeleteSelected}
                >
                  <DeleteOutline /> 删除
                </Button>
              </div>
            )}
          </div>

          <div className="favorites-list">
            {favorites.map(hotel => (
              <div
                key={hotel.id}
                className={`favorite-card ${selectedHotels.includes(hotel.id) ? 'selected' : ''}`}
              >
                <div className="card-checkbox">
                  <Checkbox
                    checked={selectedHotels.includes(hotel.id)}
                    onChange={() => handleSelect(hotel.id)}
                  />
                </div>
                <div
                  className="card-content"
                  onClick={() => navigate(`/detail/${hotel.id}`)}
                >
                  <img
                    src={hotel.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={hotel.name}
                    className="hotel-thumb"
                  />
                  <div className="hotel-brief">
                    <h4>{hotel.name}</h4>
                    <div className="brief-tags">
                      <Tag color="primary">{'★'.repeat(hotel.star_rating || 0)}</Tag>
                      <span className="brief-price">¥{hotel.min_price || 0}起</span>
                    </div>
                    <p className="brief-address">{hotel.address}</p>
                  </div>
                </div>
                <div
                  className="card-delete"
                  onClick={() => removeFavorite(hotel.id)}
                >
                  <DeleteOutline />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 对比弹窗 */}
      <Modal
        visible={compareModalVisible}
        onClose={() => setCompareModalVisible(false)}
        title={`酒店对比 (${compareHotels.length}家)`}
        content={
          <div className="compare-table">
            <div className="compare-row compare-header">
              <div className="compare-label">对比项</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id} className="compare-hotel-name">
                  {hotel.name}
                </div>
              ))}
            </div>
            
            <div className="compare-row">
              <div className="compare-label">酒店图片</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id} className="compare-image">
                  <img src={hotel.images?.[0]} alt={hotel.name} />
                </div>
              ))}
            </div>

            <div className="compare-row">
              <div className="compare-label">星级</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id}>{'★'.repeat(hotel.star_rating || 0)}</div>
              ))}
            </div>

            <div className="compare-row">
              <div className="compare-label">评分</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id} className="compare-highlight">
                  {hotel.rating || '4.5'}分
                </div>
              ))}
            </div>

            <div className="compare-row">
              <div className="compare-label">价格</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id} className="compare-price">
                  ¥{hotel.min_price || 0}<span className="unit">/晚</span>
                </div>
              ))}
            </div>

            <div className="compare-row">
              <div className="compare-label">地址</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id} className="compare-text">
                  {hotel.address}
                </div>
              ))}
            </div>

            <div className="compare-row">
              <div className="compare-label">设施</div>
              {compareHotels.map(hotel => (
                <div key={hotel.id} className="compare-facilities">
                  {hotel.facilities?.split('、').slice(0, 4).map((f, i) => (
                    <Tag key={i} size="small">{f}</Tag>
                  ))}
                </div>
              ))}
            </div>

            <div className="compare-actions">
              {compareHotels.map(hotel => (
                <Button
                  key={hotel.id}
                  size="small"
                  color="primary"
                  onClick={() => {
                    setCompareModalVisible(false);
                    navigate(`/detail/${hotel.id}`);
                  }}
                >
                  查看详情
                </Button>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
