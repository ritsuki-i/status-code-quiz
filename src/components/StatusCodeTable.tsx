// src/components/StatusCodeTable.tsx

import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import errorCodeData from '../data/error_code.json'; // JSON データのインポート
import { TextField, Box} from '@mui/material';
import { ErrorCode } from '../types/ErrorCode'; // 型定義のインポート

const StatusCodeTable: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<ErrorCode[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,        // 初期ページを0に設定
    pageSize: 5,    // 初期ページサイズを5に設定
  });

  // 初期データの設定
  useEffect(() => {
    const dataWithId: ErrorCode[] = errorCodeData.map((item) => ({
      id: item.status_code, // 'status_code' を 'id' として設定
      ...item,
    }));
    setFilteredData(dataWithId);
  }, []);

  // 検索機能の実装
  useEffect(() => {
    const lowercasedFilter = searchText.toLowerCase();
    const filtered: ErrorCode[] = errorCodeData
      .map((item) => ({
        id: item.status_code,
        ...item,
      }))
      .filter((item: ErrorCode) => {
        return (
          String(item.status_code).toLowerCase().includes(lowercasedFilter) ||
          item.error.toLowerCase().includes(lowercasedFilter) ||
          item.message.toLowerCase().includes(lowercasedFilter)
        );
      });
    setFilteredData(filtered);
  }, [searchText]);

  // DataGrid の列定義
  const columns: GridColDef[] = [
    { field: 'status_code', headerName: 'ステータスコード', width: 15 },
    { field: 'error', headerName: 'エラー名', width: 200 },
    { field: 'message', headerName: 'メッセージ', width: 600 },
  ];

  return (
    <Box sx={{ height: '80vh', width: '100%', padding: '20px' }}>      
      {/* 検索入力フィールド */}
      <TextField
        variant="outlined"
        placeholder="検索..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: '20px' }}
        fullWidth
      />
      
      {/* DataGrid テーブル */}
      <DataGrid
        rows={filteredData}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        pageSizeOptions={[5, 10, 25, 50]} // ページサイズオプションを設定
        sortingOrder={['asc', 'desc']}
        autoHeight
      />
    </Box>
  );
};

export default StatusCodeTable;
