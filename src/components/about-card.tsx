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
    <div className="h-full w-full overflow-hidden bg-white flex items-center">
      <div className="mx-auto w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 items-start gap-10 md:gap-24 px-[4vw] py-8 md:py-10 my-auto">
        {/* Left column */}
        <div className="flex flex-col justify-start order-2 md:order-1">
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-[clamp(20px,5vw,36px)] font-semibold text-black tracking-tight font-serif">Digital Studio Labs /</h1>
            <p className="text-[12px] md:text-[13px] text-black leading-relaxed font-mono/relaxed">
              Digital Studio Labs is a venture studio specializing in automation and data visualization, web and mobile
              app development, artificial intelligence, machine learning, computer vision, and cutting-edge technology
              solutions that transform how businesses operate and scale.
            </p>
          </div>
          <div className="space-y-2 md:space-y-3 mt-5">
            {[0,1,2,3].map((idx) => (
              <div
                key={idx}
                className={cn(baseRow, activeIdx === idx ? activeBox : inactiveBox, "p-3")}
                onClick={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveIdx(idx)}
              >
                <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-black font-mono text-[12px] md:text-[13px]">
                      {[
                        "AI-Powered Business Automation",
                        "Real-Time Data Visualization Platform",
                        "Computer Vision for Quality Control",
                        "Cross-Platform Mobile Solutions",
                      ][idx]}
                    </h3>
                    <span className="text-gray-500 font-mono text-[10px] md:text-[11px]">
                      {["Dec 15, 2024","Nov 28, 2024","Oct 22, 2024","Sep 18, 2024"][idx]}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-mono text-[11px] md:text-[12px]">
                    {[
                      "Intelligent automation systems that streamline operations and reduce manual workflows by 80%.",
                      "Interactive dashboards and analytics tools that transform complex data into actionable insights.",
                      "Advanced CV systems that detect defects and anomalies with 99.5% accuracy, revolutionizing manufacturing quality assurance processes.",
                      "Native iOS and Android applications with seamless user experiences and enterprise-grade security.",
                    ][idx]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex items-start justify-start self-stretch order-1 md:order-2">
          <div className="w-full max-w-[900px] h-full min-h-[360px] md:min-h-[560px] mt-0 md:mt-2">
            <InteractiveScatterPlot />
          </div>
        </div>
      </div>
    </div>
  )
}


