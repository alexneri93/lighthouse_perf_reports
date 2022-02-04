/*const electron = require('electron');
const path = require('path');
const fs = require('fs');*/
const urlTest = document.getElementById("url");
const iterationsTest = document.getElementById("iterations");
const folderPath = document.getElementById("folder-path");
const btnSelFodler = document.getElementById("select-folder");
const btnlTest = document.getElementById("make-test");
const load_popup = document.querySelector(".loading-popup");
const cancelTests = document.getElementById("cancel-tests");

const finalScore = document.getElementById("final-score");
const fcpScore = document.getElementById("fcp-score");
const siScore = document.getElementById("si-score");
const lcpScore = document.getElementById("lcp-score");
const ttiScore = document.getElementById("tti-score");
const tbtScore = document.getElementById("tbt-score");
const clsScore = document.getElementById("cls-score");

var flagStop = false;


btnlTest.addEventListener("click", (e) => {
    e.preventDefault();
    makeTest();
});

btnSelFodler.addEventListener("click", (e) => {
    e.preventDefault();
    chooseFolder();
})

cancelTests.addEventListener("click", (e) => {
    e.preventDefault();
    flagStop = true;
    console.log("cancel tests");
    load_popup.classList.add("cancelling");
})


//Choose folder
async function chooseFolder(){
    //make an ipc call to open dialog

    const result = await api.selectFolderPopup();
    
    if(result.filePaths.length == 1){
        console.log("Selected: "+result.filePaths[0]);    
        folderPath.value = result.filePaths[0];
    }    

}

async function makeTest(){
    let iterations = iterationsTest.value;
    let url = urlTest.value;
    let deviceTest = document.querySelector('input[name="device"]:checked').value;
    var testResults = [];
    let progress = document.getElementById("progress-bar");
    let actual_test = document.getElementById("actual-test");
    let total_tests = document.getElementById("total-tests");
    let real_iterations = 0;

    flagStop = false;
    
    if(url && iterations){
        total_tests.innerHTML = iterations;
        load_popup.classList.add("show");
        if(load_popup.classList.contains("cancelling")){
            load_popup.classList.remove("cancelling");
        }
        let dataTest = JSON.stringify({urlToTest: url, device: deviceTest});
        //Run tests
        for (var i = 1; i <= iterations; i++) {
            if(!flagStop){
                console.log("Starting test "+i);
                actual_test.innerHTML = i;
                progress.style.width = ((i - 1) / iterations) * 100+"%";
                const result = await api.runLighthouseMobilex(dataTest);
                testResults.push(result);
                real_iterations ++;
            }
        }
        //Export data
        if(folderPath.value){
            let data_excel = JSON.stringify(testResults);
            let data = JSON.stringify({pathto: folderPath.value, data: data_excel});
            const toExcel = await api.saveReportExcelX(data);
        }
        //Calculate score average        
        calculateScores(testResults, real_iterations);
        load_popup.classList.remove("show");        
    }else{
        alert("You need to specify the URL and how many tests");
    }
}

function calculateScores(scoreData, timesToTest){
    let deviceTest = document.querySelector('input[name="device"]:checked').value;
    let finalscoreData = 0;
    let fcpScoreData = 0;
    let siScoreData = 0;
    let lcpScoreData = 0;
    let ttiScoreData = 0;
    let tbtScoreData = 0;
    let clsScoreData = 0;

    scoreData.forEach(element => {
        finalscoreData += element["Final Score"];
        fcpScoreData += element["First Contenful Paint"];
        siScoreData += element["Speed Index"];
        lcpScoreData += element["Largest Contenful Paint"];
        ttiScoreData += element["Time to Interactive"];
        tbtScoreData += element["Total Blocking Time"];
        clsScoreData += element["Cumulative Layout Shift"];
    });
    
    finalscoreData =  Math.round(finalscoreData / timesToTest);
    fcpScoreData = Math.round(fcpScoreData / timesToTest);
    siScoreData = Math.round(siScoreData / timesToTest);
    lcpScoreData = Math.round(lcpScoreData / timesToTest);
    ttiScoreData = Math.round(ttiScoreData / timesToTest);
    tbtScoreData = Math.round(tbtScoreData / timesToTest);
    clsScoreData = clsScoreData / timesToTest;

    document.getElementById("url-tested").innerHTML = urlTest.value;
    document.getElementById("times-tested").innerHTML = timesToTest;
    document.getElementById("device-tested").innerHTML = deviceTest;
    finalScore.innerHTML = finalscoreData;
    fcpScore.innerHTML = fcpScoreData;
    siScore.innerHTML = siScoreData;
    lcpScore.innerHTML = lcpScoreData;
    ttiScore.innerHTML = ttiScoreData;
    tbtScore.innerHTML = tbtScoreData;
    clsScore.innerHTML = clsScoreData.toFixed(3);
    
    let circle_score = 440 - ((finalscoreData / 100) * 440);
    document.querySelector(".circle_animation").style["stroke-dashoffset"] = `${circle_score}`;
}