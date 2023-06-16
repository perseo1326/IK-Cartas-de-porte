



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
    function loadConfigurationPUP() {
        // Function to load the destination ("CUT_OFF_TIME") options into the drop down list selector 

        cleanChildNodes(cutOffTimeSelector);
        loadOptionsDropDownListView(cutOffTimeSelector, DEFAULT_DROPDOWNLIST_VALUE.value, DEFAULT_DROPDOWNLIST_VALUE.text );

        if(typeof(configData) === "undefined") {
            console.log("No fue posible cargar la configuración inicial.");
            alert("No fue posible cargar la configuración inicial.");
            // TODO: retornar un obj Eror ?
        }

        configData.forEach( (destination) => {
            loadOptionsDropDownListView(cutOffTimeSelector, destination.pupId, destination.title);
        } );
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
        return configData.find( obj => { return obj.pupId === value});
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
    function showContent(data) {
        // Clean and initialize values for the table data view
        tableBody.innerHTML = "";
        let dataTableBody = "";

        console.log("SHOW CONTENT: ", data);

        let count = 1;



        // let totalPackagesShipment = 0;
        // let totalWeightShipment = 0;
        // let totalVolumeShipment = 0;

        // let totalMarkethallOrders = 0;
        // let totalSelfServiceOrders = 0;
        // let totalFullInternalOrders = 0;
                
        // fill rows with data
        data.forEach( (value, key) => {
            dataTableBody += drawRow(value, count);
            count++;
        });
        
        // // fill with empty rows
        // let emptyOrder = new Order("-", "-", "-", "-");
        // for(let i = data.size + 1; i < 36; i++ ) {
        //     dataTableBody += drawRow(emptyOrder, i);
        // }

        // // get the totals for "Packages", "Kgs" and "Volume"
        // // get total orders by sales method (Markethall, self service, full internal)
        // data.forEach( (value, key ) => {
        //     totalPackagesShipment += value.totalPackages;
        //     totalWeightShipment += value.totalWeight;
        //     totalVolumeShipment += value.totalVolume;
        //     (value.containPickArea(MARKET_HALL) === "X") ? totalMarkethallOrders++ : false;
        //     (value.containPickArea(SELF_SERVICE) === "X") ? totalSelfServiceOrders++ : false;
        //     (value.containPickArea(WAREHOUSE) === "X") ? totalFullInternalOrders++ : false;
        // });

        // dataTableBody += drawTotalOrders(totalMarkethallOrders, totalSelfServiceOrders, totalFullInternalOrders);
        // dataTableBody += drawTotalsTable(totalPackagesShipment, totalWeightShipment, totalVolumeShipment);

        tableBody.innerHTML += dataTableBody;
    }



    // *********************************************************
    function drawRow(value, count) {
        let dataTableBody = "";
        // console.log("Dibujar fila valor: ", value);

        // first column: counter
        dataTableBody += "<tr class='centrar'>";
        dataTableBody += "<td>";
        dataTableBody += count;
        dataTableBody += "</td>";

        // second column: ISELL
        dataTableBody += "<td class='isell' >";
        // dataTableBody += "<div class='back2 ' onclick='xx(this)'>";
        // dataTableBody += "<input type='text' class='unstyle' value='";
        // dataTableBody += value.isellOrderNumber + "' readonly />";
        dataTableBody += value[SALES_REF];
        // dataTableBody += "</div>";
        dataTableBody += "</td>";
        
        // third column: Order Status
        dataTableBody += "<td class='centrar'>";
        dataTableBody += value[ORDER_STATUS];
        dataTableBody += "</td>";



        // ********
        dataTableBody += "<td class='container-column hide-print'>";
        dataTableBody += "<p class='pick-id'>";
        // dataTableBody += value.containPickArea(MARKET_HALL);
        dataTableBody += "</p>";
        dataTableBody += "</td>";

        dataTableBody += "<td class='container-column hide-print'>";
        dataTableBody += "<p class='pick-id'>";
        // dataTableBody += value.containPickArea(SELF_SERVICE);
        dataTableBody += "</p>";
        dataTableBody += "</td>";

        dataTableBody += "<td class='container-column hide-print'>";
        dataTableBody += "<p class='pick-id'>";
        // dataTableBody += value.containPickArea(WAREHOUSE);
        dataTableBody += "</p>";
        dataTableBody += "</td>";

        // *******

        dataTableBody += "<td>";
        // dataTableBody += roundValue(value.totalPackages);
        dataTableBody += "</td>";
        dataTableBody += "<td>";
        // dataTableBody += roundValue(value.totalWeight);
        dataTableBody += "</td>";
        dataTableBody += "<td>";
        // dataTableBody += roundValue(value.totalVolume );
        dataTableBody += "</td>";

        return dataTableBody;
    }




