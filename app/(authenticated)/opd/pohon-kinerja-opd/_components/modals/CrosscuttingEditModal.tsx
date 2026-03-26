// app/(authenticated)/opd/pohon-kinerja-opd/_components/modals/CrosscuttingEditModal.tsx

'use client';

interface CrosscuttingEditModalProps {
  onClose: () => void;
}

export function CrosscuttingEditModal({ onClose }: CrosscuttingEditModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />

      <div className="bg-white rounded-lg p-8 z-10 w-[50%] text-start">
        <div className="w-max-[500px] py-2 border-b text-center font-bold">
          Pohon OPD Crosscutting
        </div>

        <div className="py-5 my-5">
          <div className="mb-1">
            <label className="uppercase text-xs font-medium text-gray-700 my-2 ml-1">
              Pohon Crosscutting OPD
            </label>
            <div className="mt-1 border rounded-md p-2 text-sm text-gray-400">
              Pilih pohon crosscutting...
            </div>
          </div>

          <div className="mb-3" />
        </div>

        <div className="flex gap-1 justify-between my-2" />

        <button
          type="button"
          onClick={onClose}
          className="px-3 flex justify-center items-center py-1 bg-gradient-to-r from-[#DA415B] to-[#B1163C] hover:from-[#B7384D] hover:to-[#951230] text-white rounded-lg w-full"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

