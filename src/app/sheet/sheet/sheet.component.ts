import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-sheet',
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.scss'
})
export class SheetComponent {

  private route: ActivatedRoute;


  constructor(route: ActivatedRoute) {
    this.route = route;
  }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      console.log(params);
      console.log(this.route);

    });
  }



}
