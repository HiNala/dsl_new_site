import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <Spline
        scene="https://prod.spline.design/RSlYov6mvjeyk1b6/scene.splinecode" 
      />
      
      {/* Title - Centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <h1 className="text-black font-light text-6xl md:text-8xl lg:text-9xl leading-none tracking-tight text-left">
          <div>Digital</div>
          <div>Studio</div>
          <div>Labs</div>
        </h1>
      </div>
    </main>
  );
}
