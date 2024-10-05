/** @jsxImportSource @emotion/react */
import React, { CSSProperties } from 'react'
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className='Home' style={{ backgroundColor: '#171810', height: '100vh', textAlign: 'center' }}>
      <div style={{ height: '60vh', width: '100vw', padding: '50px' }}>
        <img className="slide-img" src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt='' style={{ height: '100%' }} />
      </div>
      <div className="menu-button-block" style={buttonGroupStyle}>
        <button type="button" onClick={() => navigate('/karutamode')} css={buttonStyle}>▸ かるたモード</button>
        <button type="button" onClick={() => navigate('/quizmode')} css={buttonStyle}>▸ クイズモード</button>
        <button type="button" onClick={() => navigate('/practicemode')} css={buttonStyle}>▸ 練習モード</button>
        <button type="button" onClick={() => navigate('/statuscodedata')} css={buttonStyle}>▸ ステータスコード一覧</button>
      </div>
      <footer style={{ textAlign: 'center', padding: '30px', position: 'absolute', bottom: '0', width: '100vw', color: 'white' }}>
        © 2024 Ritsuki Ishikawa
      </footer>
    </div>
  )
}

// ボタンのグループ全体のスタイル
const buttonGroupStyle: CSSProperties = {
  display: 'inline-flex', // 子要素のサイズに合わせる
  flexDirection: 'column',
  alignItems: 'flex-start', // ボタンを左揃え
  margin: '0 auto',        // グループ全体を中央に配置
};

// ボタンの共通スタイル
const buttonStyle = css({
  background: '#ffffff00',
  border: 'none',
  color: 'white',
  fontSize: '20px',
  fontFamily: 'sans-serif',
  margin: '10px',
  cursor: 'pointer',
  textAlign: 'left',
  paddingLeft: '20px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#ffffff49', // ホバー時に背景を暗く
  },
  '&:focus': {
    outline: 'none', // フォーカス時にアウトラインを消す
  },
});

export default Home