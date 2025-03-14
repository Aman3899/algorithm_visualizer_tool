"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiArrowRight } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { FaEdit, FaRedo, FaArrowLeft } from 'react-icons/fa';


class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const LinkedListVisualizer = () => {
    const [head, setHead] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [operation, setOperation] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);

    // Animation variants with enhanced effects
    const nodeVariants = {
        initial: { scale: 0, opacity: 0, y: 50, rotate: -15 },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: { duration: 0.6, type: 'spring', stiffness: 200, damping: 15 },
        },
        exit: { scale: 0, opacity: 0, y: -50, rotate: 15, transition: { duration: 0.4 } },
    };

    const arrowVariants = {
        initial: { opacity: 0, scale: 0.8, x: -10 },
        animate: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } },
    };

    // Insert node at the end
    const insertAtEnd = () => {
        if (!inputValue) return;
        const value = parseInt(inputValue);
        const newNode = new Node(value);
        setOperation(`Inserting ${value} at end`);

        if (!head) {
            setHead(newNode);
        } else {
            let current = head;
            while (current.next) current = current.next;
            current.next = newNode;
        }
        setHead({ ...head });
        setInputValue('');
    };

    // Insert node at the head
    const insertAtHead = () => {
        if (!inputValue) return;
        const value = parseInt(inputValue);
        const newNode = new Node(value);
        setOperation(`Inserting ${value} at head`);

        newNode.next = head;
        setHead(newNode);
        setInputValue('');
    };

    // Delete node by value
    const deleteNode = () => {
        if (!inputValue || !head) return;
        const value = parseInt(inputValue);
        setOperation(`Deleting ${value}`);

        if (head.value === value) {
            setHead(head.next);
        } else {
            let current = head;
            while (current.next && current.next.value !== value) {
                current = current.next;
            }
            if (current.next) current.next = current.next.next;
            setHead({ ...head });
        }
        setInputValue('');
    };

    // Clear the entire list
    const clearList = () => {
        setHead(null);
        setOperation('List cleared');
        setInputValue('');
    };

    // Render linked list as array for visualization
    const renderList = () => {
        const nodes = [];
        let current = head;
        while (current) {
            nodes.push(current.value);
            current = current.next;
        }
        return nodes;
    };

    // Handle custom array input
    const handleCustomArray = () => {
        setInputError('');
        try {
            const inputValues = inputValue.split(/[,;\s]+/).filter(item => item.trim() !== '');
            const parsedArray = inputValues.map(item => {
                const num = parseInt(item.trim());
                if (isNaN(num)) throw new Error(`"${item}" is not a valid number`);
                return num;
            });

            if (parsedArray.length === 0) {
                setInputError('Please enter at least one number');
                return;
            }

            let newHead = null;
            let current = null;
            parsedArray.forEach(value => {
                const newNode = new Node(value);
                if (!newHead) {
                    newHead = newNode;
                    current = newHead;
                } else {
                    current.next = newNode;
                    current = newNode;
                }
            });

            setHead(newHead);
            setOperation(`Loaded custom list: ${parsedArray.join(', ')}`);
            setShowInputModal(false);
            setInputValue('');
        } catch (error) {
            setInputError(error.message || 'Invalid input. Use numbers separated by commas.');
        }
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    React.useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInputModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white px-6 pt-20 pb-12 flex flex-col items-center">
            
            <Navbar />

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-extrabold mt-8 mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tight drop-shadow-lg"
            >
                Linked List Visualizer
            </motion.h1>

            {/* Input and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12 w-full max-w-2xl bg-gray-800/90 p-8 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-lg"
            >
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-700/70 border border-purple-500/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner text-lg"
                    placeholder="Enter a number"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={insertAtHead}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaArrowLeft /> Head
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={insertAtEnd}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiPlus /> End
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={deleteNode}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-pink-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiTrash /> Delete
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearList}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaRedo /> Clear
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInputModal(true)}
                        className="col-span-2 sm:col-span-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaEdit /> Custom List
                    </motion.button>
                </div>
            </motion.div>

            {/* Visualization Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-6xl bg-gray-800/80 p-10 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-3xl font-semibold mb-8 text-purple-300 drop-shadow-md">Linked List</h2>
                <div className="flex flex-wrap gap-10 items-center justify-center">
                    <AnimatePresence>
                        {renderList().length > 0 ? (
                            renderList().map((value, index) => (
                                <motion.div
                                    key={index}
                                    variants={nodeVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="flex items-center gap-6"
                                >
                                    <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-700 rounded-full text-white font-bold text-xl shadow-lg shadow-purple-500/40 border-2 border-purple-500/60 hover:shadow-xl transition-all duration-300">
                                        {value}
                                    </div>
                                    {index < renderList().length - 1 && (
                                        <motion.div
                                            variants={arrowVariants}
                                            initial="initial"
                                            animate="animate"
                                            className="text-purple-400"
                                        >
                                            <FiArrowRight size={36} />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400 text-xl font-medium"
                            >
                                List is empty. Add a node to visualize!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Operation Log */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 w-full max-w-6xl bg-gray-800/80 p-8 rounded-3xl border border-pink-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-3xl font-semibold mb-4 text-pink-300 drop-shadow-md">Operation Log</h2>
                <p className="text-gray-200 text-lg font-medium">{operation || 'No operations yet.'}</p>
            </motion.div>

            {/* Custom Input Modal */}
            <AnimatePresence>
                {showInputModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.85, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: 20 }}
                            transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
                            className="bg-gray-800 p-8 rounded-3xl w-full max-w-md border border-indigo-500/40 shadow-2xl backdrop-blur-lg"
                        >
                            <h3 className="text-2xl font-semibold text-indigo-300 mb-6 drop-shadow-md">Load Custom Linked List</h3>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter numbers separated by commas (e.g., 5, 10, 15)"
                                className="w-full p-4 bg-gray-700/70 rounded-xl border border-indigo-500/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-inner text-lg"
                                rows="5"
                            />
                            {inputError && <p className="text-red-400 text-sm mt-3">{inputError}</p>}
                            <div className="flex justify-end gap-4 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowInputModal(false)}
                                    className="px-6 py-3 bg-gray-600 rounded-xl text-white font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCustomArray}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-white font-semibold hover:brightness-110 transition-all duration-300 shadow-md"
                                >
                                    Load
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LinkedListVisualizer; // Ensure default export for Next.js App Router