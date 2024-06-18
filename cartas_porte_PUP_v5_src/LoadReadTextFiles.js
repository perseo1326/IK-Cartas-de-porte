
'use strict';

class TextFileOpen {

    constructor(pointerFile, codification = "") {
        if(!pointerFile) {
            console.log("ERROR:TextFileOpen: No se ha seleccionado ningun archivo.");
            throw new Error("No se ha seleccionado ningun archivo.");
        }

        this.file = pointerFile;
        this.codification = codification;
    }


    loadAndReadFile(){
        return new Promise( (resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsText(this.file, this.codification);
            fileReader.onload = function() {
                
                try {
                    resolve(this.result);
                } catch (error) {
                    console.log("Error cargando el archivo.");
                    reject(new Error("Error cargando el archivo."));
                }
            };
        });
    }
}
