"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget, FiCopy, FiShare2, FiSearch } from 'react-icons/fi';
import Navbar from '@/components/Navbar'; // Assuming Navbar exists
import { FaEdit, FaRedo, FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { toast } from 'react-hot-toast';

class BTreeNode {
    constructor(leaf = true) {
        this.keys = [];
        this.children = [];
        this.leaf = leaf;
    }
}

const BTreeVisualizer = () => {
    const [root, setRoot] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [operation, setOperation] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);
    const ORDER = 4; // B-Tree order (max 4 keys per node)

    // B-Tree pseudocode
    const pseudocode = `B-Tree (Order t):
    insert(key):
        if root is null:
            root = new Node(true)
        if root is full:
            newRoot = new Node(false)
            newRoot.children[0] = root
            splitChild(newRoot, 0)
            root = newRoot
        insertNonFull(root, key)

    delete(key):
        if root is null:
            return
        deleteRec(root, key)
        if root.keys.length == 0 and not root.leaf:
            root = root.children[0]

    search(key):
        node = root
        while node:
            i = 0
            while i < node.keys.length and key > node.keys[i]:
                i++
            if i < node.keys.length and key == node.keys[i]:
                return true
            if node.leaf:
                return false
            node = node.children[i]`;

    // Copy pseudocode to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(pseudocode);
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-900 to-amber-900 text-white rounded-xl shadow-lg border border-orange-500/30"
            >
                <FaRegCheckCircle className="text-orange-400" size={18} />
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-900 to-amber-900 text-white rounded-xl shadow-lg border border-orange-500/30"
            >
                <FaRegCheckCircle className="text-orange-400" size={18} />
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

    // B-Tree operations
    const splitChild = (parent, index) => {
        const child = parent.children[index];
        const newNode = new BTreeNode(child.leaf);
        const mid = Math.floor(ORDER / 2);
        newNode.keys = child.keys.splice(mid + 1);
        if (!child.leaf) newNode.children = child.children.splice(mid + 1);
        parent.keys.splice(index, 0, child.keys.pop());
        parent.children.splice(index + 1, 0, newNode);
    };

    const insertNonFull = (node, key) => {
        let i = node.keys.length - 1;
        if (node.leaf) {
            while (i >= 0 && key < node.keys[i]) i--;
            node.keys.splice(i + 1, 0, key);
        } else {
            while (i >= 0 && key < node.keys[i]) i--;
            i++;
            if (node.children[i].keys.length === ORDER - 1) {
                splitChild(node, i);
                if (key > node.keys[i]) i++;
            }
            insertNonFull(node.children[i], key);
        }
    };

    const handleInsert = () => {
        if (!inputValue) return;
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setInputError("Please enter a valid number.");
            return;
        }
        setOperation(`Inserting ${value}`);
        const newRoot = root ? JSON.parse(JSON.stringify(root)) : new BTreeNode(true);
        if (newRoot.keys.length === ORDER - 1) {
            const newParent = new BTreeNode(false);
            newParent.children.push(newRoot);
            splitChild(newParent, 0);
            insertNonFull(newParent, value);
            setRoot(newParent);
        } else {
            insertNonFull(newRoot, value);
            setRoot(newRoot);
        }
        setInputValue('');
        setInputError('');
    };

    const findPredecessor = (node) => {
        while (!node.leaf) node = node.children[node.children.length - 1];
        return node.keys[node.keys.length - 1];
    };

    const merge = (node, index) => {
        const child = node.children[index];
        const sibling = node.children[index + 1];
        child.keys.push(node.keys[index]);
        child.keys = child.keys.concat(sibling.keys);
        if (!child.leaf) child.children = child.children.concat(sibling.children);
        node.keys.splice(index, 1);
        node.children.splice(index + 1, 1);
    };

    const deleteRec = (node, key) => {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) i++;
        if (i < node.keys.length && key === node.keys[i]) {
            if (node.leaf) {
                node.keys.splice(i, 1);
            } else {
                const pred = findPredecessor(node.children[i]);
                node.keys[i] = pred;
                deleteRec(node.children[i], pred);
            }
        } else if (node.leaf) {
            return;
        } else {
            const child = node.children[i];
            if (child.keys.length === Math.ceil(ORDER / 2) - 1) {
                if (i > 0 && node.children[i - 1].keys.length > Math.ceil(ORDER / 2) - 1) {
                    const sibling = node.children[i - 1];
                    child.keys.unshift(node.keys[i - 1]);
                    node.keys[i - 1] = sibling.keys.pop();
                    if (!child.leaf) child.children.unshift(sibling.children.pop());
                } else if (i < node.children.length - 1 && node.children[i + 1].keys.length > Math.ceil(ORDER / 2) - 1) {
                    const sibling = node.children[i + 1];
                    child.keys.push(node.keys[i]);
                    node.keys[i] = sibling.keys.shift();
                    if (!child.leaf) child.children.push(sibling.children.shift());
                } else {
                    if (i > 0) {
                        merge(node, i - 1);
                        deleteRec(node.children[i - 1], key);
                    } else {
                        merge(node, i);
                        deleteRec(node.children[i], key);
                    }
                    return;
                }
            }
            deleteRec(child, key);
        }
    };

    const handleDelete = () => {
        if (!inputValue || !root) return;
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setInputError("Please enter a valid number.");
            return;
        }
        setOperation(`Deleting ${value}`);
        const newRoot = JSON.parse(JSON.stringify(root));
        deleteRec(newRoot, value);
        if (newRoot.keys.length === 0 && !newRoot.leaf) setRoot(newRoot.children[0]);
        else setRoot(newRoot);
        setInputValue('');
        setInputError('');
    };

    const handleSearch = () => {
        if (!inputValue || !root) return;
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setInputError("Please enter a valid number.");
            return;
        }
        let node = root;
        while (node) {
            let i = 0;
            while (i < node.keys.length && value > node.keys[i]) i++;
            if (i < node.keys.length && value === node.keys[i]) {
                setSearchResult(`Found ${value}`);
                setOperation(`Searched for ${value}: Found`);
                break;
            }
            if (node.leaf) {
                setSearchResult(`Not found ${value}`);
                setOperation(`Searched for ${value}: Not found`);
                break;
            }
            node = node.children[i];
        }
        setInputValue('');
        setInputError('');
    };

    const clearBTree = () => {
        setRoot(null);
        setOperation('B-Tree cleared');
        setInputValue('');
        setSearchResult(null);
    };

    // Render B-Tree
    const renderTree = (node, level = 0) => {
        if (!node) return null;

        const spacing = Math.max(50, 300 / (level + 1));
        return (
            <motion.div
                key={JSON.stringify(node.keys) + level}
                variants={nodeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center relative"
            >
                <div className="flex gap-2 p-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl text-white font-bold text-lg shadow-lg shadow-orange-500/40 border-2 border-orange-500/60 hover:shadow-xl transition-all duration-300 z-10">
                    {node.keys.map((key, idx) => (
                        <span key={idx} className="px-2">{key}</span>
                    ))}
                </div>
                {node.children.length > 0 && (
                    <div className="flex justify-center w-full mt-4 gap-4">
                        {node.children.map((child, idx) => (
                            <div key={idx} className="relative flex-1 flex justify-center">
                                <div className="absolute top-0 w-full h-12 border-t-2 border-orange-400" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
                                <div style={{ marginLeft: spacing / 2 + 'px', marginRight: spacing / 2 + 'px' }}>{renderTree(child, level + 1)}</div>
                            </div>
                        ))}
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
        { title: 'Database Indexing', description: 'Efficiently indexes large datasets.', icon: <FiTarget size={20} className="text-orange-400" /> },
        { title: 'File Systems', description: 'Organizes file metadata.', icon: <BsGraphUp size={20} className="text-amber-400" /> },
        { title: 'Balanced Search', description: 'Maintains balanced tree for searches.', icon: <FiLayers size={20} className="text-yellow-400" /> },
        { title: 'Multilevel Indexing', description: 'Supports hierarchical data access.', icon: <FiCpu size={20} className="text-red-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'B-Tree Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/BTree.html', description: 'Interactive B-Tree operations.' },
        { title: 'B-Tree Explained', url: 'https://www.geeksforgeeks.org/introduction-of-b-tree/', description: 'Learn B-Tree basics.' },
        { title: 'B-Tree vs B+ Tree', url: 'https://www.geeksforgeeks.org/difference-between-b-tree-and-b-tree/', description: 'Compare B-Tree variants.' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-amber-900 text-white px-6 pt-20 pb-12 flex flex-col items-center overflow-x-hidden">
            <Navbar />

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-extrabold mt-8 mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 tracking-tight drop-shadow-lg text-center"
            >
                B-Tree Visualizer
            </motion.h1>

            {/* Input and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12 w-full max-w-lg bg-gray-800/90 p-8 rounded-3xl border border-orange-500/30 shadow-2xl backdrop-blur-lg"
            >
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-700/70 border border-orange-500/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-inner text-lg"
                    placeholder="Enter a number"
                />
                {inputError && <p className="text-red-400 text-sm mt-2">{inputError}</p>}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleInsert}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-700 to-yellow-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
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
                        onClick={handleSearch}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-700 to-amber-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiSearch /> Search
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearBTree}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaRedo /> Clear
                    </motion.button>
                </div>
                {searchResult && <p className="text-yellow-300 text-sm mt-4">{searchResult}</p>}
            </motion.div>

            {/* Visualization Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-6xl bg-gray-800/80 p-10 rounded-3xl border border-orange-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-3xl font-semibold mb-8 text-orange-300 drop-shadow-md">B-Tree (Order 4)</h2>
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
                                B-Tree is empty. Insert keys to visualize!
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
                className="mt-12 w-full max-w-6xl bg-gray-800/80 p-8 rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-3xl font-semibold mb-4 text-amber-300 drop-shadow-md">Operation Log</h2>
                <p className="text-gray-200 text-lg font-medium">{operation || 'No operations yet.'}</p>
            </motion.div>

            {/* Explanation Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 w-full max-w-6xl bg-gray-800/80 p-8 rounded-3xl border border-orange-500/30 shadow-2xl backdrop-blur-lg"
            >
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className="mb-4 p-4 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg shadow-orange-600/30"
                    >
                        <FiInfo className="text-white text-3xl" />
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 tracking-tight"
                    >
                        B-Tree Explained
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-lg leading-relaxed text-center max-w-3xl font-light">
                            A <span className="text-orange-300 font-semibold">B-Tree</span> is a self-balancing tree designed for efficient disk-based operations, maintaining sorted data with a high branching factor.
                        </p>
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-amber-900/90 text-orange-200 rounded-lg shadow-lg text-sm max-w-xs text-center"
                                >
                                    <FaRegLightbulb className="inline-block mr-2 text-yellow-300" size={16} />
                                    Ideal for large datasets with minimal height!
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
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-700/30' : 'text-gray-300 hover:bg-gray-700/50'}`}
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
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-orange-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-orange-300 flex items-center">
                                        <FiInfo className="mr-3 text-orange-400" size={20} />
                                        Characteristics
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            { icon: <FiClock size={20} />, label: 'Time Complexity', value: 'O(log n)', color: 'text-orange-400' },
                                            { icon: <FiLayers size={20} />, label: 'Space Complexity', value: 'O(n)', color: 'text-yellow-400' },
                                            { icon: <FiCpu size={20} />, label: 'Order', value: '4', color: 'text-amber-400' },
                                            { icon: <FiTarget size={20} />, label: 'Balance', value: 'Self-balancing', color: 'text-red-400' },
                                        ].map((item, idx) => (
                                            <motion.li
                                                key={idx}
                                                variants={itemVariants}
                                                className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition duration-300"
                                            >
                                                <div className="p-2 rounded-lg bg-gray-700/70 text-orange-400">{item.icon}</div>
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
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-orange-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-orange-300 flex items-center">
                                        <BsGraphUp className="mr-3 text-orange-400" size={20} />
                                        Properties
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            "Nodes can have multiple keys",
                                            "Maintains balance automatically",
                                            "Minimizes tree height",
                                            "Efficient for disk storage",
                                        ].map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3">
                                                <div className="mt-1 min-w-[8px] h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                                                <p className="text-gray-200">{item}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        )}
                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-amber-500/30">
                                    <h3 className="text-2xl font-semibold mb-4 text-amber-300 flex items-center">
                                        <FiCode className="mr-3 text-amber-400" size={20} />
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
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors"
                                    >
                                        <FiCopy size={16} /> Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors"
                                    >
                                        <FiShare2 size={16} /> Share
                                    </motion.button>
                                </div>
                            </div>
                        )}
                        {activeTab === 'applications' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h3 className="text-2xl font-semibold mb-4 text-orange-300">Common Applications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {applications.map((app, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300"
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
                                <h3 className="text-2xl font-semibold mb-4 text-amber-300">Learning Resources</h3>
                                {resources.map((resource, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={itemVariants}
                                        className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3">
                                            <IoMdSchool className="text-xl text-yellow-400 mt-1" />
                                            <div>
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white hover:text-yellow-300 transition-colors">
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
        </div>
    );
};

export default BTreeVisualizer;