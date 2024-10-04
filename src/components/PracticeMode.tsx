import React from 'react'
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Practice from "./Practice";

function PracticeMode() {
  const navigate = useNavigate();

  return (
    <div className='PracticeMode'>
      <header style={{ display: 'flex', backgroundColor: '#ffeeb5' }}>
        <button onClick={() => navigate('/')} style={{ backgroundColor :"#ffffff00", border: "transparent" }} className='btn btn-outline-dark'><ChevronLeftIcon/></button>
        <h2 style={{ width: '100%', textAlign: 'center' }}>練習モード</h2>
      </header>  
      <Practice/>
      <footer style={{ backgroundColor: '#ffeeb5', textAlign: 'center', padding: '30px', position: 'absolute', bottom: '0', width: '100vw' }}>
        © 2024 Ritsuki Ishikawa
      </footer>
    </div>
  )
}

export default PracticeMode