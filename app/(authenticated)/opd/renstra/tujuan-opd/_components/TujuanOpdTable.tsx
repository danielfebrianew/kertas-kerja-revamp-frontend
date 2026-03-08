'use client';

import { DataGrid, type GridColDef, type GridColumnGroupingModel } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

interface TujuanOpdRow {
  id: string;
  id_tujuan_opd: number;
  urusan_bidang: string;
  tujuan: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  [key: string]: unknown;
}

interface TujuanOpdTableProps {
  rows: TujuanOpdRow[];
  tahunList: string[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TujuanOpdTable({ rows, tahunList, onEdit, onDelete }: TujuanOpdTableProps) {
  const spanHeader = (label: string) => () => (
    <div className="col-span-header-inner">{label}</div>
  );

  const staticColumns: GridColDef<TujuanOpdRow>[] = [
    {
      field: 'no',
      headerName: 'No',
      width: 55,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('No'),
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center">
          {params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1}
        </div>
      ),
    },
    {
      field: 'urusan_bidang',
      headerName: 'Urusan & Bidang Urusan',
      flex: 1.5,
      minWidth: 220,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('Urusan & Bidang Urusan'),
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center whitespace-normal break-words text-center text-xs py-2">
          {params.row.urusan_bidang}
        </div>
      ),
    },
    {
      field: 'tujuan',
      headerName: 'Tujuan OPD',
      flex: 1.5,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('Tujuan OPD'),
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center whitespace-normal break-words text-center text-xs py-2">
          {params.row.tujuan}
        </div>
      ),
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('Aksi'),
      renderCell: (params) => (
        <div className="flex flex-col gap-2 justify-center items-center h-full w-full px-2">
          <button
            onClick={() => onEdit(params.row.id_tujuan_opd)}
            className="w-full px-3 py-1.5 flex justify-center items-center bg-[#22c55e] text-white hover:bg-green-600 rounded-md transition-colors text-xs font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(params.row.id_tujuan_opd)}
            className="w-full px-3 py-1.5 flex justify-center items-center bg-[#e11d48] hover:bg-rose-700 text-white rounded-md transition-colors text-xs font-medium"
          >
            Hapus
          </button>
        </div>
      ),
    },
    {
      field: 'indikator',
      headerName: 'Indikator',
      flex: 1,
      minWidth: 180,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('Indikator'),
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center whitespace-normal break-words text-center text-xs py-2">
          {params.row.indikator || '-'}
        </div>
      ),
    },
    {
      field: 'rumus_perhitungan',
      headerName: 'Rumus Perhitungan',
      flex: 1.5,
      minWidth: 200,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('Rumus Perhitungan'),
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center whitespace-normal break-words text-center text-xs py-2">
          {params.row.rumus_perhitungan || '-'}
        </div>
      ),
    },
    {
      field: 'sumber_data',
      headerName: 'Sumber Data',
      flex: 0.7,
      minWidth: 120,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      headerClassName: 'col-span-header',
      renderHeader: spanHeader('Sumber Data'),
      renderCell: (params) => (
        <div className="h-full w-full flex items-center justify-center whitespace-normal break-words text-center text-xs py-2">
          {params.row.sumber_data || '-'}
        </div>
      ),
    },
  ];

  const tahunColumns: GridColDef<TujuanOpdRow>[] = tahunList.flatMap((tahun) => [
    {
      field: `target_${tahun}`,
      headerName: 'Target',
      width: 100,
      align: 'center' as const,
      headerAlign: 'center' as const,
      sortable: false,
      renderCell: (params: any) => (
        <div className="h-full w-full flex items-center justify-center text-center text-xs py-2">
          {params.row[`target_${tahun}`] || '-'}
        </div>
      ),
    },
    {
      field: `satuan_${tahun}`,
      headerName: 'Satuan',
      width: 100,
      align: 'center' as const,
      headerAlign: 'center' as const,
      sortable: false,
      renderCell: (params: any) => (
        <div className="h-full w-full flex items-center justify-center text-center text-xs py-2">
          {params.row[`satuan_${tahun}`] || '-'}
        </div>
      ),
    },
  ]);

  const columnGroupingModel: GridColumnGroupingModel = tahunList.map((tahun) => ({
    groupId: tahun,
    headerName: tahun,
    headerAlign: 'center',
    children: [
      { field: `target_${tahun}` },
      { field: `satuan_${tahun}` },
    ],
  }));

  const columns = [...staticColumns, ...tahunColumns];
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        columnGroupingModel={columnGroupingModel}
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
          '& .MuiDataGrid-columnHeaderGroup': {
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            fontWeight: 700,
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
