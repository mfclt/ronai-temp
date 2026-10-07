const assert=require('node:assert'),C=require('../core.js');
// Deliberately displace lower-right light into the gap outside its nominal window.
const cfg={digits:1,corners:[[0,0],[99,0],[99,199],[0,199]],threshold:.3,image_size:[100,200],digitBoxes:[[0,0,100,200]]};
const flat={width:100,height:200,data:new Uint8ClampedArray(100*200*4)};
C.segmentRegions(cfg)[0].forEach((b,i)=>{let box=b.map(Math.round);if(i===5){box[0]-=17;box[2]-=17;}for(let y=box[1];y<box[3];y++)for(let x=box[0];x<box[2];x++){let j=(y*100+x)*4;flat.data[j]=30;flat.data[j+1]=230;flat.data[j+2]=30;flat.data[j+3]=255;}});
const fit=C.fitSegments([flat,flat],cfg);assert(fit.segmentConfirmed[0][5]);assert(fit.segmentBoxes[0][5][0]<=64,'lower-right must move left');const blank={...flat,data:new Uint8ClampedArray(flat.data.length)};assert(C.fitSegments([blank,blank],cfg).segmentConfirmed.flat().every(v=>!v));assert.throws(()=>C.validate({...cfg,segmentBoxes:[[[0,0,1,1]]]},100,200));console.log('Displaced lower-right, unobserved segments, malformed config: PASS');
