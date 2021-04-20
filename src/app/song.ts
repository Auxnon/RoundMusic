export interface Song {
	id:number;
	artist:string;
	album?:string;
	name:string;
	url:string;
	length?:number;
	seek?:number;
	art?:string;
}
