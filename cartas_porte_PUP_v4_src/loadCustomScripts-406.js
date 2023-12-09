
// Scripts configuration for shop # 406

function dynamicallyLoadCustomScripts(){

    const scriptsSection = document.head;

    let faviconLink = document.createElement("link");  
    faviconLink.rel = "shortcut icon";
    faviconLink.type = "image/x-icon";

    let stylesLink = document.createElement("link");  
    stylesLink.rel = "stylesheet";

    let xlsxScript              = document.createElement("script");
    let loadTextFilesScript     = document.createElement("script");
    let configPUPScript         = document.createElement("script");
    let viewFunctionsScript     = document.createElement("script");
    let scriptScript            = document.createElement("script");
    let commonsScript           = document.createElement("script");
    let overviewFunctionsScript = document.createElement("script");
    let excelReportsFunctionsScript = document.createElement("script");

    // Favicon 
    faviconLink.href        = "./cartas_porte_PUP_v4_src/favicon.ico";
    stylesLink.href         = "./cartas_porte_PUP_v4_src/styles.css";
    
    // script for handle Excel files and content
    // xlsxScript          = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";

    xlsxScript.src            = "./cartas_porte_PUP_v4_src/xlsx.full.min.js";
    loadTextFilesScript.src   = "./cartas_porte_PUP_v4_src/LoadReadTextFiles.js";
    configPUPScript.src       = "./cartas_porte_PUP_v4_src/datos_pup-406.js";
    viewFunctionsScript.src   = "./cartas_porte_PUP_v4_src/viewFunctions.js";
    scriptScript.src          = "./cartas_porte_PUP_v4_src/script.js";
    commonsScript.src         = "./cartas_porte_PUP_v4_src/commons.js";
    overviewFunctionsScript.src         = "./cartas_porte_PUP_v4_src/overviewFunctions.js";
    excelReportsFunctionsScript.src     = "./cartas_porte_PUP_v4_src/excelReportsFunctions.js";

    // faviconLink.href    = "https://iweof.sharepoint.com/:i:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/favicon.ico?csf=1&web=1&e=Fzve0Q"; 
    // stylesLink.href     = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/styles.css?csf=1&web=1&e=5VYOhu";


    // 406 Online config
    // xlsxScript.src            = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/xlsx.full.min.js?csf=1&web=1&e=i3AabL";
    // loadTextFilesScript.src   = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/LoadReadTextFiles.js?csf=1&web=1&e=g5aGs3";
    // configPUPScript.src       = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/datos_pup-406.js?csf=1&web=1&e=YWWtnS";
    // viewFunctionsScript.src   = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/viewFunctions.js?csf=1&web=1&e=dyBzJv";
    // scriptScript.src          = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/script.js?csf=1&web=1&e=rFneja";
    // commonsScript.src         = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/commons.js?csf=1&web=1&e=NvKN7r";
    // overviewFunctionsScript.src         = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/overviewFunctions.js?csf=1&web=1&e=bSwnDl";
    // excelReportsFunctionsScript.src     = "https://iweof.sharepoint.com/:u:/r/teams/o365g_all_retes406/Shared%20Documents/!!LOGISTICA/!OUTFLOW/CMP%27s/cartas_porte_PUP_v4_src/excelReportsFunctions.js?csf=1&web=1&e=JIWHFd";


    // Adding elements 
    scriptsSection.appendChild(faviconLink);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    scriptsSection.appendChild(stylesLink);  
    scriptsSection.appendChild(xlsxScript);
    scriptsSection.appendChild(loadTextFilesScript);
    scriptsSection.appendChild(configPUPScript);
    scriptsSection.appendChild(viewFunctionsScript);
    scriptsSection.appendChild(scriptScript);
    scriptsSection.appendChild(commonsScript);
    scriptsSection.appendChild(overviewFunctionsScript);
    scriptsSection.appendChild(excelReportsFunctionsScript);

}

dynamicallyLoadCustomScripts();

