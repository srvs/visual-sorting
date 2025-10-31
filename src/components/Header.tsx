import React from 'react';
import { Algorithm, ArrayGenerationType } from '../types';

type HeaderProps = {
  algorithms: Algorithm[];
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algo: Algorithm) => void;
  
  arrayGenerationTypes: ArrayGenerationType[];
  selectedArrayGenerationType: ArrayGenerationType;
  onArrayGenerationTypeChange: (type: ArrayGenerationType) => void;
  
  speed: number;
  onSpeedChange: (speed: number) => void;
  minSpeed: number;
  maxSpeed: number;

  arraySize: number;
  onArraySizeChange: (size: number) => void;
  minArraySize: number;
  maxArraySize: number;

  onGenerateNewArray: () => void;
  onStart: () => void;
  onPauseToggle: () => void;
  onCancelReset: () => void;

  onPreviousStep: () => void;
  onNextStep: () => void;
  currentStep: number;
  totalSteps: number;

  isSorting: boolean;
  isPaused: boolean;

  customArrayInput: string;
  onCustomArrayChange: (value: string) => void;
  validationError: string | null;
};

const ControlButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button
      {...props}
      className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed ${props.className}`}
    />
  );
};

const Header: React.FC<HeaderProps> = ({
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  arrayGenerationTypes,
  selectedArrayGenerationType,
  onArrayGenerationTypeChange,
  speed,
  onSpeedChange,
  minSpeed,
  maxSpeed,
  arraySize,
  onArraySizeChange,
  minArraySize,
  maxArraySize,
  onGenerateNewArray,
  onStart,
  onPauseToggle,
  onCancelReset,
  onPreviousStep,
  onNextStep,
  currentStep,
  totalSteps,
  isSorting,
  isPaused,
  customArrayInput,
  onCustomArrayChange,
  validationError,
}) => {
  return (
    <div className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        {/* Algorithm Selection */}
        <div className="flex flex-col">
          <label htmlFor="algorithm-select" className="text-sm font-medium text-gray-400 mb-1">Algorithm</label>
          <select
            id="algorithm-select"
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
            disabled={isSorting}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 disabled:opacity-50"
          >
            {algorithms.map((algo) => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>

        {/* Array Type Selection */}
        <div className="flex flex-col">
          <label htmlFor="array-type-select" className="text-sm font-medium text-gray-400 mb-1">Array Type</label>
          <select
            id="array-type-select"
            value={selectedArrayGenerationType}
            onChange={(e) => onArrayGenerationTypeChange(e.target.value as ArrayGenerationType)}
            disabled={isSorting}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 disabled:opacity-50"
          >
            {arrayGenerationTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Array Size Slider */}
        <div className="flex flex-col">
          <label htmlFor="array-size-slider" className="text-sm font-medium text-gray-400 mb-1">Array Size: {arraySize}</label>
          <input
            id="array-size-slider"
            type="range"
            min={minArraySize}
            max={maxArraySize}
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            disabled={isSorting || selectedArrayGenerationType === ArrayGenerationType.Custom}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Speed Slider */}
        <div className="flex flex-col">
          <label htmlFor="speed-slider" className="text-sm font-medium text-gray-400 mb-1">Speed: {speed} aps</label>
          <input
            id="speed-slider"
            type="range"
            min={minSpeed}
            max={maxSpeed}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      {selectedArrayGenerationType === ArrayGenerationType.Custom && (
        <div className="flex flex-col mt-2">
            <label htmlFor="custom-array-input" className="text-sm font-medium text-gray-400 mb-1">
                Custom Array (comma-separated integers from -65536 to 65535)
            </label>
            <textarea
                id="custom-array-input"
                value={customArrayInput}
                onChange={(e) => onCustomArrayChange(e.target.value)}
                disabled={isSorting}
                className="bg-gray-700 border border-gray-600 text-white font-mono text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 disabled:opacity-50"
                rows={2}
                aria-invalid={!!validationError}
                aria-describedby="custom-array-error"
            />
            {validationError && (
                <p id="custom-array-error" className="text-red-400 text-sm mt-1">{validationError}</p>
            )}
        </div>
      )}


      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
          <ControlButton
            onClick={onGenerateNewArray}
            disabled={isSorting || (selectedArrayGenerationType === ArrayGenerationType.Custom && !!validationError)}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            New Array
          </ControlButton>
          
          <ControlButton
            onClick={onStart}
            disabled={isSorting || (selectedArrayGenerationType === ArrayGenerationType.Custom && !!validationError)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Sort
          </ControlButton>

          <ControlButton
            onClick={onPauseToggle}
            disabled={!isSorting}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </ControlButton>
          
          <ControlButton
            onClick={onCancelReset}
            disabled={!isSorting && currentStep === 0}
            className={isSorting ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}
            aria-label={isSorting ? 'Cancel Sort' : 'Reset Array'}
          >
            {isSorting ? 'Cancel' : 'Reset'}
          </ControlButton>

          <ControlButton
            onClick={onPreviousStep}
            disabled={!isSorting || !isPaused || currentStep === 0}
            className="bg-gray-700 hover:bg-gray-600 text-white"
            aria-label="Previous Step"
          >
            Prev Step
          </ControlButton>

          <ControlButton
            onClick={onNextStep}
            disabled={!isSorting || !isPaused || totalSteps === 0 || currentStep >= totalSteps - 1}
            className="bg-gray-700 hover:bg-gray-600 text-white"
            aria-label="Next Step"
          >
            Next Step
          </ControlButton>
      </div>
    </div>
  );
};

export default Header;