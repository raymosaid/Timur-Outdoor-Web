'use client'

import { useState } from "react"
import { IncomeChartDots } from "../charts/income"
import { useChartData } from "@/lib/data"
import DateRangePicker from "@/components/DateRangePicker"
import { subDays } from "date-fns"
import { Card, CardHeader, CardTitle } from "../ui/card"

export const IncomeCharts = () => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const { data, isLoading } = useChartData( date )  

  return (
    <Card className="bg-white flex flex-col gap-4 p-4">
      <div className="lg:flex items-center lg:justify-between px-4 py-2">
        <CardTitle className="text-2xl">Grafik Pemasukan</CardTitle>
        <DateRangePicker
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="lg:grid lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <IncomeChartDots
            title={"Pemasukan"}
            chartData={data?.sum}
            isLoading={isLoading}
          />
        </div>
        <div className="grid lg:grid-rows-2 gap-4">
          <IncomeChartDots
            title={"Sewa"}
            chartData={data?.rent}
            isLoading={isLoading}
          />
          <IncomeChartDots
            title={"Jual"}
            chartData={data?.sell}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Card>
  )
}