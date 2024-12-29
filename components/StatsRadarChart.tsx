'use client'

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 273 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
]

export function StatsRadarChart() {
  return (
    <div className="">
      {chartData.map((c) => c.month)}
    </div>
  )
}
