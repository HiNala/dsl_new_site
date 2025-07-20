import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <Spline
        scene="https://prod.spline.design/RSlYov6mvjeyk1b6/scene.splinecode" 
      />
      
      {/* Title - Left Side */}
      <div className="absolute top-1/4 left-8 md:left-16 -translate-y-1/2 z-10">
        <h1 className="text-black font-light text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight">
          <div>Digital</div>
          <div>Studio</div>
          <div>Labs</div>
        </h1>
      </div>
      
      {/* Tagline - Bottom */}
      <div className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16 z-10">
        <blockquote className="text-black/70 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-3xl">
          "The minute you choose to do what you really want to do, it's a different kind of life."
          <footer className="text-black/50 text-base md:text-lg lg:text-xl mt-3">
            - Buckminster Fuller
          </footer>
        </blockquote>
      </div>
    </main>
  );
}
