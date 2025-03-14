"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaEdit, FaLink, FaExchangeAlt, FaInfo } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BucketSortExplanation from '@/components/sorting/bucket_explanation';

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
    const [showLinkedList, setShowLinkedList] = useState(false);
    const [linkedListBuckets, setLinkedListBuckets] = useState([]);
    const [activeTab, setActiveTab] = useState('explanation');
    const [showAlgoModal, setShowAlgoModal] = useState(false);

    const timeoutRef = useRef(null);
    const sortingRef = useRef(false);
    const modalRef = useRef(null);
    const algoModalRef = useRef(null);

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
        setLinkedListBuckets([]);
        setBucketIndex(-1);
        setElementInBucketIndex(-1);
    };

    useEffect(() => {
        generateRandomArray();
    }, []);

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInputModal]);

    useEffect(() => {
        if (showAlgoModal) {
            document.addEventListener('mousedown', handleAlgoModalClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleAlgoModalClickOutside);
    }, [showAlgoModal]);

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    const handleAlgoModalClickOutside = (e) => {
        if (algoModalRef.current && !algoModalRef.current.contains(e.target)) {
            setShowAlgoModal(false);
        }
    };

    useEffect(() => {
        sortingRef.current = sorting;
    }, [sorting]);

    // Create linked list representation of buckets
    const createLinkedListBuckets = (bucketArray) => {
        return bucketArray.map(bucket => {
            if (bucket.length === 0) return [];
            const linkedList = bucket.map((value, index) => ({
                value,
                next: index < bucket.length - 1 ? index + 1 : null,
                highlighted: false,
            }));
            return linkedList;
        });
    };

    // Bucket Sort implementation
    const bucketSort = async () => {
        let tempArray = [...array];
        let localSwaps = 0;
        let localComparisons = 0;

        setSorting(true);
        sortingRef.current = true;

        const numBuckets = Math.min(arraySize, 10);
        const newBuckets = Array(numBuckets).fill().map(() => []);

        // 1. Distribute elements into buckets
        for (let i = 0; i < tempArray.length && sortingRef.current; i++) {
            const value = tempArray[i];
            const bIdx = Math.floor(value * numBuckets);
            newBuckets[bIdx].push(value);

            setBuckets([...newBuckets]);
            setLinkedListBuckets(createLinkedListBuckets([...newBuckets]));
            setBucketIndex(bIdx);
            setCurrentIndices([i]);
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
                    const updatedLinkedListBuckets = [...createLinkedListBuckets([...newBuckets])];
                    if (updatedLinkedListBuckets[i] && updatedLinkedListBuckets[i][k]) {
                        updatedLinkedListBuckets[i][k].highlighted = true;
                    }
                    if (updatedLinkedListBuckets[i] && updatedLinkedListBuckets[i][k + 1]) {
                        updatedLinkedListBuckets[i][k + 1].highlighted = true;
                    }
                    setLinkedListBuckets(updatedLinkedListBuckets);
                    await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));

                    bucket[k + 1] = bucket[k];
                    k--;
                    newBuckets[i] = [...bucket];
                    setBuckets([...newBuckets]);
                    setSwaps(++localSwaps);
                    setLinkedListBuckets(createLinkedListBuckets([...newBuckets]));
                    await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));
                }
                bucket[k + 1] = key;
                newBuckets[i] = [...bucket];
                setBuckets([...newBuckets]);
                setLinkedListBuckets(createLinkedListBuckets([...newBuckets]));
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
                const updatedLinkedListBuckets = [...createLinkedListBuckets([...newBuckets])];
                if (updatedLinkedListBuckets[i] && updatedLinkedListBuckets[i][j]) {
                    updatedLinkedListBuckets[i][j].highlighted = true;
                }
                setLinkedListBuckets(updatedLinkedListBuckets);
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

    const handleArraySizeChange = (newSize) => {
        if (!sorting) {
            setArraySize(newSize);
            generateRandomArray();
        }
    };

    const toggleVisualization = () => {
        setShowLinkedList(!showLinkedList);
    };

    // Bar styling
    const getBarColor = (index) => {
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

    const getBarHeight = (value) => {
        const maxHeight = 90;
        const minHeight = 5;
        return `${Math.min(value * (maxHeight - minHeight) + minHeight, maxHeight)}%`;
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
                        <h1 className="text-5xl font-extrabold text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
                            Bucket Sort Visualizer
                        </h1>
                        <div className="mt-4 md:mt-0 flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleVisualization}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl text-base font-semibold ${showLinkedList ? 'bg-pink-600' : 'bg-indigo-600'} hover:brightness-125 transition-all duration-300`}
                            >
                                <FaExchangeAlt /> {showLinkedList ? 'Show Array' : 'Show Linked List'}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAlgoModal(true)}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl text-base font-semibold bg-blue-600 hover:brightness-125 transition-all duration-300"
                            >
                                <FaInfo /> Algorithm Details
                            </motion.button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStart}
                            disabled={sorting || completed}
                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-base font-semibold disabled:opacity-50 hover:brightness-125 transition-all duration-300"
                        >
                            <FaPlay /> Start
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePause}
                            disabled={!sorting}
                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-base font-semibold disabled:opacity-50 hover:brightness-125 transition-all duration-300"
                        >
                            <FaPause /> Pause
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded-xl text-base font-semibold hover:brightness-125 transition-all duration-300"
                        >
                            <FaRedo /> Reset
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateRandomArray}
                            disabled={sorting}
                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-base font-semibold disabled:opacity-50 hover:brightness-125 transition-all duration-300"
                        >
                            <FaRandom /> Randomize
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowInputModal(true)}
                            disabled={sorting}
                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-base font-semibold disabled:opacity-50 hover:brightness-125 transition-all duration-300"
                        >
                            <FaEdit /> Custom Input
                        </motion.button>
                        <div className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-xl">
                            <MdSpeed className="text-indigo-400" />
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={(e) => setSpeed(e.target.value)}
                                disabled={sorting}
                                className="w-full accent-indigo-500"
                            />
                            <span className="text-sm text-gray-300">{speed}ms</span>
                        </div>
                    </div>

                    {/* Visualization Area */}
                    {!showLinkedList ? (
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Array Visualization</h2>
                            <div className="flex justify-center items-end h-96 bg-gray-900/50 rounded-xl p-4 border border-indigo-500/30">
                                {array.map((value, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ height: 0 }}
                                        animate={{ height: getBarHeight(value) }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-end justify-center mx-1 rounded-t-lg shadow-lg ${getBarColor(index)}`}
                                        style={{ width: getBarWidth(), height: getBarHeight(value) }}
                                    >
                                        <span className="text-xs text-white font-medium">{value.toFixed(2)}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-purple-300 mb-4">Linked List Buckets</h2>
                            <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/30">
                                {linkedListBuckets.map((bucket, bIdx) => (
                                    <div key={bIdx} className="mb-4">
                                        <h3 className="text-lg font-medium text-purple-400">Bucket {bIdx}</h3>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            {bucket.length > 0 ? (
                                                bucket.map((node, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div
                                                            className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-semibold ${node.highlighted ? 'bg-gradient-to-t from-cyan-600 to-cyan-400' : getBucketBarColor(bIdx, idx)}`}
                                                        >
                                                            {node.value.toFixed(2)}
                                                        </div>
                                                        {node.next !== null && (
                                                            <FaLink className="text-purple-400" />
                                                        )}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400">Empty</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buckets Visualization */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Buckets</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-gray-900/50 rounded-xl p-4 border border-purple-500/30">
                            {buckets.map((bucket, bIdx) => (
                                <div key={bIdx} className="flex flex-col items-center">
                                    <span className="text-sm text-purple-400 mb-2">Bucket {bIdx}</span>
                                    <div className="flex flex-wrap gap-2">
                                        {bucket.map((value, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`w-10 h-10 flex items-center justify-center rounded-md text-white font-medium ${getBucketBarColor(bIdx, idx)}`}
                                            >
                                                {value.toFixed(2)}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-700/50 rounded-xl flex items-center gap-3">
                            <FaChartBar className="text-indigo-400" />
                            <div>
                                <p className="text-sm text-gray-300">Comparisons</p>
                                <p className="text-lg font-semibold text-white">{comparisons}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-700/50 rounded-xl flex items-center gap-3">
                            <FaExchangeAlt className="text-purple-400" />
                            <div>
                                <p className="text-sm text-gray-300">Swaps</p>
                                <p className="text-lg font-semibold text-white">{swaps}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-700/50 rounded-xl flex items-center gap-3">
                            <MdSpeed className="text-teal-400" />
                            <div>
                                <p className="text-sm text-gray-300">Speed</p>
                                <p className="text-lg font-semibold text-white">{speed}ms</p>
                            </div>
                        </div>
                    </div>

                    {/* Custom Input Modal */}
                    <AnimatePresence>
                        {showInputModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    ref={modalRef}
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-indigo-500/30"
                                >
                                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">Custom Array Input</h3>
                                    <textarea
                                        value={customInput}
                                        onChange={(e) => setCustomInput(e.target.value)}
                                        placeholder="Enter numbers (0-1) separated by commas, spaces, or semicolons"
                                        className="w-full p-3 bg-gray-700 rounded-lg border border-indigo-500/30 text-white focus:outline-none focus:border-indigo-500"
                                        rows="4"
                                    />
                                    {inputError && <p className="text-red-400 text-sm mt-2">{inputError}</p>}
                                    <div className="flex justify-end gap-3 mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowInputModal(false)}
                                            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCustomArray}
                                            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                        >
                                            Apply
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Algorithm Details Modal */}
                    <AnimatePresence>
                        {showAlgoModal && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    ref={algoModalRef}
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    className="bg-gray-800 p-6 rounded-xl w-full max-w-4xl border border-blue-500/30 overflow-y-auto max-h-[80vh]"
                                >
                                    <h3 className="text-xl font-semibold text-blue-300 mb-4">Bucket Sort Details</h3>
                                    <BucketSortExplanation />
                                    <div className="flex justify-end mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowAlgoModal(false)}
                                            className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                                        >
                                            Close
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