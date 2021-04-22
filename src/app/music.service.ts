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

	currentAmp:number=0;
	playing:boolean=false;

	constructor() { }

	getMusic(): Observable<Song[]> {
		const list = of(this.FAUXLIST);
		return list;
	}
	test(): void {
		// if(this.FAUXLIST[0].length)
		// 	this.FAUXLIST[0].length--;
	}

	getAmp():number{
		return this.currentAmp;
	}
	getPlaying():boolean{
		return this.playing;
	}
	play(): void {
		window.AudioContext = window.AudioContext;// || window.webkitAudioContext;
		const audioContext = new AudioContext();
		const gainNode = audioContext.createGain();
		gainNode.gain.value=0.2



		let source = audioContext.createBufferSource();
		let currentBuffer = null;
		let timeRatio=0;
		let chunk:number[];


		const filterData = (audioBuffer:AudioBuffer) => {
			console.log('channels',audioBuffer.numberOfChannels)
		  const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
		  const samples = 10000; // Number of samples we want to have in our final data set
		  const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
		  timeRatio=audioBuffer.duration/samples;
		  const filteredData:number[] = [];
		  for (let i = 0; i < samples; i++) {
		    let blockStart = blockSize * i; // the location of the first sample in the block
		    let sum = 0;
		    let max=0;
		    for (let j = 0; j < blockSize; j++) {
		    	let v=Math.abs(rawData[blockStart + j])
		      sum = sum + v; 
		      if(v>max)
		      	max=v;

		    }
		    let avg=sum / blockSize
		    filteredData.push(max);
		  }
		  return filteredData;
		};


		const normalizeData = (filteredData:number[]) => {
			const multiplier = Math.pow(Math.max(...filteredData), -1);
			return filteredData.map(n => n * multiplier);
		}

		const visualize = (buffer: number[]) => {
			//console.log(buffer)
			chunk=buffer;
		}

		const visualizeAudio = (url: RequestInfo) => {
			fetch(url)
				.then(response => response.arrayBuffer())
				.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
				.then(audioBuffer => {
					source.buffer = audioBuffer;

        source.connect(gainNode).connect(audioContext.destination);
        source.loop = true;
        source.start(0);
        let tester=document.querySelector('#test')
        let temp=this;//FIX
        setInterval(function(){
        	let index=Math.floor(audioContext.currentTime/timeRatio)
        	let value=chunk?chunk[index]:undefined;
        	if(tester && value && tester instanceof HTMLElement){
        		tester.style.transform='scale(1,'+value+')';
        		temp.currentAmp=value;
        	}
        	//console.log(index,value,audioContext.currentTime)
        },1)
					visualize(normalizeData(filterData(audioBuffer)))
				});
		};
		visualizeAudio('./assets/scattle.mp3')
	}
}
