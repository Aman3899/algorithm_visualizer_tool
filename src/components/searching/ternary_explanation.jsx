"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';
import { FiCopy, FiShare2, FiInfo, FiCode, FiLayers } from 'react-icons/fi';
import { BsFillLightningFill, BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { FaRegLightbulb } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

const TernarySearchExplanation = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);

    // Function to copy pseudocode to clipboard
    const handleCopy = () => {
        const pseudocode = `ternarySearch(arr, target):
    low = 0
    high = arr.length - 1
    while low <= high:
        mid1 = low + (high - low) / 3
        mid2 = high - (high - low) / 3
        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2
        if target < arr[mid1]:
            high = mid1 - 1
        else if target > arr[mid2]:
            low = mid2 + 1
        else:
            low = mid1 + 1
            high = mid2 - 1
    return -1 // Not found`;
        navigator.clipboard.writeText(pseudocode);
        toast.success('Pseudocode copied to clipboard!', {
            style: {
                background: '#333',
                color: '#fff',
                border: '1px solid #9333ea',
            },
        });
    };

    // Function to share pseudocode (simulated)
    const handleShare = () => {
        const pseudocode = `ternarySearch(arr, target):
    low = 0
    high = arr.length - 1
    while low <= high:
        mid1 = low + (high - low) / 3
        mid2 = high - (high - low) / 3
        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2
        if target < arr[mid1]:
            high = mid1 - 1
        else if target > arr[mid2]:
            low = mid2 + 1
        else:
            low = mid1 + 1
            high = mid2 - 1
    return -1 // Not found`;
        const shareUrl = `https://example.com/share?text=${encodeURIComponent(pseudocode)}`;
        window.open(shareUrl, '_blank');
        toast.success('Share link generated!', {
            style: {
                background: '#333',
                color: '#fff',
                border: '1px solid #9333ea',
            },
        });
    };

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

    const tabs = [
        { id: 'details', label: 'Key Details', icon: <FiInfo size={18} /> },
        { id: 'code', label: 'Pseudocode', icon: <FiCode size={18} /> },
        { id: 'applications', label: 'Applications', icon: <BsGraphUp size={18} /> },
        { id: 'learn', label: 'Learn More', icon: <IoMdSchool size={18} /> },
    ];

    const applications = [
        { title: 'Unimodal Function Optimization', description: 'Efficiently finds the maximum or minimum of functions with a single peak or trough.', icon: <BsGraphUp size={20} className="text-pink-400" /> },
        { title: 'Root Finding', description: 'Approximates roots of functions in mathematical and engineering computations.', icon: <BsGraphUp size={20} className="text-blue-400" /> },
        { title: 'Decision Making', description: 'Simplifies decision processes by dividing options into manageable segments.', icon: <FiLayers size={20} className="text-purple-400" /> },
    ];

    const resources = [
        { title: 'Interactive Ternary Search Visualization', url: 'https://www.example.com/ternary-search-visualization', description: 'See Ternary Search in action with step-by-step visualization.' },
        { title: 'Common Ternary Search Interview Questions', url: 'https://www.example.com/ternary-search-interview-questions', description: 'Practice with frequently asked interview problems.' },
        { title: 'Ternary Search vs Binary Search Comparison', url: 'https://www.example.com/ternary-search-vs-binary-search', description: 'Understand when to choose Ternary Search over Binary Search.' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 mx-auto max-w-6xl relative rounded-3xl overflow-hidden" // Added 'relative' and 'rounded-3xl'
        >
            {/* Glass morphism background with animated gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-800/20 to-pink-900/30 rounded-3xl backdrop-blur-lg z-0">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-[10px] opacity-30">
                        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-0 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-40 left-20 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>
                </div>
            </div>

            {/* Content container */}
            <div className="relative z-10 p-6 md:p-10 backdrop-blur-sm">
                {/* Header section with lightning icon */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                        className="mb-4 p-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30"
                    >
                        <BsFillLightningFill className="text-white text-3xl" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 tracking-tight"
                    >
                        Ternary Search Explained
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto font-light">
                            Ternary Search divides the search space into three parts by calculating two midpoints (mid1 and mid2). It compares the target with these points to narrow down the search to one of three segments, repeating until the target is found or the space is exhausted.
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
                                    Use it when division operations are costly.
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
                                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-700/30' : 'text-gray-300 hover:bg-gray-700/50'
                                    }`}
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
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left section */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-2xl shadow-xl border border-purple-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-2xl font-semibold mb-6 text-purple-300 tracking-wide flex items-center">
                                        <FiInfo className="mr-3 text-purple-400" size={20} />
                                        Algorithm Characteristics
                                    </h3>
                                    <ul className="text-gray-200 list-none space-y-3">
                                        {[
                                            { label: 'Time Complexity', value: 'O(log₃ n)', color: 'text-purple-400', tooltip: 'Search time increases logarithmically to the base 3 of data size.' },
                                            { label: 'Space Complexity', value: 'O(1) iterative, O(log n) recursive', color: 'text-indigo-400', tooltip: 'Requires little space on iterative use.' },
                                            { label: 'Prerequisite', value: 'Array must be sorted', color: 'text-yellow-400', tooltip: 'Requires pre-sorted data to function correctly.' },
                                            { label: 'Best Use', value: 'Sorted arrays or unimodal functions', color: 'text-blue-400', tooltip: 'More suited if division operations are costly.' },
                                        ].map((item, idx) => (
                                            <Tippy key={idx} content={item.tooltip} theme="light-border" placement="right">
                                                <motion.li
                                                    whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
                                                >
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                                    <span className="font-semibold text-purple-300">{item.label}:</span>
                                                    <span className={`${item.color} font-medium`}>{item.value}</span>
                                                </motion.li>
                                            </Tippy>
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
                                        {['Divides the search space in three parts.', 'Efficient on Uniform Data', 'More complex computation per step'].map((item, idx) => (
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
                                            Best suited for medium-sized datasets, requires a sorted array.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Pseudocode Tab */}
                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-500/30">
                                    <h3 className="text-2xl font-semibold mb-4 text-indigo-300 flex items-center">
                                        <FiCode className="mr-3 text-indigo-400" size={20} />
                                        Pseudocode
                                    </h3>
                                    <pre className="font-mono text-sm md:text-base text-gray-200 whitespace-pre-wrap bg-gray-700/30 p-4 rounded-lg overflow-x-auto">
                                        <code className="block text-purple-200">
                                            ternarySearch(arr, target):{'\n'}
                                            <span className="ml-4 text-indigo-300">low = 0</span>{'\n'}
                                            <span className="ml-4 text-indigo-300">high = arr.length - 1</span>{'\n'}
                                            <span className="ml-4 text-blue-300">{"while low <= high:"}</span>{'\n'}
                                            <span className="ml-8 text-yellow-300">mid1 = low + (high - low) / 3</span>{'\n'}
                                            <span className="ml-8 text-yellow-300">mid2 = high - (high - low) / 3</span>{'\n'}
                                            <span className="ml-8 text-blue-300">if arr[mid1] == target:</span>{'\n'}
                                            <span className="ml-12 text-green-300">return mid1</span>{'\n'}
                                            <span className="ml-8 text-blue-300">if arr[mid2] == target:</span>{'\n'}
                                            <span className="ml-12 text-green-300">return mid2</span>{'\n'}
                                            <span className="ml-8 text-blue-300">{"if target < arr[mid1]:"}</span>{'\n'}
                                            <span className="ml-12 text-yellow-300">high = mid1 - 1</span>{'\n'}
                                            <span className="ml-8 text-blue-300">{"else if target > arr[mid2]:"}</span>{'\n'}
                                            <span className="ml-12 text-yellow-300">low = mid2 + 1</span>{'\n'}
                                            <span className="ml-8 text-blue-300">else:</span>{'\n'}
                                            <span className="ml-12 text-yellow-300">low = mid1 + 1</span>{'\n'}
                                            <span className="ml-12 text-yellow-300">high = mid2 - 1</span>{'\n'}
                                            <span className="ml-4 text-yellow-300">return -1</span> <span className="text-gray-500">{"// Not found"}</span>
                                        </code>
                                    </pre>
                                </motion.div>
                                <div className="flex justify-end gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                                    >
                                        <FiCopy size={16} />
                                        <span className="text-sm font-semibold">Copy</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleShare}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full shadow-md hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
                                    >
                                        <FiShare2 size={16} />
                                        <span className="text-sm font-semibold">Share</span>
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
            </div>
        </motion.div>
    );
};

export default TernarySearchExplanation;