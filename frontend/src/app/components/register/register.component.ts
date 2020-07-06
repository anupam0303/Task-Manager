import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';

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


  constructor(
    private validateService: ValidateService, 
    private authService: AuthService, 
    private flashMessage: FlashMessagesService,
    private router: Router) 
    { }

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
      this.flashMessage.show('Please enter all fields', {cssClass: 'alert-danger', timeout: 10000});
      return false;
    }

    // Email field validation
    if(!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email address', {cssClass: 'alert-danger', timeout: 10000});
      return false;
    }

    // Register new User
    this.authService.registerUser(user)
      .subscribe(data => {
        if(!data.success) {
          // Unsuccessful registration
          console.log('data.success is :' + data.success);
          this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 10000});
          this.router.navigate(['/register']);
        }
        else {
          //successful Registration
          console.log('data.success is :' + data.success);
          this.flashMessage.show('User is successfully registered', {cssClass: 'alert-success', timeout: 10000});
          this.router.navigate(['/login']);
        }
      })
  }

}
