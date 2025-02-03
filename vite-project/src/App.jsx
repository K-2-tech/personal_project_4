import { useState } from 'react';
import { generateSong } from './services/lyricsService';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import './index.css';

function App() {
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState('Jazz');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!lyrics.trim()) {
      setError('歌詞を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await generateSong(lyrics, style);

      // 音声URLが返ってきた場合、Firebaseに保存
      if (result.audio_url) {
        // axiosを使用して音声データを取得
        const audioResponse = await axios.get(result.audio_url, {
          responseType: 'blob'
        });
        const audioBlob = audioResponse.data;
        
        // Firebase Storageに保存
        const storageRef = ref(storage, `songs/${Date.now()}.mp3`);
        await uploadBytes(storageRef, audioBlob);
        const url = await getDownloadURL(storageRef);
        
        setAudioUrl(url);
      }
    } catch (err) {
      setError('音声の生成に失敗しました: ' + (err.message || '不明なエラー'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTikTokShare = async () => {
    if (!audioUrl) {
      setError('先に音声を生成してください');
      return;
    }

    try {
      const response = await axios.get(audioUrl, {
        responseType: 'blob'
      });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tiktok_song.mp3';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      window.open('https://www.tiktok.com/upload', '_blank');
    } catch (err) {
      setError('ダウンロードに失敗しました');
      console.error('Error:', err);
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

        {error && (
          <div className="error-message">
            {error}
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

          <button
            onClick={handleTikTokShare}
            className="button button-tiktok"
            disabled={!audioUrl || loading}
          >
            TikTokに投稿
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;