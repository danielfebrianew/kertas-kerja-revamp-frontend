'use client'

import React, { useEffect, useState } from 'react'
import { fetchApi } from '@/lib/fetcher'
import { Card, CardContent } from '@/components/ui/card'
import { FilterHeader } from '@/components/filter-header'
import { getCookieValue, getCookieLabel } from '@/lib/cookie'
import PohonCascadingNode from './PohonCascadingNode'
import { Loader2, Building2 } from 'lucide-react'
import '../treeflex.css'

export default function PohonCascadingClient() {

  const [tahun, setTahun] = useState(() => getCookieValue('tahun'))
  const [kodeOpd, setKodeOpd] = useState(() => getCookieValue('opd'))
  const [namaOpd, setNamaOpd] = useState(() => getCookieLabel('opd'))

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function loadData() {

    if (!kodeOpd || !tahun) return

    try {

      setLoading(true)

      const res = await fetchApi(
        `/pohon_kinerja_opd/findall/${kodeOpd}/${tahun}`
      )

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

  return (
    <>
      <FilterHeader onActivate={handleActivate} />

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

            <div className="overflow-x-auto w-full">

              <div className="tf-tree tf-gap-sm w-fit mx-auto">

                <ul>

                  {/* ROOT NODE */}
                  <li>

                    <div className="tf-nc tf flex flex-col rounded-lg shadow-lg border-primary min-w-[384px] max-w-sm">

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

                      </div>

                    </div>

                    {/* TREE */}

                    <ul>

                      {data.map((node) => (

                        <PohonCascadingNode
                          key={node.id}
                          node={node}
                        />

                      ))}

                    </ul>

                  </li>

                </ul>

              </div>

            </div>

          </CardContent>

        </Card>

      )}
    </>
  )
}