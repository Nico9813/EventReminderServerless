# ServerlessAPP
Aplicacion web que permite crear eventos y que cualquiera pueda suscribirse a ellos y se les notificara por mail cuando esten a punto de empezar. Soporta eventos repetibles en ciertos intervalos diarios, semanales, mensaules, etc.

### Objetivo
Esta aplicacion fue hecha para probar las distintas tecnologias que ofrece AWS. 
Si bien usa varias herramientas distintas, todas estan incluidas dentro del [free tier](https://aws.amazon.com/free/?trk=ps_a134p000003yhOpAAI&trkCampaign=acq_paid_search_brand&sc_channel=ps&sc_campaign=acquisition_LATAMO&sc_publisher=google&sc_category=core&sc_country=LATAMO&sc_geo=LATAM&sc_outcome=Acquisition&sc_detail=%2Baws%20%2Bfree&sc_content=Cost_bmm&sc_matchtype=b&sc_segment=453309389722&sc_medium=ACQ-P|PS-GO|Brand|Desktop|SU|AWS|Core|LATAMO|EN|Text&s_kwcid=AL!4422!3!453309389722!b!!g!!%2Baws%20%2Bfree&ef_id=CjwKCAiAjeSABhAPEiwAqfxURe4LlzOmpiRX_7YhzJ515OMLZz_mAga_NpX91fW4tlxY-mwUVUCIYhoCmVAQAvD_BwE:G:s&s_kwcid=AL!4422!3!453309389722!b!!g!!%2Baws%20%2Bfree&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc) que esta plataforma ofrece.

# Diagrama de arquitectura

<img src="https://github.com/Nico9813/ServerlessAPP/blob/main/AWSarquitectura.png?raw=true"/>

## Microservicios

La aplicacion esta dividida en **tres servicios** y utiliza otro externo llamado AUTH0 para facilitar la autentificacion y autorizacion mediante JWT tokens.
Cada uno de estos servicios fueron hechos para que sean completamente reutilizables por separado.

### 1. Servicio de autentificacion
Este servicio contiene simplemente una funcion lambda capaz de autentificar un token y aceptar o rechazar una request dependiendo el resultado. Esta funcion es invocada cada vez que una request llega al API gateway del servicio de eventos.

### 2. Servicio de eventos
En este servicio se maneja la logica de la aplicacion, cuenta con los siguientes objetos de aws:
 
* **AWS DynamoDb:** Base de datos no relacional que guarda los datos de todos los eventos agregados.
  
* **AWS S3 Bucket:** Servicio que almacena las imagenes asignadas a los eventos (Se borran en un dia para evitar costos al ser una app de prueba).
  
* **AWS ApiGateway:** Permite que se puedan activar las lambda mediante http request.
  
* **AWS EventsBridge:** Permite activacion de las lambda mediante ejecuciones programadas cada cierto tiempo.
  
* **Lambda functions**:

  - Se exponen 7 funciones para el manejo de los eventos (creacion, eliminacion, suscripcion, actualizacion) activadas mediante http request siguiendo el formato REST.
  
  - Se crearon tambien 2 funciones que son ejecutadas cada 30 minutos por AWS EventsBridge encargadas de actualizar las fechas de los eventos repetibles y notificar a los suscriptores cuando un evento esta cerca.
  
  
### 3. Servicio de notificaciones
 Este servicio cuenta con dos objetos:
 
 *  **AWS SQS:** Cola de mensajes en la cual se pushearan todos los mails que se deseen en enviar
 
 *  **LAMBDA sendMail:** Funcion que se activa cada vez que llega un mensaje a la cola y se encarga de enviar el email correspondiente utilizando el servicio de emails de amazon AWS SES.
