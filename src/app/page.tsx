import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <Spline
        scene="https://prod.spline.design/RSlYov6mvjeyk1b6/scene.splinecode" 
      />
      
      {/* Title - Left Side */}
      <div className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-10">
        <h1 className="text-black font-light text-8xl md:text-9xl lg:text-[12rem] leading-none tracking-tight text-left">
          <div>Digital</div>
          <div>Studio</div>
          <div>Labs</div>
        </h1>
      </div>
    </main>
  );
}
