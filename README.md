# **Cartas de Porte Pick Up Points**


Esta **"applicación"** permite al usuario la creación de las cartas de porte para diferentes pick up points y la generación de su documentación correspondiente.

## **Actualizaciones y mejoras**

### Versión 3.0:

* Debido a la inconsistencia del reporte tomado como fuente de datos para el análisis de la información (historical report), se deben hacer cambios en las fuentes de datos, lo cual desencadena un cambio radical en la lógica de negocio planteada. Por lo tanto ahora como fuente de datos se necesitarán tres informes los cuáles se deben combinar para obtener una información confiable. 

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

