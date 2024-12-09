import {Head} from "@inertiajs/react";
import logo from "../../images/logo.png";
import {useState} from "react";
import {Menu, X} from 'lucide-react';
import Header from "@/Components/LandingHeader.jsx";
import Hero from "@/Components/Hero.jsx";
import greenStar from "../../images/green-main-star.png";
import { motion } from 'framer-motion';
import bonn from "../../images/bonn.png";
import cinegold from "../../images/cinegold.png";
import ilyes from "../../images/ilyes.png";
import djabali from "../../images/djabali.png";
import DeviceNotice from "@/Components/DeviceNotice.jsx";

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

const sponsorAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: i => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.2 + 0.3,
            duration: 0.5
        }
    })
};


export default function LandingPage() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return <>
        <Head title="Welcome"/>
        <motion.div className='min-h-screen bg-secondary text-white font-spacegrotesk'>
            <Header logo={logo}/>
            <Hero logo={logo}/>
            <section className='min-h-screen mt-20 lg:mt-60' id='about'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <motion.div
                            initial={{x: -100, opacity: 0}}
                            animate={{x: 0, opacity: 1}}
                            transition={{duration: 0.8}}
                            className='font-bold uppercase text-4xl md:text-6xl lg:text-[120px] leading-tight lg:text-right relative'
                        >
                            <p className='relative z-10 mt-10'>about <br/> the event</p>
                            <motion.div
                                initial={{rotate: -180, opacity: 0}}
                                animate={{rotate: 0, opacity: 1}}
                                transition={{duration: 1.2}}
                                className='w-36 md:w-48 lg:w-72 absolute -top-28 lg:-top-32 left-0 z-0'
                            >
                                <img src={greenStar} alt='particle' className='w-full object-contain'/>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{y: 100, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.8, delay: 0.3}}
                            className='font-bold text-lg md:text-xl lg:text-2xl text-justify pt-6 flex justify-end mt-6'
                        >
                            <p className='w-full lg:w-2/3' >
                                The "Tech Pioneers 2nd Edition" is a national competition bringing together engineering
                                students
                                from across Algeria. Teams solve industrial challenges through an online platform,
                                earning
                                points based on response speed. Following a league format, teams accumulate points
                                across
                                multiple challenges, with the highest-scoring team crowned champion. The event tests
                                technical
                                skills, teamwork, and performance under pressure.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
            <span id='sponsors' className='relative -top-96'></span>
            <section className='min-h-screen mt-20 lg:mt-60' >
                <motion.div className='container mx-auto px-4 relative'>
                    <motion.div
                        initial={{x: -100, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{duration: 0.8}}
                        className='font-bold uppercase text-6xl mb-2 md:text-6xl lg:text-[120px] leading-tight lg:text-right relative'
                    >
                        <p className='relative z-10 mt-10'>our<br/> sponsors</p>
                    </motion.div>
                    <motion.div
                        className='w-3/4 h-fit grid grid-cols-3 gap-4 items-center justify-center md:absolute -top-[180%] left-0' initial={{x: -100, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        transition={{duration: 0.8}}>

                            <motion.div className='col-span-3 mx-auto' variants={sponsorAnimation}>
                                <img src={bonn}/>
                            </motion.div>
                            <motion.div variants={sponsorAnimation} className='mx-auto justify-self-center col-span-3 md:col-span-1'>
                                <img src={cinegold}/>
                            </motion.div>
                            <motion.div className='mx-auto justify-self-center col-span-3 md:col-span-1' variants={sponsorAnimation}>
                                <img src={ilyes}/>
                            </motion.div>
                            <motion.div className='mx-auto justify-self-center col-span-3 md:col-span-1' variants={sponsorAnimation}>
                                <img src={djabali}/>
                            </motion.div>
                            <motion.div
                                variants={lineAnimation}
                                className="hidden lg:block w-48 h-[1.5px] bg-white absolute -top-6 left-0 origin-left"
                            />
                            <motion.div
                                variants={lineAnimation}
                                className="hidden lg:block w-[1.5px] h-48 bg-white absolute -top-12 left-12 origin-top"
                            />
                            <motion.div
                                variants={lineAnimation}
                                className="hidden lg:block w-48 h-[1.5px] bg-white absolute -bottom-16 -right-16 origin-left"
                            />
                            <motion.div
                                variants={lineAnimation}
                                className="hidden lg:block w-[1.5px] h-48 bg-white absolute -bottom-24 -right-8 origin-top"
                            />
                    </motion.div>
                </motion.div>
            </section>
        </motion.div>
        <DeviceNotice />
    </>
}
