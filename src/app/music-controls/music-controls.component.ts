import { Component, OnInit } from '@angular/core';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-music-controls',
  templateUrl: './music-controls.component.html',
  styleUrls: ['./music-controls.component.scss']
})
export class MusicControlsComponent implements OnInit {

  constructor(private musicService:MusicService) { }

  ngOnInit(): void {
  }

  test():void{
  	//this.musicService.play();
  }

}
