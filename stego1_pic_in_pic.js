var coverImg = null;
var messageImg = null;
var compositeImg = null;
var uncompositeImg = null;

function loadCover(){
  var fsource = document.getElementById("cvr");
  var coverShow = document.getElementById("cover");
  coverImg = new SimpleImage(fsource);
  coverImg.drawTo(coverShow);
  compositeImg = new SimpleImage(fsource);
}

function loadMsg(){
  var fsource = document.getElementById("msg");
  var msgShow = document.getElementById("message");
  messageImg = new SimpleImage(fsource);
  messageImg.drawTo(msgShow);
}

function conceal(){
  var proceed=false;
  if(coverImg==null || !coverImg.complete()){
    alert("Cover image not ready.");
  }else if(messageImg==null || !messageImg.complete()){
    alert("Message image not ready.");
  }else{
    proceed = checkImageSizes();
  }
  if(proceed){
    uncompositeImg = new SimpleImage(document.getElementById("msg"));
    alert("Stego!");
    //Math.floor(val/16) and *16 for hide
    //%16 and *16 for extraction
    doStego();
  }
}

function doStego(){
  var bucket = new SimplePixel(coverImg,0,0);
  for(var pixel of messageImg.values()){
    bucket = compositePixels(coverImg.getPixel(pixel.getX(),pixel.getY()),pixel)
    compositeImg.setPixel(pixel.getX(),pixel.getY(),bucket);
  }
  compositeImg.drawTo(document.getElementById("composite"));
}

function extract(){
  if(uncompositeImg==null || !uncompositeImg.complete()){
    alert("Hide something first!");
  }else{
    undoStego();
  }
}

function undoStego(){
  var bucket = new SimplePixel(coverImg,0,0);
  for(var pixel of uncompositeImg.values()){
    bucket = uncompositePixel(compositeImg.getPixel(pixel.getX(),pixel.getY()));
    uncompositeImg.setPixel(pixel.getX(),pixel.getY(),bucket);
  }
  uncompositeImg.drawTo(document.getElementById("extracted"));
}

function compositePixels(pixCover,pixMessage){
  var bucketPix = new SimplePixel(coverImg,0,0)
  var cr=pixCover.getRed();
  var cg=pixCover.getGreen();
  var cb=pixCover.getBlue();
  var mr=pixMessage.getRed();
  var mg=pixMessage.getGreen();
  var mb=pixMessage.getBlue();
  bucketPix.setRed((Math.floor(cr/16))*16 + (Math.floor(mr/16)));
  bucketPix.setGreen((Math.floor(cg/16))*16 + (Math.floor(mg/16)));
  bucketPix.setBlue((Math.floor(cb/16))*16 + (Math.floor(mb/16)));
  return bucketPix;  
}

function uncompositePixel(pixel){
  var bucketPix = new SimplePixel(messageImg,0,0)
  var pr = pixel.getRed();
  var pg = pixel.getGreen();
  var pb = pixel.getBlue();
  bucketPix.setRed((pr%16)*16);
  bucketPix.setGreen((pg%16)*16);
  bucketPix.setBlue((pb%16)*16);
  return bucketPix;
}

function checkImageSizes(){
  var proceed=false;
  var warning="Cover image must not be smaller than the message image.";
  var cx = coverImg.getWidth();
  var cy = coverImg.getHeight();
  var mx = messageImg.getWidth();
  var my = messageImg.getHeight();
  var xOK = (cx>=mx);
  var yOK = (cy>=my);
  if(!xOK){
    warning+="\nCover width: " + cx + "px  Message width: " + mx + "px";
  }
  if(!yOK){
    warning+="\nCover height: " + cy + "px  Message height: " + my+ "px";
  }
  if(!xOK || !yOK){
    alert(warning);
    return false;
  }else{
    return true;
  }
}