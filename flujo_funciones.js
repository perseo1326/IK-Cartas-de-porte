
// FLUJO DE EJECUCION DE LA APLICACION 

openFile                // listener
initializePage()
    loadConfigurationPUP()
        cleanChildNodes(cutOffTimeSelector)
        // valor por defecto
        loadOptionsDropDownListView(cutOffTimeSelector, DEFAULT_DROPDOWNLIST_VALUE.value, DEFAULT_DROPDOWNLIST_VALUE.text );

        // carga los valores del cut off time
        loadOptionsDropDownListView(cutOffTimeSelector, destination.pupId, destination.title);

file = verifyFileExist(file);

fileReader.onload
    loadAsyncData;
        readBinaryDataFile
    Promise.then(cleanDataArray)
        cleanDataArray
            validateContent
        filterOrderTypeOnlyPUP
// *** FIN DE LA PROMISE Y LECTURA DE DATOS DEL ARCHIVO ***

// EVENTOS DEL USUARIO 
// click en "DESTINO" (CUT_OFF_TIME)

cutOffTimeSelector.addEventListener('change', loadServiceWindowOptions);
    loadServiceWindowOptions
        cleanOptionsScrollDown
        // valor por defecto
        loadOptionsDropDownListView(serviceWindowSelector, DEFAULT_DROPDOWNLIST_VALUE.value, DEFAULT_DROPDOWNLIST_VALUE.text );
        loadOptionsDropDownListView(serviceWindowSelector, service.serviceCode, service.serviceName );

// EVENTOS DEL USUARIO 
// click en "PROCESAR INFORMACION"

processDataB.addEventListener('click', processData);

