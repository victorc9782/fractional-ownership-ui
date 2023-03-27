import { Inter } from 'next/font/google'
import { useEffect, useRef, useState, useLayoutEffect, useContext } from "react";
const ethers = require('ethers')
import { useAccount } from "wagmi";
import {RemoveScrollBar} from 'react-remove-scroll-bar';

// gsap related imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
import styles from '../styles/home.module.css'
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);


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

    // OLD CODE
    // const app = useRef();

    // function goToSection(i, anim) {
    //     // console.log("scroll to", window.innerHeight * i)
    //     gsap.to(window, {
    //       scrollTo: {y: i*innerHeight, autoKill: false},
    //       duration: 0.5,
    //       ease: "power2",
    //     });
        
    //     if(anim) {
    //       anim.restart();
    //     }
    // }

    // useLayoutEffect(() => {

    //   let ctx = gsap.context(() => {
    //     const panels = gsap.utils.toArray(`.${styles.panel}`)
    //     console.log("test array: ", panels);

    //       panels.forEach((panel, i) => {
    //         ScrollTrigger.create({
    //           trigger: panel,
    //           onEnter: () => goToSection(i),
    //           markers: true
    //         });
            
    //         ScrollTrigger.create({
    //           trigger: panel,
    //           start: "bottom bottom",
    //           onEnterBack: () => goToSection(i),
    //         });
    //     });

    //   }, app)
    //   return () => ctx.revert();
    // }, [])
    // END OF OLD CODE


    const app = useRef();
    const storeFunction = useRef();

    useLayoutEffect (() => {
      let ctx = gsap.context(() => {
        let sections = document.querySelectorAll(`.${styles.section}`)
        let images = document.querySelectorAll(`.${styles.bg}`)
        let headings = gsap.utils.toArray(`.${styles.sectionHeading}`)
        let outerWrappers = gsap.utils.toArray(`.${styles.outer}`)
        let innerWrappers = gsap.utils.toArray(`.${styles.inner}`)
        let firstLoad = true;

        console.log(sections, images, outerWrappers, innerWrappers);
        // let splitHeadings = headings.map(heading => new SplitText(heading, { type: "chars,words,lines", linesClass: "clip-text" }))
        let currentIndex = -1;
        let wrap = gsap.utils.wrap(0, sections.length);
        let animating;
      
        gsap.set(outerWrappers, { yPercent: 100 });
        gsap.set(innerWrappers, { yPercent: -100 });
        
        function gotoSection(index, direction) {
          index = wrap(index); // make sure it's valid
          console.log("index:", index);
          console.log("currentIndex:", currentIndex);
          animating = true;
          let fromTop = direction === -1,
              dFactor = fromTop ? -1 : 1,
              tl = gsap.timeline({
                defaults: { duration: 1.25, ease: "power1.inOut" },
                onComplete: () => animating = false
              });
          if (currentIndex >= 0) {
            console.log("go to:", currentIndex);
            // The first time this function runs, current is -1
            gsap.set(sections[currentIndex], { zIndex: 0 });
            tl.to(images[currentIndex], { yPercent: -15 * dFactor })
              .set(sections[currentIndex], { autoAlpha: 0 });
          }
          console.log("doing gsap things");
          gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
          tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
              yPercent: i => i ? -100 * dFactor : 100 * dFactor
            }, { 
              yPercent: 0 
            }, 0)
            .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);
            // .fromTo(splitHeadings[index].chars, { 
            //     autoAlpha: 0, 
            //     yPercent: 150 * dFactor
            // }, {
            //     autoAlpha: 1,
            //     yPercent: 0,
            //     duration: 1,
            //     ease: "power2",
            //     stagger: {
            //       each: 0.02,
            //       from: "random"
            //     }
            //   }, 0.2);
          
          currentIndex = index;
        }
        
        
        
        Observer.create({
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          onDown: () => !animating && gotoSection(currentIndex - 1, -1),
          onUp: () => !animating && gotoSection(currentIndex + 1, 1),
          tolerance: 10,
          preventDefault: true
        });

        
        

      }, app)
      

      return () => ctx.revert();
    }, [])

    
    return (
        <>
{/*         
          // OLD CODE
          <div ref={app} className={styles.panelWrapper}>
                <section className={`${styles.panel} ${styles.panel0}`}>
                  <img className={styles.heroImage} src="https://preview.free3d.com/img/2019/12/2206098452058735689/zot1yr97.jpg" alt=""/>
                  <div className={styles.heroTitleWrapper}>
                    <p>Pay Less.</p>
                    <p><span className={styles.ownStyle}>Own</span> More.</p>
                  </div>
                </section>
                <section className={`${styles.panel} ${styles.panel1}`}>2</section>
                <section className={`${styles.panel} ${styles.panel2}`}>3</section>
                <section className={`${styles.panel} ${styles.panel3}`}>4</section>
          </div> */
          // END OF OLD CODE
        }
        <div className={styles.welcomePage}>
          <p className={styles.welcomeText}>WELCOME</p>
        </div>
        <div className={styles.body} ref={app}> 
          <section className={`${styles.first} ${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg1} ${styles.one}`}>
                  <div className={`${styles.sectionHeading} ${styles.h2}`}>
                    <div className={styles.heroTitleWrapper}>
                      <p>Pay Less.</p>
                      <p><span className={styles.ownStyle}>Own</span> More.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </section>
          <section className={`${styles.second} ${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg2}`}>
                  <h2 className={`${styles.sectionHeading} ${styles.h2}`}>
                    More styling to come...
                  </h2>
                </div>
              </div>
            </div>
          </section>
{/*           
          <section className={`${styles.third} ${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg3}`}>
                  <h2 className={`${styles.sectionHeading} ${styles.h2}`}>Animated with GSAP</h2>
                </div>
              </div>
            </div>
          </section>
          <section className={`${styles.fourth} ${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg4}`}>
                  <h2 className={`${styles.sectionHeading} ${styles.h2}`}>Animated with GSAP</h2>
                </div>
              </div>
            </div>
          </section>
          <section className={`${styles.fifth} ${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg5}`}>
                  <h2 className={`${styles.sectionHeading} ${styles.h2}`}>Animated with GSAP</h2>
                </div>
              </div>
            </div>
          </section> */}
        </div>
        </>
  )
}
