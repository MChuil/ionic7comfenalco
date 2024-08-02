import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon:'home-outline'},
    { title: 'Perfil', url: '/main/profile', icon:'person-outline'}
  ]

  currentPath: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event.url
    })
  }

}
