// app/(authenticated)/opd/pohon-kinerja-opd/_components/CrosscuttingCard.tsx

'use client';

interface CrosscuttingCardProps {
  ditolak: number;
  pending: number;
  onEditClick: () => void;
}

export function CrosscuttingCard({ ditolak, pending, onEditClick }: CrosscuttingCardProps) {
  return (
    <div className="flex flex-col justify-between border-2 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
      <h1 className="font-semibold border-b-2 py-1 text-center">Crosscutting Pending</h1>
      <div className="flex flex-col py-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="px-2 py-1 text-start min-w-[130px]">Ditolak</td>
              <td className="py-1">:</td>
              <td className="px-2 py-1 text-center w-full">{ditolak}</td>
            </tr>
            <tr>
              <td className="px-2 py-1 text-start min-w-[130px]">Pending</td>
              <td className="py-1">:</td>
              <td className="px-2 py-1 text-center w-full">{pending}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={onEditClick}
        className="px-3 flex justify-center items-center gap-1 py-2 bg-[#3072D6] hover:bg-[#255db8] text-white rounded-lg w-full font-semibold text-sm transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
    </div>
  );
}
