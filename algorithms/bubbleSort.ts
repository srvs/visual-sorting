
import { AnimationStep } from '../types';

export const getBubbleSortAnimations = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const n = array.length;
  if (n <= 1) {
    animations.push({ array: [...array], comparing: [], swapping: [], sorted: [...Array(n).keys()] });
    return animations;
  }
  
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sortedIndices],
      });

      if (array[j] > array[j + 1]) {
        animations.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
        });

        [array[j], array[j + 1]] = [array[j + 1], array[j]];

        animations.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
        });
      }
    }
    sortedIndices.push(n - 1 - i);
  }
  sortedIndices.push(0);

  animations.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: sortedIndices.sort((a,b) => a-b),
  });

  return animations;
};
    