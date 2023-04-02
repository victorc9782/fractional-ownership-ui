const _ = require('lodash');
const ethers = require('ethers');
import FRACTION_OWNERSHIP_ABI from "../../contracts/FractionalOwnership.json";

const defaultPropertyPhoto = 'house1.jpeg';
const propertyPhoto = {
    '0xF8C815a4275B3B5059543924D3433cb63574f125': 'house1.jpeg',
    '0x4D3456261ae710b0C4f38b92364B28334A3d0377': 'house2.jpg',
    '0x8d5BFF51fc935271E5dA36c0FFA5eDbEc25C6Df7': 'house3.jpg',
    '0xAC45FCa7e91C97D6D9d6f54CE021e9b2EE76a52f': 'house4.jpg'
}

const defaultIndoorPhotos = ['house1.jpeg'];
const indoorPhotos = {
    '0xF8C815a4275B3B5059543924D3433cb63574f125': [
        'bedroom1.jpg',
        'kitchen1.jpg',
        'livingroom1.jpg',
    ],
    '0x4D3456261ae710b0C4f38b92364B28334A3d0377':[
        'bedroom2.jpg',
        'kitchen2.jpg',
        'livingroom2.jpg',
    ],
    '0x8d5BFF51fc935271E5dA36c0FFA5eDbEc25C6Df7': [
        'bedroom3.jpg',
        'kitchen3.jpg',
        'livingroom3.jpg',
    ],
    '0xAC45FCa7e91C97D6D9d6f54CE021e9b2EE76a52f': [
        'bedroom4.jpg',
        'kitchen4.jpg',
        'livingroom4.jpg',
    ]
}
const getPropertyInfo = async(contractAddress, walletAddress) =>{

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const fractionalOwnershipContract = new ethers.Contract(contractAddress, FRACTION_OWNERSHIP_ABI.abi, provider);
    const propertiesInfo = await fractionalOwnershipContract.getInfo(walletAddress);

    const owningShares = await fractionalOwnershipContract.getOwningShares(walletAddress);

    const response =  _.pick(propertiesInfo, [
        'approvedBuy',
        'description',
        'propertyAddress',
        'name',
        'owner',
        'remainingShares',
        'sharePrice',
        'totalShares'
    ]);
    response.remainingShares = response.remainingShares.toNumber();
    response.sharePrice = response.sharePrice.toNumber();
    response.totalShares = response.totalShares.toNumber();
    response.owningShares = owningShares.toNumber();

    response.photoPath = _.get(propertyPhoto, contractAddress, defaultPropertyPhoto);
    response.modalPhotoPaths = _.get(indoorPhotos, contractAddress, defaultIndoorPhotos);
    return response;
}
module.exports = {
    getPropertyInfo: getPropertyInfo
}