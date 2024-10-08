import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebaseConfig';  // Firebaseの設定ファイル

// 型定義
interface RankingEntry {
  nickname: string;
  score: number;
}

// Firestoreからランキングを取得する関数
export const getRanking = async (): Promise<RankingEntry[]> => {
  const rankingRef = collection(db, 'ranking');
  const q = query(rankingRef, orderBy('score', 'asc'), limit(5));

  try {
    const querySnapshot = await getDocs(q);
    const topRanking: RankingEntry[] = [];
    querySnapshot.forEach((doc) => {
      topRanking.push(doc.data() as RankingEntry);
    });
    return topRanking;
  } catch (e) {
    console.error("ランキングの取得に失敗しました: ", e);
    return [];
  }
};

// Firestoreにスコアを登録する関数
export const addRanking = async (nickname: string, score: number): Promise<void> => {
  try {
    await addDoc(collection(db, 'ranking'), {
      nickname: nickname,
      score: score,
    });
    console.log("スコアを登録しました");
  } catch (e) {
    console.error("エラーが発生しました: ", e);
  }
};
