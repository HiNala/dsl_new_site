export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full min-h-screen bg-[#F8F9FA]">
      
      {/* Header Letters - spread across full viewport width */}
      <div className="fixed top-0 left-0 right-0 h-[120px] flex justify-between items-center px-[4vw] bg-[#F8F9FA] z-10">
        {brandLetters.map((letter, index) => {
          // First letters: D (index 0), S (index 7), L (index 13)
          const isFirstLetter = index === 0 || index === 7 || index === 13;
          return (
            <span 
              key={index}
              className={`text-[clamp(14px,1.1vw,24px)] text-[#4A90E2] ${isFirstLetter ? 'font-medium underline decoration-1 underline-offset-2 decoration-[#4A90E2]/30' : 'font-light'}`}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Main content area */}
      <div className="pt-[120px] relative min-h-screen">
        
        {/* Main Headline */}
        <div className="absolute left-[4vw] top-[120px]">
          <h1 className="text-[clamp(40px,6vw,120px)] font-light leading-[1.05] text-[#4A90E2] max-w-[60vw]">
            We believe in the<br />
            value of what can't<br />
            be measured.
          </h1>
        </div>

        {/* Body Text Paragraph */}
        <div className="absolute right-[4vw] top-[500px] w-[clamp(300px,25vw,400px)]">
          <p className="text-[16px] font-normal leading-[1.6] text-[#4A90E2]">
            Digital Studio Labs is a San Francisco-based venture studio that 
            invests in founders and builds companies in the creator economy. 
            We believe in the value of what can't be measured: traits like 
            creativity, authenticity, and community. We're builders and 
            investors with a shared vision of the future that is driven by 
            creators and innovation.
          </p>
        </div>

        {/* Navigation */}
        <nav className="absolute left-[4vw] bottom-[4rem]">
          <ul className="space-y-[1rem]">
            <li><a href="#" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

      </div>
    </div>
  );
}
