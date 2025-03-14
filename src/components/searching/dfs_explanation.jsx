"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiCopy, FiShare2, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget } from 'react-icons/fi';
import { BsFillLightningFill, BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';

const DFS_Explanation = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);

    // The DFS pseudocode
    const pseudocode = `DFS(graph, start):
    visited = set()
    stack = [start]
    while stack is not empty:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    stack.push(neighbor)`;

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

    // Function to share pseudocode (simulated; adjust for real sharing)
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
        { title: 'Cycle Detection', description: 'Identifies cycles in a graph, useful in deadlock detection.', icon: <FiTarget size={20} className="text-pink-400" /> },
        { title: 'Topological Sorting', description: 'Orders nodes in a directed acyclic graph based on dependencies.', icon: <BsGraphUp size={20} className="text-blue-400" /> },
        { title: 'Maze Solving', description: 'Navigates complex mazes by systematically exploring each path.', icon: <FiLayers size={20} className="text-purple-400" /> },
        { title: 'Path Finding', description: 'Finds path', icon: <FiCpu size={20} className="text-green-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'Interactive DFS Visualization', url: 'https://www.example.com/dfs-visualization', description: 'See DFS in action with step-by-step visualization' },
        { title: 'Common DFS Interview Questions', url: 'https://www.example.com/dfs-interview-questions', description: 'Practice with frequently asked interview problems' },
        { title: 'DFS vs BFS Comparison', url: 'https://www.example.com/dfs-vs-bfs', description: 'Understand when to choose DFS over BFS' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mt-10 mx-auto max-w-6xl overflow-hidden"
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
                        <BsFillLightningFill className="text-white text-3xl" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl md:text-5xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 tracking-tight"
                    >
                        Depth-First Search
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto font-light">
                            DFS explores a graph by <span className="text-purple-300 font-semibold">diving deep</span> into each branch before backtracking. It leverages a <span className="text-indigo-300 font-semibold">stack</span>—either implicitly via recursion or explicitly—to track nodes for exploration.
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
                                    Recursive implementation uses the call stack implicitly.
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
                                            { icon: <FiClock size={20} />, label: 'Time Complexity', value: 'O(V + E)', color: 'text-purple-400' },
                                            { icon: <FiLayers size={20} />, label: 'Space Complexity', value: 'O(V)', color: 'text-indigo-400' },
                                            { icon: <FiCpu size={20} />, label: 'Data Structure', value: 'Stack', color: 'text-blue-400' },
                                            { icon: <FiTarget size={20} />, label: 'Completeness', value: 'Not Guaranteed', color: 'text-rose-400' },
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
                                            "Memory-efficient for deep graphs",
                                            "Explore one branch completely before others",
                                            "Not guaranteed to find the shortest path",
                                            "Useful in topological sorting or cycle detection",
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
                                            DFS is memory-efficient for very deep graphs but may not find the shortest path
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
                                            DFS(graph, start):{'\n'}
                                            <span className="ml-4 text-indigo-300">visited = set()</span>{'\n'}
                                            <span className="ml-4 text-indigo-300">stack = [start]</span>{'\n'}
                                            <span className="ml-4 text-blue-300">while stack is not empty:</span>{'\n'}
                                            <span className="ml-8 text-yellow-300">node = stack.pop()</span>{'\n'}
                                            <span className="ml-8 text-blue-300">if node not in visited:</span>{'\n'}
                                            <span className="ml-12 text-green-300">visited.add(node)</span>{'\n'}
                                            <span className="ml-12 text-blue-300">for neighbor in graph[node]:</span>{'\n'}
                                            <span className="ml-16 text-blue-300">if neighbor not in visited:</span>{'\n'}
                                            <span className="ml-20 text-green-300">stack.push(neighbor)</span>
                                        </code>
                                    </pre>
                                </motion.div>
                                <div className="flex justify-end gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                                        onClick={handleCopy}
                                    >
                                        <FiCopy size={16} />
                                        <span className="text-sm font-semibold">Copy</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                                        onClick={handleShare}
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
                                        <motion.div key={idx} variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-5 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300">
                                            <div className="flex items-start gap-3">
                                                <IoMdSchool className="text-xl text-blue-400 mt-1" />
                                                <div>
                                                    <a href={resource.url} target='_blank' rel="noopener noreferrer" className="text-lg font-semibold text-white hover:text-blue-300 transition-colors">{resource.title}</a>
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

export default DFS_Explanation;