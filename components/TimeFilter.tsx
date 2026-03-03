'use client'

interface TimeFilterProps {
  currentPeriod: string
  onPeriodChange: (period: string) => void
}

export default function TimeFilter({ currentPeriod, onPeriodChange }: TimeFilterProps) {
  const periods = [
    { value: 'month', label: 'This Month', icon: '📅' },
    { value: 'quarter', label: 'This Quarter', icon: '📊' },
    { value: 'year', label: 'This Year', icon: '🗓️' },
    { value: 'all', label: 'All Time', icon: '⏰' }
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {periods.map(period => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            currentPeriod === period.value
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50 scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">{period.icon}</span>
            <span>{period.label}</span>
          </span>
          {currentPeriod === period.value && (
            <div className="absolute inset-0 rounded-xl bg-white opacity-20 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  )
}
