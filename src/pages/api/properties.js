const _ = require('lodash');
const async = require('async');

import { getPropertyInfo } from "../../controllers/contractController";


export default async function handler(req, res) {
    const { walletAddress } = req.query;
    const propertiesContracts = [
        '0xA717818E288D13154916310447e2311Cf50a2f04'
    ];
    if (req.method === 'GET') {
        async.map(propertiesContracts, 
            (contractAddress, callback) => {
                let propertiesInfo = null;
                getPropertyInfo(contractAddress, walletAddress)
                .then((info) => {
                    propertiesInfo = info
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