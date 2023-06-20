
'use strict';

class TextFileOpen {

    constructor(pointerFile) {
        if(!pointerFile) {
            throw new Error("No se ha seleccionado ningun archivo.");
        }

        this.file = pointerFile;
        this.contentFile = "";
    }
}


    // *********************************************************
    // convert string data to bidimensional array (rows and columns)
    function loadOverviewFileCSV(grossData) {

        let rows = grossData.replaceAll(", ", ";");
        rows = rows.replaceAll("\"", "");
        rows = rows.split('\n');

        // console.log("CANTIDAD DE FILAS: ", rows);

        // remove headers AND from removed element split into an array by 'comma'
        let headlines = rows.shift().split(',');
        console.log("Encabezados: ", headlines);

        if( !verifyRequiredInfoCSV(headlines)) {
            // console.log("El archivo ", filesArray[0].file.name, " NO contiene la información mínima requerida.");
            throw new Error("El archivo \"" + filesArray[0].file.name + "\" NO contiene la información mínima requerida.")
        }
        
        let content = [];
        
        rows.forEach(row => {
                let columns = row.split(',');
                content.push(columns);
            });

        content = deleteEmptyFinalLines(content, headlines.length);

        // console.log("Despues de 'deleteEmptyFinalLines': ", content);

        if(!verifyDataIntegrityCSV(content, headlines.length)) {
            throw new Error("Datos NO válidos.");
        }

        let cleanArrayData = [];
        content.forEach( row => {
            let objeto = {};
            for (let index = 0; index < row.length; index++) {
                const element = row[index];
                if(headlines[index] === CUT_OFF_DATE_TIME) {
                    let array = element.split(' ');
                    objeto[CUT_OFF_DATE] = array[0];
                    objeto[CUT_OFF_TIME] = ( array[1]);
                } else {
                    objeto[headlines[index]] = element;
                }
            }
            cleanArrayData.push(objeto);
        })
                
        return cleanArrayData;
    }


    // *********************************************************
    function mappingArrayDataCSV(arrayData) {

        // console.log("mappingArrayDataCSV: ", arrayData[2]);

        let dataMap = new Map();
        arrayData.forEach( row => {  
            // console.log("ORDER: ", row[CUT_OFF_DATE_TIME]);
            let orderObj = new Order(row);
            dataMap.set( row[SALES_REF], orderObj ); 
        } );
        return dataMap;
    }


    // *********************************************************
    // Elimina todas las lineas no validas del final de archivo.
    function deleteEmptyFinalLines(array, totalColumns) {
        // console.log("deleteEmptyFinalLines, rows: ", array.length, " total de columnas: ", totalColumns, " columnas de esta fila: ", array[array.length - 1].length);
        // console.log("(", array[array.length - 1], ")");
        if (array[array.length - 1].length !== totalColumns) {
            array.pop();
            deleteEmptyFinalLines(array, totalColumns);
        }
        return array;
    }


    // *********************************************************
    // validate the integrity of the CSV file 
    function verifyDataIntegrityCSV(array, totalColumns) {
        // console.log("Integrity check - Total de columnas: ", totalColumns);
        array.forEach(element => {
            // console.log("Columnas en esta fila: ", element.length);
            if(element.length !== totalColumns){
                
                console.log("Data integrity FAILED!! Cantidad correcta de columnas: ", totalColumns, "Columnas en fila: ", element.length, element);
                throw new Error("Check Data integrity FAILED!");
            }
        });
        console.log("Integrity PASS OK!!");
        return true;
    }


    // *********************************************************
    function verifyRequiredInfoCSV(headlinesArray) {
        
        if(headlinesArray.includes(SALES_REF) && 
        headlinesArray.includes(ORDER_TYPE) && 
        headlinesArray.includes(ORDER_STATUS) &&
        headlinesArray.includes(CUT_OFF_DATE_TIME) &&
        headlinesArray.includes(SERVICE_FROM) && 
        headlinesArray.includes(SERVICE_TO) )
        {
            return true;
        }
        return false;
    }


    // *********************************************************
    function filterOnlyPUP_FileCSV( dataArray) {
        // console.log("filterOnlyPUP_CSVFile: ", dataArray[1271][ORDER_TYPE] === PICK_UP_POINT);
        return dataArray.filter( row => row[ORDER_TYPE] === PICK_UP_POINT );
    }