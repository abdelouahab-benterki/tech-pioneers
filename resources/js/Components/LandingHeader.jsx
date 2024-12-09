import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ logo }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const menuItemVariants = {
        closed: { x: -20, opacity: 0 },
        open: i => ({
            x: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.3,
                ease: "easeOut"
            }
        })
    };

    const menuItems = [
        { text: "Home", href: "/#" },
        { text: "About", href: "/#about" },
        { text: "Sponsors", href: "/#sponsors" },
        { text: "Participants", href: "/#participants" }
    ];

    return (
        <header className="relative bg-transparent">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4 md:py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="uppercase text-xl md:text-2xl font-bold"
                    >
                        tech pioneers
                    </motion.div>

                    <button
                        className="md:hidden z-50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: isMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.div>
                    </button>

                    <nav className="hidden md:block">
                        <motion.ul
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex space-x-12 items-center uppercase"
                        >
                            {menuItems.map((item, index) => (
                                <motion.li
                                    key={item.text}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="hover:text-custom-green font-bold text-xl transition"
                                    >
                                        {item.text}
                                    </Link>
                                </motion.li>
                            ))}
                            <motion.li
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link
                                    href="/login"
                                    className="flex items-center space-x-3 bg-white text-primary px-6 py-2 rounded-full hover:text-custom-green hover:bg-secondary border-2 border-transparent hover:border-custom-green transition"
                                >
                                    <span className="font-bold text-xl">Login</span>
                                    <div className="w-8 h-8 rotate-45">
                                        <img src={logo} alt="logo" />
                                    </div>
                                </Link>
                            </motion.li>
                        </motion.ul>
                    </nav>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="md:hidden absolute top-full z-20 left-0 w-full bg-white shadow-lg"
                        >
                            <motion.ul className="flex flex-col space-y-4 p-4 bg-secondary">
                                {menuItems.map((item, index) => (
                                    <motion.li
                                        key={item.text}
                                        custom={index}
                                        variants={menuItemVariants}
                                    >
                                        <Link
                                            href={item.href}
                                            className="hover:text-custom-green font-bold text-xl transition block"
                                        >
                                            {item.text}
                                        </Link>
                                    </motion.li>
                                ))}
                                <motion.li
                                    custom={4}
                                    variants={menuItemVariants}
                                    className="w-fit ml-auto"
                                >
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center space-x-3 bg-white text-primary px-6 py-2 rounded-full hover:text-custom-green hover:bg-secondary border-2 border-transparent hover:border-custom-green transition"
                                    >
                                        <span className="font-bold text-xl">Login</span>
                                        <div className="w-8 h-8 rotate-45">
                                            <img src={logo} alt="logo" />
                                        </div>
                                    </Link>
                                </motion.li>
                            </motion.ul>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Header;
