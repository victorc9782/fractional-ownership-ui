import { useEffect, useRef, useLayoutEffect} from "react";
const ethers = require('ethers')
import { useAccount } from "wagmi";
import Link from 'next/link'
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
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
            console.log(`address: ${address}`)
            provider.getBalance(address).then((balance) => {
                // convert a currency unit from wei to ether
                const balanceInEth = ethers.utils.formatEther(balance)
                console.log(`balance: ${balanceInEth} ETH`)
            });
        }
    }, [isConnected, address]);


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
      tl.fromTo([outerWrappers[index], innerWrappers[index]], { 
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, { 
        yPercent: 0 
      }, 0)
      .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)

      currentIndex = index;
    }
    
    useLayoutEffect (() => {
      let ctx = gsap.context(() => {
        sections = document.querySelectorAll(`.${styles.section}`)
        images = document.querySelectorAll(`.${styles.bg}`)
        headings = gsap.utils.toArray(`.${styles.sectionHeading}`)
        outerWrappers = gsap.utils.toArray(`.${styles.outer}`)
        innerWrappers = gsap.utils.toArray(`.${styles.inner}`)
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


    let arrows = useRef();
    useLayoutEffect (() => {
      let ctx = gsap.context(() => {
        arrows = gsap.utils.toArray(`.${styles.subArrow1}`);
        gsap.to(`.${styles.subArrow1}`, 
          {
          yPercent: 30,
          repeat: -1,
          stagger: 0.3,
          duration: 1.5
          }
        )
        gsap.to(`.${styles.subArrow2}`, 
          {
          yPercent: 60,
          repeat: -1,
          stagger: 0.3,
          duration: 1.5
          }
        )
      
      }, app)
      

      return () => ctx.revert();
    }, [])
    
    return (
        <>
        <div className={styles.body} ref={app}> 
          <div className={`${styles.section}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg1}`}>
                  <div className={`${styles.sectionHeading} ${styles.heroTitleWrapper} ${styles.h2}`}>
                    <p>Pay Less.</p>
                    <p><span className={styles.ownStyle}>Own</span> More.</p>
                    <p className={styles.mainSubtext}>
                    LFG offers properties for fractionalized ownership bought
                    through blockchain networks.
                    </p>
                  </div>
                  <div className={styles.scrollIndicator}>
                    <div className={styles.arrow}></div>
                    <div className= {`${styles.arrow} ${styles.subArrow1}`}></div>
                    <div className= {`${styles.arrow} ${styles.subArrow2}`}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className={`${styles.section} ${styles.two}`}>
            <div className={styles.outer}>
              <div className={styles.inner}>
                <div className={`${styles.bg} ${styles.bg2}`}>
                    <div className={`${styles.section2}`}>
                      <p className={`${styles.text2}`}>
                        <span className={styles.bold}>
                          The 
                          <span className={styles.ownStyle} style={{
                            padding: 9,
                            color: "#0582CA"
                          }}>Simplest</span>
                           Way Towards Home Ownership. 
                        </span>
                        <p className={styles.about}>
                          Get started by connecting your wallet.
                        </p>
                      </p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
  )
}
