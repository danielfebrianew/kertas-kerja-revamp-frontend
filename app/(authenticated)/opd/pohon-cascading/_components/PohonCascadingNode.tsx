'use client'

import React, { useState } from 'react'
import AddModalCascading from './modals/AddModalCascading'
import {
  IconCetak,
  IconEye,
  IconEyeOff,
  IconAdd
} from '@/components/ui/icons'

interface Props {
  node: any
}

export default function PohonCascadingNode({ node }: Props) {

  const [isExpanded, setIsExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const hasChildren = node.childs && node.childs.length > 0

  const handleToggleExpand = () => {
    if (!hasChildren) return
    setIsExpanded(prev => !prev)
  }

  return (
    <li>

      {/* CARD */}
      <div className="tf-nc tf flex flex-col rounded-lg shadow-lg border-red-500 min-w-[384px] max-w-sm">

        {/* HEADER */}
        <div className="flex flex-col rounded-lg shadow-sm mb-2 border p-3 border-red-500 bg-linear-to-r from-red-500 to-pink-500 text-white">
          <span className="text-xs text-center font-bold uppercase">
            STRATEGIC PEMDA - {node.id}
          </span>
        </div>

        {/* BODY */}
        <div className="bg-card p-2 rounded-b-lg">

          <table className="w-full border-collapse text-xs">
            <tbody>

              <tr>
                <td className="border p-2 font-semibold w-24">
                  Strategic
                </td>

                <td className="border p-2">
                  {node.nama_pohon}
                </td>
              </tr>

              <tr>
                <td className="border p-2 font-semibold">
                  Pelaksana
                </td>

                <td className="border p-2">

                  {node.pelaksana && node.pelaksana.length > 0 ? (

                    node.pelaksana.map((p: any, i: number) => (
                      <div key={i}>{p.nama_pegawai}</div>
                    ))

                  ) : (

                    <span className="text-muted-foreground italic">
                      -
                    </span>

                  )}

                </td>
              </tr>

            </tbody>
          </table>


          {/* BUTTONS */}
          <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">

            {/* CETAK */}
            <button
              className="px-3 py-1 flex justify-center items-center whitespace-nowrap bg-linear-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-md transition-all shadow-sm"
            >
              <IconCetak />
              <span className="font-semibold">Cetak</span>
            </button>


            {/* TAMPILKAN */}
            <button
              disabled={!hasChildren}
              onClick={handleToggleExpand}
              className={`px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center border-2 transition-colors
                ${
                  hasChildren
                    ? 'bg-card border-foreground text-foreground hover:bg-foreground hover:text-background'
                    : 'bg-muted border-muted text-muted-foreground cursor-not-allowed'
                }`}
            >

              {isExpanded ? <IconEyeOff /> : <IconEye />}

              <span className="font-semibold ml-1">
                {isExpanded ? 'Sembunyikan' : 'Tampilkan'}
              </span>

            </button>


            {/* PELAKSANA */}
            <button
              onClick={() => setShowModal(true)}
              className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
            >
              <IconAdd />
              <span className="font-semibold ml-1">Pelaksana</span>
            </button>

          </div>

        </div>

      </div>


      {/* CHILDREN */}
      {isExpanded && hasChildren && (

        <ul>

          {node.childs.map((child: any) => (

            <PohonCascadingNode
              key={child.id}
              node={child}
            />

          ))}

        </ul>

      )}


      {/* MODAL */}
      {showModal && (

        <ul>

          <li>

            <AddModalCascading
              nodeId={node.id}
              onCancel={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false)
              }}
            />

          </li>

        </ul>

      )}

    </li>
  )
}