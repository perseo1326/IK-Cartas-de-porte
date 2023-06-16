
    // *********************************************************
    // Variables y constantes

    const fileSelectorOverview = document.getElementById('file-input-overview');
    const fileSelectorByStatus = document.getElementById('file-input-by-order-status');
    const fileSelectorHistorical = document.getElementById('file-input-historical');
            const loadFilesButton = document.getElementById("loadFiles");

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
    let isellsOverviewMap = new Map();

    // let contentOriginal = [];
    // let windowServiceObj = {};
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
        loadFilesButton.addEventListener('click', XXX);

    // selectedDate.addEventListener('change', cleanFiles);
    cutOffTimeSelector.addEventListener('change', loadServiceWindowOptions);

    // processDataB.addEventListener('click', processData);
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
        
        let file = evento.target.files[0];
        try {
            let fileDate = undefined;
            switch (evento.target.id) {

                // case file 'overview.csv'
                case 'file-input-overview':
                    let fileCSV = new TextFileOpen(file);
                    fileDate = new Date(file.lastModified);
                    // console.log("Case Overview: ", fileCSV.file);  
                    filesArray[0] = fileCSV;
                    document.getElementById("upload-file-b-overview").innerText = fileCSV.file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    // Load data from file
                    let fileReaderOverview = new FileReader();
                    fileReaderOverview.readAsText(filesArray[0].file, "windows-1252");
                    fileReaderOverview.onload = function() {
                        filesArray[0].contentFile = this.result;

                        // process and clean info from the file
                        let arrayDataClean = ReadOverviewFileCSV();
                        isellsOverviewMap = mappingArrayDataCSV(arrayDataClean);

                        showContent(isellsOverviewMap); 
                    };

                    showSelectionButton();
                    console.log("Carga Overview \"" + filesArray[0].file.name + "\" Finalizada!");
                    break;

                // case file 'By Order Status'
                case 'file-input-by-order-status':                    
                    let fileStatus = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);
                    // console.log("Case By Status: ", fileStatus);
                    filesArray[1] = fileStatus;
                    document.getElementById("upload-file-b-by-order-status").innerText = file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    let fileReaderByStatus = new FileReader();
                    fileReaderByStatus.readAsArrayBuffer(filesArray[1].file);
                    fileReaderByStatus.onload = async function(){
                        let buffer = this.result;
                        let workbook = await XLSX.read(buffer);
                        filesArray[1].contentFile = await XLSX.utils.sheet_to_row_object_array(workbook.Sheets[WORKING_SHEET]);

                        // process and clean info from the file
                        // let arrayDataClean = ReadOverviewFileCSV();
                        // isellsOverviewMap = mappingArrayDataCSV(arrayDataClean);


                        
                        console.log("Carga By Status Finalizada!", filesArray[1].contentFile);
                    };
                    break;

                // case file 'Historical'
                case 'file-input-historical':
                    let fileHistorical = new ExcelFileOpen(file);
                    fileDate = new Date(file.lastModified);
                    // console.log("Case Historical: ", fileHistorical);
                    filesArray[2] = fileHistorical;
                    document.getElementById("upload-file-b-historical").innerText = file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

                    let fileReaderHistorical = new FileReader();
                    fileReaderHistorical.readAsArrayBuffer(filesArray[2].file);
                    fileReaderHistorical.onload = async function(){
                        let buffer = this.result;
                        let workbook = await XLSX.read(buffer);
                        filesArray[2].contentFile = await XLSX.utils.sheet_to_row_object_array(workbook.Sheets[WORKING_SHEET]);
                    };
                    console.log("Carga Historical Finalizada!");
                    break;
            }

        } catch (error) {
            console.log("ERROR:openFile: ", error);
            alert(error.message);
            return;
        }

    }

    // *********************************************************
    function ReadOverviewFileCSV() {

        let overviewDataArray = [];

        // verificar tipo de archivo
        if(filesArray[0] === undefined || !filesArray[0].file.name.toLowerCase().endsWith('.csv')){
            alert("El archivo No 1: 'Overview.csv' NO es válido");
            console.log("El archivo No 1: 'Overview.csv' NO es válido");
            return;
        }

        // if(filesArray[1] === undefined || (!filesArray[1].file.name.toLowerCase().endsWith(".xlsx") && filesArray[1].file.type === EXCEL_MIME_TYPE) ) {
        //     alert("El archivo No. 2: 'By Order Status.xlsx' NO es válido");
        //     console.log("El archivo No. 2: 'By Order Status.xlsx' NO es válido");
        //     return;
        // }

        // if(filesArray[2] === undefined || (!filesArray[2].file.name.toLowerCase().endsWith(".xlsx") && filesArray[2].file.type === EXCEL_MIME_TYPE) ) {
        //     alert("El archivo No. 3: 'Historical... .xlsx' NO es válido");
        //     console.log("El archivo No. 3: 'Historical... .xlsx' NO es válido");
        //     return;
        // }

        overviewDataArray = loadOverviewFileCSV(filesArray[0].contentFile);
        console.log("Overview Data CARGADO: ", overviewDataArray);

        overviewDataArray = filterOnlyPUP_FileCSV(overviewDataArray);
        console.log("Overview Data 'filterOnlyPUP_FileCSV': ", overviewDataArray);

        return overviewDataArray;
    }


    function XXX() {
        console.log("Funcion XXX!!");
    }







