import {EsriBoolean} from './esri-boolean';

export interface Danger {
    objectid?: number;
    id_dgse?: string;
    corrientes_mareas?: EsriBoolean;
    rompientes_olas?: EsriBoolean;
    contaminacion?: EsriBoolean;
    fauna_marina?: EsriBoolean;
    desprendimientos?: EsriBoolean;
}
