import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule],
})

export class ListDataComponent  {

  @Input({required: true}) data: any[];
  @Input() emptyText: string;

  @Output() add: EventEmitter<boolean>

  @ContentChild('templateData', {static: false}) templateData: TemplateRef<any>

  constructor() {
    this.add = new EventEmitter<boolean>
  }



}
