import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Song } from './song';

@Injectable({
	providedIn: 'root'
})

export class MusicService {
	FAUXLIST: Song[] = [
		{ id: 0, artist: 'Scattle', name: 'TimeLapse', url: './scattle.mp4', length: 400 },
		{ id: 1, artist: 'ColdPlay', name: 'Viva La Vida', url: './vivalavida.mp4', length: 180 }
	];
	constructor() { }



	getMusic(): Observable<Song[]> {
		const list = of(this.FAUXLIST);
		return list;
	}
	test(): void {
		// if(this.FAUXLIST[0].length)
		// 	this.FAUXLIST[0].length--;
	}
	play(): void {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();
		let currentBuffer = null;

		const visualizeAudio = url => {
			fetch(url)
				.then(response => response.arrayBuffer())
				.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
				.then(audioBuffer => visualize(audioBuffer));
		};
	}
}
