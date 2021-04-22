import { Component, OnInit, ElementRef, HostListener, ViewChild, Input } from '@angular/core';
import { MusicService } from '../music.service';

@Component({
	selector: 'app-music-seeker',
	templateUrl: './music-seeker.component.html',
	styleUrls: ['./music-seeker.component.scss']
})
export class MusicSeekerComponent implements OnInit {

	@ViewChild('svgSeeker') svgSeeker?: ElementRef;
	@ViewChild('seekerCircle') seekerCircle?: ElementRef;
	@ViewChild('seekerTime') seekerTime?: ElementRef;
	/*@Input() mainElement?:ElementRef;*/

	svgSelected: boolean = false;
	wave={amp:0,offset:0,alt:false,dir:1}

	progress = { x: 0, y: 0, r: 0 };

	constructor(private musicService: MusicService) { }

	ngOnInit(): void {
	}
	ngAfterViewInit(): void {
		this.initVisualizer();
	}

	/*
		initButtons(){
				let buttonController = document.querySelector('.button-control-row')
		let playButton = document.querySelector('.button-play')
	
		let playing = false;
		playButton.addEventListener('click', ev => {
			//if(playButton.classList.contains('play-button--pause'))
			playing = !playing
			if (!playing) {
				speed = 0;
				amp = 0;
				renderProgressBar();
			}
			playButton.classList.toggle('button-play--pause')
		})
		let lastButton = document.querySelector('.button-last')
		let nextButton = document.querySelector('.button-next')
		lastButton.addEventListener('click', ev => {
			buttonController.style.animationName = ''
			void buttonController.offsetWidth;
			buttonController.style.animationName = 'left-button';
		})
		nextButton.addEventListener('click', ev => {
			buttonController.style.animationName = ''
			void buttonController.offsetWidth;
			buttonController.style.animationName = 'right-button';
	
		})
		}*/

	hookPointerDown(event: PointerEvent): void {
		this.svgSelected = true;
		this.adjustSeeker(event)
	}

	@HostListener('window:pointermove', ['$event'])
	hookPointerMove(event: PointerEvent): void {
		if (this.svgSelected) {
			this.adjustSeeker(event)
		}
		//console.log(r)
		//round.style.strokeDasharray = Math.floor(566 * v) + 'px ' + Math.floor(566 * end + 1) + 'px';

	}
	@HostListener('window:pointermove', ['$event'])
	hookPointerUp(event: PointerEvent): void {
		this.svgSelected = false;
	}

	adjustSeeker(event: PointerEvent) {

		if (this.svgSeeker) {
			let svg = this.svgSeeker.nativeElement;
			let x = event.clientX - svg.getBoundingClientRect().x;
			let y = event.clientY - svg.getBoundingClientRect().y;
			let r = Math.atan2(y, x - 180)
			this.drawCircle(r)
			this.progress.r = r;
			let end = r / Math.PI;
			let v = 1 - end;
		}
	}

	drawCircle(radians: number) {
		if (this.seekerCircle && this.svgSeeker && this.seekerTime) {
			let circle = this.seekerCircle.nativeElement
			let time = this.seekerTime.nativeElement;

			let cos = Math.cos(radians);
			let sin = Math.sin(radians);
			let tx = cos * 180 + 180 + 12
			let ty = sin * 180 + 12
			this.progress.x = tx;
			this.progress.y = ty;

			circle.setAttribute('cx', tx);
			circle.setAttribute('cy', ty);
			let rect = this.svgSeeker.nativeElement.getBoundingClientRect();
			let rect2 = rect;//mainElement.getBoundingClientRect();


			time.style.left = tx + rect.x - rect2.x + (cos * 30) + 'px'
			time.style.top = ty + rect.y + (sin * 30) + 'px'
			let elapsed = (1 - radians / Math.PI) * 3
			let min = Math.floor(elapsed)
			let secFactor = elapsed - min;
			let secs = "" + Math.floor(secFactor * 60);
			if (secs.length <= 1)
				secs = "0" + secs;
			let text = min + ":" + secs
			time.innerText = text;
			/*imgScaleTime++
			if (imgScaleTime >= 20) {
				imgScaleTime = 0;
				img.style.transform = 'scale(' + (1 + (amp / 720)) + ')'
			}*/
		}

	}

	drawProgressBar(): void {

		let waveHeight = speed * 120
		//let halfR=(1-progress.r)/2;

		let s = "M " + this.progress.x + " " + this.progress.y; //372 12"
		this.wave.amp += this.wave.dir * speed * 4;
		if (this.wave.amp >= waveHeight)
			this.wave.dir = -1;
		else if (amp <= 0)
			this.wave.dir = 1;

		this.wave.offset -= 0.01 * speed
		if (this.wave.offset < -ratio * 4) {
			this.wave.offset = 0;

		}

		let multiplier;
		for (let i = 0; i < 32; i++) {

			let r = Math.max(this.progress.r, this.wave.offset + i * ratio),
				x, y;
			multiplier = 1 - Math.abs(r - halfR) / halfR;

			if (i % 2 == 0) {
				s += "Q"
				x = calcCos(r, 180 + multiplier * (this.wave.alt ? -this.wave.amp : this.wave.amp)), y = calcSin(r, 180 + multiplier * (this.wave.alt ? -this.wave.amp : this.wave.amp))
				this.wave.alt = !this.wave.alt
			} else {
				x = calcCos(r, 180), y = calcSin(r, 180)
			}

			//half={x:p.x+(x-p.x)/2,y:p.y+(y-p.y)/2};


			s += " " + x + " " + y
			//p={x,y}

		}
		let end = Math.PI + this.wave.offset
		s += "Q " + calcCos(end, 180 + multiplier * (this.wave.alt ? -this.wave.amp : this.wave.amp)) + " " + calcSin(end, 180 + multiplier * (this.wave.alt ? -this.wave.amp : this.wave.amp)) + " 12 12"
		testPath.setAttribute('d', s);
	}


	initVisualizer() {
		let svg = this.svgSeeker.nativeElement;

		let svgSelected = false;
		let testPath = svg.children[1];
		let circle = svg.children[2];

		let time = document.querySelector('.time')


		let round = svg.children[1];
		//round.style.strokeDasharray=' 56px 4px';
		//let v = 1;
		//let dir = 1;
		/*
				setInterval(()=>{
					v-=0.01*dir
					if(v<=0){
						dir=-1
						v=0;
					}else if(v>=1){
						dir=-1;
						v=1;
					}
					let end=1-v;
					round.style.strokeDasharray=Math.floor(566*v)+'px '+Math.floor(566*end +1)+'px';
	
				},100)*/
		let ratio = Math.PI / 32;

		let p = { x: 0, y: 0 }
		let half = { x: 0, y: 0 }

		function calcCos(n, f) {
			return Math.cos(n) * f + 192
		}

		function calcSin(n, f) {
			return Math.sin(n) * f + 12
		}

		let speed = 0;
		let halfR = Math.PI / 2


		let alt = false;
		let amp = 0;
		let dir = 1;

		let offset = 0;
		let imgScaleTime = 0;



		setInterval(() => {
			if (playing) {
				progress.r -= 0.001
				speed = Math.random();
				renderCircle(progress.r)

			}
			if (playing || svgSelected)
				renderProgressBar();


		}, 1)
	}


}
