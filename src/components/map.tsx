import React, { useRef, useEffect, useState } from 'react';

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface Area {
  id: string;
  points: Point[];
  name: string;
  color: string;
}

interface Route {
  id: string;
  points: Point[];
  color: string;
}

const CanvasMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Пример данных
  const areas: Area[] = [
    {
      id: 'area1',
      name: 'Зона А',
      color: '#4CAF50',
      points: [
        { x: 100, y: 100 },
        { x: 250, y: 80 },
        { x: 320, y: 150 },
        { x: 280, y: 280 },
        { x: 150, y: 320 },
        { x: 80, y: 200 }
      ]
    },
    {
      id: 'area2',
      name: 'Зона Б',
      color: '#2196F3',
      points: [
        { x: 400, y: 150 },
        { x: 480, y: 120 },
        { x: 580, y: 180 },
        { x: 620, y: 280 },
        { x: 550, y: 350 },
        { x: 420, y: 320 },
        { x: 380, y: 250 }
      ]
    }
  ];

  // Начальные точки с названиями
  const startPoints: Point[] = [
    { x: 150, y: 150, label: 'Автовокзал' },
    { x: 250, y: 250, label: 'Центральный парк' },
    { x: 350, y: 200, label: 'Торговый центр' },
    { x: 450, y: 200, label: 'Университет' },
    { x: 550, y: 300, label: 'Больница' },
    { x: 200, y: 350, label: 'Стадион' },
    { x: 500, y: 150, label: 'Вокзал' }
  ];

  const routes: Route[] = [
    {
      id: 'route1',
      color: '#FF5722',
      points: [
        { x: 150, y: 150, label: 'Автовокзал' },
        { x: 250, y: 250, label: 'Центральный парк' },
        { x: 350, y: 200, label: 'Торговый центр' }
      ]
    },
    {
      id: 'route2',
      color: '#9C27B0',
      points: [
        { x: 450, y: 200, label: 'Университет' },
        { x: 550, y: 300, label: 'Больница' },
        { x: 200, y: 350, label: 'Стадион' }
      ]
    },
    {
      id: 'route3',
      color: '#2196F3',
      points: [
        { x: 500, y: 150, label: 'Вокзал' },
        { x: 450, y: 200, label: 'Университет' },
        { x: 350, y: 200, label: 'Торговый центр' },
        { x: 150, y: 150, label: 'Автовокзал' }
      ]
    },
    {
      id: 'route4',
      color: '#4CAF50',
      points: [
        { x: 200, y: 350, label: 'Стадион' },
        { x: 250, y: 250, label: 'Центральный парк' },
        { x: 500, y: 150, label: 'Вокзал' },
        { x: 550, y: 300, label: 'Больница' }
      ]
    },
    {
      id: 'route5',
      color: '#FFC107',
      points: [
        { x: 150, y: 150, label: 'Автовокзал' },
        { x: 550, y: 300, label: 'Больница' },
        { x: 500, y: 150, label: 'Вокзал' }
      ]
    }
  ];

  // Отрисовка всего содержимого
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка областей
    areas.forEach(area => {
      ctx.beginPath();
      ctx.fillStyle = hoveredArea === area.id 
        ? `${area.color}80` 
        : `${area.color}30`;
      ctx.strokeStyle = area.color;
      ctx.lineWidth = 2;

      area.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Подпись области
      if (hoveredArea === area.id) {
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText(area.name, area.points[0].x + 10, area.points[0].y + 20);
      }
    });

    // Отрисовка всех начальных точек
    startPoints.forEach(point => {
      // Круг точки
      ctx.beginPath();
      ctx.fillStyle = '#666';
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Подпись точки
      if (point.label) {
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(point.label, point.x, point.y - 15);
      }
    });

    // Отрисовка маршрутов
    if (selectedRoute) {
      const route = routes.find(r => r.id === selectedRoute);
      if (route) {
        // Линия маршрута
        ctx.beginPath();
        ctx.strokeStyle = route.color;
        ctx.lineWidth = 3;
        route.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();

        // Точки маршрута
        route.points.forEach((point, index) => {
          // Круг точки
          ctx.beginPath();
          ctx.fillStyle = route.color;
          ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
          ctx.fill();

          // Номер точки
          ctx.fillStyle = '#FFF';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((index + 1).toString(), point.x, point.y);

          // Подпись точки
          if (point.label) {
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(point.label, point.x + 20, point.y);
          }
        });
      }
    }
  };

  // Обработчик кликов
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Проверка клика по точкам маршрута
    if (selectedRoute) {
      const route = routes.find(r => r.id === selectedRoute);
      if (route) {
        route.points.forEach(point => {
          const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
          if (distance < 15) {
            console.log(`Клик по точке: ${point.label || 'Без названия'}`);
          }
        });
      }
    }
  };

  // Обработчик наведения на области
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    areas.forEach(area => {
      if (isPointInPolygon({ x, y }, area.points)) {
        setHoveredArea(area.id);
        found = true;
      }
    });

    if (!found) {
      setHoveredArea(null);
    }
  };

  // Проверка точки внутри многоугольника
  const isPointInPolygon = (point: Point, polygon: Point[]) => {
    const x = point.x, y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Эффект отрисовки при изменениях
  useEffect(() => {
    draw();
  }, [hoveredArea, selectedRoute]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3>Маршруты:</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {routes.map(route => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route.id === selectedRoute ? null : route.id)}
              style={{
                background: route.id === selectedRoute ? route.color : '#eee',
                color: route.id === selectedRoute ? '#fff' : '#000',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Маршрут {route.id.slice(-1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          style={{ border: '1px solid #ddd', background: '#f5f5f5' }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
        />
        
        {hoveredArea && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {areas.find(a => a.id === hoveredArea)?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasMap;
