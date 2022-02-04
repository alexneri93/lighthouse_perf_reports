const ObjectsToCsv = require('objects-to-csv');
const path = require('path');
const convertCsvToXlsx = require('@aternus/csv-to-xlsx');


async function saveReportExcel(args){
    
    const arguments = JSON.parse(args);

    return new Promise((success, reject) => {
     
        const result = (async () => {

            const csv = new ObjectsToCsv(JSON.parse(arguments.data));
        
            // Save to file:
            await csv.toDisk(`${__dirname}/report.csv`);         
            
            let utc = new Date().toJSON().slice(0,10);
            let currentdate = new Date(); 
            let datetime = currentdate.getHours() + ""
                        + currentdate.getMinutes() + ""
                        + currentdate.getSeconds();
            let source = path.join(__dirname, 'report.csv');
            let destination = path.join(arguments.pathto, `report-${utc}-${datetime}.xlsx`);

            try {
            convertCsvToXlsx(source, destination);
            return "Reported to Excel";
            } catch (e) {
            console.error(e.toString());
            }

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
    saveReportExcel: saveReportExcel
}