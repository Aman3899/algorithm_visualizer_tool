"use client";

import React from 'react';
import { FaSort, FaSearch, FaCodeBranch, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const HomePage = () => {
  const cardVariants = {
    hover: { scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' },
    tap: { scale: 0.95 },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center px-4 py-36 font-sans">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-center max-w-4xl mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Explore Algorithm Visualizers
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Dive into the world of algorithms with interactive visualizations. Learn, experiment, and understand Sorting, Searching, and Data Structures & Algorithms like never before.
          </p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="#categories"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full text-lg font-semibold transition-colors duration-300"
            >
              Get Started <MdOutlineKeyboardArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.section>

        {/* Categories Section */}
        <section id="categories" className="w-full max-w-6xl mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-300 mb-12">
            Visualization Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sorting Card */}
            <Link href="/sorting">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-indigo-800 to-indigo-600 p-8 rounded-3xl shadow-lg border border-indigo-500/50 flex flex-col items-center text-center cursor-pointer transition-all duration-300"
              >
                <FaSort className="text-6xl text-indigo-300 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Sorting Algorithms</h3>
                <p className="text-gray-200">
                  Visualize how sorting algorithms like Merge Sort, QuickSort, and more rearrange data step-by-step.
                </p>
              </motion.div>
            </Link>

            {/* Searching Card */}
            <Link href="/searching">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-purple-800 to-purple-600 p-8 rounded-3xl shadow-lg border border-purple-500/50 flex flex-col items-center text-center cursor-pointer transition-all duration-300"
              >
                <FaSearch className="text-6xl text-purple-300 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Searching Algorithms</h3>
                <p className="text-gray-200">
                  Explore searching techniques like Binary Search and Linear Search with real-time animations.
                </p>
              </motion.div>
            </Link>

            {/* DSA Card */}
            <Link href="/dsa">
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-br from-pink-800 to-pink-600 p-8 rounded-3xl shadow-lg border border-pink-500/50 flex flex-col items-center text-center cursor-pointer transition-all duration-300"
              >
                <FaCodeBranch className="text-6xl text-pink-300 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Data Structures & Algorithms</h3>
                <p className="text-gray-200">
                  Understand complex DSA concepts like Trees, Heaps, and Graphs through interactive visualizations.
                </p>
              </motion.div>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="w-full max-w-5xl mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-indigo-300 mb-12"
          >
            About This Project
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800/70 p-8 rounded-3xl border border-indigo-600/40"
          >
            <p className="text-gray-200 mb-6">
              This project is a collection of interactive visualizers designed to make learning algorithms engaging and intuitive. Built with Next.js, React, and Framer Motion, it offers a sleek, modern interface with real-time animations to illustrate how algorithms work under the hood.
            </p>
            <ul className="text-gray-200 list-disc list-inside">
              <li>Interactive controls to start, pause, and reset visualizations.</li>
              <li>Custom input support for experimenting with your own data.</li>
              <li>Detailed explanations and pseudocode for each algorithm.</li>
              <li>Responsive design optimized for all devices.</li>
            </ul>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-6xl py-8 border-t border-indigo-600/40 flex flex-col items-center">
          <div className="flex gap-6 mb-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-2xl text-gray-400 hover:text-indigo-400 transition-colors" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-2xl text-gray-400 hover:text-indigo-400 transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-2xl text-gray-400 hover:text-indigo-400 transition-colors" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Algorithm Visualizers. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;