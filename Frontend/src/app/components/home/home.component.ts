import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = 'homepage';

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.serverService.getHomeData().subscribe((data) => {
      this.title = data.msg;
      console.log(data);
    });
  }

}
