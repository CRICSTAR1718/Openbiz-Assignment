interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function ProgressTracker({ currentStep, totalSteps, stepTitles }: ProgressTrackerProps) {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-all duration-300
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                ${isPending ? 'bg-gray-200 text-gray-400' : ''}
              ">
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}
              </div>
              
              <span className={`text-xs sm:text-sm font-medium text-center transition-colors duration-300
                ${isCompleted ? 'text-green-600' : ''}
                ${isCurrent ? 'text-blue-600' : ''}
                ${isPending ? 'text-gray-400' : ''}
              `}>
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
