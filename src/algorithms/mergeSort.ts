
import { AnimationStep } from '../types';

export const getMergeSortAnimations = (array: number[]): AnimationStep[] => {
  const animations: AnimationStep[] = [];
  if (array.length <= 1) {
    animations.push({ array: [...array], comparing: [], swapping: [], sorted: [...Array(array.length).keys()] });
    return animations;
  }
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  
  animations.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...Array(array.length).keys()],
  });

  return animations;
};

function mergeSortHelper(
  mainArray: number[],
  startIdx: number,
  endIdx: number,
  auxiliaryArray: number[],
  animations: AnimationStep[],
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
  mainArray: number[],
  startIdx: number,
  middleIdx: number,
  endIdx: number,
  auxiliaryArray: number[],
  animations: AnimationStep[],
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push({
      array: [...mainArray],
      comparing: [i, j],
      swapping: [],
      sorted: [],
    });
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push({
        array: [...mainArray],
        comparing: [],
        swapping: [k, i], // Visualizing overwrite as a swap/move
        sorted: [],
      });
      mainArray[k++] = auxiliaryArray[i++];
      animations.push({
        array: [...mainArray],
        comparing: [],
        swapping: [],
        sorted: [],
      });
    } else {
      animations.push({
        array: [...mainArray],
        comparing: [],
        swapping: [k, j],
        sorted: [],
      });
      mainArray[k++] = auxiliaryArray[j++];
      animations.push({
        array: [...mainArray],
        comparing: [],
        swapping: [],
        sorted: [],
      });
    }
  }
  while (i <= middleIdx) {
    animations.push({
      array: [...mainArray],
      comparing: [i, i],
      swapping: [],
      sorted: [],
    });
    animations.push({
      array: [...mainArray],
      comparing: [],
      swapping: [k, i],
      sorted: [],
    });
    mainArray[k++] = auxiliaryArray[i++];
    animations.push({
      array: [...mainArray],
      comparing: [],
      swapping: [],
      sorted: [],
    });
  }
  while (j <= endIdx) {
    animations.push({
      array: [...mainArray],
      comparing: [j, j],
      swapping: [],
      sorted: [],
    });
    animations.push({
      array: [...mainArray],
      comparing: [],
      swapping: [k, j],
      sorted: [],
    });
    mainArray[k++] = auxiliaryArray[j++];
    animations.push({
      array: [...mainArray],
      comparing: [],
      swapping: [],
      sorted: [],
    });
  }
}
    