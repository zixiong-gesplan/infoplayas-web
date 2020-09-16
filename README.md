# infoplayas

Proyecto de migración de la web https://www.infoplayascanarias.es/ del wordpress a tecnología angular + contenido de la plataforma arcgis online

AYUDA: 
El fichero ayto.json en assets define las características para el portal de cada ayuntamiento de canarias con playas, como pueden ser el código del istac o las propiedades del filtro de municipio en las capas. 
IMPORTANTE!!! Al crear un usuario para el portal además de asignarle un rol personalizado de Esri de los listados a continuación se debe añadir en la biografía el valor correspondiente al ayuntamiento del usuario del fichero ayto.json - propiedad ayto. Esto último no es necesario para los roles de ámbito "todos".

ROLES ESRI->            ámbito          Visualizar Planes     Editar Planes     Visualizar Incidencias      Editar Incidencias      valorArray (roles) ***
InfoPlayas              Municipio       si                    si                si                          si                      infoplayas
InfoPlayas GEST*        todos           si                    si                si                          si                      infoplayas_gest
InfoPlayas INC          Municipio       no                    no                si                          si                      infoplayas_inc
InfoPlayas GOB          todos           si                    no                si                          si                      infoplayas_gob
InfoPlayas VISOR**      todos           si                    no                si                          no                      infoplayas_visor
InfoPlayas MUN****      Municipio       si                    no                si                          no                      infoplayas_visor_mun

* Adicionalmente permite editar todos los campos de la capa de playas en el formulario de inventario en el apartado de clasificación. Gestión interna Gesplán.
** este rol está dirigido para usuarios de esri de tipo viewer, mientras que los otros son de tipo creator (o editores).
*** El array se encuentra en \infoplayas\src\app-settings.ts
**** Se añade este rol para usuarios de ayuntamiento que al contrario que el primero sólo se les permita visualizar