import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  firstName: String;
  lastName: String;
  email: String;
  password:String;
  userImage: String;


  constructor(private validateService: ValidateService, private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    console.log("Register Submit");
    const user= {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      userImage: this.userImage
    }

    // Required fields validation
    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please enter all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Email field validation
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email address', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }
  }

}
