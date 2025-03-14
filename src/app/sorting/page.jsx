"use client";

import Link from 'next/link';
import { FaSort, FaEye, FaTable, FaInfoCircle, FaCode, FaChartBar } from 'react-icons/fa';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SortingAlgorithmsPage() {
    const [activeTab, setActiveTab] = useState('algorithms');

    const algorithms = [
        {
            name: 'Bubble Sort',
            path: '/sorting/bubble_sort',
            description: 'Simple comparison-based algorithm that repeatedly steps through the list.',
            useCase: 'Educational purposes and small datasets'
        },
        {
            name: 'Selection Sort',
            path: '/sorting/selection_sort',
            description: 'Divides input into sorted and unsorted regions, repeatedly selects smallest element.',
            useCase: 'Small lists and limited memory'
        },
        {
            name: 'Insertion Sort',
            path: '/sorting/insertion_sort',
            description: 'Builds sorted array one item at a time, efficient for small datasets.',
            useCase: 'Nearly sorted data and online algorithms'
        },
        {
            name: 'Merge Sort',
            path: '/sorting/merge_sort',
            description: 'Divide and conquer algorithm that splits, sorts, and merges sublists.',
            useCase: 'Stable sorting of large datasets'
        },
        {
            name: 'Quicksort',
            path: '/sorting/quicksort',
            description: 'Fast divide and conquer algorithm using pivots to partition elements.',
            useCase: 'General-purpose sorting, large datasets'
        },
        {
            name: 'Counting Sort',
            path: '/sorting/counting_sort',
            description: 'Non-comparative integer sorting algorithm that counts occurrences.',
            useCase: 'Small range of integers'
        },
        {
            name: 'Radix Sort',
            path: '/sorting/radix_sort',
            description: 'Non-comparative sorting that processes individual digits or characters.',
            useCase: 'Fixed-length integers or strings'
        },
        {
            name: 'Bucket Sort',
            path: '/sorting/bucket_sort',
            description: 'Distributes elements into buckets, then sorts each bucket individually.',
            useCase: 'Uniformly distributed values'
        },
        {
            name: 'Heap Sort',
            path: '/sorting/heap_sort',
            description: 'Comparison-based sort using a binary heap data structure.',
            useCase: 'Systems with memory constraints'
        }
    ];

    const complexityData = [
        { name: 'Bubble Sort', best: 'O(n)', worst: 'O(n²)', average: 'O(n²)', space: 'O(1)' },
        { name: 'Selection Sort', best: 'O(n²)', worst: 'O(n²)', average: 'O(n²)', space: 'O(1)' },
        { name: 'Insertion Sort', best: 'O(n)', worst: 'O(n²)', average: 'O(n²)', space: 'O(1)' },
        { name: 'Merge Sort', best: 'O(n log n)', worst: 'O(n log n)', average: 'O(n log n)', space: 'O(n)' },
        { name: 'Quicksort', best: 'O(n log n)', worst: 'O(n²)', average: 'O(n log n)', space: 'O(log n)' },
        { name: 'Counting Sort', best: 'O(n+k)', worst: 'O(n+k)', average: 'O(n+k)', space: 'O(k)' },
        { name: 'Radix Sort', best: 'O(nk)', worst: 'O(nk)', average: 'O(nk)', space: 'O(n+k)' },
        { name: 'Bucket Sort', best: 'O(n+k)', worst: 'O(n²)', average: 'O(n)', space: 'O(n+k)' },
        { name: 'Heap Sort', best: 'O(n log n)', worst: 'O(n log n)', average: 'O(n log n)', space: 'O(1)' },
        { name: 'Shell Sort', best: 'O(n log n)', worst: 'O(n²)', average: 'O(n log n)', space: 'O(1)' },
    ];

    const stabilityData = [
        { name: 'Bubble Sort', stable: 'Yes', notes: 'Naturally stable, preserves order of equal elements' },
        { name: 'Selection Sort', stable: 'No', notes: 'Can change relative order of equal elements during swaps' },
        { name: 'Insertion Sort', stable: 'Yes', notes: 'Only moves elements when necessary, preserving order' },
        { name: 'Merge Sort', stable: 'Yes', notes: 'Carefully preserves order during merge operations' },
        { name: 'Quicksort', stable: 'No', notes: 'Standard implementation changes relative order during partitioning' },
        { name: 'Counting Sort', stable: 'Yes', notes: 'When implemented correctly with stable counting' },
        { name: 'Radix Sort', stable: 'Yes', notes: 'When used with stable sort for each digit' },
        { name: 'Bucket Sort', stable: 'Yes', notes: 'When buckets are sorted with a stable algorithm' },
        { name: 'Heap Sort', stable: 'No', notes: 'Elements with same key can change order during heap operations' },
        { name: 'Shell Sort', stable: 'No', notes: 'Exchanges may change relative order of equivalent elements' },
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
                                <FaSort className="text-3xl text-indigo-400" />
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                                Sorting Algorithms
                            </h1>
                            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                                Explore, visualize, and understand the inner workings of various sorting algorithms through interactive demonstrations
                            </p>
                            <div className="pt-4">
                                <a href="#explore" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-3 rounded-lg font-medium">
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
                        <button
                            onClick={() => setActiveTab('stability')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'stability' ? 'bg-indigo-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                                }`}
                        >
                            <FaInfoCircle />
                            Stability
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
                                        className="group bg-gradient-to-br from-gray-800/80 to-indigo-900/30 p-6 rounded-xl hover:from-indigo-900/50 hover:to-purple-900/30 transition-all duration-300 border border-indigo-500/20 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold group-hover:text-indigo-300 transition-colors">{algo.name}</h2>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors">
                                                <FaEye className="text-indigo-400" />
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
                                <h2 className="text-3xl font-bold mb-4">Time & Space Complexity</h2>
                                <p className="text-gray-300">Compare the algorithmic efficiency of different sorting methods across various scenarios</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-indigo-500/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-indigo-900/30">
                                                <th className="p-4 border-b border-indigo-500/20 rounded-tl-lg">Algorithm</th>
                                                <th className="p-4 border-b border-indigo-500/20">Best Case</th>
                                                <th className="p-4 border-b border-indigo-500/20">Average Case</th>
                                                <th className="p-4 border-b border-indigo-500/20">Worst Case</th>
                                                <th className="p-4 border-b border-indigo-500/20 rounded-tr-lg">Space</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {complexityData.map((algo, index) => (
                                                <tr
                                                    key={algo.name}
                                                    className={`hover:bg-indigo-900/20 transition-colors ${index === complexityData.length - 1 ? 'last-row' : ''
                                                        }`}
                                                >
                                                    <td className={`p-4 border-b border-indigo-500/10 font-medium ${index === complexityData.length - 1 ? 'rounded-bl-lg' : ''
                                                        }`}>
                                                        {algo.name}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${algo.best === 'O(n)' ? 'text-green-400' :
                                                        algo.best.includes('log') ? 'text-blue-400' : 'text-gray-300'
                                                        }`}>
                                                        {algo.best}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${algo.average === 'O(n)' ? 'text-green-400' :
                                                        algo.average.includes('log') ? 'text-blue-400' :
                                                            algo.average.includes('²') ? 'text-orange-400' : 'text-gray-300'
                                                        }`}>
                                                        {algo.average}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${algo.worst === 'O(n)' ? 'text-green-400' :
                                                        algo.worst.includes('log') ? 'text-blue-400' :
                                                            algo.worst.includes('²') ? 'text-orange-400' : 'text-gray-300'
                                                        }`}>
                                                        {algo.worst}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${index === complexityData.length - 1 ? 'rounded-br-lg' : ''}`}>
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

                    {/* Stability Table */}
                    {activeTab === 'stability' && (
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto mb-8">
                                <h2 className="text-3xl font-bold mb-4">Algorithm Stability</h2>
                                <p className="text-gray-300">Understand the stability properties of different sorting algorithms</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-indigo-500/20">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-indigo-900/30">
                                                <th className="p-4 border-b border-indigo-500/20 rounded-tl-lg">Algorithm</th>
                                                <th className="p-4 border-b border-indigo-500/20">Stable</th>
                                                <th className="p-4 border-b border-indigo-500/20 rounded-tr-lg">Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stabilityData.map((algo, index) => (
                                                <tr
                                                    key={algo.name}
                                                    className={`hover:bg-indigo-900/20 transition-colors ${index === stabilityData.length - 1 ? 'last-row' : ''
                                                        }`}
                                                >
                                                    <td className={`p-4 border-b border-indigo-500/10 font-medium ${index === stabilityData.length - 1 ? 'rounded-bl-lg' : ''
                                                        }`}>
                                                        {algo.name}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 ${algo.stable === 'Yes' ? 'text-green-400' : 'text-red-400'}`}>
                                                        {algo.stable}
                                                    </td>
                                                    <td className={`p-4 border-b border-indigo-500/10 text-gray-400 ${index === stabilityData.length - 1 ? 'rounded-br-lg' : ''}`}>
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
                <footer className="bg-gray-800 text-gray-400 text-center p-6 mt-auto">
                    © {new Date().getFullYear()} Sorting Algorithm Visualizer. All rights reserved.
                </footer>
            </div>


        </>
    );
}