import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegisterForm(data){
    if (data.name == undefined || data.email == undefined || data.username == undefined || 
      data.password == undefined || data.repeatedPassword == undefined ||
      data.surname == undefined || data.address == undefined || data.type == undefined) return false;
    else return true;
  }

  validatePasswords(password, repeatedPassword){
    if (password === repeatedPassword) return true;
    else return false;
  }

  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
