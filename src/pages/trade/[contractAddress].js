import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
const ethers = require('ethers')

import FRACTION_OWNERSHIP_ABI from "../../../contracts/FractionalOwnership.json";

import 'bootstrap/dist/css/bootstrap.css'

export default function Trade() {
    const { isConnected, address } = useAccount();
    const router = useRouter();
    const { contractAddress } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [isContractValid, setIsContractValid] = useState(false);
    const [propertiesName, setPropertiesName] = useState('');
    const [propertiesDescription, setPropertiesDescription] = useState('');
    const [propertiesTotalShares, setPropertiesTotalShares] = useState(0);
    const [propertiesSharePrice, setPropertiesSharePrice] = useState(0);
    const [propertiesRemainingShares, setPropertiesRemainingShares] = useState(0);

    const init = async () => {
        try {
          const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URLL);
          const fractionalOwnershipContract = new ethers.Contract(contractAddress, FRACTION_OWNERSHIP_ABI.abi, provider);
    
          const propertiesInfo = await fractionalOwnershipContract.getInfo();
          setIsContractValid(true);

          setPropertiesName(propertiesInfo.name)
          setPropertiesDescription(propertiesInfo.description)
          setPropertiesTotalShares(propertiesInfo.totalShares.toNumber())
          setPropertiesSharePrice(propertiesInfo.sharePrice.toNumber())
          setPropertiesRemainingShares(propertiesInfo.remainingShares.toNumber())
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady ) {
            if(isConnected){
                init();
            } else {
                router.push("/", undefined, { scroll: false });
            }
        }
    }, [isConnected, router.isReady]);

    return (
        <>
            <div className="container text-center">
                {isConnected && isLoading && <div>Loading...</div>}
                {isConnected && !isLoading && !isContractValid && <div>Invalid properties<br/></div>}
                {isConnected && !isLoading && isContractValid && 
                <div>
                    Name: {propertiesName} <br/>
                    Description: {propertiesDescription} <br/>
                    totalShares: {propertiesTotalShares} <br/>
                    sharePrice: {propertiesSharePrice} <br/>
                    remainingShares: {propertiesRemainingShares} <br/>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-outline-success">Buy</button>
                        <button type="button" class="btn btn-outline-danger">Sell</button>
                    </div>
                </div>}
            </div>
        </>

    )

}