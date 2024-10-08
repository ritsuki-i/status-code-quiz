import React, { useState, useEffect } from 'react';
import { FaRankingStar } from 'react-icons/fa6';
import { FaCrown } from "react-icons/fa";
import TextField from '@mui/material/TextField';
import { getRanking, addRanking } from '../firebaseFunctions';

// ランキングの型
interface RankingEntry {
  nickname: string;
  score: number;
}

export const RankingButton: React.FC<{ score: string }> = ({ score }) => {
  const [isPopupVisible, setPopupVisible] = useState(false); // ポップアップの表示管理
  const [nickname, setNickname] = useState(''); // ニックネーム入力欄
  const [ranking, setRanking] = useState<RankingEntry[]>([]); // ランキングデータ
  const [isEligible, setIsEligible] = useState(false); // 登録が可能かどうか
  const [hasRegistered, setHasRegistered] = useState(false); // 登録済みかどうか

  // ランキングを取得する関数
  const fetchRanking = async () => {
    const rankingData = await getRanking();
    setRanking(rankingData);

    // 自分のスコアが5位以内に入るかをチェック
    const numericScore = parseFloat(score);
    if (rankingData.length < 5 || numericScore < rankingData[4]?.score) {
      setIsEligible(true);  // スコアが上位5位以内
    }
  };

  // スコア登録
  const handleRegister = async () => {
    if (nickname && !hasRegistered) {
      await addRanking(nickname, parseFloat(score)); // Firestoreにスコアを登録
      setHasRegistered(true);  // 重複登録を防止
      fetchRanking();  // Firestoreから最新のランキングを取得
      setPopupVisible(false);  // ポップアップを閉じる
    }
  };

  useEffect(() => {
    fetchRanking();  // コンポーネントがロードされたときにランキングを取得
  }, []);

  // ポップアップを開くときにランキングをローカルストレージから読み込む
  const handlePopupOpen = () => {
    // 自分のスコアがトップ5以上なら登録可能（未登録の場合のみ）
    const numericScore = parseFloat(score);
    if (!hasRegistered && (ranking.length < 5 || numericScore < ranking[4]?.score)) {
      setIsEligible(true);
    } else {
      setIsEligible(false);
    }

    setPopupVisible(true); // ポップアップを表示
  };

  // ニックネームを入力した時の処理
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <button onClick={handlePopupOpen} className="btn btn-outline-dark" style={{ marginLeft: '10px' }}>
        <FaRankingStar /> ランキング
      </button>

      {/* ポップアップの内容 */}
      {isPopupVisible && (
        <div
          className="ranking-popup"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: 1000, // ポップアップを前面に表示
            width: '300px',
          }}
        >
          <h3><FaCrown /> ランキング <FaCrown /></h3>
          <ol>
            {ranking.length > 0 ? (
              // 上位5位まで表示し、ランキングが空の場合は空欄を表示
              [...Array(5)].map((_, index) => (
                <li key={index}>
                  {ranking[index] ? `${ranking[index].nickname}: ${ranking[index].score}秒` : '---'}
                </li>
              ))
            ) : (
              // ランキングがまだない場合
              [...Array(5)].map((_, index) => <li key={index}>---</li>)
            )}
          </ol>

          {/* 登録ボタンの表示 */}
          {!hasRegistered && isEligible ? (
            <>
              <TextField
                id="outlined-basic"
                label="ニックネームを入力"
                variant="outlined"
                sx={{ marginBottom: '10px' }}
                onChange={handleNicknameChange}
              />
              <button onClick={handleRegister} disabled={!nickname} className="btn btn-outline-dark">
                スコアを登録
              </button>
            </>
          ) : hasRegistered ? (
            <p>スコアは既に登録されています。</p>
          ) : (
            <p>上位5位以上のスコアのみランキングに登録できます。</p>
          )}

          <button onClick={() => setPopupVisible(false)} style={{ marginLeft: '10px' }} className="btn btn-outline-dark">
            閉じる
          </button>
        </div>
      )}
    </div>
  );
};
