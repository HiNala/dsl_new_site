export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full min-h-screen">
      
      {/* Header Letters - spread across full viewport width */}
      <div className="fixed top-0 left-0 right-0 h-[100px] flex justify-between items-center px-[32px] bg-[#F8F9FA] z-10">
        {brandLetters.map((letter, index) => {
          // First letters: D (index 0), S (index 7), L (index 13)
          const isFirstLetter = index === 0 || index === 7 || index === 13;
          const getBeamClass = () => {
            if (index === 0) return 'border-beam-d';  // D
            if (index === 7) return 'border-beam-s';  // S
            if (index === 13) return 'border-beam-l'; // L
            return '';
          };
          
          return (
            <span 
              key={index}
              className={`text-[20px] ${isFirstLetter ? 'font-medium' : 'font-light'}`}
            >
              {isFirstLetter ? (
                <span className={getBeamClass()}>
                  <span className="letter-box">
                    {letter}
                  </span>
                </span>
              ) : (
                letter
              )}
            </span>
          );
        })}
      </div>

      {/* Main content area with proper spacing */}
      <div className="relative min-h-screen pt-[120px]">
        
        {/* Main Headline - positioned exactly like reference */}
        <div className="absolute left-[32px] top-[180px]">
          <h1 className="text-[72px] font-light leading-[1.05] max-w-[660px]">
            We believe in the<br />
            value of what can't<br />
            be measured.
          </h1>
        </div>

        {/* Body Text Paragraph - positioned exactly like reference */}
        <div className="absolute right-[32px] top-[520px] w-[380px]">
          <p className="text-[16px] font-normal leading-[1.5]">
            Digital Studio Labs is a San Francisco-based venture studio that 
            invests in founders and builds companies in the creator economy. 
            We believe in the value of what can't be measured: traits like 
            creativity, authenticity, and community. We're builders and 
            investors with a shared vision of the future that is driven by 
            creators and innovation.
          </p>
        </div>

        {/* Navigation - positioned exactly like reference */}
        <nav className="absolute left-[32px] bottom-[32px]">
          <ul className="space-y-[6px]">
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
