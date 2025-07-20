'use client'

export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <>
      {/* Brand Strip - Fixed at top */}
      <header className="fixed top-0 left-0 w-full h-20 bg-[#F5F7FA] z-10">
        <ul className="flex justify-between items-center h-full px-[4vw] list-none m-0 p-0">
          {brandLetters.map((letter, index) => (
            <li 
              key={index} 
              className="text-brand-blue font-nav text-[clamp(14px,1.05vw,22px)] leading-none tracking-wide-nav"
            >
              {letter}
            </li>
          ))}
        </ul>
      </header>

      {/* Hero Section - 12 Column Grid */}
      <main className="min-h-screen grid grid-cols-12 gap-[2vw] pl-[4vw] pr-[4vw] pt-32 relative">
        
        {/* Headline - Columns 1-7 */}
        <div className="col-span-7">
          <h1 className="font-headline text-brand-blue text-[clamp(40px,6.8vw,9rem)] leading-[1.04] tracking-tight-headline">
            We believe in the<br />
            value of what can't<br />
            be measured.
          </h1>
        </div>

        {/* Sub-copy Paragraph - Columns 9-12 */}
        <div className="col-span-4 col-start-9 self-start">
          <p className="max-w-[32ch] text-brand-blue text-[clamp(16px,1.05vw,20px)] leading-[1.45] font-light">
            Digital Studio Labs is a San Francisco-based venture studio that 
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
            <li><a href="#" className="text-brand-blue font-light text-[0.95rem] no-underline hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="text-brand-blue font-light text-[0.95rem] no-underline hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="text-brand-blue font-light text-[0.95rem] no-underline hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="text-brand-blue font-light text-[0.95rem] no-underline hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

      </main>
    </>
  );
}
