"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import HeapSortExplanation from '@/components/sorting/heap_explanation';

const HeapSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [sorting, setSorting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [currentIndices, setCurrentIndices] = useState([]);
    const [heapTree, setHeapTree] = useState([]);
    const [isMaxHeap, setIsMaxHeap] = useState(true);
    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const sortingRef = useRef(false);

    // Generate random array
    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 96) + 5);
        setArray(newArray);
        resetState();
        updateHeapTree(newArray);
    };

    // Handle custom array input
    const handleCustomArray = () => {
        setInputError('');
        try {
            const parsedArray = customInput
                .split(/[,;\s]+/)
                .filter(item => item.trim() !== '')
                .map(item => {
                    const num = Number(item.trim());
                    if (isNaN(num) || num < 0) throw new Error(`"${item}" is not a valid positive number`);
                    return Math.round(num);
                });

            if (parsedArray.length === 0) throw new Error('Enter at least one number');
            if (parsedArray.length > 31) throw new Error('Maximum 31 elements allowed');

            setArray(parsedArray);
            setArraySize(parsedArray.length);
            resetState();
            updateHeapTree(parsedArray);
            setShowInputModal(false);
            setCustomInput('');
        } catch (error) {
            setInputError(error.message);
        }
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setComparisons(0);
        setSwaps(0);
        setCurrentIndices([]);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        sortingRef.current = sorting;
        return () => clearTimeout(timeoutRef.current);
    }, [sorting]);

    // Heapify function
    const heapify = async (arr, n, i) => {
        let largestOrSmallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        setCurrentIndices([i, left < n ? left : -1, right < n ? right : -1]);
        await sleep(1000 - speed * 9);

        if (left < n) {
            setComparisons(prev => prev + 1);
            if ((isMaxHeap && arr[left] > arr[largestOrSmallest]) || 
                (!isMaxHeap && arr[left] < arr[largestOrSmallest])) {
                largestOrSmallest = left;
            }
        }

        if (right < n) {
            setComparisons(prev => prev + 1);
            if ((isMaxHeap && arr[right] > arr[largestOrSmallest]) || 
                (!isMaxHeap && arr[right] < arr[largestOrSmallest])) {
                largestOrSmallest = right;
            }
        }

        if (largestOrSmallest !== i) {
            [arr[i], arr[largestOrSmallest]] = [arr[largestOrSmallest], arr[i]];
            setArray([...arr]);
            setSwaps(prev => prev + 1);
            updateHeapTree(arr);
            await sleep(1000 - speed * 9);
            await heapify(arr, n, largestOrSmallest);
        }
        setCurrentIndices([]);
    };

    // Heap Sort implementation
    const heapSort = async () => {
        let tempArray = [...array];
        setSorting(true);
        sortingRef.current = true;

        // Build initial heap
        for (let i = Math.floor(tempArray.length / 2) - 1; i >= 0 && sortingRef.current; i--) {
            await heapify(tempArray, tempArray.length, i);
        }

        // Sort the array
        for (let i = tempArray.length - 1; i > 0 && sortingRef.current; i--) {
            [tempArray[0], tempArray[i]] = [tempArray[i], tempArray[0]];
            setArray([...tempArray]);
            setSwaps(prev => prev + 1);
            updateHeapTree(tempArray.slice(0, i));
            await sleep(1000 - speed * 9);
            await heapify(tempArray, i, 0);
        }

        if (sortingRef.current) {
            // For Min Heap, reverse the array to get ascending order
            if (!isMaxHeap) {
                tempArray.reverse();
                setArray([...tempArray]);
                updateHeapTree(tempArray);
            }
            setArray([...tempArray]);
            setCompleted(true);
            setSorting(false);
            setCurrentIndices([]);
            sortingRef.current = false;
        }
    };

    // Update heap tree structure for visualization
    const updateHeapTree = (arr) => {
        const tree = [];
        const heapSize = arr.length;
        for (let i = 0; i < heapSize; i++) {
            const level = Math.floor(Math.log2(i + 1));
            if (!tree[level]) tree[level] = [];
            tree[level].push(arr[i]);
        }
        setHeapTree(tree);
    };

    const sleep = (ms) => new Promise(resolve => (timeoutRef.current = setTimeout(resolve, ms)));

    const handleStart = () => {
        if (!sorting && !completed) heapSort();
    };

    const handlePause = () => {
        setSorting(false);
        sortingRef.current = false;
        clearTimeout(timeoutRef.current);
    };

    const handleReset = () => {
        clearTimeout(timeoutRef.current);
        setSorting(false);
        sortingRef.current = false;
        generateRandomArray();
    };

    const getBarColor = (index) => {
        if (completed) return 'bg-gradient-to-t from-emerald-600 to-emerald-400';
        if (currentIndices.includes(index)) return 'bg-gradient-to-t from-cyan-600 to-cyan-400';
        return 'bg-gradient-to-t from-indigo-600 to-indigo-400';
    };

    const getBarWidth = () => Math.max(100 / array.length, 1) + '%';
    const getBarHeight = (value) => {
        const maxHeight = 80;
        const maxValue = Math.max(...array, 100);
        return `${(value / maxValue) * maxHeight}%`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-4 py-24 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto bg-gray-800/90 rounded-3xl shadow-2xl p-8 border border-indigo-600/40"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Heap Sort Visualizer
                </h1>

                {/* Controls */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    {[
                        { icon: <FaPlay />, text: 'Start', onClick: handleStart, disabled: sorting || completed, bg: 'bg-emerald-600' },
                        { icon: <FaPause />, text: 'Pause', onClick: handlePause, disabled: !sorting, bg: 'bg-amber-600' },
                        { icon: <FaRedo />, text: 'Reset', onClick: handleReset, bg: 'bg-rose-600' },
                        { icon: <FaRandom />, text: 'Random', onClick: generateRandomArray, disabled: sorting, bg: 'bg-purple-600' },
                        { icon: <FaEdit />, text: 'Custom', onClick: () => setShowInputModal(true), disabled: sorting, bg: 'bg-teal-600' },
                    ].map((btn, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={btn.onClick}
                            disabled={btn.disabled}
                            className={`${btn.bg} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'} flex items-center justify-center gap-2 p-3 rounded-xl text-lg font-semibold transition-all`}
                        >
                            {btn.icon} {btn.text}
                        </motion.button>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !sorting && (setIsMaxHeap(!isMaxHeap), handleReset())}
                        disabled={sorting}
                        className={`bg-indigo-600 ${sorting ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'} flex items-center justify-center gap-2 p-3 rounded-xl text-lg font-semibold transition-all`}
                    >
                        {isMaxHeap ? 'Max Heap' : 'Min Heap'}
                    </motion.button>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-indigo-300"><FaChartBar /> Size</label>
                        <input
                            type="range"
                            min="5"
                            max="31"
                            value={arraySize}
                            onChange={(e) => !sorting && (setArraySize(parseInt(e.target.value)), generateRandomArray())}
                            disabled={sorting}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-sm text-gray-400">{array.length} elements</span>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-lg font-semibold text-indigo-300"><MdSpeed /> Speed</label>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={speed}
                            onChange={(e) => setSpeed(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <span className="text-sm text-gray-400">{speed}%</span>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Comparisons', value: comparisons, color: 'text-cyan-400' },
                        { label: 'Swaps', value: swaps, color: 'text-rose-400' },
                        { label: 'Status', value: completed ? 'Sorted' : sorting ? 'Sorting' : 'Idle', color: completed ? 'text-emerald-400' : sorting ? 'text-amber-400' : 'text-gray-400' },
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-gray-700/70 p-4 rounded-xl border border-indigo-600/20"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="font-semibold text-gray-300">{stat.label}: </span>
                            <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Array Visualization */}
                <div className="bg-gray-700/70 rounded-3xl p-6 h-96 flex items-end justify-center gap-1 overflow-x-auto border border-indigo-600/30">
                    {array.map((value, index) => (
                        <motion.div
                            key={index}
                            className={`${getBarColor(index)} rounded-t-xl relative`}
                            style={{ height: getBarHeight(value), width: getBarWidth(), maxWidth: '40px', minWidth: '10px' }}
                            animate={{
                                y: currentIndices.includes(index) ? -15 : 0,
                                scale: currentIndices.includes(index) ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="text-white text-xs md:text-sm font-mono absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow">
                                {value}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Heap Tree Visualization */}
                {heapTree.length > 0 && (
                    <motion.div
                        className="mt-8 bg-gray-700/70 rounded-3xl p-6 border border-indigo-600/30 overflow-x-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-semibold text-indigo-400 mb-4">{isMaxHeap ? 'Max Heap' : 'Min Heap'} Structure</h3>
                        <div className="space-y-8">
                            {heapTree.map((level, levelIdx) => (
                                <div key={levelIdx} className="flex flex-col items-center">
                                    <span className="text-sm text-gray-400 mb-2">Level {levelIdx}</span>
                                    <div className="flex gap-4 flex-wrap justify-center">
                                        {level.map((value, nodeIdx) => {
                                            const flatIndex = heapTree.slice(0, levelIdx).reduce((acc, lvl) => acc + lvl.length, 0) + nodeIdx;
                                            return (
                                                <motion.div
                                                    key={nodeIdx}
                                                    className="bg-indigo-600/80 p-3 rounded-full text-white text-sm font-mono shadow-lg"
                                                    animate={{ scale: currentIndices.includes(flatIndex) ? 1.1 : 1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {value}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <HeapSortExplanation />

                {/* Custom Input Modal */}
                <AnimatePresence>
                    {showInputModal && (
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-gray-800 rounded-3xl p-6 w-full max-w-md border border-indigo-600/40"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 text-indigo-400">Custom Array Input</h2>
                                <input
                                    type="text"
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    placeholder="e.g., 10, 20, 30"
                                    className="w-full p-3 bg-gray-700 rounded-lg text-white border border-indigo-600/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                />
                                {inputError && <p className="text-rose-400 text-sm mt-2">{inputError}</p>}
                                <p className="text-gray-400 text-sm mt-2">Enter positive numbers (max 31) separated by commas or spaces.</p>
                                <div className="flex gap-4 justify-end mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => setShowInputModal(false)}
                                        className="bg-rose-600 hover:brightness-110 text-white py-2 px-4 rounded-lg"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={handleCustomArray}
                                        className="bg-teal-600 hover:brightness-110 text-white py-2 px-4 rounded-lg"
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
    );
};

export default HeapSortVisualizer;