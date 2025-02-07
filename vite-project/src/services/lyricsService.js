// src/services/lyricsService.js
import axios from 'axios';

export const generateSong = async (lyrics, style = 'Jazz') => {
  const API_KEY = import.meta.env.VITE_SUNO_API_KEY;
  const CALLBACK_URL = import.meta.env.VITE_CALLBACK_URL || 'https://example/callBackUrl';

  const options = {
    method: 'POST',
    url: 'https://apibox.erweima.ai/api/v1/generate',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    data: {
      customMode: true,
      instrumental: true,
      prompt: lyrics,
      style: style,
      title: 'TikTok Song',
      model: 'V3_5',
      callBackUrl: CALLBACK_URL
    }
  };

  try {
    const { data } = await axios.request(options);
    
    if (data.task_id) {
      return await checkTaskStatus(data.task_id, API_KEY);
    }
    
    return data;
  } catch (error) {
    console.error('Error generating song:', error);
    throw error.response?.data || error;
  }
};

// タスクのステータスをチェックする関数
const checkTaskStatus = async (taskId, apiKey) => {
  const maxAttempts = 30; // 最大30回試行
  const delayMs = 2000;   // 2秒間隔

  const options = {
    method: 'GET',
    url: `https://apibox.erweima.ai/api/v1/status/${taskId}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json'
    }
  };

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const { data } = await axios.request(options);

      if (data.status === 'completed') {
        return data.result;
      } else if (data.status === 'failed') {
        throw new Error(data.error || '生成に失敗しました');
      }

      // 処理中の場合は待機
      await new Promise(resolve => setTimeout(resolve, delayMs));
    } catch (error) {
      console.error('Error checking status:', error);
      throw error.response?.data || error;
    }
  }

  throw new Error('タイムアウト: 生成に時間がかかりすぎています');
};