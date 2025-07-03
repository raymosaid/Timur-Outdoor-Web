'use client'

import { Card, CardTitle } from "@/components/ui/card"
import { TableProductAnalysis } from "@/components/dashboard/table-product-analysis"
import DateRangePicker from "../DateRangePicker"
import { subDays } from "date-fns"
import { useState } from "react"
import { useProductAnalysisData } from "@/lib/data"
import { ProductAnalysisPieChart } from "./product-analysis-pie-chart"
import { ProductAnalysisBarChart } from "./product-analysis-bar-chart"

export const ProductAnalysis = () => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  })
  const { data, isLoading } = useProductAnalysisData( date )  
  console.log("Product Analysis", data)

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="lg:flex items-center lg:justify-between px-4 py-2">
        <CardTitle className="text-2xl">Product Analysis</CardTitle>
        <DateRangePicker
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="grid grid-cols-12 items-center min-h-[calc(100vh-50vh)]">
        {/* <TableProductAnalysis data={data} isLoading={isLoading} /> */}
        <div className="col-span-7">
          <ProductAnalysisBarChart data={data} isLoading={isLoading} />
        </div>
        <div className="col-span-5">
          <ProductAnalysisPieChart data={data} isLoading={isLoading} />
        </div>
      </div>
    </Card>
  )
}