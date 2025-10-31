
import { AnimationStep } from '../types';

export const getSelectionSortAnimations = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const n = array.length;
  if (n <= 1) {
    animations.push({ array: [...array], comparing: [], swapping: [], sorted: [...Array(n).keys()] });
    return animations;
  }

  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push({
        array: [...array],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sortedIndices],
      });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
        animations.push({
            array: [...array],
            comparing: [],
            swapping: [i, minIdx],
            sorted: [...sortedIndices],
        });

        [array[i], array[minIdx]] = [array[minIdx], array[i]];

        animations.push({
            array: [...array],
            comparing: [],
            swapping: [i, minIdx],
            sorted: [...sortedIndices],
        });
    }
    sortedIndices.push(i);
  }
  
  sortedIndices.push(n - 1);

  animations.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: sortedIndices.sort((a,b) => a-b),
  });

  return animations;
};
    