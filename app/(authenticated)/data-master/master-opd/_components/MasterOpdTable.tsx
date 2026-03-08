'use client';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export interface MasterOpdItem {
  id: string;
  kode_perangkat_daerah: string;
  nama_perangkat_daerah: string;
  nama_kepala_perangkat_daerah: string;
  nip_kepala_perangkat_daerah: string;
  pangkat_kepala_perangkat_daerah: string;
  kode_lembaga: string;
  singkatan: string;
  alamat: string;
  telepon: string;
  fax: string;
  email: string;
  website: string;
}

interface MasterOpdTableProps {
  data: MasterOpdItem[];
  onEdit: (item: MasterOpdItem) => void;
  onDelete: (item: MasterOpdItem) => void;
}

export default function MasterOpdTable({ data, onEdit, onDelete }: MasterOpdTableProps) {
  const columns: GridColDef<MasterOpdItem>[] = [
    {
      field: 'no',
      headerName: 'No',
      width: 60,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className="py-4">
          {params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1}
        </div>
      ),
    },
    {
      field: 'kode_perangkat_daerah',
      headerName: 'Kode Perangkat Daerah',
      minWidth: 180,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal wrap-break-word text-center">{params.row.kode_perangkat_daerah}</div>
      ),
    },
    {
      field: 'nama_perangkat_daerah',
      headerName: 'Nama Perangkat Daerah',
      minWidth: 190,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal wrap-break-word text-center">{params.row.nama_perangkat_daerah}</div>
      ),
    },
    {
      field: 'nama_kepala_perangkat_daerah',
      headerName: 'Nama Kepala Perangkat Daerah',
      minWidth: 200,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal wrap-break-word text-center">{params.row.nama_kepala_perangkat_daerah}</div>
      ),
    },
    {
      field: 'nip_kepala_perangkat_daerah',
      headerName: 'NIP Kepala Perangkat Daerah',
      minWidth: 210,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal wrap-break-word text-center">{params.row.nip_kepala_perangkat_daerah}</div>
      ),
    },
    {
      field: 'pangkat_kepala_perangkat_daerah',
      headerName: 'Pangkat Kepala Perangkat Daerah',
      minWidth: 230,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal wrap-break-word text-center">{params.row.pangkat_kepala_perangkat_daerah}</div>
      ),
    },
    {
      field: 'kode_lembaga',
      headerName: 'Kode Lembaga',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal wrap-break-word text-center">{params.row.kode_lembaga}</div>
      ),
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 110,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex flex-col gap-2 justify-center items-center py-4 w-full px-2">
          <button
            type="button"
            onClick={() => onEdit(params.row)}
            className="w-full px-3 py-1.5 flex justify-center items-center bg-[#22c55e] text-white hover:bg-green-600 rounded-md transition-colors text-xs font-medium"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(params.row)}
            className="w-full px-3 py-1.5 flex justify-center items-center bg-[#e11d48] hover:bg-rose-700 text-white rounded-md transition-colors text-xs font-medium"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <Paper sx={{ width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 'auto'}
        showColumnVerticalBorder
        showCellVerticalBorder
        sx={{
          border: 0,
          fontSize: '0.8rem',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'var(--primary)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            textTransform: 'capitalize',
          },
          '& .MuiDataGrid-iconButtonContainer': {
            display: 'none',
          },
          '& .MuiDataGrid-menuIcon': {
            visibility: 'visible !important',
            width: 'auto',
          },
          '& .MuiDataGrid-menuIconButton': {
            color: 'var(--primary-foreground)',
            transition: 'background-color 0.2s ease',
            opacity: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      />
    </Paper>
  );
}
