'use client';

import Paper from '@mui/material/Paper';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { MasterLembagaItem } from './MasterLembagaClient';

interface MasterLembagaTableProps {
  data: MasterLembagaItem[];
  onEdit: (idLembaga: string) => void;
  onDelete: (idLembaga: string) => void;
}

export default function MasterLembagaTable({
  data,
  onEdit,
  onDelete,
}: MasterLembagaTableProps) {

  const rows = data;

  const columns: GridColDef[] = [
    {
      field: 'no',
      headerName: 'No',
      width: 60,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: 'id_lembaga',
      headerName: 'ID Lembaga',
      flex: 1,
      minWidth: 220,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'nama_lembaga',
      headerName: 'Nama Lembaga',
      flex: 1,
      minWidth: 220,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'kode_lembaga',
      headerName: 'Kode Lembaga',
      flex: 1,
      minWidth: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 140,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex flex-col gap-2 justify-center items-center py-2 w-full">
          <button
            onClick={() => onEdit(params.row.id_lembaga)}
            className="w-full px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-medium"
          >
            Edit
          </button>
          {/* <button
            onClick={() => onDelete(params.row.id_lembaga)}
            className="w-full px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs font-medium"
          >
            Hapus
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <Paper sx={{ width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <DataGrid
  rows={rows}
  columns={columns}
  autoHeight
  disableRowSelectionOnClick
  getRowHeight={() => 'auto'}
  showColumnVerticalBorder
  showCellVerticalBorder
  pageSizeOptions={[5, 10, 25]}
  initialState={{
    pagination: {
      paginationModel: { page: 0, pageSize: 10 },
    },
  }}
  sx={{
    border: 0,
    fontSize: '0.8rem',

    // HEADER
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#2f3e4e',
      color: '#fff',
      fontWeight: 700,
      borderBottom: '1px solid #e5e7eb',
    },

    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#2f3e4e',
    },

    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
    },

    // CELL
    '& .MuiDataGrid-cell': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px solid #e5e7eb',
    },

    // ROW ZEBRA
    '& .MuiDataGrid-row:nth-of-type(even)': {
      backgroundColor: '#f9fafb',
    },

    // HIDE 3 DOT MENU
    '& .MuiDataGrid-iconButtonContainer': {
      display: 'none',
    },

    // PAGINATION
    '& .MuiTablePagination-root': {
      fontSize: '0.8rem',
    },
  }}
/>

    </Paper>
  );
}
