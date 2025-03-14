"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SelectionSortExplanation from '@/components/sorting/selection_explanation';

const SelectionSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [sorting, setSorting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [currentIndices, setCurrentIndices] = useState([-1, -1]);
    const [minIndex, setMinIndex] = useState(-1);  // Track the minimum index
    const [swapped, setSwapped] = useState(false);
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
        const newArray = Array.from({ length: arraySize }, () =>
            Math.floor(Math.random() * 96) + 5 // 5-100 range
        );
        setArray(newArray);
        resetState();
    };

    // Handle custom array input
    const handleCustomArray = () => {
        setInputError('');
        try {
            const inputValues = customInput
                .split(/[,;\s]+/)
                .filter(item => item.trim() !== '');

            const parsedArray = inputValues.map(item => {
                const num = Number(item.trim());
                if (isNaN(num) || num < 0) {
                    throw new Error(`"${item}" is not a valid positive number`);
                }
                return Math.round(num); // Ensure integers
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
            setInputError(error.message || 'Invalid input. Enter positive numbers only.');
        }
    };

    // Close modal when clicking outside
    const handleClickOutsideModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setComparisons(0);
        setSwaps(0);
        setCurrentIndices([-1, -1]);
        setMinIndex(-1); // Reset minIndex
        setSwapped(false);
    };

    // Initial random array generation
    useEffect(() => {
        generateRandomArray();
    }, []);

    // Modal event listeners
    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutsideModal);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [showInputModal]);

    useEffect(() => {
        sortingRef.current = sorting;
    }, [sorting]);

    // Selection Sort implementation
    const selectionSort = async () => {
        let tempArray = [...array];
        let localComparisons = 0;
        let localSwaps = 0;

        setSorting(true);
        sortingRef.current = true;

        for (let i = 0; i < tempArray.length - 1 && sortingRef.current; i++) {
            let min_idx = i;
            setMinIndex(i);

            for (let j = i + 1; j < tempArray.length && sortingRef.current; j++) {
                setCurrentIndices([j, min_idx]);
                setSwapped(false);
                localComparisons++;
                setComparisons(localComparisons);

                await new Promise(resolve => {
                    timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
                });

                if (tempArray[j] < tempArray[min_idx]) {
                    min_idx = j;
                    setMinIndex(j);
                }
            }

            if (min_idx !== i) {
                setSwapped(true);
                [tempArray[i], tempArray[min_idx]] = [tempArray[min_idx], tempArray[i]];
                setArray([...tempArray]);
                localSwaps++;
                setSwaps(localSwaps);

                await new Promise(resolve => {
                    timeoutRef.current = setTimeout(resolve, 1000 - speed * 9);
                });
            }
        }

        if (sortingRef.current) {
            setCurrentIndices([-1, -1]);
            setMinIndex(-1);
            setCompleted(true);
            setSorting(false);
            sortingRef.current = false;
        }
    };

    const handleStart = () => {
        if (!sorting && !completed) {
            setSorting(true);
            selectionSort();
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

    const handleArraySizeChange = (newSize) => {
        if (!sorting) {
            setArraySize(newSize);
            generateRandomArray();
        }
    };

    // Bar styling
    const getBarColor = (index) => {
        if (completed) return 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/40';
        if (index === minIndex) {
            return 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-yellow-500/40'; // Color for the minIndex element
        }
        if (currentIndices.includes(index)) {
            return swapped ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-rose-500/40' : 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/40';
        }
        return 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-indigo-500/40';
    };

    const getBarWidth = () => {
        const baseWidth = Math.max(100 / array.length, 1);
        if (array.length <= 10) return `${baseWidth * 1.5}%`;
        if (array.length <= 20) return `${baseWidth * 1.2}%`;
        return `${baseWidth}%`;
    };

    const getBarHeight = (value) => {
        const maxHeight = 90; // Max height as percentage of container
        const minHeight = 5;  // Min height as percentage
        const maxArrayValue = Math.max(...array, 100); // Use 100 as reference if array is small
        return `${Math.min((value / maxArrayValue) * (maxHeight - minHeight) + minHeight, maxHeight)}%`;
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex items-center justify-center px-4 py-24 max-sm:py-20 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-7xl bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-8 border border-indigo-600/40 overflow-hidden"
                >
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-6 sm:mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
                        Selection Sort Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                        {[
                            { icon: <FaPlay />, text: 'Start', onClick: handleStart, disabled: sorting || completed, bg: 'bg-emerald-600', tooltip: 'Begin sorting' },
                            { icon: <FaPause />, text: 'Pause', onClick: handlePause, disabled: !sorting, bg: 'bg-amber-600', tooltip: 'Pause sorting' },
                            { icon: <FaRedo />, text: 'Reset', onClick: handleReset, bg: 'bg-rose-600', tooltip: 'Reset array' },
                            { icon: <FaRandom />, text: 'Random', onClick: generateRandomArray, disabled: sorting, bg: 'bg-purple-600', tooltip: 'Generate random array' },
                            { icon: <FaEdit />, text: 'Custom', onClick: () => setShowInputModal(true), disabled: sorting, bg: 'bg-teal-600', tooltip: 'Input custom array' },
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-xl text-base sm:text-lg font-semibold ${btn.bg} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125'} transition-all duration-300`}
                                title={btn.tooltip}
                            >
                                {btn.icon} {btn.text}
                            </motion.button>
                        ))}

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <label className="flex items-center gap-2 text-base sm:text-lg font-semibold"><FaChartBar /> Size</label>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={arraySize}
                                onChange={(e) => handleArraySizeChange(parseInt(e.target.value))}
                                disabled={sorting}
                                className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{array.length} elements</span>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3">
                            <label className="flex items-center gap-2 text-base sm:text-lg font-semibold"><MdSpeed /> Speed</label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={(e) => setSpeed(parseInt(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{speed}%</span>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
                        {[
                            { label: 'Comparisons', value: comparisons, color: 'text-cyan-400' },
                            { label: 'Swaps', value: swaps, color: 'text-rose-400' },
                            { label: 'Status', value: completed ? 'Sorted' : sorting ? 'Sorting' : 'Idle', color: completed ? 'text-emerald-400' : sorting ? 'text-amber-400' : 'text-gray-400' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-700/70 p-4 sm:p-5 rounded-xl shadow-lg border border-indigo-600/20"
                            >
                                <span className="font-semibold text-gray-200">{stat.label}: </span>
                                <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Visualization */}
                    <div className="bg-gray-700/70 rounded-3xl p-4 sm:p-6 h-60 sm:h-96 flex items-end justify-center gap-1 sm:gap-2 overflow-x-auto border border-indigo-600/40">
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
                                    y: currentIndices.includes(index) ? -15 : (index === minIndex ? -15 : 0),
                                    rotateX: currentIndices.includes(index) ? 10 : (index === minIndex ? 10 : 0),
                                    scale: currentIndices.includes(index) ? 1.05 : (index === minIndex ? 1.05 : 1),
                                    transition: { duration: 0.3 },
                                }}
                            >
                                {array.length <= 30 && (
                                    <span className="text-white text-xs sm:text-sm font-mono font-bold absolute top-2 left-1/2 transform -translate-x-1/2 drop-shadow-lg">
                                        {value}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <SelectionSortExplanation />

                    {/* Custom Input Modal */}
                    <AnimatePresence>
                        {showInputModal && (
                            <motion.div
                                className="fixed inset-0 flex pt-36 h-[410px] justify-center z-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                            >
                                <motion.div
                                    ref={modalRef}
                                    className="bg-gray-800 rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-indigo-600/40"
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-400">Custom Array Input</h2>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        placeholder="e.g., 10, 20, 30, 10, 20, 30"
                                        className="w-full p-4 bg-gray-700 rounded-lg text-white border border-indigo-600/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                                    />
                                    {inputError && <p className="text-rose-400 text-sm mb-3">{inputError}</p>}
                                    <p className="text-gray-300 text-sm mb-4">Enter positive numbers separated by commas OR semicolons (max 50 elements).</p>
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

export default SelectionSortVisualizer;