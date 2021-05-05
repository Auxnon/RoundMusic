import { Component, OnInit,ElementRef, Input } from '@angular/core';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-music-banner',
  templateUrl: './music-banner.component.html',
  styleUrls: ['./music-banner.component.scss']
})
export class MusicBannerComponent implements OnInit {

@Input() imageSource:string="purple.jpg";

  constructor(private musicService:MusicService) { }

  ngOnInit(): void {
  }
  getArt():string{
  	return this.musicService.getArt();
  }




}


