// App.jsx
import { useState } from 'react';
import { generateSong } from './services/lyricsService';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './index.css';

function App() {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('Jazz');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null); // API専用のエラー状態

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      setError('歌詞を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setApiError(null); // API実行時にエラーをクリア

      const result = await generateSong(lyrics, style);
      
      if (result.code === 455) {
        setApiError({
          title: 'サーバーが混雑しています',
          message: 'ただいまサーバーが混雑しているため、生成に失敗しました。\n時間を置いて再度お試しください。\n※クレジットは返還されます。'
        });
        return;
      }

      if (result.code !== 200) {
        setApiError({
          title: 'エラーが発生しました',
          message: result.msg || '予期せぬエラーが発生しました'
        });
        return;
      }

      // 成功時の処理
      if (result.download_url) {
        setAudioUrl(result.download_url);
      }
    } catch (err) {
      setApiError({
        title: 'エラーが発生しました',
        message: err.response?.data?.msg || 'サーバーとの通信に失敗しました'
      });
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">TikTok Song Generator</h1>
        
        <textarea
          placeholder="歌詞やプロンプトを入力してください..."
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="input-area"
          disabled={loading}
        />
        
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="select-voice"
          disabled={loading}
        >
          <option value="Jazz">ジャズ</option>
          <option value="Pop">ポップ</option>
          <option value="Rock">ロック</option>
          <option value="Classical">クラシック</option>
        </select>

        {/* 入力関連のエラー表示 */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* API関連のエラー表示 */}
        {apiError && (
          <div className="api-error">
            <h3 className="api-error-title">{apiError.title}</h3>
            <p className="api-error-message">{apiError.message}</p>
          </div>
        )}

        <div className="button-container">
          <button
            onClick={handleGenerate}
            className="button button-generate"
            disabled={loading || !lyrics.trim()}
          >
            {loading ? '生成中...' : '音声を生成'}
          </button>

          {audioUrl && (
            <div className="audio-preview">
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                お使いのブラウザは音声再生をサポートしていません。
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;