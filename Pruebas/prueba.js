

    
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

    let contentFile = "a";
    





    // *********************************************************
    // Event Listeners 

    fileSelector.addEventListener('change', openFile); 





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
    function openFile(evento) {
        console.clear();
        // initializePage();
        let file = evento.target.files[0];

        try {
            let fileCSV = new TextFileOpen(file);
            // console.log("Nuevo archivo: ", fileCSV);

            fileCSV.loadContentFile(loadFile);
            
        } catch (error) {
            alert(error.message);
            console.log("ERROR:openFile: ", error);
        }


        const fileDate = new Date(file.lastModified);


        document.getElementById("upload-file-b").innerText = file.name + " (" + fileDate.getHours() + ":" + fileDate.getMinutes() + "h)";

    }

    // *********************************************************
    function loadFile() {
        let fileReader = this;
        
        contentFile = fileReader.result;

        console.log("Valor de content File : ", contentFile);


    }



    // *********************************************************
    // Function to initialize the variables and environment 
    function initializePage() {
        console.log("Inicializando los valores por defecto de la página.");
        // document.title = printDocumentTitle = "PUP's Cartas de Porte 2.0";

        fileReader = new FileReader();
        document.getElementById("upload-file-b").innerText = "Subir archivo...";
        contentOriginal = [];
        // windowServiceObj = {};
        // TODO: cambiar fecha manual
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

        printDocumentationB.disabled = true;
        printDocumentationB.classList.add("disable");

        addCommentsB.disabled = true;
        addCommentsB.classList.add("disable");

        commentsContainer.classList.add("no-visible");

        // loadConfigurationPUP();
    }






    // *********************************************************







