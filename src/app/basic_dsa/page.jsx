"use client";

import Link from 'next/link';
import { FaList, FaEye, FaTable, FaInfoCircle, FaChartBar, FaTree, FaDatabase } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function DSAContentPage() {
    const [activeTab, setActiveTab] = useState('data_structures');

    const dataStructures = [
        {
            name: 'Linked List',
            path: '/basic_dsa/linked_list',
            description: 'A linear data structure where elements are linked using pointers. Useful for dynamic memory.',
            useCase: 'Implementing stacks, queues, and managing dynamic data.'
        },
        {
            name: 'Doubly Linked List',
            path: '/basic_dsa/doubly_linked_list',
            description: 'Bidirectional linear structure for efficient forward/backward traversal. Each node has two pointers: One to the next node, and another to the node previous to it.',
            useCase: 'Undo/redo operations, browser history, music playlists.'
        },
        {
            name: 'Array',
            path: '/basic_dsa/array',
            description: 'Indexed data collection for accessing sequential elements in contiguous memory. These elements have the same type.',
            useCase: 'Storing and accessing fixed-size data, image processing.'
        },
        {
            name: 'Stack',
            path: '/basic_dsa/stack',
            description: 'Follows the Last In First Out (LIFO) principle. Push adds to the top, pop removes the top element.',
            useCase: 'Function calls, expression evaluation, managing history.'
        },
        {
            name: 'Queue',
            path: '/basic_dsa/queue',
            description: 'Follows the First In First Out (FIFO) principle. Enqueue adds to the rear, dequeue removes the front element.',
            useCase: 'Task scheduling, print queue, managing requests.'
        },
        {
            name: 'Binary Search Tree',
            path: '/basic_dsa/binary_tree',
            description: 'A tree where each node has at most two children, maintains sorted order. Search and insertion are quick O(log n).',
            useCase: 'Searching, sorting, and data indexing for retrieval.'
        },
        {
            name: 'Hash Table',
            path: '/basic_dsa/hash_table',
            description: 'Associative array to stores key-value pairs. Provides fast lookups (O(1) on average).',
            useCase: 'Implementing dictionaries and speeding up data retrieval.'
        },
        {
            name: 'Graph',
            path: '/basic_dsa/graph_list_matrix',
            description: 'Consists of nodes connected by edges, useful for modeling relationships. Can be directed or undirected.',
            useCase: 'Social networks, routing, web connections, recommendation systems.'
        },
        {
            name: 'B-Tree',
            path: '/basic_dsa/b_tree',
            description: 'Self-balancing tree optimized for disk storage, minimizes disk access. Good for large databases.',
            useCase: 'Database indexing, efficient file systems, large dataset storage.'
        }
    ];

    const applications = [
        {
            name: 'Linked List',
            application: 'Dynamic Memory Management',
            description: 'Used for flexible memory allocation in programs, adjusting size as needed.',
            icon: <FaList className="text-cyan-400" />
        },
        {
            name: 'Doubly Linked List',
            application: 'Music Playlist Navigation',
            description: 'Offers forward and backward navigation of songs, user-friendly control.',
            icon: <FaTree className="text-teal-400" />
        },
        {
            name: 'Array',
            application: 'Image Processing',
            description: 'Efficiently stores pixel data to allow for easy image manipulation.',
            icon: <FaTable className="text-indigo-400" />
        },
        {
            name: 'Stack',
            application: 'Undo Functionality',
            description: 'Tracks previous states enabling user-friendly error correction.',
            icon: <FaChartBar className="text-cyan-400" />
        },
        {
            name: 'Queue',
            application: 'Print Queue',
            description: 'Manages print jobs to prevent overload of the printing system.',
            icon: <FaDatabase className="text-teal-400" />
        },
        {
            name: 'Binary Search Tree',
            application: 'Expression Trees',
            description: 'Calculates expressions efficiently by structural representation.',
            icon: <FaTree className="text-indigo-400" />
        },
        {
            name: 'Hash Table',
            application: 'Caching Systems',
            description: 'Speeds up data access in web applications by storing frequent requests.',
            icon: <FaTable className="text-cyan-400" />
        },
        {
            name: 'Graph',
            application: 'Social Networks',
            description: 'Represent user relationships and connections to better understand patterns.',
            icon: <FaChartBar className="text-teal-400" />
        },
        {
            name: 'B-Tree',
            application: 'Database Indexing',
            description: 'Optimizes database querying with balanced tree structures, minimizing disk access.',
            icon: <FaDatabase className="text-indigo-400" />
        }
    ];

    const complexityData = [
        { name: 'Linked List (Search)', best: 'O(1)', worst: 'O(n)', average: 'O(n)' },
        { name: 'Doubly Linked List (Search)', best: 'O(1)', worst: 'O(n)', average: 'O(n)' },
        { name: 'Array (Access)', best: 'O(1)', worst: 'O(1)', average: 'O(1)' },
        { name: 'Stack (Push/Pop)', best: 'O(1)', worst: 'O(1)', average: 'O(1)' },
        { name: 'Queue (Enqueue/Dequeue)', best: 'O(1)', worst: 'O(1)', average: 'O(1)' },
        { name: 'Binary Search Tree (Search)', best: 'O(log n)', worst: 'O(n)', average: 'O(log n)' },
        { name: 'Hash Table (Lookup)', best: 'O(1)', worst: 'O(n)', average: 'O(1)' },
        { name: 'Graph (DFS/BFS)', best: 'O(V+E)', worst: 'O(V+E)', average: 'O(V+E)' },
        { name: 'B-Tree (Search)', best: 'O(log n)', worst: 'O(log n)', average: 'O(log n)' },
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-indigo-900 text-white flex flex-col font-sans">
            <Navbar />
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="relative overflow-hidden py-16 md:py-24 px-4 flex items-center justify-center bg-gradient-to-b from-cyan-800/20 to-indigo-900/20 backdrop-blur-sm"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative text-center max-w-5xl mx-auto space-y-6 z-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="inline-block p-4 bg-cyan-500/20 rounded-full mb-4 shadow-lg"
                    >
                        <FaTable className="text-5xl text-cyan-400" />
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 tracking-tight drop-shadow-lg">
                        Unlocking Data Structures & Algorithms
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto font-light">
                        A journey through data manipulation, optimization, and algorithmic thinking.
                    </p>
                    <motion.a
                        href="#explore"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition-all px-8 py-4 rounded-xl font-semibold text-white shadow-lg mt-6"
                    >
                        Explore Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 17a1 1 0 01-.707-1.707l5.293-5.293H3a1 1 0 010-2h11.586l-5.293-5.293A1 1 0 1110.707 3.293l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-.707 0z" clipRule="evenodd" />
                        </svg>
                    </motion.a>
                </div>
            </motion.div>

            {/* Main Content */}
            <div id="explore" className="container mx-auto px-4 py-16 max-w-7xl">
                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="flex flex-wrap justify-center gap-4 mb-12 bg-gray-800/50 p-2 rounded-xl backdrop-blur-md border border-cyan-500/20"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('data_structures')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'data_structures' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/50'}`}
                    >
                        <FaList /> Data Structures
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('applications')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'applications' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/50'}`}
                    >
                        <FaChartBar /> Applications
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('complexity')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'complexity' ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg' : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/50'}`}
                    >
                        <FaTable /> Complexity
                    </motion.button>
                </motion.div>

                {/* Data Structures Grid */}
                {activeTab === 'data_structures' && (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                        <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                            Core Data Structures
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dataStructures.map((ds) => (
                                <motion.div key={ds.name} variants={itemVariants}>
                                    <Link
                                        href={ds.path}
                                        className="group block bg-gradient-to-br from-gray-800/80 to-cyan-900/30 p-6 rounded-xl hover:from-cyan-900/50 hover:to-teal-900/30 transition-all duration-300 border border-cyan-500/20 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/20 backdrop-blur-sm"
                                    >
                                        <div className="flex items-start justify-between">
                                            <h2 className="text-xl font-semibold group-hover:text-teal-300 transition-colors">{ds.name}</h2>
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500/20 group-hover:bg-teal-500/40 transition-colors"
                                            >
                                                <FaEye className="text-teal-400" />
                                            </motion.div>
                                        </div>
                                        <p className="text-gray-300 mt-3 mb-4 text-sm line-clamp-3">{ds.description}</p>
                                        <div className="text-xs text-teal-400/80 bg-teal-900/30 py-1 px-3 rounded-full inline-block">
                                            Best for: {ds.useCase}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Applications Grid */}
                {activeTab === 'applications' && (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                        <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                            Practical Applications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.map((app) => (
                                <motion.div key={app.name} variants={itemVariants}>
                                    <div className="bg-gradient-to-br from-gray-800/80 to-cyan-900/30 p-6 rounded-xl hover:from-cyan-900/50 hover:to-teal-900/30 transition-all duration-300 border border-cyan-500/20 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/20 backdrop-blur-sm h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-3">
                                            <h2 className="text-xl font-semibold group-hover:text-teal-300 transition-colors">{app.name}</h2>
                                            <motion.div
                                                whileHover={{ scale: 1.2 }}
                                                transition={{ type: "spring", stiffness: 200 }}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500/20 group-hover:bg-teal-500/40 transition-colors"
                                            >
                                                {app.icon}
                                            </motion.div>
                                        </div>
                                        <p className="text-teal-300 mt-2 font-medium">{app.application}</p>
                                        <p className="text-gray-300 mt-3 text-sm">{app.description}</p>
                                        <div className="mt-auto"></div> 
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Complexity Table */}
                {activeTab === 'complexity' && (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                        <div className="text-center max-w-3xl mx-auto mb-8">
                            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
                                Time Complexity Analysis
                            </h2>
                            <p className="text-gray-300 font-light">Explore the best, average, and worst-case scenarios for common data structure operations.</p>
                        </div>
                        <div className="bg-gray-800/70 rounded-xl p-4 md:p-6 border border-cyan-500/20 backdrop-blur-md shadow-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-cyan-900/30">
                                            <th className="p-4 border-b border-cyan-500/20 rounded-tl-lg font-semibold text-gray-200">Operation</th>
                                            <th className="p-4 border-b border-cyan-500/20 font-semibold text-green-300">Best Case</th>
                                            <th className="p-4 border-b border-cyan-500/20 font-semibold text-yellow-300">Average Case</th>
                                            <th className="p-4 border-b border-cyan-500/20 rounded-tr-lg font-semibold text-red-300">Worst Case</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complexityData.map((item, index) => (
                                            <motion.tr
                                                key={item.name}
                                                variants={itemVariants}
                                                className="hover:bg-cyan-900/20 transition-colors"
                                            >
                                                <td className="p-4 border-b border-cyan-500/10 font-medium">{item.name}</td>
                                                <td className="p-4 border-b border-cyan-500/10">{item.best}</td>
                                                <td className="p-4 border-b border-cyan-500/10">{item.average}</td>
                                                <td className="p-4 border-b border-cyan-500/10">{item.worst}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800/90 text-gray-400 text-center p-6 mt-auto border-t border-cyan-500/20 backdrop-blur-sm">
                © {new Date().getFullYear()} Data Structures & Applications. All rights reserved.
            </footer>
        </div>
    );
}