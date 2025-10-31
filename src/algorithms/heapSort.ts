import { AnimationStep } from '../types';

export const getHeapSortAnimations = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  const n = array.length;
  if (n <= 1) {
    animations.push({ array: [...array], comparing: [], swapping: [], sorted: [...Array(n).keys()] });
    return animations;
  }
  const sortedIndices: number[] = [];

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations, sortedIndices);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    animations.push({ array: [...array], comparing: [], swapping: [0, i], sorted: [...sortedIndices] });
    [array[0], array[i]] = [array[i], array[0]];
    animations.push({ array: [...array], comparing: [], swapping: [0, i], sorted: [...sortedIndices] });
    
    sortedIndices.push(i);

    // call max heapify on the reduced heap
    heapify(array, i, 0, animations, sortedIndices);
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

// To heapify a subtree rooted with node i which is an index in array[]
function heapify(
  array: number[],
  n: number,
  i: number,
  animations: AnimationStep[],
  sortedIndices: number[],
) {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // If left child is larger than root
  if (left < n) {
    animations.push({ array: [...array], comparing: [left, largest], swapping: [], sorted: [...sortedIndices] });
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  // If right child is larger than largest so far
  if (right < n) {
    animations.push({ array: [...array], comparing: [right, largest], swapping: [], sorted: [...sortedIndices] });
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  // If largest is not root
  if (largest !== i) {
    animations.push({ array: [...array], comparing: [], swapping: [i, largest], sorted: [...sortedIndices] });
    [array[i], array[largest]] = [array[largest], array[i]];
    animations.push({ array: [...array], comparing: [], swapping: [i, largest], sorted: [...sortedIndices] });

    // Recursively heapify the affected sub-tree
    heapify(array, n, largest, animations, sortedIndices);
  }
}