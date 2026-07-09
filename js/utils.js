window.App = window.App || {};

App.haversine = function(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

App.calculatePGA = function(magnitude, distanceKm) {
  const R = Math.max(distanceKm, 1);
  return Math.pow(10, 0.6 * magnitude - 1.0) / (R + 10);
};

App.backProjectLonLat = function(canvas, lon, lat, centerLon, centerLat, zoom) {
  zoom = zoom || 2.2;
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const pixelsPerDeg = zoom * Math.min(w, h) / 5;
  const rx = (lon - centerLon) * pixelsPerDeg * Math.cos(centerLat * Math.PI / 180);
  const ry = (centerLat - lat) * pixelsPerDeg;
  return { x: cx + rx, y: cy + ry };
};

App.Spinner = function(container) {
  const el = document.createElement('div');
  el.style.cssText = 'display:inline-block;width:20px;height:20px;border:2px solid rgba(255,255,255,0.1);border-top-color:#00d4ff;border-radius:50%;animation:app-spin 0.7s linear infinite;margin:0 auto;';
  container.appendChild(el);
  if (!document.getElementById('app-spin-style')) {
    const s = document.createElement('style');
    s.id = 'app-spin-style';
    s.textContent = '@keyframes app-spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(s);
  }
  return {
    remove: () => { if (el.parentNode) el.parentNode.removeChild(el); }
  };
};

App.throttle = function(fn, ms) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
};
