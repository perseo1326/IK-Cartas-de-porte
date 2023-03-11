

    /*

    ROWS FROM DATA FILE:
        ISELL_ORDER_NUMBER
        PICK_ID
        ORDER_TYPE
        PACKAGES
        WEIGHT
        VOLUME
        ORDERED_QTY
        PICK_AREA
        ACTUAL_ORDER_STATUS
        * CANCELLED
        * NOT_HANDED_OUT
        CUT_OFF_DATE
        CUT_OFF_TIME
        SERVICE_WINDOW
    */

    // *********************************************************
    // Variables y constantes
    const fileSelector = document.getElementById('file-input');
    const selectedDate = document.getElementById("selected-date");
    const cutOffTimeSelector = document.getElementById("destino-cut-off-time");
    const serviceWindowSelector = document.getElementById("service-window");
    const processDataB = document.getElementById("process-data");
    const printDocumentationB = document.getElementById("print-documentation-b");
    const panel = document.getElementById("panel");
    const frameDestination = document.getElementById("frame-destination");
    const frameShippingDate = document.getElementById("frame-shipping-date");
    const frameOkB = document.getElementById("frame-ok-b");
    const frameCancelB = document.getElementById("frame-cancel-b");
    const tableBody = document.getElementById("data-body");

    const fileReader = new FileReader();
    let contentOriginal = [];
    let windowServiceObj = {};
    const todayDate = new Date();

    const DEFAULT_DROPDOWNLIST_VALUE = { 
        value : "",
        text : "Selecciona una opción" 
    };

    const NOT_STARTED       = "Not Started";
    const STARTED           = "Started";
    const PICKING           = "Picking";
    const PICKED            = "Picked";
    const WAIT_FOR_MERGE    = "Wait for Merge";
    const CHECK_STARTED     = "Check Started";
    const CHECKED           = "Checked";
    const COMPLETED         = "Completed";
    const OPEN_RETURN       = "Open Return";
    const RETURNED          = "Returned";

    // *********************************************************
    class PickOrder {
        constructor(pickId, packages, weight, volume, pickArea, actualOrderStatus ) {
            this.pickArea       = pickArea;
            this.pickId         = pickId;
            this.packages       = Number (packages.replace(',', '.'));
            this.weight         = Number (weight.replace(',', '.'));
            this.volume         = Number (volume.replace(',', '.'));
            this.actualOrderStatus = actualOrderStatus;
        }
    }

    class OrderPUP {
        constructor(isellOrderNumber, cutOffDate, cutOffTime, serviceWindow, pickOrder) {
            this.isellOrderNumber   = isellOrderNumber;
            this.cutOffDate         = cutOffDate;
            this.cutOffTime         = cutOffTime;
            this.serviceWindow      = serviceWindow;
            this.pickOrder          = new Map();
            this.pickOrder.set(pickOrder.pickArea, pickOrder);
            this.totalPackages      = Number (0.0);
            this.totalWeight        = Number (0.0);
            this.totalVolume        = Number (0.0);
            this.status             = STARTED;
        }

        addPickOrder(pickOrder) {
            if(this.pickOrder.has(pickOrder.pickArea)) {
                console.log("ERROR: picking task ya existente! ID = " + pickOrder.pickId);
                alert("ERROR: picking task ya existente! ID = " + pickOrder.pickId);
                return;
            }
            this.pickOrder.set(pickOrder.pickArea, pickOrder);
        }

        calculateTotals() {
            // Initialize variables
            this.totalPackages      = 0.0;
            this.totalWeight        = 0.0;
            this.totalVolume        = 0.0;

            this.setStatusOrder();

            if(this.status === RETURNED) {
                return;
            }

            this.pickOrder.forEach( (value,key) => {
                this.totalPackages      += value.packages;
                this.totalWeight        += value.weight;
                this.totalVolume        += value.volume;
            } );
        }

        setStatusOrder() {
            this.pickOrder.forEach( (value, key) => {
                if (value.actualOrderStatus === OPEN_RETURN || value.actualOrderStatus === RETURNED ) {
                    this.status = RETURNED;
                }
            });
        }
    }

    // *********************************************************
    selectedDate.valueAsDate = todayDate;
    loadConfigurationPUP();

    // *********************************************************
    // Event Listeners 
    fileSelector.addEventListener('change', openFile); 
    processDataB.addEventListener('click', processData);
    printDocumentationB.addEventListener('click', showPanelPrint);
    cutOffTimeSelector.addEventListener('change', loadServiceWindowOptions);
    frameOkB.addEventListener('click', printDocument);

    frameCancelB.addEventListener('click', () => { 
        panel.style.display = "none";
    });

    // *********************************************************
    // Function to load the options into the drop down list "CUT OFF TIME" and "SERVICE_WINDOW". 
    function loadOptionsDropDownListView(parentNode, value, text) {
        const option = document.createElement("option");
        option.value = value;
        option.text = text;
        
        parentNode.appendChild(option);
    }
    
    // *********************************************************
    function cleanOptionsScrollDown(dropDownListSelector) {
        if(dropDownListSelector.options.length > 0) {
            dropDownListSelector.remove(0);
            cleanOptionsScrollDown(dropDownListSelector);
        }
    }

    // *********************************************************
    function loadConfigurationPUP() {
        // Function to load the destination ("CUT_OFF_TIME") options into the drop down list selector 

        if(typeof(configData) === "undefined") {
            console.log("No fue posible cargar la configuración inicial.");
            alert("No fue posible cargar la configuración inicial.");
            // exit();
        }

        configData.forEach( (destination) => {
            loadOptionsDropDownListView(cutOffTimeSelector, destination.pupId, destination.title);
        } );
    }

    // *********************************************************
    // Function to find a destination ("CUT_OFF_TIME") from a "pupId" given
    function findObjectPUP (value) {
        return configData.find( obj => { return obj.pupId === value});
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
    function openFile(evento) {
        console.clear();
        let file = evento.target.files[0];

        file = verifyFileExist(file);
        if(!file) {            
            return;
        }

        fileReader.readAsText(file, "windows-1252");
        document.getElementById("upload-file-b").innerText = file.name;
        fileReader.onload = loadFile;
    }
    
    // *********************************************************
    // load the content of the file to memory
    function readDataFromFile (fileData) {
        // Divide info into rows and columns
        let rows = fileData.split('\n');
        let columns = [];
        let originalData = [];
        rows.forEach(row => {
            columns = row.split('\t');
            originalData.push(columns);
        });
        return originalData;
    }

    // *********************************************************
    // Verify the valid structure of data readed from the file based on the headers of info
    function validateContent(arrayRow) {
        if (arrayRow[0].trim() == "ISELL_ORDER_NUMBER" && 
            arrayRow[1].trim() == "PICK_ID" && 
            arrayRow[3].trim() == "ORDER_TYPE" && 
            arrayRow[5].trim() == "PACKAGES" && 
            arrayRow[6].trim() == "WEIGHT" && 
            arrayRow[7].trim() == "VOLUME" && 
            arrayRow[12].trim() == "PICK_AREA" && 
            arrayRow[38].trim() == "CUT_OFF_DATE" && 
            arrayRow[39].trim() == "CUT_OFF_TIME" && 
            arrayRow[42].trim() == "SERVICE_WINDOW" ) {
                return true;
        } 
        return false;
    }

    // *********************************************************
    // Clean all invalid final lines read from the file.
    function deleteInvalidFinalLines(dataArray, totalColumns) {
        if (dataArray[dataArray.length - 1].length < totalColumns) {
            dataArray.pop();
            deleteInvalidFinalLines(dataArray, totalColumns);
        }
        return dataArray;
    }

    // *********************************************************
    // Remove all unnecessary columns from the matrix data
    function filterColumns(dataMatrix) {
        /* 
            ISELL_ORDER_NUMBER
            PICK_ID
            PACKAGES
            WEIGHT
            VOLUME
            PICK_AREA
            ACTUAL_ORDER_STATUS
            CUT_OFF_DATE
            CUT_OFF_TIME
            SERVICE_WINDOW
            */

        let objectsArray = [];
        dataMatrix.forEach( row => {
            const order = [];
                order.push(row[0].trim());
                order.push(row[1].trim());
                order.push(row[5].trim());
                order.push(row[6].trim());
                order.push(row[7].trim());
                order.push(row[12].trim());
                order.push(row[13].trim());
                order.push(row[38].trim());
                order.push(row[39].trim());
                order.push(row[42].trim());
            objectsArray.push(order);
        });
        return objectsArray;
    }

    // *********************************************************
    // Check and remove all elements with "Order Type" different that "PUP"
    function filterOrderTypeOnlyPUP(dataArray) {

        return dataArray.filter( (row) => { 
            return row[3].trim() === "PUP" } );
    }

    // *********************************************************
    function loadFile() {
        if (!fileReader.result) {
            cleanVariablesAndVisual();
            console.log("El contenido del archivo no pudo ser leido.");
            alert("El contenido del archivo no pudo ser leido.");
            return;
        }

        let dataFileArray = readDataFromFile(fileReader.result);
        // Validate the format of the file and data
        if(!validateContent(dataFileArray[0])) {
            // Delete any info into the variables to avoid further errors
            cleanVariablesAndVisual();
            console.log("El archivo NO contiene información válida.");
            alert("El archivo NO contiene información válida.");
            return;
        }
        
        dataFileArray = deleteInvalidFinalLines(dataFileArray, dataFileArray[0].length);
        // Remove the headers from the loaded info
        dataFileArray.shift();

        dataFileArray = filterOrderTypeOnlyPUP(dataFileArray);

        contentOriginal = filterColumns(dataFileArray);
        
        selectedDate.disabled = false;
        selectedDate.classList.remove("disable");

        cutOffTimeSelector.disabled = false;
        cutOffTimeSelector.classList.remove("disable");

        serviceWindowSelector.disabled = false;
        serviceWindowSelector.classList.remove("disable");

        processDataB.disabled = false;
        processDataB.classList.remove("disable");
    }

    // *********************************************************
    // function to join different orders with same "ISELL_NUMBER" in one "OrderPUP" object.
    function bindOrdersPUP_FromArray(arrayData) {
        const dataMap = new Map();
        arrayData.forEach( (row) => {
            // (pickId, packages, weight, volume, pickArea, actualOrderStatus ) {
            let pickTask = new PickOrder(row[1], row[2], row[3], row[4], row[5], row[6]);

            if(dataMap.has(row[0])) {
                dataMap.get(row[0]).addPickOrder(pickTask);
            } else {
                let order = new OrderPUP(row[0], row[7], row[8], row[9], pickTask);
                dataMap.set(row[0], order);
            }
        });
        return dataMap;
    }

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
        let content = dataFilterByDate(contentOriginal, dateCutOffDate);
        // console.log("filtrado por fecha: ", content);

        // Data filtered by "CUT OFF TIME"
        content = dataFilterByCutOffTime(content, cutOffTimeObj.cutOffTime); 
        // console.log("Filtrado por cut off time: ", content);
        
        content = dataFilterByServiceWindow(content, windowServiceObject.serviceValues );
        // console.log("filter by service window: ", content);

        // Bind orders with the same "ISELL_ORDER_NUMBER"
        const dataMap = bindOrdersPUP_FromArray(content);

        // Calculate the totals for each "OrderPUP" 
        dataMap.forEach( function(value, key){
            value.calculateTotals();
        });

        printDocumentationB.disabled = false;
        printDocumentationB.classList.remove("disable");

        document.getElementById("resume").classList.remove("no-visible");

        const fecha = new Date(dateCutOffDate);
        document.getElementById("resume-cut-off-date").innerText = fecha.toLocaleDateString();
        document.getElementById("resume-cut-off-time").innerText = cutOffTimeObj.title + " (" + cutOffTimeObj.cutOffTime + ")";
        document.getElementById("resume-service-window").innerText = windowServiceObject.serviceName + " (" + windowServiceObject.serviceValues + ")"

        frameDestination.innerText = cutOffTimeObj.title + " - " + windowServiceObject.serviceName;

        setAddressTransportDocument(document.getElementById("sender-address"), cutOffTimeObj.senderAddress);
        setAddressTransportDocument(document.getElementById("consignee-address"), cutOffTimeObj.consigneeAddress);
        setAddressTransportDocument(document.getElementById("carrier-address"), cutOffTimeObj.carrierAddress);

        showContent(dataMap);
    }

    // *********************************************************
    // Function fo filter the data set by date
    function dataFilterByDate(dataArray, textDate) {
        return dataArray.filter( (row) => { return row[7] === textDate });
    }
    
    // *********************************************************
    // Function to filter data by "CUT_OFF_TIME" value selected
    function dataFilterByCutOffTime(dataArray, selection) {
        return dataArray.filter( (row) => { return row[8] === selection });
    }
    
    // *********************************************************
    function dataFilterByServiceWindow(dataArray, windowServiceArrayOptions) {
        return dataArray.filter( row => {
            return windowServiceArrayOptions.includes(row[9]); 
        });
    }

    // *********************************************************
    function showPanelPrint(){
        panel.style.display = "flex";
        frameShippingDate.value = "----------";
    }

    // *********************************************************
    function printDocument() {

        // document.getElementById("cabecero").style.display = "block";

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

        window.print();
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
    // Function to clean their HTML DOM element child nodes 
    function cleanChildNodes(parentNode) {
        if(parentNode.childNodes.length > 0 ) {
            parentNode.lastChild.remove();
            cleanChildNodes(parentNode);
        }
    }

    // *********************************************************
    // Function to round a value for better presentation
    function roundValue(value) {
        value *= 100;
        value = Math.round(value); 
        return (value / 100);
    }
    // *********************************************************
    function showContent(data) {
        // Clean and initialize values for the table data view
        tableBody.innerHTML = "";
        let dataTableBody = "";
        let count = 1;
        let totalPakagesShipment = 0;
        let totalWeightShipment = 0;
        let totalVolumeShipment = 0;
        
        console.log("Data en showContent ", data);

        data.forEach( (value, key) => {

            const isReturned = (value.status === RETURNED) ? "warning-row" : "";

            dataTableBody += "<tr class='centrar " + isReturned + "'>";
            dataTableBody += "<td>";
            dataTableBody += count;
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            dataTableBody += value.isellOrderNumber;
            dataTableBody += "</td>";
            dataTableBody += "<td class='hide-print'>";
            dataTableBody += value.status;
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            let temp = roundValue(value.totalPackages);
            totalPakagesShipment += temp;
            dataTableBody += temp;
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            temp = roundValue(value.totalWeight);
            totalWeightShipment += temp,
            dataTableBody += temp;
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            temp = roundValue(value.totalVolume );
            totalVolumeShipment += temp;
            dataTableBody += temp;
            dataTableBody += "</td>";

            count++;
        });

        dataTableBody += "<tr class='centrar totales'>";
        dataTableBody += "<td class='hide-print'></td>"
        dataTableBody += "<td colspan='2'>Totales</td>";
        dataTableBody += "<td>" + roundValue(totalPakagesShipment) + " bultos</td>";
        dataTableBody += "<td>" + roundValue(totalWeightShipment) + " Kgs</td>";
        dataTableBody += "<td>" + roundValue(totalVolumeShipment) + " m<sup>3</sup></td>";

        tableBody.innerHTML += dataTableBody;
    }
    
    // *********************************************************
    function cleanVariablesAndVisual() {
        console.log("Limpiando variables y visuales");
        content = contentOriginal = [];
        windowServiceObj = {};
        loadConfigurationPUP();
        document.getElementById("upload-file-b").innerText = "Subir archivo...";
        showContent(content);
    }
