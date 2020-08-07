import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  title: string = 'login page.';

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.postData();
  }

  postData(): void {
    const this_data = { //this is gettable from form.
      first: 'first',
      second: 'second'
    };

    this.serverService.postLoginData(this_data).subscribe((data) => {
      this.title = data.msg;
      console.log(data);
    });
  }
}
