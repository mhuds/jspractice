var originalImage=null;
var alteredImage=null;
var imgbuffer=[];

function loadNoResize(){
  var cnv = document.getElementById("cnvs");
  cnv.style.width="";
}

function loadImage(){
  var fsource = document.getElementById("thepicture");
  var cnv = document.getElementById("cnvs");
  originalImage = new SimpleImage(fsource);
  alteredImage = new SimpleImage(fsource);
  originalImage.drawTo(cnv);
  cnv.style.width="800px";
}

function makeGray(){
  var red=0;
  var green=0;
  var blue=0;
  var avg=0;
  for(var pixel of alteredImage.values()){
    red = pixel.getRed();
    green = pixel.getGreen();
    blue = pixel.getBlue();
    avg=(red+green+blue)/3;
    pixel.setRed(avg);
    pixel.setBlue(avg);
    pixel.setGreen(avg);
    alteredImage.setPixel(pixel.getX(),pixel.getY(),pixel);
  }
  alteredImage.drawTo(document.getElementById("cnvs"));
}

function makeRed(){
  var cnv = document.getElementById("cnvs");
  var avg=0;
  for(var pixel of alteredImage.values()){
    avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    if(avg<128){
      pixel.setRed(avg*2);
      pixel.setGreen(0);
      pixel.setBlue(0);
    }else{
      pixel.setRed(255);
      pixel.setGreen((1.5*avg)-255);
      pixel.setBlue((1.5*avg)-255);
    }
    alteredImage.setPixel(pixel.getX(),pixel.getY(),pixel);
  }
  alteredImage.drawTo(cnv);
}

function getRGB(pixel){
  var colors = [pixel.getRed(),pixel.getGreen(),pixel.getBlue()];
  return(colors);
}

function lowpass(){
  //todo prompt user for SEL size
  var SELsize=3; //3x3.  Works best with odd-numbers
  var redComposite=0;
  var greenComposite=0;
  var blueComposite=0;
  var colors=[];
  var offsetStart = Math.floor(SELsize/2);
  for(var pixel of alteredImage.values()){
    //pixel is our target.  look at neighboring pixels.
    var pixUsed=0;
    //yuck.  These nested loops are slooooooow
    for(var y =-offsetStart;y<(SELsize-offsetStart);y++){
      for(var x=-offsetStart;x<(SELsize-offsetStart);x++){
        if((pixel.getX()+x)>=0 && (pixel.getY()+y)>=0 && (pixel.getX()+x)<alteredImage.getWidth() && (pixel.getY()+y)<alteredImage.getHeight()){
          pixUsed++;
          colors = getRGB(alteredImage.getPixel(pixel.getX()+x,pixel.getY()+y))
          redComposite+=colors[0];
          greenComposite+=colors[1];
          blueComposite+=colors[2];
        }
      }
    }
    redComposite/=(pixUsed);
    greenComposite/=(pixUsed);
    blueComposite/=(pixUsed);
    pixel.setRed(redComposite);
    pixel.setGreen(greenComposite);
    pixel.setBlue(blueComposite);
    redComposite=0;
    greenComposite=0;
    blueComposite=0;
  }
  alteredImage.drawTo(document.getElementById("cnvs"));  
}

function highpass(){
  //Results are unsatisfying for high-res macro pictures.
  //todo prompt user for SEL size
  var SELsize=3; //3x3.  Works best with odd-numbers
  var WHO="";
  var redComposite=0;
  var greenComposite=0;
  var blueComposite=0;
  var temp=0;
  var colors=[];
  var offsetStart = Math.floor(SELsize/2);
  /*highpass is a little different.  We just say 0 for border-pixels.
  We also can't be lazy and just average the values.  Have
  to use the appropriate values from a legit kernel/SEL
  */
  var SEL = [[(-1/9),(-1/9),(-1/9)],[(-1/9),(8/9),(-1/9)],[(-1/9),(-1/9),(-1/9)]];
  //and so it begins
  WHO+="M";
  for(var pixel of alteredImage.values()){
    for(var y=-offsetStart;y<SELsize-offsetStart;y++){
      for(var x=-offsetStart;x<SELsize-offsetStart;x++){
        if((pixel.getX()+x)<0 || (pixel.getY()+y)<0 || (pixel.getX()+x)>=alteredImage.getWidth() || (pixel.getY()+y)>=alteredImage.getHeight()){
          colors=[0,0,0];
        }else{
          colors=getRGB(alteredImage.getPixel(pixel.getX()+x,pixel.getY()+y));
          redComposite+=(colors[0]*SEL[y+offsetStart][x+offsetStart])
          greenComposite+=(colors[1]*SEL[y+offsetStart][x+offsetStart])
          blueComposite+=(colors[2]*SEL[y+offsetStart][x+offsetStart])
        }
      }
    }
    pixel.setRed(redComposite);
    pixel.setGreen(greenComposite);
    pixel.setBlue(blueComposite);
    redComposite=0;
    greenComposite=0;
    blueComposite=0;
  }
  WHO+="H"
  alteredImage.drawTo(document.getElementById("cnvs"));
  console.log(WHO);
}

function reset(){
  if(!(originalImage==null)&&originalImage.complete()){
    var cnv = document.getElementById("cnvs");
    originalImage.drawTo(cnv);
    alteredImage = new SimpleImage(document.getElementById("thepicture"));
    cnv.style.width="800px";
  }  
}

function rainbow(){
  var sectionHeight = Math.floor(alteredImage.getHeight()/7);
  var avg=0;
  var current="";
  for(var pixel of alteredImage.values()){
    avg=(pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    if(pixel.getY()<1*sectionHeight){
      if(avg<128){
        pixel.setRed(2*avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      }else{
        pixel.setRed(255);
        pixel.setGreen((1.5*avg)-255)
        pixel.setBlue((1.5*avg)-255)
      }
    }else if(pixel.getY()>=1*sectionHeight && pixel.getY()<2*sectionHeight){
      if(avg<128){
        pixel.setRed(1.2*avg);
        pixel.setGreen(0.8*avg);
        pixel.setBlue(0);
      }else{
        pixel.setRed(255);
        pixel.setGreen((1.2*avg)-51)
        pixel.setBlue((2*avg)-255);
      }
    }else if(pixel.getY()>=2*sectionHeight && pixel.getY()<3*sectionHeight){
      if(avg<128){
        pixel.setRed(1.5*avg);
        pixel.setGreen(1.5*avg);
        pixel.setBlue(0);
      }else{
        pixel.setRed(255);
        pixel.setRed(255);
        pixel.setBlue((2*avg)-255);
      }
    }else if(pixel.getY()>=3*sectionHeight && pixel.getY()<4*sectionHeight){
      if(avg<128){
        pixel.setRed(0);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      }else{
        pixel.setRed((1.5*avg)-255);
        pixel.setGreen(255);
        pixel.setBlue((1.5*avg)-255);
      }
    }else if(pixel.getY()>=4*sectionHeight && pixel.getY()<5*sectionHeight){
      if(avg<128){
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      }else{
        pixel.setRed((2*avg)-255);
        pixel.setGreen((2*avg)-255);
        pixel.setBlue(255);
      }
    }else if(pixel.getY()>=5*sectionHeight && pixel.getY()<6*sectionHeight){
      if(avg<128){
        pixel.setRed(0.8*avg);
        pixel.setGreen(0);
        pixel.setBlue(1.2*avg);
      }else{
        pixel.setRed((1.2*avg)-51);
        pixel.setGreen((2*avg)-255);
        pixel.setBlue(255);
      }
    }else{
      //we're just going to assume 'violet' at this point
      if(avg<128){
        pixel.setRed(1.6*avg);
        pixel.setGreen(0);
        pixel.setBlue(1.6*avg);
      }else{
        pixel.setRed((0.4*avg)+153);
        pixel.setGreen((2*avg)-255);
        pixel.setBlue((0.4*avg)+153);
      }
    }
    alteredImage.setPixel(pixel.getX(),pixel.getY(),pixel);
  }
  alteredImage.drawTo(document.getElementById("cnvs"));
}