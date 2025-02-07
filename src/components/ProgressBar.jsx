/* eslint-disable react/prop-types */
export default function ProgressBar({ current, total, timeLeft }) {
  const progress = (current / total) * 100

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm font-medium w-full">
        <span>
          Question {current} of {total}
        </span>
        <span>
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out ${
            timeLeft < 10 ? "animate-pulse" : ""
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

