import React, { useState, useEffect, useRef } from 'react';
import quizData from '../data/error_code.json';
import { TypeAnimation } from 'react-type-animation';

interface Question {
  status_code: number;
  error: string;
  message: string;
}

const Karuta = () => {
  const [cards, setCards] = useState<Question[]>([]); // 全データのカード（初期化）
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null); // 現在の問題（null許可）
  const [selectedCard, setSelectedCard] = useState<Question | null>(null); // 選択されたカード
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // 正誤判定
  const [remainingTime, setRemainingTime] = useState(20); // 残り時間
  const [correctCards, setCorrectCards] = useState<number[]>([]); // 正解したカードのステータスコードを保存
  const [timerActive, setTimerActive] = useState(false); // タイマーをアクティブにするかどうか
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 }); // カードのサイズを動的に管理
  const [gameStarted, setGameStarted] = useState(false); // ゲームが開始されたかどうか
  const [countdown, setCountdown] = useState(3); // 3カウントダウン
  const cardRefs = useRef<HTMLDivElement[]>([]); // カードの参照

  // カードをシャッフルする関数
  const shuffleArray = (array: Question[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // 初期化時にカードをシャッフルして、最初の問題をセット
  useEffect(() => {
    const shuffledCards = shuffleArray([...quizData]); // quizDataをシャッフルしてセット
    setCards(shuffledCards);
  }, []);

  // カードサイズを動的に取得し、サイズが取得できるまで待つ
  useEffect(() => {
    if (cardRefs.current.length > 0 && cards.length > 0) {
      const firstCard = cardRefs.current[0];
      if (firstCard) {
        const { width, height } = firstCard.getBoundingClientRect();
        setCardSize({ width, height }); // カードのサイズを設定
      }
    }
  }, [cards]); // カードが描画された後にサイズを取得

  // 残り時間のカウントダウンを監視するuseEffect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (remainingTime > 0 && timerActive) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      handleTimeout(); // タイムアウト処理
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [remainingTime, timerActive]);

  // ゲーム開始のカウントダウン
  useEffect(() => {
    if (gameStarted && countdown > 0) {
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdownTimer);
    } else if (countdown === 0) {
      setNextQuestion(); // カウントダウンが終わったら最初の問題を設定
      setTimerActive(true); // タイマーを開始
    }
  }, [gameStarted, countdown]);

  // 次の問題を設定
  const setNextQuestion = (cardsArray: Question[] = cards) => {
    if (cardsArray.length === 0) {
      setCurrentQuestion(null); // すべてのカードを消費したら終了
      return;
    }

    const randomIndex = Math.floor(Math.random() * cardsArray.length);
    setCurrentQuestion(cardsArray[randomIndex] || null); // 問題をセット（null許可）
    setSelectedCard(null); // 選択リセット
    setIsCorrect(null); // 正誤リセット
    setRemainingTime(20); // 残りタイムをリセット
    setTimerActive(true); // タイマーを再度アクティブに
  };

  // 正解後に1秒後自動で次の問題に進む
  useEffect(() => {
    if (isCorrect) {
      const timeout = setTimeout(() => {
        setNextQuestion(); // 5秒後に次の問題に移行
      }, 1000);
      return () => clearTimeout(timeout); // クリーンアップ
    }
  }, [isCorrect]);

  // カードが選ばれた時の処理
  const handleCardSelect = (card: Question) => {
    if (correctCards.includes(card.status_code)) return; // 正解済みのカードは選択できない

    setSelectedCard(card);
    if (currentQuestion && card.status_code === currentQuestion.status_code) {
      setIsCorrect(true); // 正解
      setCorrectCards((prev) => [...prev, card.status_code]); // 正解したカードを保存
      setTimerActive(false); // 正解時にタイマーを停止
    } else {
      setIsCorrect(false); // 不正解
    }
  };

  // タイムアウト処理（時間切れ）
  const handleTimeout = () => {
    setNextQuestion(); // 次の問題に移行
  };

  // 三平方の定理を使って対角線の長さを計算
  const diagonalLength = Math.sqrt(cardSize.width ** 2 + cardSize.height ** 2);

  // 余弦定理を使って角度を計算 (対角線がカードの水平線に対してなす角度)
  const angle = Math.atan(cardSize.height / cardSize.width) * (180 / Math.PI);

  // ゲームスタート時の処理
  const handleStartGame = () => {
    setGameStarted(true); // ゲーム開始
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', padding: '20px', textAlign: 'center' }}>
      {!gameStarted ? (
        <div>
          {/* ルール説明 */}
          <h2>かるたモードルール</h2>
          <p>問題文を読み、該当するステータスコードのカードを選んでください。</p>
          <p>タイムアウトする前に正しいカードを選びましょう。</p>
          <button className='btn btn-outline-dark' onClick={handleStartGame}>スタート</button>
        </div>
      ) : countdown > 0 ? (
        <div>
          {/* カウントダウン表示 */}
          <h2>ゲーム開始まで: {countdown}</h2>
        </div>
      ) : (
        <>
          {/* 読み上げられる問題エリア */}
          <div style={{ marginBottom: '20px' }}>
            {currentQuestion ? (
              <TypeAnimation
                key={currentQuestion?.status_code} // 問題が切り替わるたびに一意のキーを設定
                sequence={[
                  `問題: ${currentQuestion.message}`, // currentQuestion.message の値を使って問題文を表示
                  1000,  // 1秒待機
                ]}
                speed={{ type: "keyStrokeDelayInMs", value: 100 }} // 文字が表示される速度をミリ秒単位で指定
                wrapper="span"
                cursor={false}
                repeat={1} // 一度だけアニメーションを実行
                omitDeletionAnimation={true} // 文字を削除するアニメーションを省略
                style={{ whiteSpace: 'pre-line', fontSize: '1em', display: 'inline-block' }}
              />
            ) : (
              <p>すべての問題が終了しました！</p>
            )}
          </div>

          {/* 正誤メッセージ */}
          {isCorrect !== null && (
            <div style={{ marginBottom: '20px', color: isCorrect ? 'green' : 'red' }}>
              {isCorrect ? '正解！' : '不正解'}
            </div>
          )}

          {/* 残り時間の表示 */}
          <div>
            <p>残り時間: {remainingTime}秒</p>
          </div>

          {/* スクロール可能なカードエリア */}
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {cards.map((card, index) => {
              const isCardCorrect = correctCards.includes(card.status_code); // 正解したカードかどうか

              return (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el!)} // カード要素を参照
                  onClick={() => handleCardSelect(card)}
                  style={{
                    border: '1px solid black',
                    padding: '10px',
                    backgroundColor: selectedCard === card ? '#9f9f9f' : '#fff',
                    cursor: isCardCorrect ? 'not-allowed' : 'pointer', // 正解したカードは選択不可
                    position: 'relative',
                    opacity: isCardCorrect ? 0.5 : 1, // 正解したカードは半透明に
                  }}
                >
                  {/* カードに角から角へのクロス線を描く */}
                  {isCardCorrect && cardSize.width > 0 && cardSize.height > 0 && (
                    <>
                      <div
                        key={currentQuestion?.status_code}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: `${diagonalLength}px`,
                          height: '2px',
                          backgroundColor: 'black',
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: 'top left',
                        }}
                      ></div>
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: `${diagonalLength}px`,
                          height: '2px',
                          backgroundColor: 'black',
                          transform: `rotate(-${angle}deg)`,
                          transformOrigin: 'top right',
                        }}
                      ></div>
                    </>
                  )}

                  {/* ステータスコードとエラー名を非表示にする */}
                  {!isCardCorrect && (
                    <>
                      <h4>{card.status_code}</h4> {/* ステータスコードのみ表示 */}
                      <p>{card.error}</p> {/* エラー名称のみ表示 */}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Karuta;
