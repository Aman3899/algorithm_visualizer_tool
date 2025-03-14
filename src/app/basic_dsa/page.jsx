"use client";

import Link from 'next/link';
import { FaList, FaEye, FaTable, FaInfoCircle, FaCode, FaChartBar, FaTree, FaDatabase, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function DSAContentPage() {
    const [activeTab, setActiveTab] = useState('data_structures');

    const dataStructures = [
        {
            name: 'Linked List',
            path: '/basic_dsa/linked_list',
            description: 'A linear data structure where elements are linked using pointers.',
            useCase: 'Implementing stacks, queues, and graphs.'
        },{
            name: 'Doubly Linked List',
            path: '/basic_dsa/doubly_linked_list',
            description: 'A linear data structure where elements are linked using double pointers.',
            useCase: 'Implementing stacks, queues, and graphs.'
        },
        {
            name: 'Array',
            path: '/basic_dsa/array',
            description: 'A collection of items stored at contiguous memory locations.',
            useCase: 'Storing and accessing sequential data.'
        },
        {
            name: 'Stack',
            path: '/basic_dsa/stack',
            description: 'A LIFO (Last In First Out) data structure.',
            useCase: 'Function calls, expression evaluation.'
        },
        {
            name: 'Queue',
            path: '/basic_dsa/queue',
            description: 'A FIFO (First In First Out) data structure.',
            useCase: 'Task scheduling, resource management.'
        },
        {
            name: 'Binary Tree',
            path: '/basic_dsa/binary_tree',
            description: 'A tree data structure where each node has at most two children.',
            useCase: 'Searching, sorting, and indexing data.'
        },
        {
            name: 'Hash Table',
            path: '/basic_dsa/hash_table',
            description: 'A data structure that implements an associative array abstract data type.',
            useCase: 'Implementing dictionaries and caching.'
        },
        {
            name: 'Graph',
            path: '/basic_dsa/graph',
            description: 'A data structure consisting of nodes (vertices) connected by edges.',
            useCase: 'Modeling networks, social connections.'
        },
    ];

    const algorithms = [
        {
            name: 'Binary Search',
            path: '/basic_dsa/binary_search',
            description: 'Efficient algorithm for finding an item from a sorted list.',
            useCase: 'Searching in sorted arrays.'
        },
        {
            name: 'Depth-First Search (DFS)',
            path: '/basic_dsa/dfs',
            description: 'Traversal algorithm for graph or tree data structures.',
            useCase: 'Pathfinding, topological sorting.'
        },
        {
            name: 'Breadth-First Search (BFS)',
            path: '/basic_dsa/bfs',
            description: 'Traversal algorithm that explores neighbor nodes first.',
            useCase: 'Shortest path finding, network traversal.'
        },
        {
            name: 'Sorting Algorithms',
            path: '/sorting',
            description: 'Algorithms for sorting data like Bubble Sort, Merge Sort, Quick Sort etc.',
            useCase: 'Data processing, database indexing.'
        },
    ];

    const complexityData = [
        { name: 'Linked List (Search)', best: 'O(1)', worst: 'O(n)', average: 'O(n)' },
        { name: 'Array (Access)', best: 'O(1)', worst: 'O(1)', average: 'O(1)' },
        { name: 'Stack (Push/Pop)', best: 'O(1)', worst: 'O(1)', average: 'O(1)' },
        { name: 'Queue (Enqueue/Dequeue)', best: 'O(1)', worst: 'O(1)', average: 'O(1)' },
        { name: 'Binary Tree (Search)', best: 'O(log n)', worst: 'O(n)', average: 'O(log n)' },
        { name: 'Hash Table (Lookup)', best: 'O(1)', worst: 'O(n)', average: 'O(1)' },
        { name: 'Graph (DFS/BFS)', best: 'O(V+E)', worst: 'O(V+E)', average: 'O(V+E)' },
        { name: 'Binary Search', best: 'O(1)', worst: 'O(log n)', average: 'O(log n)' },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col font-sans">
                {/* Hero Section with Animated Background */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="relative py-24 md:py-32 px-4 flex items-center justify-center">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <div className="inline-block p-2 bg-indigo-500/20 rounded-full mb-4">
                                <FaTable className="text-3xl text-indigo-400" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                                Data Structures and Algorithms
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                                Explore fundamental Data Structures and Algorithms. Learn their properties, implementations, and use cases.
                            </p>
                            <div className="pt-4">
                                <a href="#explore" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-3 rounded-lg font-medium">
                                    Explore Content
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div id="explore" className="container mx-auto px-4 py-16 max-w-7xl">
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        <button
                            onClick={() => setActiveTab('data_structures')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'data_structures' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}
                        >
                            <FaList />
                            Data Structures
                        </button>
                        <button
                            onClick={() => setActiveTab('algorithms')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'algorithms' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}
                        >
                            <FaCode />
                            Algorithms
                        </button>
                        <button
                            onClick={() => setActiveTab('complexity')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'complexity' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}
                        >
                            <FaChartBar />
                            Complexity
                        </button>
                    </div>

                    {/* Data Structures Grid */}
                    {activeTab === 'data_structures' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center mb-10">Explore Data Structures</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dataStructures.map((ds) => (
                                    <Link
                                        key={ds.name}
                                        href={ds.path}
                                        className="group bg-gradient-to-br from-gray-800/80 to-indigo-900/30 p-6 rounded-xl hover:from-indigo-900/50 hover:to-purple-900/30 transition-all duration-300 border border-indigo-500/20 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold group-hover:text-indigo-300 transition-colors">{ds.name}</h2>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors">
                                                <FaEye className="text-indigo-400" />
                                            </div>
                                        </div>
                                        <p className="text-gray-400 mt-3 mb-4 text-sm line-clamp-2">{ds.description}</p>
                                        <div className="text-xs text-indigo-400/80 bg-indigo-900/30 py-1 px-3 rounded-full inline-block">
                                            Best for: {ds.useCase}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Algorithms Grid */}
                    {activeTab === 'algorithms' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center mb-10">Explore Algorithms</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {algorithms.map((algo) => (
                                    <Link
                                        key={algo.name}
                                        href={algo.path}
                                        className="group bg-gradient-to-br from-gray-800/80 to-indigo-900/30 p-6 rounded-xl hover:from-indigo-900/50 hover:to-purple-900/30 transition-all duration-300 border border-indigo-500/20 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold group-hover:text-indigo-300 transition-colors">{algo.name}</h2>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors">
                                                <FaSearch className="text-indigo-400" />
                                            </div>
                                        </div>
                                        <p className="text-gray-400 mt-3 mb-4 text-sm line-clamp-2">{algo.description}</p>
                                        <div className="text-xs text-indigo-400/80 bg-indigo-900/30 py-1 px-3 rounded-full inline-block">
                                            Best for: {algo.useCase}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Complexity Table */}
                    {activeTab === 'complexity' && (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-8">
                                <h2 className="text-3xl font-bold mb-4">Time Complexity Overview</h2>
                                <p className="text-gray-300">Understand the performance implications of different data structures and algorithms</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-indigo-500/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-indigo-900/30">
                                                <th className="p-4 border-b border-indigo-500/20 rounded-tl-lg">Operation</th>
                                                <th className="p-4 border-b border-indigo-500/20">Best Case</th>
                                                <th className="p-4 border-b border-indigo-500/20">Average Case</th>
                                                <th className="p-4 border-b border-indigo-500/20 rounded-tr-lg">Worst Case</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complexityData.map((item, index) => (
                                                <tr
                                                    key={item.name}
                                                    className={`hover:bg-indigo-900/20 transition-colors ${index === complexityData.length - 1 ? 'last-row' : ''
                                                        }`}
                                                >
                                                    <td className={`p-4 border-b border-indigo-500/10 font-medium ${index === complexityData.length - 1 ? 'rounded-bl-lg' : ''
                                                        }`}>
                                                        {item.name}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${item.best === 'O(1)' ? 'text-green-400' :
                                                        item.best.includes('log') ? 'text-blue-400' : 'text-gray-300'
                                                        }`}>
                                                        {item.best}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${item.average === 'O(1)' ? 'text-green-400' :
                                                        item.average.includes('log') ? 'text-blue-400' :
                                                            item.average.includes('n') ? 'text-orange-400' : 'text-gray-300'
                                                        }`}>
                                                        {item.average}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${index === complexityData.length - 1 ? 'rounded-br-lg' : ''} ${item.worst === 'O(1)' ? 'text-green-400' :
                                                        item.worst.includes('log') ? 'text-blue-400' :
                                                            item.worst.includes('n') ? 'text-orange-400' : 'text-gray-300'
                                                        }`}>
                                                        {item.worst}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <footer className="bg-gray-800 text-gray-400 text-center p-6 mt-auto">
                    © {new Date().getFullYear()} Data Structures and Algorithms. All rights reserved.
                </footer>
            </div>


        </>
    );
}