import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title: string = 'register page.';

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.postData();
  }

  postData(): void {
    const my_data = { //gettable from form.
      abc: 'aaaaa',
      dd: 'dlfjdljdf'
    }

    this.serverService.postRegisterData(my_data).subscribe((data) => {
      this.title = data.msg;
      console.log(data);
    });
  }
  
}
