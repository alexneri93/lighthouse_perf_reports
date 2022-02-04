const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouseMobile(args){   
    
    const arguments = JSON.parse(args);

    return new Promise((success, reject) => {
     
        const result = (async () => {
            const chrome = await chromeLauncher.launch({chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']});
            var testResults = [];
                
            const mobileOptions = {
            logLevel: 'info', 
            output: 'json', 
            screenEmulation: {disabled: true}, 
            onlyAudits: [
                'first-contentful-paint', 
                'speed-index', 
                'largest-contentful-paint', 
                'interactive', 
                'total-blocking-time', 
                'cumulative-layout-shift'
            ], 
            port: chrome.port
            };

            const desktopOptions = {
                logLevel: 'info', 
                output: 'csv', 
                formFactor: 'desktop', 
                screenEmulation: {
                  width: 1660, 
                  height: 930, 
                  deviceScaleRatio: 1, 
                  mobile: false, 
                  disabled: false
                }, 
                throttling: {
                  rttMs: 40,
                  throughputKbps: 11024,
                  cpuSlowdownMultiplier: 1,
                  requestLatencyMs: 0,
                  downloadThroughputKbps: 0,
                  uploadThroughputKbps: 0,
                }, 
                onlyAudits: [
                  'first-contentful-paint', 
                  'speed-index', 
                  'largest-contentful-paint', 
                  'interactive', 
                  'total-blocking-time', 
                  'cumulative-layout-shift'
                ], 
                port: chrome.port
            };
                

            const runnerResult = await lighthouse(`${arguments.urlToTest}`, arguments.device == 'desktop' ? desktopOptions : mobileOptions);
            console.log('Report is done for', runnerResult.lhr.finalUrl);
            console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
            let currentdate = new Date(); 
            let datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
            testResults = 
                {
                "Final Score": Math.round(runnerResult.lhr.categories.performance.score * 100),
                'First Contenful Paint': Math.round(runnerResult.lhr.audits['first-contentful-paint'].numericValue), //milliseconds
                'Speed Index': Math.round(runnerResult.lhr.audits['speed-index'].numericValue), //milliseconds
                'Largest Contenful Paint': Math.round(runnerResult.lhr.audits['largest-contentful-paint'].numericValue), //milliseconds
                'Time to Interactive': Math.round(runnerResult.lhr.audits['interactive'].numericValue), //milliseconds
                'Total Blocking Time': Math.round(runnerResult.lhr.audits['total-blocking-time'].numericValue), //milliseconds
                'Cumulative Layout Shift': parseFloat(runnerResult.lhr.audits['cumulative-layout-shift'].displayValue),
                'Report Date': datetime,
                "URL": arguments.urlToTest
                };

            
            try {
                await chrome.kill();
            } catch (e) {
                console.error(e);
            } finally {
                console.log('We do cleanup here');
            }            

            return testResults;            

        })();

        result.then((results) => {
            success(results);            
        });

        result.catch((err) => {
            reject(err);
        });    
    
    });
}


module.exports = {
    runLighthouseMobile: runLighthouseMobile
}