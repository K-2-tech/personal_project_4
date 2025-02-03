// src/services/storageService.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const uploadVoice = async (audioBlob) => {
  try {
    // ユニークなファイル名を生成
    const fileName = `voice_${Date.now()}.mp3`;
    const storageRef = ref(storage, `voices/${fileName}`);
    
    // Blobをアップロード
    await uploadBytes(storageRef, audioBlob);
    
    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading voice:", error);
    throw error;
  }
};