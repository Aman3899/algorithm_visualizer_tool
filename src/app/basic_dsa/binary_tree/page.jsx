"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget, FiCopy, FiShare2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar'; // Assuming Navbar exists
import { FaEdit, FaRedo, FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { toast } from 'react-hot-toast';

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

const BSTVisualizer = () => {
    const [root, setRoot] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [operation, setOperation] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);

    // BST pseudocode
    const pseudocode = `BinarySearchTree:
    insert(value):
        if root is null:
            root = new Node(value)
        else:
            node = root
            while true:
                if value < node.value:
                    if node.left is null:
                        node.left = new Node(value)
                        break
                    node = node.left
                else if value > node.value:
                    if node.right is null:
                        node.right = new Node(value)
                        break
                    node = node.right

    delete(value):
        if root is null:
            return
        node = root, parent = null
        while node and node.value != value:
            parent = node
            node = value < node.value ? node.left : node.right
        if node is null:
            return
        if node.left is null:
            child = node.right
        else if node.right is null:
            child = node.left
        else:
            successor = node.right
            while successor.left:
                successor = successor.left
            node.value = successor.value
            delete(successor.value from node.right)
            return
        if parent is null:
            root = child
        else if parent.left === node:
            parent.left = child
        else:
            parent.right = child`;

    // Copy pseudocode to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(pseudocode);
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl shadow-lg border border-green-500/30"
            >
                <FaRegCheckCircle className="text-green-400" size={18} />
                <span className="font-medium">Pseudocode copied to clipboard!</span>
            </motion.div>
        ), { duration: 2000 });
    };

    // Share pseudocode (simulated)
    const handleShare = () => {
        const shareUrl = `https://example.com/share?text=${encodeURIComponent(pseudocode)}`;
        window.open(shareUrl, '_blank');
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-900 to-teal-900 text-white rounded-xl shadow-lg border border-green-500/30"
            >
                <FaRegCheckCircle className="text-green-400" size={18} />
                <span className="font-medium">Share link generated!</span>
            </motion.div>
        ), { duration: 2000 });
    };

    // Animation variants
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // Insert into BST
    const insertNode = (node, value) => {
        if (!node) return new Node(value);
        const newNode = JSON.parse(JSON.stringify(node)); // Deep copy to avoid mutating state directly
        let current = newNode;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = new Node(value);
                    break;
                }
                current = current.left;
            } else if (value > current.value) {
                if (!current.right) {
                    current.right = new Node(value);
                    break;
                }
                current = current.right;
            } else {
                break; // Duplicate values ignored
            }
        }
        return newNode;
    };

    const handleInsert = () => {
        if (!inputValue) return;
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setInputError("Please enter a valid number.");
            return;
        }
        setOperation(`Inserting ${value}`);
        setRoot(prevRoot => insertNode(prevRoot, value) || prevRoot);
        setInputValue('');
        setInputError('');
    };

    // Delete from BST
    const deleteNode = (node, value) => {
        if (!node) return null;

        const newNode = JSON.parse(JSON.stringify(node)); // Deep copy
        const deleteRec = (current, val, parent = null) => {
            if (!current) return;

            if (val < current.value) {
                current.left = deleteRec(current.left, val, current);
            } else if (val > current.value) {
                current.right = deleteRec(current.right, val, current);
            } else {
                if (!current.left) return current.right;
                if (!current.right) return current.left;

                let successor = current.right;
                while (successor.left) successor = successor.left;
                current.value = successor.value;
                current.right = deleteRec(current.right, successor.value, current);
            }
            return current;
        };

        return deleteRec(newNode, value);
    };

    const handleDelete = () => {
        if (!inputValue || !root) return;
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setInputError("Please enter a valid number.");
            return;
        }
        setOperation(`Deleting ${value}`);
        setRoot(prevRoot => deleteNode(prevRoot, value));
        setInputValue('');
        setInputError('');
    };

    // Clear the BST
    const clearBST = () => {
        setRoot(null);
        setOperation('BST cleared');
        setInputValue('');
    };

    // Handle custom BST input
    const handleCustomBST = () => {
        setInputError('');
        try {
            const inputValues = inputValue.split(/[,;\s]+/).filter(item => item.trim() !== '');
            const parsedValues = inputValues.map(item => {
                const num = parseInt(item.trim());
                if (isNaN(num)) throw new Error(`"${item}" is not a valid number`);
                return num;
            });

            if (parsedValues.length === 0) {
                setInputError('Please enter at least one number');
                return;
            }

            let newRoot = null;
            parsedValues.forEach(value => {
                newRoot = insertNode(newRoot, value);
            });

            setRoot(newRoot);
            setOperation(`Loaded custom BST: ${parsedValues.join(', ')}`);
            setShowInputModal(false);
            setInputValue('');
        } catch (error) {
            setInputError(error.message || 'Invalid input. Use numbers separated by commas.');
        }
    };

    // Render BST as a tree structure
    const renderTree = (node, level = 0) => {
        if (!node) return null;

        const spacing = Math.max(50, 300 / (level + 1)); // Dynamic spacing with minimum
        return (
            <motion.div
                key={node.value + level}
                variants={nodeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center relative"
            >
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-green-600 to-teal-600 rounded-full text-white font-bold text-lg shadow-lg shadow-green-500/40 border-2 border-green-500/60 hover:shadow-xl transition-all duration-300 z-10">
                    {node.value}
                </div>
                {(node.left || node.right) && (
                    <div className="flex justify-center w-full mt-4 gap-4">
                        {node.left && (
                            <div className="relative flex-1 flex justify-end">
                                <div className="absolute top-0 left-1/2 w-1/2 h-12 border-t-2 border-l-2 border-green-400 transform -translate-x-1/2"></div>
                                <div style={{ marginRight: spacing / 2 + 'px' }}>{renderTree(node.left, level + 1)}</div>
                            </div>
                        )}
                        {node.right && (
                            <div className="relative flex-1 flex justify-start">
                                <div className="absolute top-0 right-1/2 w-1/2 h-12 border-t-2 border-r-2 border-green-400 transform translate-x-1/2"></div>
                                <div style={{ marginLeft: spacing / 2 + 'px' }}>{renderTree(node.right, level + 1)}</div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        );
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    useEffect(() => {
        if (showInputModal) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInputModal]);

    // Tabs data
    const tabs = [
        { id: 'details', label: 'Key Details', icon: <FiInfo size={18} /> },
        { id: 'code', label: 'Pseudocode', icon: <FiCode size={18} /> },
        { id: 'applications', label: 'Applications', icon: <BsGraphUp size={18} /> },
        { id: 'learn', label: 'Learn More', icon: <IoMdSchool size={18} /> },
    ];

    // Application examples
    const applications = [
        { title: 'Efficient Searching', description: 'Quickly find values in sorted data.', icon: <FiTarget size={20} className="text-green-400" /> },
        { title: 'Ordered Storage', description: 'Maintains data in sorted order.', icon: <BsGraphUp size={20} className="text-teal-400" /> },
        { title: 'Symbol Tables', description: 'Used in compilers for variable tracking.', icon: <FiLayers size={20} className="text-cyan-400" /> },
        { title: 'Database Indexing', description: 'Speeds up queries with indexes.', icon: <FiCpu size={20} className="text-blue-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'Interactive BST Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/BST.html', description: 'See BST operations step-by-step.' },
        { title: 'BST Interview Questions', url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/', description: 'Practice common BST problems.' },
        { title: 'BST vs Other Trees', url: 'https://www.geeksforgeeks.org/binary-search-tree-vs-avl-tree/', description: 'Compare BST with AVL, Red-Black, etc.' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 text-white px-6 pt-20 pb-12 flex flex-col items-center overflow-x-hidden">
            <Navbar />

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-extrabold mt-8 mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 tracking-tight drop-shadow-lg text-center"
            >
                Binary Search Tree Visualizer
            </motion.h1>

            {/* Input and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12 w-full max-w-lg bg-gray-800/90 p-8 rounded-3xl border border-green-500/30 shadow-2xl backdrop-blur-lg"
            >
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-700/70 border border-green-500/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-inner text-lg"
                    placeholder="Enter a number"
                />
                {inputError && <p className="text-red-400 text-sm mt-2">{inputError}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleInsert}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-700 to-teal-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiPlus /> Insert
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-orange-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiTrash /> Delete
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearBST}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaRedo /> Clear
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInputModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-700 to-green-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaEdit /> Custom
                    </motion.button>
                </div>
            </motion.div>

            {/* Visualization Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-6xl bg-gray-800/80 p-10 rounded-3xl border border-green-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-3xl font-semibold mb-8 text-green-300 drop-shadow-md">Binary Search Tree</h2>
                <div className="flex justify-center min-h-[400px] overflow-x-auto py-4">
                    <AnimatePresence>
                        {root ? (
                            renderTree(root)
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-400 text-xl font-medium"
                            >
                                BST is empty. Insert nodes to visualize!
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
                className="mt-12 w-full max-w-6xl bg-gray-800/80 p-8 rounded-3xl border border-teal-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-3xl font-semibold mb-4 text-teal-300 drop-shadow-md">Operation Log</h2>
                <p className="text-gray-200 text-lg font-medium">{operation || 'No operations yet.'}</p>
            </motion.div>

            {/* Explanation Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 w-full max-w-6xl bg-gray-800/80 p-8 rounded-3xl border border-green-500/30 shadow-2xl backdrop-blur-lg"
            >
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className="mb-4 p-4 rounded-full bg-gradient-to-br from-green-600 to-teal-600 shadow-lg shadow-green-600/30"
                    >
                        <FiInfo className="text-white text-3xl" />
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 tracking-tight"
                    >
                        BST Explained
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-lg leading-relaxed text-center max-w-3xl font-light">
                            A <span className="text-green-300 font-semibold">Binary Search Tree</span> organizes data hierarchically, ensuring that for any node, all values in the left subtree are less than the node’s value, and all values in the right subtree are greater.
                        </p>
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-teal-900/90 text-green-200 rounded-lg shadow-lg text-sm max-w-xs text-center"
                                >
                                    <FaRegLightbulb className="inline-block mr-2 text-yellow-300" size={16} />
                                    Efficient for searching, but balance is key!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Tabs Navigation */}
                <div className="mb-8">
                    <div className="flex overflow-x-auto space-x-2 p-1 bg-gray-800/50 rounded-xl backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg shadow-green-700/30' : 'text-gray-300 hover:bg-gray-700/50'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'details' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-green-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-green-300 flex items-center">
                                        <FiInfo className="mr-3 text-green-400" size={20} />
                                        Characteristics
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            { icon: <FiClock size={20} />, label: 'Time Complexity (Avg)', value: 'O(log n)', color: 'text-green-400' },
                                            { icon: <FiClock size={20} />, label: 'Time Complexity (Worst)', value: 'O(n)', color: 'text-green-400' },
                                            { icon: <FiLayers size={20} />, label: 'Space Complexity', value: 'O(n)', color: 'text-teal-400' },
                                            { icon: <FiCpu size={20} />, label: 'Ordering', value: 'Sorted', color: 'text-cyan-400' },
                                        ].map((item, idx) => (
                                            <motion.li
                                                key={idx}
                                                variants={itemVariants}
                                                className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition duration-300"
                                            >
                                                <div className="p-2 rounded-lg bg-gray-700/70 text-green-400">{item.icon}</div>
                                                <div>
                                                    <span className="block text-sm text-gray-400">{item.label}</span>
                                                    <span className={`text-lg font-semibold ${item.color}`}>{item.value}</span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-green-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-green-300 flex items-center">
                                        <BsGraphUp className="mr-3 text-green-400" size={20} />
                                        Properties
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            "Left subtree < Node < Right subtree",
                                            "Efficient binary search operations",
                                            "Hierarchical structure",
                                            "Performance depends on balance",
                                        ].map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3">
                                                <div className="mt-1 min-w-[8px] h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                                                <p className="text-gray-200">{item}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        )}
                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-teal-500/30">
                                    <h3 className="text-2xl font-semibold mb-4 text-teal-300 flex items-center">
                                        <FiCode className="mr-3 text-teal-400" size={20} />
                                        Pseudocode
                                    </h3>
                                    <pre className="font-mono text-sm md:text-base text-gray-200 whitespace-pre-wrap bg-gray-700/30 p-4 rounded-lg overflow-x-auto">
                                        {pseudocode}
                                    </pre>
                                </motion.div>
                                <div className="flex justify-end gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                                    >
                                        <FiCopy size={16} /> Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
                                    >
                                        <FiShare2 size={16} /> Share
                                    </motion.button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'applications' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h3 className="text-2xl font-semibold mb-4 text-green-300">Common Applications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {applications.map((app, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-teal-500/30 hover:border-teal-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center mb-3">
                                                {app.icon}
                                                <h4 className="text-lg font-semibold text-white ml-2">{app.title}</h4>
                                            </div>
                                            <p className="text-gray-200">{app.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'learn' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h3 className="text-2xl font-semibold mb-4 text-teal-300">Learning Resources</h3>
                                {resources.map((resource, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-teal-500/30 hover:border-teal-500/50 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3">
                                            <IoMdSchool className="text-xl text-cyan-400 mt-1" />
                                            <div>
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white hover:text-cyan-300 transition-colors">
                                                    {resource.title}
                                                </a>
                                                <p className="text-gray-300">{resource.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
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
                            className="bg-gray-800 p-8 rounded-3xl w-full max-w-md border border-cyan-500/40 shadow-2xl backdrop-blur-lg"
                        >
                            <h3 className="text-2xl font-semibold text-cyan-300 mb-6 drop-shadow-md">Load Custom BST</h3>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter numbers separated by commas (e.g., 5, 10, 15)"
                                className="w-full p-4 bg-gray-700/70 rounded-xl border border-cyan-500/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 shadow-inner text-lg"
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
                                    onClick={handleCustomBST}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-green-700 rounded-xl text-white font-semibold hover:brightness-110 transition-all duration-300 shadow-md"
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

export default BSTVisualizer;