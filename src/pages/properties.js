import _ from "lodash";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, Card, Text, Row, Col, Progress } from '@nextui-org/react';
import { useAccount } from "wagmi";


export default function Properties() {
    const [isLoading, setIsLoading] = useState(true);
    const { isConnected, address } = useAccount();
    const router = useRouter();

    const [properties, setProperties] = useState([]);    
    const getProperties = async (walletAddress) => {
        const response = await fetch(`/api/properties?walletAddress=${walletAddress}`, {
            method: "get"
        });
        return response.json();
    }

    const init = async () => {
        setIsLoading(true);
        const propertiesResponse = await getProperties(address)
        setProperties(propertiesResponse);
        setIsLoading(false);
    };

    const onPressPropertyCardPress = (contractAddress) => {
        router.push(`/trade/${contractAddress}`, undefined, { scroll: false });
    }

    const propertyCard = (property) => {
        console.log(property);
        return (
            <Grid xs={12} md={6}>
                <Card 
                    // css={{ mw: "400px" }}
                    isPressable
                    onPress={() => onPressPropertyCardPress(property.contractAddress)}
                >
                    <Card.Body>
                        <Card.Image
                            src={`/${property.photoPath}`}
                            objectFit="cover"
                            width="100%"
                            height="300"
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
                                    <Row >
                                        <Col>
                                            <Text color="white" size={16}>
                                                {property.name}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row 
                                        css={{
                                            borderBottom: "$borderWeights$light solid $gray800",
                                            bottom: 0,
                                        }}
                                    >
                                        <Col>
                                            <Text color="#d1d1d1" size={12}>
                                                {property.propertyAddress}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Text color="#d1d1d1" size={12}>
                                                {property.description}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Progress value={(property.totalShares-property.remainingShares)/property.totalShares*100} color="primary" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Text color="white" size={12}>
                                                {(property.totalShares-property.remainingShares)}/{property.totalShares}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Col>
                                
                                {/* <Col>
                                    <Row justify="center">
                                        <Text color="white" size={12}>
                                            {propertiesRemainingShares}/{propertiesTotalShares}
                                        </Text>
                                    </Row>
                                </Col> */}
                            </Row>
                        </Card.Footer>
                </Card>
            </Grid>
        )
    };
    
    useEffect(() => {
        if (router.isReady) {
            if(isConnected){
                init();
            } else {
                router.push("/", undefined, { scroll: false });
            }
        }
    }, [isConnected, router.isReady]);
    return (
        <>
            {isConnected && isLoading && <div>Loading...</div>}
            {isConnected && !isLoading && 
                <Grid.Container gap={1} justify="center">
                    {_.map(properties, property => propertyCard(property))}
                </Grid.Container>
            }
        </>
    )
}
