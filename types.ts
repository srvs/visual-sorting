export enum Algorithm {
  BubbleSort = 'Bubble Sort',
  SelectionSort = 'Selection Sort',
  MergeSort = 'Merge Sort',
  QuickSort = 'Quick Sort',
  HeapSort = 'Heap Sort',
}

export enum ArrayGenerationType {
  Random = 'Random',
  NearlySorted = 'Nearly Sorted',
  Reversed = 'Reversed',
  WithDuplicates = 'With Duplicates',
  Custom = 'Custom',
}

export type AnimationStep = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
};
