(function () {



    // *********************************************************
    // Variables y constantes

    const fileSelector = document.getElementById('file-input');
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
    class Order {
        constructor(isell, cutOffDate, cutOffTime, serviceWindow){
            this.isell          = isell.trim();
            this.cutOffDate     = cutOffDate.trim();
            this.cutOffTime     = cutOffTime.trim();
            this.serviceWindow  = serviceWindow.trim();
            this.totalPackages  = 0;
            this.totalVolume    = 0;
            this.totalWeight    = 0;
            
            this.pickArea       = new Map([
                [MARKET_HALL, []],
                [SELF_SERVICE, []], 
                [WAREHOUSE, []]
            ]);
        }

        addProduct(row){
            // Product constructor(articleName, articleNumber, packages, weight, volume, quantity, pickArea ) {
            let product = new Product(row.ARTICLE_NAME, row.ARTICLE_NUMBER, row.PACKAGES, row.WEIGHT, row.VOLUME_ORDERED, row.ORDERED_QTY);
            this.pickArea.get(row.PICK_AREA).push(product);
        }

        calculateTotals(){
            let order = this;
            // console.log("VAlor de la ORDEN (Objeto): ", this);
            order.pickArea.forEach( function(area){
                // console.log("Area: ", area);
                area.forEach(function(product){
                    // console.log("PRODUCTO: ", product);
                    // order.totalPackages += product.packages;     // Exist X = 0 -> ERROR!
                    order.totalPackages += product.orderedQty;
                    order.totalVolume += (product.volume * product.orderedQty);
                    order.totalWeight += (product.weight * product.orderedQty);
                });
            });
            // console.log("Totales orden: ", order);
        }

        containPickArea(area){
            let order = this;
            // console.log("containPickArea: ", order.pickArea.get(area));
            if(order.pickArea.get(area).length < 1 ){
                return "";
            }
            return "X";
        }
    }

    class Product {
        constructor(articleName, articleNumber, packages, weight, volume, orderedQty) {
            // this.articleName    = articleName.trim();
            this.articleName    = articleName === undefined ? "X" : articleName.trim();
            this.articleNumber  = articleNumber.trim();
            // this.packages       = Number (packages.trim().replace(',', '.'));
            this.packages       = packages === undefined ? "0" : Number (packages.trim().replace(',', '.'));
            this.weight         = Number (weight.trim().replace(',', '.'));
            this.volume         = Number (volume.trim().replace(',', '.'));
            this.orderedQty       = Number (orderedQty.trim().replace(',', '.'));
        }
    }

    // *********************************************************

    let fileReader = new FileReader();

    let contentOriginal = [];
    let windowServiceObj = {};
    let todayDate = "";
    // variable to hold the basic name for the printed document
    let printDocumentTitle = "";

    const VERSION = "3.0";
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
    fileSelector.addEventListener('change', openFile); 
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
        // console.log("elemento: ", commentsText);
    });

    frameCancelB.addEventListener('click', () => { 
        panel.style.display = "none";
    });

    window.onload = function(){
        console.log("Versión: ", VERSION);
        document.getElementById("version-titulo").innerText = "(v" + VERSION + ")";
        document.getElementById("version-footer").innerText = "Versión " + VERSION + " - (https://github.com/perseo1326)";
    }




    // *********************************************************
    // Function to validate a given date
    function validateDate(inputDate) {
        const date = inputDate.valueAsDate;
        if(!date ){
            console.log("La fecha seleccionada es inválida.");
            alert("La fecha seleccionada es inválida.");
            return false;
        } 
        return inputDate.value;
    }
    
    // *********************************************************
    // Show message "File not valid!"
    // function fileNotValid(message = "Archivo vacio o sin formato correcto.") { 
    //     console.log(message);
    //     initializePage();
    //     alert(message);
    //     return false;
    // }

    // *********************************************************
    function openFile(evento) {
        console.clear();
        initializePage();
        let file = evento.target.files[0];

        const fileDate = new Date(file.lastModified);

        file = verifyFileExist(file);
        if(!file) {            
            return;
        }

        document.getElementById("upload-file-b").innerText = file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

        fileReader.readAsArrayBuffer(file);
        fileReader.onload = loadAsyncData;
    }

    // *********************************************************
    // Function to initialize the variables and environment 
    function initializePage() {
        console.log("Inicializando los valores por defecto de la página.");
        document.title = printDocumentTitle = "PUP's Cartas de Porte V" + VERSION;

        fileReader = new FileReader();
        document.getElementById("upload-file-b").innerText = "Subir archivo...";
        contentOriginal = [];
        windowServiceObj = {};
        // TODO: cambiar fecha manual
        todayDate = new Date();
        selectedDate.valueAsDate = todayDate;
        commentsText.value = "";
        showProcessValues(null, "", "", "", "");
        showContent(contentOriginal);
        
        selectedDate.disabled = true;
        selectedDate.classList.add("disable");
        
        cutOffTimeSelector.disabled = true;
        cutOffTimeSelector.classList.add("disable");

        serviceWindowSelector.disabled = true;
        serviceWindowSelector.classList.add("disable");

        processDataB.disabled = true;
        processDataB.classList.add("disable");

        printDocumentationB.disabled = true;
        printDocumentationB.classList.add("disable");

        addCommentsB.disabled = true;
        addCommentsB.classList.add("disable");

        commentsContainer.classList.add("no-visible");

        loadConfigurationPUP();
    }

    // *********************************************************
    function loadConfigurationPUP() {
        // Function to load the destination ("CUT_OFF_TIME") options into the drop down list selector 

        cleanChildNodes(cutOffTimeSelector);
        loadOptionsDropDownListView(cutOffTimeSelector, DEFAULT_DROPDOWNLIST_VALUE.value, DEFAULT_DROPDOWNLIST_VALUE.text );

        if(typeof(configData) === "undefined") {
            console.log("No fue posible cargar la configuración inicial.");
            alert("No fue posible cargar la configuración inicial.");
            // TODO: retornar un obj Eror ?
        }

        configData.forEach( (destination) => {
            loadOptionsDropDownListView(cutOffTimeSelector, destination.pupId, destination.title);
        } );
    }

    // *********************************************************
    // Function to clean their HTML DOM element child nodes 
    function cleanChildNodes(parentNode) {
        if(parentNode.childNodes.length > 0 ) {
            parentNode.lastChild.remove();
            cleanChildNodes(parentNode);
        }
    }

    // *********************************************************
    // Function to load the options into the drop down list "CUT OFF TIME" and "SERVICE_WINDOW". 
    function loadOptionsDropDownListView(parentNode, value, text) {
        const option = document.createElement("option");
        option.value = value;
        option.text = text;
        
        parentNode.appendChild(option);
    }

    // *********************************************************
    // Function to load the "SERVICE_WINDOW" options into the drop down list selector.
    function loadServiceWindowOptions () {

        cleanOptionsScrollDown(serviceWindowSelector);
        loadOptionsDropDownListView(serviceWindowSelector, DEFAULT_DROPDOWNLIST_VALUE.value, DEFAULT_DROPDOWNLIST_VALUE.text );
        
        const pupSelected = findObjectPUP(this.value);
        if (!pupSelected) {
            return;
        }

        pupSelected.windowService.forEach( service => {
            loadOptionsDropDownListView(serviceWindowSelector, service.serviceCode, service.serviceName );
        });
    }

    // *********************************************************
    function cleanOptionsScrollDown(dropDownListSelector) {
        if(dropDownListSelector.options.length > 0) {
            dropDownListSelector.remove(0);
            cleanOptionsScrollDown(dropDownListSelector);
        }
    }

    // *********************************************************
    // Function to find a destination ("CUT_OFF_TIME") from a "pupId" given
    function findObjectPUP (value) {
        return configData.find( obj => { return obj.pupId === value});
    }

    // *********************************************************
    // Verifica el archivo seleccionado        
    function verifyFileExist(file) {
        if (!file) {
            alert("No se ha seleccionado ningun archivo.");
            console.log("No se ha seleccionado ningun archivo.");
            return null;
        }
        /*
        if (file.type && !file.type.startsWith('text/')) {
            alert('El archivo seleccionado NO es válido.');
            console.log('El archivo seleccionado NO es válido.');
            return null;
        }
        */
        return file;
    }

    // *********************************************************
    // Function to read, filter and clean the read data from the file
    function loadAsyncData () {

        let rowDataPromise = readBinaryDataFile();
        rowDataPromise.then( cleanDataArray );        
        rowDataPromise.catch(function(error){ console.log("ERROR: al retornar de la promise ", error)});
    }

    // *********************************************************
    // Function to read and load the info from the file to a global variable 'contentOriginal'
    async function readBinaryDataFile() {

        let buffer = fileReader.result;
        
        // let workbook = XLSX.read(buffer, { type : "array" });
        let workbook = await XLSX.read(buffer);

        // console.log("Workbook: ", workbook);
        // console.log("Nombres de hojas ", workbook.SheetNames);
        // console.log("Existe la hoja '" + WORKING_SHEET + "'? ", workbook.SheetNames.includes(WORKING_SHEET));
        // console.log(workbook.Sheets[WORKING_SHEET]);
        return (await XLSX.utils.sheet_to_row_object_array(workbook.Sheets[WORKING_SHEET]));
    }

    // *********************************************************
    function cleanDataArray(dataArray) {
        
        // Validate the format of the file and data structure
        if(!validateContent(dataArray)) {
            return;
        }
        
        // console.log("DataArray length: ", dataArray.length);
        dataArray = filterOrderTypeOnlyPUP(dataArray);
        console.log("filterOrderTypeOnlyPUP ********", dataArray);

        selectedDate.disabled = false;
        selectedDate.classList.remove("disable");

        cutOffTimeSelector.disabled = false;
        cutOffTimeSelector.classList.remove("disable");

        serviceWindowSelector.disabled = false;
        serviceWindowSelector.classList.remove("disable");

        processDataB.disabled = false;
        processDataB.classList.remove("disable");

        contentOriginal = dataArray;
    }

    // *********************************************************
    // Verify the valid structure of data readed from the file based on the headers of info
    function validateContent(arrayRow) {

        // console.log("VAlidate Content, arrayRow: ", arrayRow);

        try {
            if(arrayRow.length <= 0 ) {
                throw new Error("Archivo NO válido.");
            }

            if(arrayRow[0].ORDER_TYPE === undefined || arrayRow[arrayRow.length - 1].ISELL_ORDER_NUMBER === undefined) {
                throw new Error("Esctructura de datos NO válida.")
            }

        } catch (error) {
            console.log("En Try/Catch error!", error);
            alert(error.message);
            initializePage();
            return false;
        }
        return true;
    }

    // *********************************************************
    // Check and remove all elements with "Order Type" different that "PUP"
    function filterOrderTypeOnlyPUP(dataArray) {
        return dataArray.filter( (row) => { 
            return row.ORDER_TYPE.trim() === ORDER_TYPE_DATA;
        } );
    }

    // *********************************************************
    // USER EVENT - PROCESS DATA!!
    // *********************************************************
    function processData() {

        const dateCutOffDate = validateDate(selectedDate);
        if(!dateCutOffDate) {
            return;
        }

        // Find the object from the selected "CUT_OFF_TIME" option
        const cutOffTimeObj = findObjectPUP(cutOffTimeSelector.value);
        if(!cutOffTimeObj) {
            console.log("No se ha seleccionado un destino (CUT OFF TIME)");
            alert("No se ha seleccionado un destino (CUT OFF TIME)");
            return;
        }

        // Find the object selected in the "SERVICE_WINDOW" selector
        const windowServiceObject = cutOffTimeObj.windowService.find( service => { return service.serviceCode === serviceWindowSelector.value });
        if(!windowServiceObject) {
            console.log('No se ha seleccionado un "Service Window" válido.');
            alert('No se ha seleccionado un "Service Window" válido.');
            return;
        }        
        
        // Save info for later. Will use it on view
        windowServiceObj = windowServiceObject;

        // filter by date
        // console.log("Content Original antes filter fecha: ", contentOriginal.length);
        let content = dataFilterByDate(contentOriginal, dateCutOffDate);

        // console.log("Content: despues de filtrar x fecha", content.length);

        content.forEach( row => { console.log("Comprobacion de Fecha: ", row.CUT_OFF_DATE )});

        
        // Data filtered by "CUT OFF TIME"
        content = dataFilterByCutOffTime(content, cutOffTimeObj.cutOffTime); 
        // console.log("Filtrado por cut off time: ", content);
        
        content = dataFilterByServiceWindow(content, windowServiceObject.serviceValues );
        console.log("filter by service window: ", content);

        // Bind orders with the same "ISELL_ORDER_NUMBER"
        const dataMap = bindOrdersPUP_FromArray(content);

        // Calculate the totals for each "Order" 
        dataMap.forEach( function(value, key){
            value.calculateTotals();
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

        showContent(dataMap);

        printDocumentTitle = windowServiceObject.serviceName + "_" + cutOffTimeObj.title;
    }

    // *********************************************************
    // Function fo filter the data set by date
    function dataFilterByDate(dataArray, textDate) {
        return dataArray.filter( (row) => { 
            return row.CUT_OFF_DATE.trim() === textDate });
    }
    
    // *********************************************************
    // Function to filter data by "CUT_OFF_TIME" value selected
    function dataFilterByCutOffTime(dataArray, selection) {
        // console.log("CUT_OFF_TIME, Array datos: ", selection, dataArray[0]);
        return dataArray.filter( (row) => { return row.CUT_OFF_TIME.trim() === selection });
    }

    // *********************************************************
    function dataFilterByServiceWindow(dataArray, windowServiceArrayOptions) {
        // console.log("Dentro de SERVICE WINDOW filter.....", windowServiceArrayOptions, dataArray);
        return dataArray.filter( row => {
            return windowServiceArrayOptions.includes(row.SERVICE_WINDOW.trim()); 
        });
    }

    // *********************************************************
    // function to join different orders with same "ISELL_NUMBER" in one "Order" object.
    function bindOrdersPUP_FromArray(arrayData) {
        const dataMap = new Map();
        arrayData.forEach( (row) => {
            // console.log("FILA Producto: Packages: ", row.PACKAGES, " Articles: ", row.ARTICLES);

            if(!dataMap.has(row.ISELL_ORDER_NUMBER)) {
                // Order constructor(isell, cutOffDate, cutOffTime, serviceWindow){
                let order = new Order(row.ISELL_ORDER_NUMBER, row.CUT_OFF_DATE, row.CUT_OFF_TIME, row.SERVICE_WINDOW);
                dataMap.set(row.ISELL_ORDER_NUMBER, order);
            }
                
            let objeto = dataMap.get(row.ISELL_ORDER_NUMBER);    
            // console.log("Objeto: ", objeto);

            objeto.addProduct(row);
        });
        console.log("MAPA: ", dataMap);
        return dataMap;
    }






    // *********************************************************
    function showProcessValues (dateCutOffDate, title, timeCutOffTime, serviceName, serviceValues ) {
        if(dateCutOffDate) {
            document.getElementById("resume-cut-off-date").innerText = dateCutOffDate.toLocaleDateString();
        } else {
            document.getElementById("resume-cut-off-date").innerText = "";
        }
        document.getElementById("resume-cut-off-time").innerText = title + " (" + timeCutOffTime + ")";
        document.getElementById("resume-service-window").innerText = serviceName + " (" + serviceValues + ")";
    }

    // *********************************************************
    function setAddressTransportDocument(parentNode, addressArray) {

        cleanChildNodes(parentNode);
        const firstLine = document.createElement("p");
        const strongLine = document.createElement("strong");
        strongLine.innerText = addressArray[0];
        firstLine.appendChild(strongLine);
        parentNode.appendChild(firstLine);
        
        for (let i = 1; i < addressArray.length; i++) {
            const element = addressArray[i];
            const line = document.createElement("p");
            line.innerText = element;
            parentNode.appendChild(line);
        }
    }

    // *********************************************************
    function showPanelPrint(){
        panel.style.display = "flex";
        frameShippingDate.value = "----------";
    }

    // *********************************************************
    function printDocument() {

        const shippingDateValue = validateDate(frameShippingDate);
        if(!shippingDateValue) { 
            return;
        }
        
        const shippingDate = new Date(shippingDateValue);
        document.getElementById("transport-document-number").innerText = windowServiceObj.documentTransport_A + 
                                                                            shippingDate.toLocaleDateString() +
                                                                            windowServiceObj.documentTransport_B; 
        document.getElementById("transport-document-loading-date").innerText = shippingDate.toLocaleDateString();
        document.getElementById("transport-document-receipt-date").innerText = shippingDate.toLocaleDateString();

        panel.style.display = "none";

        comments.innerText = commentsText.value;
        
        // Set document title for printing purpose
        document.title = shippingDateValue + "_" + printDocumentTitle;

        window.print();
    }


    // *********************************************************
    function showContent(data) {
        // Clean and initialize values for the table data view
        tableBody.innerHTML = "";
        let dataTableBody = "";
        let count = 1;
        let totalPackagesShipment = 0;
        let totalWeightShipment = 0;
        let totalVolumeShipment = 0;

        let totalMarkethallOrders = 0;
        let totalSelfServiceOrders = 0;
        let totalFullInternalOrders = 0;
                
        // fill rows with data
        data.forEach( (value, key) => {
            dataTableBody += drawRow(value, count);
            count++;
        });
        
        // fill with empty rows
        let emptyOrder = new Order("-", "-", "-", "-");
        for(let i = data.size + 1; i < 36; i++ ) {
            dataTableBody += drawRow(emptyOrder, i);
        }

        // get the totals for "Packages", "Kgs" and "Volume"
        // get total orders by sales method (Markethall, self service, full internal)
        data.forEach( (value, key ) => {
            totalPackagesShipment += value.totalPackages;
            totalWeightShipment += value.totalWeight;
            totalVolumeShipment += value.totalVolume;
            (value.containPickArea(MARKET_HALL) === "X") ? totalMarkethallOrders++ : false;
            (value.containPickArea(SELF_SERVICE) === "X") ? totalSelfServiceOrders++ : false;
            (value.containPickArea(WAREHOUSE) === "X") ? totalFullInternalOrders++ : false;
        });

        dataTableBody += drawTotalOrders(totalMarkethallOrders, totalSelfServiceOrders, totalFullInternalOrders);
        dataTableBody += drawTotalsTable(totalPackagesShipment, totalWeightShipment, totalVolumeShipment);

        tableBody.innerHTML += dataTableBody;
    }

    // *********************************************************
    function drawRow(value, count) {
        let dataTableBody = "";
        // console.log("Dibujar fila valor: ", value);
        dataTableBody += "<tr class='centrar'>"
        dataTableBody += "<td>";
        dataTableBody += count;
        dataTableBody += "</td>";
        dataTableBody += "<td class='isell' >";
        // dataTableBody += "<div class='back2 ' onclick='xx(this)'>";
        // dataTableBody += "<input type='text' class='unstyle' value='";
        // dataTableBody += value.isellOrderNumber + "' readonly />";
        dataTableBody += value.isell;
        // dataTableBody += "</div>";
        dataTableBody += "</td>";

        // ********
        dataTableBody += "<td class='container-column hide-print'>";
        dataTableBody += "<p class='pick-id'>";
        dataTableBody += value.containPickArea(MARKET_HALL);
        dataTableBody += "</p>";
        dataTableBody += "</td>";

        dataTableBody += "<td class='container-column hide-print'>";
        dataTableBody += "<p class='pick-id'>";
        dataTableBody += value.containPickArea(SELF_SERVICE);
        dataTableBody += "</p>";
        dataTableBody += "</td>";

        dataTableBody += "<td class='container-column hide-print'>";
        dataTableBody += "<p class='pick-id'>";
        dataTableBody += value.containPickArea(WAREHOUSE);
        dataTableBody += "</p>";
        dataTableBody += "</td>";

        // *******

        dataTableBody += "<td>";
        dataTableBody += roundValue(value.totalPackages);
        dataTableBody += "</td>";
        dataTableBody += "<td>";
        dataTableBody += roundValue(value.totalWeight);
        dataTableBody += "</td>";
        dataTableBody += "<td>";
        dataTableBody += roundValue(value.totalVolume );
        dataTableBody += "</td>";

        return dataTableBody;
    }

    // *********************************************************
    // Draw the total orders by sales method (Markethall, Self Service, Full Internal)
    function drawTotalOrders (totalMarket, totalSelfService, totalFullInternal) {
        let dataTableBody = ""; 
        dataTableBody += "<tr class='centrar totales hide-print'>";
        dataTableBody += "<td colspan='2'>Total de pedidos</td>";
        dataTableBody += "<td class='total-orders'>";
        dataTableBody += totalMarket;
        dataTableBody += "</td>";
        dataTableBody += "<td class='total-orders'>";
        dataTableBody += totalSelfService;
        dataTableBody += "</td>";
        dataTableBody += "<td class='total-orders'>";
        dataTableBody += totalFullInternal;
        dataTableBody += "</td>";
        dataTableBody += "<td colspan='3'>";
        dataTableBody += totalMarket + totalSelfService + totalFullInternal;
        dataTableBody += "</td>";
        dataTableBody += "</tr>";

        return dataTableBody;
    }

    // *********************************************************
    // Draw the bottom totals of the data table
    function drawTotalsTable (totalPackages, totalWeight, totalVolume ) {
        let dataTableBody = ""; 
        dataTableBody += "<tr class='centrar totales'>";
        dataTableBody += "<td class='hide-print'></td>"
        dataTableBody += "<td class='hide-print'></td>"
        dataTableBody += "<td class='hide-print'></td>"
        dataTableBody += "<td colspan='2'>Totales</td>";
        dataTableBody += "<td>" + roundValue(totalPackages) + " bultos</td>";
        dataTableBody += "<td>" + roundValue(totalWeight) + " Kgs</td>";
        dataTableBody += "<td>" + roundValue(totalVolume) + " m<sup>3</sup></td>";

        return dataTableBody;
    }



    // *********************************************************
    // Function to round a value for better presentation
    function roundValue(value) {
        value *= 100;
        value = Math.round(value); 
        return (value / 100);
    }


})();