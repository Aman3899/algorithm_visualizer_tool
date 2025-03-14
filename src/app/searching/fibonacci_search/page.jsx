"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RefreshCw, Shuffle, ChartBar, Search, Edit, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import FibonacciSearchExplanation from '@/components/searching/fibonacci_explanation';

const FibonacciSearchVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [searching, setSearching] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [target, setTarget] = useState(null);
    const [offset, setOffset] = useState(-1);
    const [fibIndices, setFibIndices] = useState([-1, -1, -1]); // [current, fibM2, fibM1]
    const [foundIndex, setFoundIndex] = useState(-1);
    const [comparisons, setComparisons] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [targetInput, setTargetInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');

    const searchCancelRef = useRef(false);
    const timeoutRef = useRef(null);
    const modalRef = useRef(null);

    // Generate random sorted array
    const generateRandomArray = useCallback(() => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 96) + 5);
        const sortedArray = newArray.sort((a, b) => a - b);
        setArray(sortedArray);
        const randomTargetIndex = Math.floor(Math.random() * sortedArray.length);
        setTarget(sortedArray[randomTargetIndex]);
        resetState();
    }, [arraySize]);

    // Handle custom array and target input
    const handleCustomInput = useCallback(() => {
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

            const sortedArray = parsedArray.sort((a, b) => a - b);
            // Update state synchronously to ensure bars reflect the new values
            setArray(sortedArray);
            setArraySize(sortedArray.length);
            setTarget(targetNum);
            resetState();
            setShowInputModal(false);
            setCustomInput('');
            setTargetInput('');
        } catch (error) {
            setInputError(error.message);
        }
    }, [customInput, targetInput]);

    // Reset state
    const resetState = useCallback(() => {
        setCompleted(false);
        setComparisons(0);
        setOffset(-1);
        setFibIndices([-1, -1, -1]);
        setFoundIndex(-1);
        searchCancelRef.current = false;
    }, []);

    // Sleep utility
    const sleep = ms => new Promise(resolve => (timeoutRef.current = setTimeout(resolve, ms)));

    // Fibonacci Search implementation
    const fibonacciSearch = useCallback(async () => {
        setSearching(true);
        resetState();

        const arr = [...array];
        const n = arr.length;

        let fibM2 = 0; // (m-2)'th Fibonacci number
        let fibM1 = 1; // (m-1)'th Fibonacci number
        let fibM = fibM2 + fibM1; // m'th Fibonacci number

        // Find smallest Fibonacci number >= array length
        while (fibM < n) {
            fibM2 = fibM1;
            fibM1 = fibM;
            fibM = fibM2 + fibM1;
        }

        let offsetVal = -1;

        while (fibM > 1 && !searchCancelRef.current) {
            const i = Math.min(offsetVal + fibM2, n - 1);
            setFibIndices([i, offsetVal + fibM2, offsetVal + fibM1]);
            setOffset(offsetVal);
            setComparisons(prev => prev + 1);

            await sleep(1000 - speed * 9);

            if (searchCancelRef.current) break;

            if (arr[i] === target) {
                setFoundIndex(i);
                setCompleted(true);
                setSearching(false);
                return;
            } else if (arr[i] < target) {
                fibM = fibM1;
                fibM1 = fibM2;
                fibM2 = fibM - fibM1;
                offsetVal = i;
            } else {
                fibM = fibM2;
                fibM1 = fibM1 - fibM2;
                fibM2 = fibM - fibM1;
            }
        }

        if (!searchCancelRef.current) {
            if (offsetVal + 1 < n && arr[offsetVal + 1] === target) {
                setFoundIndex(offsetVal + 1);
            } else {
                setFoundIndex(-1);
            }
            setCompleted(true);
        }
        setSearching(false);
        setOffset(-1);
        setFibIndices([-1, -1, -1]);
    }, [array, target, speed]);

    useEffect(() => {
        generateRandomArray();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [generateRandomArray]);

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutsideModal);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        }
        return () => document.removeEventListener('mousedown', handleClickOutsideModal);
    }, [showInputModal]);

    const handleClickOutsideModal = e => {
        if (modalRef.current && showInputModal && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    // Bar styling
    const getBarColor = index => {
        if (completed && foundIndex === index) return 'bg-gradient-to-t from-green-600 to-green-400 shadow-green-500/40';
        if (fibIndices[0] === index) return 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-yellow-500/40'; // Current check
        if (fibIndices[1] === index || fibIndices[2] === index) return 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-blue-500/40'; // Fib bounds
        return 'bg-gradient-to-t from-purple-600 to-purple-400 shadow-purple-500/40';
    };

    const getBarWidth = () => Math.max(100 / array.length, 1) + '%';
    const getBarHeight = value => {
        const maxHeight = 90;
        const minHeight = 5;
        const maxValue = Math.max(...array, 100);
        return `${Math.min((value / maxValue) * (maxHeight - minHeight) + minHeight, maxHeight)}%`;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center px-4 py-24 max-sm:py-20 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-7xl bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-600/40 overflow-hidden"
                >
                    <h1 className="text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400">
                        Fibonacci Search Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-10">
                        {[
                            {
                                icon: <Play size={20} />,
                                text: 'Start',
                                onClick: () => !searching && target !== null && fibonacciSearch(),
                                disabled: searching || target === null,
                                bg: 'bg-green-600',
                            },
                            {
                                icon: <Pause size={20} />,
                                text: 'Stop',
                                onClick: () => {
                                    searchCancelRef.current = true;
                                    setSearching(false);
                                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                },
                                disabled: !searching,
                                bg: 'bg-red-600',
                            },
                            {
                                icon: <RefreshCw size={20} />,
                                text: 'Reset',
                                onClick: () => {
                                    searchCancelRef.current = true;
                                    setSearching(false);
                                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                    generateRandomArray();
                                },
                                bg: 'bg-rose-600',
                            },
                            {
                                icon: <Shuffle size={20} />,
                                text: 'Random',
                                onClick: generateRandomArray,
                                disabled: searching,
                                bg: 'bg-blue-600',
                            },
                            {
                                icon: <Edit size={20} />,
                                text: 'Custom',
                                onClick: () => setShowInputModal(true),
                                disabled: searching,
                                bg: 'bg-teal-600',
                            },
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: btn.disabled ? 1 : 1.05, boxShadow: btn.disabled ? '' : '0 0 20px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: btn.disabled ? 1 : 0.95 }}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl text-lg font-semibold ${btn.bg} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125'} transition-all duration-300`}
                            >
                                {btn.icon} {btn.text}
                            </motion.button>
                        ))}
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <ChartBar size={20} /> Size
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={arraySize}
                                onChange={e => !searching && (setArraySize(parseInt(e.target.value)), generateRandomArray())}
                                disabled={searching}
                                className="w-full accent-purple-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{array.length} elements</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <FastForward size={20} /> Speed
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={e => setSpeed(Number(e.target.value))}
                                className="w-full accent-purple-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{speed}%</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <Search size={20} /> Target
                            </label>
                            <div className="bg-gray-700 p-3 rounded-lg text-center text-white font-mono">
                                {target !== null ? target : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Comparisons', value: comparisons, color: 'text-cyan-400' },
                            { label: 'Status', value: completed ? (foundIndex >= 0 ? 'Found' : 'Not Found') : searching ? 'Searching' : 'Idle', color: completed ? (foundIndex >= 0 ? 'text-green-400' : 'text-rose-400') : searching ? 'text-amber-400' : 'text-gray-400' },
                            { label: 'Found At', value: foundIndex >= 0 ? `Index ${foundIndex}` : 'N/A', color: 'text-purple-400' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-700/70 p-5 rounded-xl shadow-lg border border-purple-600/20"
                            >
                                <span className="font-semibold text-gray-200">{stat.label}: </span>
                                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Visualization */}
                    <div className="bg-gray-700/70 rounded-3xl p-6 h-96 flex items-end justify-center gap-2 overflow-x-auto border border-purple-600/40">
                        <AnimatePresence>
                            {array.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: getBarHeight(value),
                                        y: fibIndices.includes(index) ? -15 : 0,
                                        scale: fibIndices.includes(index) ? 1.05 : 1,
                                    }}
                                    exit={{ height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`${getBarColor(index)} rounded-t-xl shadow-lg relative`}
                                    style={{ width: getBarWidth(), maxWidth: '50px', minWidth: '8px' }}
                                >
                                    {array.length <= 30 && (
                                        <span className="text-white text-xs font-mono font-bold absolute top-2 left-1/2 transform -translate-x-1/2 drop-shadow-lg">
                                            {value}
                                        </span>
                                    )}
                                    {fibIndices[0] === index && <span className="absolute -top-8 text-yellow-400 text-xs">Check</span>}
                                    {fibIndices[1] === index && <span className="absolute -top-8 text-blue-400 text-xs">Fib-2</span>}
                                    {fibIndices[2] === index && <span className="absolute -top-8 text-blue-400 text-xs">Fib-1</span>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>


                    <FibonacciSearchExplanation />


                    {/* Custom Input Modal */}
                    <AnimatePresence>
                        {showInputModal && (
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                            >
                                <motion.div
                                    ref={modalRef}
                                    className="bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-purple-600/40"
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                >
                                    <h2 className="text-3xl font-bold mb-4 text-purple-400">Custom Input</h2>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={e => setCustomInput(e.target.value)}
                                        placeholder="e.g., 10, 20, 30, 40"
                                        className="w-full p-4 bg-gray-700 rounded-lg text-white border border-purple-600/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all mb-3"
                                    />
                                    <input
                                        type="text"
                                        value={targetInput}
                                        onChange={e => setTargetInput(e.target.value)}
                                        placeholder="Target (e.g., 30)"
                                        className="w-full p-4 bg-gray-700 rounded-lg text-white border border-purple-600/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all mb-3"
                                    />
                                    {inputError && <p className="text-rose-400 text-sm mb-3">{inputError}</p>}
                                    <p className="text-gray-300 text-sm mb-4">Enter positive numbers (max 50) and a target value, separated by commas or spaces.</p>
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
                                            onClick={handleCustomInput}
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

export default FibonacciSearchVisualizer;