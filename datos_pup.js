
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
            "ABIAN SERVICE", 
            "Tel: 931161444", 
            "Email: opsbarcelona@abianservice.com"
        ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo", 
                serviceCode : "FURGO_ONE",
                documentTransport_A : "406PUPT-",
                documentTransport_B : "(Furgo 1)",        
                serviceValues : ["10:00-12:00", "12:00-15:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo", 
                serviceCode : "FURGO_TWO",
                documentTransport_A : "406PUPT-",
                documentTransport_B : "(Furgo 2)",        
                serviceValues : ["15:00-18:00"] 
            }, 
            { 
                serviceName : "Tercera Furgo", 
                serviceCode : "FURGO_THREE",
                documentTransport_A : "406PUPT-",
                documentTransport_B : "(Furgo 3)",        
                serviceValues : ["18:00-21:00"] 
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
            "SAMA Log??stica Aplicada SL", 
            "Gran Via de l'Hospitalet 115-133", 
            "Hospitalet de Llobregat 08908", 
            "Barcelona, Espanya"
        ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo",
                serviceCode : "FURGO_ONE",
                documentTransport_A : "406SP ",
                documentTransport_B : " SANT PERE (FURGO 1)",        
                serviceValues : ["10:00-13:00", "13:00-16:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo",
                serviceCode : "FURGO_TWO",
                documentTransport_A : "406SP ",
                documentTransport_B : " SANT PERE (FURGO 2)",        
                serviceValues : ["16:00-19:00", "19:00-21:00"] 
            }
        ]
    }, 

    {
        pupId : "TARRAGONA",
        title : "Taragona",
        cutOffTime : "19:45",
        senderAddress : [ 
            "IKEA Gran Via 406", 
            "Gran Via de l'Hospitalet 115-133", 
            "Hospitalet de Llobregat 08908", 
            "Barcelona, Espanya"
        ],
        consigneeAddress : [
            "IKEA Tarragona Planning Studio", 
            "Avenida Ram??n y Cajal 155", 
            "Tarragona, 43005", 
            "Tarragona, Espanya"
        ],
        carrierAddress : [
            "SAMA Log??stica Aplicada SL", 
            "Gran Via de l'Hospitalet 115-133", 
            "Hospitalet de Llobregat 08908", 
            "Barcelona, Espanya"
        ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo", 
                serviceCode : "FURGO_ONE",
                documentTransport_A : "406TGN ",
                documentTransport_B : " FURGO 1",        
                serviceValues : ["10:00-13:00", "13:00-17:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo", 
                serviceCode : "FURGO_TWO",
                documentTransport_A : "406TGN ",
                documentTransport_B : " FURGO 2",        
                serviceValues : ["17:00-19:00", "19:00-21:00"] 
            }
        ]
    }   
];

