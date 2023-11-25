
'use strict';

class ExcelFileOpen {

    constructor(pointerFile) {
        if(!pointerFile) {
            console.log("ERROR:ExcelFileOpen: No se ha seleccionado ningun archivo.");
            throw new Error("No se ha seleccionado ningun archivo.");
        }

        this.file = pointerFile;
        this.contentFile = "";
    }
}


    // *********************************************************
    // Verify the valid structure of data readed from the file based on the headers of info
    function validateContentExcel(dataRows) {
        
        if(dataRows === undefined || dataRows.length <= 0 ) {
            return false;
        }

        if(dataRows[0][ORDER_TYPE_EXCEL] === undefined || dataRows[dataRows.length - 1][ISELL] === undefined) {
            return false;
        }
        return true;
    }


    // *********************************************************
    // Check and remove all elements with "Order Type" different that "PUP"
    function filterOrderTypeOnlyPUP(dataArray) {
        return dataArray.filter( (row) => { 
            return row[ORDER_TYPE_EXCEL].trim() === ORDER_TYPE_DATA;
        } );
    }
    

    // *********************************************************
    function readReportsExcel(file, fileDataArray) {

        let excelDataArray = fileDataArray;

        // check the file type
        if(file === undefined || (!file.name.toLowerCase().endsWith(".csv") && file.type !== EXCEL_MIME_TYPE) ) {
            console.log("ERROR:readReportsExcel: El archivo \"" + file.name + "\" NO es válido.");
            throw new Error("El archivo \"" + file.name + "\" NO es válido.");
        }

        // Validate the format of the file and data structure
        if(!validateContentExcel(excelDataArray)) {
            console.log("ERROR:readReportsExcel: Contenido del archivo NO válido.");
            throw new Error("Contenido del archivo NO válido.");
        }
        
        excelDataArray = filterOrderTypeOnlyPUP(excelDataArray);

        return excelDataArray;
    }


    // *********************************************************
    function mappingArrayDataExcel(dataArrayExcel) {

        pickAreas = getAllPickAreas(dataArrayExcel);
        console.log("Zones 'Pick Area': ", pickAreas);

        let orderDetailsMap = new Map();
        dataArrayExcel.forEach(rowData => {
            
            if(!orderDetailsMap.has(rowData[ISELL])) {
                let orderDetail = new OrderDetail(rowData[ISELL]);
                orderDetailsMap.set(rowData[ISELL], orderDetail);
            }
            
            let producto = new Product(rowData);
            let orderDetailObject = orderDetailsMap.get(rowData[ISELL]);

            orderDetailObject.addProduct(producto, rowData[PICK_AREA]);
            orderDetailsMap.set(orderDetailObject.isell, orderDetailObject);
        });
        return orderDetailsMap;
    }


    // *********************************************************
    // function to get all "Pick up Areas" or sections have the shop to pick up the products
    function getAllPickAreas(dataArray){

        let zones = [];

        dataArray.forEach( (row) => {
            if( !zones.includes( row[PICK_AREA] )) {
                zones.push(row[PICK_AREA]);
            }
        });

        return zones;
    }





