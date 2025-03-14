"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiInfo, FiBook, FiSettings, FiMessageSquare, FiUser, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { FaSort, FaSearch, FaChartBar, FaTable } from 'react-icons/fa';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openCategory, setOpenCategory] = useState(null);
    const [openMobileCategory, setOpenMobileCategory] = useState(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close drawer on resize if open
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024 && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    // Categories and algorithms
    const categories = [
        {
            name: 'Sorting',
            icon: <FaSort />,
            algorithms: [
                { name: 'Bubble Sort', path: '/bubble_sort' },
                { name: 'Selection Sort', path: '/selection_sort' },
                { name: 'Insertion Sort', path: '/insertion_sort' },
                { name: 'Merge Sort', path: '/merge_sort' },
                { name: 'Quicksort', path: '/quicksort' },
                { name: 'Heap Sort', path: '/heap_sort' },
            ]
        },
        {
            name: 'Searching',
            icon: <FaSearch />,
            algorithms: [
                { name: 'Linear Search', path: '/linear_search' },
                { name: 'Binary Search', path: '/binary_search' },
                { name: 'Depth-First Search', path: '/dfs' },
                { name: 'Breadth-First Search', path: '/bfs' },
            ]
        },
        {
            name: 'Data Structures',
            icon: <FaTable />,
            algorithms: [
                { name: 'Arrays', path: '/arrays' },
                { name: 'Linked Lists', path: '/linked_lists' },
                { name: 'Stacks & Queues', path: '/stacks_queues' },
                { name: 'Trees', path: '/trees' },
                { name: 'Graphs', path: '/graphs' },
            ]
        },
    ];

    // Menu items
    const menuItems = [
        { name: 'Home', icon: <FiHome />, link: '/' },
        { name: 'Algorithms', icon: <FaChartBar />, link: '/algorithms', isCategory: true },
        { name: 'About', icon: <FiInfo />, link: '/about' },
        { name: 'Blog', icon: <FiBook />, link: '/blog' },
        { name: 'Contact', icon: <FiMessageSquare />, link: '/contact' },
    ];

    const handleCategoryHover = (categoryName) => {
        setOpenCategory(categoryName);
    };

    const handleCategoryLeave = () => {
        setOpenCategory(null);
    };

    const toggleMobileCategory = (categoryName) => {
        if (openMobileCategory === categoryName) {
            setOpenMobileCategory(null);
        } else {
            setOpenMobileCategory(categoryName);
        }
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-black/50 backdrop-blur-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo and company name */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <Link href="/" className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center"
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
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                AlgoViz
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation (hidden on mobile) */}
                    <nav className="hidden lg:flex space-x-6">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="relative group"
                                onMouseEnter={() => item.isCategory && handleCategoryHover('Algorithms')}
                                onMouseLeave={handleCategoryLeave}
                            >
                                {item.isCategory ? (
                                    <button className="flex items-center gap-1 text-gray-200 hover:text-purple-300 font-medium transition-colors group">
                                        {item.name}
                                        <FiChevronDown className={`transition-transform duration-300 ${openCategory === 'Algorithms' ? 'rotate-180' : ''}`} />
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.link}
                                        className="text-gray-200 hover:text-purple-300 font-medium transition-colors relative group"
                                    >
                                        {item.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                                    </Link>
                                )}

                                {/* Dropdown Menu for Categories */}
                                {item.isCategory && openCategory === 'Algorithms' && (
                                    <div className="absolute top-full left-0 pt-2 w-64">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-xl border border-purple-500/20 overflow-hidden"
                                        >
                                            <div className="p-2">
                                                {categories.map((category, catIndex) => (
                                                    <div key={catIndex} className="mb-2 last:mb-0">
                                                        <div className="flex items-center gap-2 p-2 text-purple-300 font-medium border-b border-purple-500/20">
                                                            <span>{category.icon}</span>
                                                            {category.name}
                                                        </div>
                                                        <div className="pl-4">
                                                            {category.algorithms.map((algo, algoIndex) => (
                                                                <Link
                                                                    key={algoIndex}
                                                                    href={algo.path}
                                                                    className="flex items-center py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-purple-600/20 rounded-md my-1 transition-colors"
                                                                >
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-2"></span>
                                                                    {algo.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </nav>

                    {/* Menu Button */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2 rounded-full hover:bg-gray-700/50 transition-all lg:hidden"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </motion.button>

                        {/* CTA Button (visible only on desktop) */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden lg:block ml-6"
                        >
                            <Link
                                href="/bubble_sort"
                                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                            >
                                Try Visualizer
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-0 right-0 h-full w-full sm:w-80 bg-gray-900/95 backdrop-blur-lg shadow-xl z-50 overflow-y-auto"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {/* Close Button */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(false)}
                                className="self-end text-white p-2 rounded-full hover:bg-gray-700/50 transition-all"
                            >
                                <FiX size={24} />
                            </motion.button>

                            {/* Mobile Menu Items */}
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {item.isCategory ? (
                                        <div>
                                            <button
                                                onClick={() => toggleMobileCategory('Algorithms')}
                                                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-700/50 text-gray-200 hover:text-purple-300 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-purple-400">{item.icon}</span>
                                                    {item.name}
                                                </div>
                                                {openMobileCategory === 'Algorithms' ? (
                                                    <FiChevronDown className="text-purple-400" />
                                                ) : (
                                                    <FiChevronRight className="text-purple-400" />
                                                )}
                                            </button>

                                            {/* Mobile Category Dropdown */}
                                            <AnimatePresence>
                                                {openMobileCategory === 'Algorithms' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden ml-4 pl-2 border-l border-purple-500/30"
                                                    >
                                                        {categories.map((category, catIndex) => (
                                                            <div key={catIndex} className="mb-3">
                                                                <div className="flex items-center gap-2 py-2 text-purple-300 font-medium">
                                                                    <span>{category.icon}</span>
                                                                    {category.name}
                                                                </div>
                                                                <div className="space-y-1 ml-4">
                                                                    {category.algorithms.map((algo, algoIndex) => (
                                                                        <Link
                                                                            key={algoIndex}
                                                                            href={algo.path}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="flex items-center py-2 text-sm text-gray-300 hover:text-white"
                                                                        >
                                                                            <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                                                                            {algo.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.link}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 text-gray-200 hover:text-purple-300 transition-all"
                                        >
                                            <span className="text-purple-400">{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}

                             {/* CTA Button (visible on mobile) */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-4"
                            >
                                <Link
                                    href="/bubble_sort"
                                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all block text-center"
                                >
                                    Try Visualizer
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;