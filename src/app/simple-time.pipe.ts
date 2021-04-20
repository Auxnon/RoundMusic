import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleTime'
})
export class SimpleTimePipe implements PipeTransform {

  transform(value: number | undefined): unknown {
  	if(value==undefined){
  		return '--:--';
  	}
  	let st='';

  	let hours=Math.floor(value/3600);

  	let minutes=Math.floor(value/60)%60;
  	//console.log(hours,minutes)

  	if(hours>0){
  		st+=hours+":";
  		if((''+minutes).length<2)
  			st+='0';
  	}
  	
  	
  	let seconds= ''+Math.floor(value%60);
  	if(minutes>0|| hours>0){
  		st+=minutes+":"
  		if(seconds.length<2)
  			st+="0"
  	}
  	st+=seconds;
    return st;
  }

}
