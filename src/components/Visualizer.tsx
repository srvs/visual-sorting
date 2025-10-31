import React from 'react';

type VisualizerProps = {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
};

const Visualizer: React.FC<VisualizerProps> = ({ array, comparing, swapping, sorted }) => {
  const getBarColorClass = (index: number): string => {
    if (sorted.includes(index)) {
      return 'bg-teal-500';
    }
    if (swapping.includes(index)) {
      return 'bg-pink-500';
    }
    if (comparing.includes(index)) {
      return 'bg-yellow-400';
    }
    return 'bg-indigo-500';
  };

  const minValue = array.length > 0 ? Math.min(...array) : 0;
  const maxValue = array.length > 0 ? Math.max(...array) : 0;
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    if (range === 0) {
      return 50;
    }
    const normalizedValue = value - minValue;
    // Ensure even the smallest value is visible
    const height = Math.max(0.5, (normalizedValue / range) * 100);
    return height;
  };

  return (
    <div className="w-full h-full flex items-end justify-center gap-px p-4 bg-gray-800 rounded-lg shadow-inner border-b-2 border-gray-600">
      {array.map((value, index) => (
        <div key={index} className="relative group w-full h-full flex items-end">
          {/* Custom Tooltip */}
          <div 
            className="absolute bottom-full mb-2 w-max left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" 
            role="tooltip"
          >
            {value}
            {/* Tooltip Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
          </div>
          
          {/* The Bar */}
          <div
            title={`Value: ${value}`} // Fallback native tooltip
            className={`w-full rounded-t-sm transition-colors duration-150 ${getBarColorClass(index)}`}
            style={{ 
              height: `${getBarHeight(value)}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Visualizer;