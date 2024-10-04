import React, { useState, useEffect } from 'react';
// JSONファイルをインポート
import quizData from '../data/error_code.json';

const Practice = () => {
    const [shuffledData, setShuffledData] = useState(quizData); // シャッフルされたクイズデータを格納
    const [currentIndex, setCurrentIndex] = useState(0); // 現在の問題のインデックス
    const [showAnswer, setShowAnswer] = useState(false); // 答えを表示するかどうか
    const [mode, setMode] = useState('all'); // 選択されたモード

    // クイズモードによる問題フィルタリング関数
    const filterQuestions = (mode: string) => {
        switch (mode) {
            case '100':
                return quizData.filter((q) => q.status_code >= 100 && q.status_code < 200);
            case '200':
                return quizData.filter((q) => q.status_code >= 200 && q.status_code < 300);
            case '300':
                return quizData.filter((q) => q.status_code >= 300 && q.status_code < 400);
            case '400':
                return quizData.filter((q) => q.status_code >= 400 && q.status_code < 500);
            case '500':
                return quizData.filter((q) => q.status_code >= 500 && q.status_code < 600);
            case 'all':
            default:
                return quizData;
        }
    };

    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // モードが変更されたときにシャッフルし直す
    useEffect(() => {
        const filteredData = filterQuestions(mode);
        const shuffled = shuffleArray([...filteredData]); // フィルタされたデータをシャッフル
        setShuffledData(shuffled);
        setCurrentIndex(0); // 新しいモードの最初の問題にリセット
        setShowAnswer(false); // 答えを非表示にリセット
    }, [mode]);

    // 現在の問題データ
    const currentQuestion = shuffledData[currentIndex];

    // 次の問題に移動
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledData.length); // 次の問題へ
        setShowAnswer(false);
    };

    // 前の問題に移動
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + shuffledData.length) % shuffledData.length); // 前の問題へ
        setShowAnswer(false);
    };

    // 答えを表示
    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    // モードが変更されたときの処理
    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMode(e.target.value); // 選択されたモードに更新
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {/* クイズモード選択 */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="mode-select">出題モードを選択: </label>
                <select id="mode-select" value={mode} onChange={handleModeChange}>
                    <option value="all">全問</option>
                    <option value="100">100番台</option>
                    <option value="200">200番台</option>
                    <option value="300">300番台</option>
                    <option value="400">400番台</option>
                    <option value="500">500番台</option>
                </select>
            </div>

            {/* クイズ問題表示 */}
            {currentQuestion ? (
                <>
                    <h2>Quiz {currentIndex + 1} / {shuffledData.length}</h2>
                    <p>{currentQuestion.message}</p>

                    {showAnswer && (
                        <div>
                            <p>Answer: {currentQuestion.status_code} {currentQuestion.error}</p>
                        </div>
                    )}

                    <div>
                        {!showAnswer && <button onClick={handleShowAnswer} className='btn btn-outline-dark'>答えを表示</button>}
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <button onClick={handlePrev} disabled={currentIndex === 0} className='btn btn-outline-dark'>前の問題</button>
                        <button onClick={handleNext} disabled={currentIndex === shuffledData.length - 1} className='btn btn-outline-dark'>次の問題</button>
                    </div>
                </>
            ) : (
                <p>問題が見つかりませんでした。</p>
            )}
        </div>
    );
};

export default Practice;
