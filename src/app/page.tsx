import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <Spline
        scene="https://prod.spline.design/RSlYov6mvjeyk1b6/scene.splinecode" 
      />
      
      {/* Title - Left Side */}
      <div className="absolute top-1/2 left-8 md:left-16 -translate-y-1/2 z-10">
        <h1 className="text-white font-light text-4xl md:text-6xl lg:text-7xl leading-none tracking-tight">
          <div>Digital</div>
          <div>Studio</div>
          <div>Labs</div>
        </h1>
      </div>
      
      {/* Tagline - Bottom */}
      <div className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16 z-10">
        <blockquote className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl">
          "The minute you choose to do what you really want to do, it's a different kind of life."
          <footer className="text-white/60 text-xs md:text-sm mt-2">
            - Buckminster Fuller
          </footer>
        </blockquote>
      </div>
    </main>
  );
}
