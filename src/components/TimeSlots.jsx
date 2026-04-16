import { generateSlots } from '../utils/slots.js'

const ALL_SLOTS = generateSlots()

export default function TimeSlots({ bookedSlots, selected, onSelect, loading }) {
  if (loading) {
    return (
      <div className="w-full">
        <h2 className="font-serif text-2xl text-[#2D2438] mb-5">Available Times</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-[#F5F0F8] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="font-serif text-2xl text-[#2D2438] mb-5">Available Times</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {ALL_SLOTS.map((slot) => {
          const isBooked = bookedSlots.includes(slot.id)
          const isSelected = selected?.id === slot.id

          if (isBooked) {
            return (
              <div
                key={slot.id}
                className="flex flex-col items-center justify-center py-4 px-3 rounded-xl border border-[#E8DFF0] bg-[#F5F0F8] opacity-50 cursor-not-allowed"
              >
                <span className="text-sm font-medium text-[#7A6B8A]">{slot.startLabel}</span>
                <span className="text-xs text-[#7A6B8A] mt-0.5">Booked</span>
              </div>
            )
          }

          return (
            <button
              key={slot.id}
              onClick={() => onSelect(slot)}
              className={`
                slot-card flex flex-col items-center justify-center py-4 px-3 rounded-xl border cursor-pointer
                ${isSelected
                  ? 'bg-[#8B6FB8] border-[#8B6FB8] text-white shadow-md'
                  : 'bg-white border-[#E8DFF0] text-[#2D2438] hover:border-[#B8A5D9] hover:bg-[#F5F0F8]'
                }
              `}
            >
              <span className="text-sm font-semibold">{slot.startLabel}</span>
              <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-200' : 'text-[#7A6B8A]'}`}>30 min</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
