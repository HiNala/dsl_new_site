'use client'

export default function Home() {
  return (
    <>
      {/* Row 1 - Fixed Header Strip with Brand Wordmark */}
      <header className="fixed top-0 left-0 w-full h-20 bg-gray-50 z-10">
        <ul className="flex justify-between items-center h-full px-[4vw] list-none m-0 p-0">
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">D</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">I</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">G</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">I</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">T</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">A</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">L</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">S</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">T</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">U</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">D</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">I</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">O</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">L</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">A</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">B</li>
          <li className="text-blue-500 font-medium text-[clamp(14px,1.1vw,24px)]">S</li>
        </ul>
      </header>

      {/* Row 2 - Main Content with padding-top for fixed header */}
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section - 12 Column Grid */}
        <section className="hero-grid grid grid-cols-12 gap-[2vw] w-full min-h-screen relative pl-[4vw] pr-[4vw]">
          
          {/* Headline - Columns 1-7 */}
          <div className="col-span-7 mt-[7.5rem]">
            <h1 className="text-[clamp(40px,6vw,120px)] leading-[1.05] font-normal text-blue-500">
              We believe in the<br />
              value of what can't<br />
              be measured.
            </h1>
          </div>

          {/* Body Paragraph - Columns 8-12 */}
          <div className="col-span-5 self-start mt-[12rem]">
            <p className="max-w-[34ch] text-[clamp(14px,1.1vw,20px)] leading-[1.4] font-light text-blue-500">
              Digital Studio Labs is a Los Angeles-based venture studio that 
              invests in founders and builds companies in the creator economy. 
              We believe in the value of what can't be measured: traits like 
              creativity, authenticity, and community. We're builders and 
              investors with a shared vision of the future that is driven by 
              creators and innovation.
            </p>
          </div>

          {/* Side Navigation - Absolutely positioned bottom left */}
          <nav className="absolute bottom-16 left-[4vw]">
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              <li><a href="#" className="text-sm text-blue-500 hover:opacity-70 transition-opacity no-underline">Home</a></li>
              <li><a href="#" className="text-sm text-blue-500 hover:opacity-70 transition-opacity no-underline">Companies</a></li>
              <li><a href="#" className="text-sm text-blue-500 hover:opacity-70 transition-opacity no-underline">About</a></li>
              <li><a href="#" className="text-sm text-blue-500 hover:opacity-70 transition-opacity no-underline">Contact</a></li>
            </ul>
          </nav>

        </section>
      </main>
    </>
  );
}
