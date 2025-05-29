import { error } from 'console';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsField } from '@app/helpers/ValidatorsField';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  user = {} as User;

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router,
              private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.validation();
  }

  private validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorsField.MustMatch('password', 'passwordConfirm')
    };

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      passwordConfirm: ['', Validators.required],
    }, formOptions);
  }

  register(): void{
    this.user = { ...this.form.value };
    this.accountService.register(this.user).subscribe(
      () => this.router.navigateByUrl('/dashboard'),
      (error: any) => this.toastr.error(error.error)
    )
  }
}
