import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DFS_Explanation = () => {
    // Function to copy pseudocode to clipboard
    const handleCopy = () => {
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
        navigator.clipboard.writeText(pseudocode);
        toast.success('Pseudocode copied to clipboard!', {
            style: {
                background: '#333',
                color: '#fff',
                border: '1px solid #9333ea',
            },
        });
    };

    // Function to share pseudocode (simulated; adjust for real sharing)
    const handleShare = () => {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 bg-gradient-to-br from-gray-800/90 to-gray-700/90 p-8 rounded-3xl shadow-2xl border border-purple-600/50 backdrop-blur-md"
        >
            <h2 className="text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 tracking-tight">
                Depth-First Search Explained
            </h2>
            <p className="text-gray-200 mb-6 text-lg leading-relaxed text-center max-w-3xl mx-auto font-light">
                DFS explores a graph by <span className="text-purple-300 font-semibold">diving deep</span> into each branch before backtracking. It leverages a <span className="text-indigo-300 font-semibold">stack</span>—either implicitly via recursion or explicitly—to track nodes for exploration.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Key Details */}
                <div className="bg-gray-900/50 p-6 rounded-2xl shadow-inner border border-purple-500/30">
                    <h3 className="text-2xl font-semibold mb-4 text-purple-300 tracking-wide">Key Details</h3>
                    <ul className="text-gray-200 list-none space-y-3">
                        {[
                            { label: 'Time Complexity', value: 'O(V + E)', color: 'text-purple-400' },
                            { label: 'Space Complexity', value: 'O(V)', color: 'text-purple-400' },
                            { label: 'Traversal', value: 'Deep exploration', color: 'text-purple-400' },
                            { label: 'Best Use', value: 'Pathfinding, topological sorting', color: 'text-purple-400' },
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span className="font-semibold text-purple-300">{item.label}:</span>
                                <span className={`${item.color} font-medium`}>{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pseudocode with Buttons */}
                <div className="relative bg-gray-900/70 p-6 rounded-2xl shadow-inner border border-purple-500/40 overflow-hidden">
                    <h3 className="text-2xl font-semibold mb-4 text-purple-300 tracking-wide">Pseudocode</h3>
                    <div className="relative">
                        <pre className="bg-gray-800/90 p-5 rounded-xl text-sm text-gray-200 font-mono leading-relaxed shadow-lg border border-purple-600/30 overflow-x-auto">
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
                        {/* Button Container */}
                        <div className="absolute top-4 right-4 flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                            >
                                <Copy size={16} />
                                <span className="text-sm font-semibold">Copy</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(147, 51, 234, 0.5)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full shadow-md hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
                            >
                                <Share2 size={16} />
                                <span className="text-sm font-semibold">Share</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DFS_Explanation;