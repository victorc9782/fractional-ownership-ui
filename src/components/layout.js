import Link from "next/link";
import Head from 'next/head'
import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import 'bootstrap/dist/css/bootstrap.css'

import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect } from "wagmi";

const Layout = ({ children }) => {
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { open } = useWeb3Modal(); 

    const router = useRouter();
    useEffect(() => {
        if (router.isReady && !isConnected) {
          // Redirect to homepage
          router.push("/", undefined, { scroll: false });
          console.log("run reroute");
        }
    }, [isConnected, router.isReady]);
    //}, [isConnected, router, router.isReady]);
  
    return (
        <div className="container-fluid p-0 bg-white">
            <Head>
                <title>LFG</title>
                <meta name="description" content="Fractional shares of real estate in the Web3" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                <a className="navbar-brand" href="#">LFG</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link
                            href="/"
                            className="nav-link"
                            scroll={false}
                        >
                            Home
                        </Link>
                    </li>
                    {isConnected && (
                        <li className="nav-item">
                            <Link
                                href="/dashboard"
                                className="nav-link"
                            >
                                Dashboard
                            </Link>
                        </li>
                    )}
                    </ul>
                </div>
                
                <ul class="nav navbar-nav flex-row justify-content-md-center justify-content-start flex-nowrap">
                    {!isConnected && (
                        <li class="nav-item"><Button onPress={() => open()}>Connect Wallet</Button></li>
                    ) || (
                        <li class="nav-item"><Button bordered onPress={() => disconnect()}>Disconnect</Button></li>
                    )}
                    
                </ul>
            </nav>
            {children}
            
            <footer class="container fixed-bottom">
                <div>
                    <p>&copy; 2023 LFG. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;