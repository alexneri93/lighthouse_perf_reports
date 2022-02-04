const {ipcRenderer, contextBridge} = require("electron");


contextBridge.exposeInMainWorld("api", {

    selectFolderPopup: () => ipcRenderer.invoke("select-folder-popup", true),

    runLighthouseMobilex: (data) => ipcRenderer.invoke("run-lighthouse-mobile", data),

    saveReportExcelX: (data) => ipcRenderer.invoke("save-report-excel", data),


});