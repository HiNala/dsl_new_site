'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-blue-600">
      {/* Top Header - Letter Spaced, positioned left */}
      <div className="pt-16 pl-8">
        <h1 className="text-sm font-light tracking-[0.8em] uppercase">
          DIGITAL STUDIO LABS
        </h1>
      </div>

      {/* Main Layout Container */}
      <div className="flex mt-24">
        {/* Left Navigation - positioned close to left edge */}
        <nav className="pl-8 pt-16">
          <ul className="space-y-8">
            <li><a href="#" className="text-lg font-light hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="text-lg font-light hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="text-lg font-light hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="text-lg font-light hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex pl-32">
          {/* Left Side - Main Heading */}
          <div className="w-3/5">
            <h2 className="text-7xl font-extralight leading-[0.9] tracking-tight">
              We believe in the<br />
              value of what can't<br />
              be measured.
            </h2>
          </div>

          {/* Right Side - Description, positioned lower and to the right */}
          <div className="w-2/5 pt-32 pl-16">
            <p className="text-base font-light leading-[1.6] text-blue-600">
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
