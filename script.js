(function () {



    // *********************************************************
    // Variables y constantes

    const fileSelector = document.getElementById('file-input');
    const selectedDate = document.getElementById("selected-date");
    const cutOffTimeSelector = document.getElementById("destino-cut-off-time");
    const serviceWindowSelector = document.getElementById("service-window");
    const processDataB = document.getElementById("process-data");

    const tableBody = document.getElementById("data-body");


    let fileReader = new FileReader();

    let contentOriginal = [];
    let windowServiceObj = {};
    let todayDate = "";
    // variable to hold the basic name for the printed document
    let printDocumentTitle = "";

    const WORKING_SHEET = "DATA";
    const ORDER_TYPE_DATA = "PICKUP_POINT";

    const DEFAULT_DROPDOWNLIST_VALUE = { 
        value : "",
        text : "Selecciona una opción..." 
    };

    // *********************************************************
    // Event Listeners 
    fileSelector.addEventListener('change', openFile); 
    cutOffTimeSelector.addEventListener('change', loadServiceWindowOptions);
    processDataB.addEventListener('click', processData);

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
    function fileNotValid(message = "Archivo vacio o sin formato correcto.") { 
        console.log(message);
        initializePage();
        alert(message);
        return false;
    }

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

        document.title = printDocumentTitle = "PUP's Cartas de Porte 2.0";

        fileReader = new FileReader();
        document.getElementById("upload-file-b").innerText = "Subir archivo...";
        contentOriginal = [];
        // windowServiceObj = {};
        todayDate = new Date();
        selectedDate.valueAsDate = todayDate;
        // commentsText.value = "";
        // showProcessValues(null, "", "", "", "");
        // showContent(contentOriginal);
        
        selectedDate.disabled = true;
        selectedDate.classList.add("disable");
        
        cutOffTimeSelector.disabled = true;
        cutOffTimeSelector.classList.add("disable");

        serviceWindowSelector.disabled = true;
        serviceWindowSelector.classList.add("disable");

        processDataB.disabled = true;
        processDataB.classList.add("disable");

        // printDocumentationB.disabled = true;
        // printDocumentationB.classList.add("disable");

        // addCommentsB.disabled = true;
        // addCommentsB.classList.add("disable");

        // commentsContainer.classList.add("no-visible");

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
            // exit();
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
    // Function to find a destination ("CUT_OFF_TIME") from a "pupId" given
    function findObjectPUP (value) {
        return configData.find( obj => { return obj.pupId === value});
    }

    // *********************************************************
    function cleanOptionsScrollDown(dropDownListSelector) {
        if(dropDownListSelector.options.length > 0) {
            dropDownListSelector.remove(0);
            cleanOptionsScrollDown(dropDownListSelector);
        }
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
        console.log("Content Original antes filter fecha: ", contentOriginal.length);
        let content = dataFilterByDate(contentOriginal, dateCutOffDate);

        console.log("Content: ", content);

        content.forEach( row => { console.log("Fecha: ", row.CUT_OFF_DATE )});

        console.log("filtrado por fecha: ", content);

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
        console.log("dataFilterByDate: ", dataArray[0]);
        return dataArray.filter( (row) => { return row.CUT_OFF_DATE.trim() === textDate });
    }

    // *********************************************************
    function showContent(data) {

        console.log("Show Content: ", data);
        // Clean and initialize values for the table data view
        tableBody.innerHTML = "";
        let dataTableBody = "";


        dataTableBody = data;

        tableBody.innerHTML += dataTableBody;
    }

})();