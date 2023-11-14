
class Order {

    constructor( rowData ){

        try {
            this[ISELL_ORDER]       = rowData[ISELL_ORDER];
            this[ORDER_STATUS]      = rowData[ORDER_STATUS];
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
        // init variables
        order.totalOrderWeight = 0;
        order.totalOrderVolume = 0;
        order.totalOrderPackages = 0;

        if(order.details !== undefined) {

            order.details.pickArea.forEach(area => {

                area.forEach( product => {
                    order.totalOrderWeight += (product[WEIGHT] * product[ORDERED_QTY]);
                    order.totalOrderVolume += (product[VOLUME_ORDERED] * product[ORDERED_QTY]);
                    order.totalOrderPackages += (product[ORDERED_QTY]);
                    // console.log("ARTICLE_NUMBER: ", product[ARTICLE_NUMBER], "totalOrderWeight: ", (product[WEIGHT] * product[ORDERED_QTY]), "totalOrderVolume: ", (product[VOLUME_ORDERED] * product[ORDERED_QTY]), "totalOrderPackages: ", (product[ARTICLES] * product[ORDERED_QTY]) );
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
        this[ARTICLES]          = Number (excelRow[ARTICLES].trim());
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
            if(orderDetail.pickArea.get(area).length < 1 ){
                return false;
            }
            return true;
        }
    }


    // *********************************************************
    // Function to validate a given date
    function validateDate(inputDate) {
        const date = inputDate.valueAsDate;
        if(!date ){
            console.log("COMMONS:validateDate: La fecha seleccionada es inválida.");
            throw new Error("La fecha seleccionada es inválida.");
        } 
        return inputDate.value;
    }


    // *********************************************************
    // Function to initialize the variables and environment 
    function initializePage() {
        
        // console.clear();
        checkVersion();

        console.log("Inicializando los valores por defecto de la página.");
        document.title = printDocumentTitle = "PUP's Cartas de Porte V" + VERSION;

        // data structure for containing all the info combined
        // complet, filtered and clean info for 'Overview.csv'
        isellsOverviewMapComplet = new Map();
        
        // complet, filtered and clean info for 'Overview.csv'
        isellsHistorical = {
            type : REPORT_HISTORICAL,
            isellsMap : new Map()
        };

        // complet, filtered and clean info for 'By Status.xlsx'
        isellsByStatus = { 
            type : REPORT_BY_STATUS, 
            isellsMap : new Map()
        };

        // will contain the orders (isells) filtered by CUT OFF DATE, CUT OFF TIME AND SERVICE WINDOW
        ordersMap = new Map();

        windowServiceObj = {};

        // TODO: cambiar fecha manual
        // todayDate = new Date("2023-07-04");
        todayDate = new Date();
        selectedDate.valueAsDate = todayDate;
        commentsText.value = "";
        showProcessValues(null, "", "", "", "");
        showContent([]);

        frameShippingDate.value = "----------";

        uploadFileOverviewButton.innerText = "Subir archivo 'overview.csv'...";
        uploadFileHistorical.innerText = "Subir archivo 'Historical'...";
        uploadFileByStatus.innerText = "Subir archivo 'By Order Status'...";

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
    // Check the correct version of HTML and scripts
    function checkVersion(){
        
        if(typeof(HTML_VERSION) === "undefined" || HTML_VERSION !== UPDATE_HTML){
            
            uploadFileOverviewButton.classList.add("disable");
            uploadFileHistorical.classList.add("disable");
            uploadFileByStatus.classList.add("disable");
            fileSelectorOverview.disabled = true;
            fileSelectorHistorical.disabled = true;
            fileSelectorByStatus.disabled = true;

            console.log("ERROR:initializePage: Debe actualizar a la última versión.");
            throw new Error("Debe actualizar a la última versión.\n" + APP_DOWNLOAD_PATH);
        }
        console.log("Versión del HTML: ", VERSION);
    }

