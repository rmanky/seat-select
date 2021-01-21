import dotenv from 'dotenv'
dotenv.config();

import https from 'https';

export async function post(_req) {
    const prom = new Promise((resolve, reject) => {
        const data = _req.body;
        console.log(_req);
        console.log(data);
        const options = {
            hostname: 'send-sms-5601.twil.io',
            port: 443,
            path: '/send-sms',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = https.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
                resolve({
                    status: 200,
                    body: {
                        status: 'success'
                    }
                });
            });
        });

        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
            reject({
                status: 500,
                body: {
                    status: `${e.message}`
                }
            });
        });

        req.write(data);
        req.end();
    });

    return prom;
}