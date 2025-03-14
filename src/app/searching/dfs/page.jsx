"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaRandom, FaChartBar, FaSearch } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import DFS_Explanation from '@/components/searching/dfs_explanation';


const DFSVisualizer = () => {
    const [graph, setGraph] = useState({});
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [searching, setSearching] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [visited, setVisited] = useState(new Set());
    const [currentNode, setCurrentNode] = useState(null);
    const [path, setPath] = useState([]);
    const [nodeCount, setNodeCount] = useState(10);
    const timeoutRef = useRef(null);
    const searchingRef = useRef(false);

    // Generate random graph
    const generateRandomGraph = () => {
        const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
            id: i,
            x: Math.random() * 600 + 100, // Within visualization area
            y: Math.random() * 300 + 100,
        }));
        const newGraph = {};
        const newEdges = [];
        newNodes.forEach(node => (newGraph[node.id] = []));

        // Add random edges (ensure connectivity)
        for (let i = 0; i < nodeCount * 1.5; i++) {
            const src = Math.floor(Math.random() * nodeCount);
            const dest = Math.floor(Math.random() * nodeCount);
            if (src !== dest && !newGraph[src].includes(dest)) {
                newGraph[src].push(dest);
                newGraph[dest].push(src); // Undirected graph
                newEdges.push({ src, dest });
            }
        }

        setNodes(newNodes);
        setGraph(newGraph);
        setEdges(newEdges);
        resetState();
    };

    // Reset state
    const resetState = () => {
        setCompleted(false);
        setVisited(new Set());
        setCurrentNode(null);
        setPath([]);
    };

    useEffect(() => {
        generateRandomGraph();
    }, [nodeCount]);

    useEffect(() => {
        searchingRef.current = searching;
    }, [searching]);

    // DFS Implementation
    const depthFirstSearch = async () => {
        setSearching(true);
        searchingRef.current = true;
        const stack = [0]; // Start from node 0
        const visitedSet = new Set();
        const traversalPath = [];

        while (stack.length > 0 && searchingRef.current) {
            const node = stack.pop();
            if (!visitedSet.has(node)) {
                visitedSet.add(node);
                setCurrentNode(node);
                traversalPath.push(node);
                setVisited(new Set(visitedSet));
                setPath([...traversalPath]);
                await new Promise(resolve => (timeoutRef.current = setTimeout(resolve, 1000 - speed * 9)));

                // Push neighbors in reverse order (for stack behavior)
                const neighbors = graph[node].slice().reverse();
                for (const neighbor of neighbors) {
                    if (!visitedSet.has(neighbor)) {
                        stack.push(neighbor);
                    }
                }
            }
        }

        if (searchingRef.current) {
            setCompleted(true);
            setSearching(false);
            searchingRef.current = false;
            setCurrentNode(null);
        }
    };

    const handleStart = () => {
        if (!searching && !completed) depthFirstSearch();
    };

    const handlePause = () => {
        setSearching(false);
        searchingRef.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleReset = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setSearching(false);
        searchingRef.current = false;
        generateRandomGraph();
    };

    const handleNodeCountChange = newCount => {
        if (!searching) {
            setNodeCount(newCount);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex items-center justify-center px-4 py-24 max-sm:py-20 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-7xl bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-600/40 overflow-hidden"
                >
                    <h1 className="text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
                        Depth-First Search Visualizer
                    </h1>

                    {/* Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: <FaPlay />, text: 'Start', onClick: handleStart, disabled: searching || completed, bg: 'bg-emerald-600' },
                            { icon: <FaPause />, text: 'Pause', onClick: handlePause, disabled: !searching, bg: 'bg-amber-600' },
                            { icon: <FaRedo />, text: 'Reset', onClick: handleReset, bg: 'bg-rose-600' },
                            { icon: <FaRandom />, text: 'Random', onClick: generateRandomGraph, disabled: searching, bg: 'bg-purple-600' },
                        ].map((btn, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`flex items-center justify-center gap-2 p-4 rounded-xl text-lg font-semibold ${btn.bg} ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125'} transition-all duration-300`}
                            >
                                {btn.icon} {btn.text}
                            </motion.button>
                        ))}
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <FaChartBar /> Nodes
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="20"
                                value={nodeCount}
                                onChange={e => handleNodeCountChange(parseInt(e.target.value))}
                                disabled={searching}
                                className="w-full accent-purple-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{nodeCount} nodes</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 text-lg font-semibold">
                                <MdSpeed /> Speed
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={speed}
                                onChange={e => setSpeed(parseInt(e.target.value))}
                                className="w-full accent-purple-500 cursor-pointer"
                            />
                            <span className="text-xs text-gray-300">{speed}%</span>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="bg-gray-700/70 rounded-3xl p-6 h-[500px] relative border border-purple-600/40 overflow-hidden">
                        <svg className="absolute top-0 left-0 w-full h-full">
                            {edges.map((edge, idx) => {
                                const srcNode = nodes[edge.src];
                                const destNode = nodes[edge.dest];
                                return (
                                    <line
                                        key={idx}
                                        x1={srcNode.x}
                                        y1={srcNode.y}
                                        x2={destNode.x}
                                        y2={destNode.y}
                                        stroke="#6b7280"
                                        strokeWidth="2"
                                        className="opacity-50"
                                    />
                                );
                            })}
                        </svg>
                        {nodes.map(node => (
                            <motion.div
                                key={node.id}
                                className={`absolute rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 ${completed && visited.has(node.id)
                                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-400 shadow-emerald-500/40'
                                        : currentNode === node.id
                                            ? 'bg-gradient-to-br from-yellow-600 to-yellow-400 shadow-yellow-500/40'
                                            : visited.has(node.id)
                                                ? 'bg-gradient-to-br from-cyan-600 to-cyan-400 shadow-cyan-500/40'
                                                : 'bg-gradient-to-br from-purple-600 to-purple-400 shadow-purple-500/40'
                                    }`}
                                style={{ left: node.x - 24, top: node.y - 24 }}
                                animate={{
                                    scale: currentNode === node.id ? 1.2 : 1,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                {node.id}
                            </motion.div>
                        ))}
                    </div>

                    <DFS_Explanation />
                </motion.div>
            </div>

        </>
    );
};

export default DFSVisualizer;