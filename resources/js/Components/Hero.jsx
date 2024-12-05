import React from 'react';
import { motion } from 'framer-motion';
import  greenStar  from '../../images/green-star.png';
import  yellowStar  from '../../images/yellow-star.png';

const Hero = ({ logo }) => {
    const fadeInUp = {
        initial: {
            opacity: 0,
            y: 60
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };

    const lineAnimation = {
        initial: { scale: 0 },
        animate: {
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.6, -0.05, 0.01, 0.99],
                delay: 0.8
            }
        }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <main className="font-spacegrotesk">
            <section className="relative min-h-screen pt-20 lg:pt-24">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        {/* Decoration Particles */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="hidden lg:block absolute -right-32 top-60 z-0 h-20 w-auto">
                            <img src={greenStar} className={"h-full w-auto object-contain"} alt="green star"/>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="hidden lg:block absolute right-96 -bottom-96 z-0 h-12 w-auto">
                            <img src={yellowStar} className={"h-full w-auto object-contain"} alt="yellow star"/>
                        </motion.div>
                        {/* Background Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-[500px] lg:block absolute md:-left-20 md:top-0 top-36 z-0 md:h-[950px] w-auto"
                        >
                            <img src={logo} alt="tech pioneers logo" className="h-full w-auto object-contain"/>
                        </motion.div>

                        {/* Content Container */}
                        <motion.div
                            variants={stagger}
                            initial="initial"
                            animate="animate"
                            className="relative z-10 flex flex-col lg:flex-row lg:justify-end"
                        >
                            {/* Main Title */}
                            <div className="text-center lg:text-right">
                                <div className="relative">
                                    <motion.div
                                        variants={fadeInUp}
                                        className="text-4xl md:text-6xl lg:text-[150px] leading-tight font-bold uppercase relative"
                                    >
                                        <p>Tech<br/>Pioneers</p>

                                        {/* Decorative Lines */}
                                        <motion.div
                                            variants={lineAnimation}
                                            className="hidden lg:block w-48 h-[1.5px] bg-white absolute -top-6 right-64 origin-left"
                                        />
                                        <motion.div
                                            variants={lineAnimation}
                                            className="hidden lg:block w-[1.5px] h-48 bg-white absolute -top-12 right-[25rem] origin-top"
                                        />
                                    </motion.div>

                                    {/* Subtitle */}
                                    <motion.div
                                        variants={fadeInUp}
                                        className="mt-4 px-4 lg:px-0"
                                    >
                                        <p className="text-xl md:text-2xl lg:text-4xl lg:w-1/2 ml-auto font-medium">
                                            Where Engineering Excellence Meets Innovation Empowering
                                            Algeria's Next Generation of Tech Leaders
                                        </p>

                                        {/* Bottom Decorative Lines */}
                                        <motion.div
                                            variants={lineAnimation}
                                            className="hidden lg:block w-48 h-[1.5px] bg-white absolute -bottom-16 -right-16 origin-left"
                                        />
                                        <motion.div
                                            variants={lineAnimation}
                                            className="hidden lg:block w-[1.5px] h-48 bg-white absolute -bottom-24 -right-8 origin-top"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Hero;
