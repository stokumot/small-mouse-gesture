// content.js

let isDragging = false;
let startPoint = { x: 0, y: 0 };
let gesture = '';
let trailCanvas = null;
let trailCtx = null;
let targetImageUrl = null; // 画像URLを格納する変数

document.addEventListener('mousedown', (event) => {
  if (event.button === 2) { // 右クリック
    isDragging = true;
    startPoint = { x: event.clientX, y: event.clientY };
    gesture = '';
    targetImageUrl = null;

    // カーソル下の要素が画像かチェック
    const targetElement = document.elementFromPoint(event.clientX, event.clientY);
    if (targetElement && targetElement.tagName === 'IMG') {
      targetImageUrl = targetElement.src;
    }

    // 軌跡描画用のキャンバスを作成
    const trailSetup = window.createTrailCanvas();
    trailCanvas = trailSetup.canvas;
    trailCtx = trailSetup.ctx;
    window.startTrail(trailCtx, event.clientX, event.clientY);

    // コンテキストメニューを無効化
    event.preventDefault();
  }
});

document.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  // 軌跡を描画
  window.drawTrail(trailCtx, event.clientX, event.clientY);

  /**
 * ジェスチャー判定ロジック
 */
function detectGesture(event, startPoint, gesture) {
  const dx = event.clientX - startPoint.x;
  const dy = event.clientY - startPoint.y;
  const threshold = 20;

  let newGesture = gesture;
  if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0 && gesture.slice(-1) !== 'D') {
        newGesture += 'D';
      } else if (dy < 0 && gesture.slice(-1) !== 'U') {
        newGesture += 'U';
      }
    } else {
      if (dx > 0 && gesture.slice(-1) !== 'R') {
        newGesture += 'R';
      } else if (dx < 0 && gesture.slice(-1) !== 'L') {
        newGesture += 'L';
      }
    }
    return {
      gesture: newGesture,
      startPoint: { x: event.clientX, y: event.clientY }
    };
  }
  return {
    gesture,
    startPoint
  };
}

// ジェスチャー判定ロジック呼び出し
  const result = detectGesture(event, startPoint, gesture);
  gesture = result.gesture;
  startPoint = result.startPoint;
});

document.addEventListener('mouseup', (event) => {
  if (event.button === 2) {
    isDragging = false;
    if (gesture.length > 0) {
      chrome.runtime.sendMessage({ 
        action: 'performGesture', 
        gesture: gesture,
        targetUrl: targetImageUrl,
        pageUrl: window.location.href // 現在のページのURLを追加
      });
    }
    
    // キャンバスを削除
    window.removeTrailCanvas(trailCanvas);
    trailCanvas = null;
    trailCtx = null;
  }
});


// ドラッグ中はコンテキストメニューを無効化
document.addEventListener('contextmenu', (event) => {
    if (gesture.length > 0) {
        event.preventDefault();
    }
});
