export default function Field({ label, type, value, placeholder, error, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2C4A14] mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3.5 rounded-xl border text-[#2D2438] placeholder-[#B8A5D9] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B6FB8] focus:border-transparent transition-all text-base ${error ? 'border-red-400' : 'border-[#D4C4A0]'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
