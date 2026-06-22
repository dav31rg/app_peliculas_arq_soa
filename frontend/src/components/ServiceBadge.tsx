/** Badge educativo que muestra qué microservicio respondió este dato */
export function ServiceBadge({ service }: { service: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border border-blue-800 bg-blue-950 text-blue-300">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      {service}
    </span>
  )
}
