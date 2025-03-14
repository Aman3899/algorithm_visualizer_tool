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
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const algorithms = [
        "Bubble Sort", "Quick Sort", "Merge Sort", "Binary Search", "Depth-First Search", "Breadth-First Search"
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);

        const interval = setInterval(() => {
            setActiveAlgorithm((prev) => (prev + 1) % algorithms.length);
        }, 2000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        hover: { scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' },
        tap: { scale: 0.95 },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const staggeredVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const featureVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        },
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center px-4 py-16 font-sans">
                {/* Hero Section with Particle Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-indigo-500/20"
                            style={{
                                width: Math.random() * 10 + 5,
                                height: Math.random() * 10 + 5,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * -100 - 50],
                                x: [0, Math.random() * 40 - 20],
                                opacity: [0.1, 0.4, 0],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                repeatType: "loop",
                            }}
                        />
                    ))}
                </div>

                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                    style={{ opacity, scale }}
                    className="text-center max-w-4xl mb-16 pt-20"
                >
                    <div className="relative mb-8">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Explore Algorithm Visualizers
                        </h1>
                        <motion.div
                            className="relative h-12 overflow-hidden mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.div
                                className="absolute w-full h-full flex flex-col items-center justify-center"
                                animate={{ y: `-${activeAlgorithm * 100}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            >
                                {algorithms.map((algo, index) => (
                                    <div key={index} className="h-12 flex items-center justify-center">
                                        <span className="text-2xl font-mono text-indigo-300">{algo}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>

                    <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                        Dive into the world of algorithms with immersive interactive visualizations. Learn, experiment, and understand
                        the inner workings of computing&apos;s most fundamental procedures in a sleek, modern interface.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#categories"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full text-lg font-semibold transition-colors duration-300 shadow-lg shadow-indigo-900/50"
                            >
                                Get Started <MdOutlineKeyboardArrowRight className="ml-2 text-xl" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="#features"
                                className="inline-flex items-center px-6 py-3 bg-transparent border border-indigo-500 hover:border-indigo-400 rounded-full text-lg font-semibold transition-all duration-300"
                            >
                                Learn More <RiLightbulbFlashLine className="ml-2" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Features Section */}
                <section id="features" className="w-full max-w-6xl mb-20 px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-center text-indigo-300 mb-12"
                    >
                        Why Visualize Algorithms?
                    </motion.h2>

                    <motion.div
                        variants={staggeredVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[
                            {
                                icon: <MdSpeed className="text-4xl text-indigo-400" />,
                                title: "Intuitive Learning",
                                description: "Visualizations make complex algorithms digestible and easy to understand for all skill levels."
                            },
                            {
                                icon: <RiRocketLine className="text-4xl text-purple-400" />,
                                title: "Accelerated Mastery",
                                description: "Grasp concepts faster by seeing how algorithms transform data in real-time animations."
                            },
                            {
                                icon: <MdEmojiObjects className="text-4xl text-pink-400" />,
                                title: "Deeper Understanding",
                                description: "Develop intuition about algorithmic efficiency and behavior through interactive explorations."
                            },
                            {
                                icon: <MdTimeline className="text-4xl text-indigo-400" />,
                                title: "Step-by-Step Breakdown",
                                description: "Follow each algorithm's execution path with clear, animated step-by-step visualization."
                            },
                            {
                                icon: <FaCodeBranch className="text-4xl text-purple-400" />,
                                title: "Comparative Analysis",
                                description: "Compare different algorithms side-by-side to understand their strengths and weaknesses."
                            },
                            {
                                icon: <RiLightbulbFlashLine className="text-4xl text-pink-400" />,
                                title: "Practical Applications",
                                description: "See how algorithms are applied to solve real-world problems across various domains."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={featureVariants}
                                className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    {feature.icon}
                                    <h3 className="text-xl font-semibold ml-3 text-white">{feature.title}</h3>
                                </div>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="w-full max-w-6xl mb-20 px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-center text-indigo-300 mb-12"
                    >
                        Visualization Categories
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sorting Card */}
                        <Link href="/sorting">
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-gradient-to-br from-indigo-800/80 to-indigo-600/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-indigo-500/50 flex flex-col items-center text-center cursor-pointer transition-all duration-300 group h-full"
                            >
                                <div className="relative mb-6">
                                    <FaSort className="text-6xl text-indigo-300 transition-all duration-300 group-hover:scale-110" />
                                    <motion.div
                                        className="absolute -inset-4 rounded-full bg-indigo-500/20"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Sorting Algorithms</h3>
                                <p className="text-gray-200">
                                    Visualize how sorting algorithms like Merge Sort, QuickSort, and Bubble Sort rearrange data step-by-step with color-coded animations.
                                </p>
                                <ul className="mt-4 text-gray-300 text-sm self-start">
                                    <li className="mb-1">• Bubble Sort</li>
                                    <li className="mb-1">• Merge Sort</li>
                                    <li className="mb-1">• Quick Sort</li>
                                    <li>• Heap Sort</li>
                                </ul>
                                <div className="mt-6 self-end">
                                    <span className="text-indigo-300 font-medium group-hover:underline">Explore ›</span>
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
                                className="bg-gradient-to-br from-purple-800/80 to-purple-600/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-purple-500/50 flex flex-col items-center text-center cursor-pointer transition-all duration-300 group h-full"
                            >
                                <div className="relative mb-6">
                                    <FaSearch className="text-6xl text-purple-300 transition-all duration-300 group-hover:scale-110" />
                                    <motion.div
                                        className="absolute -inset-4 rounded-full bg-purple-500/20"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                                    />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Searching Algorithms</h3>
                                <p className="text-gray-200">
                                    Explore searching techniques like Binary Search and Linear Search with real-time animations and performance comparisons.
                                </p>
                                <ul className="mt-4 text-gray-300 text-sm self-start">
                                    <li className="mb-1">• Binary Search</li>
                                    <li className="mb-1">• Linear Search</li>
                                    <li className="mb-1">• Jump Search</li>
                                    <li>• Interpolation Search</li>
                                </ul>
                                <div className="mt-6 self-end">
                                    <span className="text-purple-300 font-medium group-hover:underline">Explore ›</span>
                                </div>
                            </motion.div>
                        </Link>

                        {/* DSA Card */}
                        <Link href="/dsa">
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                whileHover="hover"
                                whileTap="tap"
                                className="bg-gradient-to-br from-pink-800/80 to-pink-600/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-pink-500/50 flex flex-col items-center text-center cursor-pointer transition-all duration-300 group h-full"
                            >
                                <div className="relative mb-6">
                                    <FaTable className="text-6xl text-pink-300 transition-all duration-300 group-hover:scale-110" />
                                    <motion.div
                                        className="absolute -inset-4 rounded-full bg-pink-500/20"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                                    />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Data Structures</h3>
                                <p className="text-gray-200">
                                    Visualize and learn about Data Structures.
                                </p>
                                <ul className="mt-4 text-gray-300 text-sm self-start">
                                    <li className="mb-1">• Arrays</li>
                                    <li className="mb-1">• Linked Lists</li>
                                    <li className="mb-1">• Stacks</li>
                                    <li>• Graphs</li>
                                </ul>
                                <div className="mt-6 self-end">
                                    <span className="text-pink-300 font-medium group-hover:underline">Explore ›</span>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </section>

                {/* Social Links Section */}
                <footer className="flex justify-center items-center mb-8 space-x-6">
                    <motion.a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                        <FaGithub className="text-xl" />
                    </motion.a>
                    <motion.a href="https://linkedin.com/in/your-linkedin" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                        <FaLinkedin className="text-xl" />
                    </motion.a>
                    <motion.a href="https://twitter.com/your-twitter" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
                        <FaTwitter className="text-xl" />
                    </motion.a>
                </footer>
            </div>
        </>
    );
};

export default HomePage;