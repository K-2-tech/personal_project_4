// src/services/tiktokService.js
export const shareToTikTok = (audioUrl) => {
    // TikTokのシェアURLを生成
    // 注: TikTokは直接の音声アップロードAPIを提供していないため、
    // ユーザーにダウンロードさせてから手動でアップロードしてもらう方式を採用
    const downloadAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tiktok_voice.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // TikTokアプリを開く
        window.open('https://www.tiktok.com/upload', '_blank');
      } catch (error) {
        console.error("Error downloading audio:", error);
        throw error;
      }
    };
  
    return downloadAudio();
  };