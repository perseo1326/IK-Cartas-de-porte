
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

    const tableData = document.getElementById("table-data");

    const waitPanel = document.getElementById("wait-panel");
    const panelShippingDate = document.getElementById("panel-shipping-date");


    // *********************************************************
    const VERSION = "4.3";
    const UPDATE_HTML = "4.3";

    const EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    
    // minimum required columns from 'Overview.csv' file
        const ISELL_ORDER = "Ref. de Ventas";
        const ORDER_TYPE = "Tipo de pedido";
        const ORDER_STATUS = "Estado del pedido.";
        const CUT_OFF_DATE_TIME = "Fuera plazo";
        const SERVICE_FROM = "Service from";
        const SERVICE_TO = "Service To";
        const DROP_OFF = "Zona Entregas";

    // required columns from 'Historical' and/or 'By Status' file
        const ISELL             = "ISELL_Order_Number";
        const ARTICLE_NAME      = "Article_Name";
        const ARTICLE_NUMBER    = "Article_Number";
        const ORDER_TYPE_EXCEL  = "Order_Type";
        const PACKAGES          = "Packages";
        const WEIGHT            = "Weight";
        const VOLUME_ORDERED    = "Volume_Ordered";
        const ARTICLES          = "Checked_Qty";
        const ORDERED_QTY       = "Ordered_Qty";
        const PICK_AREA         = "Pick_Area";
        
    
    const REPORT_HISTORICAL     = "Historical";
    const REPORT_BY_STATUS      = "By_Status";
    const PICK_UP_POINT = "Punto de recogida";
    const CUT_OFF_DATE = "cut_off_date";
    const CUT_OFF_TIME = "cut_off_time";


    const WORKING_SHEET = "DATA";
    const ORDER_TYPE_DATA = "PICKUP_POINT";

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

    // variable for keep all the "Pick Areas" for all orders lines
    let pickAreas = [];

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
        panelShippingDate.style.display = "none";
    });

    // blocking the mouse wheel to avoid scroll the panel and visualization
    panelShippingDate.addEventListener("wheel", (evento) => { evento.preventDefault() } );
    waitPanel.addEventListener("wheel", (evento) => { evento.preventDefault(); } );

    window.onload = function(){
        // TODO: inicializar la pagina al cargarla 
        try {
            console.log("Versión: ", VERSION);
            document.getElementById("version-titulo").innerText = "(v" + VERSION + ")";
            document.getElementById("version-footer").innerText = "Versión " + VERSION + " - (https://github.com/perseo1326)";
            loadConfigurationPUP();
            initializePage();
        } catch (error) {
            alert(error.message);
        }
    }



    // *********************************************************
    function openFile(evento) {
        
        try {
            let file = evento.target.files[0];
            let fileDate = undefined;

            switch (evento.target.id) {

                // case file 'overview.csv'
                case 'file-input-overview':
                    waitPanel.style.display = "block";
                    initializePage();

                    let fileCSVOverview = new TextFileOpen(file);

                    fileDate = new Date(fileCSVOverview.file.lastModified);
                    uploadFileOverviewButton.innerText = fileCSVOverview.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    // Load data from file
                    let dataPromise = fileCSVOverview.loadAndReadFile();

                    dataPromise.then( (response) => {

                        // process and clean info from the file
                        let arrayDataClean = readOverviewFileCSV(fileCSVOverview.file, response);
                        isellsOverviewMapComplet = mappingArrayDataCSV(arrayDataClean);
                        showSelectionButton();
                        console.log("Carga Overview \"" + fileCSVOverview.file.name + "\" Finalizada!");
                        waitPanel.style.display = "none";

                        // active the buttons 'uploadFileHistorical' and '' to let load the Excel reports
                        fileSelectorHistorical.disabled = false;
                        uploadFileHistorical.classList.remove("disable");

                        fileSelectorByStatus.disabled = false;
                        uploadFileByStatus.classList.remove("disable");
                    })
                    .catch( (error) => {
                            console.log("ERROR:openFile:", error);
                            alert(error.message);
                            window.onload();
                            initializePage();
                            waitPanel.style.display = "none";
                    });
                    break;

                // case file 'Historical'
                case 'file-input-historical':
                    
                    waitPanel.style.display = "block";

                    let fileHistorical = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);

                    uploadFileHistorical.innerText = fileHistorical.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";
                    loadReportsExcel(fileHistorical, uploadFileHistorical);
                    break;

                // case file 'By Order Status'
                case 'file-input-by-order-status': 

                    waitPanel.style.display = "block";

                    let fileStatus = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);

                    uploadFileByStatus.innerText = fileStatus.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";
                    loadReportsExcel(fileStatus, uploadFileByStatus);
                    break;
            }
        } catch (error) {
            console.log("ERROR:openFile: ", error);
            alert(error.message);
            initializePage();
            waitPanel.style.display = "none";
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
        console.log("filterOnlyPUP_FileCSV Data: ", overviewDataArray);

        return overviewDataArray;
    }

    // *********************************************************
    function loadReportsExcel (excelFile, button){

        let fileReader = new FileReader();

        fileReader.onloadend = (event) => { 
            waitPanel.style.display = "none";
        };

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

    // *********************************************************
    // function to verify that all orders have a status "STATUS_COMPLETED"
    function verifyOrderStatusCompleted(){

        let ordersNotCompleted = [];
        ordersMap.forEach( (value, key ) => {
            if(value[ORDER_STATUS] !== STATUS_COMPLETED){
                ordersNotCompleted.push(key);
            }
        });

        console.log("Ordenes que no estan terminadas: ", ordersNotCompleted);
        return ordersNotCompleted;
    }


