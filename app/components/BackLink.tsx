export default function BackLink() {
  return (
    <button
      aria-roledescription="link"
      className="text-sm font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700 w-full text-left"
      onClick={() => window.history.back()}
    >
      ← Back to previous page
    </button>
  )
}