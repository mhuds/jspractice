var coverImg = null;
var hideImg = null;

function splayPixel(pixel){
  var pr = pixel.getRed();
  var pg = pixel.getGreen();
  var pb = pixel.getBlue();
  var retA = [pr,pg,pb];
  return(retA);
}

function splitBits(value){
  var MSB = (Math.floor(value/16)*16);
  var LSB = value-MSB;
  return[MSB,LSB];
}

function parityPrecheck(pixel){
  var splayed = splayPixel(pixel);
  //returned is [R,G,B]  at this point, G^B should not == R
  if((LSB(splayed[0])^LSB(splayed[1]))==LSB(splayed[2])){
    splayed[2]+=1;
    pixel.setBlue(splayed[2]);
  }
  hideImg.setPixel(pixel.getX(),pixel.getY(),pixel);
}

function LSB(value){
  return(value%16);
}

function MSB(value){
  return(Math.floor(value/16)*16);
}

function hideMessage(){
  hideImg = new SimpleImage(coverImg.getWidth(),coverImg.getHeight());
  //Make sure image won't give false positives
  for (var pixel of coverImg.values()){
    parityPrecheck(pixel);
  }
  //do the hiding thing
  var secret = document.getElementById("secret").value;
  hideText(secret);
  hideImg.drawTo(document.getElementById("coverHiding"));
}

function loadCover(){
  var fsource = document.getElementById("fcover");
  coverImg = new SimpleImage(fsource);
  coverImg.drawTo(document.getElementById("coverClean"))
}

function hideText(string_secret){
  var xmax = hideImg.getWidth()-1;
  var ymax = hideImg.getHeight()-1;
  var curx =0;
  var cury=0;
  var hr = 0;
  var hg = 0;
  var hb =0;
  for(var i=0;i<string_secret.length;i++){
    var cur_char=splitBits(string_secret.charCodeAt(i));
    //now we have ASCII MSB at cur_char[0] and LSB at cur_char[1]
    //for this time around, we need to shift MSB to the right
    cur_char[0]=cur_char[0]/16;
    var parity = cur_char[0]^cur_char[1];  //XOR ftw
    var target_pixel = hideImg.getPixel(curx,cury);
    var splayed = splayPixel(target_pixel);
    hr = MSB(splayed[0]) + cur_char[0];
    hg = MSB(splayed[1]) + cur_char[1];
    hb = MSB(splayed[2]) + parity;
    target_pixel.setRed(hr);
    target_pixel.setGreen(hg);
    target_pixel.setBlue(hb);
    hideImg.setPixel(curx,cury,target_pixel);
    if((curx+1)>xmax){
      cury++;
      curx=0;
    }else{
      curx++;
    }
  }
}

function extractMsg(){
  var message = "";
  var tr=0;
  var tg=0;
  var tb=0;
  var hiddenchar="";
  for(var pixel of hideImg.values()){
    var splayed = splayPixel(pixel);
    tr = LSB(splayed[0]);
    tg = LSB(splayed[1]);
    tb = LSB(splayed[2]);
    if((tr^tg)==tb){
      tr*=16;
      hiddenchar = String.fromCharCode(tr+tg);
      message+=hiddenchar;
    }
  }
  alert(message);
}