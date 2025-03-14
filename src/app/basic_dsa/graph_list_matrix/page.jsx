"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash, FiInfo, FiCode, FiClock, FiCpu, FiLayers, FiTarget, FiCopy, FiShare2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import { FaEdit, FaRedo, FaRegLightbulb, FaRegCheckCircle } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { IoMdSchool } from 'react-icons/io';
import { toast } from 'react-hot-toast';

const GraphVisualizer = () => {
    const [vertices, setVertices] = useState([]);
    const [edges, setEdges] = useState([]);
    const [fromVertex, setFromVertex] = useState('');
    const [toVertex, setToVertex] = useState('');
    const [operation, setOperation] = useState('');
    const [viewMode, setViewMode] = useState('matrix'); // 'matrix' or 'list'
    const [showInputModal, setShowInputModal] = useState(false);
    const modalRef = useRef(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isHovered, setIsHovered] = useState(false);


    const pseudocode = `Graph:
    addVertex(vertex):
        add the vertex to the graph

    addEdge(vertex1, vertex2):
        add an edge between vertex1 and vertex2

    removeVertex(vertex):
        remove the vertex and all its edges

    removeEdge(vertex1, vertex2):
        remove the edge between vertex1 and vertex2

    hasEdge(vertex1, vertex2):
        return true if an edge exists between vertex1 and vertex2, false otherwise`;

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

    // Animation variants
    const itemVariants = {
        initial: { scale: 0.8, opacity: 0, y: 20 },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, type: 'spring', stiffness: 150, damping: 12 },
        },
        exit: { scale: 0.8, opacity: 0, y: -20, transition: { duration: 0.4 } },
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

    const tabs = [
        { id: 'details', label: 'Key Details', icon: <FiInfo size={18} /> },
        { id: 'code', label: 'Pseudocode', icon: <FiCode size={18} /> },
        { id: 'applications', label: 'Applications', icon: <BsGraphUp size={18} /> },
        { id: 'learn', label: 'Learn More', icon: <IoMdSchool size={18} /> },
    ];

    // Application examples
    const applications = [
        { title: 'Social Networks', description: 'Modeling relationships between users.', icon: <FiTarget size={20} className="text-pink-400" /> },
        { title: 'Route Planning', description: 'Finding shortest paths in navigation systems.', icon: <BsGraphUp size={20} className="text-blue-400" /> },
        { title: 'Network Analysis', description: 'Analyzing connections in computer networks.', icon: <FiLayers size={20} className="text-purple-400" /> },
        { title: 'Recommendation Systems', description: 'Suggesting relevant items based on user preferences.', icon: <FiCpu size={20} className="text-green-400" /> },
    ];

    // Learning resources
    const resources = [
        { title: 'Interactive Graph Visualization', url: 'https://visualgo.net/en/graphds', description: 'See Graph in action with step-by-step visualization' },
        { title: 'Graph Interview Questions', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', description: 'Practice with common interview problems' },
        { title: 'Graph vs Tree', url: 'https://www.geeksforgeeks.org/difference-between-graph-and-tree-data-structure/', description: 'Compare Graph with Tree Data structure etc.' },
    ];


    // Add vertex
    const addVertex = () => {
        if (!fromVertex || vertices.includes(fromVertex)) return;
        setVertices([...vertices, fromVertex]);
        setOperation(`Added vertex ${fromVertex}`);
        setFromVertex('');
    };

    // Add edge
    const addEdge = () => {
        if (!fromVertex || !toVertex || !vertices.includes(fromVertex) || !vertices.includes(toVertex)) return;
        if (edges.some(e => e.from === fromVertex && e.to === toVertex)) return;
        setEdges([...edges, { from: fromVertex, to: toVertex }]);
        setOperation(`Added edge ${fromVertex} -> ${toVertex}`);
        setFromVertex('');
        setToVertex('');
    };

    // Remove edge
    const removeEdge = () => {
        if (!fromVertex || !toVertex) return;
        setEdges(edges.filter(e => !(e.from === fromVertex && e.to === toVertex)));
        setOperation(`Removed edge ${fromVertex} -> ${toVertex}`);
        setFromVertex('');
        setToVertex('');
    };

    // Clear graph
    const clearGraph = () => {
        setVertices([]);
        setEdges([]);
        setOperation('Graph cleared');
        setFromVertex('');
        setToVertex('');
    };

    // Build adjacency matrix
    const buildAdjacencyMatrix = () => {
        const matrix = Array(vertices.length).fill().map(() => Array(vertices.length).fill(0));
        edges.forEach(edge => {
            const fromIdx = vertices.indexOf(edge.from);
            const toIdx = vertices.indexOf(edge.to);
            matrix[fromIdx][toIdx] = 1;
        });
        return matrix;
    };

    // Build adjacency list
    const buildAdjacencyList = () => {
        const adjList = {};
        vertices.forEach(vertex => {
            adjList[vertex] = edges.filter(e => e.from === vertex).map(e => e.to);
        });
        return adjList;
    };

    // Render adjacency matrix
    const renderMatrix = () => {
        const matrix = buildAdjacencyMatrix();
        return (
            <div className="overflow-x-auto">
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            <th className="p-3 bg-gray-700/50 border border-purple-500/30"></th>
                            {vertices.map(v => (
                                <th key={v} className="p-3 bg-gray-700/50 border border-purple-500/30 text-purple-300 text-center">{v}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td className="p-3 bg-gray-700/50 border border-purple-500/30 text-purple-300 text-center">{vertices[i]}</td>
                                {row.map((cell, j) => (
                                    <motion.td
                                        key={j}
                                        variants={itemVariants}
                                        initial="initial"
                                        animate="animate"
                                        className={`p-3 border border-purple-500/30 text-center ${cell ? 'bg-purple-700/50' : 'bg-gray-800/50'}`}
                                    >
                                        {cell}
                                    </motion.td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render adjacency list
    const renderList = () => {
        const adjList = buildAdjacencyList();
        return (
            <div className="flex flex-col gap-4">
                <AnimatePresence>
                    {Object.entries(adjList).map(([vertex, neighbors]) => (
                        <motion.div
                            key={vertex}
                            variants={itemVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-4 bg-gradient-to-r from-purple-700 to-violet-700 rounded-xl p-4 shadow-lg shadow-purple-500/40 border border-purple-500/60"
                        >
                            <span className="font-bold text-lg">{vertex}:</span>
                            <div className="flex flex-wrap gap-2">
                                {neighbors.length > 0 ? (
                                    neighbors.map((neighbor, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-purple-500/50 rounded-full text-sm">{neighbor}</span>
                                    ))
                                ) : (
                                    <span className="text-gray-400">No neighbors</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        );
    };

    // Handle click outside modal
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setShowInputModal(false);
        }
    };

    useEffect(() => {
        if (showInputModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showInputModal]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white px-6 pt-20 pb-12 flex flex-col items-center">
            <Navbar />

            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-extrabold mt-8 mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 tracking-tight drop-shadow-lg text-center"
            >
                Graph Visualizer
            </motion.h1>

            {/* Input and Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 w-full max-w-md bg-gray-800/90 p-6 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        value={fromVertex}
                        onChange={(e) => setFromVertex(e.target.value)}
                        className="p-3 rounded-xl bg-gray-700/70 border border-purple-500/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner text-lg"
                        placeholder="From Vertex"
                    />
                    <input
                        type="text"
                        value={toVertex}
                        onChange={(e) => setToVertex(e.target.value)}
                        className="p-3 rounded-xl bg-gray-700/70 border border-purple-500/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-inner text-lg"
                        placeholder="To Vertex"
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addVertex}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-700 to-violet-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiPlus /> Vertex
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addEdge}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiPlus /> Edge
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={removeEdge}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-700 to-pink-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FiTrash /> Edge
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearGraph}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaRedo /> Clear
                    </motion.button>
                    {/*
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInputModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-700 to-blue-700 rounded-xl text-sm font-semibold text-white shadow-lg hover:brightness-110 transition-all duration-300"
                    >
                        <FaEdit /> Custom Graph
                    </motion.button>*/}
                </div>
                <div className="mt-4 flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('matrix')}
                        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${viewMode === 'matrix' ? 'bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                        Matrix
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                        List
                    </motion.button>
                </div>
            </motion.div>

            {/* Visualization Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-4xl bg-gray-800/80 p-6 rounded-3xl border border-purple-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-2xl font-semibold mb-6 text-purple-300 drop-shadow-md">
                    {viewMode === 'matrix' ? 'Adjacency Matrix' : 'Adjacency List'}
                </h2>
                {vertices.length > 0 ? (
                    viewMode === 'matrix' ? renderMatrix() : renderList()
                ) : (
                    <p className="text-gray-400 text-xl font-medium text-center">Graph is empty. Add vertices and edges to visualize!</p>
                )}
            </motion.div>

            {/* Operation Log */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 w-full max-w-4xl bg-gray-800/80 p-6 rounded-3xl border border-violet-500/30 shadow-2xl backdrop-blur-lg"
            >
                <h2 className="text-2xl font-semibold mb-4 text-violet-300 drop-shadow-md">Operation Log</h2>
                <p className="text-gray-200 text-lg font-medium">{operation || 'No operations yet.'}</p>
            </motion.div>

            {/* Explanation Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 w-full max-w-4xl bg-gray-800/80 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl backdrop-blur-lg"
            >
                {/* Header section */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center mb-4"
                >
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 500 }}
                        className="mb-2 p-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30"
                    >
                        <FiInfo className="text-white text-2xl" />
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 tracking-tight"
                    >
                        Graph Data Structure Explained
                    </motion.h2>

                    <motion.div
                        variants={itemVariants}
                        className="relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <p className="text-gray-200 text-md leading-relaxed text-center max-w-3xl mx-auto font-light">
                            A graph is a non-linear data structure consisting of nodes (vertices) and connections between them (edges). It represents relationships between objects.
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
                                    Graphs can be directed (edges have direction) or undirected (edges are bidirectional).
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Tabs navigation */}
                <div className="mb-4">
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
                        className="min-h-[300px]"
                    >
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {/* Left section */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 rounded-2xl shadow-xl border border-indigo-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-indigo-300 tracking-wide flex items-center">
                                        <FiInfo className="mr-2 text-indigo-400" size={20} />
                                        Algorithm Characteristics
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { icon: <FiClock size={18} />, label: 'Traversal', value: 'BFS, DFS', color: 'text-indigo-400' },
                                            { icon: <FiClock size={18} />, label: 'Representation', value: 'Adj. Matrix/List', color: 'text-indigo-400' },
                                            { icon: <FiLayers size={18} />, label: 'Space Complexity', value: 'O(V+E)', color: 'text-blue-400' },
                                            { icon: <FiCpu size={18} />, label: 'Connectivity', value: 'Connected, Disconnected', color: 'text-cyan-400' },
                                            { icon: <FiTarget size={18} />, label: 'Cycles', value: 'Cyclic, Acyclic', color: 'text-green-400' },
                                        ].map((item, idx) => (
                                            <motion.li
                                                key={idx}
                                                variants={itemVariants}
                                                className="flex items-center gap-3 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition duration-300"
                                            >
                                                <div className="p-2 rounded-lg bg-gray-700/70 text-indigo-400">
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
                                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-4 rounded-2xl shadow-xl border border-indigo-500/30 backdrop-blur-sm"
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-indigo-300 tracking-wide flex items-center">
                                        <BsGraphUp className="mr-2 text-indigo-400" size={20} />
                                        Key Properties
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            "Consists of vertices and edges connecting them.",
                                            "Can be directed (edges have direction) or undirected.",
                                            "Useful for modeling relationships between entities.",
                                            "Applications include social networks, routing, and network analysis.",
                                        ].map((item, idx) => (
                                            <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3">
                                                <div className="mt-1 min-w-[8px] h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                                <p className="text-gray-200">{item}</p>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <motion.div
                                        variants={itemVariants}
                                        className="mt-4 p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30"
                                    >
                                        <p className="text-indigo-300 font-medium flex items-center">
                                            <FaRegLightbulb className="mr-2 text-yellow-300" size={16} />
                                            Graphs are versatile data structures for representing complex relationships and networks.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Pseudocode Tab */}
                        {activeTab === 'code' && (
                            <div className="space-y-4">
                                <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-indigo-500/30">
                                    <h3 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
                                        <FiCode className="mr-2 text-indigo-400" size={20} />
                                        Pseudocode
                                    </h3>
                                    <pre className="font-mono text-sm md:text-base text-gray-200 whitespace-pre-wrap bg-gray-700/30 p-3 rounded-lg overflow-x-auto">
                                        {pseudocode}
                                    </pre>
                                </motion.div>
                                <div className="flex justify-end gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                                        onClick={handleCopy}
                                    >
                                        <FiCopy size={16} /> Copy
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                                        onClick={handleShare}
                                    >
                                        <FiShare2 size={16} /> Share
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Applications Tab */}
                        {activeTab === 'applications' && (
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                <h3 className="text-xl font-semibold mb-4 text-blue-300">Common Applications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {applications.map((app, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-3 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center mb-2">
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
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                <h3 className="text-xl font-semibold mb-4 text-indigo-300">Learning Resources</h3>
                                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                                    {resources.map((resource, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            className="bg-gray-800/70 backdrop-blur-sm p-3 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-2">
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
        </div>
    );
};
export default GraphVisualizer;