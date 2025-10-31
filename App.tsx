import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Visualizer from './components/Visualizer';
import { useSortingAnimator } from './hooks/useSortingAnimator';
import { Algorithm, ArrayGenerationType } from './types';
import { DEFAULT_ARRAY_SIZE, MIN_VALUE, MAX_VALUE, ALGORITHMS, MIN_SPEED, MAX_SPEED, MIN_ARRAY_SIZE, MAX_ARRAY_SIZE, ARRAY_GENERATION_TYPES } from './constants';

const generateRandomArray = (size: number): number[] => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
  );
};

const generateNearlySortedArray = (size: number): number[] => {
  const arr = Array.from({ length: size }, (_, i) => 
    Math.floor((i / Math.max(1, size - 1)) * (MAX_VALUE - MIN_VALUE)) + MIN_VALUE
  );
  // Perform a few swaps
  const swaps = Math.floor(size / 10);
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  return arr;
};

const generateReversedArray = (size: number): number[] => {
  return Array.from({ length: size }, (_, i) => 
    Math.floor(((size - 1 - i) / Math.max(1, size - 1)) * (MAX_VALUE - MIN_VALUE)) + MIN_VALUE
  );
};

const generateWithDuplicatesArray = (size: number): number[] => {
  const valuePoolSize = Math.max(5, Math.floor(size / 4));
  const valuePool = Array.from({ length: valuePoolSize }, () => 
    Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
  );
  return Array.from({ length: size }, () => valuePool[Math.floor(Math.random() * valuePoolSize)]);
};

const ARRAY_GENERATORS: Record<Exclude<ArrayGenerationType, ArrayGenerationType.Custom>, (size: number) => number[]> = {
    [ArrayGenerationType.Random]: generateRandomArray,
    [ArrayGenerationType.NearlySorted]: generateNearlySortedArray,
    [ArrayGenerationType.Reversed]: generateReversedArray,
    [ArrayGenerationType.WithDuplicates]: generateWithDuplicatesArray,
}

function App() {
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [arrayGenerationType, setArrayGenerationType] = useState<ArrayGenerationType>(ARRAY_GENERATION_TYPES[0]);
  const [customArrayInput, setCustomArrayInput] = useState('8, 3, 10, 1, 6, 14, 4, 7, 13, 20, 18, 15');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [initialArray, setInitialArray] = useState(() => ARRAY_GENERATORS[arrayGenerationType as Exclude<ArrayGenerationType, ArrayGenerationType.Custom>](arraySize));
  
  const {
    displayedState,
    isSorting,
    isPaused,
    speed,
    setSpeed,
    resetArray,
    startSorting,
    pauseSorting,
    resumeSorting,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
  } = useSortingAnimator(initialArray);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(ALGORITHMS[0]);
  
  const handleCustomArrayChange = useCallback((value: string) => {
    setCustomArrayInput(value);
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
        setValidationError('Input cannot be empty.');
        return;
    }

    const parts = trimmedValue.split(',');
    const newArray: number[] = [];
    
    for (const part of parts) {
        const trimmedPart = part.trim();
        if (trimmedPart === '') {
            setValidationError('Invalid format. Found an empty value between commas.');
            return;
        }
        const num = Number(trimmedPart);
        if (isNaN(num) || !Number.isInteger(num)) {
            setValidationError(`Invalid number: "${trimmedPart}". Please use integers.`);
            return;
        }
        if (num < MIN_VALUE || num > MAX_VALUE) {
            setValidationError(`Value ${num} is out of range (${MIN_VALUE}-${MAX_VALUE}).`);
            return;
        }
        newArray.push(num);
    }
    
    if (newArray.length < MIN_ARRAY_SIZE || newArray.length > MAX_ARRAY_SIZE) {
         setValidationError(`Array size must be between ${MIN_ARRAY_SIZE} and ${MAX_ARRAY_SIZE}. Current size: ${newArray.length}.`);
         return;
    }

    setValidationError(null);
    setInitialArray(newArray);
    setArraySize(newArray.length);
  }, []);

  const generateAndResetArray = useCallback((size: number, type: Exclude<ArrayGenerationType, ArrayGenerationType.Custom>) => {
    const newArray = ARRAY_GENERATORS[type](size);
    setInitialArray(newArray);
  }, []);
  
  useEffect(() => {
    if (arrayGenerationType === ArrayGenerationType.Custom) {
      handleCustomArrayChange(customArrayInput);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleGenerateNewArray = useCallback(() => {
    if (arrayGenerationType === ArrayGenerationType.Custom) {
      handleCustomArrayChange(customArrayInput);
    } else {
      generateAndResetArray(arraySize, arrayGenerationType);
    }
  }, [arraySize, arrayGenerationType, generateAndResetArray, customArrayInput, handleCustomArrayChange]);

  const handleArraySizeChange = useCallback((size: number) => {
    setArraySize(size);
    if (arrayGenerationType !== ArrayGenerationType.Custom) {
       generateAndResetArray(size, arrayGenerationType);
    }
  }, [arrayGenerationType, generateAndResetArray]);
  
  const handleArrayGenerationTypeChange = useCallback((type: ArrayGenerationType) => {
    setArrayGenerationType(type);
    if (type === ArrayGenerationType.Custom) {
      handleCustomArrayChange(customArrayInput);
    } else {
      generateAndResetArray(arraySize, type);
    }
  }, [arraySize, generateAndResetArray, customArrayInput, handleCustomArrayChange]);


  const handleStartSort = () => {
    startSorting(selectedAlgorithm);
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      resumeSorting();
    } else {
      pauseSorting();
    }
  };

  const handleCancelReset = useCallback(() => {
    resetArray(initialArray);
  }, [initialArray, resetArray]);
  
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col font-sans antialiased">
      <main className="container mx-auto p-2 sm:p-4 flex flex-col flex-grow h-screen">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-400 mb-4">Sorting Algorithm Visualizer</h1>
        <Header
          algorithms={ALGORITHMS}
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
          arrayGenerationTypes={ARRAY_GENERATION_TYPES}
          selectedArrayGenerationType={arrayGenerationType}
          onArrayGenerationTypeChange={handleArrayGenerationTypeChange}
          speed={speed}
          onSpeedChange={setSpeed}
          minSpeed={MIN_SPEED}
          maxSpeed={MAX_SPEED}
          arraySize={arraySize}
          onArraySizeChange={handleArraySizeChange}
          minArraySize={MIN_ARRAY_SIZE}
          maxArraySize={MAX_ARRAY_SIZE}
          onGenerateNewArray={handleGenerateNewArray}
          onStart={handleStartSort}
          onPauseToggle={handlePauseToggle}
          onCancelReset={handleCancelReset}
          onPreviousStep={goToPreviousStep}
          onNextStep={goToNextStep}
          currentStep={currentStep}
          totalSteps={totalSteps}
          isSorting={isSorting}
          isPaused={isPaused}
          customArrayInput={customArrayInput}
          onCustomArrayChange={handleCustomArrayChange}
          validationError={validationError}
        />
        <div className="flex-grow flex items-center justify-center min-h-0 py-4">
            <Visualizer 
                array={displayedState.array}
                comparing={displayedState.comparing}
                swapping={displayedState.swapping}
                sorted={displayedState.sorted}
            />
        </div>
      </main>
    </div>
  );
}

export default App;
