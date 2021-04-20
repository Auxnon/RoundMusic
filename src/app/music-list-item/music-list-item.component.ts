import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../song';

@Component({
  selector: 'app-music-list-item',
  templateUrl: './music-list-item.component.html',
  styleUrls: ['./music-list-item.component.scss']
})
export class MusicListItemComponent implements OnInit {
	@Input() song?: Song;
  constructor() { }

  ngOnInit(): void {
  	
  }

}
