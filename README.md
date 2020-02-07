# infoplayas

Proyecto de migración de la web https://www.infoplayascanarias.es/ del wordpress a tecnología angular + contenido de la plataforma arcgis online

AYUDA: 
El fichero ayto.json en assets define las características para el portal de cada ayuntamiento de canarias con playas, como pueden ser el código del istac o las propiedades del filtro de municipio en las capas. 
IMPORTANTE!!! Al crear un usuario para el portal además de asignarle un rol personalizado de Esri de los listados a continuación se debe añadir en la biografía el valor correspondiente al ayuntamiento del usuario del fichero ayto.json - propiedad ayto.

ROLES ESRI->            ámbito          Visualizar Planes     Editar Planes     Visualizar Incidencias      Editar Incidencias      valorArrayEnvironment.ts (roles)
InfoPlayas              Municipio       si                    si                si                          no                      infoplayas
InfoPlayas GEST         todos           si                    si                si                          si                      infoplayas_gest
InfoPlayas INC          Municipio       no                    no                si                          si                      infoplayas_inc
InfoPlayas GOB          todos           si                    no                si                          si                      infoplayas_gob
