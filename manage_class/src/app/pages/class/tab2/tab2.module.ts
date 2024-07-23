import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { FormClassComponent } from './components/form-class/form-class.component';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ListDataComponent,
    FilterComponent
  ],
  declarations: [
    Tab2Page,
    FormClassComponent
  ]
})
export class Tab2PageModule {}
