import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimationStep, Algorithm } from '../types';
import { getBubbleSortAnimations } from '../algorithms/bubbleSort';
import { getSelectionSortAnimations } from '../algorithms/selectionSort';
import { getMergeSortAnimations } from '../algorithms/mergeSort';
import { getQuickSortAnimations } from '../algorithms/quickSort';
import { getHeapSortAnimations } from '../algorithms/heapSort';
import { DEFAULT_SPEED } from '../constants';

const ALGORITHM_MAP: Record<Algorithm, (arr: number[]) => AnimationStep[]> = {
  [Algorithm.BubbleSort]: getBubbleSortAnimations,
  [Algorithm.SelectionSort]: getSelectionSortAnimations,
  [Algorithm.MergeSort]: getMergeSortAnimations,
  [Algorithm.QuickSort]: getQuickSortAnimations,
  [Algorithm.HeapSort]: getHeapSortAnimations,
};

export const useSortingAnimator = (initialArray: number[]) => {
  const [array, setArray] = useState(initialArray);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [currentStep, setCurrentStep] = useState(0);

  const animationSteps = useRef<AnimationStep[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const displayedState = animationSteps.current[currentStep] || {
    array: array,
    comparing: [],
    swapping: [],
    sorted: [],
  };
  
  const totalSteps = animationSteps.current.length;

  const stopAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSorting(false);
    setIsPaused(false);
    setCurrentStep(0);
    animationSteps.current = [];
  }, []);

  const resetArray = useCallback((newArray: number[]) => {
    stopAnimation();
    setArray(newArray);
  }, [stopAnimation]);
  
  // This useEffect handles the actual animation loop
  useEffect(() => {
    // Conditions to stop the loop
    if (!isSorting || isPaused || currentStep >= animationSteps.current.length) {
      if (isSorting && !isPaused && currentStep >= animationSteps.current.length) {
        setIsSorting(false); // Animation finished
      }
      return;
    }

    const delay = 1000 / speed;

    timeoutRef.current = window.setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSorting, isPaused, currentStep, speed]);
  
  useEffect(() => {
    resetArray(initialArray);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialArray]);

  const startSorting = useCallback((algorithm: Algorithm) => {
    if (isSorting) return;
    
    stopAnimation();
    
    const getAnimations = ALGORITHM_MAP[algorithm];
    if (getAnimations) {
      animationSteps.current = getAnimations([...array]);
      if (animationSteps.current.length > 0) {
        setIsSorting(true);
        setIsPaused(false);
        setCurrentStep(0);
      }
    }
  }, [isSorting, array, stopAnimation]);

  const pauseSorting = useCallback(() => {
    if (isSorting && !isPaused) {
      setIsPaused(true);
    }
  }, [isSorting, isPaused]);

  const resumeSorting = useCallback(() => {
    if (isSorting && isPaused) {
      setIsPaused(false);
    }
  }, [isSorting, isPaused]);
  
  const goToNextStep = useCallback(() => {
    if (isSorting && isPaused && currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [isSorting, isPaused, currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (isSorting && isPaused && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isSorting, isPaused, currentStep]);

  return {
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
    goToPreviousStep
  };
};