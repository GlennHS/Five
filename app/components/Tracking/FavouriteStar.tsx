import { Star } from "lucide-react"

interface Props {
  isFilled: boolean
  onClick: () => void
}

export default function FavouriteStar({ isFilled, onClick } : Props) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      { isFilled ? 
        <Star strokeWidth={0} fill="#cc3" />
      :
        <Star strokeWidth={1} stroke="#cc3" />
      }
    </div>
  )
}