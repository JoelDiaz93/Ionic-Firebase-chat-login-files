## Escuela Politécnica Nacional
### Integrantes:

* Carlos Díaz 
* John Vasconez
* Alexis Yépez
* Rubén Maya
# Aplicación de Chat en Ionic
Esta aplicación de chat cumple con los siguiente requerimientos:

1.- Permite utilizar los servicios de firebase para el login (autenticación de usuario), debe tener método de recuperación de contraseña.

2.- Permite enviar mensajes de texto entre usuarios

3.- Permite enviar archivos en el chat.

4.- Permite enviar la geolocalización del dispositivo.

5.- Permite tomar fotos, almacenarlos en la nube y enviarlos por la aplicación

*Para conseguir esto se ha utilizado Firebase, Plugins de propios de Ionic y otros servicios varios.*

## Comenzando 🚀
Debes tener instalado node.js y ionic.
Clona este repositorio:

``` 
git clone https://github.com/JoelDiaz93/Ionic-Firebase-chat-login-files.git
``` 

### Instalación 🔧
Despues instala las dependencias necesarias para su funcionamiento
```
npm install
``` 

Para ejecutar en el navegador
``` 
ionic serve
``` 
## Código fuente

### Autenticación de Usuario (Login)
1) La funcionalidad de la página de login se establece en el archivo **login.page.ts**.

![image](https://user-images.githubusercontent.com/58191417/148470870-24f31022-7ba7-4805-88c4-761cab2801f5.png)

2) La interfaz de la página de login se define en el archivo **login.page.html**.

![image](https://user-images.githubusercontent.com/58191417/148471039-e4648d13-f34c-482a-990f-266b6f2420b6.png)
![image](https://user-images.githubusercontent.com/58191417/148471077-7d0daecd-b76c-4d23-a4ba-21aed7d9687b.png)

*Como se observa, las librerías se importan en el archivo **.ts** y los componentes de interfaz de usuario en el **.html**.*

### Recuperación de contraseña

1) La funcionalidad de la página de recuperación de contraseña se establece en el archivo **forgot-password.page.ts**.

![image](https://user-images.githubusercontent.com/58191417/148471548-b0bb943a-3da7-40fc-bfa0-766b9e84a894.png)

2) La interfaz de la página de recuperación de contraseña se define en el archivo **forgot-password.page.html**.

![image](https://user-images.githubusercontent.com/58191417/148471601-e5070150-3574-438e-bab9-180906c16247.png)
![image](https://user-images.githubusercontent.com/58191417/148471658-e24bb6ca-9c25-4b88-a766-ee742231dc9e.png)

*Como se observa, las librerías se importan en el archivo **.ts** y los componentes de interfaz de usuario en el **.html**.*

### Mensajes de texto entre usuarios

1) La funcionalidad de envío de texto se encuentra en el archivo **dashboard.page.ts**.

#### Obtener usuario autenticado

![image](https://user-images.githubusercontent.com/58191417/148472260-07e1d9f9-9ff6-4b8e-b060-fe30da018547.png)

#### Lectura de mensajes desde la BD

![image](https://user-images.githubusercontent.com/58191417/148472393-c97a94aa-7c69-4839-804a-0c7a98252238.png)
![image](https://user-images.githubusercontent.com/58191417/148472505-bc73fab5-0993-4eef-a2b2-c4f92d1dda5a.png)

#### Escritura de mensajes en la BD

![image](https://user-images.githubusercontent.com/58191417/148472640-9d01c9a1-8d43-4eda-b03b-cf89c1e6d5a7.png)

2) La interfaz de la página de chat se define en el archivo **dashboard.page.html**.

![image](https://user-images.githubusercontent.com/58191417/148473035-22169102-8ff1-4488-a94d-be51479b3508.png)
![image](https://user-images.githubusercontent.com/58191417/148473161-e34824f4-1ec7-4d6d-bb82-c9f5e3ed183e.png)

*Como se observa, para enviar y recibir mensajes se debe obtener la información de sesión de usuario.*

### Envío de archivos en el chat

![image](https://user-images.githubusercontent.com/58042087/148623981-7d442332-c9bd-42d6-a89e-5485165f80f4.png)

### Geolocalización del dispositivo

1) La funcionalidad para el servicio de geolocalización del dispositivo se establece también en **dashboard.page.ts**.

#### Función de Geolocalización

![image](https://user-images.githubusercontent.com/58191417/148474434-ffd305ed-b35a-4ff3-aa39-b573f9d05562.png)

#### Obtención de coordenadas

![image](https://user-images.githubusercontent.com/58191417/148474552-04d609ea-f749-4905-8cad-efa8e52c78da.png)

#### Escritura de coordenadas en la BD

![image](https://user-images.githubusercontent.com/58191417/148474613-683e865f-85e2-4d0c-8c8c-27d6a05b825b.png)

*Se hace uso del plugin de geolocalización de capacitor para obtener las coordenadas del dispositivo móvil.*

2) En la interfaz de chats se condiciona la visualización de las coordenadas ya que contiene atributos distintos.

![image](https://user-images.githubusercontent.com/58191417/148475007-e51d25a2-a240-4007-b190-365bf1b13165.png)

### Captura y almacenamiento de Fotos

1) En primer lugar instalamos las herramientas y plugin necesarios para poder utilizar la cámara.

![image](https://user-images.githubusercontent.com/38251240/148622763-7dfd4252-0023-46ae-968a-305561c2d7d4.png)
![image](https://user-images.githubusercontent.com/38251240/148622793-37cef28d-d77d-4864-bb3a-f24a40cfb3ab.png)
![image](https://user-images.githubusercontent.com/38251240/148622802-15624370-1353-4b98-98ab-657cd2fef2ac.png)

2) Importamos las librerías en src/main.ts

![image](https://user-images.githubusercontent.com/38251240/148622878-9ccc53f8-ab08-4800-9be6-1ab79cfecf1d.png)

3) Añadimos el botón de la camara en el dashboard.page.html

![image](https://user-images.githubusercontent.com/38251240/148623026-afc3ecc3-c06e-4a9d-9929-32cb61b27c7a.png)

4) Creamos las funciones que permitiran tomar la foto con la camara y subir a la nube mediante un servicio llamado photo.service.ts

![image](https://user-images.githubusercontent.com/38251240/148623110-0b8a6fc8-2dfa-40bb-b5dc-c118f6e5707b.png)
![image](https://user-images.githubusercontent.com/38251240/148623132-d49d41b9-92fd-430c-b693-937d91385a86.png)

## Funcionamiento de la aplicación

### Registro de usuario

1) Para crear una nueva cuenta de usuario accedemos a la opción de registrarse ahora:

![image](https://user-images.githubusercontent.com/58191417/148625976-ff8a16d7-44ca-457e-99f2-9d8ff1a1669d.png)

2) Ingresamos un correo y una contraseña para la nueva cuenta:

![image](https://user-images.githubusercontent.com/58191417/148626081-cf849351-a23c-4069-9f40-86d14aa76483.png)

3) Una vez hecho esto, se enviará un link de verificación al email ingresado:

![image](https://user-images.githubusercontent.com/58191417/148626119-4d4ce71a-d15e-4fba-9974-c885de07fe49.png)

4) Accedemos al link y esto habilitará la nueva cuenta de usuario

### Inicio de sesión

1) Para iniciar sesión ingresamos el correo y contraseña:

![image](https://user-images.githubusercontent.com/58191417/148624588-6e6fc5d4-6541-4afc-87cf-859f14f69745.png)

### Recuperación de contraseña

1) Para recuperar la contraseña accedemos a la siguiente opción:

![image](https://user-images.githubusercontent.com/58191417/148626283-e19b46ae-cb6c-4341-92ef-a2626a914e48.png)

2) Tendremos que ingresar el correo electrónico con el que se creo la cuenta de la que se quiere cambiar la contraseña:

![image](https://user-images.githubusercontent.com/58191417/148626343-48b2b32a-a0aa-4824-8575-5f2d411ded0a.png)

3) Al acceder al link enviado al correo, se presentará la pantalla donde digitaremos la nueva contraseña de la cuenta:

![image](https://user-images.githubusercontent.com/58191417/148626441-4fd55987-8b1e-4b49-a49d-79cca0b56421.png)

### Envio y recepción de mensajes de texto

• Dentro del chat, escribiremos el mensaje de texto y al dar click en el botón enviar, se enviará el mensaje.

![image](https://user-images.githubusercontent.com/58191417/148626499-7f13bb74-caf3-4945-978c-b5d73365aba1.png)

• Esto lo puede hacer cualquier usuario que haya iniciado sesión dentro de la aplicación:

![image](https://user-images.githubusercontent.com/58191417/148626556-70326aeb-7171-46dc-9c6c-fc12574c1fa9.png)

*En la imagen se puede observar como el usuario **cdiaz_...** ha enviado un mensaje.*

### Envio de archivos

1) Para enviar un archivo, presionamos el botón de **+** y se presentará un cuadro de dialogo para poder elegir el archivo a enviar, en este caso una captura de pantalla:

![image](https://user-images.githubusercontent.com/58191417/148626678-5b89927f-e305-4e53-8749-a9debb32884e.png)

2) Esto enviará el archivo de tal manera que inmediatamente se reflejará en el chat:

![image](https://user-images.githubusercontent.com/58191417/148626702-c00f0e99-fc13-4d11-83f9-3944cd1bee9a.png)

### Envio de geolocalización

• Si un usuario desea compartir su localización dentro del chat, este deberá presionar el botón con el icono de ubicación:

![image](https://user-images.githubusercontent.com/58191417/148626788-2fb2c660-0167-4844-8e03-4100f3c70e5f.png)
 
• Una vez presionado, en el chat se presentaran las coordenadas del usuario en forma de mensaje. 

![image](https://user-images.githubusercontent.com/58191417/148626879-a08209d8-f4ad-45b6-a56a-5437cba870cc.png)

*Se observa en la imagen que la ubicación de un usuario consta de la **latitud y longitud**.*

### Captura y almacenaje de fotos

2) Al dar click en el icono de cámara, este activará la cámara del dispositivo:

![image](https://user-images.githubusercontent.com/58191417/148627116-5dc58754-3bdf-407e-b21e-5f420861f06e.png)

3) Se captura la foto y elegimos si la enviamos o la descartamos:

 ![image](https://user-images.githubusercontent.com/58191417/148627178-5a6a83b5-d5a0-4983-91fa-065dfe7f4852.png)

4) Si decidimos enviar la foto, esta se presentará en el chat de forma inmediata ya que se ha guardado en la base de datos

![image](https://user-images.githubusercontent.com/58191417/148627249-7bec91bb-792f-4671-b873-0f72a891aa12.png)

### Funciones y recursos varios ⌨️

La aplicacion en cuestion tiene las funciones de:
Se utilizaron las siguiente librerias en app modules

![image](https://user-images.githubusercontent.com/58042087/145653948-d237cbdd-d102-46aa-92ce-2c0c2623e93e.png)

Los servicios de autenticacion consta de las siguientes funciones

![image](https://user-images.githubusercontent.com/58042087/145654020-f3e69b9a-9f7a-4afc-b888-edb54a70dc4e.png)
![image](https://user-images.githubusercontent.com/58042087/145654034-6ec8c6d1-d225-45ba-8469-e0296f732569.png)
![image](https://user-images.githubusercontent.com/58042087/145654048-569d378f-fea7-4d55-b120-194bf14fd8bc.png)

Para los servicios de chat se utiliza las siguientes funciones:

![image](https://user-images.githubusercontent.com/58042087/145654095-19878be8-e3a3-4edb-baf1-2fc64be05897.png)

Estructura del proyecto completa:

![image](https://user-images.githubusercontent.com/58191417/148627430-e576902f-56d0-44f4-9fc9-1de05db64f69.png)

## APK y Bundle

#### Construcción de la aplicación

I) Ejecutamos el comando `ionic cap add android`. Este comando creará el directorio **android** que será la aplicación como tal para la plataforma Android (si se requiere para plataforma IOS bastaría la ejecución del comando `ionic cap add ios`).

![image](https://user-images.githubusercontent.com/58191417/147428312-bb1caa15-8b53-4ff8-9995-f62349bce5c2.png)

III) Realizado esto, es posible abrir el proyecto de android directamente en el IDE Android Studio con el comando `ionic cap open android`.

#### Creación del APK 

• Dentro de Android Studio, nos dirigimos a la ruta **Build > Build Bundle(s)/APK(s) > Build APK(s)**

![image](https://user-images.githubusercontent.com/58191417/147428647-2aaaa73c-7d80-48d4-a20c-f3269f6f1a33.png)

• Comenzará un proceso de Gradle y el resultado final será el archivo **apk** de la aplicación, al cual podremos acceder desde el explorador de archivos del sistema:

![image](https://user-images.githubusercontent.com/58191417/147428986-93b7a32f-7fbf-46f7-a151-aa9cc95c1dfb.png)


