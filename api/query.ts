import type { VercelRequest, VercelResponse } from '@vercel/node'

const TICKER_REQUEST_BASE = "https://query1.finance.yahoo.com/v7/finance/chart/";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Credentials', "true")
    //Unfortunately the free tier of Vercel does not allow you to set a fixed IP for your deployments.
    //I have no choice but to allow requests from any origin.
    res.setHeader('Access-Control-Allow-Origin', '*')

    const ticker = req.query.ticker;
    let queryString = TICKER_REQUEST_BASE + ticker;

    const p1 = req.query.period1;
    const p2 = req.query.period2;

    if (p1 !== undefined && p2 !== undefined) {
        queryString += `?period1=${p1}&period2=${p2}&interval=1mo&events=div`;
    }

    try {
        const response = await fetch(queryString);

        if (!response.ok) {
            res.status(400).send(`Request failed with params, ticker: ${ticker}\n period1: ${p1}\n period2: ${p2}`);
        } else {
            res.status(200).json(await response.json());
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return res.status(500).json({ error: errorMessage });
    }
}
