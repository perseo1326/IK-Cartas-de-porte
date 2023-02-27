

    /*

        1. filtrar por flujo de mercancia = PUP
        2. seleccionar fecha = CUT_OFF_DATE
        3. seleccionar el destino, Diagonal, Tarragona, Sant Pere = CUT_OFF_TIME
        4. 

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


    class OrderPUP {
        constructor() {

        }
    }

    // *********************************************************
    // Variables y constantes
    const fileSelector = document.getElementById('file-input');
    const selectedDate = document.getElementById("selected-date");



    const tableBody = document.getElementById("data-body");

    const fileReader = new FileReader();
    let contentOriginal = [];
    let content = [];
    let todayDate = new Date();
    
    // *********************************************************
    selectedDate.valueAsDate = todayDate;

    // *********************************************************
    // Event Listeners 
    fileSelector.addEventListener('change', openFile); 

    
    
    
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
    function loadFile() {
        if (!fileReader.result) {
            cleanVariablesAndVisual();
            console.log("El contenido del archivo no pudo ser leido.");
            alert("El contenido del archivo no pudo ser leido.");
            return;
        }

        contentOriginal = readDataFromFile(fileReader.result);

        // Validate the format of the file and data
        if(!validateContent(contentOriginal[0])) {
            // Delete any info into the variables to avoid further errors
            cleanVariablesAndVisual();
            console.log("El contenido del archivo NO tiene formato válido.");
            alert("El contenido del archivo NO tiene formato válido.");
            return;
        }
        
        // console.log("***********************************");
        // console.log("Total filas iniciales: " + contentOriginal.length);
        deleteInvalidFinalLines(contentOriginal[0].length);

        // Remove the headers from the loaded info
        // contentOriginal.shift();

        contentOriginal = filterColumns(contentOriginal);
        content = contentOriginal;

        showContent(content[0]);
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
    function deleteInvalidFinalLines(totalColumns) {
        if (contentOriginal[contentOriginal.length - 1].length < totalColumns) {
            contentOriginal.pop();
            deleteInvalidFinalLines(totalColumns);
        }
    }

    // *********************************************************
    // Remove all unnecessary columns from the matrix data
    function filterColumns(dataMatrix) {
        let objectsArray = [];
        for (let row = 0; row < dataMatrix.length; row++) {

        /*
            const stock = new StockControl(contentOriginal[row][0].trim(), 
                                            contentOriginal[row][2].trim(),
                                            contentOriginal[row][3].trim(),
                                            contentOriginal[row][6].trim(),
                                            contentOriginal[row][5].trim(),
                                            contentOriginal[row][10].trim(),
                                            contentOriginal[row][18].trim() ); 
            stockControlData.push(stock);
            */
        }

        return objectsArray = dataMatrix;
    }








    // *********************************************************
    function showContent(data) {
        // Clean and initialize values for the table data view
        tableBody.innerHTML = "";
        let dataTableBody = "";
        let count = 0;

        data.forEach(row => {

            dataTableBody += "<tr>";
            dataTableBody += "<td>";
            dataTableBody += count;
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            dataTableBody += row;
            dataTableBody += "</td>";
            dataTableBody += "</tr>";

            count++;


        });

        console.log(data);

        tableBody.innerHTML += dataTableBody;
    }
    
    // *********************************************************
    function cleanVariablesAndVisual() {
        content = contentOriginal = [];
        document.getElementById("upload-file-b").innerText = "Subir archivo...";
        showContent(content);
    }
