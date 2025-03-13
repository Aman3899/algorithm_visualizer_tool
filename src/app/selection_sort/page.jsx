import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';

const SelectionSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [sorting, setSorting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [currentIndices, setCurrentIndices] = useState([-1, -1]);
    const [minIndex, setMinIndex] = useState(-1);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [sorted, setSorted] = useState([]);

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
        setSwaps(0);
        setCurrentIndices([-1, -1]);
        setMinIndex(-1);
        setCurrentIndex(-1);
        setSorted([]);
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

    // Selection sort algorithm
    const selectionSort = async () => {
        if (!sortingRef.current) return;

        const newArray = [...array];
        const n = newArray.length;
        const newSorted = [];
        let localComparisons = comparisons;
        let localSwaps = swaps;

        for (let i = 0; i < n; i++) {
            if (!sortingRef.current) return;

            setCurrentIndex(i);
            let minIdx = i;
            setMinIndex(minIdx);

            // Wait for visualization
            await new Promise(resolve => {
                timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
            });

            for (let j = i + 1; j < n; j++) {
                if (!sortingRef.current) return;

                setCurrentIndices([minIdx, j]);
                localComparisons++;
                setComparisons(localComparisons);

                // Wait for visualization
                await new Promise(resolve => {
                    timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
                });

                if (newArray[j] < newArray[minIdx]) {
                    minIdx = j;
                    setMinIndex(minIdx);

                    // Wait for visualization
                    await new Promise(resolve => {
                        timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
                    });
                }
            }

            // If min index is not the starting index, swap
            if (minIdx !== i) {
                [newArray[i], newArray[minIdx]] = [newArray[minIdx], newArray[i]];
                localSwaps++;
                setSwaps(localSwaps);
                setArray([...newArray]);

                // Wait for visualization
                await new Promise(resolve => {
                    timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
                });
            }

            // Mark current index as sorted
            newSorted.push(i);
            setSorted([...newSorted]);

            // Wait for visualization
            await new Promise(resolve => {
                timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
            });
        }

        // Mark the last element as sorted
        newSorted.push(n - 1);
        setSorted([...newSorted]);

        // Mark as completed
        setCurrentIndices([-1, -1]);
        setMinIndex(-1);
        setCurrentIndex(-1);
        setCompleted(true);
        setSorting(false);
    };

    // Start sorting
    const handleStart = () => {
        if (!sorting && !completed) {
            setSorting(true);
            selectionSort();
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
        if (sorted.includes(index)) return 'bg-green-500';
        if (index === minIndex) return 'bg-yellow-500';
        if (index === currentIndex) return 'bg-purple-500';
        if (currentIndices.includes(index)) return 'bg-blue-500';
        return 'bg-indigo-500';
    };

    return (
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Selection Sort Visualization</h1>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 w-full">
                <button
                    onClick={handleStart}
                    disabled={sorting || completed}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${sorting || completed ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                        } text-white font-medium transition`}
                >
                    <FaPlay /> Start
                </button>

                <button
                    onClick={handlePause}
                    disabled={!sorting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${!sorting ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
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
                    <span className="font-medium">Swaps: </span>
                    <span className="text-red-600 font-bold">{swaps}</span>
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
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm">Current Minimum</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-sm">Current Position</span>
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
                            transform: (index === minIndex || index === currentIndex) ? 'translateY(-10px)' : 'translateY(0)',
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
                <h2 className="text-xl font-bold mb-2 text-gray-800">How Selection Sort Works</h2>
                <p className="text-gray-700">
                    Selection Sort is a simple sorting algorithm that works by repeatedly finding the minimum element from the unsorted
                    part of the array and putting it at the beginning. The algorithm maintains two subarrays: the subarray which is
                    already sorted and the remaining subarray which is unsorted.
                </p>
                <div className="mt-2">
                    <p className="text-gray-700">
                        <span className="font-semibold">Time Complexity:</span> O(n²) in all cases
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Space Complexity:</span> O(1)
                    </p>
                    <p className="text-gray-700 mt-2">
                        <span className="font-semibold">Advantage:</span> Selection sort makes only O(n) swaps, which can be advantageous
                        when memory write is a costly operation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SelectionSortVisualizer;