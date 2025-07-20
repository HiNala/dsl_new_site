export default function Home() {
  const brandLetters = ['D', 'I', 'G', 'I', 'T', 'A', 'L', 'S', 'T', 'U', 'D', 'I', 'O', 'L', 'A', 'B', 'S'];

  return (
    <div className="relative w-full" style={{ 
      scrollSnapType: 'y mandatory',
      scrollBehavior: 'smooth'
    }}>
      
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

      {/* Section 1: Hero */}
      <section className="relative min-h-screen bg-[#F8F9FA]" style={{ scrollSnapAlign: 'start' }}>
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
              creativity, authenticity, and community. We are builders dreamers 
              artists & engineers with a shared vision of the future that is driven by 
              creators and innovation.
            </p>
          </div>

          {/* Navigation */}
          <nav className="absolute left-[4vw] bottom-[4rem]">
            <ul className="space-y-[1rem]">
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
        <div className="pt-[120px] relative min-h-screen">
          
          {/* D/S/L Stacked Letters - Top Right */}
          <div className="absolute right-[4vw] top-[120px] flex flex-col items-center">
            <span className="text-[clamp(60px,8vw,120px)] font-light text-[#4A90E2] leading-[0.8]">D</span>
            <span className="text-[clamp(60px,8vw,120px)] font-light text-[#4A90E2] leading-[0.8]">S</span>
            <span className="text-[clamp(60px,8vw,120px)] font-light text-[#4A90E2] leading-[0.8]">L</span>
          </div>

          {/* About Us Headline */}
          <div className="absolute left-[4vw] top-[200px]">
            <h2 className="text-[clamp(48px,8vw,140px)] font-light leading-[1.0] text-white max-w-[50vw]">
              ABOUT US
            </h2>
          </div>

          {/* About Content Grid */}
          <div className="absolute left-[4vw] top-[450px] right-[4vw]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vw] max-w-[80vw]">
              
              {/* Our Mission */}
              <div className="border-b border-white/20 pb-[2rem] mb-[2rem]">
                <h3 className="text-[18px] font-medium text-[#4A90E2] mb-[1rem]">Our Mission</h3>
                <p className="text-[16px] font-light text-white/90 leading-[1.6]">
                  To empower creators and innovators by building companies that 
                  challenge conventional thinking and celebrate human creativity.
                </p>
              </div>

              {/* Our Approach */}
              <div className="border-b border-white/20 pb-[2rem] mb-[2rem]">
                <h3 className="text-[18px] font-medium text-[#4A90E2] mb-[1rem]">Our Approach</h3>
                <p className="text-[16px] font-light text-white/90 leading-[1.6]">
                  We combine deep technical expertise with creative vision, 
                  fostering environments where breakthrough ideas can flourish.
                </p>
              </div>

              {/* Our Values */}
              <div className="border-b border-white/20 pb-[2rem] mb-[2rem]">
                <h3 className="text-[18px] font-medium text-[#4A90E2] mb-[1rem]">Our Values</h3>
                <p className="text-[16px] font-light text-white/90 leading-[1.6]">
                  Authenticity, creativity, and community drive everything we do. 
                  We believe the best solutions emerge from diverse perspectives.
                </p>
              </div>

              {/* Our Impact */}
              <div className="border-b border-white/20 pb-[2rem] mb-[2rem]">
                <h3 className="text-[18px] font-medium text-[#4A90E2] mb-[1rem]">Our Impact</h3>
                <p className="text-[16px] font-light text-white/90 leading-[1.6]">
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
