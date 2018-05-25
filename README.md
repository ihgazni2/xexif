# xexif
>__handle EXIF of jpg/jpeg, based on Exif2.31 2016__

# Install

>__npm install xexif__


## Usage
-------------------------------------------------------

        var xexif = require("xexif")
__1. load jpg/jpeg image file, return a arrayBuffer__  

        var app1ArrayBuf = xexif.getArrayBufFromImgFile("./1.jpg")  
__2. decode APP1(thigs include EXIF) to a stage-0 Dict,but this raw-data-dict is not good for reading/writing__

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


## STANDARDS

_(Exchangeable image file format for digital still cameras: Exif Version 2.31 )_

---------------------------------------------------------------------------------------
[Exif 2.31](http://www.cipa.jp/std/documents/e/DC-008-Translation-2016-E.pdf)  

---------------------------------------------------------------------------------------

## PACKAGE DEPENDANY
_(optional)_

---------------------------------------------------------
[iconv-lite](https://www.npmjs.com/package/iconv-lite)

----------------------------------------------------------

## CODE REFERENCE
_(thanks to these two great projects)_

------------------------------------------------------------------
[1. ExifTool by Phil Harvey](http://owl.phy.queensu.ca/~phil/exiftool)  
[2. exif-js](https://github.com/exif-js/exif-js)

--------------------------------------------------------------------


## SOFTWARE REFERENCE

----------------------------------------
[MagicEXIF](http://www.magicexif.com/)  

----------------------------------------


## USEAGE SCREENSHOOTS

----------------------------------------------

        var xexif = require("xexif")
        var app1ArrayBuf = xexif.getArrayBufFromImgFile("./1.jpg")
        var app1s0 = xexif.decodeAPP1(app1ArrayBuf)
        var app1s1 = xexif.readable(app1s0)
        app1s1

![](/Images/app1s1.0.png)
![](/Images/app1s1.1.png)
![](/Images/app1s1.2.png)

        xexif.search("GPS",app1s1)
        xexif.get("GPSImgDirection",app1s1)
        
![](/Images/search_and_get.0.png)  

        xexif.listStructure()

![](/Images/listStructure.0.png)

        xexif.listExifTags()

![](/Images/listExifTags.0.png)

        xexif.man("Orientation")

![](/Images/man_Orientation.0.png)

----------------------------------------------


## TODO
-----------------------------------------------
__1.write exif__<br>
__2.encoder__<br>
__3.MakerNote__<br>

-----------------------------------------------

