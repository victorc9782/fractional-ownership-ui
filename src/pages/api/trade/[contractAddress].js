import { getPropertyInfo } from "../../../controllers/contractController";

export default async function handler(req, res) {
    const { contractAddress, walletAddress } = req.query;
    if (req.method === 'GET') {
        const response = await getPropertyInfo(contractAddress, walletAddress)

        res.status(200).json(response);
    } else {
        // Handle any other HTTP method
        res.status(500).json({});
    }
}