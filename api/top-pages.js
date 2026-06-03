import {runReport, mapRows} from "./ga4.js";

export default async function handler(req, res)
{
    try{
        const report = await runReport({
            dimensions: ["pagePath"],
            metrics: ["screenPageViews"],
            startDate: req.query.startDate || "30daysAgo",
            endDate: req.query.endDate || "today",
            limit: Number(req.query.limit || 10),
            orderBys: [
                {
                    metrics: {metricName:"sreenPageViews"},
                    dec: true
                }
            ]
        });
        res.status(200).json(mapRows(report));
    }
    catch (e)
    {
        res.status(500).json({error: e.message});
    }
}