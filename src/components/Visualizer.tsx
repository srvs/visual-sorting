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

  // Find the maximum absolute value to scale bars correctly.
  // Use Math.max(1, ...) to avoid division by zero if all values are 0.
  const maxAbsValue = array.length > 0 ? Math.max(1, ...array.map(v => Math.abs(v))) : 1;

  const getBarStyle = (value: number) => {
    const heightPercentage = (Math.abs(value) / maxAbsValue) * 50;
    
    // Ensure a minimum visible height for non-zero values
    const finalHeight = value !== 0 ? Math.max(0.5, heightPercentage) : 0;

    if (value >= 0) {
      return {
        height: `${finalHeight}%`,
        bottom: '50%',
        borderRadius: '0.125rem 0.125rem 0 0', // rounded-t-sm
      };
    } else {
      return {
        height: `${finalHeight}%`,
        top: '50%',
        borderRadius: '0 0 0.125rem 0.125rem', // rounded-b-sm
      };
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center gap-px p-4 bg-gray-800 rounded-lg shadow-lg relative">
      {/* Zero Axis Line */}
      <div className="absolute top-1/2 left-4 right-4 h-px bg-gray-600 z-0"></div>

      {array.map((value, index) => (
        // Each of these divs is a flex item, representing a column for a bar.
        <div key={index} className="w-full h-full relative">
          {/* This div is the bar itself, absolutely positioned within its column. It's also the tooltip group. */}
          <div
            title={`Value: ${value}`}
            className={`absolute w-full transition-colors duration-150 group ${getBarColorClass(index)}`}
            style={getBarStyle(value)}
          >
            {/* Custom Tooltip */}
            <div 
              className={`absolute w-max left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 ${ value >= 0 ? 'bottom-full mb-2' : 'top-full mt-2'}`} 
              role="tooltip"
            >
              {value}
              {/* Tooltip Arrow */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${ value >= 0 ? 'top-full border-t-4 border-t-gray-900' : 'bottom-full border-b-4 border-b-gray-900'}`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Visualizer;