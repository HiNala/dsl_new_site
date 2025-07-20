export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full" style={{ 
      scrollSnapType: 'y mandatory',
      scrollBehavior: 'smooth'
    }}>
      
      {/* Section 1: Hero */}
      <section className="relative min-h-screen bg-[#F8F9FA]" style={{ scrollSnapAlign: 'start' }}>
        
        {/* Header Letters - bigger like reference */}
        <div className="h-[100px] flex justify-between items-center px-[4vw] bg-[#F8F9FA]">
          {brandLetters.map((letter, index) => {
            // First letters: D (index 0), S (index 7), L (index 13)
            const isFirstLetter = index === 0 || index === 7 || index === 13;
            return (
              <span 
                key={index}
                className={`text-[clamp(14px,1.0vw,22px)] text-[#4A90E2] ${isFirstLetter ? 'font-normal underline decoration-2 underline-offset-2 decoration-[#4A90E2]/60' : 'font-light'}`}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <div className="relative min-h-[calc(100vh-100px)]">
          
          {/* Main Headline - smaller and higher up like reference */}
          <div className="absolute left-[4vw] top-[60px]">
            <h1 className="text-[clamp(38px,5.0vw,100px)] font-light leading-[1.1] text-[#4A90E2] max-w-[65vw]">
              We believe in the<br />
              value of what can't<br />
              be measured.
            </h1>
          </div>

          {/* Body Text Paragraph - slightly bigger */}
          <div className="absolute right-[64px] top-[380px] w-[360px]">
            <p className="text-[17px] font-normal leading-[1.6] text-[#4A90E2]">
              Digital Studio Labs is a San Francisco-based venture studio that 
              invests in founders and builds companies in the creator economy. 
              We believe in the value of what can't be measured: traits like 
              creativity, authenticity, and community. We are builders dreamers 
              artists & engineers with a shared vision of the future that is driven by 
              creators and innovation.
            </p>
          </div>

          {/* Navigation - slightly bigger */}
          <nav className="absolute left-[4vw] bottom-[80px]">
            <ul className="space-y-[6px]">
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Home</a></li>
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Companies</a></li>
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">About</a></li>
              <li><a href="#about" className="text-[16px] font-normal text-[#4A90E2] hover:opacity-70 transition-opacity">Contact</a></li>
            </ul>
          </nav>

        </div>
      </section>

      {/* Section 2: About Us */}
      <section id="about" className="relative min-h-screen bg-[#1a1a1a]" style={{ scrollSnapAlign: 'start' }}>
        <div className="relative min-h-screen py-[4rem] px-[4vw] flex flex-col">
          
          {/* D/S/L Stacked Letters - Top Right */}
          <div className="absolute right-[4vw] top-[4rem] flex flex-col items-center">
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">D</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">S</span>
            <span className="text-[clamp(48px,6vw,80px)] font-light text-[#4A90E2] leading-[0.8]">L</span>
          </div>

          {/* About Us Headline - moved down */}
          <div className="mt-[8rem] mb-[3rem]">
            <h2 className="text-[clamp(36px,6vw,100px)] font-light leading-[1.0] text-white max-w-[50vw]">
              ABOUT US
            </h2>
          </div>

          {/* About Content Grid - Responsive and Compact */}
          <div className="flex-1 max-w-[75vw]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2rem] md:gap-[3rem]">
              
              {/* Our Mission */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Mission</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  To empower creators and innovators by building companies that 
                  challenge conventional thinking and celebrate human creativity.
                </p>
              </div>

              {/* Our Approach */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Approach</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  We combine deep technical expertise with creative vision, 
                  fostering environments where breakthrough ideas can flourish.
                </p>
              </div>

              {/* Our Values */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Values</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Authenticity, creativity, and community drive everything we do. 
                  We believe the best solutions emerge from diverse perspectives.
                </p>
              </div>

              {/* Our Impact */}
              <div className="border-b border-white/20 pb-[1.5rem]">
                <h3 className="text-[16px] font-medium text-[#4A90E2] mb-[0.75rem]">Our Impact</h3>
                <p className="text-[14px] font-light text-white/90 leading-[1.5]">
                  Building sustainable companies that create meaningful change 
                  in the creator economy and beyond.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
