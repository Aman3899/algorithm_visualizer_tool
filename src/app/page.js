"use client";

import React, { useState, useEffect } from 'react';
import { FaSort, FaSearch, FaCodeBranch, FaGithub, FaLinkedin, FaTwitter, FaTable } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight, MdSpeed, MdEmojiObjects, MdTimeline } from 'react-icons/md';
import { RiLightbulbFlashLine, RiRocketLine } from 'react-icons/ri';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const HomePage = () => {
    const [activeAlgorithm, setActiveAlgorithm] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    const algorithms = [
        "Bubble Sort",
        "Quick Sort",
        "Merge Sort",
        "Binary Search",
        "Depth-First Search",
        "Breadth-First Search",
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        const interval = setInterval(() => {
            setActiveAlgorithm((prev) => (prev + 1) % algorithms.length);
        }, 2500);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        hover: { scale: 1.05, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)', transition: { duration: 0.3 } },
        tap: { scale: 0.95 },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const staggeredVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const featureVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col items-center justify-start px-4 py-16 font-sans overflow-hidden">
                {/* Hero Section with Enhanced Particle Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent"></div>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30"
                            style={{
                                width: Math.random() * 12 + 6,
                                height: Math.random() * 12 + 6,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * -120 - 60],
                                x: [0, Math.random() * 50 - 25],
                                opacity: [0, 0.5, 0],
                            }}
                            transition={{
                                duration: Math.random() * 12 + 8,
                                repeat: Infinity,
                                repeatType: 'loop',
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>

                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    style={{ opacity, scale }}
                    className="text-center max-w-5xl mb-20 pt-24 relative z-10"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Discover Algorithm Visualizations
                    </motion.h1>

                    <motion.div
                        className="relative h-12 overflow-hidden mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <motion.div
                            className="absolute w-full h-full flex flex-col items-center justify-center"
                            animate={{ y: `-${activeAlgorithm * 100}%` }}
                            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        >
                            {algorithms.map((algo, index) => (
                                <div key={index} className="h-12 flex items-center justify-center">
                                    <span className="text-2xl md:text-3xl font-mono text-indigo-300 drop-shadow-md">
                                        {algo}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Embark on a journey through the realm of algorithms with stunning interactive visualizations. Master the art of computation with real-time animations and intuitive controls.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#categories"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl shadow-indigo-900/40"
                            >
                                Start Exploring <MdOutlineKeyboardArrowRight className="ml-2 text-2xl" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#features"
                                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-purple-500 hover:border-purple-400 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-purple-500/10"
                            >
                                Learn More <RiLightbulbFlashLine className="ml-2 text-xl" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <section id="features" className="w-full max-w-6xl mb-24 px-4 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-center text-indigo-300 mb-16 drop-shadow-lg"
                    >
                        Why Choose AlgoViz?
                    </motion.h2>

                    <motion.div
                        variants={staggeredVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[
                            {
                                icon: <MdSpeed className="text-5xl text-indigo-400" />,
                                title: 'Intuitive Learning',
                                description:
                                    'Break down complex algorithms into digestible visuals, perfect for beginners and experts alike.',
                            },
                            {
                                icon: <RiRocketLine className="text-5xl text-purple-400" />,
                                title: 'Accelerated Mastery',
                                description:
                                    'Speed up your learning curve with dynamic animations that reveal algorithmic processes in action.',
                            },
                            {
                                icon: <MdEmojiObjects className="text-5xl text-pink-400" />,
                                title: 'Deeper Insights',
                                description:
                                    'Build a profound understanding of efficiency and logic through interactive experimentation.',
                            },
                            {
                                icon: <MdTimeline className="text-5xl text-indigo-400" />,
                                title: 'Step-by-Step Clarity',
                                description:
                                    'Trace every move of an algorithm with detailed, animated breakdowns of each operation.',
                            },
                            {
                                icon: <FaCodeBranch className="text-5xl text-purple-400" />,
                                title: 'Comparative Analysis',
                                description:
                                    'Evaluate algorithms side-by-side to see their performance differences in real time.',
                            },
                            {
                                icon: <RiLightbulbFlashLine className="text-5xl text-pink-400" />,
                                title: 'Real-World Relevance',
                                description:
                                    'Connect theory to practice by exploring how algorithms solve everyday computational challenges.',
                            },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={featureVariants}
                                className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/40 hover:border-indigo-400 transition-all duration-300 shadow-lg"
                            >
                                <div className="flex items-center mb-4">
                                    {feature.icon}
                                    <h3 className="text-xl md:text-2xl font-semibold ml-4 text-white">{feature.title}</h3>
                                </div>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="w-full max-w-7xl mb-24 px-4 relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-center text-indigo-300 mb-16 drop-shadow-lg"
                    >
                        Explore Visualization Categories
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Sorting Card */}
                        <Link href="/sorting">
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-gradient-to-br from-indigo-800/90 to-indigo-600/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-indigo-500/60 flex flex-col text-center cursor-pointer transition-all duration-300 group h-full"
                            >
                                <div className="relative mb-6">
                                    <FaSort className="text-7xl text-indigo-300 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-200" />
                                    <motion.div
                                        className="absolute -inset-6 rounded-full bg-indigo-500/20"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Sorting Algorithms</h3>
                                <p className="text-gray-200 mb-6 text-sm md:text-base">
                                    Watch sorting algorithms rearrange data with vibrant animations. Adjust speed, input custom arrays, and see time complexity in action.
                                </p>
                                <ul className="text-gray-300 text-sm md:text-base self-start text-left mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2" /> Bubble Sort - O(n²)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2" /> Merge Sort - O(n log n)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2" /> Quick Sort - O(n log n)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-indigo-400 mr-2" /> Heap Sort - O(n log n)
                                    </li>
                                </ul>
                                <div className="mt-auto">
                                    <span className="text-indigo-300 font-medium group-hover:underline group-hover:text-indigo-200 transition-all duration-300">
                                        Explore Sorting →
                                    </span>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Searching Card */}
                        <Link href="/searching">
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-gradient-to-br from-purple-800/90 to-purple-600/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-purple-500/60 flex flex-col text-center cursor-pointer transition-all duration-300 group h-full"
                            >
                                <div className="relative mb-6">
                                    <FaSearch className="text-7xl text-purple-300 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-200" />
                                    <motion.div
                                        className="absolute -inset-6 rounded-full bg-purple-500/20"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                    />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Searching Algorithms</h3>
                                <p className="text-gray-200 mb-6 text-sm md:text-base">
                                    Dive into search algorithms with real-time tracking of comparisons and bounds. Customize targets and see efficiency visualized.
                                </p>
                                <ul className="text-gray-300 text-sm md:text-base self-start text-left mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-purple-400 mr-2" /> Binary Search - O(log n)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-purple-400 mr-2" /> Linear Search - O(n)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-purple-400 mr-2" /> DFS - O(V + E)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-purple-400 mr-2" /> BFS - O(V + E)
                                    </li>
                                </ul>
                                <div className="mt-auto">
                                    <span className="text-purple-300 font-medium group-hover:underline group-hover:text-purple-200 transition-all duration-300">
                                        Explore Searching →
                                    </span>
                                </div>
                            </motion.div>
                        </Link>

                        {/* Data Structures Card */}
                        <Link href="/basic_dsa">
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-gradient-to-br from-pink-800/90 to-pink-600/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-pink-500/60 flex flex-col text-center cursor-pointer transition-all duration-300 group h-full"
                            >
                                <div className="relative mb-6">
                                    <FaTable className="text-7xl text-pink-300 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-200" />
                                    <motion.div
                                        className="absolute -inset-6 rounded-full bg-pink-500/20"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                    />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Data Structures</h3>
                                <p className="text-gray-200 mb-6 text-sm md:text-base">
                                    Visualize the mechanics of data structures with interactive diagrams and animations for operations like insertion and deletion.
                                </p>
                                <ul className="text-gray-300 text-sm md:text-base self-start text-left mb-6 space-y-2">
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-pink-400 mr-2" /> Arrays - O(1) access
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-pink-400 mr-2" /> Linked Lists - O(n)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-pink-400 mr-2" /> Stacks - O(1)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-pink-400 mr-2" /> Graphs - O(V + E)
                                    </li>
                                </ul>
                                <div className="mt-auto">
                                    <span className="text-pink-300 font-medium group-hover:underline group-hover:text-pink-200 transition-all duration-300">
                                        Explore Data Structures →
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="w-full max-w-6xl mb-12 px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center"
                    >
                        <h3 className="text-2xl md:text-3xl font-semibold text-indigo-300 mb-4">
                            Connect With Us
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Follow us for updates, contribute to the project, or reach out with suggestions!
                        </p>
                        <div className="flex justify-center items-center space-x-8">
                            {[
                                { href: 'https://github.com/your-github', icon: <FaGithub className="text-2xl" /> },
                                { href: 'https://linkedin.com/in/your-linkedin', icon: <FaLinkedin className="text-2xl" /> },
                                { href: 'https://twitter.com/your-twitter', icon: <FaTwitter className="text-2xl" /> },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-400 hover:text-indigo-300 transition-all duration-300"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </footer>
            </div>
        </>
    );
};

export default HomePage;