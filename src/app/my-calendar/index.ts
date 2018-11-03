import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CalendarHomeComponent } from './calendar-home/calendar-home.component';
import { MyCalendarRoutingModule } from './my-calendar-routing.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MyCalendarRoutingModule,
  ],
  declarations: [CalendarHomeComponent]
})
export class MyCalendarModule { }
