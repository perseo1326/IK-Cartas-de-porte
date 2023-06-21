

class Order {

    constructor( rowData ){

        try {
            this[ISELL_ORDER]       = rowData[ISELL_ORDER];
            // this[ORDER_TYPE]        = rowData[ORDER_TYPE];
            this[ORDER_STATUS]      = rowData[ORDER_STATUS];
            // this[CUT_OFF_DATE_TIME] = rowData[CUT_OFF_DATE_TIME];
            this[CUT_OFF_DATE]      = rowData[CUT_OFF_DATE];
            this[CUT_OFF_TIME]      = rowData[CUT_OFF_TIME];
            this.source             = undefined;
            this.details            = undefined;
            this.totalOrderPackages = 0;
            this.totalOrderVolume   = 0;
            this.totalOrderWeight   = 0;

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

    calculateTotals(){
        let order = this;

        // console.log("VAlor de la ORDEN (Objeto): ", this);
        if(order.details !== undefined) {

            // console.log("Orden isell : ", order)
            order.details.pickArea.forEach(area => {

                area.forEach( product => {

                    // console.log("Calcular Totales: ", product);

                    order.totalOrderWeight += (product.WEIGHT * product.ORDERED_QTY);
                    order.totalOrderVolume += (product.VOLUME_ORDERED * product.ORDERED_QTY);
                    order.totalOrderPackages += (product.PACKAGES * product.ORDERED_QTY);

                    // product.ORDERED_QTY;
                }) 
            });
        }
    }
}

class Product {

    constructor(excelRow){

        this[ARTICLE_NAME]      = excelRow[ARTICLE_NAME].trim();
        this[ARTICLE_NUMBER]    = excelRow[ARTICLE_NUMBER].trim();
        this[PACKAGES]          = Number (excelRow[PACKAGES].trim());
        this[WEIGHT]            = Number (excelRow[WEIGHT].trim());
        this[VOLUME_ORDERED]    = Number (excelRow[VOLUME_ORDERED].trim());
        this[ORDERED_QTY]       = Number (excelRow[ORDERED_QTY].trim());
        
        // this[ARTICLES]          = excelRow[ARTICLES].trim();
        // this.orderedQty       = Number (orderedQty.trim().replace(',', '.'));
    }
}

    // *********************************************************
    // *********************************************************
    // *********************************************************
    class OrderDetail {
        constructor(isell) {

            this.isell          = isell.trim();
            this.pickArea       = new Map([
                [MARKET_HALL, []],
                [SELF_SERVICE, []], 
                [WAREHOUSE, []]
            ]);
        }

        addProduct(product, pickArea){
            let newProduct = product;
            this.pickArea.get(pickArea).push(newProduct);
        }

        containPickArea(area){
            let orderDetail = this;
            // console.log("containPickArea: ", orderDetail.pickArea.get(area));
            if(orderDetail.pickArea.get(area).length < 1 ){
                return false;
            }
            return true;
        }
    }

    // *********************************************************
    // *********************************************************
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


