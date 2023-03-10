
const arrayData = 
[
    {
        pupId : "TARRAGONA",
        title : "Taragona",
        cutOffTime : "19:45",
        address : ["nombre", "calle", "Ciudad", "Pais" ],
        carrierAddress : ["nombre", "calle", "Ciudad", "Pais" ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo", 
                serviceCode : "FURGO_ONE",
                serviceValues : ["10:00-13:00", "13:00-17:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo", 
                serviceCode : "FURGO_TWO",
                serviceValues : ["17:00-19:00", "19:00-21:00"] 
            }
        ]
    },   

    {
        pupId : "SANT_PERE",
        title : "Sant Pere",
        cutOffTime : "20:00",
        address : ["nombre", "calle", "Ciudad", "Pais" ],
        carrierAddress : ["nombre", "calle", "Ciudad", "Pais" ],
        windowService : [ 
            { 
                serviceName : "Primera Furgo",
                serviceCode : "FURGO_ONE",
                serviceValues : ["10:00-13:00", "13:00-16:00"] 
            }, 
            { 
                serviceName : "Segunda Furgo",
                serviceCode : "FURGO_TWO",
                serviceValues : ["16:00-19:00", "19:00-21:00"] 
            }
        ]
    } 
];


// console.log("Datos JSON: ", arrayData);







// const arrayPUPJSON = ' [ \
//     { \
//         "pupId" : "TARRAGONA", \
//         "title" : "Taragona", \
//         "cutOffTime" : "19:45", \
//         "address" : ["nombre", "calle", "Ciudad", "Pais" ], \
//         "carrierAddress" : ["nombre", "calle", "Ciudad", "Pais" ], \
//         "windowService" : [  \
//             { "ONE" :  ["10:00-13:00", "13:00-17:00"] },  \
//             { "TWO" : ["17:00-19:00", "19:00-21:00"] } \
//         ] \
//     },    \
//  \
//     { \
//         "pupId" : "SANT_PERE", \
//         "title" : "Sant Pere", \
//         "cutOffTime" : "20:00", \
//         "address" : ["nombre", "calle", "Ciudad", "Pais" ], \
//         "carrierAddress" : ["nombre", "calle", "Ciudad", "Pais" ], \
//         "windowService" : [  \
//             { "ONE" :  ["10:00-13:00", "13:00-16:00"] },  \
//             { "TWO" : ["16:00-19:00", "19:00-21:00"] } \
//         ] \
//     }  \
// ] ';