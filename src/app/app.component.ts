import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('sidenav') sideNav: any;

  title = 'fitness-tracker';

  onToggle() {
    this.sideNav.toggle();
  }
}
