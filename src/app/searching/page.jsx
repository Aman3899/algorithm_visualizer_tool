"use client";

import Link from 'next/link';
import { FaSearch, FaEye, FaTable, FaInfoCircle, FaCode, FaChartBar } from 'react-icons/fa';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SearchingAlgorithmsPage() {
    const [activeTab, setActiveTab] = useState('algorithms');

    const algorithms = [
        {
            name: 'Linear Search',
            path: '/searching/linear_search',
            description: 'Sequentially checks each element until a match is found or the list ends.',
            useCase: 'Unsorted data or small datasets'
        },
        {
            name: 'Binary Search',
            path: '/searching/binary_search',
            description: 'Efficiently finds an element by halving the search space in sorted data.',
            useCase: 'Sorted arrays or lists'
        },
        {
            name: 'Jump Search',
            path: '/searching/jump_search',
            description: 'Jumps ahead by fixed steps, then performs linear search in the block.',
            useCase: 'Sorted arrays with uniform distribution'
        },
        {
            name: 'Interpolation Search',
            path: '/searching/interpolation_search',
            description: 'Estimates position based on value distribution in sorted data.',
            useCase: 'Uniformly distributed sorted data'
        },
        {
            name: 'Exponential Search',
            path: '/searching/exponential_search',
            description: 'Finds a range using exponential steps, then applies binary search.',
            useCase: 'Large sorted arrays with unknown bounds'
        },
        {
            name: 'Ternary Search',
            path: '/searching/ternary_search',
            description: 'Divides the search space into three parts to find an element.',
            useCase: 'Unimodal functions or sorted arrays'
        },
        {
            name: 'Fibonacci Search',
            path: '/searching/fibonacci_search',
            description: 'Uses Fibonacci numbers to divide the search space.',
            useCase: 'Sorted arrays with minimal comparisons'
        },
        {
            name: 'Depth-First Search (DFS)',
            path: '/searching/dfs',
            description: 'Explores as far as possible along each branch before backtracking.',
            useCase: 'Graph or tree traversal'
        },
        {
            name: 'Breadth-First Search (BFS)',
            path: '/searching/bfs',
            description: 'Explores all neighbors at the present depth before moving deeper.',
            useCase: 'Shortest path in unweighted graphs'
        }
    ];

    const complexityData = [
        { name: 'Linear Search', best: 'O(1)', worst: 'O(n)', average: 'O(n)', space: 'O(1)' },
        { name: 'Binary Search', best: 'O(1)', worst: 'O(log n)', average: 'O(log n)', space: 'O(1)' },
        { name: 'Jump Search', best: 'O(1)', worst: 'O(√n)', average: 'O(√n)', space: 'O(1)' },
        { name: 'Interpolation Search', best: 'O(1)', worst: 'O(n)', average: 'O(log log n)', space: 'O(1)' },
        { name: 'Exponential Search', best: 'O(1)', worst: 'O(log n)', average: 'O(log n)', space: 'O(1)' },
        { name: 'Ternary Search', best: 'O(1)', worst: 'O(log n)', average: 'O(log n)', space: 'O(1)' },
        { name: 'Fibonacci Search', best: 'O(1)', worst: 'O(log n)', average: 'O(log n)', space: 'O(1)' },
        { name: 'Depth-First Search (DFS)', best: 'O(1)', worst: 'O(V + E)', average: 'O(V + E)', space: 'O(V)' },
        { name: 'Breadth-First Search (BFS)', best: 'O(1)', worst: 'O(V + E)', average: 'O(V + E)', space: 'O(V)' }
    ];

    const applicabilityData = [
        { name: 'Linear Search', applicable: 'Unsorted', notes: 'Works on any data, no preprocessing required' },
        { name: 'Binary Search', applicable: 'Sorted', notes: 'Requires sorted data for efficiency' },
        { name: 'Jump Search', applicable: 'Sorted', notes: 'Best for sorted arrays, less overhead than binary search' },
        { name: 'Interpolation Search', applicable: 'Sorted', notes: 'Optimal for uniformly distributed sorted data' },
        { name: 'Exponential Search', applicable: 'Sorted', notes: 'Effective for unbounded searches in sorted data' },
        { name: 'Ternary Search', applicable: 'Sorted/Unimodal', notes: 'Useful for sorted arrays or finding peaks' },
        { name: 'Fibonacci Search', applicable: 'Sorted', notes: 'Minimizes comparisons in sorted arrays' },
        { name: 'Depth-First Search (DFS)', applicable: 'Graphs/Trees', notes: 'Explores deep paths in graph structures' },
        { name: 'Breadth-First Search (BFS)', applicable: 'Graphs/Trees', notes: 'Explores level-by-level in graph structures' }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col font-sans">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="relative py-24 md:py-32 px-4 flex items-center justify-center">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <div className="inline-block p-2 bg-purple-500/20 rounded-full mb-4">
                                <FaSearch className="text-3xl text-purple-400" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
                                Searching Algorithms
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                                Discover and visualize how searching algorithms efficiently locate elements in various data structures.
                            </p>
                            <div className="pt-4">
                                <a href="#explore" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-lg font-medium">
                                    Explore Algorithms
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
                            onClick={() => setActiveTab('algorithms')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'algorithms' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
                        >
                            <FaCode />
                            Algorithms
                        </button>
                        <button
                            onClick={() => setActiveTab('complexity')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'complexity' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
                        >
                            <FaChartBar />
                            Complexity
                        </button>
                        <button
                            onClick={() => setActiveTab('applicability')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'applicability' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}`}
                        >
                            <FaInfoCircle />
                            Applicability
                        </button>
                    </div>

                    {/* Algorithms Grid */}
                    {activeTab === 'algorithms' && (
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold text-center mb-10">Choose an Algorithm to Visualize</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {algorithms.map((algo) => (
                                    <Link
                                        key={algo.name}
                                        href={algo.path}
                                        className="group bg-gradient-to-br from-gray-800/80 to-purple-900/30 p-6 rounded-xl hover:from-purple-900/50 hover:to-pink-900/30 transition-all duration-300 border border-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold group-hover:text-purple-300 transition-colors">{algo.name}</h2>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/20 group-hover:bg-purple-500/40 transition-colors">
                                                <FaEye className="text-purple-400" />
                                            </div>
                                        </div>
                                        <p className="text-gray-400 mt-3 mb-4 text-sm line-clamp-2">{algo.description}</p>
                                        <div className="text-xs text-purple-400/80 bg-purple-900/30 py-1 px-3 rounded-full inline-block">
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
                                <h2 className="text-3xl font-bold mb-4">Time & Space Complexity</h2>
                                <p className="text-gray-300">Compare the efficiency of different searching algorithms across scenarios</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-purple-500/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-purple-900/30">
                                                <th className="p-4 border-b border-purple-500/20 rounded-tl-lg">Algorithm</th>
                                                <th className="p-4 border-b border-purple-500/20">Best Case</th>
                                                <th className="p-4 border-b border-purple-500/20">Average Case</th>
                                                <th className="p-4 border-b border-purple-500/20">Worst Case</th>
                                                <th className="p-4 border-b border-purple-500/20 rounded-tr-lg">Space</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complexityData.map((algo, index) => (
                                                <tr
                                                    key={algo.name}
                                                    className={`hover:bg-purple-900/20 transition-colors ${index === complexityData.length - 1 ? 'last-row' : ''}`}
                                                >
                                                    <td className={`p-4 border-b border-purple-500/10 font-medium ${index === complexityData.length - 1 ? 'rounded-bl-lg' : ''}`}>
                                                        {algo.name}
                                                    </td>
                                                    <td className={`p-4 border-b border-purple-500/10 ${algo.best === 'O(1)' ? 'text-green-400' : 'text-gray-300'}`}>
                                                        {algo.best}
                                                    </td>
                                                    <td className={`p-4 border-b border-purple-500/10 ${algo.average.includes('log') ? 'text-blue-400' : algo.average === 'O(n)' ? 'text-orange-400' : 'text-gray-300'}`}>
                                                        {algo.average}
                                                    </td>
                                                    <td className={`p-4 border-b border-purple-500/10 ${algo.worst.includes('log') ? 'text-blue-400' : algo.worst.includes('n') ? 'text-orange-400' : 'text-gray-300'}`}>
                                                        {algo.worst}
                                                    </td>
                                                    <td className={`p-4 border-b border-purple-500/10 ${index === complexityData.length - 1 ? 'rounded-br-lg' : ''}`}>
                                                        {algo.space}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Applicability Table */}
                    {activeTab === 'applicability' && (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-8">
                                <h2 className="text-3xl font-bold mb-4">Algorithm Applicability</h2>
                                <p className="text-gray-300">Understand where each searching algorithm performs best</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-purple-500/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-purple-900/30">
                                                <th className="p-4 border-b border-purple-500/20 rounded-tl-lg">Algorithm</th>
                                                <th className="p-4 border-b border-purple-500/20">Applicable To</th>
                                                <th className="p-4 border-b border-purple-500/20 rounded-tr-lg">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applicabilityData.map((algo, index) => (
                                                <tr
                                                    key={algo.name}
                                                    className={`hover:bg-purple-900/20 transition-colors ${index === applicabilityData.length - 1 ? 'last-row' : ''}`}
                                                >
                                                    <td className={`p-4 border-b border-purple-500/10 font-medium ${index === applicabilityData.length - 1 ? 'rounded-bl-lg' : ''}`}>
                                                        {algo.name}
                                                    </td>
                                                    <td className={`p-4 border-b border-purple-500/10 ${algo.applicable.includes('Sorted') ? 'text-green-400' : 'text-gray-300'}`}>
                                                        {algo.applicable}
                                                    </td>
                                                    <td className={`p-4 border-b border-purple-500/10 text-gray-400 ${index === applicabilityData.length - 1 ? 'rounded-br-lg' : ''}`}>
                                                        {algo.notes}
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

                {/* Footer */}
                <footer className="bg-gray-800 text-gray-400 text-center p-6 mt-auto">
                    © {new Date().getFullYear()} Searching Algorithm Visualizer. All rights reserved.
                </footer>
            </div>
        </>
    );
}