export default function AuthHeader({ children }) {
  return (
    <header className={`w-full py-3 px-4 sm:px-6 flex items-center ${children ? 'justify-between' : ''} bg-white/80 backdrop-blur-sm border-b border-[#E0D8C8]`}>
      <img src="/images/jens-logo.png" alt="Jen's LLC" className="h-11 w-auto object-contain" />
      {children}
    </header>
  )
}
