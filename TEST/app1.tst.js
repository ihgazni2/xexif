var segsDecoder = require('./segsDecoder.js')
var app1Engine = require('./app1Engine.js')
var app1Decoder = require('./app1Decoder.js')
var app1Reader = require('./app1Reader.js')



//1. load jpg/jpeg image file, return a arrayBuffer 
var app1ArrayBuf = segsDecoder.getArrayBufFromImgFile("./1.jpg")
//2. decode APP1(thigs include EXIF) to a stage-0 Dict
//   but this raw-data-dict is not good for reading/writing
var app1s0 = app1Decoder.decodeAPP1(app1ArrayBuf)
//3. convert Dict of step3 to a more readable stage-1 Dict
var app1s1 = app1Reader.readable(app1s0)


//4.search a tag(loose mode) 
app1Reader.search("GPS")
//5.get a tag  via a exact tagName ,which could be find in step 4
app1Reader.get("GPSImgDirection")


//6. doc for help and guide 
var app1Doc = require('./app1Doc.js')
//6.1 the APP1 SEG structure
app1Doc.listStructure()
//6.2 list all exif tags documented in DC-008-Translation-2016-E
app1Doc.listExifTags()
//6.3 explaination of the tag "Orientation"
app1Doc.man("Orientation")

