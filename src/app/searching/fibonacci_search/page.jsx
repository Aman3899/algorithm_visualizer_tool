"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaSearch, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

const FibonacciSearchVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [searching, setSearching] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [target, setTarget] = useState(null);
    const [offset, setOffset] = useState(-1); // Current offset in Fibonacci search
    const [fibIndices, setFibIndices] = useState([-1, -1, -1]); // [fibM2, fibM1, fib] indices
    const [foundIndex, setFoundIndex] = useState(-1);
    const [comparisons, setComparisons] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [targetInput, setTargetInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const searchingRef = useRef(false);

    // Generate random sorted array
    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 96) + 5);
        newArray.sort((a, b) => a - b); // Fibonacci search requires sorted array
        setArray(newArray);
        setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
        resetState();
    };

    // Handle custom array and target input
    const handleCustomInput = () => {
        setInputError('');
        try {
            const parsedArray = customInput
                .split(/[,;\s]+/)
                .filter(item => item.trim() !== '')
                .map(item => {
                    const num = Number(item.trim());
                    if (isNaN(num) || num < 0) throw new Error(`"${item}" must be a positive number`);
                    return Math.round(num);
                });

            const targetNum = Number(targetInput.trim());
            if (isNaN(targetNum) || targetNum < 0) throw new Error('Target must be a positive number');

            if (parsedArray.length === 0) throw new Error('Enter at least one number for the array');
            if (parsedArray.length > 50) throw new Error('Maximum 50 elements allowed');

            parsedArray.sort((a, b) => a - b);
            setArray(parsedArray);
            setArraySize(parsedArray.length);
            setTarget(targetNum);
            resetState();
            setShowInputModal(false);
            setCustomInput('');
            setTargetInput('');
        } catch (error) {
            setInputError(error.message);
        }
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setComparisons(0);
        setOffset(-1);
        setFibIndices([-1, -1, -1]);
        setFoundIndex(-1);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        searchingRef.current = searching;
        return () => clearTimeout(timeoutRef.current);
    }, [searching]);

    // Fibonacci Search implementation
    const fibonacciSearch = async () => {
        let tempArray = [...array];
        setSearching(true);
        searchingRef.current = true;

        let fibM2 = 0; // (m-2)'th Fibonacci number
        let fibM1 = 1; // (m-1)'th Fibonacci number
        let fib = fibM1 + fibM2; // m'th Fibonacci number

        // Find the smallest Fibonacci number greater than or equal to array length
        while (fib < tempArray.length) {
            fibM2 = fibM1;
            fibM1 = fib;
            fib = fibM1 + fibM2;
        }

        let offset = -1; // Marks the eliminated range from the front
        while (fib > 1 && searchingRef.current) {
            const i = Math.min(offset + fibM2, tempArray.length - 1);
            setOffset(offset);
            setFibIndices([i, offset + fibM2, offset + fibM1]);
            setComparisons(prev => prev + 1);

            await sleep(1000 - speed * 9);

            if (i < 0 || i >= tempArray.length) break;

            if (tempArray[i] === target) {
                setFoundIndex(i);
                setCompleted(true);
                setSearching(false);
                searchingRef.current = false;
                return;
            } else if (tempArray[i] < target) {
                fib = fibM1;
                fibM1 = fibM2;
                fibM2 = fib - fibM1;
                offset = i;
            } else {
                fib = fibM2;
                fibM1 = fibM1 - fibM2;
                fibM2 = fib - fibM1;
            }
        }

        if (searchingRef.current) {
            if (tempArray[offset + 1] === target) {
                setFoundIndex(offset + 1);
                setCompleted(true);
            } else {
                setFoundIndex(-1); // Not found
                setCompleted(true);
            }
            setSearching(false);
            setOffset(-1);
            setFibIndices([-1, -1, -1]);
            searchingRef.current = false;
        }
    };

    const sleep = (ms) => new Promise(resolve => (timeoutRef.current = setTimeout(resolve, ms)));

    const handleStart = () => {
        if (!searching && !completed && target !== null) fibonacciSearch();
    };

    const handlePause = () => {
        setSearching(false);
        searchingRef.current = false;
        clearTimeout(timeoutRef.current);
    };

    const handleReset = () => {
        clearTimeout(timeoutRef.current);
        setSearching(false);
        searchingRef.current = false;
        generateRandomArray();
    };

    const getBarColor = (index) => {
        if (completed && foundIndex === index) return 'bg-gradient-to-t from-emerald-600 to-emerald-400';
        if (fibIndices[0] === index) return 'bg-gradient-to-t from-yellow-600 to-yellow-400'; // Current index
        if (fibIndices[1] === index || fibIndices[2] === index) return 'bg-gradient-to-t from-cyan-600 to-cyan-400'; // Fibonacci bounds
        return 'bg-gradient-to-t from-indigo-600 to-indigo-400';
    };

    const getBarWidth = () => Math.max(100 / array.length, 1) + '%';
    const getBarHeight = (value) => {
        const maxHeight = 80;
        const maxValue = Math.max(...array, 100);
        return `${(value / maxValue) * maxHeight}%`;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white px-4 py-24 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto bg-gray-800/90 rounded-3xl shadow-2xl p-8 border border-indigo-600/40"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Fibonacci Search Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                        {[
                            { icon: <FaPlay />, text: 'Start', onClick: handleStart, disabled: searching || completed || target === null, bg: 'bg-emerald-600' },
                            { icon: <FaPause />, text: 'Pause', onClick: handlePause, disabled: !searching, bg: 'bg-amber-600' },
                            { icon: <FaRedo />, text: 'Reset', onClick: handleReset, bg: 'bg-rose-600' },
                            { icon: <FaRandom />, text: 'Random', onClick: generateRandomArray, disabled: searching, bg: 'bg-purple-600' },
                            { icon: <FaEdit />, text: 'Custom', onClick: () => setShowInputModal(true), disabled: searching, bg: 'bg-teal-600' },
                            { icon: <FaSearch />, text: `Target: ${target !== null ? target : 'N/A'}`, disabled: true, bg: 'bg-indigo-600' },
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: btn.disabled ? 1 : 1.05, boxShadow: btn.disabled ? '' : '0 0 15px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: btn.disabled ? 1 : 0.95 }}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`${btn.bg} ${btn.disabled && !btn.icon.toString().includes('FaSearch') ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'} flex items-center justify-center gap-2 p-3 rounded-xl text-lg font-semibold transition-all`}
                            >
                                {btn.icon} {btn.text}
                            </motion.button>
                        ))}
                    </div>

                    {/* Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="flex items-center gap-2 text-lg font-semibold text-indigo-300"><FaChartBar /> Size</label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={arraySize}
                                onChange={(e) => !searching && (setArraySize(parseInt(e.target.value)), generateRandomArray())}
                                disabled={searching}
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
                            { label: 'Status', value: completed ? (foundIndex >= 0 ? 'Found' : 'Not Found') : searching ? 'Searching' : 'Idle', color: completed ? (foundIndex >= 0 ? 'text-emerald-400' : 'text-rose-400') : searching ? 'text-amber-400' : 'text-gray-400' },
                            { label: 'Found At', value: foundIndex >= 0 ? `Index ${foundIndex}` : 'N/A', color: 'text-indigo-400' },
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
                                    y: fibIndices.includes(index) ? -15 : 0,
                                    scale: fibIndices.includes(index) ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-white text-xs md:text-sm font-mono absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow">
                                    {value}
                                </span>
                                {fibIndices[0] === index && <span className="absolute -top-8 text-yellow-300 text-xs">Check</span>}
                                {fibIndices[1] === index && <span className="absolute -top-8 text-cyan-300 text-xs">Fib-1</span>}
                                {fibIndices[2] === index && <span className="absolute -top-8 text-cyan-300 text-xs">Fib</span>}
                            </motion.div>
                        ))}
                    </div>

                    {/* Explanation */}
                    <motion.div
                        className="mt-8 bg-gray-700/70 p-6 rounded-3xl border border-indigo-600/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-indigo-400">Fibonacci Search Explained</h2>
                        <p className="text-gray-300 mb-4">
                            Fibonacci Search is a comparison-based technique that uses Fibonacci numbers to narrow down the search space in a sorted array. It’s particularly efficient for uniformly distributed data, avoiding division operations used in binary search.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-300 mb-2">Key Details</h3>
                                <ul className="text-gray-300 list-disc list-inside">
                                    <li>Time Complexity: O(log n) average</li>
                                    <li>Space Complexity: O(1)</li>
                                    <li>Prerequisite: Sorted array</li>
                                    <li>Best for: Uniformly distributed data</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-300 mb-2">Steps</h3>
                                <ol className="text-gray-300 list-decimal list-inside">
                                    <li>Find smallest Fibonacci number ≥ array size</li>
                                    <li>Compare target with element at Fib-2 offset</li>
                                    <li>Adjust Fibonacci numbers and offset based on comparison</li>
                                    <li>Repeat until found or search space is exhausted</li>
                                </ol>
                            </div>
                        </div>
                    </motion.div>

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
                                    <h2 className="text-2xl font-bold mb-4 text-indigo-400">Custom Input</h2>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        placeholder="e.g., 10, 20, 30, 40"
                                        className="w-full p-3 bg-gray-700 rounded-lg text-white border border-indigo-600/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 mb-4"
                                    />
                                    <input
                                        type="text"
                                        value={targetInput}
                                        onChange={(e) => setTargetInput(e.target.value)}
                                        placeholder="Target (e.g., 30)"
                                        className="w-full p-3 bg-gray-700 rounded-lg text-white border border-indigo-600/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {inputError && <p className="text-rose-400 text-sm mt-2">{inputError}</p>}
                                    <p className="text-gray-400 text-sm mt-2">Enter positive numbers (max 50) and a target value.</p>
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
                                            onClick={handleCustomInput}
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
        </>
    );
};

export default FibonacciSearchVisualizer;