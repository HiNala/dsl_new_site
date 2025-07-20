'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-blue-500">
      {/* Large Header Text - Letters spread across full width */}
      <div className="pt-16 pb-20">
        <h1 className="text-center text-4xl font-thin tracking-[0.5em] text-blue-500">
          D I G I T A L &nbsp;&nbsp; S T U D I O &nbsp;&nbsp; L A B S
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="flex max-w-7xl mx-auto px-8">
        {/* Left Column - Sidebar Navigation (20-25% width) */}
        <nav className="w-1/4 pr-8">
          <ul className="space-y-6">
            <li><a href="#" className="text-lg font-light text-blue-500 hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="text-lg font-light text-blue-500 hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="text-lg font-light text-blue-500 hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="text-lg font-light text-blue-500 hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

        {/* Right Column - Main Content (75-80% width) */}
        <div className="w-3/4 pl-8">
          {/* Primary Headline */}
          <div className="mb-16">
            <h2 className="text-6xl font-thin leading-tight text-blue-500">
              We believe in the<br />
              value of what can't<br />
              be measured.
            </h2>
          </div>

          {/* Body Text Paragraph - positioned right within right column */}
          <div className="ml-auto max-w-md">
            <p className="text-base font-light leading-relaxed text-blue-500">
              Digital Studio Labs is a Los Angeles-based venture studio that 
              invests in founders and builds companies in the creator economy. 
              We believe in the value of what can't be measured: traits like 
              creativity, authenticity, and community. We're builders and 
              investors with a shared vision of the future that is driven by 
              creators and innovation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
