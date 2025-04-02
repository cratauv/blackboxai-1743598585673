import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BookingOptionsModule } from './booking-options/booking-options.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BookingOptionsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }