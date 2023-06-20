
'use strict';

    // *********************************************************
    // Variables y constantes

    const fileSelectorOverview = document.getElementById('file-input-overview');
    const uploadFileOverviewButton = document.getElementById("upload-file-b-overview");
    const fileSelectorByStatus = document.getElementById('file-input-by-order-status');
    const uploadFileByStatus = document.getElementById("upload-file-b-by-order-status");
    const fileSelectorHistorical = document.getElementById('file-input-historical');
    const uploadFileHistorical = document.getElementById("upload-file-b-historical");
            // const loadFilesButton = document.getElementById("loadFiles");

    const selectedDate = document.getElementById("selected-date");
    const cutOffTimeSelector = document.getElementById("destino-cut-off-time");
    const serviceWindowSelector = document.getElementById("service-window");
    const processDataB = document.getElementById("process-data");
    const printDocumentationB = document.getElementById("print-documentation-b");
    const addCommentsB = document.getElementById("add-comments-b");
    const frameDestination = document.getElementById("frame-destination");
    const commentsText = document.getElementById("comments-text");
    const commentsContainer = document.getElementById("comments-container");
    const frameShippingDate = document.getElementById("frame-shipping-date");
    const frameOkB = document.getElementById("frame-ok-b");
    const frameCancelB = document.getElementById("frame-cancel-b");

    const tableBody = document.getElementById("data-body");


    
    // *********************************************************

    const filesArray = [undefined, undefined, undefined];
    
    // data structure for containing all the info combined
    let isellsOverviewMapComplet = new Map();
    let isellsMap = new Map();

    // let contentOriginal = [];
    let windowServiceObj = {};
    let todayDate = "";
    // variable to hold the basic name for the printed document
    let printDocumentTitle = "";

    const VERSION = "3.0";
    const EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // minimum required columns from 'Overview.csv' file
        const SALES_REF = "Ref. de Ventas";
        const ORDER_TYPE = "Tipo de pedido";
        const ORDER_STATUS = "Estado del pedido.";
        const CUT_OFF_DATE_TIME = "Fuera plazo";
        const SERVICE_FROM = "Service from";
        const SERVICE_TO = "Service To";

    const PICK_UP_POINT = "Punto de recogida";
    const CUT_OFF_DATE = "cut_off_date";
    const CUT_OFF_TIME = "cut_off_time";


    const WORKING_SHEET = "DATA";
    const ORDER_TYPE_DATA = "PICKUP_POINT";
    const MARKET_HALL = "MARKETHALL";
    const SELF_SERVICE = "SELFSERVE";
    const WAREHOUSE = "FULLSERVE_INTERNAL";

    const DEFAULT_DROPDOWNLIST_VALUE = { 
        value : "",
        text : "Selecciona una opción..." 
    };

    // *********************************************************
    // Event Listeners 
    fileSelectorOverview.addEventListener('change', openFile); 
    fileSelectorByStatus.addEventListener('change', openFile);
    fileSelectorHistorical.addEventListener('change', openFile);

    // selectedDate.addEventListener('change', cleanFiles);
    cutOffTimeSelector.addEventListener('change', loadServiceWindowOptions);

    processDataB.addEventListener('click', processData);
    // printDocumentationB.addEventListener('click', showPanelPrint);
    // frameOkB.addEventListener('click', printDocument);

    addCommentsB.addEventListener('click', () => {
        if (commentsContainer.classList.contains("no-visible")) {
            commentsContainer.classList.remove("no-visible");
            addCommentsB.value = "Ocultar comentarios";
        } else {
            commentsContainer.classList.add("no-visible");
            addCommentsB.value = "Añadir comentarios";            
        }
        commentsText.focus();
        // console.log("elemento: ", commentsText);
    });

    frameCancelB.addEventListener('click', () => { 
        panel.style.display = "none";
    });

    window.onload = function(){
        // TODO: inicializar la pagina al cargarla 
        initializePage();
        console.log("Versión: ", VERSION);
        document.getElementById("version-titulo").innerText = "(v" + VERSION + ")";
        document.getElementById("version-footer").innerText = "Versión " + VERSION + " - (https://github.com/perseo1326)";
    }

    // *********************************************************
    function openFile(evento) {
        
        try {
            let file = evento.target.files[0];
            let fileDate = undefined;
            switch (evento.target.id) {

                // case file 'overview.csv'
                case 'file-input-overview':
                    let fileCSV = new TextFileOpen(file);
                    fileDate = new Date(file.lastModified);
                    uploadFileOverviewButton.innerText = fileCSV.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    // Load data from file
                    let fileReaderOverview = new FileReader();
                    fileReaderOverview.readAsText(fileCSV.file, "windows-1252");
                    fileReaderOverview.onload = function() {
                        try {
                            // process and clean info from the file
                            let arrayDataClean = readOverviewFileCSV(fileCSV.file, this.result);
                            isellsOverviewMapComplet = mappingArrayDataCSV(arrayDataClean);

                            console.log("isellsOverviewMapComplet: ", isellsOverviewMapComplet);
    
                            // showContent(isellsOverviewMap); 
                            
                            showSelectionButton();
                            console.log("Carga Overview \"" + fileCSV.file.name + "\" Finalizada!");

                        } catch (error) {
                            console.log("ERROR:", error);
                            alert(error.message);
                            window.onload();
                            uploadFileOverviewButton.innerText = "Subir archivo 'overview.csv'...";
                            return;
                        }
                    };
                    break;

                // case file 'By Order Status'
                case 'file-input-by-order-status':            
                    let fileStatus = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);

                    uploadFileByStatus.innerText = fileStatus.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    loadReportsExcel(fileStatus, uploadFileByStatus);

                    break;

                // case file 'Historical'
                case 'file-input-historical':
                    let fileHistorical = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);

                    uploadFileHistorical.innerText = fileHistorical.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    loadReportsExcel(fileHistorical, uploadFileHistorical);

                    break;
            }

        } catch (error) {
            console.log("ERROR:openFile: ", error);
            alert(error.message);
            // return;
        }
    }

    // *********************************************************
    function readOverviewFileCSV(file, fileData) {

        let overviewDataArray = [];

        // verificar tipo de archivo
        if(file === undefined || !file.name.toLowerCase().endsWith('.csv')){
            throw new Error("El archivo \"" + file.name + "\" NO es válido.")
        }

        overviewDataArray = loadOverviewFileCSV(fileData);
        console.log("loadOverviewFileCSV Data CARGADO: ", overviewDataArray);

        overviewDataArray = filterOnlyPUP_FileCSV(overviewDataArray);
        console.log("filterOnlyPUP_FileCSV Data: ", overviewDataArray);

        return overviewDataArray;
    }

    // *********************************************************
    function loadReportsExcel (excelFile, button){
        // let fileStatus = new ExcelFileOpen(file);

        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(excelFile.file);
        fileReader.onload =  function(){
            try {
                let buffer = this.result;
                let workbook =  XLSX.read(buffer);
                let contentFile =  XLSX.utils.sheet_to_row_object_array(workbook.Sheets[WORKING_SHEET]);

                // process and clean info from the file
                let arrayExcelClean = readReportsExcel(excelFile.file, contentFile);
                console.log("Carga \"" + excelFile.file.name + "\" Finalizada!", arrayExcelClean); 
                
            } catch (error) {
                console.log("ERROR:", error);
                alert(error.message);
                window.onload();
                button.innerText = "Subir archivo 'By Order Status'...";
                return;
            }
        };
    }
    

    // *********************************************************
    // USER EVENT - PROCESS DATA!!
    // *********************************************************
    function processData() {
        try {
            const dateCutOffDate = validateDate(selectedDate);

            // Find the object from the selected "CUT_OFF_TIME" option
            const cutOffTimeObj = findObjectPUP(cutOffTimeSelector.value);
            if(!cutOffTimeObj) {
                console.log("WARNING:processData: No se ha seleccionado un destino (CUT OFF TIME)");
                throw new Error("No se ha seleccionado un destino (CUT OFF TIME)");
            }

            // Find the object selected in the "SERVICE_WINDOW" selector
            const windowServiceObject = cutOffTimeObj.windowService.find( service => { return service.serviceCode === serviceWindowSelector.value });
            if(!windowServiceObject) {
                console.log('WARNING:processData: No se ha seleccionado un "Service Window" válido.');
                throw new Error('No se ha seleccionado un "Service Window" válido.');
            }        
            
            // Save info for later. Will use it on view
            windowServiceObj = windowServiceObject;

            // filter by date
            console.log("Antes filter fecha: ", isellsOverviewMapComplet.size);
            let isellsMap = dataFilterByDate(isellsOverviewMapComplet, dateCutOffDate);

            console.log("Despues de filtrar x fecha", isellsMap);

            // Data filtered by "CUT OFF TIME"
            isellsMap = dataFilterByCutOffTime(isellsMap, cutOffTimeObj.cutOffTime); 
            console.log("Filtrado por cut off time: ", isellsMap);
            
            isellsMap = dataFilterByServiceWindow(isellsMap, windowServiceObject.serviceValues );
            console.log("filter by service window: ", isellsMap);

            // Bind orders with the same "ISELL_ORDER_NUMBER"
            // const dataMap = bindOrdersPUP_FromArray(content);

            // Calculate the totals for each "Order" 
            // dataMap.forEach( function(value, key){
            //     value.calculateTotals();
            // });

            printDocumentationB.disabled = false;
            printDocumentationB.classList.remove("disable");

            addCommentsB.disabled = false;
            addCommentsB.classList.remove("disable");

            document.getElementById("resume").classList.remove("no-visible");

            const fecha = new Date(dateCutOffDate);
            showProcessValues(fecha, 
                                cutOffTimeObj.title, 
                                cutOffTimeObj.cutOffTime, 
                                windowServiceObject.serviceName, 
                                windowServiceObject.serviceValues );

            frameDestination.innerText = cutOffTimeObj.title + " - " + windowServiceObject.serviceName;

            setAddressTransportDocument(document.getElementById("sender-address"), cutOffTimeObj.senderAddress);
            setAddressTransportDocument(document.getElementById("consignee-address"), cutOffTimeObj.consigneeAddress);
            setAddressTransportDocument(document.getElementById("carrier-address"), cutOffTimeObj.carrierAddress);

            commentsText.value = "";
            commentsContainer.classList.add("no-visible");
            addCommentsB.value = "Añadir comentarios";

            showContent(isellsMap);

            printDocumentTitle = windowServiceObject.serviceName + "_" + cutOffTimeObj.title;

        } catch (error) {
            console.log("ERROR:", error);
            alert(error.message);
            return;
        }

    }


    // *********************************************************
    // Function fo filter the data set by date
    function dataFilterByDate(dataMap, textDate) {
    
        let data = new Map();
        dataMap.forEach( (value, key) => {
            // console.log("dataFilterByDate: ", value, key);
            // console.log("** ", value.cut_off_date);

            if(value.cut_off_date === textDate){
                data.set(key, value);
            }
        });
        return data;
    }

    // *********************************************************
    // Function to filter data by "CUT_OFF_TIME" value selected
    function dataFilterByCutOffTime(dataMap, selection) {
        // console.log("CUT_OFF_TIME, MAPA datos: ", selection, dataMap);

        let data = new Map();
        dataMap.forEach( (value, key) => {    
            // console.log("dataFilterByCutOffTime: ", value, key);
            // console.log("**KEY**: ", value.cut_off_time);
            if(value.cut_off_time === selection){
                data.set(key, value);
            }
        });
        return data;
    }

    // *********************************************************
    function dataFilterByServiceWindow(dataMap, windowServiceArrayOptions) {
        
        // console.log("Dentro de SERVICE WINDOW filter.....", windowServiceArrayOptions, dataMap);
        let data = new Map();

        dataMap.forEach( (value, key) => {
            // console.log("VALOR: ", windowServiceArrayOptions.includes(value[SERVICE_FROM]));
            if(windowServiceArrayOptions.includes(value[SERVICE_FROM])){
                data.set(key, value);
                console.log("VAlor de VALUE: ", value);
            }
        });
        return data;
    }



