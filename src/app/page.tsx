export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full min-h-screen">
      
      {/* Header Letters - spread across full viewport width */}
      <div className="fixed top-0 left-0 right-0 h-[120px] flex justify-between items-center px-8">
        {brandLetters.map((letter, index) => {
          // First letters: D (index 0), S (index 7), L (index 13)
          const isFirstLetter = index === 0 || index === 7 || index === 13;
          return (
            <span 
              key={index}
              className={`text-[24px] ${isFirstLetter ? 'font-medium underline decoration-1 underline-offset-2 decoration-[#4A90E2]/30' : 'font-light'}`}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Main content area with proper top margin */}
      <div className="pt-[120px] relative min-h-screen">
        
        {/* Main Headline - positioned like immeasurable.com */}
        <div className="absolute left-8 top-[100px]">
          <h1 className="text-[72px] font-light leading-[0.95] max-w-[800px]">
            We believe in the<br />
            value of what can't<br />
            be measured.
          </h1>
        </div>

        {/* Body Text Paragraph - positioned on right side like reference */}
        <div className="absolute right-8 top-[400px] w-[400px]">
          <p className="text-[16px] font-normal leading-[1.6]">
            Digital Studio Labs is a San Francisco-based venture studio that 
            invests in founders and builds companies in the creator economy. 
            We believe in the value of what can't be measured: traits like 
            creativity, authenticity, and community. We're builders and 
            investors with a shared vision of the future that is driven by 
            creators and innovation.
          </p>
        </div>

        {/* Navigation - positioned in bottom left like reference */}
        <nav className="absolute left-8 bottom-16">
          <ul className="space-y-4">
            <li><a href="#" className="text-[16px] font-normal hover:opacity-70 transition-opacity">Home</a></li>
            <li><a href="#" className="text-[16px] font-normal hover:opacity-70 transition-opacity">Companies</a></li>
            <li><a href="#" className="text-[16px] font-normal hover:opacity-70 transition-opacity">About</a></li>
            <li><a href="#" className="text-[16px] font-normal hover:opacity-70 transition-opacity">Contact</a></li>
          </ul>
        </nav>

      </div>
    </div>
  );
}
