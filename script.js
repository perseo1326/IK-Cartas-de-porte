

    /*

        filtrar por flujo de mercancia = PUP
        obtener los cut of time para inicalizar la visualizacion 
        
        seleccionar fecha = CUT_OFF_DATE
        seleccionar el destino, Diagonal, Tarragona, Sant Pere = CUT_OFF_TIME
        

        ACTUAL_ORDER_STATUS = 
            Not Started
            Started
            Picking
            Picked
            Wait for Merge
            Check Started
            Checked
            Completed
            Open Return
            Returned
    */
        /* 
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

    class PickOrder {
        constructor(pickId, packages, weight, volume, orderedQty, pickArea, actualOrderStatus, cancelled, notHandedOut ) {
            this.pickArea       = pickArea;
            this.pickId         = pickId;
            this.packages       = packages;
            this.weight         = weight;
            this.volume         = volume;
            this.orderedQty     = orderedQty;
            this.actualOrderStatus = actualOrderStatus;
            this.cancelled      = cancelled;
            this.notHandedOut  = notHandedOut;
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
            this.totalPackages      = 0.0;
            this.totalWeight        = 0.0;
            this.totalVolume        = 0.0;
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

        }

        toString() {
            let string = "Isell: " + this.isellOrderNumber + "\n";
            string += "Cut of Date: " + this.cutOffDate + "\n";
            string += "Cut of Time: " + this.cutOffTime + "\n";
            string += "Service Window: " + this.serviceWindow + "\n";
            return string;
        }

    }

    // *********************************************************
    // Variables y constantes
    const fileSelector = document.getElementById('file-input');
    const selectedDate = document.getElementById("selected-date");
    const cutOffTimeSelector = document.getElementById("destino-cut-off-time");
    const serviceWindowSelector = document.getElementById("service-window");
    const processDataB = document.getElementById("process-data");



    const tableBody = document.getElementById("data-body");

    const fileReader = new FileReader();
    let contentOriginal = [];
    const todayDate = new Date("2023-02-16");

    const CUT_OFF_TIME = new Map();
    CUT_OFF_TIME.set("DIAGONAL", "06:30");
    CUT_OFF_TIME.set("SANT_PERE", "20:00");
    CUT_OFF_TIME.set("TARRAGONA", "19:45");

    const WINDOW_SERVICE = new Map();
    // WINDOW_SERVICE.set("DIAGONAL_ONE", []);
    // WINDOW_SERVICE.set("DIAGONAL_TWO", []);
    WINDOW_SERVICE.set("SANT_PERE_ONE", ["10:00-13:00", "13:00-16:00"]);
    WINDOW_SERVICE.set("SANT_PERE_TWO", ["16:00-19:00", "19:00-21:00"]);
    WINDOW_SERVICE.set("TARRAGONA_ONE", ["10:00-13:00", "13:00-17:00"]);
    WINDOW_SERVICE.set("TARRAGONA_TWO", ["17:00-19:00", "19:00-21:00"]);
    
    // *********************************************************
    selectedDate.valueAsDate = todayDate;

    // *********************************************************
    // Event Listeners 
    fileSelector.addEventListener('change', openFile); 
    processDataB.addEventListener('click', processData);

    
    
    // *********************************************************
    // Function to validate a given date
    function validateDate() {
        const date = selectedDate.valueAsDate;
        if(!date ){
            console.log("La fecha seleccionada es inválida.");
            alert("La fecha seleccionada es inválida.");
            return false;
        } 
        // console.log("FECHA: ", date.toISOString());
        return selectedDate.value;
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

        let objectsArray = [];
        dataMatrix.forEach( row => {
            const order = [];
                order.push(row[0].trim());
                order.push(row[1].trim());
                order.push(row[3].trim());
                order.push(row[5].trim());
                order.push(row[6].trim());
                order.push(row[7].trim());
                order.push(row[8].trim());
                order.push(row[12].trim());
                order.push(row[13].trim());
                order.push(row[23].trim());
                order.push(row[24].trim());
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
        return dataArray.filter( (row) => { return row[2] == "PUP" } );
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
        dataFileArray = filterColumns(dataFileArray);
        contentOriginal = filterOrderTypeOnlyPUP(dataFileArray);
        
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
    // function to obtain all values of "CUT_OFF_TIME"  
    // function getCutOffTimeValues(dataArray) {
    //     const cutOffTimeValues = new Set();
    //     const optionsDestination = [];

    //     dataArray.forEach( (row) => { cutOffTimeValues.add(row[12]) });
    //     cutOffTimeValues.forEach( (item) => {optionsDestination.push(item) });
    //     optionsDestination.sort();
    //     return optionsDestination;
    // }

    // *********************************************************
    // Given an Array of "CUT_OFF_TIME" elements load those into the Dropdown list "Destination" 
    // function visualizeCutOffTimeOptions (dataArray) {
    //     cleanOptionsScrollDown(cutOffTimeSelector);

    //     // Get options from the file data.
    //     const optionsCutOffTime = getCutOffTimeValues(dataArray);
    //     optionsCutOffTime.unshift("");

    //     addOptionsScrollDown(cutOffTimeSelector, optionsCutOffTime);

    //     cutOffTimeSelector.disabled = false;
    //     cutOffTimeSelector.classList.remove("disable");
    //     return optionsCutOffTime;
    // }

    // *********************************************************
    // Function to get the "SERVICE_WINDOW" values for a "CUT_OFF_TIME" value
    // function visualizeServiceWindowOptions (){
    //     serviceWindowSelector.disabled = false;
    //     serviceWindowSelector.classList.remove("disable");

    //     let content = dataFilterByDate(contentOriginal );
        
        // if(!content) {
        //     // if the date is invalid, return and do nothing.
        //     return;
        // }

        // content = dataFilterByCutOffTime(content, this.value);
        
        // let serviceWindowOptions = getServiceWindowValues(content);

    //     console.log("SERVICE WINDOW OPTIONS ", serviceWindowOptions);


    //     showContent(content);

    // }

    // *********************************************************
    // function addOptionsScrollDown(scrollDownControl, optionsArray) {
    //         optionsArray.forEach( (element) => {
    //         const option = document.createElement("option");
    //         option.value = option.text = element;
    //         scrollDownControl.appendChild(option);
    //     });
    // }       
    // // *********************************************************
    // function cleanOptionsScrollDown(scrollDownControl ) {
    //     // Function to clean a given scroll down control options
    //     while(scrollDownControl.options.length > 0) {
    //         scrollDownControl.removeChild(scrollDownControl.firstElementChild);
    //     }
    // }


    // *********************************************************
    // function to join different orders with same "ISELL_NUMBER" in one "OrderPUP" object.
    function mappingOrdersFromArray(arrayData) {
        
        
        const dataMap = new Map();
        arrayData.forEach( (row) => {
            // console.log("Fila #" + i + " [" + row + "]");

            // (pickArea, pickId, packages, weight, volume, orderedQty, actualOrderStatus, cancelled, notHandedOut )

            let pickTask = new PickOrder(row[1], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10]);

            if(dataMap.has(row[0])) {
                console.log("Isell duplicado: ", row[0]);
                // console.log("ANTIGUO objeto OrderPUP: ", dataMap.get(row[0]));
                
                dataMap.get(row[0]).addPickOrder(pickTask);
                // dataMap.set(row[0], temp);
                // console.log("nuevo objeto OrderPUP: ", dataMap.get(row[0]));

            } else {
                let order = new OrderPUP(row[0], row[11], row[12], row[13], pickTask);
                dataMap.set(row[0], order);
                // console.log("Order ", order);
            }
        });
        return dataMap;
        
    }

    // *********************************************************
    function processData() {

        const dateCutOffDate = validateDate();
        if(!dateCutOffDate) {
            return;
        }

        // console.log("contentOriginal inicial: ", contentOriginal.length);

        let content = dataFilterByDate(contentOriginal, dateCutOffDate);
        // console.log("data filter by date: ", content.length);

        const cutOffTime = cutOffTimeSelector.value;
        content = dataFilterByCutOffTime(content, CUT_OFF_TIME.get(cutOffTime));
        // console.log("data filter by cut off time (Destination): ", content.length);
        

        // console.log("CUTO OFF TIME value: ", cutOffTime);
        // console.log("VALOR de service window: ", serviceWindowSelector.value, );
        
        const windowServiceSelection = WINDOW_SERVICE.get(cutOffTime + serviceWindowSelector.value)
        // console.log("valor concatenado : ", windowServiceSelection );
        content = dataFilterByServiceWindow(content, windowServiceSelection );

        // Bind orders with the same "ISELL_ORDER_NUMBER"
        const dataMap = mappingOrdersFromArray(content);

        console.log("Mapa: ", dataMap);


        showContent(content);
        // showContent(dataMap);
    }

    // *********************************************************
    // Function fo filter the data set by date
    function dataFilterByDate(dataArray, textDate) {
        return dataArray.filter( (row) => { return row[11] == textDate });
    }
    
    // *********************************************************
    // Function to filter data by "CUT_OFF_TIME" value selected
    function dataFilterByCutOffTime(dataArray, selection) {
        return dataArray.filter( (row) => { return row[12] === selection });
    }
    
    // *********************************************************
    function dataFilterByServiceWindow(dataArray, windowServiceArrayOptions) {

        console.log("Valor de window service: ", windowServiceArrayOptions);
        return dataArray.filter( row => {
            return windowServiceArrayOptions.includes(row[13]); 
        });
    }

    // *********************************************************
    // function to obtain all values of "SERVICE_WINDOW"  
    // function getServiceWindowValues(dataArray) {
    //     const serviceWindow = new Set();
    //     const options = [];

    //     dataArray.forEach( (row) => { serviceWindow.add(row[13]) });
    //     serviceWindow.forEach( (item) => {options.push(item) });
    //     options.sort();
    //     return options;
    // }

    // *********************************************************
    function showContent(data) {
        // Clean and initialize values for the table data view
        tableBody.innerHTML = "";
        let dataTableBody = "";
        let count = 0;
        
        console.log("Data en showContent ", data);

        data.forEach(row => {

            dataTableBody += "<tr>";
            dataTableBody += "<td>";
            dataTableBody += count;
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            dataTableBody += row.toString();
            dataTableBody += "</td>";
            dataTableBody += "</tr>";

            count++;
        });

        tableBody.innerHTML += dataTableBody;
        // tableBody.innerHTML += data;
    }
    
    // *********************************************************
    function cleanVariablesAndVisual() {
        content = contentOriginal = [];
        document.getElementById("upload-file-b").innerText = "Subir archivo...";
        showContent(content);
    }
