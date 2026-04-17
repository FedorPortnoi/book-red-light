import { generateSlots } from '../utils/slots.js'

const ALL_SLOTS = generateSlots()

export default function TimeSlots({ bookedSlots, selected, onSelect, loading }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-7">
        <h2 className="font-serif text-2xl text-[#2C4A14] whitespace-nowrap">Available Times</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#C4A870] to-transparent" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-14 rounded-full bg-[#EDE0C8] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {ALL_SLOTS.map((slot) => {
            const isBooked = bookedSlots.includes(slot.id)
            const isSelected = selected?.id === slot.id

            if (isBooked) {
              return (
                <div
                  key={slot.id}
                  className="slot-card flex items-center justify-center gap-2 px-4 py-3.5 rounded-full border border-[#E0D4BC] bg-[#F0E8D8] cursor-not-allowed"
                >
                  <span className="text-sm text-[#B8A888] line-through">{slot.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C4B49A]">Taken</span>
                </div>
              )
            }

            return (
              <button
                key={slot.id}
                onClick={() => onSelect(slot)}
                className={[
                  'slot-card flex items-center justify-center px-4 py-3.5 rounded-full border cursor-pointer text-sm font-medium transition-all',
                  isSelected
                    ? 'bg-[#8B6FB8] border-[#8B6FB8] text-white shadow-[0_4px_16px_rgba(139,111,184,0.40)]'
                    : 'bg-white border-[#D4C4A0] text-[#3A2E1E] hover:bg-[#F5F0F8] hover:border-[#8B6FB8] hover:text-[#2C4A14]',
                ].join(' ')}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
