export default function Hero() {
  return (
    <section className="hero relative grid min-h-screen grid-cols-12 gap-[2vw] pt-32 pl-[4vw]">
      <h1 className="col-span-7 font-light text-[clamp(40px,6.8vw,9rem)] leading-[1.04] tracking-tight2">
        We believe in the<br />
        value of what can't<br />
        be measured.
      </h1>

      <p className="col-start-9 col-span-4 self-start max-w-[32ch] text-base leading-[1.45]">
        Digital Studio Labs is a San Francisco-based venture studio that invests
        in founders and builds companies in the creator economy. We believe in
        the value of what can't be measured: traits like creativity,
        authenticity, and community. We're builders and investors with a shared
        vision of the future that is driven by creators and innovation.
      </p>

      <nav className="absolute bottom-16 left-[4vw] flex flex-col gap-3 text-sm">
        <a href="#home" className="hover:opacity-70 transition-opacity">Home</a>
        <a href="#companies" className="hover:opacity-70 transition-opacity">Companies</a>
        <a href="#about" className="hover:opacity-70 transition-opacity">About</a>
        <a href="#contact" className="hover:opacity-70 transition-opacity">Contact</a>
      </nav>
    </section>
  )
} 