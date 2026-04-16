import { format, isSameDay } from 'date-fns'
import { getAvailableDates } from '../utils/slots.js'

const dates = getAvailableDates(14)

export default function DatePicker({ selected, onSelect }) {
  return (
    <div className="w-full">
      <h2 className="font-serif text-2xl text-[#2D2438] mb-5">Choose a Date</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {dates.map((date) => {
          const isSelected = selected && isSameDay(date, selected)
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={`
                flex flex-col items-center py-3 px-2 rounded-xl border transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'bg-[#8B6FB8] border-[#8B6FB8] text-white shadow-md'
                  : 'bg-white border-[#E8DFF0] text-[#2D2438] hover:border-[#B8A5D9] hover:bg-[#F5F0F8]'
                }
              `}
            >
              <span className={`text-xs font-medium uppercase tracking-widest mb-1 ${isSelected ? 'text-purple-200' : 'text-[#7A6B8A]'}`}>
                {format(date, 'EEE')}
              </span>
              <span className="text-xl font-semibold">{format(date, 'd')}</span>
              <span className={`text-xs mt-0.5 ${isSelected ? 'text-purple-200' : 'text-[#7A6B8A]'}`}>
                {format(date, 'MMM')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
