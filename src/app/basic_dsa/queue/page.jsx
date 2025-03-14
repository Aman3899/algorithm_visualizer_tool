"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiArrowRight, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget, FiCopy, FiShare2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { FaEdit, FaRedo, FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { toast } from 'react-hot-toast';

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

const QueueVisualizer = () => {
    const [front, setFront] = useState(null);
    const [rear, setRear] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [operation, setOperation] = useState('');
    const [showInputModal, setShowInputModal] = useState(false);
    const [inputError, setInputError] = useState('');
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);

    // Queue pseudocode
    const pseudocode = `Queue:
    enqueue(value):
        add 'value' to the rear of the queue

    dequeue():
        if queue is not empty:
            remove and return the element at the front of the queue
        else:
            return null (or throw an exception)

    peek():
        if queue is not empty:
            return the element at the front without removing it
        else:
            return null

    isEmpty():
        return true if queue is empty, false otherwise`;

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
        initial: { scale: 0, opacity: 0, x: -50, rotate: -15 },
        animate: {
            scale: 1,
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: { duration: 0.6, type: 'spring', stiffness: 200, damping: 15 },
        },
        exit: { scale: 0, opacity: 0, x: 50, rotate: 15, transition: { duration: 0.4 } },
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
        { title: 'Task Scheduling', description: 'Managing tasks in a specific order of execution.', icon: <FiTarget size={20} className="text-pink-400" /> },
        { title: 'Request Handling', description: 'Processing requests in the order they are received.', icon: <BsGraphUp size={20} className="text-blue-400" /> },
        { title: 'Print Queue', description: 'Managing print jobs in a printer.', icon: <FiLayers size={20} className="text-purple-400" /> },
        { title: 'Breadth-First Search', description: 'Implementing breadth-first search algorithm for graph traversal.', icon: <FiCpu size={20} className="text-green-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'Interactive Queue Visualization', url: 'https://www.cs.usfca.edu/~galles/visualization/Queue.html', description: 'See Queue in action with step-by-step visualization' },
        { title: 'Queue Interview Questions', url: 'https://www.geeksforgeeks.org/queue-data-structure/', description: 'Practice with common interview problems' },
        { title: 'Queue vs Stack', url: 'https://www.geeksforgeeks.org/stack-vs-queue/', description: 'Compare Queue with Stack, etc.' },
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

    // Enqueue (add to rear)
    const enqueue = () => {
        if (!inputValue) return;
        const value = inputValue; // Allow character input
        const newNode = new Node(value);
        setOperation(`Enqueuing ${value}`);

        if (!front) {
            setFront(newNode);
            setRear(newNode);
        } else {
            rear.next = newNode;
            setRear(newNode);
        }
        setRear(newNode);
        setInputValue('');
    };

    // Dequeue (remove from front)
    const dequeue = () => {
        if (!front) return;
        setOperation(`Dequeuing ${front.value}`);

        const temp = front;
        setFront(front.next);

        if (!front) {
            setRear(null);
        }
    };

    // Clear the queue
    const clearQueue = () => {
        setFront(null);
        setRear(null);
        setOperation('Queue cleared');
        setInputValue('');
    };

    // Render queue as array for visualization
    const renderQueue = () => {
        const nodes = [];
        let current = front;
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

            if (inputValues.length === 0) {
                setInputError('Please enter at least one value');
                return;
            }

            let newFront = null;
            let newRear = null;
            inputValues.forEach(value => {
                const newNode = new Node(value);
                if (!newFront) {
                    newFront = newNode;
                    newRear = newNode;
                } else {
                    newRear.next = newNode;
                    newRear = newNode;
                }
            });

            setFront(newFront);
            setRear(newRear);
            setOperation(`Loaded custom queue: ${inputValues.join(', ')}`);
            setShowInputModal(false);
            setInputValue('');
        } catch (error) {
            setInputError(error.message || 'Invalid input. Use comma-separated values.');
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
                Queue Visualizer
            </motion.h1>

            {/* Input and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12 w-full max-w-2xl bg-gray-800/90 p-8 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-lg"
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-4 rounded-xl bg-gray-700/70 border border-purple-500/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner text-lg"
                    placeholder="Enter a value (number or character)"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={enqueue}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-700 to-pink-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiPlus /> Enqueue
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={dequeue}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-pink-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiTrash /> Dequeue
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearQueue}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaRedo /> Clear
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInputModal(true)}
                        className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaEdit /> Custom Queue
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
                <h2 className="text-3xl font-semibold mb-8 text-purple-300 drop-shadow-md">Queue</h2>
                <div className="flex flex-wrap gap-10 items-center justify-center">
                    <AnimatePresence>
                        {renderQueue().length > 0 ? (
                            renderQueue().map((value, index) => (
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
                                    {index < renderQueue().length - 1 && (
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
                                Queue is empty. Enqueue a value to visualize!
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
                {renderQueue().length > 0 && (
                    <div className="mt-6 text-center text-gray-300 text-lg">
                        <span className="text-green-400 font-semibold">Front</span> →{' '}
                        <span className="text-red-400 font-semibold">Rear</span>
                    </div>
                )}
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
                {/* Header section */}
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
                        className="text-4xl md:text-5xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tight"
                    >
                        Queue Explained
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto font-light">
                            A queue is a fundamental data structure based on the principle of First-In-First-Out (FIFO). Elements are added to the rear and removed from the front.
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
                                    Queues are suitable for managing tasks or data in the order of arrival
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
                                            { icon: <FiClock size={20} />, label: 'Time Complexity (Enqueue)', value: 'O(1)', color: 'text-purple-400' },
                                            { icon: <FiClock size={20} />, label: 'Time Complexity (Dequeue)', value: 'O(1)', color: 'text-purple-400' },
                                            { icon: <FiLayers size={20} />, label: 'Space Complexity', value: 'O(n)', color: 'text-indigo-400' },
                                            { icon: <FiCpu size={20} />, label: 'FIFO', value: 'Yes', color: 'text-blue-400' },
                                            { icon: <FiTarget size={20} />, label: 'Implementation', value: 'Arrays or Linked Lists', color: 'text-green-400' },
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
                                            "Follows FIFO (First-In-First-Out) principle.",
                                            "Insertion (enqueue) at the rear, deletion (dequeue) from the front.",
                                            "Maintains order based on arrival time.",
                                            "Suitable for tasks requiring sequential processing.",
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
                                            Queues guarantee fair processing by handling elements in the order they arrive.
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
                                <h3 className="text-2xl font-semibold mb-4 text-blue-300">Common Applications</h3>
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
                            <h3 className="text-2xl font-semibold text-indigo-300 mb-6 drop-shadow-md">Load Custom Queue</h3>
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter values separated by commas (e.g., 5, 10, A, b)"
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

export default QueueVisualizer;