"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CountingSortExplanation from '@/components/sorting/counting_explanation';

const CountingSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [sorting, setSorting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [placingIndex, setPlacingIndex] = useState(-1);
    const [countingArray, setCountingArray] = useState([]);
    const [placements, setPlacements] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);

    const timeoutRef = useRef(null);
    const sortingRef = useRef(false);

    // Generate random array
    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 96) + 5);
        setArray(newArray);
        resetState();
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
                    if (isNaN(num) || num < 0 || num > 100) throw new Error('Numbers must be 0-100');
                    return num;
                });

            if (parsedArray.length === 0) throw new Error('Enter at least one number');
            if (parsedArray.length > 50) throw new Error('Maximum 50 elements allowed');

            setArray(parsedArray);
            setArraySize(parsedArray.length);
            resetState();
            setShowInputModal(false);
            setCustomInput('');
        } catch (error) {
            setInputError(error.message);
        }
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setPlacements(0);
        setCurrentIndex(-1);
        setPlacingIndex(-1);
        setCountingArray([]);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        sortingRef.current = sorting;
        return () => clearTimeout(timeoutRef.current);
    }, [sorting]);

    // Corrected Counting Sort Implementation
    const countingSort = async () => {
        let tempArray = [...array];
        setSorting(true);
        sortingRef.current = true;

        const maxValue = Math.max(...tempArray);
        const count = new Array(maxValue + 1).fill(0);
        setCountingArray([...count]);

        // Step 1: Count occurrences
        for (let i = 0; i < tempArray.length && sortingRef.current; i++) {
            setCurrentIndex(i);
            count[tempArray[i]]++;
            setCountingArray([...count]);
            await sleep(1000 - speed * 9);
        }

        // Step 2: Cumulative count
        for (let i = 1; i < count.length && sortingRef.current; i++) {
            count[i] += count[i - 1];
            setCountingArray([...count]);
            await sleep(1000 - speed * 9);
        }

        // Step 3: Build the output array correctly
        const output = new Array(tempArray.length);
        for (let i = tempArray.length - 1; i >= 0 && sortingRef.current; i--) {
            const value = tempArray[i];
            const position = count[value] - 1;
            output[position] = value;
            count[value]--;
            setCountingArray([...count]);
            setCurrentIndex(i);
            setPlacingIndex(position);

            // Update the array state to see the values placed and removed
            let update = [...tempArray];
            update[position] = value;
            setArray(update);

            setPlacements(prev => prev + 1);
            await sleep(1000 - speed * 9);
            setCurrentIndex(-1);
            setPlacingIndex(-1);
        }

        if (sortingRef.current) {
            setArray(output);
            setCompleted(true);
            setSorting(false);
            sortingRef.current = false;
        }
    };

    const sleep = (ms) => new Promise(resolve => (timeoutRef.current = setTimeout(resolve, ms)));

    const handleStart = () => {
        if (!sorting && !completed) countingSort();
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
        if (index === placingIndex) return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
        if (index === currentIndex) return 'bg-gradient-to-t from-cyan-600 to-cyan-400';
        return 'bg-gradient-to-t from-indigo-600 to-indigo-400';
    };

    const getBarWidth = () => Math.max(100 / array.length, 1) + '%';
    const getBarHeight = (value) => {
        const maxHeight = 80;
        const maxValue = Math.max(...array, 100);
        return `${value === undefined ? 0 : (value / maxValue) * maxHeight}%`; // Handle undefined values
    };

    const handleClickOutsideModal = (e) => {
        if (modalRef.current && showInputModal && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutsideModal);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideModal);
        };
    }, [showInputModal]);

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
                        Counting Sort Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
                            { label: 'Placements', value: placements, color: 'text-rose-400' },
                            { label: 'Range', value: countingArray.length ? `${Math.min(...array.filter(v => v !== undefined))}-${Math.max(...array)}` : 'N/A', color: 'text-indigo-400' },
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
                                    y: index === currentIndex || index === placingIndex ? -15 : 0,
                                    scale: index === currentIndex || index === placingIndex ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-white text-xs md:text-sm font-mono absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow">
                                    {value === undefined ? '' : value}
                                </span>
                                {(index === currentIndex || index === placingIndex) && value !== undefined && (
                                    <span className="text-yellow-300 text-xs absolute bottom-1 left-1/2 transform -translate-x-1/2 drop-shadow">
                                        {value}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Counting Array Visualization */}
                    {countingArray.length > 0 && (
                        <motion.div
                            className="mt-8 bg-gray-700/70 p-6 rounded-3xl border border-indigo-600/30 overflow-x-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-xl font-semibold text-indigo-400 mb-4">Counting Array</h3>
                            <div className="flex flex-wrap gap-3">
                                {countingArray.map((count, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="bg-gray-600/50 p-3 rounded-lg flex flex-col items-center min-w-[60px]"
                                        animate={{ scale: count > 0 && sorting ? 1.05 : 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="text-indigo-300 font-bold">{idx}</span>
                                        <span className="text-gray-200">{count}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <CountingSortExplanation />

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
                                    ref={modalRef}
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
                                    <p className="text-gray-400 text-sm mt-2">Enter numbers (0-100) separated by commas or spaces.</p>
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
        </>
    );
};

export default CountingSortVisualizer;