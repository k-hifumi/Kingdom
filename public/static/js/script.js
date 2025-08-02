// ページのHTMLが完全に読み込まれたタイミングで実行
document.addEventListener('DOMContentLoaded', function () {
    // 動画とオーバーレイを取得
    const video = document.getElementById('intro-video');
    const overlay = document.getElementById('first-view');

    // 今日の日付（例: 2025-06-25）を取得（日本時間で）
    const today = getJSTDateString();
    function getJSTDateString() {
        return new Date().toLocaleDateString('ja-JP')
            .replaceAll('/', '-'); // → 例: "2025-06-26"
    }

    // 最後に動画を再生した日を取得
    const lastPlayed = localStorage.getItem('introPlayedDate');

    // すでに今日見たなら動画は表示しない
    if (lastPlayed === today) {
        overlay.style.display = 'none';
        return;
    } else {
        overlay.style.display = 'block'; // ← 今日見てないときだけ表示
        localStorage.setItem('introPlayedDate', today);
    }

    // 画面クリックで音声ON/OFFを切り替える
    document.addEventListener('click', function toggleSound() {
        video.muted = !video.muted; // 現在の状態を反転して上書き
        video.volume = video.muted ? 0.0 : 1.0; // [条件 ? 真のときの値 : 偽のときの値] ミュートしてるときは音量0、解除したら音量1に戻す
    });

    // 万が一動画が再生されなかった場合に備え、5秒後に強制でオーバーレイを消す
    const fallbackTimeout = setTimeout(function () { // setTimeout()で○秒後に実行を予約する
        console.warn('動画が再生されなかったため、フェードアウト処理を実行します。');
        endIntro();
    }, 5000);

    video.play().then(function () { // 再生に成功したら .then(...) の中身が呼ばれる
        clearTimeout(fallbackTimeout); // setTimeout()でした予約をキャンセル(無効化)する
        console.log('動画再生成功');
    }).catch(function (err) { // 再生に失敗したら .catch(...) の中身が呼ばれる
        console.warn('動画の再生に失敗しました:', err);
        // 再生されなかった場合はそのままfallbackが働く
    });

    video.addEventListener('play', function () {
        clearTimeout(fallbackTimeout);
    });

    // 動画が最後まで再生されたら実行される処理
    video.addEventListener('ended', function () {
        clearTimeout(fallbackTimeout); // タイマーを解除
        endIntro();
    });

    function endIntro() {
        overlay.classList.add('hidden'); // フェードアウト用CSSクラス追加

        // 1秒後に完全に非表示に（DOMには残す）
        setTimeout(function () {
            overlay.style.display = 'none';
        }, 1000);
    }
});

/*
TODO: スキップを実装する
TODO: 音量をON/OFFどちらで再生するかを最初に選択できるようにする
*/