import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';


import { Tab3PageRoutingModule } from './tab3-routing.module';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListDataComponent,
    Tab3PageRoutingModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
