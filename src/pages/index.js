import { Inter } from 'next/font/google'
import { useEffect } from "react";

const ethers = require('ethers')
import { useAccount } from "wagmi";

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
    return (
        <>
        <div className="min-h-screen bg-slate-50">

            <main>
                <h2>
                    Hi there, here is the Home Page
                </h2>
            </main>

        </div>
        </>
  )
}
