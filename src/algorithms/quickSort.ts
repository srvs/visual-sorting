
import { AnimationStep } from '../types';

export const getQuickSortAnimations = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  if (array.length <= 1) {
    animations.push({ array: [...array], comparing: [], swapping: [], sorted: [...Array(array.length).keys()] });
    return animations;
  }
  quickSortHelper(array, 0, array.length - 1, animations);

  animations.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...Array(array.length).keys()],
  });

  return animations;
};

function quickSortHelper(
  array: number[],
  low: number,
  high: number,
  animations: AnimationStep[],
) {
  if (low < high) {
    const pi = partition(array, low, high, animations);
    quickSortHelper(array, low, pi - 1, animations);
    quickSortHelper(array, pi + 1, high, animations);
  }
}

function partition(
  array: number[],
  low: number,
  high: number,
  animations: AnimationStep[],
): number {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    animations.push({
      array: [...array],
      comparing: [j, high], // Compare with pivot
      swapping: [],
      sorted: [],
    });
    if (array[j] < pivot) {
      i++;
      animations.push({
        array: [...array],
        comparing: [],
        swapping: [i, j],
        sorted: [],
      });
      [array[i], array[j]] = [array[j], array[i]];
      animations.push({
        array: [...array],
        comparing: [],
        swapping: [i, j],
        sorted: [],
      });
    }
  }

  animations.push({
    array: [...array],
    comparing: [],
    swapping: [i + 1, high],
    sorted: [],
  });
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  animations.push({
    array: [...array],
    comparing: [],
    swapping: [i + 1, high],
    sorted: [],
  });
  
  return i + 1;
}
    