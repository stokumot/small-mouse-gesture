// background.js

/**
 * アクション定義
 */
function closeTab(tab, request) {
  chrome.tabs.remove(tab.id);
}

function saveImage(tab, request) {
  if (request.targetUrl) {
    chrome.downloads.download({
      url: request.targetUrl,
      saveAs: true
    });
  }
}

// ジェスチャーとアクションのマッピング
const gestureActions = {
  'DL': closeTab, // 下、左: タブを閉じる
  'DR': saveImage // 下、右: 画像を保存
  // 新しいジェスチャーはここに追加
  // 'U': someAction,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performGesture') {
    const action = gestureActions[request.gesture];
    if (action) {
      action(sender.tab, request);
    }
  }
  // 非同期でレスポンスを返す場合は true を返す (今回は使わないが作法として)
  return true; 
});
