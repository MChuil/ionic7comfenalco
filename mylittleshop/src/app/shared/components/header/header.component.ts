import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title: string;
  @Input() isModal: boolean;


  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  dismissModal(){
    this.modalService.dismissModal();
  }

}
