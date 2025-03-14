"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaSearch, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ExponentialSearchExplanation from '@/components/searching/exponential_explanation';

const ExponentialSearchVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(15);
    const [searching, setSearching] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [target, setTarget] = useState(null);
    const [bound, setBound] = useState(-1); // Current exponential bound
    const [low, setLow] = useState(-1);
    const [high, setHigh] = useState(-1);
    const [mid, setMid] = useState(-1); // For binary search phase
    const [foundIndex, setFoundIndex] = useState(-1);
    const [comparisons, setComparisons] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [targetInput, setTargetInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const searchingRef = useRef(false);
    const modalRef = useRef(null);

    // Generate random sorted array
    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 96) + 5); // 5-100
        newArray.sort((a, b) => a - b); // Exponential search requires sorted array
        setArray(newArray);
        setTarget(newArray[Math.floor(Math.random() * newArray.length)]); // Random target from array
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

            if (parsedArray.length === 0) {
                setInputError('Please enter at least one number for the array');
                return;
            }
            if (parsedArray.length > 50) {
                setInputError('Maximum 50 elements allowed');
                return;
            }

            parsedArray.sort((a, b) => a - b); // Ensure sorted for exponential search
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
        setBound(-1);
        setLow(-1);
        setHigh(-1);
        setMid(-1);
        setFoundIndex(-1);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        searchingRef.current = searching;
    }, [searching]);

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', e => {
                if (modalRef.current && !modalRef.current.contains(e.target)) setShowInputModal(false);
            });
        }
        return () => document.removeEventListener('mousedown', () => { });
    }, [showInputModal]);

    // Exponential Search implementation
    const exponentialSearch = async () => {
        let tempArray = [...array];
        setSearching(true);
        searchingRef.current = true;

        const n = tempArray.length;
        if (n === 0) return;

        // Exponential phase: Find the range
        let i = 1;
        if (tempArray[0] === target) {
            setFoundIndex(0);
            setCompleted(true);
            setSearching(false);
            searchingRef.current = false;
            return;
        }

        while (i < n && tempArray[i] <= target && searchingRef.current) {
            setBound(i);
            setComparisons(prev => prev + 1);
            await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));
            i *= 2; // Double the bound
        }

        // Binary search phase within the found range
        let l = Math.floor(i / 2);
        let h = Math.min(i, n - 1);
        setLow(l);
        setHigh(h);

        while (l <= h && searchingRef.current) {
            const m = Math.floor((l + h) / 2);
            setMid(m);
            setComparisons(prev => prev + 1);
            await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));

            if (tempArray[m] === target) {
                setFoundIndex(m);
                setCompleted(true);
                setSearching(false);
                searchingRef.current = false;
                return;
            } else if (tempArray[m] < target) {
                l = m + 1;
            } else {
                h = m - 1;
            }
        }

        if (searchingRef.current) {
            setFoundIndex(-1); // Not found
            setCompleted(true);
            setSearching(false);
            setBound(-1);
            setLow(-1);
            setHigh(-1);
            setMid(-1);
        }
    };

    const handleStart = () => {
        if (!searching && !completed && target !== null) exponentialSearch();
    };

    const handlePause = () => {
        setSearching(false);
        searchingRef.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleReset = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSearching(false);
        searchingRef.current = false;
        generateRandomArray();
    };

    const handleArraySizeChange = newSize => {
        if (!searching) {
            setArraySize(newSize);
            generateRandomArray();
        }
    };

    // Bar styling
    const getBarColor = index => {
        if (completed && foundIndex === index) return 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/40';
        if (index === mid) return 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-yellow-500/40';
        if (index === bound) return 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/40';
        if (index === low || index === high) return 'bg-gradient-to-t from-teal-600 to-teal-400 shadow-teal-500/40';
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
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex items-center justify-center px-4 py-24 max-sm:py-20 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-7xl bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-600/40 overflow-hidden"
                >
                    <h1 className="text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
                        Exponential Search Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: <FaPlay />, text: 'Start', onClick: handleStart, disabled: searching || completed || target === null, bg: 'bg-emerald-600' },
                            { icon: <FaPause />, text: 'Pause', onClick: handlePause, disabled: !searching, bg: 'bg-amber-600' },
                            { icon: <FaRedo />, text: 'Reset', onClick: handleReset, bg: 'bg-rose-600' },
                            { icon: <FaRandom />, text: 'Random', onClick: generateRandomArray, disabled: searching, bg: 'bg-purple-600' },
                            { icon: <FaEdit />, text: 'Custom', onClick: () => setShowInputModal(true), disabled: searching, bg: 'bg-teal-600' },
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
                                disabled={searching}
                                className="w-full accent-purple-500 cursor-pointer"
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
                                className="w-full accent-purple-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{speed}%</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <FaSearch /> Target
                            </label>
                            <div className="bg-gray-700 p-3 rounded-lg text-center text-white font-mono">
                                {target !== null ? target : 'Not Set'}
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: 'Comparisons', value: comparisons, color: 'text-cyan-400' },
                            { label: 'Status', value: completed ? (foundIndex >= 0 ? 'Found' : 'Not Found') : searching ? 'Searching' : 'Idle', color: completed ? (foundIndex >= 0 ? 'text-emerald-400' : 'text-red-400') : searching ? 'text-amber-400' : 'text-gray-400' },
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
                        {array.map((value, index) => (
                            <motion.div
                                key={index}
                                className={`${getBarColor(index)} rounded-t-xl shadow-lg relative flex items-center justify-center transition-all duration-300`}
                                style={{ height: getBarHeight(value), width: getBarWidth(), maxWidth: '50px', minWidth: '8px' }}
                                animate={{
                                    y: [bound, low, high, mid].includes(index) ? -15 : 0,
                                    scale: [bound, low, high, mid].includes(index) ? 1.05 : 1,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                {array.length <= 30 && (
                                    <span className="text-white text-xs font-mono font-bold absolute top-2 left-1/2 transform -translate-x-1/2 drop-shadow-lg">
                                        {value}
                                    </span>
                                )}
                                {index === bound && <span className="absolute -top-8 text-cyan-400 text-xs">Bound</span>}
                                {index === low && <span className="absolute -top-8 text-teal-400 text-xs">Low</span>}
                                {index === mid && <span className="absolute -top-8 text-yellow-400 text-xs">Mid</span>}
                                {index === high && <span className="absolute -top-8 text-teal-400 text-xs">High</span>}
                            </motion.div>
                        ))}
                    </div>

                    <ExponentialSearchExplanation />

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
                                    <p className="text-gray-300 text-sm mb-4">Enter positive numbers for array (comma-separated, max 50) and a target value.</p>
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

export default ExponentialSearchVisualizer;