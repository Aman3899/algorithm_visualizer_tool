"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

const BucketSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [sorting, setSorting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [buckets, setBuckets] = useState([]);
    const [currentIndices, setCurrentIndices] = useState([-1, -1]);
    const [bucketIndex, setBucketIndex] = useState(-1);
    const [elementInBucketIndex, setElementInBucketIndex] = useState(-1);
    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const sortingRef = useRef(false);
    const modalRef = useRef(null);

    // Generate random array
    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () => Math.random());
        setArray(newArray);
        resetState();
    };

    // Handle custom array input
    const handleCustomArray = () => {
        setInputError('');
        try {
            const inputValues = customInput.split(/[,;\s]+/).filter(item => item.trim() !== '');
            const parsedArray = inputValues.map(item => {
                const num = Number(item.trim());
                if (isNaN(num) || num < 0 || num > 1) {
                    throw new Error(`"${item}" must be between 0 and 1`);
                }
                return num;
            });

            if (parsedArray.length === 0) {
                setInputError('Please enter at least one number');
                return;
            }
            if (parsedArray.length > 50) {
                setInputError('Maximum 50 elements allowed');
                return;
            }

            setArray(parsedArray);
            setArraySize(parsedArray.length);
            resetState();
            setShowInputModal(false);
            setCustomInput('');
        } catch (error) {
            setInputError(error.message || 'Invalid input. Use numbers between 0 and 1.');
        }
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setComparisons(0);
        setSwaps(0);
        setCurrentIndices([-1, -1]);
        setBuckets([]);
        setBucketIndex(-1);
        setElementInBucketIndex(-1);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', e => {
                if (modalRef.current && !modalRef.current.contains(e.target)) {
                    setShowInputModal(false);
                }
            });
        }
        return () => document.removeEventListener('mousedown', () => { });
    }, [showInputModal]);

    useEffect(() => {
        sortingRef.current = sorting;
    }, [sorting]);

    // Bucket Sort implementation
    const bucketSort = async () => {
        let tempArray = [...array];
        let localSwaps = 0;
        let localComparisons = 0;

        setSorting(true);
        sortingRef.current = true;

        const numBuckets = Math.min(arraySize, 10); // Limit buckets for visibility
        const newBuckets = Array(numBuckets).fill().map(() => []);

        // 1. Distribute elements into buckets
        for (let i = 0; i < tempArray.length && sortingRef.current; i++) {
            const value = tempArray[i];
            const bIdx = Math.floor(value * numBuckets); // Ensure bucket index is within bounds
            newBuckets[bIdx].push(value);

            setBuckets([...newBuckets]); // Update buckets state
            setBucketIndex(bIdx); // Highlight current bucket
            setCurrentIndices([i]); // Highlight element being placed
            await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));
        }
        setCurrentIndices([-1, -1]);
        setBucketIndex(-1);

        // 2. Sort individual buckets using Insertion Sort
        for (let i = 0; i < numBuckets && sortingRef.current; i++) {
            setBucketIndex(i);
            const bucket = newBuckets[i];
            for (let j = 1; j < bucket.length && sortingRef.current; j++) {
                const key = bucket[j];
                let k = j - 1;
                setElementInBucketIndex(j);

                while (k >= 0 && bucket[k] > key && sortingRef.current) {
                    setComparisons(++localComparisons);
                    setCurrentIndices([k, k + 1]);
                    await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));

                    bucket[k + 1] = bucket[k];
                    k--;
                    newBuckets[i] = [...bucket];
                    setBuckets([...newBuckets]);
                    setSwaps(++localSwaps);
                    await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));
                }
                bucket[k + 1] = key;
                newBuckets[i] = [...bucket];
                setBuckets([...newBuckets]);
            }
            setElementInBucketIndex(-1);
        }

        // 3. Concatenate buckets back to array
        let index = 0;
        for (let i = 0; i < numBuckets && sortingRef.current; i++) {
            setBucketIndex(i);
            for (let j = 0; j < newBuckets[i].length && sortingRef.current; j++) {
                tempArray[index] = newBuckets[i][j];
                setArray([...tempArray]);
                setCurrentIndices([index]);
                setElementInBucketIndex(j);
                await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));
                setSwaps(++localSwaps);
                index++;
            }
        }

        if (sortingRef.current) {
            setCurrentIndices([-1, -1]);
            setBucketIndex(-1);
            setElementInBucketIndex(-1);
            setCompleted(true);
            setSorting(false);
            sortingRef.current = false;
        }
    };

    const handleStart = () => {
        if (!sorting && !completed) {
            setSorting(true);
            bucketSort();
        }
    };

    const handlePause = () => {
        setSorting(false);
        sortingRef.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleReset = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSorting(false);
        sortingRef.current = false;
        generateRandomArray();
    };

    const handleArraySizeChange = newSize => {
        if (!sorting) {
            setArraySize(newSize);
            generateRandomArray();
        }
    };

    // Bar styling
    const getBarColor = index => {
        if (completed) return 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/40';
        if (currentIndices.includes(index)) {
            return 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/40';
        }
        return 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-indigo-500/40';
    };

    const getBarWidth = () => {
        const baseWidth = Math.max(100 / array.length, 1);
        return array.length <= 10 ? `${baseWidth * 1.5}%` : array.length <= 20 ? `${baseWidth * 1.2}%` : `${baseWidth}%`;
    };

    const getBarHeight = value => {
        const maxHeight = 90;
        const minHeight = 5;
        return `${Math.min(value * (maxHeight - minHeight) + minHeight, maxHeight)}%`; // Values are 0-1
    };

    const getBucketBarColor = (bucketIdx, elementIdx) => {
        if (bucketIndex === bucketIdx && elementInBucketIndex === elementIdx) {
            return 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-yellow-500/40';
        }
        if (bucketIndex === bucketIdx && currentIndices.includes(elementIdx)) {
            return 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/40';
        }
        return 'bg-gradient-to-t from-purple-600 to-purple-400 shadow-purple-500/40';
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex items-center justify-center px-4 py-24 max-sm:py-20 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-7xl bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-indigo-600/40 overflow-hidden"
                >
                    <h1 className="text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
                        Bucket Sort Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: <FaPlay />, text: 'Start', onClick: handleStart, disabled: sorting || completed, bg: 'bg-emerald-600' },
                            { icon: <FaPause />, text: 'Pause', onClick: handlePause, disabled: !sorting, bg: 'bg-amber-600' },
                            { icon: <FaRedo />, text: 'Reset', onClick: handleReset, bg: 'bg-rose-600' },
                            { icon: <FaRandom />, text: 'Random', onClick: generateRandomArray, disabled: sorting, bg: 'bg-purple-600' },
                            { icon: <FaEdit />, text: 'Custom', onClick: () => setShowInputModal(true), disabled: sorting, bg: 'bg-teal-600' },
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl text-lg font-semibold ${btn.bg} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125'} transition-all duration-300`}
                            >
                                {btn.icon} {btn.text}
                            </motion.button>
                        ))}
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <FaChartBar /> Size
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={arraySize}
                                onChange={e => handleArraySizeChange(parseInt(e.target.value))}
                                disabled={sorting}
                                className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{array.length} elements</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <MdSpeed /> Speed
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={e => setSpeed(parseInt(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{speed}%</span>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Comparisons', value: comparisons, color: 'text-cyan-400' },
                            { label: 'Placements', value: swaps, color: 'text-rose-400' },
                            { label: 'Status', value: completed ? 'Sorted' : sorting ? 'Sorting' : 'Idle', color: completed ? 'text-emerald-400' : sorting ? 'text-amber-400' : 'text-gray-400' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-700/70 p-5 rounded-xl shadow-lg border border-indigo-600/20"
                            >
                                <span className="font-semibold text-gray-200">{stat.label}: </span>
                                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Array Visualization */}
                    <div className="bg-gray-700/70 rounded-3xl p-6 h-96 flex items-end justify-center gap-2 overflow-x-auto border border-indigo-600/40">
                        {array.map((value, index) => (
                            <motion.div
                                key={index}
                                className={`${getBarColor(index)} rounded-t-xl shadow-lg relative flex items-center justify-center transition-all duration-300`}
                                style={{
                                    height: getBarHeight(value),
                                    width: getBarWidth(),
                                    maxWidth: '50px',
                                    minWidth: '8px',
                                }}
                                animate={{
                                    y: currentIndices.includes(index) ? -15 : 0,
                                    scale: currentIndices.includes(index) ? 1.05 : 1,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                {array.length <= 30 && (
                                    <span className="text-white text-xs font-mono font-bold absolute top-2 left-1/2 transform -translate-x-1/2 drop-shadow-lg">
                                        {value.toFixed(2)}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Buckets Visualization */}
                    {buckets.length > 0 && (
                        <div className="mt-8 bg-gray-700/70 rounded-3xl p-6 border border-indigo-600/40">
                            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Buckets</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {buckets.map((bucket, bucketIdx) => (
                                    <motion.div
                                        key={bucketIdx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`bg-gray-800/70 rounded-2xl p-3 border ${bucketIndex === bucketIdx ? 'border-yellow-500/50' : 'border-indigo-600/40'}`}
                                    >
                                        <h4 className="text-base font-semibold text-indigo-300 mb-2">
                                            Bucket {bucketIdx} ({bucket.length})
                                        </h4>
                                        <div className="flex gap-2 overflow-x-auto">
                                            {bucket.map((value, elementIdx) => (
                                                <motion.div
                                                    key={elementIdx}
                                                    className={`${getBucketBarColor(bucketIdx, elementIdx)} rounded-t-xl shadow-lg relative flex items-center justify-center transition-all duration-300`}
                                                    style={{
                                                        height: `${value * 80 + 10}%`,
                                                        width: '15px',
                                                        minWidth: '8px',
                                                    }}
                                                    animate={{
                                                        scale: bucketIndex === bucketIdx && elementInBucketIndex === elementIdx ? 1.1 : 1,
                                                        transition: { duration: 0.3 },
                                                    }}
                                                >
                                                    {bucket.length <= 10 && (
                                                        <span className="text-white text-xs font-mono font-bold absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow-lg">
                                                            {value.toFixed(2)}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Explanation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-10 bg-gray-700/70 p-8 rounded-3xl shadow-lg border border-indigo-600/40"
                    >
                        <h2 className="text-3xl font-bold mb-6 text-indigo-400">Bucket Sort Explained</h2>
                        <p className="text-gray-200 mb-6">
                            Bucket Sort distributes elements into buckets based on their value range, sorts each bucket individually (here using insertion sort), and then concatenates them back into the array.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-indigo-300 mb-2">Key Details</h3>
                                <ul className="text-gray-200 list-disc list-inside">
                                    <li>
                                        <span className="font-semibold text-indigo-400">Time Complexity:</span> O(n + k) best, O(n²) worst
                                    </li>
                                    <li>
                                        <span className="font-semibold text-indigo-400">Space Complexity:</span> O(n + k)
                                    </li>
                                    <li>
                                        <span className="font-semibold text-indigo-400">Stability:</span> Stable (with stable bucket sort)
                                    </li>
                                    <li>
                                        <span className="font-semibold text-indigo-400">Adaptive:</span> Yes
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-indigo-300 mb-2">Pseudocode</h3>
                                <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto">
                                    {`bucketSort(arr):
    n = arr.length
    buckets = array of n empty lists
    for i = 0 to n-1:
        index = floor(arr[i] * n)
        buckets[index].append(arr[i])
    for i = 0 to n-1:
        insertionSort(buckets[i])
    concatenate all buckets into arr
    return arr`}
                                </pre>
                            </div>
                        </div>
                    </motion.div>

                    {/* Custom Input Modal */}
                    <AnimatePresence>
                        {showInputModal && (
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                            >
                                <motion.div
                                    ref={modalRef}
                                    className="bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-indigo-600/40"
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                >
                                    <h2 className="text-3xl font-bold mb-4 text-indigo-400">Custom Array Input</h2>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={e => setCustomInput(e.target.value)}
                                        placeholder="e.g., 0.1, 0.2, 0.3"
                                        className="w-full p-4 bg-gray-700 rounded-lg text-white border border-indigo-600/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                                    />
                                    {inputError && <p className="text-rose-400 text-sm mb-3">{inputError}</p>}
                                    <p className="text-gray-300 text-sm mb-4">Enter numbers 0-1 (max 50 elements)</p>
                                    <div className="flex gap-4 justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowInputModal(false)}
                                            className="bg-rose-600 hover:brightness-125 text-white py-2 px-4 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCustomArray}
                                            className="bg-teal-600 hover:brightness-125 text-white py-2 px-4 rounded-lg transition-all"
                                        >
                                            Submit
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    );
};

export default BucketSortVisualizer;