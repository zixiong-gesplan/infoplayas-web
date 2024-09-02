# infoplayas
Proyecto desarrollado en Angular con Typescript.

Para instalar las dependencias:
```
    npm run install
```

Para ejecutar el código:
```
    npm run start
```

Para el buildeo:
```
    npm run build
```

Se emplea un diseño atómico para los componentes y las páginas:

* La carpeta *component*, incluye los componetes webs
* La carpeta *page*, incluye las páginas webs, con rutas

Las carpetas especiales por la nomenclatura Angular:
* La carpeta *guards*, tiene los guards
* La carpeta *providers*, contiene las conexiones al servidor. El enpoint de de este servidor se encuentra en la carpeta de enviroments

* La carpeta *service*, contiene los servicios - funcionalidades pesadas-.

El objetivo de esta web es la informacion del proyecto para la seguridad en las playas

Por como han evolucionado el proyecto, hay paginas ocultas para que no puedan acceder. Se debe de revisar el fichero *app-routing.module.ts*, en el cual se encuentran tanto las rutas webs como la pagina correspondiente.

Las rutas actuales para el uso de la web:
 * /, el home, corresponde a la carpeta *page/home*
 * /catalogo, corresponde a la carpeta *page/catalogue*, 
 * /trabajo-campo, corresponde a la carpeta *page/workfield*
 * /cecoes, corresponde a la carpeta *page/cecoes*
 * /cecoes-fallecias-acumulativos,  corresponde a la carpeta *page/cecoes-fallecidos-acumulativos*
 * /dashboards,  corresponde a la carpeta *page/dashboards*
 * /documents,  corresponde a la carpeta *page/documents*
 * /dashboard-pss,  corresponde a la carpeta *page/dashboard-pss*

 ```
 El enlace del visor de tiempo real, es una herramienta externa a esta web. Se describe en su propio código y README.md

 El enlace de login, es una herramienta externa a esta web. Se describe en su propio código y README.md
 ```

