
'use strict';

    // *********************************************************
    // Variables y constantes

    const fileSelectorOverview = document.getElementById('file-input-overview');
    const uploadFileOverviewButton = document.getElementById("upload-file-b-overview");
    const fileSelectorHistorical = document.getElementById('file-input-historical');
    const uploadFileHistorical = document.getElementById("upload-file-b-historical");
    const fileSelectorByStatus = document.getElementById('file-input-by-order-status');
    const uploadFileByStatus = document.getElementById("upload-file-b-by-order-status");

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
    const editRows = document.getElementById("edit-rows");

    const tableBody = document.getElementById("data-body");


    

    // *********************************************************

    // location for config Pick Up Points file
    // const CONFIG_PUPS_DATA_PATH = "./cartas_porte_PUP_src/config_data_pups.json";
    const CONFIG_PUPS_DATA_PATH = "http://servidor.com/IK-Cartas-de-porte/cartas_porte_PUP_src/config_data_pups.json";
    // const configData = getJsonConfig(CONFIG_PUPS_DATA_PATH);
    // let configData = [];

    // let configData = new Promise(function(resolve, reject){ 
    //                                                         const data = getJsonConfig(CONFIG_PUPS_DATA_PATH);
    //                                                         console.log("DATA IN PROMISE: ", data);
    //                                                         if(data.status === 200 ) {
    //                                                             resolve(data);
    //                                                         } else {
    //                                                             reject(data);
    //                                                         }
    //                                                     });

    // configData.then(function(response){
    //     console.log("REPONSE THEN: ", response);
    //     configData = response;
    // })
    // .catch(function(error){
    //     console.log("ERROR CATCH: ", error);
    // });

    const VERSION = "3.0";
    const EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // minimum required columns from 'Overview.csv' file
        const ISELL_ORDER = "Ref. de Ventas";
        const ORDER_TYPE = "Tipo de pedido";
        const ORDER_STATUS = "Estado del pedido.";
        const CUT_OFF_DATE_TIME = "Fuera plazo";
        const SERVICE_FROM = "Service from";
        const SERVICE_TO = "Service To";

    // required columns from 'Historical' and/or 'By Status' file
        const ISELL             = "ISELL_ORDER_NUMBER";
        const ARTICLE_NAME      = "ARTICLE_NAME";
        const ARTICLE_NUMBER    = "ARTICLE_NUMBER";
        // const ORDER_TYPE_EXCEL  = "ORDER_TYPE";
        const PACKAGES          = "PACKAGES";
        const WEIGHT            = "WEIGHT";
        const VOLUME_ORDERED    = "VOLUME_ORDERED";
        const ARTICLES          = "ARTICLES";
        const ORDERED_QTY       = "ORDERED_QTY";
        const PICK_AREA         = "PICK_AREA";
        
    
    const REPORT_HISTORICAL     = "Historical";
    const REPORT_BY_STATUS      = "By_Status";
    const PICK_UP_POINT = "Punto de recogida";
    const CUT_OFF_DATE = "cut_off_date";
    const CUT_OFF_TIME = "cut_off_time";


    const WORKING_SHEET = "DATA";
    const ORDER_TYPE_DATA = "PICKUP_POINT";
    const MARKET_HALL = "MARKETHALL";
    const SELF_SERVICE = "SELFSERVE";
    const WAREHOUSE = "FULLSERVE_INTERNAL";

    const NO_INFO = "No Info";
    const ISELL_EMPTY  = "-";
    // Order Status variables
        const STATUS_NOT_STARTED     = "No empezado";
        const STATUS_STARTED         = "Empezado";
        const STATUS_PICKING         = "Picking";
        const STATUS_WAIT_FOR_MERGE  = "Espera para juntar";
        const STATUS_PICKED          = "Recogido";
        const STATUS_CHECK_STARTED   = "Comprobación iniciada";
        const STATUS_CHECKED         = "Comprobado";
        const STATUS_COMPLETED       = "Entregado";

    const DEFAULT_DROPDOWNLIST_VALUE = { 
        value : "",
        text : "Selecciona una opción..." 
    };

    
    // data structure for containing all the info combined
        // complet, filtered and clean info for 'Overview.csv'
        let isellsOverviewMapComplet = new Map();
        
        // complet, filtered and clean info for 'Overview.csv'
        let isellsHistorical = {
            type : REPORT_HISTORICAL,
            isellsMap : new Map()
        };

        // complet, filtered and clean info for 'By Status.xlsx'
        let isellsByStatus = { 
            type : REPORT_BY_STATUS, 
            isellsMap : new Map()
        };

    // will contain the orders (isells) filtered by CUT OFF DATE, CUT OFF TIME AND SERVICE WINDOW
    let ordersMap = new Map();

    // let contentOriginal = [];
    let windowServiceObj = {};
    let todayDate = "";
    // variable to hold the basic name for the printed document
    let printDocumentTitle = "";



    // *********************************************************
    // Event Listeners 
    fileSelectorOverview.addEventListener('change', openFile); 
    fileSelectorByStatus.addEventListener('change', openFile);
    fileSelectorHistorical.addEventListener('change', openFile);

    cutOffTimeSelector.addEventListener('change', loadServiceWindowOptions);

    processDataB.addEventListener('click', processData);
    printDocumentationB.addEventListener('click', showPanelPrint);
    frameOkB.addEventListener('click', printDocument);

    addCommentsB.addEventListener('click', () => {
        if (commentsContainer.classList.contains("no-visible")) {
            commentsContainer.classList.remove("no-visible");
            addCommentsB.value = "Ocultar comentarios";
        } else {
            commentsContainer.classList.add("no-visible");
            addCommentsB.value = "Añadir comentarios";            
        }
        commentsText.focus();
    });

    frameCancelB.addEventListener('click', () => { 
        panel.style.display = "none";
    });


    window.onload = function(){
        // TODO: inicializar la pagina al cargarla 

        try {
            // configData = getJsonConfig(CONFIG_PUPS_DATA_PATH);
            // console.log("ONLOAD: configData: ", typeof(configData), configData);
            
            // configData.then(function(response){
            //     console.log("RESPONSE: ", response);
            // })
            // .catch(function(error)  {
            //     console.log("Error fuera de la funcion: ", error);
            //     alert("Error fuera de la funcion: " + error.message);
            // })

            console.log("Versión: ", VERSION);
            document.getElementById("version-titulo").innerText = "(v" + VERSION + ")";
            document.getElementById("version-footer").innerText = "Versión " + VERSION + " - (https://github.com/perseo1326)";
            initializePage();
        } catch (error) {
            console.log("ERROR ONLOAD: ", error);
            alert("Error al cargar la configuracion, pruebe actualizar la página de nuevo.");
        }
        
    }

    // *********************************************************
    // function to load config info from a JSON file via http
    async function getJsonConfig( pathFile ) {
        

        const init = { mode: "no-cors", headers: { 'Content-Type': 'application/json' } };
        let data = undefined;

        let file = await fetch(pathFile, init);
        console.log("FETCH: file: ", file);
        
        if(file.status !== 200 ) {
            throw new Error("Http Status Error Code: " + file.status);
        }
        data = await file.json();
        // let data = await file.text();
        return data;

        // fetch(pathFile, init)
        //     .then(function(response) {
        //         console.log("FETCH: response: ", response);
        //     })
        //     .catch(function(error){
        //         console.log("Error: THEN: ", error);
        //         throw new Error(error.message);
        //     });
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
                            showSelectionButton();
                            console.log("Carga Overview \"" + fileCSV.file.name + "\" Finalizada!");

                        } catch (error) {
                            console.log("ERROR:", error);
                            alert(error.message);
                            window.onload();
                            // initializePage();
                            uploadFileOverviewButton.innerText = "Subir archivo 'overview.csv'...";
                        }
                    };
                    break;

                // case file 'Historical'
                case 'file-input-historical':
                    let fileHistorical = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);

                    uploadFileHistorical.innerText = fileHistorical.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    loadReportsExcel(fileHistorical, uploadFileHistorical);
                    break;

                // case file 'By Order Status'
                case 'file-input-by-order-status':            
                    let fileStatus = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);

                    uploadFileByStatus.innerText = fileStatus.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    loadReportsExcel(fileStatus, uploadFileByStatus);
                    break;
            }
        } catch (error) {
            console.log("ERROR:openFile: ", error);
            alert(error.message);
        }
    }

    // *********************************************************
    function readOverviewFileCSV(file, fileData) {

        let overviewDataArray = [];

        // verificar tipo de archivo
        if(file === undefined || !file.name.toLowerCase().endsWith('.csv')){
            throw new Error("El archivo \"" + file.name + "\" NO es válido.")
        }

        overviewDataArray = loadOverviewFileCSV(file, fileData);
        console.log("loadOverviewFileCSV Data CARGADO: ", overviewDataArray);

        overviewDataArray = filterOnlyPUP_FileCSV(overviewDataArray);
        // console.log("filterOnlyPUP_FileCSV Data: ", overviewDataArray);

        return overviewDataArray;
    }

    // *********************************************************
    function loadReportsExcel (excelFile, button){

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
                if(button.id === "upload-file-b-historical"){
                    isellsHistorical.isellsMap = mappingArrayDataExcel( arrayExcelClean );
                } else {
                    isellsByStatus.isellsMap = mappingArrayDataExcel( arrayExcelClean );
                }
            } catch (error) {
                console.log("ERROR:", error);
                alert(error.message);
                window.onload();
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
            // console.log("Antes filter fecha: ", isellsOverviewMapComplet.size);
            ordersMap = dataFilterByDate(isellsOverviewMapComplet, dateCutOffDate);
            // console.log("Despues de filtrar x fecha", ordersMap);

            // Data filtered by "CUT OFF TIME"
            ordersMap = dataFilterByCutOffTime(ordersMap, cutOffTimeObj.cutOffTime); 
            // console.log("Filtrado por cut off time: ", ordersMap);
            
            ordersMap = dataFilterByServiceWindow(ordersMap, windowServiceObject.serviceValues );
            // console.log("filter by service window: ", ordersMap);

            combineOrdersWithDetails(ordersMap, isellsHistorical);
            combineOrdersWithDetails(ordersMap, isellsByStatus);

            // Calculate the totals for each "Order" 
            ordersMap.forEach( function(order, isell){
                order.calculateTotals();
            });

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

            // make visible the bin icon
            editRows.classList.remove("no-visible");
            showContent(ordersMap);

            printDocumentTitle = windowServiceObject.serviceNameShort + "_" + cutOffTimeObj.title;

        } catch (error) {
            console.log("ERROR:", error);
            alert(error.message);
        }
    }


    // *********************************************************
    // Function fo filter the data set by date
    function dataFilterByDate(dataMap, textDate) {
    
        let data = new Map();
        dataMap.forEach( (value, key) => {

            if(value.cut_off_date === textDate){
                data.set(key, value);
            }
        });
        return data;
    }

    // *********************************************************
    // Function to filter data by "CUT_OFF_TIME" value selected
    function dataFilterByCutOffTime(dataMap, selection) {

        let data = new Map();
        dataMap.forEach( (value, key) => {    
            if(value.cut_off_time === selection){
                data.set(key, value);
            }
        });
        return data;
    }

    // *********************************************************
    function dataFilterByServiceWindow(dataMap, windowServiceArrayOptions) {
        
        let data = new Map();

        dataMap.forEach( (value, key) => {
            if(windowServiceArrayOptions.includes(value[SERVICE_FROM])){
                data.set(key, value);
            }
        });
        return data;
    }

    // *********************************************************
    function combineOrdersWithDetails(orders, detailsMap){
        
        orders.forEach( (order, isell) => { 
            
            if(order.details === undefined && detailsMap.isellsMap.has(order[ISELL_ORDER])) {
                
                let orderDetail = detailsMap.isellsMap.get(order[ISELL_ORDER]);
                order.details = orderDetail;
                order.source = detailsMap.type;
                
                orders.set(isell, order);
            }
        });
    }
    
    // *********************************************************
    // function to remove a specific ISELL from the table to avoid print it
    function removeOrder( isell ){

        ordersMap.delete(isell);
    }