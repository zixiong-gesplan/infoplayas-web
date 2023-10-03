export class Affected {
    id:number;
    gender:string;
    age:number;
    country:string;
    municpality:string = 'No Residente';
    profile:string;
    typeIntervention:string;
    emergencyGrade:number;
    translationCenter:string;
    requireFirstAid:boolean;
    highVolunteer:boolean;
    usedDesa:boolean;
    
    idIncident:number;
    firstAidCauses:[];
    firstAidReason:[];
    municipality:string;
    rescueReason:[];
    substance:any[]
}
