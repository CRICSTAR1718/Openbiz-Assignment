import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from '../lib/schema';
import { step1Schema, step2Schema, type FormData } from '../lib/validation';
import FormField from './FormField';
import ProgressTracker from './ProgressTracker';

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
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

  const handleValidateAndGenerateOtp = async () => {
    const isValid = await trigger();
    if (isValid) {
      setShowOtpInput(true);
      setOtpError('');
    }
  };

  const handleOtpSubmit = () => {
    if (otpValue === '123456') {
      setShowOtpInput(false);
      setOtpValue('');
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setOtpError('Invalid OTP. Please enter 123456.');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-8 px-4 text-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100 mb-6 rounded-xl overflow-hidden">
          <div className="px-6 py-5 text-center">
            <h1 className="text-3xl font-bold text-black">
              {schema.formTitle}
            </h1>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 mb-6 border border-blue-100">
          <ProgressTracker 
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitles={stepTitles}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - Left 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100">
              {/* Step Title and badge */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-800">Step {currentStep} of {totalSteps}</div>
                  <h2 className="text-xl font-bold text-black mt-1">
                    {currentStepData.title}
                  </h2>
                </div>
              </div>
              <div className="mb-6 pb-4 border-b border-blue-100" />

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Dynamic Fields */}
                <div className="space-y-6">
                  {currentStepData.fields.map((field, index) => {
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
                        fieldNumber={index + 1}
                      />
                    );
                  })}
                </div>

                {/* OTP Input Field - shown after validation */}
                {showOtpInput && currentStep === 1 && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl">
                    <label htmlFor="otp" className="block text-sm font-semibold text-slate-900 mb-2">
                      Enter OTP (use 123456)
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900 placeholder-slate-500 bg-white"
                    />
                    {otpError && (
                      <p className="mt-2 text-sm text-red-600" role="alert">
                        {otpError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleOtpSubmit}
                      className="mt-3 px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-150 font-medium"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-end items-center gap-3 pt-6 border-t border-blue-100">
                  {!isFirstStep && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-4 py-2 bg-white text-slate-900 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition-colors duration-150"
                    >
                      Previous
                    </button>
                  )}

                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={currentStep === 1 ? handleValidateAndGenerateOtp : handleNext}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-150 font-medium"
                    >
                      {currentStep === 1 && !showOtpInput ? currentStepData.submitButton?.label || 'Continue' : currentStepData.submitButton?.label || 'Continue'}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-md hover:from-teal-600 hover:to-teal-700 transition-all duration-150 font-medium"
                    >
                      Submit Application
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Info Sidebar - Right 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-200 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-black mb-4">
                Aadhaar Number Requirements for Udyam Registration
              </h3>
              <ul className="space-y-3 text-sm text-blue-900">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>The Aadhaar number should be of the entrepreneur who is applying for Udyam Registration.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>The entrepreneur should have the Aadhaar number linked with his/her mobile number.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>OTP will be sent on the mobile number linked with Aadhaar for verification.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>For entities other than Individual (Proprietorship), the Aadhaar number of the authorized signatory should be provided.</span>
                </li>
              </ul>
            </div>

            {/* Step Notes */}
            {currentStepData.notes && currentStepData.notes.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-md p-6">
                <h3 className="text-sm font-bold text-black mb-3">
                  Important Notes
                </h3>
                <ul className="space-y-2 text-sm text-yellow-900">
                  {currentStepData.notes.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-600 font-medium">
                © 2024 Udyam Registration Portal. All rights reserved.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Government of India • Ministry of MSME
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
