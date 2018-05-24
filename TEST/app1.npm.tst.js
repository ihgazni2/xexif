var xexif = require("xexif")
//1. load jpg/jpeg image file, return a arrayBuffer
var app1ArrayBuf = xexif.getArrayBufFromImgFile("./1.jpg")
//2. decode APP1(thigs include EXIF) to a stage-0 Dict
//   but this raw-data-dict is not good for reading/writing
var app1s0 = xexif.decodeAPP1(app1ArrayBuf)
//3. convert Dict of step3 to a more readable stage-1 Dict
var app1s1 = xexif.readable(app1s0)


//4.search a tag(loose mode)
xexif.search("GPS",app1s1)
//5.get a tag  via a exact tagName ,which could be find in step 4
xexif.get("GPSImgDirection",app1s1)


//6.doc for help and guide
//6.1 the APP1 SEG structure
xexif.listStructure()
//6.2 list all exif tags documented in DC-008-Translation-2016-E
xexif.listExifTags()
//6.3 explaination of the tag "Orientation"
xexif.man("Orientation")




