
'use strict';

class TextFileOpen {

    constructor(pointerFile) {
        if(!pointerFile) {
            console.log("ERROR:TextFileOpen: No se ha seleccionado ningun archivo.");
            throw new Error("No se ha seleccionado ningun archivo.");
        }

        this.file = pointerFile;
        this.contentFile = "";
    }
}


    // *********************************************************
    // convert string data to bidimensional array (rows and columns)
    function loadOverviewFileCSV(file, grossData) {

        let rows = grossData.replaceAll(", ", ";");
        rows = rows.replaceAll("\"", "");
        rows = rows.split('\n');

        // remove headers AND from removed element split into an array by 'comma'
        let headlines = rows.shift().split(',');
        console.log("Encabezados: ", headlines);

        if( !verifyRequiredInfoCSV(headlines)) {
            console.log("El archivo \"" + file.name + "\" NO contiene la información mínima requerida.");
            throw new Error("El archivo \"" + file.name + "\" NO contiene la información mínima requerida.");
        }
        
        let content = [];
        
        rows.forEach(row => {
                let columns = row.split(',');
                content.push(columns);
            });

        console.log("Cantidad de lineas leidas y cargadas: ", content.length);

        content = deleteEmptyFinalLines(content, headlines.length);

        if(!verifyDataIntegrityCSV(content, headlines.length)) {
            console.log("ERROR:loadOverviewFileCSV: Datos NO válidos.")
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

        let dataMap = new Map();
        arrayData.forEach( row => {  
            let orderObj = new Order(row);
            dataMap.set( row[ISELL_ORDER], orderObj ); 
        } );
        return dataMap;
    }


    // *********************************************************
    // Elimina todas las lineas no validas del final de archivo.
    function deleteEmptyFinalLines(array, totalColumns) {
        if (array[array.length - 1].length !== totalColumns) {
            array.pop();
            deleteEmptyFinalLines(array, totalColumns);
        }
        return array;
    }


    // *********************************************************
    // validate the integrity of the CSV file 
    function verifyDataIntegrityCSV(array, totalColumns) {
        array.forEach(element => {
            if(element.length !== totalColumns){
                console.log("Data integrity FAILED!! Cantidad correcta de columnas: ", totalColumns, "Columnas en fila: ", element.length, element);
                throw new Error("Chequeo de integridad Fallido!");
            }
        });
        console.log("Integrity check PASS OK!!");
        return true;
    }


    // *********************************************************
    function verifyRequiredInfoCSV(headlinesArray) {
        
        if(headlinesArray.includes(ISELL_ORDER) && 
        headlinesArray.includes(ORDER_TYPE) && 
        headlinesArray.includes(ORDER_STATUS) &&
        headlinesArray.includes(CUT_OFF_DATE_TIME) &&
        headlinesArray.includes(SERVICE_FROM) && 
        headlinesArray.includes(SERVICE_TO) )
        {
            if(headlinesArray.includes(DROP_OFF)){
                console.log("Eliminar la columna '" + DROP_OFF + "' del reporte, ya que genera errores.");
                throw new Error("Eliminar la columna '" + DROP_OFF + "' del reporte, ya que genera errores.");
            } else {
                return true;
            }
        }
        return false;
    }


    // *********************************************************
    function filterOnlyPUP_FileCSV( dataArray) {
        return dataArray.filter( row => row[ORDER_TYPE] === PICK_UP_POINT );
    }
    