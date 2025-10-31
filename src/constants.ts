import { Algorithm, ArrayGenerationType } from './types';

export const ALGORITHMS: Algorithm[] = [
  Algorithm.BubbleSort,
  Algorithm.SelectionSort,
  Algorithm.MergeSort,
  Algorithm.QuickSort,
  Algorithm.HeapSort,
];

export const ARRAY_GENERATION_TYPES: ArrayGenerationType[] = [
  ArrayGenerationType.Random,
  ArrayGenerationType.NearlySorted,
  ArrayGenerationType.Reversed,
  ArrayGenerationType.WithDuplicates,
  ArrayGenerationType.Custom,
];

export const DEFAULT_ARRAY_SIZE = 50;
export const MIN_ARRAY_SIZE = 5;
export const MAX_ARRAY_SIZE = 150;

export const DEFAULT_SPEED = 50; // actions per second
export const MIN_SPEED = 1;
export const MAX_SPEED = 200;

export const MIN_VALUE = -65536;
export const MAX_VALUE = 65535;