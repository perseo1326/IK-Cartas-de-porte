

class Order {
    // {
    //     "Ref. de Ventas": "1363469152",
    //     "Pick order": "1160",
    //     "Creado el": "2023-06-10 20:06",
    //     "Tipo de pedido": "Punto de recogida",
    //     "Prioridad": "Normal",
    //     "Estado del pedido.": "No empezado",
    //     "cut_off_date": "2023-06-21",
    //     "cut_off_time": "19:45:00",
    //     "Service from": "2023-06-22 17:00",
    //     "Service To": "2023-06-22 19:00",
    //     "Info\r": "private\r"
    //   }

        //   // minimum required columns from 'Overview.csv' file
        //   const SALES_REF = "Ref. de Ventas";
        //   const ORDER_TYPE = "Tipo de pedido";
        //   const ORDER_STATUS = "Estado del pedido.";
        //   const CUT_OFF_DATE_TIME = "Fuera plazo";
        //   const SERVICE_FROM = "Service from";
        //   const SERVICE_TO = "Service To";

    constructor( rowData ){

        try {
            this[SALES_REF]         = rowData[SALES_REF];
            this[ORDER_TYPE]        = rowData[ORDER_TYPE];
            this[ORDER_STATUS]      = rowData[ORDER_STATUS];
            // this[CUT_OFF_DATE_TIME] = rowData[CUT_OFF_DATE_TIME];
            this[CUT_OFF_DATE]      = rowData[CUT_OFF_DATE];
            this[CUT_OFF_TIME]      = rowData[CUT_OFF_TIME];

            this.setServiceFrom( rowData[SERVICE_FROM]);
            this.setServiceTo( rowData[SERVICE_TO]);

        } catch (error) {
            console.log("constructor de Order: ", error);
            return;
        }

    }

    setServiceFrom(stringServiceFrom) {
        let array = stringServiceFrom.split(' ');
        this[SERVICE_FROM] = array[1];
    }

    setServiceTo(stringServiceTo) {
        let array = stringServiceTo.split(' ');
        this[SERVICE_TO] = array[1];
    }
}

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
        console.clear();
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


