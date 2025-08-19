"use client"

import { useEffect, useRef, useState } from "react"

interface TimeSeriesPoint {
  time: number
  value: number
  isHistorical: boolean
  modelType?: string
  confidence?: number
}

interface ForecastModel {
  name: string
  color: string
  points: TimeSeriesPoint[]
  accuracy: number
}

export function InteractiveScatterPlot() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [models, setModels] = useState<ForecastModel[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const generateTimeSeriesData = () => {
      const historicalLength = 50
      const forecastLength = 30
      const totalLength = historicalLength + forecastLength

      const baseData: number[] = []
      for (let i = 0; i < totalLength; i++) {
        let value: number

        if (i < historicalLength) {
          const baseGrowth = 100 + i * 1.8
          const smallDips = i % 12 === 8 ? -8 : i % 15 === 3 ? -5 : 0
          const noise = (Math.random() - 0.5) * 3
          value = Math.max(95, baseGrowth + smallDips + noise)
        } else {
          const forecastIndex = i - historicalLength
          const baseValue = 190 + forecastIndex * 2.2
          const variation = (Math.random() - 0.5) * 6
          value = Math.min(280, Math.max(180, baseValue + variation))
        }

        baseData.push(value)
      }

      const mainModel: ForecastModel = {
        name: "AI Forecast Model",
        color: "#3b82f6",
        points: [],
        accuracy: 0.95,
      }

      for (let i = 0; i < totalLength; i++) {
        mainModel.points.push({
          time: i,
          value: baseData[i],
          isHistorical: i < historicalLength,
          confidence: i < historicalLength ? 1.0 : Math.max(0.75, 0.95 - (i - historicalLength) * 0.01),
        })
      }

      return [mainModel]
    }

    setModels(generateTimeSeriesData())
  }, [])

  useEffect(() => {
    if (!models.length) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 900
    canvas.height = 500

    const animate = () => {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const margin = 60
      const chartWidth = canvas.width - 2 * margin
      const chartHeight = canvas.height - 2 * margin
      const chartLeft = margin
      const chartTop = margin

      ctx.strokeStyle = "#f1f5f9"
      ctx.lineWidth = 1

      for (let i = 0; i <= 10; i++) {
        const x = chartLeft + (i * chartWidth) / 10
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.moveTo(x, chartTop)
        ctx.lineTo(x, chartTop + chartHeight)
        ctx.stroke()
      }

      for (let i = 0; i <= 8; i++) {
        const y = chartTop + (i * chartHeight) / 8
        ctx.globalAlpha = 0.3
        ctx.beginPath()
        ctx.moveTo(chartLeft, y)
        ctx.lineTo(chartLeft + chartWidth, y)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      ctx.strokeStyle = "#1e293b"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(chartLeft, chartTop + chartHeight)
      ctx.lineTo(chartLeft + chartWidth, chartTop + chartHeight)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(chartLeft, chartTop)
      ctx.lineTo(chartLeft, chartTop + chartHeight)
      ctx.stroke()

      ctx.fillStyle = "#334155"
      ctx.font = "12px 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      ctx.textAlign = "center"

      for (let i = 0; i <= 8; i++) {
        const x = chartLeft + (i * chartWidth) / 8
        const timeValue = Math.round((i * 80) / 8)
        ctx.fillText(`T${timeValue}`, x, chartTop + chartHeight + 20)
      }

      ctx.textAlign = "right"
      for (let i = 0; i <= 6; i++) {
        const y = chartTop + chartHeight - (i * chartHeight) / 6
        const value = Math.round(100 + (i * 180) / 6)
        ctx.fillText(value.toString(), chartLeft - 10, y + 4)
      }

      ctx.textAlign = "center"
      ctx.font = "13px 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      ctx.fillStyle = "#475569"
      ctx.fillText("Time Periods →", chartLeft + chartWidth / 2, canvas.height - 20)

      ctx.save()
      ctx.translate(25, chartTop + chartHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("← Growth Metric", 0, 0)
      ctx.restore()

      const separatorX = chartLeft + (50 * chartWidth) / 80
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 2
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(separatorX, chartTop)
      ctx.lineTo(separatorX, chartTop + chartHeight)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "#475569"
      ctx.font = "12px 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Historical | Forecast", separatorX, chartTop - 10)

      const cycleDuration = 20000
      const growDuration = 15000
      const holdDuration = 3000
      const resetDuration = 2000

      const cycleTime = Date.now() % cycleDuration
      let maxTime = 0

      if (cycleTime < growDuration) {
        const growProgress = cycleTime / growDuration
        const smoothEase = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
        maxTime = smoothEase(growProgress) * 80
      } else if (cycleTime < growDuration + holdDuration) {
        maxTime = 80
      } else {
        const resetProgress = (cycleTime - growDuration - holdDuration) / resetDuration
        maxTime = 80 * (1 - resetProgress)
      }

      const model = models[0]
      const visiblePoints = model.points.filter((p) => p.time <= maxTime)

      if (visiblePoints.length > 0 && maxTime < 80) {
        const nextPointIndex = model.points.findIndex((p) => p.time > maxTime)
        if (nextPointIndex > 0 && nextPointIndex < model.points.length) {
          const prevPoint = model.points[nextPointIndex - 1]
          const nextPoint = model.points[nextPointIndex]
          const interpolationFactor = (maxTime - prevPoint.time) / (nextPoint.time - prevPoint.time)
          const interpolatedPoint: TimeSeriesPoint = {
            time: maxTime,
            value: prevPoint.value + (nextPoint.value - prevPoint.value) * interpolationFactor,
            isHistorical: nextPoint.isHistorical,
            confidence: prevPoint.confidence,
          }
          visiblePoints.push(interpolatedPoint)
        }
      }

      const forecastPoints = visiblePoints.filter((p) => !p.isHistorical)

      if (forecastPoints.length > 1) {
        const confidenceWidth = 45

        if (maxTime > 50 && maxTime < 80) {
          const allForecastPoints = model.points.filter((p) => !p.isHistorical)
          const nextPointIndex = allForecastPoints.findIndex((p) => p.time > maxTime)
          if (nextPointIndex > 0 && nextPointIndex < allForecastPoints.length) {
            const prevPoint = allForecastPoints[nextPointIndex - 1]
            const nextPoint = allForecastPoints[nextPointIndex]
            const interpolationFactor = (maxTime - prevPoint.time) / (nextPoint.time - prevPoint.time)
            const interpolatedPoint: TimeSeriesPoint = {
              time: maxTime,
              value: prevPoint.value + (nextPoint.value - prevPoint.value) * interpolationFactor,
              isHistorical: false,
              confidence: prevPoint.confidence,
            }
            forecastPoints.push(interpolatedPoint)
          }
        }

        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        forecastPoints.forEach((point, i) => {
          const x = chartLeft + (point.time * chartWidth) / 80
          const upperValue = point.value + (1 - (point.confidence || 0.8)) * confidenceWidth
          const y = chartTop + chartHeight - ((upperValue - 100) * chartHeight) / 180
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()

        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 2
        ctx.beginPath()
        forecastPoints.forEach((point, i) => {
          const x = chartLeft + (point.time * chartWidth) / 80
          const lowerValue = point.value - (1 - (point.confidence || 0.8)) * confidenceWidth
          const y = chartTop + chartHeight - ((lowerValue - 100) * chartHeight) / 180
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()

        const upperGradient = ctx.createLinearGradient(0, chartTop, 0, chartTop + chartHeight / 2)
        upperGradient.addColorStop(0, "rgba(16, 185, 129, 0.3)")
        upperGradient.addColorStop(1, "rgba(16, 185, 129, 0.05)")

        const lowerGradient = ctx.createLinearGradient(0, chartTop + chartHeight / 2, 0, chartTop + chartHeight)
        lowerGradient.addColorStop(0, "rgba(239, 68, 68, 0.05)")
        lowerGradient.addColorStop(1, "rgba(239, 68, 68, 0.3)")

        ctx.fillStyle = upperGradient
        ctx.beginPath()
        forecastPoints.forEach((point, i) => {
          const x = chartLeft + (point.time * chartWidth) / 80
          const upperValue = point.value + (1 - (point.confidence || 0.8)) * confidenceWidth
          const y = chartTop + chartHeight - ((upperValue - 100) * chartHeight) / 180
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        for (let i = forecastPoints.length - 1; i >= 0; i--) {
          const point = forecastPoints[i]
          const x = chartLeft + (point.time * chartWidth) / 80
          const y = chartTop + chartHeight - ((point.value - 100) * chartHeight) / 180
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = lowerGradient
        ctx.beginPath()
        forecastPoints.forEach((point, i) => {
          const x = chartLeft + (point.time * chartWidth) / 80
          const y = chartTop + chartHeight - ((point.value - 100) * chartHeight) / 180
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        for (let i = forecastPoints.length - 1; i >= 0; i--) {
          const point = forecastPoints[i]
          const x = chartLeft + (point.time * chartWidth) / 80
          const lowerValue = point.value - (1 - (point.confidence || 0.8)) * confidenceWidth
          const y = chartTop + chartHeight - ((lowerValue - 100) * chartHeight) / 180
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }

      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.shadowColor = "#3b82f650"
      ctx.shadowBlur = 4

      ctx.beginPath()
      visiblePoints.forEach((point, i) => {
        const x = chartLeft + (point.time * chartWidth) / 80
        const y = chartTop + chartHeight - ((point.value - 100) * chartHeight) / 180
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.shadowColor = "transparent"

      visiblePoints.forEach((point) => {
        const x = chartLeft + (point.time * chartWidth) / 80
        const y = chartTop + chartHeight - ((point.value - 100) * chartHeight) / 180

        const pointAge = maxTime - point.time
        const fadeInDuration = 2
        const opacity = Math.min(1, Math.max(0, pointAge / fadeInDuration))

        ctx.globalAlpha = opacity
        ctx.fillStyle = "#3b82f6"
        ctx.beginPath()
        ctx.arc(x, y, point.isHistorical ? 3 : 4, 0, Math.PI * 2)
        ctx.fill()

        if (!point.isHistorical) {
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })
      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [models])

  return (
    <div className="relative bg-white">
      <div className="p-4">
        <canvas
          ref={canvasRef}
          className="block mx-auto"
          style={{ width: "100%", height: "auto", maxWidth: "900px", maxHeight: "500px" }}
        />
      </div>
      <div className="px-6 py-4">
        <p className="text-sm font-mono text-gray-800 mb-2">Complete Data Visualization</p>
        <p className="text-sm font-mono text-gray-600 leading-relaxed mb-3">
          Watch as the complete time series unfolds with confidence intervals, showing both historical data and
          AI-generated forecasts growing together in one smooth animation.
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <span>• Main Forecast</span>
          <span>• Upper Confidence</span>
          <span>• Lower Confidence</span>
        </div>
      </div>
    </div>
  )
}


