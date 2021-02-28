import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/i-user';
import { BusinessService } from 'src/app/services/business.service';
import { ClientUserService } from 'src/app/services/client-user.service';
import { Location } from '@angular/common';
import { AuthenticateService } from 'src/app/services/authenticate.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  public client: IUser['user'];

  constructor(
    private route: ActivatedRoute,
    public business: BusinessService,
    public clientService: ClientUserService,
    private location: Location,
    public authService: AuthenticateService,
  ) { }

  ngOnInit(){
    this.clientService.getUserInfo().subscribe(
      (data) =>
      {
        this.client = data;
        // console.log(this.client);
      }
    );
  }

  cancel()
    {
      this.location.back();
    }

}
