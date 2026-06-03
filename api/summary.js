import {runReport} from "./ga4.js";

export default async function handler(req, res){
    try{
        const report = await runReport({
            metrics: ["activeUsers","sessions","newUsers","screenPageViews"],
            startDate: req.query.startDate || "30daysAgo",
            endDate: req.query.endDate || "today"
        });

        const row = report.rows?.[0]?.metricValues || [];
        res.status(200).json({
            activeUsers: row[0]?.value || "0",
            sessions: row[1]?.value || "0",
            newUsers: row[2]?.value || "0",
            pageViews: row[3]?.value || "0"
        });
    }
    catch (e)
    {
        res.status(500).json({error: e.message});
    }
}