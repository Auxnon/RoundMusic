import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Song } from './song';

@Injectable({
	providedIn: 'root'
})

export class MusicService {
	FAUXLIST: Song[] = [
		{ id: 0, artist: 'Scattle', name: 'TimeLapse', url: 'scattle.mp3', art: 'scattle.jpg', length: 400 },
		{ id: 1, artist: 'ColdPlay', name: 'Viva La Vida', url: 'vivalavida.mp3', art: 'vivalavida.jpg', length: 180 }
	];

	currentSong?:Song;
	currentAmp: number = 0;
	currentTime: number = 0;
	currentDuration: number = 0;
	cycleInterval: number = 0;


	audioContext = new AudioContext();
	currentAudioBuffer?: AudioBuffer;
	currentAudioSource?: AudioBufferSourceNode;
	audioGainNode: GainNode = this.audioContext.createGain();

	audioHardwareOffset: number = 0;

	currentVisualRatio: number = 0;
	currentAudioChunks: number[] = [];
	peakData: number[] = [];

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
	getTime(): number {
		return this.audioContext.currentTime - this.audioHardwareOffset;
	}
	getTimeRatio() {
		let r = this.getTime() / this.currentDuration
		return (isNaN(r) || !isFinite(r) ? 0 : r);
	}
	getDuration(): number {
		return this.currentDuration;
	}
	getArt():string{
		return (this.currentSong && this.currentSong.art?this.currentSong.art:'purple.jpg');
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
			this.audioHardwareOffset = this.audioContext.currentTime - time;
		}
	}

	play(song: Song): void {
		let temp = this;//FIX
		this.playing = false;
		//window.AudioContext = window.AudioContext;// || window.webkitAudioContext;
		//this.audioContext;
		if (this.currentAudioSource) {
			this.currentAudioSource.stop(0);
			this.currentAudioSource.disconnect();
		}

		this.audioGainNode.gain.value = 0.05

		let currentBuffer = null;
		let timeRatio = 0;
		const peakData: number[] = [];

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
				let lastVal=0;
				let lastSlope=0;
				let peaked=0;
				for (let j = 0; j < blockSize; j++) {
					let v = Math.abs(rawData[blockStart + j])
					sum = sum + v;
					if (v > max)
						max = v;

					let peak=0
					let slope=v-lastVal;
					if(lastSlope>0){
						if(slope<0){

							//this.peak=1
							if(v>peaked)
								peaked=v;
						}
					}else{
						if(slope>0){
							//this.peak=1
						}
					}

					lastVal=v;
					lastSlope=slope;
				}
				let avg = sum / blockSize
				filteredData.push(avg); //max
				peakData.push(peaked);
			}
			return filteredData;

		};

		const normalizeData = (filteredData: number[]) => {
			const multiplier = Math.pow(Math.max(...filteredData), -1);
			return filteredData.map(n => n * multiplier);
		}

		const visualize = (buffer: number[]) => {
			//console.log(buffer)
			this.currentAudioChunks = buffer;
			this.playing = true;
			this.currentSong=song;
			this.peakData=peakData;
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
					this.audioHardwareOffset = this.audioContext.currentTime;

					this.cycleInterval = window.setInterval(() => { this.cycleWave(this) }, 1)
					visualize(normalizeData(filterData(audioBuffer)))
				});
		};

		visualizeAudio('./assets/' + song.url)
	}

	last:number=0;
	peak:number=0;
	lastSlope:number=0;
	cycleWave(serviceReference: MusicService): void {
		let index = Math.floor(serviceReference.getTime() / serviceReference.currentVisualRatio);
		let value = serviceReference.currentAudioChunks ? serviceReference.currentAudioChunks[index] : 0;
		serviceReference.currentAmp = value;
		/*let slope=value-this.last; //positive is upwards, negative is downwards
		if(this.lastSlope>0){
			if(slope<0){
				this.peak=1
			}else{
				this.peak=0
			}
		}else{
			if(slope>0){
				this.peak=1
			}else{
				this.peak=0
			}
		}
		this.last=value
		this.lastSlope=slope;*/
		this.peak=this.peakData[index]
		/*if (tester && value && tester instanceof HTMLElement) {
			tester.style.transform = 'scale(1,' + value + ')';
			temp.currentAmp = value;
			//temp.currentTime = audioContext.currentTime;
			console.log('time', audioContext.currentTime)

		}*/
		//console.log(index,value,audioContext.currentTime)

	}
	getPeak():number{
		return this.peak
	}
}
