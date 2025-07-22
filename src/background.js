// background.js

const downloadIdToFilenameMap = {};

/**
 * アクション定義
 */
function closeTab(tab, request) {
  chrome.tabs.remove(tab.id);
}

function saveImage(tab, request) {
  if (!request.targetUrl || !request.pageUrl) {
    return;
  }

  const imageUrl = request.targetUrl;
  const pageUrl = request.pageUrl;

  // https://fantia.jp/posts/{number1}/post_content_photo/{number2} の形式かページURLでチェック
  const fantiaRegex = /^https:\/\/fantia\.jp\/posts\/(\d+)\/post_content_photo\/(\d+)/;
  const match = pageUrl.match(fantiaRegex);

  if (match) {
    const number1 = match[1];
    const number2 = match[2];
    const generatedFilename = `${number1}_${number2}.jpg`;

    // ダウンロードを開始し、IDとファイル名のマッピングを保存
    // saveAs: true を指定して、名前を付けて保存ダイアログを開く
    chrome.downloads.download({ url: imageUrl, saveAs: true }, (downloadId) => {
      if (downloadId) {
        downloadIdToFilenameMap[downloadId] = generatedFilename;
      }
    });
  } else {
    // それ以外のURLでは自動で保存する
    chrome.downloads.download({
      url: imageUrl,
      saveAs: false // ダイアログを表示せずに自動保存
    });
  }
}

// ジェスチャーとアクションのマッピング
const gestureActions = {
  'DL': closeTab, // 下、左: タブを閉じる
  'DR': saveImage // 下、右: 画像を保存
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'performGesture') {
    const action = gestureActions[request.gesture];
    if (action) {
      action(sender.tab, request);
    }
  }
  return true; 
});

// ダウンロードのファイル名を決定するリスナー
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  const desiredFilename = downloadIdToFilenameMap[downloadItem.id];
  if (desiredFilename) {
    suggest({
      filename: desiredFilename,
      conflictAction: 'uniquify' // ファイル名が競合した場合は連番を付ける
    });
    // 使用済みのマッピングを削除
    delete downloadIdToFilenameMap[downloadItem.id];
    // suggest()を非同期的に呼び出すことを示すためにtrueを返す
    return true;
  }
  // desiredFilenameがない場合（elseルート）、デフォルトのファイル名決定プロセスをブロックしないよう、
  // 何も返さずに（undefinedを返して）リスナーを同期的に完了させます。
});