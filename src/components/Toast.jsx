import { useStore } from '../store/useStore.js'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const clearToast = useStore((s) => s.clearToast)

  if (!toast) return null

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-accent text-black text-sm font-semibold rounded-full shadow-lg animate-bounce-in flex items-center gap-2 max-w-xs text-center"
      onClick={clearToast}
    >
      {toast}
    </div>
  )
}
