import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Practice from './Practice';
import { Box, Button, Typography } from '@mui/material';

function PracticeMode() {
  const navigate = useNavigate();

  return (
    <Box
      className='PracticeMode'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // ビューポート全体の高さを使用
      }}
    >
      {/* ヘッダー */}
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffeeb5',
          padding: '10px 20px',
          flexShrink: 0, // ヘッダーの高さを固定
        }}
      >
        <Button
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            padding: '8px', // パディングを調整
            marginRight: '10px',
            borderRadius: '10%', // ボタンを丸くする
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // ホバー時に少し背景を暗く
            },
            '&:focus': {
              outline: 'none', // フォーカス時のアウトラインを消す
            },
          }}
        >
          <ChevronLeftIcon />
        </Button>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          練習モード
        </Typography>
      </Box>

      {/* テーブルコンテナ */}
      <Box
        sx={{
          flexGrow: 1, // 利用可能なスペースをすべて占有
          overflowY: 'auto', // 垂直方向にスクロール可能にする
          padding: '20px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <Practice />
      </Box>

      {/* フッター */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#ffeeb5',
          textAlign: 'center',
          padding: '15px 20px',
          flexShrink: 0, // フッターの高さを固定
        }}
      >
        © 2024 Ritsuki Ishikawa
      </Box>
    </Box>
  );
}

export default PracticeMode;
