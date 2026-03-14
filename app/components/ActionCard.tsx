import { Action } from "../types"

type ActionCardProps = {
  action: Action
}

export default function ActionCard({ action }: ActionCardProps) {
  return (
    <p>{ action.id }</p>
  )
}