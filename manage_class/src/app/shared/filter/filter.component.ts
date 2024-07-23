import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

  public showFilter: boolean;

  constructor(private popoverCtrl: PopoverController) {
    this.showFilter = false;
  }

  ngOnInit() {
  }

  async createPopover(event: any){
    const popover = await this.popoverCtrl.create({
      component: FilterContentComponent,
      backdropDismiss: true,
      event,
      componentProps: {
        filter: this.filter
      }
    });

    popover.onDidDismiss().then((event)=>{
      this.showFilter = false;
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
