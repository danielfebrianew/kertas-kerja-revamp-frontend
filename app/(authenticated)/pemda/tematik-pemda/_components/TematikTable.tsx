// app/(authenticated)/pemda/tematik-pemda/_components/TematikTable.tsx

'use client';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import type { TematikPemdaItem } from '@/types/tematik';

interface TematikTableProps {
  data: TematikPemdaItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TematikTable({ data, onEdit, onDelete }: TematikTableProps) {
  const columns: GridColDef<TematikPemdaItem>[] = [
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
      field: 'tema',
      headerName: 'Tema',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div className="py-4 whitespace-normal break-words text-center uppercase">
          {params.row.tema} - {params.row.id}
        </div>
      ),
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'keterangan',
      headerName: 'Keterangan',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <div className="py-4 whitespace-normal break-words text-center capitalize">
          {params.row.keterangan || '-'}
        </div>
      ),
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'indikator',
      headerName: 'Indikator',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        const indikatorList = params.row.indikator;
        if (!indikatorList || indikatorList.length === 0) {
          return <div className="py-4 text-center w-full">-</div>;
        }
        return (
          <div className="flex flex-col gap-3 py-4 w-full h-full justify-center">
            {indikatorList.map((ind, i) => (
              <div key={i} className="whitespace-normal text-center uppercase">
                {ind.nama_indikator}
              </div>
            ))}
          </div>
        );
      },
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'target',
      headerName: 'Target/Satuan',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const indikatorList = params.row.indikator;
        if (!indikatorList || indikatorList.length === 0) {
          return <div className="py-4 text-center w-full">-</div>;
        }
        return (
          <div className="flex flex-col gap-3 py-4 w-full h-full justify-center text-center uppercase">
            {indikatorList.map((ind, i) => {
              const targetData = ind.targets?.[0];
              if (!targetData) return <div key={i}>-</div>;
              return (
                <div key={i}>
                  {targetData.target} / {targetData.satuan}
                </div>
              );
            })}
          </div>
        );
      },
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex flex-col gap-2 justify-center items-center py-4 w-full px-2">
          <button
            onClick={() => onEdit(params.row.id)}
            className="w-full px-3 py-1.5 flex justify-center items-center bg-[#22c55e] text-white hover:bg-green-600 rounded-md transition-colors text-xs font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(params.row.id)}
            className="w-full px-3 py-1.5 flex justify-center items-center bg-[#e11d48] hover:bg-rose-700 text-white rounded-md transition-colors text-xs font-medium"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
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
          
          // 1. KEMBALIKAN KODE INI: Menghilangkan panah sorting di sebelah teks
          '& .MuiDataGrid-iconButtonContainer': {
            display: 'none',
          },

          // 2. PERTAHANKAN KODE INI: Memaksa menu titik tiga selalu tampil & ada efek hover
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
            }
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
