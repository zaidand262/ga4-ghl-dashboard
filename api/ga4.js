import {google} from "googleapis";

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_REDIRECT_URI,
    GA4_PROPERTY_ID
} = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GA4_PROPERTY_ID) {
    throw new Error("Missing required environment variables.");
}

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
});

export async function runReport({
    dimensions = [],
    metrics = [],
    startDate = "30daysAgo",
    endDate = "today",
    limit = 10,
    orderBys = []
}) {
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse?.token;

    const res = await fetch(
        "https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport",
        {
            method:"POST",
            headers:{
                Authorization:"Bearer ${accessToken}",
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                dateRanges:[{startDate,endDate}],
                dimensions:dimensions.map((name) => ({name})),
                metrics: metrics.map((name) => ({name})),
                limit,
                orderBys
            })
        }
    );

    if(!res.ok){
        const err = await res.text();
        throw new Error('GA4 API error: ${err}');
    }

    return await res.json();
}

export function mapRows(report) {
    const dimensionHeaders = report.dimensionHeaders || [];
    const metricHeaders = report.metricHeaders || [];
    const rows = report.rows || [];

    return rows.map((row) => {
        const obj = {};
        dimensionHeaders.forEach((h,i) => {
            obj[h.name] = row.dimensionValues?.[i]?.value || "";
        });
        metricHeaders.forEach((h,i) => {
            obj[h.name] = row.metricValues?.[i]?.value || "";
        });
        return obj;
    });
}