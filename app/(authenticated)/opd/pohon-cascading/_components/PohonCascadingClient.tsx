// app/(authenticated)/opd/pohon-cascading/_components/PohonCascadingClient.tsx

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { fetchApi } from '@/lib/fetcher'
import { Card, CardContent } from '@/components/ui/card'
import { FilterHeader } from '@/components/filter-header'
import { getCookieValue, getCookieLabel } from '@/lib/cookie'
import PohonCascadingNode from './PohonCascadingNode'
import { Loader2, Building2 } from 'lucide-react'
import '../treeflex.css'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { IconCetak } from '@/components/ui/icons/IconCetak'
import { IconAdd } from '@/components/ui/icons/IconAdd'
import { IconEye, IconEyeOff } from '@/components/ui/icons'

export default function PohonCascadingClient() {

  const [tahun, setTahun] = useState(() => getCookieValue('tahun'))
  const [kodeOpd, setKodeOpd] = useState(() => getCookieValue('opd'))
  const [namaOpd, setNamaOpd] = useState(() => getCookieLabel('opd'))

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandAll, setExpandAll] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const rootNodeRef = useRef<HTMLDivElement>(null)

  async function loadData() {

    if (!kodeOpd || !tahun) return

    try {

      setLoading(true)


      const res = await fetchApi({
        url: `/pohon_kinerja_opd/findall/${kodeOpd}/${tahun}`,
        method: "GET",
        type: "auth"
      })

      const childs = res?.data?.data?.childs ?? []

      setData(childs)

    } catch (err) {

      console.error(err)
      setData([])

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadData()
  }, [kodeOpd, tahun])

  const handleActivate = (newTahun: string, newKodeOpd: string) => {
    setTahun(newTahun)
    setKodeOpd(newKodeOpd)
    setNamaOpd(getCookieLabel('opd'))
  }

  const handleToggleExpandAll = () => {
    const container = scrollContainerRef.current;
    const rootNode = rootNodeRef.current;
    if (container && rootNode) {
      const rootRect = rootNode.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const rootVisualX = rootRect.left - containerRect.left;

      setExpandAll((prev) => !prev);

      requestAnimationFrame(() => {
        const newRootOffsetFromContainerLeft =
          rootNode.getBoundingClientRect().left -
          container.getBoundingClientRect().left +
          container.scrollLeft;
        container.scrollLeft = newRootOffsetFromContainerLeft - rootVisualX;
      });
    } else {
      setExpandAll((prev) => !prev);
    }
  };

  return (
    <>
      <FilterHeader onActivate={handleActivate} />
      <div className="px-2">
        <div className="px-2">
          <Breadcrumb />
        </div>

        {!tahun || !kodeOpd ? (
          <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">

            <Building2 className="mb-4 size-14 text-muted-foreground/30" />

            <p className="font-display text-lg font-medium text-muted-foreground">
              PILIH OPD DAN TAHUN DI HEADER TERLEBIH DAHULU
            </p>

            <p className="mt-1 text-sm text-muted-foreground/60">
              Gunakan dropdown di atas untuk memilih OPD dan tahun
            </p>

          </div>
        ) : loading ? (

          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>

        ) : (

          <Card className="mt-6">

            <CardContent>

              <div ref={scrollContainerRef} className="overflow-x-auto w-full">

                <div className="tf-tree tf-gap-sm w-fit mx-auto">

                  <ul>

                    {/* ROOT NODE */}
                    <li>

                      <div ref={rootNodeRef} className="tf-nc tf flex flex-col rounded-lg shadow-lg border-primary min-w-[384px] max-w-sm">

                        <div className="flex flex-col rounded-lg shadow-sm mb-2 border p-3 border-primary bg-primary text-primary-foreground">
                          <span className="text-xs text-center font-bold uppercase">
                            Pohon Cascading OPD
                          </span>
                        </div>

                        <div className="bg-card p-2 rounded-b-lg text-xs">

                          <table className="w-full border-collapse">

                            <tbody>

                              <tr>
                                <td className="border p-2 font-semibold w-24">
                                  Perangkat Daerah
                                </td>

                                <td className="border p-2">
                                  {namaOpd}
                                </td>
                              </tr>

                              <tr>
                                <td className="border p-2 font-semibold">
                                  Kode OPD
                                </td>

                                <td className="border p-2">
                                  {kodeOpd}
                                </td>
                              </tr>

                              <tr>
                                <td className="border p-2 font-semibold">
                                  Tahun
                                </td>

                                <td className="border p-2">
                                  {tahun}
                                </td>
                              </tr>

                            </tbody>

                          </table>

                          <div className="flex flex-col gap-3 my-4 hide-on-capture text-xs">
                            <button
                              type="button"
                              className="w-full px-3 py-2 flex justify-center items-center whitespace-nowrap bg-linear-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-md transition-all shadow-sm"
                            >
                              <IconCetak />
                              <span className="font-semibold">Cetak Penuh Pohon Kinerja</span>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={handleToggleExpandAll}
                            className="w-full px-2 py-2 whitespace-nowrap flex justify-center gap-1 rounded-md items-center bg-card border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                          >
                            {expandAll ? <IconEyeOff /> : <IconEye />}
                            <span className="font-semibold">
                              {expandAll ? 'Sembunyikan Semua' : 'Tampilkan Semua'}
                            </span>
                          </button>

                        </div>

                      </div>

                      {/* TREE */}

                      {expandAll && (
                        <ul>

                          {data.map((node) => (

                            <PohonCascadingNode
                              key={node.id}
                              node={node}
                              kodeOpd={kodeOpd ?? ''}
                              tahun={tahun ?? ''}
                            />

                          ))}

                        </ul>
                      )}

                    </li>

                  </ul>

                </div>

              </div>

            </CardContent>

          </Card>

        )}
      </div>
    </>
  )
}
