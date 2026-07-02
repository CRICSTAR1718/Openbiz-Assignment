import { useState } from 'react';
import { useForm, UseFormWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '../lib/schema';
import { step1Schema, step2Schema, FormData } from '../lib/validation';
import FormField from './FormField';
import ProgressTracker from './ProgressTracker';

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = schema.steps.length;

  // Get current step data
  const currentStepData = schema.steps[currentStep - 1];
  const stepTitles = schema.steps.map(step => step.title);

  // Determine which schema to use based on current step
  const currentSchema = currentStep === 1 ? step1Schema : step2Schema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Handle conditional requirements
  const isFieldRequired = (field: any) => {
    if (field.required === true) return true;
    if (field.required === 'conditional' && field.requiredWhen) {
      const { field: dependentField, notEquals } = field.requiredWhen;
      const dependentValue = watchedValues[dependentField];
      return dependentValue !== notEquals;
    }
    return false;
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
    alert('Form submitted successfully!');
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {schema.formTitle}
            </h1>
            <p className="text-gray-600 text-sm">
              Please complete all required fields
            </p>
          </div>

          {/* Progress Tracker */}
          <ProgressTracker 
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitles={stepTitles}
          />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step Title */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Step {currentStep}: {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-500">
                {currentStepData.scrapedVia}
              </p>
            </div>

            {/* Dynamic Fields */}
            <div className="space-y-4">
              {currentStepData.fields.map((field) => {
                // Skip conditional fields that are not currently required
                if (field.required === 'conditional' && !isFieldRequired(field)) {
                  return null;
                }

                return (
                  <FormField
                    key={field.id}
                    field={field}
                    register={register}
                    errors={errors}
                    watch={watch}
                  />
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between items-center">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Previous
                </button>
              )}

              <div className={`${isFirstStep ? 'ml-auto' : ''}`}>
                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    {currentStepData.submitButton?.label || 'Next'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>

            {/* Step Notes */}
            {currentStepData.notes && currentStepData.notes.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                  Notes:
                </h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {currentStepData.notes.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Source:{' '}
            <a 
              href={schema.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {schema.sourceUrl}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
