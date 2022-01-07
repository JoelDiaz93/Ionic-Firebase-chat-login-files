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

INSERTAR CODIGO DE FUNCIONAMIENTO DE ENVIO DE ARCHIVOS

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
INSERTAR CÓDIGO DE FUNCIONAMIENTO DE CAPTURA Y ENVIO DE FOTOS

## Funcionamiento de la aplicación

### Inicio de sesión
### Recuperación de contraseña
### Envio y recepción de mensajes de texto
### Envio de archivos
### Envio de geolocalización
### Captura y almacenaje de fotos

### Codificación ⌨️
La aplicacion en cuestion tiene las funciones de:
Se utilizaron las siguiente librerias en app modules

![image](https://user-images.githubusercontent.com/58042087/145653948-d237cbdd-d102-46aa-92ce-2c0c2623e93e.png)

Los servicios de autenticacion consta de las siguientes funciones

![image](https://user-images.githubusercontent.com/58042087/145654020-f3e69b9a-9f7a-4afc-b888-edb54a70dc4e.png)
![image](https://user-images.githubusercontent.com/58042087/145654034-6ec8c6d1-d225-45ba-8469-e0296f732569.png)
![image](https://user-images.githubusercontent.com/58042087/145654048-569d378f-fea7-4d55-b120-194bf14fd8bc.png)

Para los servicios de chat se utiliza las siguientes funciones:

![image](https://user-images.githubusercontent.com/58042087/145654095-19878be8-e3a3-4edb-baf1-2fc64be05897.png)

EL proyecto consta de 5 paginas y 2 servicios:

![image](https://user-images.githubusercontent.com/58042087/145654145-f9606dcb-1cac-491d-8fd6-d34917bb4b9b.png)

Link de la explicacion en youtube: https://youtu.be/x72ZCEXztEw
