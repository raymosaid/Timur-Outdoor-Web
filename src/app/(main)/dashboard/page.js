import { SectionCards } from "@/components/dashboard/section-cards"
import { IncomeCharts } from "@/components/dashboard/chart-income"
import { ProductAnalysis } from "@/components/dashboard/product-analysis"

export default function Page() {
  return (
    <div className="p-[30px] flex flex-col gap-4">
      <SectionCards />
      <IncomeCharts />
      <ProductAnalysis />
    </div>
  )
}