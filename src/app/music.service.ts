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


	currentAmp: number = 0;
	currentTime: number = 0;
	currentDuration: number = 0;


	audioContext = new AudioContext();
	currentAudioBuffer?: AudioBuffer;
	currentAudioSource?: AudioBufferSourceNode;
	audioGainNode: GainNode = this.audioContext.createGain();

	audioHardwareOffset:number=0;

	currentVisualRatio: number = 0;
	currentAudioChunks: number[] = [];

	playing: boolean = true;



	constructor() { }

	getMusic(): Observable<Song[]> {
		const list = of(this.FAUXLIST);
		return list;
	}
	test(): void {
		// if(this.FAUXLIST[0].length)
		// 	this.FAUXLIST[0].length--;
	}

	getAmp(): number {
		return this.currentAmp;
	}

	getPlaying(): boolean {
		return this.playing;
	}
	getTime():number {
		return this.audioContext.currentTime-this.audioHardwareOffset;
	}
	getTimeRatio() {
		let r = this.getTime() / this.currentDuration
		return (isNaN(r) ? 0 : r);
	}
	getDuration(): number {
		return this.currentDuration;
	}

	setTime(value: number): void {

		if (this.currentAudioBuffer && this.currentAudioSource) {
			let time = value * this.currentDuration

			this.currentAudioSource.stop(0);
			this.currentAudioSource.disconnect();

			this.currentAudioSource = this.audioContext.createBufferSource();

			this.currentAudioSource.buffer = this.currentAudioBuffer;
			this.currentAudioSource.connect(this.audioGainNode).connect(this.audioContext.destination);

			this.currentAudioSource.start(0, time);
			this.audioHardwareOffset=this.audioContext.currentTime;
		}

	}

	play(): void {
		let temp = this;//FIX

		window.AudioContext = window.AudioContext;// || window.webkitAudioContext;
		this.audioContext;

		this.audioGainNode.gain.value = 0.05




		let currentBuffer = null;
		let timeRatio = 0;


		const filterData = (audioBuffer: AudioBuffer) => {
			console.log('channels', audioBuffer.numberOfChannels)
			const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
			const samples = 10000; // Number of samples we want to have in our final data set
			const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
			this.currentVisualRatio = audioBuffer.duration / samples;
			this.currentDuration = audioBuffer.duration;
			const filteredData: number[] = [];
			for (let i = 0; i < samples; i++) {
				let blockStart = blockSize * i; // the location of the first sample in the block
				let sum = 0;
				let max = 0;
				for (let j = 0; j < blockSize; j++) {
					let v = Math.abs(rawData[blockStart + j])
					sum = sum + v;
					if (v > max)
						max = v;

				}
				let avg = sum / blockSize
				filteredData.push(avg); //max
			}
			return filteredData;

		};


		const normalizeData = (filteredData: number[]) => {
			const multiplier = Math.pow(Math.max(...filteredData), -1);
			return filteredData.map(n => n * multiplier);
		}

		const visualize = (buffer: number[]) => {
			//console.log(buffer)
		
			this.currentAudioChunks=buffer;
		}

		const visualizeAudio = (url: RequestInfo) => {
			fetch(url)
				.then(response => response.arrayBuffer())
				.then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
				.then(audioBuffer => {
					this.currentAudioSource = this.audioContext.createBufferSource();

					this.currentAudioSource.buffer = audioBuffer;
					this.currentAudioBuffer = audioBuffer;

					this.currentAudioSource.connect(this.audioGainNode).connect(this.audioContext.destination);
					//this.currentAudioSource.loop = true;
					this.currentAudioSource.start(0);
					this.audioHardwareOffset=this.audioContext.currentTime;

					setInterval(this.cycleWave, 1)
					visualize(normalizeData(filterData(audioBuffer)))
				});
		};

		visualizeAudio('./assets/scattle.mp3')
	}
	

	cycleWave(): void {
		let index = Math.floor(this.getTime()/ this.currentVisualRatio)
		let value = this.currentAudioChunks ? this.currentAudioChunks[index] : undefined;
		/*if (tester && value && tester instanceof HTMLElement) {
			tester.style.transform = 'scale(1,' + value + ')';
			temp.currentAmp = value;
			//temp.currentTime = audioContext.currentTime;
			console.log('time', audioContext.currentTime)

		}*/
		//console.log(index,value,audioContext.currentTime)

	}
}
