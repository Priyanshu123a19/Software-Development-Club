"use client"
import Button from "@/components/Button"
import designExample1Image from "@/assets/images/design-example-1.png"
import designExample2Image from "@/assets/images/design-example-2.png"
import Image from "next/image";
import Pointer from "@/components/Pointer";
import {motion,useAnimate} from "framer-motion"
import { useEffect } from "react";
import cursorYouImage from "@/assets/images/cursor-you.svg"

export default function Hero() {
    const [leftDesignScope, leftDesignAnimate] = useAnimate();
    const [leftPointerScope, leftPointerAnimate] = useAnimate();
    const [rightPointerScope, rightPointerAnimate] = useAnimate();
    const [rightDesignScope, rightDesignAnimate] = useAnimate();

    useEffect(()=> {
        leftDesignAnimate(
            [
                [leftDesignScope.current, {opacity: 1},{duration: 0.5}],
                [leftDesignScope.current, {y:0, x:0}, {duration: 0.5}]
            ]
        )
        leftPointerAnimate(
            [
                [leftPointerScope.current, {opacity: 1},{duration: 0.5}],
                [leftPointerScope.current, {y:0, x:-100}, {duration: 0.5}],
                [leftPointerScope.current, {x:0, y:[0,16,0]}, {duration: 0.5 , ease:"easeInOut"}]
            ]
        )
        rightDesignAnimate(
            [
                [rightDesignScope.current, {opacity: 1},{duration: 0.5,delay:1.5}],
                [rightDesignScope.current, {y:0, x:0}, {duration: 0.5}]
            ]
        )
        rightPointerAnimate(
            [
                [rightPointerScope.current, {opacity: 1},{duration: 0.5,delay:1.5}],
                [rightPointerScope.current, {y:0, x:175}, {duration: 0.5}],
                [rightPointerScope.current, {x:0, y:[0,20,0]}, {duration: 0.5 , ease:"easeInOut"}]
            ]
        )
    },[])
    return (
    <section className="py-24 overflow-x-clip" style={{
        cursor: `url(${cursorYouImage.src}), auto`
    }}>
        <div className="container relative">
            <motion.div ref={leftDesignScope} initial={{ opacity: 0, y: 100, x: -100 }} drag className="absolute -left-32 top-16 hidden lg:block">
                <Image 
                src={designExample1Image}
                alt="Design Example 1"
                draggable={false}
                />
            </motion.div>
            <motion.div  ref={leftPointerScope} initial={{opacity: 0, y: 100, x: -200}} className="absolute left-56 top-96 hidden lg:block">
                <Pointer name="Purnendu" color="red"/>
            </motion.div>
            <motion.div ref={rightDesignScope} initial={{ opacity: 0 , x: 100 ,y: 100}} drag className="absolute -right-64 -top-16 hidden lg:block">
                <Image 
                draggable={false}
                src={designExample2Image}
                alt="Design Example 2"
                />
            </motion.div>
            <motion.div ref={rightPointerScope} initial={{ opacity: 0, y: 100, x: 270 }} className="absolute right-80 -top-4 hidden lg:block">
                <Pointer name="Priyanshu" color="blue"/>
            </motion.div>
            <div className="flex justify-center">
            <div className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-neutral-950 font-semibold">✨6 Successful Years</div>
            </div>
            <h1 className="text-6xl lg:text-8xl md:text-7xl font-medium text-center mt-6">Innovative coding, achieved together</h1>
            <p className="text-center text-xl text-white/50 mt-8 max-w-2xl mx-auto">
                Code, collaborate, and create with passionate developers. Unlock new skills, build real projects, and shape the future—together in our club.
            </p>
            <form className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto gap-2">
                <input type="email" placeholder="Enter your email" className="bg-transparent px-4 md:flex-1 w-full rounded-3xl outline-none focus-visible:border-2"/>
                <Button variant="primary" type="submit" className="whitespace-nowrap" size="sm">Sign Up</Button>
            </form>
        </div>
    </section>
    );
}
