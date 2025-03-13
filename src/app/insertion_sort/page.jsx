import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(15);
  const [sorting, setSorting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [currentElement, setCurrentElement] = useState(-1);
  const [comparingElement, setComparingElement] = useState(-1);
  const [sortedElements, setSortedElements] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [shifts, setShifts] = useState(0);

  const timeoutRef = useRef(null);
  const sortingRef = useRef(false);

  // Initialize array with random values
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 5
    );
    setArray(newArray);
    setCompleted(false);
    setComparisons(0);
    setShifts(0);
    setCurrentElement(-1);
    setComparingElement(-1);
    setSortedElements([0]); // The first element is always considered sorted
  };

  // Initialize on component mount
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update the sorting ref when sorting state changes
  useEffect(() => {
    sortingRef.current = sorting;
  }, [sorting]);

  // Insertion sort algorithm
  const insertionSort = async () => {
    if (!sortingRef.current) return;
    
    const newArray = [...array];
    const n = newArray.length;
    let localComparisons = comparisons;
    let localShifts = shifts;
    
    // First element is already sorted
    const newSortedElements = [0];
    setSortedElements(newSortedElements);
    
    for (let i = 1; i < n; i++) {
      if (!sortingRef.current) return;
      
      setCurrentElement(i);
      
      // Wait for visualization
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
      });
      
      const key = newArray[i];
      let j = i - 1;
      
      while (j >= 0) {
        if (!sortingRef.current) return;
        
        setComparingElement(j);
        localComparisons++;
        setComparisons(localComparisons);
        
        // Wait for visualization
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
        });
        
        if (newArray[j] > key) {
          newArray[j + 1] = newArray[j];
          setArray([...newArray]);
          localShifts++;
          setShifts(localShifts);
          
          // Wait for visualization
          await new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
          });
          
          j--;
        } else {
          break;
        }
      }
      
      newArray[j + 1] = key;
      setArray([...newArray]);
      
      // Wait for visualization
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
      });
      
      // Update sorted elements
      newSortedElements.push(i);
      setSortedElements([...newSortedElements]);
      
      // Wait for visualization
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
      });
    }
    
    // Mark as completed
    setCurrentElement(-1);
    setComparingElement(-1);
    setCompleted(true);
    setSorting(false);
  };

  // Start sorting
  const handleStart = () => {
    if (!sorting && !completed) {
      setSorting(true);
      insertionSort();
    }
  };

  // Pause sorting
  const handlePause = () => {
    setSorting(false);
  };

  // Reset array
  const handleReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSorting(false);
    generateRandomArray();
  };

  // Get color for each bar
  const getBarColor = (index) => {
    if (completed) return 'bg-green-500';
    if (index === currentElement) return 'bg-purple-500';
    if (index === comparingElement) return 'bg-yellow-500';
    if (sortedElements.includes(index)) return 'bg-green-500';
    return 'bg-indigo-500';
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Insertion Sort Visualization</h1>
      
      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
        <button
          onClick={handleStart}
          disabled={sorting || completed}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            sorting || completed ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
          } text-white font-medium transition`}
        >
          <FaPlay /> Start
        </button>
        
        <button
          onClick={handlePause}
          disabled={!sorting}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            !sorting ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white font-medium transition`}
        >
          <FaPause /> Pause
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition"
        >
          <FaRedo /> Reset
        </button>
        
        <button
          onClick={generateRandomArray}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md transition"
        >
          <FaRandom /> New Array
        </button>
        
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium flex items-center gap-1">
            <FaChartBar /> Size:
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            disabled={sorting}
            className="w-32"
          />
          <span className="text-gray-700 font-medium">{arraySize}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium flex items-center gap-1">
            <MdSpeed /> Speed:
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
      </div>
      
      {/* Statistics */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white p-3 rounded-md shadow">
          <span className="font-medium">Comparisons: </span>
          <span className="text-blue-600 font-bold">{comparisons}</span>
        </div>
        <div className="bg-white p-3 rounded-md shadow">
          <span className="font-medium">Shifts: </span>
          <span className="text-red-600 font-bold">{shifts}</span>
        </div>
        <div className="bg-white p-3 rounded-md shadow">
          <span className="font-medium">Status: </span>
          <span className={`font-bold ${completed ? 'text-green-600' : sorting ? 'text-yellow-600' : 'text-gray-600'}`}>
            {completed ? 'Sorted!' : sorting ? 'Sorting...' : 'Ready'}
          </span>
        </div>
      </div>
      
      {/* Color legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span className="text-sm">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-sm">Current Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm">Comparing Element</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Sorted</span>
        </div>
      </div>
      
      {/* Array visualization */}
      <div className="w-full flex items-end justify-center gap-1 h-64 bg-white p-4 rounded-lg shadow-inner">
        {array.map((value, index) => (
          <div
            key={index}
            className={`${getBarColor(index)} rounded-t-md transition-all duration-300 flex justify-center items-end`}
            style={{
              height: `${value}%`,
              width: `${100 / arraySize}%`,
              maxWidth: '50px',
              minWidth: '10px',
              transform: (index === currentElement) ? 'translateY(-10px)' : 'translateY(0)',
            }}
          >
            {arraySize <= 20 && (
              <span className="text-white text-xs font-bold mb-1">{value}</span>
            )}
          </div>
        ))}
      </div>
      
      {/* Algorithm explanation */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow w-full">
        <h2 className="text-xl font-bold mb-2 text-gray-800">How Insertion Sort Works</h2>
        <p className="text-gray-700">
          Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It works by 
          taking one element from the unsorted part and inserting it into its correct position in the sorted part of the array.
          It's much like sorting a hand of playing cards - you pick up one card at a time and insert it into its correct position.
        </p>
        <div className="mt-2">
          <p className="text-gray-700">
            <span className="font-semibold">Time Complexity:</span> O(n²) in worst and average cases, O(n) in best case (when array is already sorted)
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Space Complexity:</span> O(1)
          </p>
          <p className="text-gray-700 mt-2">
            <span className="font-semibold">Advantages:</span> Simple implementation, efficient for small data sets, adaptive (performs well on partially sorted arrays), 
            and stable (maintains the relative order of equal elements).
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsertionSortVisualizer;