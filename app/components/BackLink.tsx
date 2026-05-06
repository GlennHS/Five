import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft strokeWidth={2} size={16}/> Back to previous page
      </button>
  )
}