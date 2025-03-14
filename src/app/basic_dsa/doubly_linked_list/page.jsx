"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiArrowRight, FiArrowLeft, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget, FiCopy, FiShare2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar'; // Assuming Navbar is reusable
import { FaEdit, FaRedo, FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { toast } from 'react-hot-toast';


class DoublyNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

const DoublyLinkedListVisualizer = () => {
    const [head, setHead] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [operation, setOperation] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);

    // Doubly Linked List pseudocode
    const pseudocode = `DoublyLinkedList:
    DoublyNode {
        value
        next : DoublyNode
        prev : DoublyNode
    }

    insertAtEnd(value):
        newNode = DoublyNode(value)
        if list is empty:
            head = newNode
        else:
            current = head
            while current.next is not null:
                current = current.next
            current.next = newNode
            newNode.prev = current

    deleteNode(value):
        if list is empty:
            return // Nothing to delete
        if head.value equals value:
            head = head.next
            if head is not null:
                head.prev = null
        else:
            current = head
            while current is not null and current.value != value:
                current = current.next
            if current is not null:
                if current.prev is not null:
                    current.prev.next = current.next
                if current.next is not null:
                    current.next.prev = current.prev`;


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

    // Tabs data
    const tabs = [
        { id: 'details', label: 'Key Details', icon: <FiInfo size={18} /> },
        { id: 'code', label: 'Pseudocode', icon: <FiCode size={18} /> },
        { id: 'applications', label: 'Applications', icon: <BsGraphUp size={18} /> },
        { id: 'learn', label: 'Learn More', icon: <IoMdSchool size={18} /> },
    ];

    // Application examples
    const applications = [
        { title: 'Browser History', description: 'Enable back and forward navigation.', icon: <FiTarget size={20} className="text-pink-400" /> },
        { title: 'Undo/Redo Functionality', description: 'Implement command history in applications.', icon: <BsGraphUp size={20} className="text-blue-400" /> },
        { title: 'Music Playlist', description: 'Navigate between previous and next songs easily.', icon: <FiLayers size={20} className="text-purple-400" /> },
        { title: 'Caching', description: 'Store recently accessed data for faster retrieval.', icon: <FiCpu size={20} className="text-green-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'Interactive Doubly Linked List Visualization', url: 'https://visualgo.net/en/list', description: 'See Doubly Linked List in action with step-by-step visualization' },
        { title: 'Doubly Linked List Interview Questions', url: 'https://www.geeksforgeeks.org/doubly-linked-list/', description: 'Practice with common interview problems' },
        { title: 'Doubly Linked List vs Singly Linked List', url: 'https://www.geeksforgeeks.org/singly-vs-doubly-linked-list/', description: 'Compare Doubly Linked List with Singly Linked Lists, etc.' },
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

    // Insert node at the end
    const insertAtEnd = () => {
        if (!inputValue) return;
        const value = parseInt(inputValue);
        const newNode = new DoublyNode(value);
        setOperation(`Inserting ${value} at end`);

        if (!head) {
            setHead(newNode);
        } else {
            let current = head;
            while (current.next) current = current.next;
            current.next = newNode;
            newNode.prev = current;
        }
        setHead({ ...head });
        setInputValue('');
    };

    // Insert node at the head
    const insertAtHead = () => {
        if (!inputValue) return;
        const value = parseInt(inputValue);
        const newNode = new DoublyNode(value);
        setOperation(`Inserting ${value} at head`);

        if (head) {
            newNode.next = head;
            head.prev = newNode;
        }
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
            if (head) head.prev = null;
        } else {
            let current = head;
            while (current && current.value !== value) {
                current = current.next;
            }
            if (current) {
                if (current.prev) current.prev.next = current.next;
                if (current.next) current.next.prev = current.prev;
                setHead({ ...head });
            }
        }
        setInputValue('');
    };

    // Clear the entire list
    const clearList = () => {
        setHead(null);
        setOperation('List cleared');
        setInputValue('');
    };

    // Render doubly linked list as array for visualization
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
                const newNode = new DoublyNode(value);
                if (!newHead) {
                    newHead = newNode;
                    current = newHead;
                } else {
                    current.next = newNode;
                    newNode.prev = current;
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
                Doubly Linked List Visualizer
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
                        <FiArrowLeft /> Head
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
                <h2 className="text-3xl font-semibold mb-8 text-purple-300 drop-shadow-md">Doubly Linked List</h2>
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
                                    {index > 0 && (
                                        <motion.div
                                            variants={arrowVariants}
                                            initial="initial"
                                            animate="animate"
                                            className="text-purple-400"
                                        >
                                            <FiArrowLeft size={36} />
                                        </motion.div>
                                    )}
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

            {/* Explanation Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 w-full max-w-6xl bg-gray-800/80 p-8 rounded-3xl border border-green-500/30 shadow-2xl backdrop-blur-lg"
            >
                {/* Header section with lightning icon */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center mb-8"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className="mb-4 p-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30"
                    >
                        <FiInfo className="text-white text-3xl" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 tracking-tight"
                    >
                        Doubly Linked List Explained
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto font-light">
                            A doubly linked list is a linear data structure where each node has a data part and two pointers: one to the next node and another to the previous node.
                        </p>

                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-indigo-900/90 text-purple-200 rounded-lg shadow-lg text-sm max-w-xs text-center"
                                >
                                    <FaRegLightbulb className="inline-block mr-2 text-yellow-300" size={16} />
                                    Doubly linked lists allows traversal in both forward and backward directions.
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Tabs navigation */}
                <div className="mb-8">
                    <div className="flex overflow-x-auto space-x-2 p-1 bg-gray-800/50 rounded-xl backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-700/30' : 'text-gray-300 hover:bg-gray-700/50'}`}
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
                        className="min-h-[400px]"
                    >
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {/* Left section */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-purple-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-purple-300 tracking-wide flex items-center">
                                        <FiInfo className="mr-3 text-purple-400" size={20} />
                                        Algorithm Characteristics
                                    </h3>
                                    <ul className="space-y-5">
                                        {[
                                            { icon: <FiClock size={20} />, label: 'Time Complexity (Insertion)', value: 'O(1)', color: 'text-purple-400' },
                                            { icon: <FiClock size={20} />, label: 'Time Complexity (Deletion)', value: 'O(1)', color: 'text-purple-400' },
                                            { icon: <FiLayers size={20} />, label: 'Space Complexity', value: 'O(n)', color: 'text-indigo-400' },
                                            { icon: <FiCpu size={20} />, label: 'Memory Usage', value: 'More than singly linked list', color: 'text-blue-400' },
                                            { icon: <FiTarget size={20} />, label: 'Direction', value: 'Bidirectional', color: 'text-green-400' },
                                        ].map((item, idx) => (
                                            <motion.li
                                                key={idx}
                                                variants={itemVariants}
                                                className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition duration-300"
                                            >
                                                <div className="p-2 rounded-lg bg-gray-700/70 text-purple-400">
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
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-purple-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-purple-300 tracking-wide flex items-center">
                                        <BsGraphUp className="mr-3 text-purple-400" size={20} />
                                        Key Properties
                                    </h3>
                                    <ul className="space-y-4">
                                        {[
                                            "Each node has pointers to both the next and previous nodes.",
                                            "Allows traversal in both directions.",
                                            "Efficient for applications requiring backward navigation.",
                                            "Requires more memory compared to singly linked lists.",
                                        ].map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3">
                                                <div className="mt-1 min-w-[8px] h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                                                <p className="text-gray-200">{item}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <motion.div
                                        variants={itemVariants}
                                        className="mt-6 p-4 rounded-xl bg-indigo-900/30 border border-indigo-500/30"
                                    >
                                        <p className="text-indigo-300 font-medium flex items-center">
                                            <FaRegLightbulb className="mr-2 text-yellow-300" size={16} />
                                            Doubly Linked Lists are used when backward traversal is needed.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Pseudocode Tab */}
                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-indigo-500/30">
                                    <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
                                        <FiCode className="mr-3 text-indigo-400" size={20} />
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
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                                        onClick={handleCopy}
                                    >
                                        <FiCopy size={16} /> Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                                        onClick={handleShare}
                                    >
                                        <FiShare2 size={16} /> Share
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Applications Tab */}
                        {activeTab === 'applications' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h3 className="text-2xl font-semibold mb-4 text-purple-300">Common Applications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {applications.map((app, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
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

                        {/* Learn More Tab */}
                        {activeTab === 'learn' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                                <h3 className="text-2xl font-semibold mb-4 text-indigo-300">Learning Resources</h3>
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                    {resources.map((resource, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-3">
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
                            className="bg-gray-800 p-8 rounded-3xl w-full max-w-md border border-indigo-500/40 shadow-2xl backdrop-blur-lg"
                        >
                            <h3 className="text-2xl font-semibold text-indigo-300 mb-6 drop-shadow-md">Load Custom Doubly Linked List</h3>
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
export default DoublyLinkedListVisualizer;