import { Coffee, Github, Heart } from "lucide-react";
import { VERSION_NUMBER } from "../constants/Constants";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-2 py-2">
        <span className="text-sm text-slate-700">© 2026 Five. All rights reserved.</span>
        <span className="text-xs italic text-slate-700">ver. {VERSION_NUMBER}</span>
        <a
          href="https://www.ko-fi.com/aetherswitch"
          target="_blank"
          className="bg-pink-200 active:bg-pink-400 transition-colors duration-300 px-4 py-1 rounded-xl border text-xs font-bold flex gap-1 items-center"
        >
          <Heart size={16} strokeWidth={2} fill="#f77" />Support Me!
        </a>
        <a
          href="https://github.com/GlennHS/Five/issues/new/choose"
          target="_blank"
          className="transition-colors duration-300 rounded-xl overflow-hidden border text-xs font-bold flex gap-1 items-center"
        >
          <Image
            alt="GitHub logo"
            src="/images/github-logo.png"
            width={70}
            height={28}
          />
        </a>
      </div>
    </footer>
  );
}