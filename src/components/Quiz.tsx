import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { MdOutlineReplay } from "react-icons/md";

import quizData from '../data/error_code.json';
import statusData from '../data/status_code.json';
import { ShareButton } from './ShareButton';
import { RankingButton } from './RankingButton';

interface StatusCombination {
    status_code: number;
    error: string;
}

const Quiz = () => {
    const navigate = useNavigate();

    const num_questions = 1; //クイズの問題数
    const [questions, setQuestions] = useState(quizData.slice(0, num_questions)); // クイズデータ
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 現在の問題インデックス
    const [inputValue, setInputValue] = useState(''); // textboxの入力
    const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージ表示
    const [timer, setTimer] = useState(0); // タイム計測用
    const [startTime, setStartTime] = useState<number | null>(null); // スタート時間
    const [finished, setFinished] = useState(false); // クイズ終了状態
    const [penaltyMessage, setPenaltyMessage] = useState(''); // ペナルティ表示
    const [penaltyTime, setPenaltyTime] = useState(0); // ペナルティ時間
    const [isStarted, setIsStarted] = useState(false); // クイズがスタートしたかどうか
    const [isCountingDown, setIsCountingDown] = useState(false); // カウントダウン中かどうか
    const [countdown, setCountdown] = useState(3); // カウントダウンの秒数
    const inputRef = useRef<HTMLInputElement>(null); // 入力欄の参照

    // クイズ開始時にシャッフル
    useEffect(() => {
        const shuffledQuestions = shuffleArray([...quizData]);
        setQuestions(shuffledQuestions.slice(0, num_questions)); // 問題をシャッフルして取得
    }, []);

    // タイマーの更新処理（10ミリ秒ごと）
    useEffect(() => {
        if (!finished && startTime !== null) {
            const interval = setInterval(() => {
                setTimer((Date.now() - startTime) / 1000); // 経過時間を秒単位で更新
            }, 10); // 10msごとに実行
            return () => clearInterval(interval);
        }
    }, [finished, startTime]);

    // カウントダウン処理
    useEffect(() => {
        if (isCountingDown && countdown > 0) {
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
            return () => clearInterval(countdownInterval);
        } else if (countdown === 0) {
            startQuiz(); // カウントダウンが0になったらクイズを開始
        }
    }, [countdown, isCountingDown]);

    // 新しい問題に移動したとき、入力欄をアクティブにする
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); // 新しい問題の表示時に入力欄をフォーカス
        }
    }, [currentQuestionIndex]);

    // クイズをスタートする処理
    const handleStartQuiz = () => {
        setIsCountingDown(true); // カウントダウンを開始
    };

    // クイズの開始
    const startQuiz = () => {
        setIsStarted(true); // クイズがスタート
        setIsCountingDown(false); // カウントダウンを終了
        setStartTime(Date.now()); // タイマーの開始
    };

    // 入力が変更されたときの処理: 入力された値がStatusCombinationに存在するかどうかをチェック
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (/^\d{0,3}$/.test(value)) { // 3文字の整数のみ許可
            const statusCode = parseInt(value);
            const foundStatus = statusData.status_combinations.find(
                (combination: StatusCombination) => combination.status_code === statusCode
            );

            if (!foundStatus && value.length === 3) {
                setErrorMessage('存在しないステータスコードです');
            } else if (foundStatus) {
                setErrorMessage(`ステータスコード ${statusCode}: ${getErrorMessageByStatusCode(statusCode)}`);
            }
        }
    };

    // 解答ボタンを押した時の処理
    const handleCheckAnswer = () => {
        const statusCode = parseInt(inputValue);
        const currentQuestionStatus = questions[currentQuestionIndex].status_code;

        if (statusCode === currentQuestionStatus) {
            setErrorMessage(`正解  ${statusCode}: ${getErrorMessageByStatusCode(statusCode)}`);
            setTimeout(() => {
                handleNextQuestion(); // 正解なら次の問題に進む
            }, 1000); // 1秒後に次の問題に進む
        } else {
            setErrorMessage('入力されたステータスコードが正しくありません');
            applyPenalty(); // ペナルティを適用
        }
    };

    // ペナルティの適用
    const applyPenalty = () => {
        setPenaltyMessage('+3.00s'); // ペナルティメッセージを表示
        setPenaltyTime((prevPenalty) => prevPenalty + 3); // ペナルティ時間に3秒追加
        setTimeout(() => {
            setPenaltyMessage(''); // 1秒後にペナルティメッセージを消す
        }, 1000);
    };

    // 次の問題に進む
    const handleNextQuestion = () => {
        if (currentQuestionIndex < num_questions - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setInputValue('');
            setErrorMessage('');
        } else {
            // クイズ終了
            setFinished(true);
        }
    };

    // ステータスコードに対応するエラーメッセージを取得
    const getErrorMessageByStatusCode = (statusCode: number) => {
        const foundStatus = statusData.status_combinations.find(
            (combination: StatusCombination) => combination.status_code === statusCode
        );
        return foundStatus ? foundStatus.error : '';
    };

    // 配列をシャッフルする関数
    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            {finished ? (
                <div>
                    <h2>クイズ終了！タイム: {(timer + penaltyTime).toFixed(2)}秒</h2>
                    <div className='select-btn' style={{ display: 'flex', justifyContent: 'center' }}>
                        <ShareButton score={(timer + penaltyTime).toFixed(2)} />
                        <RankingButton score={(timer + penaltyTime).toFixed(2)} />
                    </div>
                    <div className='select-btn' style={{ display: 'flex', justifyContent: 'center', marginTop:'10px' }}>
                        <button className='btn btn-outline-dark' onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FaHome />
                            ホームに戻る
                        </button>
                        <button className='btn btn-outline-dark' onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginLeft:'10px' }}>
                            <MdOutlineReplay />
                            もう一度プレイ
                        </button>
                    </div>
                </div>
            ) : isCountingDown ? (
                <h2>クイズ開始まで: {countdown}</h2> // カウントダウン表示
            ) : isStarted ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div></div>
                        <div style={{ position: 'relative', fontSize: '20px' }}>
                            <span>タイム: {(timer + penaltyTime).toFixed(2)}s</span>
                            {penaltyMessage && <span style={{ color: 'red', marginLeft: '10px' }}>{penaltyMessage}</span>}
                        </div>
                    </div>

                    <h2>クイズ {currentQuestionIndex + 1} / {num_questions}</h2>
                    <p>ステータスコードの意味: {questions[currentQuestionIndex].message}</p>

                    <div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            maxLength={3}
                            style={{ borderColor: errorMessage === '' ? 'black' : 'red' }}
                            ref={inputRef} // 入力欄にフォーカス
                        />
                        <p style={{ color: errorMessage === '存在しないステータスコードです' || errorMessage === '入力されたステータスコードが正しくありません' ? 'red' : 'green' }}>
                            {errorMessage}
                        </p>
                    </div>

                    <button className='btn btn-outline-dark' onClick={handleCheckAnswer}>解答</button>
                </>
            ) : (
                // ルール説明とスタートボタン
                <div>
                    <h2>ステータスコードクイズ</h2>
                    <p>ルール説明: 問題に対応するステータスコードを入力して解答してください。</p>
                    <button className='btn btn-outline-dark' onClick={handleStartQuiz}>スタート</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
