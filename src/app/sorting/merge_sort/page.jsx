"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaEdit } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BubbleSortExplanation from '@/components/sorting/bubble_explanation';
import MergeSortExplanation from '@/components/sorting/merge_explanation';

const MergeSortVisualizer = () => {
    const [array, setArray] = useState([]);
    const [arraySize, setArraySize] = useState(16);
    const [sorting, setSorting] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [currentIndices, setCurrentIndices] = useState([]);
    const [mergeTree, setMergeTree] = useState([]); // Array of levels, each containing nodes
    const [comparisons, setComparisons] = useState(0);
    const [merges, setMerges] = useState(0);
    const [customInput, setCustomInput] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');

    const timeoutRef = useRef(null);
    const sortingRef = useRef(false);
    const modalRef = useRef(null);

    // Generate random array
    const generateRandomArray = () => {
        const newArray = Array.from({ length: arraySize }, () =>
            Math.floor(Math.random() * 96) + 5
        );
        setArray(newArray);
        resetState();
    };

    // Handle custom array input
    const handleCustomArray = () => {
        setInputError('');
        const parsedArray = customInput
            .split(/[,;\s]+/)
            .filter(item => item.trim() !== '')
            .map(item => {
                const num = Number(item.trim());
                if (isNaN(num) || num < 0) throw new Error(`"${item}" is not a valid positive number`);
                return Math.round(num);
            });

        if (parsedArray.length === 0) {
            setInputError('Please enter at least one number');
            return;
        }
        if (parsedArray.length > 32) {
            setInputError('Maximum 32 elements allowed');
            return;
        }

        setArray(parsedArray);
        setArraySize(parsedArray.length);
        resetState();
        setShowInputModal(false);
        setCustomInput('');
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setComparisons(0);
        setMerges(0);
        setCurrentIndices([]);
        setMergeTree([]);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        sortingRef.current = sorting;
    }, [sorting]);

    // Merge Sort implementation
    const mergeSort = async (arr, start = 0, end = arr.length - 1, level = 0) => {
        if (!sortingRef.current || start >= end) {
            return arr.slice(start, end + 1);
        }

        const mid = Math.floor((start + end) / 2);
        setCurrentIndices([start, mid, end]);
        await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));

        const left = await mergeSort(arr, start, mid, level + 1);
        const right = await mergeSort(arr, mid + 1, end, level + 1);

        // Merge
        const merged = [];
        let i = 0,
            j = 0;
        while (i < left.length && j < right.length) {
            setComparisons(prev => prev + 1);
            setCurrentIndices([start + i, mid + 1 + j]);
            if (left[i] <= right[j]) {
                merged.push(left[i++]);
            } else {
                merged.push(right[j++]);
            }
            await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));
        }

        merged.push(...left.slice(i), ...right.slice(j));
        for (let k = 0; k < merged.length; k++) {
            arr[start + k] = merged[k];
        }
        setArray([...arr]);
        setMerges(prev => prev + 1);

        // Update merge tree safely
        setMergeTree(prev => {
            const newTree = [...prev];
            // Ensure the level exists
            if (!newTree[level]) newTree[level] = [];
            newTree[level].push({ start, end, values: [...merged] });
            return newTree;
        });

        return merged;
    };

    const handleStart = async () => {
        if (!sorting && !completed) {
            setSorting(true);
            sortingRef.current = true;
            await mergeSort([...array]);
            if (sortingRef.current) {
                setCompleted(true);
                setSorting(false);
                setCurrentIndices([]);
            }
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

    // Bar styling
    const getBarColor = (index) => {
        if (completed) return 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-500/40';
        if (currentIndices.includes(index)) {
            return 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-cyan-500/40';
        }
        return 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-indigo-500/40';
    };

    const getBarWidth = () => Math.max(100 / array.length, 1) + '%';
    const getBarHeight = value => {
        const maxHeight = 80;
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
                    className="w-full max-w-7xl bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-indigo-600/40"
                >
                    <h1 className="text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Merge Sort Visualizer
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
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl ${btn.bg} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125'}`}
                            >
                                {btn.icon} {btn.text}
                            </motion.button>
                        ))}
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                                <FaChartBar /> Size
                            </label>
                            <input
                                type="range"
                                min="4"
                                max="32"
                                value={arraySize}
                                onChange={e => !sorting && (setArraySize(parseInt(e.target.value)), generateRandomArray())}
                                disabled={sorting}
                                className="w-full accent-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                                <MdSpeed /> Speed
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={e => setSpeed(parseInt(e.target.value))}
                                className="w-full accent-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-6 mb-10">
                        <div className="bg-gray-700/70 p-5 rounded-xl">
                            <span className="font-semibold">Comparisons: </span>
                            <span className="text-cyan-400 font-bold">{comparisons}</span>
                        </div>
                        <div className="bg-gray-700/70 p-5 rounded-xl">
                            <span className="font-semibold">Merges: </span>
                            <span className="text-rose-400 font-bold">{merges}</span>
                        </div>
                        <div className="bg-gray-700/70 p-5 rounded-xl">
                            <span className="font-semibold">Status: </span>
                            <span className={completed ? 'text-emerald-400' : sorting ? 'text-amber-400' : 'text-gray-400'}>
                                {completed ? 'Sorted' : sorting ? 'Sorting' : 'Idle'}
                            </span>
                        </div>
                    </div>

                    {/* Array Visualization */}
                    <div className="bg-gray-700/70 rounded-3xl p-6 h-60 flex items-end justify-center gap-2 overflow-x-auto border border-indigo-600/40 mb-10">
                        {array.map((value, index) => (
                            <motion.div
                                key={index}
                                className={`${getBarColor(index)} rounded-t-xl shadow-lg relative`}
                                style={{ height: getBarHeight(value), width: getBarWidth() }}
                                animate={{ y: currentIndices.includes(index) ? -10 : 0 }}
                            >
                                {array.length <= 16 && (
                                    <span className="text-white text-xs font-mono absolute top-1 left-1/2 -translate-x-1/2">{value}</span>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Enhanced Merge Tree Visualization */}
                    {mergeTree.length > 0 && (
                        <div className="bg-gray-700/70 rounded-3xl p-6 border border-indigo-600/40 overflow-x-auto">
                            <h3 className="text-xl font-semibold text-indigo-300 mb-6">Merge Tree (Divide & Conquer)</h3>
                            <div className="space-y-8">
                                {mergeTree.map((level, levelIdx) => (
                                    level && ( // Guard clause to ensure level is defined
                                        <div key={levelIdx} className="flex flex-col items-center">
                                            <span className="text-sm text-gray-400 mb-2">Level {levelIdx}</span>
                                            <div className="flex flex-wrap gap-6 justify-center">
                                                {level.map((node, nodeIdx) => (
                                                    <motion.div
                                                        key={nodeIdx}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="relative bg-gradient-to-br from-indigo-800 to-indigo-600 p-4 rounded-xl shadow-lg border border-indigo-400/50"
                                                    >
                                                        {/* Connector Line */}
                                                        {levelIdx > 0 && (
                                                            <div className="absolute -top-6 left-1/2 w-px h-6 bg-indigo-400/50" />
                                                        )}
                                                        <div className="text-xs text-gray-200 mb-2">
                                                            [{node.start}-{node.end}]
                                                        </div>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {node.values.map((val, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="bg-indigo-500/80 text-white text-xs px-2 py-1 rounded-full shadow-md"
                                                                >
                                                                    {val}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    <MergeSortExplanation />

                    {/* Custom Input Modal */}
                    <AnimatePresence>
                        {showInputModal && (
                            <motion.div
                                className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    ref={modalRef}
                                    className="bg-gray-800 rounded-3xl p-6 w-full max-w-lg border border-indigo-600/40"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                >
                                    <h2 className="text-3xl font-bold mb-4 text-indigo-400">Custom Array Input</h2>
                                    <input
                                        type="text"
                                        value={customInput}
                                        onChange={e => setCustomInput(e.target.value)}
                                        placeholder="e.g., 10, 20, 30"
                                        className="w-full p-4 bg-gray-700 rounded-lg text-white border border-indigo-600/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {inputError && <p className="text-rose-400 text-sm mt-2">{inputError}</p>}
                                    <p className="text-gray-300 text-sm mt-2 mb-4">Enter positive numbers (max 32)</p>
                                    <div className="flex gap-4 justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => setShowInputModal(false)}
                                            className="bg-rose-600 hover:brightness-125 text-white py-2 px-4 rounded-lg"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={handleCustomArray}
                                            className="bg-teal-600 hover:brightness-125 text-white py-2 px-4 rounded-lg"
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

export default MergeSortVisualizer;