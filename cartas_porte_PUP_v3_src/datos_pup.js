
const configData = 
[
    {
        pupId : "DIAGONAL",
        title : "Diagonal",
        cutOffTime : "20:15",
        senderAddress : [ 
            "IKEA Gran Via 406", 
            "Gran Via de l'Hospitalet 115-133", 
            "Hospitalet de Llobregat 08908", 
            "Barcelona, Espanya"
        ],
        consigneeAddress : [
            "PUP Travessera (PUPT-BCN)", 
            "C/ Travessera de Gracia 12", 
            "08012 - Barcelona (Barcelona)", 
            "Spain"
        ],
        carrierAddress : [
            "ADER Taxicomercial.com", 
            "Avinguda Gran Via, 16-20, 4A", 
            "08902, L'Hospitalet de Llobregat", 
            "comunicacion@aderonline.com"
            // http://www.taxicomercial.com/es/servicios-centrales.aspx
        ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo", 
                serviceNameShort : "Dg F1", 
                serviceCode : "FURGO_ONE", 
                documentTransport_A : "406PUPT-",
                documentTransport_B : "(Furgo 1)",        
                serviceValues : ["10:00", "12:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo", 
                serviceNameShort : "Dg F2", 
                serviceCode : "FURGO_TWO",
                documentTransport_A : "406PUPT-",
                documentTransport_B : "(Furgo 2)",        
                serviceValues : ["15:00"] 
            }, 
            { 
                serviceName : "Tercera Furgo", 
                serviceNameShort : "Dg F3", 
                serviceCode : "FURGO_THREE",
                documentTransport_A : "406PUPT-",
                documentTransport_B : "(Furgo 3)",        
                serviceValues : ["18:00"] 
            }
        ]
    }, 

    {
        pupId : "SANT_PERE",
        title : "Sant Pere",
        cutOffTime : "20:00",
        senderAddress : [
            "IKEA Gran Via 406", 
            "Gran Via de l'Hospitalet 115-133", 
            "Hospitalet de Llobregat 08908", 
            "Barcelona, Espanya"
        ],						
        consigneeAddress : [
            "IKEA St Pere Planning Studio", 
            "Rambla del Garraf s/n, Parc d'Oci Les Roquetes Local 10-B2", 
            "El Mas d'en Serra, 08812", 
            "Barcelona, Espanya"
        ],	
        carrierAddress : [
            "ADER Taxicomercial.com", 
            "Avinguda Gran Via, 16-20, 4A", 
            "08902, L'Hospitalet de Llobregat", 
            "comunicacion@aderonline.com"
        ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo",
                serviceNameShort : "SP1", 
                serviceCode : "FURGO_ONE",
                documentTransport_A : "406SP ",
                documentTransport_B : " SANT PERE (FURGO 1)",        
                serviceValues : ["10:00", "13:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo",
                serviceNameShort : "SP2", 
                serviceCode : "FURGO_TWO",
                documentTransport_A : "406SP ",
                documentTransport_B : " SANT PERE (FURGO 2)",        
                serviceValues : ["16:00", "19:00"] 
            }
        ]
    }, 

    {
        pupId : "TARRAGONA",
        title : "Tarragona",
        cutOffTime : "19:45",
        senderAddress : [ 
            "IKEA Gran Via 406", 
            "Gran Via de l'Hospitalet 115-133", 
            "Hospitalet de Llobregat 08908", 
            "Barcelona, Espanya"
        ],
        consigneeAddress : [
            "IKEA Tarragona Planning Studio", 
            "Avenida Ramón y Cajal 155", 
            "Tarragona, 43005", 
            "Tarragona, Espanya"
        ],
        carrierAddress : [
            "ADER Taxicomercial.com", 
            "Avinguda Gran Via, 16-20, 4A", 
            "08902, L'Hospitalet de Llobregat", 
            "comunicacion@aderonline.com"
        ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo",
                serviceNameShort : "T1", 
                serviceCode : "FURGO_ONE",
                documentTransport_A : "406TGN ",
                documentTransport_B : " FURGO 1",        
                serviceValues : ["10:00", "13:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo", 
                serviceNameShort : "T2", 
                serviceCode : "FURGO_TWO",
                documentTransport_A : "406TGN ",
                documentTransport_B : " FURGO 2",        
                serviceValues : ["17:00", "19:00"] 
            }
        ]
    }   
];

