'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-blue-600 px-8 py-12">
      {/* Top Header - Letter Spaced */}
      <div className="text-center mb-24">
        <h1 className="text-lg font-light tracking-[0.5em] uppercase">
          D I G I T A L  S T U D I O  L A B S
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto flex">
        {/* Left Navigation */}
        <nav className="w-64 pr-16">
          <ul className="space-y-6 text-lg font-light">
            <li><a href="#" className="hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Left Side - Main Heading */}
          <div className="w-1/2 pr-16">
            <h2 className="text-6xl font-light leading-tight">
              We believe in the<br />
              value of what can't<br />
              be measured.
            </h2>
          </div>

          {/* Right Side - Description */}
          <div className="w-1/2 pt-16">
            <p className="text-lg font-light leading-relaxed">
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
