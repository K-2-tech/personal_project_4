import { useState } from 'react';
import './index.css';

function App() {
  const [lyrics, setLyrics] = useState('');
  const [voiceType, setVoiceType] = useState('normal');

  const handleGenerate = async () => {
    console.log('Generating voice with:', { lyrics, voiceType });
    // ここに音声生成のロジックを実装予定
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">TikTok Voice Generator</h1>
        
        <textarea
          placeholder="歌詞を入力してください..."
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          className="input-area"
        />
        
        <select
          value={voiceType}
          onChange={(e) => setVoiceType(e.target.value)}
          className="select-voice"
        >
          <option value="normal">普通の声</option>
          <option value="robot">ロボットボイス</option>
          <option value="energetic">元気な声</option>
        </select>

        <div className="button-container">
          <button
            onClick={handleGenerate}
            className="button button-generate"
          >
            音声を生成
          </button>
          <button className="button button-tiktok">
            TikTokに投稿
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;