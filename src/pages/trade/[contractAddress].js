import { useState, useEffect, useRef } from "react";
import { useAccount, useDisconnect, useSigner, configureChains } from "wagmi";
import { useRouter } from "next/router";
import { Input } from "@nextui-org/react";

const ethers = require('ethers')

import FRACTION_OWNERSHIP_ABI from "../../../contracts/FractionalOwnership.json";

import 'bootstrap/dist/css/bootstrap.css'

export default function Trade() {
    const { isConnected, address } = useAccount();
    const { data: signer, isError } = useSigner()
    const router = useRouter();
    const { contractAddress } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [isContractValid, setIsContractValid] = useState(false);
    const [propertiesName, setPropertiesName] = useState('');
    const [propertiesDescription, setPropertiesDescription] = useState('');
    const [propertiesTotalShares, setPropertiesTotalShares] = useState(0);
    const [propertiesSharePrice, setPropertiesSharePrice] = useState(0);
    const [propertiesRemainingShares, setPropertiesRemainingShares] = useState(0);
    const [propertiesOwningShares, setPropertiesOwningShares] = useState(0);
    const [approvedBuy, setApprovedBuy] = useState(false);
    
    const [amountInput, setAmountInput] = useState(0);

    const [isShowTransactionSuccessAlert, setIsShowTransactionSuccessAlert] = useState(false);

    const init = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

            const fractionalOwnershipContract = new ethers.Contract(contractAddress, FRACTION_OWNERSHIP_ABI.abi, provider);
        
            const propertiesInfo = await fractionalOwnershipContract.getInfo(address);
            setIsContractValid(true);

            setPropertiesName(propertiesInfo.name)
            setPropertiesDescription(propertiesInfo.description)
            setPropertiesTotalShares(propertiesInfo.totalShares.toNumber())
            setPropertiesSharePrice(propertiesInfo.sharePrice.toNumber())
            setPropertiesRemainingShares(propertiesInfo.remainingShares.toNumber())
            setApprovedBuy(propertiesInfo.approvedBuy)

            const owningShares = await fractionalOwnershipContract.getOwningShares(address);
            setPropertiesOwningShares(owningShares.toNumber())

            setAmountInput(0);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
    };

    const buyShares = async () => {
        try {
            if (amountInput <= 0 || amountInput > propertiesRemainingShares){
                alert("Invalid shares to buy")
                throw new Error("Invalid shares to buy")
            }
            const fractionalOwnershipContract = new ethers.Contract(contractAddress, FRACTION_OWNERSHIP_ABI.abi, signer);

            const tx = await fractionalOwnershipContract.buyShares(amountInput, {value: amountInput*propertiesSharePrice});
            const response = await tx.wait();
            setIsShowTransactionSuccessAlert(true);

            setTimeout(() => {
                setIsShowTransactionSuccessAlert(false)
            }, 5000);

            console.log(response)
        } catch (err) {
            console.error(err);
        } finally {
            init();
        }
    }
    
    const sellShares = async () => {
        try {
            if (amountInput <= 0 || amountInput > propertiesOwningShares){
                alert("Invalid shares to sell")
                throw new Error("Invalid shares to sell")
            }
            const fractionalOwnershipContract = new ethers.Contract(contractAddress, FRACTION_OWNERSHIP_ABI.abi, signer);

            const tx = await fractionalOwnershipContract.sellShares(amountInput);
            const response = await tx.wait();
            setIsShowTransactionSuccessAlert(true);

            setTimeout(() => {
                setIsShowTransactionSuccessAlert(false)
            }, 5000);
            console.log(response)
        } catch (err) {
            console.error(err);
        } finally {
            init();
        }
    }

    const onChangeAmountPicker = (e) => {
        const newAmount = e.target.valueAsNumber;
        if(newAmount >= 0 || newAmount == ""){
            setAmountInput(newAmount)
            if(newAmount > propertiesRemainingShares || newAmount == ""){
                setAmountInput(propertiesRemainingShares)
            }
        }
    }

    useEffect(() => {
        console.log(address)
        if (router.isReady) {
            if(isConnected){
                init();
            } else {
                router.push("/", undefined, { scroll: false });
            }
        }
    }, [isConnected, address, router.isReady]);

    return (
        <>
            <div className="container text-center">
                {isConnected && isLoading && <div>Loading...</div>}
                {isConnected && !isLoading && !isContractValid && <div>Invalid properties<br/></div>}
                {isConnected && !isLoading && isContractValid && 
                <div>
                    {isShowTransactionSuccessAlert && 
                        <div class="alert alert-success alert-dismissible" role="alert">
                            Transaction Completed Successfully
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setIsShowTransactionSuccessAlert(false)}></button>
                        </div>
                    }
                    Name: {propertiesName} <br/>
                    Description: {propertiesDescription} <br/>
                    totalShares: {propertiesTotalShares} <br/>
                    sharePrice: {propertiesSharePrice} <br/>
                    remainingShares: {propertiesRemainingShares} <br/>
                    propertiesOwningShares: {propertiesOwningShares} <br/>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <Input 
                            type="number"
                            required
                            onChange={onChangeAmountPicker}
                            value={amountInput}
                            disabled={!approvedBuy}
                        />
                        <button type="button" class="btn btn-outline-success" onClick={buyShares} disabled={!approvedBuy}>Buy</button>
                        <button type="button" class="btn btn-outline-danger" onClick={sellShares} disabled={!approvedBuy}>Sell</button>
                    </div>
                </div>}
            </div>
        </>

    )

}