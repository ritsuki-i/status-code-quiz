import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className='Home'>
      <header style={{ backgroundColor: '#ffeeb5', padding:'10px 0'}}>
        <h2 style={{ width: '100%', textAlign: 'center' }}>What's this error?</h2>
        <h3 style={{ width: '100%', textAlign: 'center' }}>-ゲームでステータスコードをばっちり覚えちゃおう！-</h3>
      </header>
      <div className="menu-button-block" style={{ display: 'flex', margin: '100px auto', justifyContent: 'space-between', width: '80vw' }}>
        <button type="button"
          className="btn btn-outline-dark menu-button" onClick={() => navigate('/karutamode')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)', marginLeft: '30px' }}>かるたモード</button>
        <button type="button"
          className="btn btn-outline-dark menu-button" onClick={() => navigate('/quizmode')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)' }}>クイズモード</button>
        <button type="button"
          className="btn btn-outline-dark menu-button" onClick={() => navigate('/practicemode')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)', marginRight: '30px' }}>練習モード</button>
        <button type="button"
          className="btn btn-outline-dark menu-button" onClick={() => navigate('/statuscodedata')} style={{ textShadow: '2px 2px 2px rgba(255, 255, 255, 0.8)', marginRight: '30px' }}>ステータスコード一覧</button>
      </div>
      <footer style={{ backgroundColor: '#ffeeb5', textAlign: 'center', padding: '30px', position: 'absolute', bottom: '0', width: '100vw' }}>
        © 2024 Ritsuki Ishikawa
      </footer>
    </div>
  )
}

export default Home