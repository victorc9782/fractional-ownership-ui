import { Inter } from 'next/font/google'
import { useEffect, useRef, useState, useLayoutEffect, useContext } from "react";
const ethers = require('ethers')
import { useAccount, ContractMethodNoResultError } from "wagmi";

// gsap related imports
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
import styles from '../styles/home.module.css'
import { Observer } from "gsap/Observer";
// import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(Observer);
// gsap.registerPlugin(SplitText);


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

    // For first page 
    const app = useRef();
    let sections = useRef();
    let images = useRef();
    let headings = useRef();
    let outerWrappers = useRef();
    let innerWrappers = useRef();
    let splitHeadings = useRef();
    let currentIndex = useRef();
    let wrap = useRef();
    let animating = useRef();

    // For second page
    let ownBoxes = useRef();
    let rentBoxes = useRef();
    let windowWidth = useRef();


    function gotoSection(index, direction) {
      index = wrap(index); // make sure it's valid
      animating = true;
      let fromTop = direction === -1,
          dFactor = fromTop ? -1 : 1,
          tl = gsap.timeline({
            defaults: { duration: 1.25, ease: "power1.inOut" },
            onComplete: () => animating = false
          });
      if (currentIndex >= 0) {
        // The first time this function runs, current is -1
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
          .set(sections[currentIndex], { autoAlpha: 0 });
      }
      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

      switch (index) {
        case 0:
          tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
            yPercent: i => i ? -100 * dFactor : 100 * dFactor
          }, { 
            yPercent: 0 
          }, 0)
          .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
          // .fromTo(splitHeadings[index].chars, { 
          //   autoAlpha: 0, 
          //   yPercent: 150 * dFactor
          // }, {
          //   autoAlpha: 1,
          //   yPercent: 0,
          //   duration: 0,
          //   ease: "circ.out", 
          //   stagger: {
          //     each: 0.05,
          //   }
          // }, 0.2);
          // break;
        
        case 1: 
          tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
            yPercent: i => i ? -100 * dFactor : 100 * dFactor
          }, { 
            yPercent: 0 
          }, 0)
          .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
          // .fromTo(splitHeadings[index].chars, { 
          //   autoAlpha: 0, 
          //   yPercent: 150 * dFactor
          // }, {
          //   autoAlpha: 1,
          //   yPercent: 0,
          //   duration: 1,
          //   ease: "circ.out", 
          //   stagger: {
          //     each: 0.05,
          //   }
          // }, 0.2)
          .fromTo(ownBoxes, 
            {
              x: windowWidth/4,
              // start from bottom + footer height
              // y: window.innerHeight/2,
              y: (window.innerHeight/2-50),
              opacity: 0
            },
            
            {
              opacity: 1,
              duration:0.2,
              y: (i) => {
                return (window.innerHeight/2-50)-ownBoxes[0].clientHeight*i;
              },
              stagger:0.3
            
          })
          .fromTo(rentBoxes, 
            {
              x: -windowWidth/4,
              // start from bottom + footer height
              // y: window.innerHeight/2,
              y: (window.innerHeight/2-70),
              opacity: 0
            },
            
            {
              opacity: 1,
              duration:0.2,
              y: (i) => {
                return (window.innerHeight/2-50)-ownBoxes[0].clientHeight*i;
              },
              stagger:0.3
            
          })
          console.log("ownbox",ownBoxes[0].clientHeight);
          console.log("windowWidth",windowWidth);
          console.log("window.innHeight",window.innerHeight);

          // console.log(boxes[0])
          break;
      }


      
        



      currentIndex = index;
    }
    
    useLayoutEffect (() => {
      let ctx = gsap.context(() => {
        sections = document.querySelectorAll(`.${styles.section}`)
        images = document.querySelectorAll(`.${styles.bg}`)
        headings = gsap.utils.toArray(`.${styles.sectionHeading}`)
        outerWrappers = gsap.utils.toArray(`.${styles.outer}`)
        innerWrappers = gsap.utils.toArray(`.${styles.inner}`)
        ownBoxes = gsap.utils.toArray(`.${styles.ownBox}`)
        rentBoxes = gsap.utils.toArray(`.${styles.rentBox}`)
        windowWidth = window.innerWidth;

        console.log("headings: ", headings)
        // splitHeadings = headings.map((heading) => 
        //   {
        //     console.log(heading);
        //     return new SplitText(heading, { type: "chars,words,lines"})
        //   })
          
        console.log("splitHeadings: ", splitHeadings)
        currentIndex = -1;
        wrap = gsap.utils.wrap(0, sections.length);
          
        gsap.set(outerWrappers, { yPercent: 100 });
        gsap.set(innerWrappers, { yPercent: -100 });
        
        
        
        Observer.create({
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          onDown: () => !animating && gotoSection(currentIndex - 1, -1),
          onUp: () => !animating && gotoSection(currentIndex + 1, 1),
          tolerance: 10,
          preventDefault: true
        });

      }, app)
      
      gotoSection(0, 1);

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
        {/* <div className={styles.welcomePage}>
          <p className={styles.welcomeText}>WELCOME</p>
        </div> */}
        <div className={styles.body} ref={app}> 
          <div className={`${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg1}`}>
                  {/* <h2 className={`${styles.sectionHeading} ${styles.h2}`}>
                      More styling to one...
                  </h2> */}
                  <div className={`${styles.sectionHeading} ${styles.heroTitleWrapper} ${styles.h2}`}>
                    <p>Pay Less.</p>
                    <p><span className={styles.ownStyle}>Own</span> More.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className={`${styles.section} ${styles.two}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg2}`}>
                  <h2 className={`${styles.sectionHeading} ${styles.h2}`}>
                    How it works
                  </h2>
                  <div className={`${styles.box} ${styles.ownBox}`}></div>
                  <div className={`${styles.box} ${styles.ownBox}`}></div>
                  <div className={`${styles.box} ${styles.ownBox}`}></div>
                  <div className={`${styles.box} ${styles.ownBox}`}></div>
                  <div className={`${styles.box} ${styles.rentBox}`}></div>
                  <div className={`${styles.box} ${styles.rentBox}`}></div>
                  <div className={`${styles.box} ${styles.rentBox}`}></div>
                  <div className={`${styles.box} ${styles.rentBox}`}></div>
                </div>
              </div>
            </div>
          </div>
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
