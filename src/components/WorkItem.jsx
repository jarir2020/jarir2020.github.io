import Tag from './Tag.jsx'

export default function WorkItem({ item }) {
  return (
    <article className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="font-bold text-lg">{item.role}</h3>
          <p className="text-neutral-600 dark:text-neutral-400">{item.company}</p>
        </div>
        <p className="text-sm text-neutral-500 whitespace-nowrap">
          {item.start} — {item.end}
        </p>
      </div>
      <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
        {item.highlights?.map((h, i) => <li key={i}>{h}</li>)}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {item.stack.map((s) => <Tag key={s}>{s}</Tag>)}
      </div>
    </article>
  )
}
