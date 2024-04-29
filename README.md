# **Cartas de Porte Pick Up Points**


Esta **"applicación"** permite al usuario la creación de las cartas de porte para diferentes pick up points (PUPs) y la generación de su documentación correspondiente.

## **Actualizaciones y mejoras**

### Versión 4.4:
* Cambio de arquitectura, paso a servidor en linea.

### Versión 4.3:
* Conversión y modificación de la lógica de ejecución cambiando las areas de picking de 3 estáticas (Markethall, selfservice, warehouse) para ser leídas, procesadas y mostradas de forma dinámica, permitiendo ajustarse a diferencias en los reportes respecto a cada tienda.
* Instalada secuencia de verificación para la carga de los reportes para evitar inconsistencias a la hora de realizar la lógica de negocio.

### Versión 4.2:
* Actualización de la estructura del archivo de configuración para los PUPs para el manejo de configuraciones personalizadas para diferentes tiendas.
* Mejora en la captura de excepciones al cargar los datos de configuración de los PUPs.
* Nueva verificación para la comprobación del archivo de configuración de los PUPs vs. la plantilla HTML para su correspondencia entre tiendas.
* Nueva implementación para la carga dinámica de los scripts de la página para permitir cambiar modo online/local y facilitar el cambiar links entre diversas tiendas.
* Por problemas con los encabezados (CORS) se desecha la idea de mantener los datos de configuración en formato JSON y se regresa a formato js creando un objeto para manipular los datos.

### Versión 4.1:
* Cambio de formato para el archivo de configuración de los Pick up points, pasando de estar escrito en javascript a formato json, para mejorar su lectura.

### Versión 4.0:
Debido a una actualizacion realizada en la aplicación principal la cual genera los reportes desde los cuales esta aplicacion se alimenta, se han generado errores ya que los reportes han cambiado en estructura.

* Reparado el problema de lectura del reporte "orders overview.csv", ya que la codificación cambio de "windows-1252" a UTF-8.
* Mejorado la intercepción de Excepción para la verificación de integridad de la información leida desde el reporte.
* Mensaje de error en caso que el reporte cuente con la columna "DROP OFF" ("Zona de entregas"), ya que esta puede generar errores de integridad en la información leida. 
* Ajuste en la lectura y carga de los reportes "Historical" y "By Status" que continen la informacion de volumen, peso y paquetes para cada ISELL.


### Versión 3.1:
* Resuelto problema del icono del cubo de basura para eliminar las filas no terminadas.
* Agregada advertencia al usuario acerca de los pedidos no terminados para ser impresos en el documento final o no.
* Generación de información para depuración por consola (logs). 
* Verificación de concordancia en las versiones de actualizaciones.
* Adición de nuevos COTs para flujos con entrega en domingos, Diagonal 16:15, Tarragona 15:45 y Sant Pere 16:00.

### Versión 3.0:

* Debido a la inconsistencia del reporte tomado como fuente de datos para el análisis de la información, se hicieron cambios en las fuentes de datos, lo cual desencadena un cambio radical en la lógica de negocio planteada. Por lo tanto ahora como fuente de datos se necesitará un informe base y uno o dos complementarios que al combinarlos con el informe base entregarán el detalle de cada linea de información.
* Adición de una columna indicando el estado actual del pedido.
* Adición de una columna para permitir la eliminación de filas de ordenes que no han sido terminadas y por consiguiente no serán enviadas a su destino.
* Mejora visual en la vista de impresión para reconocer más facilmente cada uno de los documentos. 
* Adición de un nuevo campo ("serviceNameShort") al archivo de configuración de los destinos o flujos de mercancia.
* Ajuste al nombre propuesto al guardar el documento en formato PDF basado en el nuevo campo 'serviceNameShort'.
* Correción del cálculo de los pesos, volúmenes, paquetes y sus totales.

### Versión 2.1.1:

* Modificación en la carga de los scripts y recursos adicionales, al ponerlos en ubicaciones remotas y no locales.
* Visualización mas clara del número de versión en el titulo de la aplicación.

### Versión 2.1:

* Modificación de los "Service Window" en la configuración para la separación de furgo uno y dos.
* Corrección del cálculo de las sumatorias de peso y volúmen por pedido.
* Ajuste visual al rellenar con filas vacias la tabla cuerpo del documento para mejorar la presentación en modo impreso.

### Versión 2.0:

* Cambio total en la fuente de datos (reporte OPITA_PS obtenido mediante el software GADD). 
* Construcción nueva en un 80% para ajustar tanto la interfaz como el análisis de la información proveniente de la nueva fuente de datos.

### Versión 1.6:
    * Adición de la visualización de la hora del archivo de datos junto al nombre del mismo en el botón de "Subir archivo...".
    * Ajuste en la creación del nombre de archivo al momento de imprimir o generar una copia en formato PDF.
    * Correción de la visualización de la sección con el número de versión, en modo vista en pantalla y modo impresión. 
    * Movido el botón "Comentarios" hacia la parte superior junto con los demás botones.
    * Adición del total de pedidos por método de venta.

### Versión 1.5:
    * Mejora al sugerir el nombre del documento al momento de imprimir (guardar) en formato PDF según los datos seleccionados previamente (CUT OFF TIME, SERVICE WINDOW y fecha de entrega).

### Versión 1.4:
    * Actualización de la dirección y la razón social del transportista para cada uno de los destinos.
    * Ajustes en los tamaños de letra y espacios para optimizar la impresión del documento.

### Versión 1.3:
    * Mejora en la visualizacion del pick task añadiendo colores según el estado de la pick task.
    
### Versión 1.2:
    * Agregadas las columnas de los "Pick Areas" (Markethall, Self Service, Full Service Internal) mostrando el id de cada pick order y su estado (diseño en versión de tablas). Funcional pero con fallos en la visualizacion de las filas de la tabla de datos.

### Versión 1.1:
    * Reducción del tamaño de fuente en la sección de la cabecera de información al momento de imprimir el documento.
    * Agregada la función de notas al final del documento en un panel especial para ello. 
    * Inicialización de los valores de la página cuando se carga un nuevo archivo de datos.

### Versión 1.0:
    * Creación de las cartas de porte para cada uno de los destinos y flujos de mercancias.
    * Creación y modelado de las estructuras de datos para los diferentes destinos y sus datos, para posterior personalización.
    * Procesado de las ordenes de pedidos mediante los requerimientos del usuario.
    * Validación y filtrado de la información obtenida.
    * Carga y lectura de datos desde archivo de texto o CSV.
    * Creacion de proyecto.

- - - 
* Daring Fireball https://daringfireball.net/projects/markdown/syntax#hr

*  GitHub https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax

