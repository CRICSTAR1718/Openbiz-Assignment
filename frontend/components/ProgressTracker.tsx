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
                className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? 'bg-blue-600 scale-100' : 'bg-gray-300'}`}
                aria-hidden
              />
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-2 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      {/* Step text (condensed) */}
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;

          return (
            <span key={index} className={isCurrent ? 'font-semibold text-blue-600' : 'text-gray-500'}>
              {title}
            </span>
          );
        })}
      </div>
    </div>
  );
}
