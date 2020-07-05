import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if(user.firstName == undefined || user.lastName == undefined || user.email == undefined || user.password == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  validateEmail(email) {
    const  reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
  }

}
