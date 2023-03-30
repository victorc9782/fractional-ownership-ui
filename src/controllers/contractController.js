const _ = require('lodash');
const ethers = require('ethers');
import FRACTION_OWNERSHIP_ABI from "../../contracts/FractionalOwnership.json";

const getPropertyInfo = async(contractAddress, walletAddress) =>{

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const fractionalOwnershipContract = new ethers.Contract(contractAddress, FRACTION_OWNERSHIP_ABI.abi, provider);
    const propertiesInfo = await fractionalOwnershipContract.getInfo(walletAddress);

    const owningShares = await fractionalOwnershipContract.getOwningShares(walletAddress);

    const response =  _.pick(propertiesInfo, [
        'approvedBuy',
        'description',
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

    return response;
}
module.exports = {
    getPropertyInfo: getPropertyInfo
}