// app/(authenticated)/data-master/master-role/_components/MasterRoleTable.tsx

'use client';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import type { MasterRoleItem } from '@/types/master-role';

interface MasterRoleTableProps {
  data: MasterRoleItem[];
  onEdit: (item: MasterRoleItem) => void;
  onDelete: (item: MasterRoleItem) => void;
}

export default function MasterRoleTable({ data, onEdit, onDelete }: MasterRoleTableProps) {
  const columns: GridColDef<MasterRoleItem>[] = [
    {
      field: 'no',
      headerName: 'No',
      width: 70,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.row.id) + 1,
    },
    {
      field: 'role',
      headerName: 'Roles',
      flex: 1,
      minWidth: 250,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="py-4 whitespace-normal break-words text-center">
          {params.row.role}
        </div>
      ),
    },
    {
      field: 'aksi',
      headerName: 'Aksi',
      flex: 0,
      width: 260,
      minWidth: 260,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex flex-col gap-2 justify-center items-stretch w-full h-full px-1 py-1 box-border">
          <button
            onClick={() => onEdit(params.row)}
            className="w-full px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(params.row)}
            className="w-full px-3 py-1.5 bg-rose-600 text-white rounded-md text-xs font-medium"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <Paper sx={{ width: '100%', borderRadius: '0.6rem', overflow: 'hidden' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        disableRowSelectionOnClick
        autoHeight
        getRowHeight={() => 'auto'}
        showColumnVerticalBorder
        showCellVerticalBorder
        sx={{
          border: 0,
          fontSize: '0.8rem',

          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#2F435B',
            color: 'white',
          },

          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#2F435B',
          },

          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
          },

          '& .MuiDataGrid-iconButtonContainer': {
            display: 'none',
          },

          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },

          '& .MuiDataGrid-cell[data-field="aksi"]': {
            padding: '6px',
          },
        }}
      />
    </Paper>
  );
}
