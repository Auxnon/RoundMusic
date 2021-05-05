import { Component, OnInit } from '@angular/core';
import { MusicService} from '../music.service';
import { Song} from '../song';

@Component({
  selector: 'app-music-list-container',
  templateUrl: './music-list-container.component.html',
  styleUrls: ['./music-list-container.component.scss']
})
export class MusicListContainerComponent implements OnInit {
	music:Song[]=[];

  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
  	this.loadMusic();
  }

  loadMusic():void{
  	this.musicService.getMusic().subscribe(list=>this.music=list);
    setInterval(()=>{
      this.musicService.test();
    },100)
  }
  triggerSong(song:Song):void{
    this.musicService.play(song)
  }

}
