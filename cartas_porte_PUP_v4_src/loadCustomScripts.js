
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

    // xlsxScript.src            = "./cartas_porte_PUP_v4_src/xlsx.full.min.js";
    // loadTextFilesScript.src   = "./cartas_porte_PUP_v4_src/LoadReadTextFiles.js";
    // configPUPScript.src       = "./cartas_porte_PUP_v4_src/datos_pup-280.js";
    // viewFunctionsScript.src   = "./cartas_porte_PUP_v4_src/viewFunctions.js";
    // scriptScript.src          = "./cartas_porte_PUP_v4_src/script.js";
    // commonsScript.src         = "./cartas_porte_PUP_v4_src/commons.js";
    // overviewFunctionsScript.src         = "./cartas_porte_PUP_v4_src/overviewFunctions.js";
    // excelReportsFunctionsScript.src     = "./cartas_porte_PUP_v4_src/excelReportsFunctions.js";

    faviconLink.href    = "https://iweof.sharepoint.com/:i:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/favicon.ico?csf=1&web=1&e=EuSYkZ";
    stylesLink.href     = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/styles.css?csf=1&web=1&e=I2elyq";


    // Badalona Online config
    xlsxScript.src            = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/xlsx.full.min.js?csf=1&web=1&e=8GaVhu";
    loadTextFilesScript.src   = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/loadReadTextFiles.js?csf=1&web=1&e=L9HNdc";
    configPUPScript.src       = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/datos_pup-280.js?csf=1&web=1&e=GHwK6n";
    viewFunctionsScript.src   = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/viewFunctions.js?csf=1&web=1&e=uT6Dp0";
    scriptScript.src          = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/script.js?csf=1&web=1&e=VVw9zM";
    commonsScript.src         = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/commons.js?csf=1&web=1&e=zaA5Wz";
    overviewFunctionsScript.src         = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/overviewFunctions.js?csf=1&web=1&e=WyOIJg";
    excelReportsFunctionsScript.src     = "https://iweof.sharepoint.com/:u:/r/teams/o365g_logistics_retes280/Shared%20Documents/02%20-%20OUTFLOW/!!CARTASDEPORTE_GIR-GLO/cartas_porte_PUP_v4_src/excelReportsFunctions.js?csf=1&web=1&e=q9LdNv";


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

