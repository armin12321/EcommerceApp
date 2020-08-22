import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = 'homepage';
  heroes: Array<Number> = [1, 2, 3, 4, 5, 3, 4, 4];

  constructor(
    private serverService: ServerService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.serverService.getHomeData().subscribe((data) => {
      //display these products on main page.
    });
  }

}
