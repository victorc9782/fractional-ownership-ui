import { useState, useEffect } from "react";
import { Card, Text, Row, Col, Button, Progress, Loading, Modal, Pagination, Image } from '@nextui-org/react';
import { useAccount, useSigner } from "wagmi";
import { useRouter } from "next/router";
import { Input } from "@nextui-org/react";

const ethers = require('ethers')

import FRACTION_OWNERSHIP_ABI from "../../../contracts/FractionalOwnership.json";

import 'bootstrap/dist/css/bootstrap.css'

export default function Trade() {
    const { isConnected, address } = useAccount();
    const { data: signer } = useSigner()
    const router = useRouter();
    const { contractAddress } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    const [isContractValid, setIsContractValid] = useState(false);
    const [propertiesName, setPropertiesName] = useState('');
    const [propertiesDescription, setPropertiesDescription] = useState('');
    const [propertiesAddress, setPropertiesAddress] = useState('');
    const [propertiesTotalShares, setPropertiesTotalShares] = useState(0);
    const [propertiesSharePrice, setPropertiesSharePrice] = useState(0);
    const [propertiesRemainingShares, setPropertiesRemainingShares] = useState(0);
    const [propertiesOwningShares, setPropertiesOwningShares] = useState(0);
    const [propertiesPhotoPath, setpropertiesPhotoPath] = useState('house.jpeg');

    const [approvedBuy, setApprovedBuy] = useState(false);
    const [isTrading, setIsTrading] = useState(false);
    
    const [amountInput, setAmountInput] = useState(0);

    const [isShowTransactionSuccessAlert, setIsShowTransactionSuccessAlert] = useState(false);


    const [isHousePhotoModelVisible, setIsHousePhotoModelVisible] = useState(false);
    const [housePhotoModalPaging, sethousePhotoModalPaging] = useState(1);
    const [housePhotoModalPhotoPath, setHousePhotoModalPhotoPath] = useState([]);

    const housePhotoModelOpenHandler = () => setIsHousePhotoModelVisible(true);
    const housePhotoModelCloseHandler = () => setIsHousePhotoModelVisible(false);
    const onChangehousePhotoModalPaging = (page) => sethousePhotoModalPaging(page);

    const getTradeInfo = async (address) => {
        const response = await fetch(`/api/trade/${contractAddress}?walletAddress=${address}`, {
            method: "get"
        });
        return response.json();
    }

    const init = async () => {
        try {
            console.log("init called")
            setIsLoading(true);
            const propertiesInfo = await getTradeInfo(address)
        
            setIsContractValid(true);

            setPropertiesName(propertiesInfo.name)
            setPropertiesDescription(propertiesInfo.description)
            setPropertiesAddress(propertiesInfo.propertyAddress)
            setPropertiesTotalShares(propertiesInfo.totalShares)
            setPropertiesSharePrice(propertiesInfo.sharePrice)
            setPropertiesRemainingShares(propertiesInfo.remainingShares)
            setApprovedBuy(propertiesInfo.approvedBuy)
            setPropertiesOwningShares(propertiesInfo.owningShares)
            setpropertiesPhotoPath(propertiesInfo.photoPath)

            setAmountInput(0);

            setHousePhotoModalPhotoPath(propertiesInfo.modalPhotoPaths)
        } catch (err) {
          console.error(err);
        } finally {
            setIsTrading(false);
            setIsLoading(false);
        }
    };

    const buyShares = async () => {
        try {
            setIsTrading(true);
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
            setIsTrading(true);
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
            <div className="container">
                {isConnected && isLoading && <div class="d-flex justify-content-center"><Loading loadingCss={{ $$loadingSize: "400px", $$loadingBorder: "10px" }} color="primary"></Loading></div>}
                {isConnected && !isLoading && !isContractValid && <div>Invalid properties<br/></div>}
                {isConnected && !isLoading && isContractValid && 
                <div>
                    {isShowTransactionSuccessAlert && 
                        <div class="alert alert-success alert-dismissible" role="alert">
                            Transaction Completed Successfully
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setIsShowTransactionSuccessAlert(false)}></button>
                        </div>
                    }
                    <Card css={{ w: "100%", h: "600px" }} disableAnimation disableRipple>
                        <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                            <Col>
                                <Text size={12} weight="bold" transform="uppercase" color="#ffffffAA">
                                    {propertiesAddress}
                                </Text>
                                <Text h3 color="white">
                                    {propertiesName}
                                </Text>
                            </Col>
                        </Card.Header>
                        <Card.Body css={{ p: 0 }} onClick={housePhotoModelOpenHandler}>
                            <Card.Image
                                src={`/${propertiesPhotoPath}`}
                                objectFit="cover"
                                width="100%"
                                height="100%"
                                alt="A Sweethouse"
                            />
                        </Card.Body>
                        <Card.Footer
                            isBlurred
                            css={{
                                position: "absolute",
                                bgBlur: "#0f111466",
                                borderTop: "$borderWeights$light solid $gray800",
                                bottom: 0,
                                zIndex: 1,
                            }}
                            >
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <Text color="#d1d1d1" size={12}>
                                                {propertiesDescription}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Text color="white" size={12}>
                                                ${propertiesSharePrice}@1
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row justify="center">
                                        <Col>
                                            <Progress value={(propertiesTotalShares-propertiesRemainingShares)/propertiesTotalShares*100} color="primary" />
                                        </Col>
                                    </Row>
                                    <Row justify="center">
                                        <Text color="white" size={12}>
                                            {(propertiesTotalShares-propertiesRemainingShares)}/{propertiesTotalShares}
                                        </Text>
                                    </Row>

                                </Col>
                                <Col>
                                    <Row justify="flex-end" alignContent="center">
                                    {isTrading ?
                                        <Button disabled auto bordered color="primary" css={{ px: "$13" }}>
                                            <Loading color="currentColor" size="sm" />
                                        </Button>
                                    :
                                        <Button.Group rounded>
                                            <Input 
                                                type="number"
                                                required
                                                onChange={onChangeAmountPicker}
                                                value={amountInput}
                                                disabled={!approvedBuy}
                                                css={{ $$inputColor: "#ffffff50"}}
                                            />
                                            <Button 
                                                css={{ color: "#94f9f0", bg: "#94f9f026" }}
                                                onPress={buyShares}
                                                disabled={!approvedBuy}
                                            >
                                                Buy
                                            </Button>
                                            <Button
                                                css={{color:"#de4343", bg: "#de434326"}}
                                                onPress={sellShares}
                                                disabled={!approvedBuy}
                                            >
                                                Sell
                                            </Button>
                                        </Button.Group>
                                    }
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                    <Modal
                        fullScreen
                        blur
                        closeButton
                        aria-labelledby="modal-title"
                        open={isHousePhotoModelVisible}
                        onClose={housePhotoModelCloseHandler}
                    >
                        <Modal.Body>
                            <Card disableAnimation>
                                <Card.Body css={{ p: 0 }}>
                                    <Image
                                        objectFit="cover"
                                        height="800px"
                                        src={`/${housePhotoModalPhotoPath[housePhotoModalPaging-1]}`}
                                        alt="House Image"
                                    >
                                    </Image>
                                </Card.Body>
                                <Card.Footer
                                    isBlurred
                                    css={{
                                        position: "absolute",
                                        bgBlur: "#0f111466",
                                        borderTop: "$borderWeights$light solid $gray800",
                                        bottom: 0,
                                        zIndex: 1,
                                    }}
                                    >
                                    <Row justify="center">
                                        <Pagination page={housePhotoModalPaging} onlyDots size="xs" total={housePhotoModalPhotoPath.length} loop onChange={onChangehousePhotoModalPaging}/>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Modal.Body>
                    </Modal>
                </div>}
            </div>
        </>

    )

}