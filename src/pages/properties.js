import _ from "lodash";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, Card, Text } from '@nextui-org/react';
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
                    <Text>{property.name}</Text>
                    <Text>{property.description}</Text>
                    </Card.Body>
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
