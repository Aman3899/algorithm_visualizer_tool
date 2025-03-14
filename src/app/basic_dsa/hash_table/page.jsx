"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget, FiCopy, FiShare2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { FaEdit, FaRedo, FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { toast } from 'react-hot-toast';

const HashTableVisualizer = () => {
    const [hashTable, setHashTable] = useState({});
    const [keyInput, setKeyInput] = useState('');
    const [valueInput, setValueInput] = useState('');
    const [operation, setOperation] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);

    // Hash Table pseudocode
    const pseudocode = `HashTable:
    insert(key, value):
        index = hashFunction(key)
        store value at index

    delete(key):
        index = hashFunction(key)
        remove value at index

    search(key):
        index = hashFunction(key)
        return value at index (if exists)

    hashFunction(key):
        return index based on the key (e.g., key.length % tableSize)`;

    // Function to copy pseudocode to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(pseudocode);
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl shadow-lg border border-purple-500/30"
            >
                <FaRegCheckCircle className="text-green-400" size={18} />
                <span className="font-medium">Pseudocode copied to clipboard!</span>
            </motion.div>
        ), { duration: 2000 });
    };

    // Function to share pseudocode (simulated)
    const handleShare = () => {
        const shareUrl = `https://example.com/share?text=${encodeURIComponent(pseudocode)}`;
        window.open(shareUrl, '_blank');
        toast.custom((t) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl shadow-lg border border-purple-500/30"
            >
                <FaRegCheckCircle className="text-green-400" size={18} />
                <span className="font-medium">Share link generated!</span>
            </motion.div>
        ), { duration: 2000 });
    };

    // Simple hash function for visualization (index = key length % 10)
    const hashFunction = (key) => key.length % 10;

    // Animation variants for hash table slots
    const slotVariants = {
        initial: { scale: 0.8, opacity: 0, y: 50 },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, type: 'spring', stiffness: 150, damping: 12 },
        },
        exit: { scale: 0.8, opacity: 0, y: -50, transition: { duration: 0.4 } },
    };

    // Tabs data
    const tabs = [
        { id: 'details', label: 'Key Details', icon: <FiInfo size={18} /> },
        { id: 'code', label: 'Pseudocode', icon: <FiCode size={18} /> },
        { id: 'applications', label: 'Applications', icon: <BsGraphUp size={18} /> },
        { id: 'learn', label: 'Learn More', icon: <IoMdSchool size={18} /> },
    ];

    // Application examples
    const applications = [
        { title: 'Database Indexing', description: 'Rapidly locate database records using key-based lookup.', icon: <FiTarget size={20} className="text-pink-400" /> },
        { title: 'Cache Implementation', description: 'Quickly access frequently used data in web servers and applications.', icon: <BsGraphUp size={20} className="text-blue-400" /> },
        { title: 'Symbol Tables', description: 'Map variable names to their attributes in compilers and interpreters.', icon: <FiLayers size={20} className="text-purple-400" /> },
        { title: 'Data Dictionaries', description: 'Manage metadata efficiently in data warehousing.', icon: <FiCpu size={20} className="text-green-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'Interactive Hash Table Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/OpenHash.html', description: 'See Hash Table in action with step-by-step visualization' },
        { title: 'Hash Table Interview Questions', url: 'https://www.geeksforgeeks.org/hash-data-structure/', description: 'Practice with common interview problems' },
        { title: 'Hash Table vs Binary Search Tree', url: 'https://www.geeksforgeeks.org/difference-between-hashing-and-binary-search-tree/', description: 'Compare Hash Table with Binary Search Tree, etc.' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // Insert into hash table
    const handleInsert = () => {
        if (!keyInput || !valueInput) return;
        const index = hashFunction(keyInput);
        setOperation(`Inserting ${keyInput}: ${valueInput} at index ${index}`);
        setHashTable(prev => ({
            ...prev,
            [index]: [...(prev[index] || []), { key: keyInput, value: valueInput }],
        }));
        setKeyInput('');
        setValueInput('');
    };

    // Delete from hash table
    const handleDelete = () => {
        if (!keyInput) return;
        const index = hashFunction(keyInput);
        if (!hashTable[index]) return;
        setOperation(`Deleting ${keyInput} from index ${index}`);
        setHashTable(prev => ({
            ...prev,
            [index]: prev[index].filter(item => item.key !== keyInput),
        }));
        setKeyInput('');
        setValueInput('');
    };

    // Clear the hash table
    const clearHashTable = () => {
        setHashTable({});
        setOperation('Hash table cleared');
        setKeyInput('');
        setValueInput('');
    };

    // Handle custom hash table input
    const handleCustomHashTable = () => {
        setInputError('');
        try {
            const inputPairs = keyInput.split(';').filter(pair => pair.trim() !== '');
            const newHashTable = {};
            inputPairs.forEach(pair => {
                const [key, value] = pair.split(',').map(item => item.trim());
                if (!key || !value) throw new Error('Each pair must have a key and value');
                const index = hashFunction(key);
                newHashTable[index] = [...(newHashTable[index] || []), { key, value }];
            });

            setHashTable(newHashTable);
            setOperation(`Loaded custom hash table`);
            setShowInputModal(false);
            setKeyInput('');
            setValueInput('');
        } catch (error) {
            setInputError(error.message || 'Invalid input. Use key,value;key,value format');
        }
    };

    // Render hash table
    const renderHashTable = () => {
        const slots = Array.from({ length: 10 }, (_, i) => i);
        return slots.map(index => (
            <motion.div
                key={index}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-20 h-12 flex items-center justify-center bg-gray-700/50 rounded-t-lg text-gray-300 font-semibold text-sm shadow-inner border border-orange-500/30">
                    Index {index}
                </div>
                <div className="w-48 min-h-[80px] bg-gradient-to-br from-orange-700/20 to-amber-700/20 rounded-b-lg p-2 border border-orange-500/30 flex flex-col gap-2">
                    <AnimatePresence>
                        {hashTable[index]?.map((item, idx) => (
                            <motion.div
                                key={`${item.key}-${idx}`}
                                variants={slotVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-orange-700 to-amber-700 rounded-lg text-white font-medium text-sm shadow-lg shadow-orange-500/40 border border-orange-500/60 hover:shadow-xl transition-all duration-300"
                            >
                                <span>{item.key}</span>
                                <span>{item.value}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        ));
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInputModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-amber-900 text-white px-6 pt-20 pb-12 flex flex-col items-center">
            <Navbar />

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-extrabold mt-8 mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 tracking-tight drop-shadow-lg text-center"
            >
                Hash Table Visualizer
            </motion.h1>

            {/* Input and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 w-full max-w-md bg-gray-800/90 p-6 rounded-3xl border border-orange-500/30 shadow-2xl backdrop-blur-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        className="p-3 rounded-xl bg-gray-700/70 border border-orange-500/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-inner text-lg"
                        placeholder="Enter key"
                    />
                    <input
                        type="text"
                        value={valueInput}
                        onChange={(e) => setValueInput(e.target.value)}
                        className="p-3 rounded-xl bg-gray-700/70 border border-orange-500/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 shadow-inner text-lg"
                        placeholder="Enter value"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleInsert}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-700 to-amber-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiPlus /> Insert
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-orange-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiTrash /> Delete
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearHashTable}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaRedo /> Clear
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInputModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300 col-span-3 md:col-span-3"
                    >
                        <FaEdit /> Custom Hash Table
                    </motion.button>
                </div>
            </motion.div>

            {/* Visualization Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-5xl bg-gray-800/80 p-6 rounded-3xl border border-orange-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-2xl font-semibold mb-6 text-orange-300 drop-shadow-md">Hash Table (0-9)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {renderHashTable()}
                </div>
            </motion.div>

            {/* Operation Log */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 w-full max-w-5xl bg-gray-800/80 p-6 rounded-3xl border border-amber-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-2xl font-semibold mb-4 text-amber-300 drop-shadow-md">Operation Log</h2>
                <p className="text-gray-200 text-lg font-medium">{operation || 'No operations yet.'}</p>
            </motion.div>

            {/* Explanation Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 w-full max-w-5xl bg-gray-800/80 p-6 rounded-3xl border border-yellow-500/30 shadow-2xl backdrop-blur-lg"
            >
                {/* Header section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center mb-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className="mb-2 p-3 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg shadow-orange-600/30"
                    >
                        <FiInfo className="text-white text-2xl" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 tracking-tight"
                        style={{ WebkitTextStroke: '0.5px black' }}
                    >
                        Hash Table Explained
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-md leading-relaxed text-center max-w-3xl mx-auto font-light">
                            A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values. A hash table uses a hash function to compute an index into an array of slots, from which the desired value can be found.
                        </p>

                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-indigo-900/90 text-orange-200 rounded-lg shadow-lg text-sm max-w-xs text-center"
                                >
                                    <FaRegLightbulb className="inline-block mr-2 text-yellow-300" size={16} />
                                    Hash tables are exceptionally efficient when the number of entries is predictable.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Tabs navigation */}
                <div className="mb-4">
                    <div className="flex overflow-x-auto space-x-2 p-1 bg-gray-800/50 rounded-xl backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-yellow-700/30' : 'text-gray-300 hover:bg-gray-700/50'}`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[300px]"
                    >
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {/* Left section */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 rounded-2xl shadow-xl border border-yellow-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-yellow-300 tracking-wide flex items-center">
                                        <FiInfo className="mr-2 text-yellow-400" size={20} />
                                        Algorithm Characteristics
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: <FiClock size={18} />, label: 'Time Complexity (Avg)', value: 'O(1)', color: 'text-yellow-400' },
                                            { icon: <FiClock size={18} />, label: 'Time Complexity (Worst)', value: 'O(n)', color: 'text-yellow-400' },
                                            { icon: <FiLayers size={18} />, label: 'Space Complexity', value: 'O(n)', color: 'text-amber-400' },
                                            { icon: <FiCpu size={18} />, label: 'Key-Value', value: 'Yes', color: 'text-orange-400' },
                                            { icon: <FiTarget size={18} />, label: 'Implementation', value: 'Array + Hash Function', color: 'text-green-400' },
                                        ].map((item, idx) => (
                                            <motion.li
                                                key={idx}
                                                variants={itemVariants}
                                                className="flex items-center gap-3 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition duration-300"
                                            >
                                                <div className="p-2 rounded-lg bg-gray-700/70 text-yellow-400">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <span className="block text-sm text-gray-400">{item.label}</span>
                                                    <span className={`text-lg font-semibold ${item.color}`}>{item.value}</span>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Right section */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 rounded-2xl shadow-xl border border-yellow-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-yellow-300 tracking-wide flex items-center">
                                        <BsGraphUp className="mr-2 text-yellow-400" size={20} />
                                        Key Properties
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Uses a hash function to compute indices for keys.",
                                            "Allows quick insertion, deletion, and search operations.",
                                            "Handles collisions through various techniques (e.g., chaining).",
                                            "Performance depends on the quality of the hash function.",
                                        ].map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3">
                                                <div className="mt-1 min-w-[8px] h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                                                <p className="text-gray-200">{item}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <motion.div
                                        variants={itemVariants}
                                        className="mt-4 p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30"
                                    >
                                        <p className="text-indigo-300 font-medium flex items-center">
                                            <FaRegLightbulb className="mr-2 text-yellow-300" size={16} />
                                            Hash tables are essential for efficient data retrieval in a wide range of applications.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Pseudocode Tab */}
                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-indigo-500/30">
                                    <h3 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
                                        <FiCode className="mr-2 text-indigo-400" size={20} />
                                        Pseudocode
                                    </h3>
                                    <pre className="font-mono text-sm md:text-base text-gray-200 whitespace-pre-wrap bg-gray-700/30 p-3 rounded-lg overflow-x-auto">
                                        {pseudocode}
                                    </pre>
                                </motion.div>
                                <div className="flex justify-end gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                                        onClick={handleCopy}
                                    >
                                        <FiCopy size={16} /> Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                                        onClick={handleShare}
                                    >
                                        <FiShare2 size={16} /> Share
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Applications Tab */}
                        {activeTab === 'applications' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                <h3 className="text-xl font-semibold mb-4 text-blue-300">Common Applications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {applications.map((app, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-3 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center mb-2">
                                                {app.icon}
                                                <h4 className="text-lg font-semibold text-white ml-2">{app.title}</h4>
                                            </div>
                                            <p className="text-gray-200">{app.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Learn More Tab */}
                        {activeTab === 'learn' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                <h3 className="text-xl font-semibold mb-4 text-indigo-300">Learning Resources</h3>
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                                    {resources.map((resource, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-3 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-2">
                                                <IoMdSchool className="text-xl text-blue-400 mt-1" />
                                                <div>
                                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-white hover:text-blue-300 transition-colors">
                                                        {resource.title}
                                                    </a>
                                                    <p className="text-gray-300">{resource.description}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
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
                            className="bg-gray-800 p-6 rounded-3xl w-full max-w-md border border-yellow-500/40 shadow-2xl backdrop-blur-lg"
                        >
                            <h3 className="text-xl font-semibold text-yellow-300 mb-4 drop-shadow-md">Load Custom Hash Table</h3>
                            <textarea
                                value={keyInput}
                                onChange={(e) => setKeyInput(e.target.value)}
                                placeholder="Enter key,value pairs separated by semicolons (e.g., name,John;age,30)"
                                className="w-full p-3 bg-gray-700/70 rounded-xl border border-yellow-500/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300 shadow-inner text-lg"
                                rows="5"
                            />
                            {inputError && <p className="text-red-400 text-sm mt-2">{inputError}</p>}
                            <div className="flex justify-end gap-2 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowInputModal
                                        (false)}
                                    className="px-4 py-2 bg-gray-600 rounded-xl text-white font-semibold hover:bg-gray-700 transition-all duration-300 shadow-md"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCustomHashTable}
                                    className="px-4 py-2 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-xl text-white font-semibold hover:brightness-110 transition-all duration-300 shadow-md"
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
export default HashTableVisualizer;