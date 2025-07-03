import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

const generateRandomColor = (value) => {
  const hue = Math.floor(value * 360);
  return `hsl(${hue}, 70%, 70%)`;
}

const chartConfig = {
  total_rented: {
    label: "Tersewa",
    color: "hsl(var(--chart-1))",
  },
  product: {
    label: "Product",
  },
}

export const ProductAnalysisPieChart = ({ data, isLoading }) => {
  if (!!isLoading) return <div>Loading...</div>
  
  const chartData = data.map(item => ({
    product: item.product.name,
    total_rented: item.total_rented,
    fill: generateRandomColor(item.total_rented / Math.max(...data.map(d => d.total_rented)))
  }))

  return (
    <ChartContainer
      config={chartConfig}
      className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square pb-0"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="total_rented" label nameKey="product" />
      </PieChart>
    </ChartContainer>
  )
}