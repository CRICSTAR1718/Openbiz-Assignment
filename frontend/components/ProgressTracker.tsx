interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function ProgressTracker({ currentStep, totalSteps, stepTitles }: ProgressTrackerProps) {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="mb-4">
      {/* Step dots */}
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1;
          const isActive = step <= currentStep;
          return (
            <div key={i} className="flex-1 flex items-center justify-center">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-500 to-teal-500 scale-110 shadow-md' : 'bg-blue-200'}`}
                aria-hidden
              />
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-blue-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-teal-500 h-2.5 transition-all duration-500 ease-in-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      {/* Step text (condensed) */}
      <div className="flex justify-between mt-2 text-sm text-slate-800">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;

          return (
            <span key={index} className={isCurrent ? 'font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600' : 'text-slate-600'}>
              {title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
