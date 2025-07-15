// 軌跡描画用設定値
window.TRAIL_COLOR = 'rgba(0, 0, 255, 0.7)';
window.TRAIL_WIDTH = 3;

// キャンバス設定関数
window.createTrailCanvas = function() {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '999999';
  canvas.style.pointerEvents = 'none'; // キャンバスがマウスイベントを透過するようにする
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = window.TRAIL_COLOR;
  ctx.lineWidth = window.TRAIL_WIDTH;
  ctx.beginPath();
  
  return { canvas, ctx };
};

// キャンバス削除関数
window.removeTrailCanvas = function(canvas) {
  if (canvas) {
    canvas.remove();
  }
};

// 軌跡描画開始関数
window.startTrail = function(ctx, x, y) {
  if (ctx) {
    ctx.moveTo(x, y);
  }
};

// 軌跡描画関数
window.drawTrail = function(ctx, x, y) {
  if (ctx) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};
