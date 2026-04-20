import CHANGELOG from "../changelog"
import { VERSION_NUMBER } from "../constants/Constants"

interface VersionModalProps {
  onClose: () => void
}

export default function VersionModal({ onClose }: VersionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-slide-up">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal / Bottom Sheet */}
      <div className="flex flex-col items-center relative w-full max-w-md bg-white rounded-3xl shadow-xl p-5 m-4 z-10 animate-slide-up">
        <h2 className="font-bold text-lg mb-4">You're up to date 🎉</h2>

        <div className="flex flex-col gap-y-4 italic text-center">
          <span>You're now on <span className="font-bold text-bond">{VERSION_NUMBER}</span>.</span>
          Curious what's new? Check out below 👇
          <div className="max-h-48 overflow-y-scroll flex flex-col gap-y-4 p-4 border border-gray-300 rounded-xl">
            { CHANGELOG.map((entry, i) => (
              <div className="flex flex-col text-left" key={i}>
                <h2 className="font-bold tracking-wide text-center"><span>[{ entry.date }]:</span> <span className={i === 0 ? "text-bond" : ""}>{ entry.version }</span></h2>
                { entry.changes.map((change) => (
                    <span><span className="font-semibold">{ change.type }</span> - <span className="italic">{ change.notes }</span></span>
                ))}
              </div>
            )) }
          </div>
          <span>
            Issues? Questions?{' '}
            <a
              href="https://github.com/GlennHS/Five/issues"
              className="underline text-mind"
              target="_blank"
            >
              Click here
            </a>
            {' '}to log an issue. Happy tracking!
          </span>
        </div>

        <span className="w-full flex items-center justify-center mt-8 italic font-thin text-sm">
          Tap anywhere outside this box to close
        </span>
      </div>
    </div>
  )
}