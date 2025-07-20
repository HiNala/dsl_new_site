export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full min-h-screen">
      {/* Container with max-width 1400px, centered */}
      <div className="max-w-[1400px] mx-auto relative">
        
        {/* Header Letters - 80px from top, centered, 120px spacing */}
        <div className="absolute top-[80px] left-0 right-0">
          <div className="flex justify-center items-center gap-[120px]">
            {brandLetters.map((letter, index) => (
              <span 
                key={index}
                className="text-[48px] font-light"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Left Sidebar Navigation - 32px from edge, 320px from top */}
        <nav className="absolute left-[32px] top-[320px] w-[280px]">
          <ul className="space-y-[32px]">
            <li><a href="#" className="text-[18px] font-normal hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="text-[18px] font-normal hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="text-[18px] font-normal hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="text-[18px] font-normal hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

        {/* Main Headline - 32px from edge, 240px from top */}
        <div className="absolute left-[32px] top-[240px] max-w-[800px]">
          <h1 className="text-[120px] font-light leading-[1.1]">
            We believe in the<br />
            value of what can't<br />
            be measured.
          </h1>
        </div>

        {/* Body Text Paragraph - 64px from right edge, 520px from top, 380px width */}
        <div className="absolute right-[64px] top-[520px] w-[380px]">
          <p className="text-[16px] font-normal leading-[1.6]">
            Digital Studio Labs is a San Francisco-based venture studio that 
            invests in founders and builds companies in the creator economy. 
            We believe in the value of what can't be measured: traits like 
            creativity, authenticity, and community. We're builders and 
            investors with a shared vision of the future that is driven by 
            creators and innovation.
          </p>
        </div>

      </div>
    </div>
  );
}
