import '@/styles/globals.css'
import Layout from '@/components/layout'
import { useEffect, useState } from "react";

import { EthereumClient, w3mProvider, w3mConnectors } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, hardhat } from "wagmi/chains";

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
    throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
  }
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// 2. Configure wagmi client
const chains = [goerli];
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ version: 1, chains, projectId }),
    provider,
});


export const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function App({ Component, pageProps }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);
    return (
        <>
        {ready ? (
            <WagmiConfig client={wagmiClient}>
              <Layout><Component {...pageProps} /></Layout>
            </WagmiConfig>
        ) : null}
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </>
    )

}
