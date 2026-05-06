import { useState, useRef } from 'react';

const clothingItems = [
  { id: 1, name: 'Красная футболка', color: '#e74c3c', type: 'tshirt' },
  { id: 2, name: 'Синяя футболка', color: '#3498db', type: 'tshirt' },
  { id: 3, name: 'Зеленая футболка', color: '#2ecc71', type: 'tshirt' },
  { id: 4, name: 'Черная футболка', color: '#2c3e50', type: 'tshirt' },
  { id: 5, name: 'Белая футболка', color: '#ecf0f1', type: 'tshirt' },
  { id: 6, name: 'Джинсы', color: '#5dade2', type: 'jeans' },
  { id: 7, name: 'Куртка', color: '#8e44ad', type: 'jacket' },
];

function App() {
  const [photo, setPhoto] = useState(null);
  const [selectedClothes, setSelectedClothes] = useState([]);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
        setSelectedClothes([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const addClothing = (item) => {
    const newClothes = {
      ...item,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    setSelectedClothes([...selectedClothes, newClothes]);
  };

  const removeClothing = (index) => {
    setSelectedClothes(selectedClothes.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedClothes([]);
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const saveImage = () => {
    if (!canvasRef.current || !photo) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = photo;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      selectedClothes.forEach((clothes) => {
        ctx.save();
        ctx.translate((clothes.x / 100) * canvas.width, (clothes.y / 100) * canvas.height);
        ctx.rotate((clothes.rotation * Math.PI) / 180);
        ctx.scale(clothes.scale * scale, clothes.scale * scale);
        
        if (clothes.type === 'tshirt') {
          ctx.fillStyle = clothes.color;
          ctx.beginPath();
          ctx.moveTo(-40, -50);
          ctx.lineTo(40, -50);
          ctx.lineTo(50, -30);
          ctx.lineTo(40, 0);
          ctx.lineTo(50, 60);
          ctx.lineTo(-50, 60);
          ctx.lineTo(-40, 0);
          ctx.lineTo(-50, -30);
          ctx.closePath();
          ctx.fill();
        } else if (clothes.type === 'jeans') {
          ctx.fillStyle = clothes.color;
          ctx.fillRect(-30, -40, 60, 80);
          ctx.fillRect(-30, 40, 25, 50);
          ctx.fillRect(5, 40, 25, 50);
        } else if (clothes.type === 'jacket') {
          ctx.fillStyle = clothes.color;
          ctx.fillRect(-45, -60, 90, 100);
          ctx.fillStyle = '#2c3e50';
          ctx.fillRect(-5, -60, 10, 100);
        }
        
        ctx.restore();
      });
      
      const link = document.createElement('a');
      link.download = 'примерочная.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '2.5rem' }}>
        👗 Онлайн Примерочная
      </h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>📸 Загрузите фото</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ marginBottom: '15px', width: '100%' }}
            />
            
            {photo && (
              <>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', border: '2px solid #ddd' }}>
                  <img src={photo} alt="Ваше фото" style={{ width: '100%', display: 'block' }} />
                  {selectedClothes.map((clothes, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'absolute',
                        left: `${clothes.x}%`,
                        top: `${clothes.y}%`,
                        transform: `translate(-50%, -50%) rotate(${clothes.rotation}deg) scale(${clothes.scale * scale})`,
                        cursor: 'move',
                        userSelect: 'none',
                      }}
                    >
                      {clothes.type === 'tshirt' && (
                        <svg width="80" height="100" viewBox="0 0 80 100">
                          <path d="M20,10 L60,10 L70,25 L60,40 L70,80 L10,80 L20,40 L10,25 Z" fill={clothes.color} stroke="#333" strokeWidth="2"/>
                        </svg>
                      )}
                      {clothes.type === 'jeans' && (
                        <svg width="60" height="100" viewBox="0 0 60 100">
                          <rect x="15" y="10" width="30" height="50" fill={clothes.color} stroke="#333" strokeWidth="2"/>
                          <rect x="15" y="60" width="12" height="35" fill={clothes.color} stroke="#333" strokeWidth="2"/>
                          <rect x="33" y="60" width="12" height="35" fill={clothes.color} stroke="#333" strokeWidth="2"/>
                        </svg>
                      )}
                      {clothes.type === 'jacket' && (
                        <svg width="90" height="120" viewBox="0 0 90 120">
                          <rect x="5" y="10" width="80" height="100" fill={clothes.color} stroke="#333" strokeWidth="2"/>
                          <rect x="40" y="10" width="10" height="100" fill="#2c3e50"/>
                        </svg>
                      )}
                      <button
                        onClick={() => removeClothing(index)}
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '-10px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
                    Размер одежды: {Math.round(scale * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={saveImage}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    💾 Сохранить
                  </button>
                  <button
                    onClick={clearAll}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    🗑️ Очистить
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ background: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>👕 Каталог одежды</h2>
            <p style={{ color: '#666', marginBottom: '15px' }}>Нажмите на вещь, чтобы добавить её на фото</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
              {clothingItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addClothing(item)}
                  style={{
                    padding: '15px',
                    background: '#f8f9fa',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {item.type === 'tshirt' && (
                    <svg width="50" height="60" viewBox="0 0 80 100">
                      <path d="M20,10 L60,10 L70,25 L60,40 L70,80 L10,80 L20,40 L10,25 Z" fill={item.color} stroke="#333" strokeWidth="2"/>
                    </svg>
                  )}
                  {item.type === 'jeans' && (
                    <svg width="40" height="60" viewBox="0 0 60 100">
                      <rect x="15" y="10" width="30" height="50" fill={item.color} stroke="#333" strokeWidth="2"/>
                      <rect x="15" y="60" width="12" height="35" fill={item.color} stroke="#333" strokeWidth="2"/>
                      <rect x="33" y="60" width="12" height="35" fill={item.color} stroke="#333" strokeWidth="2"/>
                    </svg>
                  )}
                  {item.type === 'jacket' && (
                    <svg width="60" height="70" viewBox="0 0 90 120">
                      <rect x="5" y="10" width="80" height="100" fill={item.color} stroke="#333" strokeWidth="2"/>
                      <rect x="40" y="10" width="10" height="100" fill="#2c3e50"/>
                    </svg>
                  )}
                  <span style={{ fontSize: '12px', color: '#333', textAlign: 'center' }}>{item.name}</span>
                </button>
              ))}
            </div>
            
            {selectedClothes.length > 0 && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
                <h3 style={{ marginBottom: '10px', color: '#333' }}>📋 Выбрано вещей: {selectedClothes.length}</h3>
                <ul style={{ listStyle: 'none', color: '#666' }}>
                  {selectedClothes.map((item, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      • {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '20px', marginTop: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>ℹ️ Как пользоваться</h2>
            <ol style={{ paddingLeft: '20px', color: '#666', lineHeight: '1.8' }}>
              <li>Загрузите свою фотографию</li>
              <li>Выберите одежду из каталога</li>
              <li>Перемещайте одежду по фото</li>
              <li>Настройте размер с помощью ползунка</li>
              <li>Сохраните результат или начните заново</li>
            </ol>
          </div>
        </div>
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
