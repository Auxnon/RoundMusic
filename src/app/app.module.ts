import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MusicListItemComponent } from './music-list-item/music-list-item.component';
import { MusicListContainerComponent } from './music-list-container/music-list-container.component';
import { MusicBannerComponent } from './music-banner/music-banner.component';
import { MusicControlsComponent } from './music-controls/music-controls.component';
import { SimpleTimePipe } from './simple-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MusicListItemComponent,
    MusicListContainerComponent,
    MusicBannerComponent,
    MusicControlsComponent,
    SimpleTimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
