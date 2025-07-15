import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const AnimatedCanvasRoute = ({ routeCoordinates }) => {
  const map = useMap();
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!map) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    L.DomUtil.toBack(canvas); // Ensure canvas is behind markers

    const drawRoute = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!routeCoordinates || routeCoordinates.length === 0) return;

      const points = routeCoordinates.map(coord => map.latLngToContainerPoint(L.latLng(coord[0], coord[1])));

      if (points.length < 2) return;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#10B981'); // Emerald
      gradient.addColorStop(1, '#3B82F6'); // Blue-500

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 5;
      ctx.stroke();
    };

    const onMove = () => {
      // Reposition canvas and redraw
      const panePos = map.getPanes().overlayPane.style.transform.match(/(-?\d+)px, (-?\d+)px/);
      if (panePos) {
        canvas.style.transform = `translate(${panePos[1]}px, ${panePos[2]}px)`;
      }
      drawRoute();
    };

    const onZoom = () => {
      // Resize canvas, then reposition and redraw
      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
      onMove();
    };

    const onAnimate = () => {
       cancelAnimationFrame(animationFrameId.current);
       animationFrameId.current = requestAnimationFrame(onMove);
    }

    map.on('zoomstart', () => L.DomUtil.setOpacity(canvas, 0));
    map.on('zoomend', () => { onZoom(); L.DomUtil.setOpacity(canvas, 1); });
    map.on('movestart', () => L.DomUtil.setOpacity(canvas, 0.5));
    map.on('moveend', onMove);
    map.on('move', onAnimate); // Use animation frame for smooth drawing during pan

    // Initial setup
    onZoom();

    // Cleanup
    return () => {
      map.off('zoomstart');
      map.off('zoomend');
      map.off('movestart');
      map.off('moveend');
      map.off('move');
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [map, routeCoordinates]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', zIndex: 400 }} />;
};

export default AnimatedCanvasRoute;