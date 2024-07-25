import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { FilterContentComponent } from './filter-content/filter-content.component';
import { Filter } from 'src/app/models/filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FilterContentComponent]
})
export class FilterComponent  implements OnInit {

  @Input() filter: Filter;
  @Input() payment: boolean = false;

  @Output() filterData: EventEmitter<Filter>

  public showFilter: boolean;

  constructor(private popoverCtrl: PopoverController) {
    this.showFilter = false;
    this.filterData = new EventEmitter<Filter>();
  }

  ngOnInit() {
  }

  async createPopover(event: any){
    const popover = await this.popoverCtrl.create({
      component: FilterContentComponent,
      backdropDismiss: true,
      event,
      cssClass: 'custom-popover',
      componentProps: {
        filter: this.filter,
        payment: this.payment
      }
    });

    popover.onDidDismiss().then((event)=>{
      console.group(event.data);
      this.showFilter = false;
      if(event.data){
        this.filterData.emit(event.data)
      }
    })

    await popover.present();
  }

  showHideFilters($event){
    this.showFilter = !this.showFilter;
    if(this.showFilter){
      this.createPopover($event);
    }
  }

}
