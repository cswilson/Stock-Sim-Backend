import type { VercelRequest, VercelResponse } from '@vercel/node'

const TICKER_REQUEST_BASE = "https://query1.finance.yahoo.com/v7/finance/chart/";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        res.status(500).send("Internal Server Error");
    }
}
