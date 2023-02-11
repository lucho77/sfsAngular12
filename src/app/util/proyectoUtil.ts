import { environment } from "src/environments/environment";

export function devolverProyecto () {
       //const api = 'https://online1.sfssa.com.ar/SFSFrameworkRest/api/framework/dina';
       //https://fw514.sfssa.com.ar/
       //const api = 'https://fw514.sfssa.com.ar/SFSFrameworkRest/api/framework/dina';
       const api = 'api/framework/dina';
       console.log(environment.api)
    return environment.api;
    //return 'https://fw514.sfssa.com.ar/SFSFrameworkRest/api/framework/dina';
}

