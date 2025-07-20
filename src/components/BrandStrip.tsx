export default function BrandStrip() {
  const letters = 'DIGITALSTUDIOLABS'.split('')
  return (
    <header className="fixed inset-x-0 top-0 h-20 flex justify-between px-[4vw] z-50">
      <ul className="flex w-full justify-between items-center text-[clamp(14px,1.05vw,22px)] font-medium tracking-wide2">
        {letters.map((l, index) => (
          <li key={index} className="list-none">
            {l}
          </li>
        ))}
      </ul>
    </header>
  )
} 