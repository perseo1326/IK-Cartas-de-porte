

    // *********************************************************
    function showProcessValues (dateCutOffDate, title, timeCutOffTime, serviceName, serviceValues ) {
        if(dateCutOffDate) {
            document.getElementById("resume-cut-off-date").innerText = dateCutOffDate.toLocaleDateString();
        } else {
            document.getElementById("resume-cut-off-date").innerText = "";
        }
        document.getElementById("resume-cut-off-time").innerText = title + " (" + timeCutOffTime + ")";
        document.getElementById("resume-service-window").innerText = serviceName + " (" + serviceValues + ")";
    }


    // *********************************************************
    // Function to clean their HTML DOM element child nodes 
    function cleanChildNodes(parentNode) {
        if(parentNode.childNodes.length > 0 ) {
            parentNode.lastChild.remove();
            cleanChildNodes(parentNode);
        }
    }


    // *********************************************************
    // Function to load the options into the drop down list "CUT OFF TIME" and "SERVICE_WINDOW". 
    function loadOptionsDropDownListView(parentNode, value, text) {
        const option = document.createElement("option");
        option.value = value;
        option.text = text;
        
        parentNode.appendChild(option);
    }


    // *********************************************************
    // Function to load the "SERVICE_WINDOW" options into the drop down list selector.
    function loadServiceWindowOptions () {

        cleanOptionsScrollDown(serviceWindowSelector);
        loadOptionsDropDownListView(serviceWindowSelector, DEFAULT_DROPDOWNLIST_VALUE.value, DEFAULT_DROPDOWNLIST_VALUE.text );
        
        const pupSelected = findObjectPUP(this.value);
        if (!pupSelected) {
            return;
        }

        pupSelected.windowService.forEach( service => {
            loadOptionsDropDownListView(serviceWindowSelector, service.serviceCode, service.serviceName );
        });
    }


    // *********************************************************
    function cleanOptionsScrollDown(dropDownListSelector) {
        if(dropDownListSelector.options.length > 0) {
            dropDownListSelector.remove(0);
            cleanOptionsScrollDown(dropDownListSelector);
        }
    }


    // *********************************************************
    // Function to find a destination ("CUT_OFF_TIME") from a "pupId" given
    function findObjectPUP (value) {
        return configData.CMPs.find( obj => { return obj.pupId === value});
    }
    
    
    // *********************************************************
    // activar botones de fecha, cut off time y service window
    function showSelectionButton() {

        selectedDate.disabled = false;
        selectedDate.classList.remove("disable");
        
        cutOffTimeSelector.disabled = false;
        cutOffTimeSelector.classList.remove("disable");
        
        serviceWindowSelector.disabled = false;
        serviceWindowSelector.classList.remove("disable");
        
        processDataB.disabled = false;
        processDataB.classList.remove("disable");        
    }


    // *********************************************************
    function setAddressTransportDocument(parentNode, addressArray) {

        cleanChildNodes(parentNode);
        const firstLine = document.createElement("p");
        const strongLine = document.createElement("strong");
        strongLine.innerText = addressArray[0];
        firstLine.appendChild(strongLine);
        parentNode.appendChild(firstLine);
        
        for (let i = 1; i < addressArray.length; i++) {
            const element = addressArray[i];
            const line = document.createElement("p");
            line.innerText = element;
            parentNode.appendChild(line);
        }
    }


    // *********************************************************
    // Function to round a value for better presentation
    function roundValue(value) {
        value *= 100;
        value = Math.round(value); 
        return (value / 100);
    }
    
    
    // *********************************************************
    // add a CSS class to indicate the 'status' for the current order
    function indicateStatusOrder(status) {

        let typeOfStatus = "";
        switch (status) {
            case STATUS_NOT_STARTED:
                typeOfStatus = "status-not-started";
                break;
            case STATUS_STARTED:
            case STATUS_PICKING:
            case STATUS_WAIT_FOR_MERGE:
                typeOfStatus = "status-picking";
                break;
            case STATUS_PICKED:
                typeOfStatus = "status-picked";
                break;
            case STATUS_CHECK_STARTED:
                typeOfStatus = "status-check-started";
                break;
            case STATUS_CHECKED:
                typeOfStatus = "status-checked";
                break;
            case STATUS_COMPLETED:
                typeOfStatus = "status-completed";
                break;
            default:
        }
        return typeOfStatus;
    }


    // *********************************************************
    function showPanelPrint(){
        let notCompletedOrders = verifyOrderStatusCompleted();
        let message = "Los siguientes pedidos NO han sido terminados, ¿Desea eliminarlos de la carta de porte?";
        notCompletedOrders.forEach( order => 
            { message += "\n" + order; }
        );

        if(notCompletedOrders.length > 0){
            // ask the user for removing the not finished order from the document
            if(confirm(message)) {
                notCompletedOrders.forEach( value => removeOrder(value) );
                showContent(ordersMap);
            }
        }
        panelShippingDate.style.display = "block";
    }


    // *********************************************************
    function printDocument() {

        try {
            const shippingDateValue = validateDate(frameShippingDate);
            
            const shippingDate = new Date(shippingDateValue);
            document.getElementById("service-name-short").innerText = windowServiceObj.serviceNameShort;
            document.getElementById("transport-document-number").innerText = windowServiceObj.documentTransport_A + 
                                                                                shippingDate.toLocaleDateString() +
                                                                                windowServiceObj.documentTransport_B; 
            document.getElementById("transport-document-loading-date").innerText = shippingDate.toLocaleDateString();
            document.getElementById("transport-document-receipt-date").innerText = shippingDate.toLocaleDateString();
    
            panelShippingDate.style.display = "none";
    
            comments.innerText = commentsText.value;
            
            // Set document title for printing purpose
            document.title = shippingDateValue + "_" + printDocumentTitle;
            window.print();

        } catch (error) {
            console.log("ERROR:printDocument: ", error);
            alert(error.message);
        }
    }
    




    // *********************************************************
    function showContent(data) {

        console.log("SHOW CONTENT: ", data);
        tableData.innerHTML = "";
        
        let tableDataContent = "";

        tableDataContent += drawTableDataHeaders();

        tableDataContent += drawTableContent(data);

        tableData.innerHTML = tableDataContent; 
    }


    // *********************************************************
    function drawTableContent(data) {
        // Clean and initialize values for the table data view

        let dataTableBody = "";
        let count = 1;
        let zoneTotalsCounter = new Map();

        // initialize a map for keep track the total orders for each 'Pick Area'
        pickAreas.forEach( zone => {
            zoneTotalsCounter.set(zone, 0);
        });
        
        let totalPackagesShipment = 0;
        let totalWeightShipment = 0;
        let totalVolumeShipment = 0;
        
        dataTableBody += '<tbody id="data-body">';
                
        // fill rows with data
        data.forEach( (value, key) => {
            dataTableBody += drawRow(value, count, pickAreas);
            count++;
        });
        
        // fill with empty rows
        let emptyOrder = { [ISELL_ORDER]    :  ISELL_EMPTY,
                            [ORDER_STATUS]  : "",
                            [CUT_OFF_DATE]  : "",
                            [CUT_OFF_TIME]  : "",
                            source          : "Vacío",
                            details         : [],
                            totalOrderPackages  : 0,
                            totalOrderVolume    : 0,
                            totalOrderWeight    : 0
                        };

        for(let i = data.size + 1; i < 36; i++ ) {
            dataTableBody += drawRow(emptyOrder, i, pickAreas);
        }

        // get the totals for "Packages", "Kgs" and "Volume"
        // get total orders by sales method (Markethall, self service, full internal)
        data.forEach( (value, key ) => {
            totalPackagesShipment += value.totalOrderPackages;
            totalWeightShipment += value.totalOrderWeight;
            totalVolumeShipment += value.totalOrderVolume;

            if(value.details !== undefined){
                pickAreas.forEach( zone => {
                    if(value.details.containPickArea(zone)){
                        let x = zoneTotalsCounter.get(zone) + 1;
                        zoneTotalsCounter.set(zone, x);
                    }
                });
            }
        });

        dataTableBody += drawTotalOrders(zoneTotalsCounter);
        dataTableBody += drawTotalsTable(pickAreas.length, totalPackagesShipment, totalWeightShipment, totalVolumeShipment);

        dataTableBody += '</tbody>';

        return dataTableBody;
    }


    // *********************************************************
    function drawRow(value, count, pickAreasColumns) {
        let dataTableBody = "";

        // console.log("FILA: ", value);

        // first column: counter
        dataTableBody += "<tr class='centrar' title='";
        dataTableBody += value.source;
        dataTableBody += "'>";

        dataTableBody += "<td>";
        dataTableBody += count;
        dataTableBody += "</td>";

        // second column: ISELL
        dataTableBody += "<td class='isell' >";
        dataTableBody += value[ISELL_ORDER];
        dataTableBody += "</td>";
        
        // third column: Order Status
        dataTableBody += "<td class='hide-print status ";
        dataTableBody += indicateStatusOrder(value[ORDER_STATUS]);
        dataTableBody += "'>";
        dataTableBody += value[ORDER_STATUS];
        dataTableBody += "</td>";

        // ******** DINAMIC CONTEND
        pickAreasColumns.forEach( zone => {

            dataTableBody += "<td class='container-column hide-print'>";
            dataTableBody += "<p>";
            if(value.details !== undefined && value[ISELL_ORDER] !== ISELL_EMPTY ){ 
                dataTableBody += value.details.containPickArea(zone) ? "X" : "";
            }
            dataTableBody += "</p>";
            dataTableBody += "</td>";
        });
        // ********

        // COLUMN: packages, weight and volume
        if(value.details === undefined) {
            dataTableBody += "<td colspan='3' class='no-info'>";
            dataTableBody += NO_INFO;
            dataTableBody += "</td>";    
        } else {
            dataTableBody += "<td>";
            dataTableBody += roundValue(value.totalOrderPackages);
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            dataTableBody += roundValue(value.totalOrderWeight);
            dataTableBody += "</td>";
            dataTableBody += "<td>";
            dataTableBody += roundValue(value.totalOrderVolume );
            dataTableBody += "</td>";
        }

        // COLUMN: Delete row
        if (value[ORDER_STATUS] !== STATUS_COMPLETED && value[ORDER_STATUS] !== "") {
            dataTableBody += "<td class='hide-print remove no-info' onclick='javascript:deleteRow(\"" + (value[ISELL_ORDER]) + "\")'>";

            // SVG image icon
            dataTableBody += drawDeleteIcon();

            dataTableBody += "</td>";
        } else {
            dataTableBody += "<td class='hide-print'>";
            dataTableBody += "</td>";
        }
        dataTableBody += "</tr>";

        return dataTableBody;
    }


    // *********************************************************
    // Draw the total orders by sales method (Pick Areas)
    function drawTotalOrders (totalPickAreasCounters) {

        let dataTableBody = ""; 
        let totalOrdersByPickArea = 0;

        dataTableBody += "<tr class='centrar totales hide-print'>";
        dataTableBody += "<td colspan='3'>Total de pedidos</td>";

        if(totalPickAreasCounters.size === 0){
            dataTableBody += "<td class='total-orders'></td>";
        }

        totalPickAreasCounters.forEach( (value, zone ) => {
            dataTableBody += "<td class='total-orders'>";
            dataTableBody += value;
            dataTableBody += "</td>";
            totalOrdersByPickArea += value;
        });

        dataTableBody += "<td colspan='3'>";
        dataTableBody += "Pedidos Totales ";
        dataTableBody += "</td>";
        
        dataTableBody += "<td class='hide-print'>"
        dataTableBody += totalOrdersByPickArea;
        dataTableBody += "</td>";
        dataTableBody += "</tr>";

        return dataTableBody;
    }


    // *********************************************************
    // Draw the bottom totals of the data table
    function drawTotalsTable (zoneColumns, totalPackages, totalWeight, totalVolume ) {
        let dataTableBody = ""; 
        dataTableBody += "<tr class='centrar totales'>";
        dataTableBody += "<td colspan='2'>Totales</td>";
        dataTableBody += "<td class='hide-print'></td>"

        // extra columns for each 'Pick Area' zone
        if(zoneColumns <= 0 ){
            dataTableBody += "<td class='hide-print'></td>"
        } else {
            for (let index = 0; index < zoneColumns; index++) {
                dataTableBody += "<td class='hide-print'></td>"
            }
        }

        dataTableBody += "<td>" + roundValue(totalPackages) + " bultos</td>";
        dataTableBody += "<td>" + roundValue(totalWeight) + " Kgs</td>";
        dataTableBody += "<td>" + roundValue(totalVolume) + " m<sup>3</sup></td>";
        dataTableBody += "<td class='hide-print'></td>"
        dataTableBody += "</tr>";

        return dataTableBody;
    }


    // *********************************************************
    function deleteRow( row ) {
        if(confirm("Esta seguro de eliminar la fila con ISELL: " + row + " ?")){
            removeOrder(row);
            showContent(ordersMap);
        }
    }


    // *********************************************************
    // function to draw the head of the data table
    function drawTableDataHeaders() {

        let dataTableHeaders = "";

        const zones = pickAreas.length;

        dataTableHeaders += '<thead>';
        dataTableHeaders += '<tr class="cabecera">';
        dataTableHeaders += '<th class="centrar ordinal" rowspan="2">No.</th>';
        dataTableHeaders += '<th class="isell" rowspan="2">Isell</th>';
        dataTableHeaders += '<th class="centrar hide-print" rowspan="2" >Estado</th>';
        
        // expandir el # de columnas
        dataTableHeaders += '<th class="hide-print" colspan="' + zones + '">Pick Area</th>';

        dataTableHeaders += '<th class="" rowspan="2">No. Paquetes</th>';
        dataTableHeaders += '<th class="" rowspan="2">Peso (Kg)</th>';
        dataTableHeaders += '<th class="" rowspan="2">Volumen (m<sup>3</sup>)</th>';
        dataTableHeaders += '<th class="hide-print icon" rowspan="2">';
        dataTableHeaders += '<div id="edit-rows" class="no-visible_ container_">';
        dataTableHeaders += drawDeleteIcon();
        dataTableHeaders += '</div>';
        dataTableHeaders += '</th>';
        dataTableHeaders += '</tr>';

        dataTableHeaders += '<tr class="cabecera hide-print">';

        // dinamico # de columnas o zonas
        pickAreas.forEach( (zone) => {
            dataTableHeaders += '<th class="invert-colors">' + zone + '</th>';
        });

        dataTableHeaders += '</tr>';
        dataTableHeaders += '</thead>';

        // remenber, this function is only for table head!
        return dataTableHeaders;
    }


    // *********************************************************
    function drawDeleteIcon() {
        let icon = '<svg aria-labelledby="rubbish-bin-icon" id="trash-can-icon" title="Eliminar Fila" class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">';
        icon += '<path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"/>';
        icon += '</svg>';
        return icon;
    }




