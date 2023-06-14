
'use strict';

class TextFileOpen {

    constructor(pointerFile) {
        if(!pointerFile) {
            throw new Error("No se ha seleccionado ningun archivo.");
        }

        this.file = pointerFile;
        this.contentFile = "";
    }
    
    loadContentFile(customFunction) {
        let fileReader = new FileReader();
        let textFileOpen = this;
        
        fileReader.readAsText(textFileOpen.file, "windows-1252");
        fileReader.onload = customFunction;
    }
    
}
