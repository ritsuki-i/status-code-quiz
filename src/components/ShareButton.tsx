import React, { useCallback } from 'react';

type ShareButtonProps = {
  score: string;  // スコアを受け取るためのプロパティ
};

export const ShareButton: React.FC<ShareButtonProps> = ({ score }) => {
  const handleClick = useCallback(() => {
    const url = 'https://ritsuki-i.github.io/error-code-quiz/';
    const message = `ステータスコードクイズ、クリアタイムは ${score} 秒でした！！あなたもプレイしてみてね→ ${url}`;

    void (async () => {
      if (navigator.share) {
        // Web share API
        await navigator.share({
          title: 'ステータスコードクイズ',
          text: message,
          url, // URLはここにも含められる
        });
      } else {
        // Web Share APIが使えないブラウザの処理
        await navigator.clipboard.writeText(message);
        alert("共有メッセージをコピーしました！");
      }
    })();
  }, [score]);

  return <button onClick={handleClick}>結果を共有</button>;
};
