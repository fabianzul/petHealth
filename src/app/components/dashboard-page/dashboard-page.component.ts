import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { moveIn } from '../../../router.animations';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  animations: [moveIn()],
  host: { '[@moveIn]': '' }
})
export class DashboardPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public route(page){
    this.router.navigate([page]);
  }

}
