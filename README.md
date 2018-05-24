# xexif
>__handle EXIF of jpg/jpeg__

# Install

>__npm install xexif__


## Usage
-------------------------------------------------------

    var xexif = require("xexif")
__1. load jpg/jpeg image file, return a arrayBuffer__  

    var app1ArrayBuf = xexif.getArrayBufFromImgFile("./1.jpg")  
__2. decode APP1(thigs include EXIF) to a stage-0 Dict<br>but this raw-data-dict is not good for reading/writing__

    var app1s0 = xexif.decodeAPP1(app1ArrayBuf)
__3. convert Dict of step3 to a more readable stage-1 Dict__

    var app1s1 = xexif.readable(app1s0)    
__4.search a tag(loose mode)__  

    xexif.search("GPS",app1s1)
__5.get a tag  via a exact tagName ,which could be find in step 4__

    xexif.get("GPSImgDirection",app1s1)
-------------------------------------------------------

## Doc Help Man
-------------------------------------------------------
__6.doc for help and guide__  

###### __6.1 the APP1 SEG structure__  

    xexif.listStructure()
###### __6.2 list all exif tags documented in DC-008-Translation-2016-E__  

    xexif.listExifTags()
###### __6.3 explaination of the tag "Orientation"__

    xexif.man("Orientation")
-------------------------------------------------------

