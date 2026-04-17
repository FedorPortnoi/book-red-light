import { format, isSameDay } from 'date-fns'
import { getAvailableDates } from '../utils/slots.js'

const dates = getAvailableDates(14)

export default function DatePicker({ selected, onSelect }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl text-[#2C4A14] whitespace-nowrap">Choose Your Date</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#C4A870] to-transparent" />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {dates.map((date) => {
          const isSelected = selected && isSameDay(date, selected)
          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={[
                'group flex flex-col items-center py-3 sm:py-4 px-1 rounded-2xl border transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'bg-[#2C4A14] border-[#2C4A14] text-white shadow-[0_4px_16px_rgba(44,74,20,0.30)] scale-[1.04]'
                  : 'bg-white border-[#D4C4A0] text-[#3A2E1E] hover:border-[#8B6FB8] hover:bg-[#F5F0F8] hover:scale-[1.02] hover:shadow-md',
              ].join(' ')}
            >
              <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 ${isSelected ? 'text-green-200' : 'text-[#8A7A60]'}`}>
                {format(date, 'EEE')}
              </span>
              <span className={`text-xl sm:text-2xl font-semibold leading-none ${isSelected ? 'text-white' : 'text-[#2C4A14]'}`}>
                {format(date, 'd')}
              </span>
              <span className={`text-[9px] sm:text-[10px] mt-1 font-medium uppercase tracking-wider ${isSelected ? 'text-green-200' : 'text-[#A89870]'}`}>
                {format(date, 'MMM')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
