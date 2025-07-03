"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"

const chartConfig = {
  sum: {
    label: "Pemasukan",
    color: "hsl(var(--chart-1))",
  },
}

export function IncomeChartDots({ title, chartData, isLoading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
        <CardDescription>{formatCurrency(chartData?.reduce((sum, object) => sum + object.sum, 0))}</CardDescription>
      </CardHeader>
      <CardContent>
        {!!isLoading ? <div>Loading...</div> : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={true}
                axisLine={true}
                tickMargin={8}
                tickFormatter={(value) => format(value, "dd MMM")}
              />
              <YAxis
                dataKey="sum"
                tickLine={false}
                axisLine={true}
                tickMargin={-20}
                tickFormatter={value => formatCurrency(value)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="sum"
                type="bump"
                stroke="var(--color-sum)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-sum)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  )
}
