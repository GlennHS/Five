import { SubmitEvent, useState } from "react";
import { ActionDefinition } from "../types";
import DatePicker from "react-datepicker";
import DefinitionCard from "./DefinitionCard";

export default function LogModal({
  def,
  isOpen,
  onClose,
  onSubmit
} : {
  def: ActionDefinition | null,
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (data: {id: number, timestamp: number, note: string}) => void
}) {
  const [formData, setFormData] = useState({
    id: -1,
    timestamp: new Date(),
    note: "",
  });

  const [chosenDate, setChosenDate] = useState<Date>(new Date())

  const resetFormData = () => {
    setChosenDate(new Date())

    setFormData({
      id: -1,
      timestamp: new Date(),
      note: "",
    })
  }

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate === null) return
    setChosenDate(newDate)
    setFormData({
      ...formData,
      timestamp: newDate
    })
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      id: def!.id,
      timestamp: formData.timestamp.valueOf(),
      note: formData.note
    })
    resetFormData()
  }

  const handleClose = () => {
    resetFormData()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-slide-up">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal / Bottom Sheet */}
      <div className={`relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-5 z-10 animate-slide-up ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Grab handle (mobile affordance) */}
        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

        <h2 className="text-lg font-semibold text-gray-800 m2-4">
          Log Action
        </h2>
        { def !== null && <DefinitionCard definition={def} className="mb-2 py-2" /> }

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Date / Time */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">
              When did this happen?
            </label>

            <DatePicker
              selected={chosenDate}
              onChange={(v: Date | null) => handleDateChange(v)}
              showTimeSelect
              dateFormat="d MMM yyyy, HH:mm"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              popperClassName="z-50"
              calendarClassName="rounded-xl shadow-lg border border-gray-200"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">
              Notes (optional)
            </label>

            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Anything worth noting?"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium active:scale-[0.98] transition"
            >
              Save Action
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl text-gray-600 bg-gray-100 active:scale-[0.98] transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}