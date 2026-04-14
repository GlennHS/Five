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

        <p className="italic text-center">
          You're now on <span className="font-bold text-bond">{VERSION_NUMBER}</span>.
          Curious what's new? Check out the{" "}
          <a
            href="https://github.com/GlennHS/Five/releases"
            className="underline text-mind"
            target="_blank"
          >
            release notes
          </a>{" "}
          or share some{" "}
          <a
            href="https://github.com/GlennHS/Five/issues"
            className="underline text-mind"
            target="_blank"
          >
            feedback
          </a>. Happy tracking!
        </p>

        <span className="w-full flex items-center justify-center mt-8 italic font-thin tracking-wide">
          Tap anywhere to close
        </span>
      </div>
    </div>
  )
}