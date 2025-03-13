"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiInfo, FiBook, FiSettings, FiMessageSquare, FiUser } from 'react-icons/fi';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    // Menu items
    const menuItems = [
        { name: 'Home', icon: <FiHome />, link: '/' },
        { name: 'About', icon: <FiInfo />, link: '/about' },
        { name: 'Services', icon: <FiSettings />, link: '/services' },
        { name: 'Blog', icon: <FiBook />, link: '/blog' },
        { name: 'Contact', icon: <FiMessageSquare />, link: '/contact' },
    ];

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 shadow-lg' : 'bg-black/50'}`}>
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
                                NovaStar
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation (hidden when drawer is used) */}
                    <nav className="hidden lg:flex space-x-8">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <Link
                                    href={item.link}
                                    className="text-gray-200 hover:text-purple-300 font-medium transition-colors relative group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                                </Link>
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
                            className="text-white p-2 rounded-full hover:bg-gray-700/50 transition-all"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Drawer for all screen sizes */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur-lg shadow-xl z-50 overflow-y-auto"
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

                            {/* Menu Items */}
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 text-gray-200 hover:text-purple-300 transition-all"
                                    >
                                        <span className="text-purple-400">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* User Profile */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: menuItems.length * 0.05 }}
                                className="pt-4 mt-4 border-t border-gray-700/50"
                            >
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 text-gray-200 hover:text-purple-300 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                                        <FiUser className="text-white" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Profile</div>
                                        <div className="text-xs text-gray-400">View your account</div>
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;