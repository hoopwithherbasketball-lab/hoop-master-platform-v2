export interface AcademicPathwaySelectorProps {
  value?: string
  options?: string[]
  onChange?: (value: string) => void
}

const DEFAULT_PATHWAYS = [
  'NCAA Division I',
  'NCAA Division II',
  'NCAA Division III',
  'NAIA',
  'Junior College',
]

export default function AcademicPathwaySelector({ value = '', options = DEFAULT_PATHWAYS, onChange }: AcademicPathwaySelectorProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      Academic pathway
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a pathway</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
