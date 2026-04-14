import { VERSION_NUMBER } from "../constants/Constants";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-2 px-4 py-2">
        <span className="text-sm text-slate-500">© 2026 Five. All rights reserved.</span>
        <span className="text-xs italic text-slate-500">ver. {VERSION_NUMBER}</span>
      </div>
    </footer>
  );
}