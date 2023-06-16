



    // *********************************************************
    // Function to validate a given date
    function validateDate(inputDate) {
        const date = inputDate.valueAsDate;
        if(!date ){
            // alert("La fecha seleccionada es inválida.");
            console.log("COMMONS:validateDate: La fecha seleccionada es inválida.");
            throw new Error("La fecha seleccionada es inválida.");
        } 
        return inputDate.value;
    }

    // *********************************************************
    // Function to initialize the variables and environment 
    function initializePage() {
        console.log("Inicializando los valores por defecto de la página.");
        document.title = printDocumentTitle = "PUP's Cartas de Porte V" + VERSION;

        fileReader = new FileReader();
        // document.getElementById("upload-file-b").innerText = "Subir archivo...";
        contentOriginal = [];
        windowServiceObj = {};
        // TODO: cambiar fecha manual
        // todayDate = new Date("----------");
        todayDate = new Date("2023-06-13");
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


