'use client'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSummaryTransactions } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import DateRangePicker from "../DateRangePicker"

export const SectionCards = () => {
  const [date, setDate] = useState({
    from: new Date(),
    to: new Date()
  })
  const { data, isLoading, error } = useSummaryTransactions( date )

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between px-4">
        <CardTitle className="text-3xl">Summary</CardTitle>
        <DateRangePicker
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="mt-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 bg-gradient-to-t md:grid-cols-2 xl:grid-cols-3 5xl:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Pemasukan</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {!isLoading && !error ? formatCurrency(data?.total_rent_transaction + data?.total_sell_transaction) : "Loading..."}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Berdasarkan Payment</CardDescription>
              <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl grid grid-cols-3 xl:grid-cols-4">
                <p>QRIS</p>
                <p>{!isLoading ? formatCurrency((data?.rent_method?.find(d => d.method === "QRIS")?.sum || 0) + (data?.sell_method?.find(d => d.method === "QRIS")?.sum || 0)) : "Loading..."}</p>
              </CardTitle>
              <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl grid grid-cols-3 xl:grid-cols-4">
                <p>CASH</p>
                <p>{!isLoading ? formatCurrency((data?.rent_method?.find(d => d.method === "CASH")?.sum || 0) + (data?.sell_method?.find(d => d.method === "CASH")?.sum || 0)) : "Loading..."}</p>
              </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Jenis</CardDescription>
            <CardTitle className="grid grid-cols-3 xl:grid-cols-4 text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <p>SEWA</p>
              <p>{!isLoading ? formatCurrency(data?.total_rent_transaction) : "Loading..."}</p>
            </CardTitle>
            <CardTitle className="grid grid-cols-3 xl:grid-cols-4 text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <p>JUAL</p>
              <p>{!isLoading ? formatCurrency(data?.total_sell_transaction) : "Loading..."}</p>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
          </CardFooter>
        </Card>
      </div>
    </Card>
  )
}