import {runReport, mapRows} from "./_lib/ga4.js";

export default async function handler(req, res)
{
    try{
        const report = await runReport({
            dimensions: ["date"],
            metrics: ["sessions"],
            startDate: req.query.startDate || "30daysAgo",
            endDate: req.query.endDate || "today",
            limit: 100
        });

        res.status(200).json(mapRows(report));
    }
    catch (e){
        res.status(500).json({error: e.message});
    }
}