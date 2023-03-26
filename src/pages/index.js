import { Inter } from 'next/font/google'
import { useEffect, useRef, useState, useLayoutEffect } from "react";
const ethers = require('ethers')
import { useAccount } from "wagmi";

// gsap related imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
import styles from '../styles/home.module.css'


export default function Home() {
    const { isConnected, address } = useAccount();
    useEffect(() => {
        if(isConnected){
            const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
            console.log(`address: ${address}`)
            provider.getBalance(address).then((balance) => {
                // convert a currency unit from wei to ether
                const balanceInEth = ethers.utils.formatEther(balance)
                console.log(`balance: ${balanceInEth} ETH`)
            });
        }
    }, [isConnected, address]);

    const panels = useRef([]);
    const firstElem = useRef();
    const assignPanelRef = (el, index) => {
        // set the firstElement
        index == 0 ? firstElem.current = el : null;
        panels.current[index] = el;
    }

    function goToSection(i, anim) {
        console.log("scroll to", window.innerHeight * i + firstElem.current.offsetTop)
        gsap.to(window, {
          scrollTo: {y: i*innerHeight + firstElem.current.offsetTop, autoKill: false},
          duration: 1
        });
        
        if(anim) {
          anim.restart();
        }
    }
    
      
    useLayoutEffect(() => {
        panels.current.forEach((panel, i) => {
            ScrollTrigger.create({
              trigger: panel,
              onEnter: () => goToSection(i)
            });
            
            ScrollTrigger.create({
              trigger: panel,
              start: "bottom bottom",
              onEnterBack: () => goToSection(i),
            });
        });
    }, [])

    return (
        <>
        <div className="min-h-screen bg-slate-50">

            <div className={styles.panelWrapper}>
                <section ref={(el) => assignPanelRef(el, 0)} className={`${styles.panel} ${styles.panel0}`}>1</section>
                <section ref={(el) => assignPanelRef(el, 1)} className={`${styles.panel} ${styles.panel1}`}>2</section>
                <section ref={(el) => assignPanelRef(el, 2)} className={`${styles.panel} ${styles.panel2}`}>3</section>
                <section ref={(el) => assignPanelRef(el, 3)} className={`${styles.panel} ${styles.panel3}`}>4</section>
            </div>


        </div>
        </>
  )
}
