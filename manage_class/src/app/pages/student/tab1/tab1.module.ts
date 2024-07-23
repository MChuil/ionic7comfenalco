import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { FormStudentComponent } from './components/form-student/form-student.component';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    ListDataComponent
  ],
  declarations: [
    Tab1Page,
    FormStudentComponent
  ]
})
export class Tab1PageModule {}
