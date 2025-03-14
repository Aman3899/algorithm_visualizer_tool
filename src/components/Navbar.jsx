"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiInfo, FiBook, FiMessageSquare, FiChevronDown } from 'react-icons/fi';
import { FaSort, FaSearch, FaTable } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const drawerRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close drawer on resize if open
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024 && isOpen) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Close drawer on outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    // Categories and algorithms
    const categories = [
        {
            name: 'Sorting',
            icon: <FaSort />,
            algorithms: [
                { name: 'Bubble Sort', path: '/sorting/bubble_sort' },
                { name: 'Selection Sort', path: '/sorting/selection_sort' },
                { name: 'Insertion Sort', path: '/sorting/insertion_sort' },
                { name: 'Merge Sort', path: '/sorting/merge_sort' },
                { name: 'Quicksort', path: '/sorting/quicksort' },
                { name: 'Heap Sort', path: '/sorting/heap_sort' },
            ],
        },
        {
            name: 'Searching',
            icon: <FaSearch />,
            algorithms: [
                { name: 'Linear Search', path: '/searching/linear_search' },
                { name: 'Binary Search', path: '/searching/binary_search' },
                { name: 'Depth-First Search', path: '/searching/depth_first_search' },
                { name: 'Breadth-First Search', path: '/searching/breadth_first_search' },
            ],
        },
        {
            name: 'Data Structures',
            icon: <FaTable />,
            algorithms: [
                { name: 'Arrays', path: '/data_structures/arrays' },
                { name: 'Linked Lists', path: '/data_structures/linked_lists' },
                { name: 'Stacks & Queues', path: '/data_structures/stacks_queues' },
                { name: 'Trees', path: '/data_structures/trees' },
                { name: 'Graphs', path: '/data_structures/graphs' },
            ],
        },
    ];

    // Menu items
    const menuItems = [
        { name: 'Home', icon: <FiHome />, link: '/' },
        { name: 'About', icon: <FiInfo />, link: '/about' },
        { name: 'Blog', icon: <FiBook />, link: '/blog' },
        { name: 'Contact', icon: <FiMessageSquare />, link: '/contact' },
    ];

    return (
        <header
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-gradient-to-br from-gray-900/90 to-black/90 shadow-xl' : 'bg-gray-900/50'
                } backdrop-blur-lg`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                {/* Logo and company name */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="w-6 h-6 text-white"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </motion.div>
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
                            AlgoViz
                        </span>
                    </Link>
                </motion.div>

                {/* Menu Button */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-white p-2 rounded-full bg-gradient-to-br from-purple-600/50 to-indigo-600/50 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md"
                        aria-label="Toggle drawer"
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </motion.button>
                </motion.div>
            </div>

            {/* Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        {/* Drawer Content */}
                        <motion.div
                            ref={drawerRef}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="fixed top-0 left-0 h-full w-80 lg:w-96 bg-gradient-to-b from-gray-900 to-black shadow-2xl z-50 overflow-y-auto border-r border-purple-600/20"
                        >
                            <div className="flex flex-col p-6 space-y-6">
                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsOpen(false)}
                                    className="self-end text-white p-2 rounded-full bg-gradient-to-br from-rose-600/50 to-rose-500/50 hover:from-rose-500 hover:to-rose-400 transition-all shadow-md"
                                >
                                    <FiX size={24} />
                                </motion.button>

                                {/* Home Menu Item */}
                                {menuItems.slice(0, 1).map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={item.link}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 text-gray-200 hover:text-purple-300 transition-all duration-300"
                                        >
                                            <span className="text-purple-400">{item.icon}</span>
                                            <span className="font-semibold">{item.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Categories with Algorithms */}
                                <div className="pt-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-2xl font-bold text-indigo-400 mb-4">Algorithms</h3>
                                        <div className="space-y-3">
                                            {categories.map((category, catIndex) => (
                                                <motion.div key={catIndex}>
                                                    <button
                                                        onClick={() =>
                                                            setOpenCategory(openCategory === category.name ? null : category.name)
                                                        }
                                                        className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-gray-200 hover:text-purple-300 transition-all duration-300 shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-purple-400">{category.icon}</span>
                                                            <span className="font-medium">{category.name}</span>
                                                        </div>
                                                        <FiChevronDown
                                                            className={`text-purple-400 transition-transform duration-300 ${openCategory === category.name ? 'rotate-180' : ''
                                                                }`}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openCategory === category.name && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="ml-6 mt-2 space-y-2"
                                                            >
                                                                {category.algorithms.map((algo, algoIndex) => (
                                                                    <Link
                                                                        key={algoIndex}
                                                                        href={algo.path}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="flex items-center py-2 pl-4 text-sm text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-md transition-all duration-200"
                                                                    >
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-3" />
                                                                        {algo.name}
                                                                    </Link>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Rest of Menu Items */}
                                {menuItems.slice(1).map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: (index + 1) * 0.1 + 0.2 }}
                                    >
                                        <Link
                                            href={item.link}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 text-gray-200 hover:text-purple-300 transition-all duration-300"
                                        >
                                            <span className="text-purple-400">{item.icon}</span>
                                            <span className="font-semibold">{item.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;