const _ = require('lodash');
const async = require('async');

import { getPropertyInfo } from "../../controllers/contractController";


export default async function handler(req, res) {
    const { walletAddress } = req.query;
    const propertiesContracts = [
        '0xF8C815a4275B3B5059543924D3433cb63574f125',
        '0x4D3456261ae710b0C4f38b92364B28334A3d0377',
        '0x8d5BFF51fc935271E5dA36c0FFA5eDbEc25C6Df7',
        '0xAC45FCa7e91C97D6D9d6f54CE021e9b2EE76a52f'
    ];
    if (req.method === 'GET') {
        async.map(propertiesContracts, 
            (contractAddress, callback) => {
                let propertiesInfo = null;
                getPropertyInfo(contractAddress, walletAddress)
                .then((info) => {
                    propertiesInfo = info
                    propertiesInfo.contractAddress = contractAddress
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    callback(null, propertiesInfo)
                })
            }, 
            (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(_.filter(results, (result)=> !_.isNil(result)));
            }
        });
    } else {
        // Handle any other HTTP method
        res.status(500).json({});
    }
}