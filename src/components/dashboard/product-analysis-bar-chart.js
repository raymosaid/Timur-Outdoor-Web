import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

const generateRandomColor = (value) => {
  const hue = Math.floor(value / 1000 * 360);
  return `hsl(${hue}, 80%, 70%)`;
}

const chartConfig = {
  total_rented: {
    label: "Tersewa",
    color: "hsl(var(--chart-1))",
  },
  product: {
    product: "Product"
  }
}

export const ProductAnalysisBarChart = ({ data, isLoading }) => {
  if (!!isLoading) return <div>Loading...</div>

  const chartData = data.slice(0, 10).map(item => ({
    product: item.product.name,
    total_rented: item.total_rented,
    fill: generateRandomColor(item.total_rented)
  }))
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: 20,
        }}
      >
        <CartesianGrid strokeWidth={2} horizontal={false} />
        <XAxis type="number" dataKey="total_rented" hide />
        <YAxis
          dataKey="product"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar
          dataKey="total_rented"
          fill="var(--color-total_rented)"
          radius={5}
        >
          <LabelList
            dataKey="product"
            position="insideLeft"
            offset={8}
            className="fill-(--color-label)"
            fontSize={12}
          />
          <LabelList
            dataKey="total_rented"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}