export class Error {

mensaje: String;
errorBusiness: boolean;
tokenError: boolean;
tokenExpired: boolean;
errorUnknow: boolean;
opcionOne: String;
opcionTwo: String;
opcionValueOne: String;
opcionValueTwo: String;
parametroCondicional: String;

constructor(message: String, errorBusiness: boolean, tokenError: boolean, tokenExpired: boolean, errorUnknow: boolean,
    opcionOne: String, opcionTwo: String, opcionValueOne: String, opcionValueTwo: String, parametroCondicional: String) {
    this.mensaje = message;
    this.errorBusiness = errorBusiness;
    this.tokenError = tokenError;
    this.tokenExpired = tokenExpired;
    this.errorUnknow = errorUnknow;
    this.opcionOne = opcionOne;
    this.opcionTwo = opcionTwo;
    this.opcionValueOne = opcionValueOne;
    this.opcionValueTwo = opcionValueTwo;
    this.parametroCondicional = parametroCondicional;
}
}
