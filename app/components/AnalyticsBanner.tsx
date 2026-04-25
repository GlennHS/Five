import { NextStep, useNextStep } from "nextstepjs"

interface Props {
  consentHandler: (consentGiven: boolean) => void
}

export default function AnalyticsBanner({ consentHandler } : Props) {
  const { isNextStepVisible } = useNextStep()

  if (isNextStepVisible) return;

  return (
    <div className="w-full flex items-center justify-center text-center fixed top-0 left-0 backdrop-blur-lg">
      <div className="flex items-center justify-around gap-2 max-w-3xl w-full bg-bond/20 text-black border-b-2 border-bond shadow-2xl px-2 py-4 z-50">
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="font-bold text-2xs">Please can I collect some anonymous usage stats? It really helps me develop FIVE!</span>
          <span className="italic text-3xs">I use <a href="https://vercel.com/" target="_blank" className="font-bold text-bond underline">Vercel</a> for my analytics. You can see their privacy policy <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" className="text-bond font-bold underline">here</a>.</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 text-xs">
          <button onClick={() => consentHandler(true)} className="border border-black rounded-xl bg-bond text-white font-bold active:bg-gray-300 px-4 py-1">Sure!</button>
          <button onClick={() => consentHandler(false)} className="text-black text-2xs italic underline active:bg-gray-300 py-1">No thanks</button>
        </div>
      </div>
    </div>
  )
}