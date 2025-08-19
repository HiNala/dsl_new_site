"use client"

import { InteractiveScatterPlot } from "@/components/interactive-scatter-plot"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AboutCard() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const baseRow = "flex items-start space-x-3 rounded-lg cursor-pointer transition-colors"
  const inactiveBox = "hover:bg-black/[0.03]"
  const activeBox = "bg-black/[0.04] border border-black/25 shadow-sm"

  return (
    <div className="h-full w-full overflow-hidden bg-white">
      <div className="mx-auto h-full w-full max-w-[1200px] grid grid-cols-2 items-start gap-16 px-[4vw] py-10">
        {/* Left column */}
        <div className="flex flex-col justify-start">
          <div className="space-y-4">
            <h1 className="text-[clamp(24px,3vw,36px)] font-semibold text-black tracking-tight font-serif">Digital Studio Labs /</h1>
            <p className="text-[13px] text-black leading-relaxed font-mono/relaxed">
              Digital Studio Labs is a venture studio specializing in automation and data visualization, web and mobile
              app development, artificial intelligence, machine learning, computer vision, and cutting-edge technology
              solutions that transform how businesses operate and scale.
            </p>
          </div>
          <div className="space-y-3 mt-6">
            <div
              className={cn(baseRow, activeIdx === 0 ? activeBox : inactiveBox, "p-3")}
              onClick={() => setActiveIdx(0)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveIdx(0)}
            >
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-black font-mono text-[13px]">AI-Powered Business Automation</h3>
                  <span className="text-gray-500 font-mono text-[11px]">Dec 15, 2024</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-mono text-[12px]">
                  Intelligent automation systems that streamline operations and reduce manual workflows by 80%.
                </p>
              </div>
            </div>

            <div
              className={cn(baseRow, activeIdx === 1 ? activeBox : inactiveBox, "p-3")}
              onClick={() => setActiveIdx(1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveIdx(1)}
            >
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-black font-mono text-[13px]">Real-Time Data Visualization Platform</h3>
                  <span className="text-gray-500 font-mono text-[11px]">Nov 28, 2024</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-mono text-[12px]">
                  Interactive dashboards and analytics tools that transform complex data into actionable insights.
                </p>
              </div>
            </div>

            <div
              className={cn(baseRow, activeIdx === 2 ? activeBox : inactiveBox, "p-3")}
              onClick={() => setActiveIdx(2)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveIdx(2)}
            >
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-black font-mono text-[13px]">Computer Vision for Quality Control</h3>
                  <span className="text-gray-500 font-mono text-[11px]">Oct 22, 2024</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-mono text-[12px]">
                  Advanced CV systems that detect defects and anomalies with 99.5% accuracy, revolutionizing
                  manufacturing quality assurance processes.
                </p>
              </div>
            </div>

            <div
              className={cn(baseRow, activeIdx === 3 ? activeBox : inactiveBox, "p-3")}
              onClick={() => setActiveIdx(3)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveIdx(3)}
            >
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-black font-mono text-[13px]">Cross-Platform Mobile Solutions</h3>
                  <span className="text-gray-500 font-mono text-[11px]">Sep 18, 2024</span>
                </div>
                <p className="text-gray-700 leading-relaxed font-mono text-[12px]">
                  Native iOS and Android applications with seamless user experiences and enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex items-start justify-start self-stretch">
          <div className="w-full max-w-[900px] h-full min-h-[560px] mt-2">
            <InteractiveScatterPlot />
          </div>
        </div>
      </div>
    </div>
  )
}


