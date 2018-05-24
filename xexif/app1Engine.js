const utils = require('./utils.js')

const help = (tagName) => {
    let l1 = [IFD0Ref,ExifRef,GPSRef,InteroperabilityRef]
    let l2 = ['BYTE', 'ASCII', 'SHORT', 'LONG', 'RATIONAL', 'UNDEFINED', 'SLONG', 'SRATIONAL']
    for(var ref of l1) {
        for(var t of l2) {
            let strs = ref[t].TOSTR
            if(strs.hasOwnProperty(tagName)) {
                console.log(strs[tagName])
                console.log("--------------------------------\n")
            } else {
                
            }
            let expls = ref[t].EXPLANATION
            if(expls.hasOwnProperty(tagName)) {
                for (var e of expls[tagName]) {
                    console.log(e)
                    console.log("--------------------------------\n")
                }
            } else {
                
            }
            let st = ref[t].STANDARD 
            if(st.hasOwnProperty(tagName)) {
                console.log(st[tagName])
                console.log("--------------------------------\n")
            } else {
                
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////////

const PARAMS = {
    RATIONAL2FLOAT : true,
    SRATIONAL2FLOAT : true
}

const APEX = {
    "FNumber2ApertureValue" : function (FNumber) {
        return(Math.round(2 * Math.log2(FNumber)))
    },
    "ExposureTime2ShutterSpeedValue": function(exposureTime) {
        return(Math.round(-Math.log2(exposureTime)))
    },
    "FootLambert2BrightnessValue" : function(footLambert) {
        return(Math.round(Math.log2(footLambert)))
    },
}

//IFD0 TIFF IFD1 TIFF

const IFD0Ref = {
    "BYTE" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "ASCII" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "Copyright" : function (value,count) {
                let cr = {}
                let arr = value.split("\u0000")
                if(arr[0]===" ") {
                    cr["photographer"] = ""
                    cr["editor"] = arr[1]
                } else {
                    cr["photographer"] = arr[0]
                    cr["editor"] = arr[1]
                }
                return(cr)
            }
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SHORT" : {
        "STANDARD" : {
            "Compression" : "\n\
                    1.The compression scheme used for the image data\n\
                    2.When a primary image is JPEG compressed,\n\
                      this designation is not necessary.\n\
                      So, this tag shall not be recorded\n\
                    3.When thumbnails use JPEG compression,\n\
                      this tag value is set to 6.\n\
                    4.DC-008-Translation-2016-E: Page 29\n\
            ",
            "Orientation":"DC-008-Translation-2016-E: Page 30-35",
            "StripOffsets" :"\n\
                1. Count  = StripsPerImage (when PlanarConfiguration = 1)\n\
                         SamplesPerPixel * StripsPerImage (when PlanarConfiguration = 2)\n\
                   Type  = SHORT or LONG\n\
                2. DC-008-Translation-2016-E: Page 37\n\
            ",
            "RowsPerStrip" : "\n\
                The number of rows per strip.\n\
                This is the number of rows in the image of one strip\n\
                when an image is divided into strips.\n\
                In the case of JPEG compressed data,\n\
                this designation is not necessary.\n\
                So, this tag shall not be recorded..\n\
                See also RowsPerStrip and StripByteCounts.\n\
                Type  = SHORT or LONG\n\
            ",
            "StripByteCounts" :"\n\
                1. Count  = StripsPerImage (when PlanarConfiguration = 1)\n\
                         SamplesPerPixel * StripsPerImage (when PlanarConfiguration = 2)\n\
                2. DC-008-Translation-2016-E: Page 37\n\
            ",
            "ImageWidth" : "\n\
                The number of columns of image data,\n\
                equal to the number of pixels per row.\n\
                In JPEG compressed data, this tag shall not be used\n\
                because a JPEG marker is used instead of it.\n\
                Type  = SHORT or LONG\n\
            ",
            "ImageLength" : "\n\
                The number of rows of image data.\n\
                In JPEG compressed data,\n\
                this tag shall not be used\n\
                because a JPEG marker is used instead of it.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E,Page 29,\n\
            ",
        },
        "EXPLANATION":{
            "Orientation": [
                {
                    1 : "normal (raw same as visual)",
                    2 : "reverse-horizonally(from raw to visual)",
                    3 : "rotate-180(from raw to visual)",
                    4 : "reverse-vertically(from raw to visual)",
                    5 : "rotate-clockwise-90 and reverse-horizonally(from raw to visual)",
                    6 : "rotate-clockwise-90(from raw to visual)",
                    7 : "rotate-counter-clockwise-90 and reverse-horizonally(from raw to visual)",
                    8 : "rotate-counter-clockwise-90 (from raw to visual)"
                },
                {
                    1 : "The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side",
                    2 : "The 0th row is at the visual top of the image, and the  0th column is the visual right-hand side",
                    3 : "The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side",
                    4 : "The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side",
                    5 : "The 0th row is the visual left-hand side of the image, and the 0th column is the visual top",
                    6 : "The 0th row is the visual right-hand side of the image, and the 0th column is the visual top",
                    7 : "The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom",
                    8 : "The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom"
                }
            ],
        },
        "TOSTR": {
            "Compression" : {
                1  : "uncompressed",
                6  : "JPEG" 
            },
            "PhotometricInterpretation" : {
                2 : "RGB",
                6 : "YCbCr"
            },
            "Orientation" : {
                1 : "top-left",
                2 : "top-right",
                3 : "bot-right",
                4 : "bot-left",
                5 : "left-top",
                6 : "right-top",
                7 : "right-bot",
                8 : "left-bot"
            },
            "PlanarConfiguration" : {
                1 : "chunky",
                2 : "planar"
            },
            "YCbCrPositioning" : {
                1 : "centered",
                2 : "co-sited "
            },
            "ResolutionUnit" : {
                2 : "inches",
                3 : "centimeters"
            }
        },
        "DEFUNCS": {
            "Compression" : function (value,count) {
                return(IFD0Ref.SHORT.TOSTR.Compression[value[0].toString()])
            },
            "PhotometricInterpretation": function (value,count) {
                return(IFD0Ref.SHORT.TOSTR.PhotometricInterpretation[value[0].toString()])
            },
            "Orientation" : function (value,count) {
                return(IFD0Ref.SHORT.TOSTR.Orientation[value[0].toString()])
            },
            "PlanarConfiguration": function (value,count) {
                return(IFD0Ref.SHORT.TOSTR.PlanarConfiguration[value[0].toString()])
            },
            "YCbCrSubSampling": function (value,count) {
                let v1 = value[0]
                let v2 = value[1]
                if((v1==2) && (v2 ==1)) {
                    return("YCbCr4:2:2")
                } else if((v1==2) && (v2 ==2)) {
                    return("YCbCr4:2:0")
                } else {
                    return("reserved")
                }
            },
            "YCbCrPositioning" : function (value,count) {
                return(IFD0Ref.SHORT.TOSTR.YCbCrPositioning[value[0].toString()])
            },
            "ResolutionUnit": function (value,count) {
                return(IFD0Ref.SHORT.TOSTR.ResolutionUnit[value[0].toString()])
            },
            "ImageWidth" : function (value,count) {
                return(value[0])
            },
            "ImageLength" : function (value,count) {
                return(value[0])
            },
            "SamplesPerPixel" : function (value,count) {
                return(value[0])
            },
            "RowsPerStrip" : function (value,count) {
                return(value[0])
            }
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "LONG": {
        "STANDARD" : {
            "ImageWidth" : "\n\
                The number of columns of image data,\n\
                equal to the number of pixels per row.\n\
                In JPEG compressed data, this tag shall not be used\n\
                because a JPEG marker is used instead of it.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E,Page 29,\n\
            ",
            "ImageLength" : "\n\
                The number of rows of image data.\n\
                In JPEG compressed data,\n\
                this tag shall not be used\n\
                because a JPEG marker is used instead of it.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E,Page 29,\n\
            ",
            "StripOffsets" :"\n\
                1. Count  = StripsPerImage (when PlanarConfiguration = 1)\n\
                         SamplesPerPixel * StripsPerImage (when PlanarConfiguration = 2)\n\
                   Type  = SHORT or LONG\n\
                2. DC-008-Translation-2016-E: Page 37\n\
            ",
            "RowsPerStrip" : "\n\
                The number of rows per strip.\n\
                This is the number of rows in the image of one strip\n\
                when an image is divided into strips.\n\
                In the case of JPEG compressed data,\n\
                this designation is not necessary.\n\
                So, this tag shall not be recorded..\n\
                See also RowsPerStrip and StripByteCounts.\n\
                Type  = SHORT or LONG\n\
            ",
            "StripByteCounts" :"\n\
                1. Count  = StripsPerImage (when PlanarConfiguration = 1)\n\
                         SamplesPerPixel * StripsPerImage (when PlanarConfiguration = 2)\n\
                   Type  = SHORT or LONG\n\
                2. DC-008-Translation-2016-E: Page 37\n\
            ",
        },
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "ExifIFDPointer" : function (value,count) {
                return(value[0])
            },
            "GPSInfoIFDPointer" : function (value,count) {
                return(value[0])
            },
            "ImageWidth" : function (value,count) {
                return(value[0])
            },
            "ImageLength" : function (value,count) {
                return(value[0])
            },
            "RowsPerStrip" : function (value,count) {
                return(value[0])
            },
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "RATIONAL" : {
        "STANDARD" : {
            "XResolution":"\n\
                The number of pixels per ResolutionUnit in the ImageWidth direction.\n\
                When the image resolution is unknown, 72 [dpi] shall be designated.\n\
                DC-008-Translation-2016-E,Page 37\n\
            ",
            "YResolution":"\n\
                The number of pixels per ResolutionUnit in the ImageLength direction.\n\
                The same value as XResolution shall be designated.\n\
                DC-008-Translation-2016-E,Page 37\n\
            ",
        },
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "XResolution" : function(value,count){
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "YResolution" : function(value,count){
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "WhitePoint" : function(value,count){
                let wp = {}
                let x
                let y
                if(PARAMS.RATIONAL2FLOAT){
                    x = utils.rational2Float(value[0])
                    y = utils.rational2Float(value[1])
                } else {
                    x = value[0]
                    y = value[1]
                }
                wp["x"] = x
                wp["y"] = y
                return(wp)
            },
            "PrimaryChromaticities" : function(value,count){
                let pc = {}
                let rx,ry,gx,gy,bx,by
                if(PARAMS.RATIONAL2FLOAT){
                    rx = utils.rational2Float(value[0])
                    ry = utils.rational2Float(value[1])
                    gx = utils.rational2Float(value[2])
                    gy = utils.rational2Float(value[3])
                    bx = utils.rational2Float(value[4])
                    by = utils.rational2Float(value[5])
                } else {
                    rx = value[0]
                    ry = value[1]
                    gx = value[2]
                    gy = value[3]
                    bx = value[4]
                    by = value[5]
                }
                pc["rx"] = rx
                pc["ry"] = ry
                pc["gx"] = gx
                pc["gy"] = gy
                pc["bx"] = bx
                pc["by"] = by
                return(pc)
            },
            "YCbCrCoefficients" : function(value,count){
                let co = {}
                let rco,gco,bco
                if(PARAMS.RATIONAL2FLOAT){
                    rco = utils.rational2Float(value[0])
                    gco = utils.rational2Float(value[1])
                    bco = utils.rational2Float(value[2])
                } else {
                    rco = value[0]
                    gco = value[1]
                    bco = value[2]
                }
                co["r"] = rco
                co["g"] = gco
                co["b"] = bco
                return(co)
            },
            "ReferenceBlackWhite" : function(value,count){
                let rbw = []
                let a,b,c,d,e,f
                if(PARAMS.RATIONAL2FLOAT){
                    a = utils.rational2Float(value[0])
                    b = utils.rational2Float(value[1])
                    c = utils.rational2Float(value[2])
                    d = utils.rational2Float(value[3])
                    e = utils.rational2Float(value[4])
                    f = utils.rational2Float(value[5])
                } else {
                    a = value[0]
                    b = value[1]
                    c = value[2]
                    d = value[3]
                    e = value[4]
                    f = value[5]
                }
                rbw = [a,b,c,d,e,f]
                return(rbw)
            },
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "UNDEFINED" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SLONG" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SRATIONAL" : {
        "STANDARD" : {},
        "EXPLANATION":{
            
        },
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "addDeEntry" : function (type,name,func,TOSTRDesc,explanationArray,Standard) {
        if(TOSTRDesc === undefined) {
            
        } else {
            IFD0Ref[type]["TOSTR"][name] = TOSTRDesc
        }
        if(explanationArray === undefined) {
            
        } else {
            IFD0[type]["EXPLANATION"][name] = explanationArray
        }
        if(Standard === undefined) {
            
        } else {
            IFD0[type]["STANDARD"][name] = Standard
        }
        IFD0Ref[type]["DEFUNCS"][name] = func
    },
    "rmDeEntry" : function (type,name) {
        if(IFD0Ref[type]["TOSTR"].hasOwnProperty(name)){
            delete(IFD0Ref[type]["TOSTR"][name])
        } else {
            
        }
        if(IFD0[type]["EXPLANATION"].hasOwnProperty(name)){
            delete(IFD0[type]["EXPLANATION"][name])
        } else {
            
        }
        if(IFD0[type]["STANDARD"].hasOwnProperty(name)){
            delete(IFD0[type]["STANDARD"][name])
        } else {
            
        }
        if(IFD0Ref[type]["DEFUNCS"].hasOwnProperty(name)){
            delete(IFD0Ref[type]["DEFUNCS"][name])
        } else {
            
        }
    },
    "addEnEntry" : function () {},
    "rmEnEntry" : function () {},
    "add": function () {},
    "remove": function () {}
}

const IFD1Ref = function () {
    let ref = utils.deepCopyDict(IFD0Ref)
    ref.LONG.DEFUNCS = {
        "JPEGInterchangeFormat" : function (value,count) {
            return(value[0])
        },
        "JPEGInterchangeFormatLength" : function (value,count) {
            return(value[0])
        },
    }
    return(ref)
}()
//EXIF PRIVATE

const ExifRef = {
    "BYTE" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "ASCII" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SHORT" : {
        "STANDARD" : {
            "SensitivityType":"DC-008-Translation-2016-E: Page 53",
            "PixelXDimension":"\n\
                Information specific to compressed data.\n\
                When a compressed file is recorded,\n\
                the valid width of the meaningful image shall be recorded in this tag,\n\
                whether or not there is padding data or a restart marker.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E Page 45\n\
            ",
            "PixelYDimension":"\n\
                Information specific to compressed data.\n\
                When a compressed file is recorded,\n\
                the valid height of the meaningful image shall be recorded in this tag,\n\
                whether or not there is padding data or a restart marker.\n\
                This tag shall not exist in an uncompressed file.\n\
                For details see section 4.8.1 and Annex F.\n\
                Since data padding is unnecessary in the vertical direction,\n\
                the number of lines recorded in this valid image height tag\n\
                will in fact be the same as that recorded in the SOF.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E Page 45\n\
            ",
            "FocalLengthIn35mmFilm":"\n\
                This tag indicates the equivalent focal length assuming a 35mm film camera, in mm.\n\
                A value of 0  means the focal length is unknown.\n\
                Note that this tag differs from the FocalLength tag.\n\
                DC-008-Translation-2016-E,Page 64,\n\
            ",
            "SubjectLocation" : "\n\
                Indicates the location of the main subject in the scene.\n\
                The value of this tag represents the pixel at the center of\n\
                the main subject relative to the left edge,\n\
                prior to rotation processing as per the Rotation tag.\n\
                The first value indicates the X column number and\n\
                second indicates the Y row number.\n\
                When a camera records the main subject location,\n\
                it is recommended that the SubjectArea tag be used instead of this tag.\n\
                DC-008-Translation-2016-E,Page 61\n\
            ",
            "PhotographicSensitivity": "\n\
                This tag indicates the sensitivity of the camera or input device\n\
                when the image was shot.  More specifically,\n\
                it indicates one of the following values\n\
                that are parameters defined in ISO 12232:\n\
                standard output sensitivity (SOS),\n\
                recommended exposure index (REI), or ISO speed.\n\
                Accordingly, if a tag corresponding to a parameter\n\
                that is designated by a SensitivityType tag is recorded,\n\
                the values of the tag and of this PhotographicSensitivity tag\n\
                are the same.  However, if the value is 65535\n\
                (the maximum value of SHORT) or higher,\n\
                the value of this tag shall be 65535.\n\
                When recording this tag, the SensitivityType tag should also be recorded.\n\
                In addition, while “Count = Any”,\n\
                only 1 count should be used when recording this tag.\n\
                Note that this tag was referred to as “ISOSpeedRatings”\n\
                in versions of this standard up to Version 2.21.\n\
            "
        },
        "EXPLANATION":{
            "SensitivityType" :[ 
                {
                    0 : "Unknown",
                    1 : "Standard output sensitivity (SOS)",
                    2 : "Recommended exposure index (REI) ",
                    3 : "ISO speed",
                    4 : "Standard output sensitivity (SOS) and recommended exposure index (REI)",
                    5 : "Standard output sensitivity (SOS) and ISO speed ",
                    6 : "Recommended exposure index (REI) and ISO speed ",
                    7 : "Standard output sensitivity (SOS) and recommended exposure index (REI) and ISO speed"
                }
            ],
            "LightSource" : [
                {
                    0 : "Unknown",
                    1 : "Daylight",
                    2 : "Fluorescent",
                    3 : "Tungsten (incandescent light)",
                    4 : "Flash",
                    9 : "Fine weather",
                    10 : "Cloudy weather",
                    11 : "Shade",
                    12 : "Daylight fluorescent (D 5700 - 7100K)",
                    13 : "Day white fluorescent (N 4600 - 5400K)",
                    14 : "Cool white fluorescent (W 3900 - 4500K)",
                    15 : "White fluorescent (WW 3200 - 3700K)",
                    16 : "Warm white fluorescent (L 2600 - 3250K)",
                    17 : "Standard light A",
                    18 : "Standard light B",
                    19 : "Standard light C",
                    20 : "D55",
                    21 : "D65",
                    22 : "D75",
                    23 : "D50",
                    24 : "ISO studio tungsten",
                    255 : "Other"
                }
            ],
            "FLash" : [
                {
                    0x0000 : "Flash did not fire",
                    0x0001 : "Flash fired",
                    0x0005 : "Strobe return light not detected",
                    0x0007 : "Strobe return light detected",
                    0x0009 : "Flash fired, compulsory flash mode",
                    0x000D : "Flash fired, compulsory flash mode, return light not detected",
                    0x000F : "Flash fired, compulsory flash mode, return light detected",
                    0x0010 : "Flash did not fire, compulsory flash mode",
                    0x0018 : "Flash did not fire, auto mode",
                    0x0019 : "Flash fired, auto mode",
                    0x001D : "Flash fired, auto mode, return light not detected",
                    0x001F : "Flash fired, auto mode, return light detected",
                    0x0020 : "No flash function",
                    0x0041 : "Flash fired, red-eye reduction mode",
                    0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
                    0x0047 : "Flash fired, red-eye reduction mode, return light detected",
                    0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
                    0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                    0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                    0x0059 : "Flash fired, auto mode, red-eye reduction mode",
                    0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                    0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
                }
            ],
            "SensingMethod" : [
                {
                    1 : "Not defined",
                    2 : "One-chip color area sensor",
                    3 : "Two-chip color area sensor",
                    4 : "Three-chip color area sensor",
                    5 : "Color sequential area sensor",
                    7 : "Trilinear sensor",
                    8 : "Color sequential linear sensor"
                }
            ],
            "FileSource" : [
                {
                    0 : "others",
                    1 : "scanner of reflex type",
                    2 : "scanner of transparent type",
                    3 : "DSC(Digital still camera)"
                }
            ]
        },
        "TOSTR": {
            "ColorSpace" : {
                1 : "sRGB",
                65535 : "Uncalibrated"
            },
            "ExposureProgram" : {
                0 : "None",
                1 : "Manual",
                2 : "Normal",
                3 : "Aperture",
                4 : "Shutter",
                5 : "Creative",
                6 : "Action",
                7 : "Portrait",
                8 : "Landscape"
            },
            "SensitivityType" : {
                0 : "Unknown",
                1 : "SOS",
                2 : "REI",
                3 : "ISOSpeed",
                4 : "SOS-REI",
                5 : "SOS-ISOSpeed ",
                6 : "REI-ISOSpeed ",
                7 : "SOS-REI-ISOSpeed"
            },
            "MeteringMode" : {
                0 : "Unknown",
                1 : "Average",
                2 : "CenterWeightedAverage",
                3 : "Spot",
                4 : "MultiSpot",
                5 : "Pattern",
                6 : "Partial",
                255 : "Other"
            },
            "LightSource" : {
                0 : "Unknown",
                1 : "Daylight",
                2 : "Fluorescent",
                3 : "Tungsten",
                4 : "Flash",
                9 : "FineWeather",
                10 : "CloudyWeather",
                11 : "Shade",
                12 : "DaylightFluorescent",
                13 : "DayWhiteFluorescent",
                14 : "CoolWhiteFluorescent",
                15 : "WhiteFluorescent",
                16 : "WarmWhiteFluorescent",
                17 : "StandardLightA",
                18 : "StandardLightB",
                19 : "StandardLightC",
                20 : "D55",
                21 : "D65",
                22 : "D75",
                23 : "D50",
                24 : "ISOStudioTungsten",
                255 : "Other"
            },
            "SensingMethod" : {
                1 : "undefined",
                2 : "oneChipArea",
                3 : "twoChipArea",
                4 : "threeChipArea",
                5 : "colorSequentialArea",
                7 : "trilinear",
                8 : "colorSequentialLinear"
            },
            "SceneType" : {
                1 : "directlyPhotographed"
            },
            "CustomRendered" : {
                0 : "Normal",
                1 : "Custom"
            },
            "ExposureMode" : {
                0 : "Auto",
                1 : "Manual",
                2 : "AutoBracket"
            },
            "WhiteBalance" : {
                0:  "Auto",
                1:  "Manual"
            },
            "SceneCaptureType" : {
                0 : "Standard",
                1 : "Landscape",
                2 : "Portrait",
                3 : "Night"
            },
            "GainControl" : {
                0 : "None",
                1 : "LowGainUp",
                2 : "HighGainUp",
                3 : "LowGainDown",
                4 : "HighGainDown"
            },
            "Contrast" : {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            "Saturation" : {
                0: "Normal",
                1: "Low",
                2: "High"
            },
            "Sharpness" : {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            "SubjectDistanceRange" : {
                0 : "Unknown",
                1 : "Macro",
                2 : "Close",
                3 : "Distant"
            },
            "Flash" : {
                "fired": {
                    0:"None",
                    1:"fired"
                },
                "return" : {
                    0:  "None",
                    1:  "reserved",
                    2:  "strobeNotDetected",
                    3:  "strobeDected"
                },
                "mode" : {
                    0:  "unknown",
                    1:  "firing",
                    2:  "suppression",
                    3:  "auto"
                },
                "function" : {
                    0:  "present",
                    1:  "None"
                },
                "redEye" : {
                    0: "unknown",
                    1: "supported"
                }
            },
            "FocalPlaneResolutionUnit" : {
                2 : "inches",
                3 : "centimeters"
            }
        },
        "DEFUNCS": {
            "ColorSpace" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.ColorSpace[value[0].toString()])
            },
            "ExposureProgram" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.ExposureProgram[value[0].toString()])
            },
            "SensitivityType" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.SensitivityType[value[0].toString()])
            },
            "MeteringMode" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.MeteringMode[value[0].toString()])
            },
            "LightSource" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.LightSource[value[0].toString()])
            },
            "SensingMethod" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.SensingMethod[value[0].toString()])
            },
            "SceneType" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.SceneType[value[0].toString()])
            },
            "CustomRendered" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.CustomRendered[value[0].toString()])
            },
            "ExposureMode" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.ExposureMode[value[0].toString()])
            },
            "WhiteBalance" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.WhiteBalance[value[0].toString()])
            },
            "SceneCaptureType" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.SceneCaptureType[value[0].toString()])
            },
            "GainControl" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.GainControl[value[0].toString()])
            },
            "Contrast" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.Contrast[value[0].toString()])
            },
            "Saturation" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.Saturation[value[0].toString()])
            },
            "Sharpness" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.Sharpness[value[0].toString()])
            },
            "SubjectDistanceRange" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.SubjectDistanceRange[value[0].toString()])
            },
            "Flash" : function (value,count) {
                value = value[0].toString()
                let FlashRef = ExifRef.SHORT.TOSTR["Flash"]
                let fired = value & 1
                let rtrn = (value & 6 ) >> 1
                let mode = (value & 24) >> 3
                let func = (value & 32) >> 5
                let redEye = (value & 64) >> 6
                let rslt = {}
                rslt["fired"] = FlashRef["fired"][fired]
                rslt["return"] = FlashRef["return"][rtrn]
                rslt["mode"] = FlashRef["mode"][mode]
                rslt["function"] = FlashRef["function"][func]
                rslt["redEye"] = FlashRef["redEye"][redEye]
                return(rslt)
            },
            "SubjectArea" : function (value, count) {
                let rslt = {}
                switch(count){
                    case 2 : {
                        rslt["X"] = value[0].toString()
                        rslt["Y"] = value[1]
                    }
                    case 3 : {
                        rslt["circleCenterX"] = value[0].toString()
                        rslt["circleCenterY"] = value[1]
                        rslt["Diameter"] = value[2]
                    }
                    case 4 : {
                        rslt["rectCenterX"] = value[0].toString()
                        rslt["rectCenterY"] = value[1]
                        rslt["areaWidth"] = value[2]
                        rslt["areaHeight"] = value[3]
                    }
                }
                return(rslt)
            },
            "SubjectLocation" : function (value, count) {
                let rslt = {}
                rslt["X"] = value[0]
                rslt["Y"] = value[1]
                return(rslt)
            },
            "FocalPlaneResolutionUnit" : function (value,count) {
                return(ExifRef.SHORT.TOSTR.FocalPlaneResolutionUnit[value[0].toString()])
            },
            "FocalLengthIn35mmFilm" : function (value,count) {
                return(value[0].toString()+"@mm")
            },
            "PixelXDimension" : function (value,count) {
                return(value[0])
            },
            "PixelYDimension" : function (value,count) {
                return(value[0])
            },
            "PhotographicSensitivity" : function (value,count) {
                return(value[0])
            },
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "LONG": {
        "STANDARD" : {
            "PixelXDimension":"\n\
                Information specific to compressed data.\n\
                When a compressed file is recorded,\n\
                the valid width of the meaningful image shall be recorded in this tag,\n\
                whether or not there is padding data or a restart marker.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E Page 45\n\
            ",
            "PixelYDimension":"\n\
                Information specific to compressed data.\n\
                When a compressed file is recorded,\n\
                the valid height of the meaningful image shall be recorded in this tag,\n\
                whether or not there is padding data or a restart marker.\n\
                This tag shall not exist in an uncompressed file.\n\
                For details see section 4.8.1 and Annex F.\n\
                Since data padding is unnecessary in the vertical direction,\n\
                the number of lines recorded in this valid image height tag\n\
                will in fact be the same as that recorded in the SOF.\n\
                Type  = SHORT or LONG\n\
                DC-008-Translation-2016-E Page 45\n\
            "
        },
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "PixelXDimension" : function (value,count) {
                return(value[0])
            },
            "PixelYDimension" : function (value,count) {
                return(value[0])
            },
            "StandardOutputSensitivity" : function (value,count) {
                return(value[0])
            },
            "RecommendedExposureIndex" : function (value,count) {
                return(value[0])
            },
            "ISOSpeed" : function (value,count) {
                return(value[0])
            },
            "ISOSpeedLatitudeyyy" : function (value,count) {
                return(value[0])
            },
            "ISOSpeedLatitudezzz" : function (value,count) {
                return(value[0])
            },
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "RATIONAL" : {
        "STANDARD" : {
            "Gamma" : "\n\
                Indicates the value of coefficient gamma.\n\
                The formula of transfer function used for image\n\
                reproduction is expressed as follows\n\
                (Reproduced value) = (Input value) ** gamma\n\
            ",
            "FlashEnergy" : "\n\
                Indicates the strobe energy at the time the image is captured,\n\
                as measured in Beam Candle Power Seconds (BCPS).\n\
            ",
            "Acceleration" : "\n\
                 Acceleration (a scalar regardless of direction)\n\
                 as the ambient situation at the shot,\n\
                 for example the driving acceleration of the vehicle\n\
                 which the photographer rode on at the shot.\n\
                 The unit is mGal (10**-5 m/s2).\n\
                 If the denominator of the recorded value is FFFFFFFF.H,\n\
                 unknown shall be indicated.\n\
                 Obtaining method or accuracy is not stipulated.\n\
                 Therefore methods like that the photographer manually input the numeric,\n\
                 as an example, are usable.\n\
            ",
            "FlashEnergy" : "\n\
                Indicates the strobe energy at the time the image is captured,\n\
                as measured in Beam Candle Power Seconds (BCPS).\n\
            ",
        },
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "Gamma" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "CompressedBitsPerPixel" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "ExposureTime" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@seconds")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit" : "seconds"
                        }
                    )
                }
            },
            "FNumber" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "ApertureValue": function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "MaxApertureValue": function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "SubjectDistance" : function (value,count) {
                if(value[0].numerator === 0xffffffff) {
                    return("infinity")
                } else if(value[0].numerator === 0) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@m")
                    } else {
                        return(
                            {
                                "value": value[0],
                                "unit" : "m"
                            }
                        )
                    }
                }
            },
            "FocalLength" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@mm")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit" : "mm"
                        }
                    )
                }
            },
            "FlashEnergy" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@BCPS")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit" : "BCPS"
                        }
                    )
                }
            },
            "FocalPlaneXResolution" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "FocalPlaneYResolution" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "ExposureIndex" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "DigitalZoomRatio" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "Acceleration" : function (value,count) {
                if(value[0].denominator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@mGal")
                    } else {
                        return(
                            {
                                "value": value[0],
                                "unit" : "mGal"
                            }
                        )
                    }
                }
            },
            "LensSpecification" : function (value,count) {
                let rslt
                if(PARAMS.RATIONAL2FLOAT){
                    rslt = {
                      'minFocalLength' : utils.rational2Float(value[0]).toString()+"@mm",
                      'maxFocalLength' : utils.rational2Float(value[1]).toString()+"@mm",
                      'minFNumInMin' : utils.rational2Float(value[2]),
                      'minFNumInMax' : utils.rational2Float(value[3])
                    }
                    if(isNaN(value[2])) {
                        rslt['minFNumInMin'] = "unknown"
                    } else {
                        
                    }
                    if(isNaN(value[3])) {
                        rslt['minFNumInMax'] = "unknown"
                    } else {
                        
                    }
                } else {
                    rslt = {
                      'minFocalLength' : value[0],
                      'maxFocalLength' : value[1],
                      'minFNumInMin' : value[2],
                      'minFNumInMax' : value[3]
                    }
                    if(value[2].denominator === 0) {
                        rslt['minFNumInMin'] = "unknown"
                    } else {
                        
                    }
                    if(value[3].denominator === 0) {
                        rslt['minFNumInMax'] = "unknown"
                    } else {
                        
                    }
                    rslt['focalLengthUnit'] = "mm"
                }
                return(rslt)
            }
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "UNDEFINED" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{
            "ComponentsConfiguration" : {
                0:"None",
                1:"Y",
                2:"Cb",
                3:"Cr",
                4:"R",
                5:"G",
                6:"B"
            },
            "UserComment" : {
                '\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000':"Undefined",
                'ASCII\u0000\u0000\u0000':"ASCII",
                'JIS\u0000\u0000\u0000\u0000':"JIS",
                'UNICODE\u0000':"Unicode"
            },
            "CFAPattern" : {
                0 :  "RED",
                1 :  "GREEN",
                2 :  "BLUE",
                3 :  "CYAN",
                4 :  "MAGENTA",
                5 :  "YELLOW",
                6 :  "WHITE"
            },
            "FileSource" : {
                0 : "others",
                1 : "reflex",
                2 : "transparent",
                3 : "DSC"
            }
        },
        "DEFUNCS":{
            "ExifVersion" : function (value,count) {
                let ver = utils.arrayBuf2Latin1Str(value).split("").join(".")
                return(ver)
            },
            "FlashpixVersion" : function (value,count) {
                let ver = utils.arrayBuf2Latin1Str(value).split("").join(".")
                return(ver)
            },
            "ComponentsConfiguration" : function (value,count) {
                let ComponentsConfigurationRef = ExifRef.UNDEFINED.TOSTR["ComponentsConfiguration"]
                let arr = new Uint8Array(value)
                arr = arr.filter(ele=>(ele>0))
                arr = Array.from(arr)
                arr = arr.map(
                        (ele) => {
                            let k = ele.toString()
                            return(ComponentsConfigurationRef[k])
                        }
                    )
                let s = arr.join("")
                return(s)
            },
            "UserComment" : function (value,count,subType) {
                let UserCommentRef = ExifRef.UNDEFINED.TOSTR["UserComment"]
                let iconv;
                try {
                  iconv = require('iconv-lite');
                } catch(err) {
                  console.log(err)
                  console.log("require iconv-lite to  none-ascii encoding")
                }
                if(subType === undefined) {
                    subType = 'utf8'
                } else {
                    
                }
                let charCode = utils.arrayBuf2Latin1Str(value.slice(0,8));
                charCode = UserCommentRef[charCode]
                let uc = {}
                uc['charCode'] = charCode
                uc['value'] = value.slice(8)
                switch(charCode) {
                    case "ASCII" : {
                        uc['value'] = utils.arrayBuf2Latin1Str(uc['value'])
                        break;
                    }
                    case "JIS" : {
                        if (iconv!==undefined) {
                          uc['value'] = iconv.decode(utils.arrayBuf2Buf(uc['value']), 'shift-jis');
                        } else {
                            
                        }
                        break;
                    }
                    case "Unicode" : {
                        if(iconv!==undefined) {
                            uc['unicode-type'] = subType
                            uc['value'] = iconv.decode(utils.arrayBuf2Buf(uc['value']), subType);
                        } else {
                            
                        }
                        break;
                    }
                    case  "Undefined" : {
                        break;
                    }
                    default : {
                        
                    }
                }
                return(uc)
            },
            "OECF" : function(value,count,bigEndian) {
                let dv = new DataView(value)
                let ptr = 0
                let colsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let rowsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let colitemnames = []
                let c = 0
                let sbuf = ""
                let ch;
                while(c<colsnum){
                    let chnum = dv.getUint8(ptr)
                    let notNUL = !(chnum === 0)
                    if(notNUL){
                        ch = String.fromCharCode(chnum)
                        sbuf = sbuf + ch
                    } else {
                        colitemnames.push(sbuf)
                        sbuf = ""
                        c = c + 1
                    }
                    ptr = ptr + 1
                }
                let valueMat = Array(rowsnum).fill([])
                for(let i=0;i<rowsnum;i++){
                    for(let j=0;j<colsnum;j++) {
                        //(y,x) (col,row),先列坐标,然后行坐标
                        let col = value.getInt32(ptr,!bigEndian)
                        let row = value.getInt32(ptr+4,!bigEndian)
                        ele = {}
                        ele['row'] = row
                        ele['col'] = col
                        valueMat[i].push(ele)
                        ptr = ptr + 8
                    }
                }
                let rslt = {}
                rslt['colsnum'] = colsnum
                rslt['rowsnum'] = rowsnum
                rslt['colitemnames'] = colitemnames
                rslt['value'] = valueMat
                return(rslt)
            },
            "SpatialFrequencyResponse" : function (value,count,bigEndian) {
                let dv = new DataView(value)
                let ptr = 0
                let colsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let rowsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let colitemnames = []
                let c = 0
                let sbuf = ""
                let ch;
                while(c<colsnum){
                    let chnum = dv.getUint8(ptr)
                    let notNUL = !(chnum === 0)
                    if(notNUL){
                        ch = String.fromCharCode(chnum)
                        sbuf = sbuf + ch
                    } else {
                        colitemnames.push(sbuf)
                        sbuf = ""
                        c = c + 1
                    }
                    ptr = ptr + 1
                }
                let valueMat = Array(rowsnum).fill([])
                for(let i=0;i<rowsnum;i++){
                    for(let j=0;j<colsnum;j++) {
                        let col = value.getUInt32(ptr,!bigEndian)
                        let row = value.getUInt32(ptr+4,!bigEndian)
                        ele = {}
                        ele['row'] = row
                        ele['col'] = col
                        valueMat[i].push(ele)
                        ptr = ptr + 8
                    }
                }
                let rslt = {}
                rslt['colsnum'] = colsnum
                rslt['rowsnum'] = rowsnum
                rslt['colitemnames'] = colitemnames
                rslt['value'] = valueMat
                return(rslt)
            },
            "CFAPattern" : function (value,count,bigEndian) {
                let CFAPatternRef = ExifRef.UNDEFINED.TOSTR["CFAPattern"]
                let dv = new DataView(value)
                let ptr = 0
                let colsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let rowsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let valueMat = Array(rowsnum).fill([])
                for(let i=0;i<rowsnum;i++){
                    for(let j=0;j<colsnum;j++) {
                        let ele = value.getUint8(ptr,!bigEndian)
                        let color = CFAPatternRef[ele]
                        valueMat[i].push(color)
                        ptr = ptr + 1
                    }
                }
                let rslt = {}
                rslt['horizonalUnitsNum'] = colsnum
                rslt['verticalUnitsNum'] = rowsnum
                rslt['value'] = valueMat
                return(rslt)
            },
            "DeviceSettingDescription" : function (value,count,bigEndian,subType) {
                let iconv;
                try {
                  iconv = require('iconv-lite');
                } catch(err) {
                  console.log(err)
                  console.log("require iconv-lite to  none-ascii encoding")
                }
                if(subType === undedined) {
                    subType = 'utf8'
                } else {
                    
                }
                let dv = new DataView(value)
                let ptr = 0
                let colsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let rowsnum = dv.getUint16(ptr,!bigEndian)
                ptr = ptr + 2
                let settings = []
                let c = 0 
                let si = ptr;
                let sbuf;
                while(c<dv.byteLength){
                    let chnum = dv.getUint8(ptr)
                    let notNUL = !(chnum === 0)
                    if(notNUL){
                        
                    } else {
                        sbuf = dv.buffer.slice(si,ptr)
                        sbuf = iconv.decode(utils.arrayBuf2Buf(sbuf), 'ucs2')
                        settings.push(sbuf)
                        c = c + 1
                        si = ptr + 1
                    }
                    ptr = ptr + 1
                }
                let rslt = {}
                rslt['colsnum'] = colsnum
                rslt['rowsnum'] = rowsnum
                rslt['settings'] = settings
                return(rslt)
            },
            "FileSource" : function (value,count) {
                let dv = new DataView(value)
                let seq = dv.getUint8()
                return(ExifRef.UNDEFINED.TOSTR.FileSource[seq.toString()])
            },
        
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SLONG" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SRATIONAL" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "ShutterSpeedValue" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "BrightnessValue" : function (value,count) {
                if(value[0].numerator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]))
                    } else {
                        return(value[0])
                    }
                }
            },
            "ExposureBiasValue" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "Temperature" : function (value,count) {
                if(value[0].denominator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@C")
                    } else {
                        return(
                            {
                                "value" : value[0],
                                "unit"  : "C"
                            }
                        )
                    }
                }
            },
            "Humidity" : function (value,count) {
                if(value[0].denominator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@%")
                    } else {
                        return(
                            {
                                "value" : value[0],
                                "unit"  : "%"
                            }
                        )
                    }
                }
            },
            "Pressure" : function (value,count) {
                if(value[0].denominator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@hPa")
                    } else {
                        return(
                            {
                                "value" : value[0],
                                "unit"  : "hPa"
                            }
                        )
                    }
                }
            },
            "WaterDepth" : function (value,count) {
                if(value[0].denominator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@m")
                    } else {
                        return(
                            {
                                "value" : value[0],
                                "unit"  : "m"
                            }
                        )
                    }
                }
            },
            "CameraElevationAngle" : function (value,count) {
                if(value[0].denominator === 0xffffffff) {
                    return("unknown")
                } else {
                    if(PARAMS.RATIONAL2FLOAT){
                        return(utils.rational2Float(value[0]).toString()+"@degree")
                    } else {
                        return(
                            {
                                "value" : value[0],
                                "unit"  : "degree"
                            }
                        )
                    }
                }
            },
        },        
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "addDeEntry" : function (type,name,func,toStrDesc,explanationArray,Standard) {
        if(toStrDesc === undefined) {
            
        } else {
            ExifRef[type]["toStr"][name] = toStrDesc
        }
        if(explanationArray === undefined) {
            
        } else {
            ExifRef[type]["EXPLANATION"][name] = explanationArray
        }
        if(Standard === undefined) {
            
        } else {
            ExifRef[type]["STANDARD"][name] = Standard
        }
        ExifRef[type]["DEFUNCS"][name] = func
    },
    "rmDeEntry" : function (type,name) {
        if(ExifRef[type]["toStr"].hasOwnProperty(name)){
            delete(ExifRef[type]["toStr"][name])
        } else {
            
        }
        if(ExifRef[type]["EXPLANATION"].hasOwnProperty(name)){
            delete(ExifRef[type]["EXPLANATION"][name])
        } else {
            
        }
        if(ExifRef[type]["STANDARD"].hasOwnProperty(name)){
            delete(ExifRef[type]["STANDARD"][name])
        } else {
            
        }
        if(ExifRef[type]["DEFUNCS"].hasOwnProperty(name)){
            delete(ExifRef[type]["DEFUNCS"][name])
        } else {
            
        }
    },
    "addEnEntry" : function () {},
    "rmEnEntry" : function () {},
    "add": function () {},
    "remove": function () {}
}


//GPS

const GPSRef = {
    "BYTE" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{
            "GPSAltitudeRef" : {
                0: "aboveSeaLevel",
                1: "belowSeaLevel"
            }
        },
        "DEFUNCS":{
            "GPSVersionID" : function (value,count) {
                let dv = new DataView(value)
                let ptr = 0
                let sbuf = ""
                sbuf = sbuf + dv.getUint8(ptr).toString()
                sbuf = sbuf +"."
                sbuf = sbuf + dv.getUint8(ptr+1).toString()
                sbuf = sbuf +"."
                sbuf = sbuf + dv.getUint8(ptr+2).toString()
                sbuf = sbuf +"."
                sbuf = sbuf + dv.getUint8(ptr+3).toString()
                return(sbuf)
            },
            "GPSAltitudeRef" : function (value,count) {
                let dv = new DataView(value)
                value = dv.getUint8(0)
                return(GPSRef.BYTE.DEFUNCS.GPSAltitudeRef[value])
            }
        },
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "ASCII" : {
        "STANDARD" : {},
        "EXPLANATION":{
            "GPSMeasureMode" : [
                {
                    '2' : "2-dimensional measurement", 
                    '3' : "3-dimensional measurement" 
                }
            ],
            "GPSSpeedRef" : [
                {
                    'K' : "Kilometers per hour", 
                    'M' : "Miles per hour", 
                    'N' : "Knots"
                }
            ],
            "GPSTrackRef" : [
                {
                    'T' : "True direction",
                    'M' : "Magnetic direction" 
                }
            ],
            "GPSImgDirectionRef" : [
                {
                    'T' : "True direction",
                    'M' : "Magnetic direction" 
                }
            ],
            "GPSDestLatitudeRef" : [
                {
                    'N' : "North latitude", 
                    'S' : "South latitude" 
                }
            ],
            "GPSDestLongitudeRef" : [
                {
                    'E' : "East longitude",
                    'W' : "West longitude" 
                }
            ],
            "GPSDestLatitudeRef" : [
                {
                    'N' : "North latitude", 
                    'S' : "South latitude"
                }
            ],
            "GPSDestBearingRef" : [
                {
                    'T' : "True direction",
                    'M' : "Magnetic direction" 
                }
            ],
            "GPSDestDistanceRef" : [
                {
                    'K'  : "Kilometers", 
                    'M'  : "Miles",
                    'N'  : "Nautical miles" 
                }
            ]
        },
        "TOSTR": {
            "GPSLatitudeRef" : {
                "N": "northLat",
                "S": "southLat"
            },
            "GPSLongitudeRef" : {
                "E": "eastLon",
                "W": "westLon"
            },
            "GPSStatus" : {
                "A" : "inProgress",
                "V" : "interrupted"
            },
            "GPSMeasureMode" : {
                "2" : "2D",
                "3" : "3D"
            },
            "GPSSpeedRef" : {
                'K' : "kilometersPerHour", 
                'M' : "milesPerHour", 
                'N' : "knots"
            },
            "GPSTrackRef" : {
                'T' : "True",
                'M' : "Magnetic" 
            },
            "GPSImgDirectionRef" : {
                'T' : "True",
                'M' : "Magnetic" 
            },
            "GPSDestLatitudeRef" : {
                'N' : "northLat", 
                'S' : "southLat" 
            },
            "GPSDestLongitudeRef" : {
                "E": "eastLon",
                "W": "westLon"
            },
            "GPSDestBearingRef" : {
                'T' : "True",
                'M' : "Magnetic" 
            },
            "GPSDestDistanceRef" : {
                'K'  : "kilometers", 
                'M'  : "miles",
                'N'  : "nauticalMiles" 
            }
        },
        "DEFUNCS":{
            "GPSLatitudeRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSLatitudeRef[value])
            },
            "GPSLongitudeRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSLongitudeRef[value])
            },
            "GPSStatus" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSStatus[value])
            },
            "GPSMeasureMode" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSMeasureMode[value])
            },
            "GPSSpeedRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSSpeedRef[value])
            },
            "GPSTrackRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSTrackRef[value])
            },
            "GPSImgDirectionRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSImgDirectionRef[value])
            },
            "GPSDestLatitudeRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSDestLatitudeRef[value])
            },
            "GPSDestLongitudeRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSDestLongitudeRef[value])
            },
            "GPSDestBearingRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSDestBearingRef[value])
            },
            "GPSDestDistanceRef" : function(value,count) {
                return(GPSRef.ASCII.TOSTR.GPSDestDistanceRef[value])
            },
        },
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SHORT" : {
        "STANDARD" : {
            "GPSDOP" : "\n\
                1.Indicates the GPS DOP (data degree of precision).\n\
                2.An HDOP value is written during two-dimensional measurement,\n\
                  and PDOP during three-dimensional measurement.\n\
                3.DC-008-Translation-2016-E,Page 74,Line 10\n\
            "
        },
        "EXPLANATION" : {
            "GPSDifferential" : [
                {
                    0 : "Measurement without differential correction",
                    1 : "Differential correction applied" 
                }
            ]
        },
        "TOSTR": {
            "GPSDifferential" : {
                0 : "withoutCorrection",
                1 : "correctionApplied" 
            }
        },
        "DEFUNCS": {
            "GPSDifferential" : function (value,count) {
                return(GPSRef.SHORT.TOSTR.GPSDifferential[value[0].toString()])
            }
        },
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "LONG": {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "RATIONAL" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{
            "GPSLatitude" : function(value,count){
                let lat = {}
                let dd,mm,ss
                if(PARAMS.RATIONAL2FLOAT){
                    dd = utils.rational2Float(value[0])
                    mm = utils.rational2Float(value[1])
                    ss = utils.rational2Float(value[2])
                } else {
                    dd = value[0]
                    mm = value[1]
                    ss = value[2]
                }
                lat["dd"] = dd
                lat["mm"] = mm
                lat["ss"] = ss
                return(lat)
            },
            "GPSLongitude" : function(value,count){
                let lon = {}
                let dd,mm,ss
                if(PARAMS.RATIONAL2FLOAT){
                    dd = utils.rational2Float(value[0])
                    mm = utils.rational2Float(value[1])
                    ss = utils.rational2Float(value[2])
                } else {
                    dd = value[0]
                    mm = value[1]
                    ss = value[2]
                }
                lon["dd"] = dd
                lon["mm"] = mm
                lon["ss"] = ss
                return(lon)
            },
            "GPSAltitude" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "GPSTimeStamp" : function(value,count){
                let ts = {}
                let hour,minute,second
                if(PARAMS.RATIONAL2FLOAT){
                    hour = utils.rational2Float(value[0])
                    minute = utils.rational2Float(value[1])
                    second = utils.rational2Float(value[2])
                } else {
                    hour = value[0]
                    minute = value[1]
                    second = value[2]
                }
                ts["hour"] = hour
                ts["minute"] = minute
                ts["second"] = second
                return(ts)
            },
            "GPSDOP" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "GPSSpeed" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "GPSTrack" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@degree")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit": "degree"
                        }
                    )
                }
            },
            "GPSDestLatitude" : function(value,count){
                let lat = {}
                let dd,mm,ss
                if(PARAMS.RATIONAL2FLOAT){
                    dd = utils.rational2Float(value[0])
                    mm = utils.rational2Float(value[1])
                    ss = utils.rational2Float(value[2])
                } else {
                    dd = value[0]
                    mm = value[1]
                    ss = value[2]
                }
                lat["dd"] = dd
                lat["mm"] = mm
                lat["ss"] = ss
                return(lat)
            },
            "GPSDestLongitude" : function(value,count){
                let lon = {}
                let dd,mm,ss
                if(PARAMS.RATIONAL2FLOAT){
                    dd = utils.rational2Float(value[0])
                    mm = utils.rational2Float(value[1])
                    ss = utils.rational2Float(value[2])
                } else {
                    dd = value[0]
                    mm = value[1]
                    ss = value[2]
                }
                lon["dd"] = dd
                lon["mm"] = mm
                lon["ss"] = ss
                return(lon)
            },
            "GPSDestBearing" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@degree")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit": "degree"
                        }
                    )
                }
            },
            "GPSDestDistance" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]))
                } else {
                    return(value[0])
                }
            },
            "GPSHPositioningError" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@m")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit": "m"
                        }
                    )
                }
            },
            "GPSImgDirection" : function (value,count) {
                if(PARAMS.RATIONAL2FLOAT){
                    return(utils.rational2Float(value[0]).toString()+"@degree")
                } else {
                    return(
                        {
                            "value": value[0],
                            "unit": "degree"
                        }
                    )
                }
            },
        },
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "UNDEFINED" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{
            "GPSProcessingMethod" : {
                
            },
            "GPSAreaInformation" : {
                
            }
        },
        "DEFUNCS":{
            "GPSProcessingMethod" : function(value,count) {
                let charCodeRef = GPSRef.UNDEFINED.TOSTR.GPSProcessingMethod
                if(utils.dictLength(charCodeRef) === 0) {
                    return(utils.arrayBuf2Latin1Str(value))
                } else {
                    let iconv;
                    try {
                      iconv = require('iconv-lite');
                      let dv = new DataView(value)
                      let seq = dv.getUint8(0)
                      let codec = charCodeRef[seq]
                      let sbuf = value.slice(1)
                      let s = iconv.decode(utils.arrayBuf2Buf(sbuf), codec)
                      return(s)
                    } catch(err) {
                      console.log(err)
                      console.log("require iconv-lite to  none-ascii encoding")
                    }
                }
            },
            "GPSAreaInformation" : function(value,count) {
                let charCodeRef = GPSRef.UNDEFINED.TOSTR.GPSAreaInformation
                if(utils.dictLength(charCodeRef) === 0) {
                    return(utils.arrayBuf2Latin1Str(value))
                } else {
                    let iconv;
                    try {
                      iconv = require('iconv-lite');
                      let dv = new DataView(value)
                      let seq = dv.getUint8(0)
                      let codec = charCodeRef[seq]
                      let sbuf = value.slice(1)
                      let s = iconv.decode(utils.arrayBuf2Buf(sbuf), codec)
                      return(s)
                    } catch(err) {
                      console.log(err)
                      console.log("require iconv-lite to  none-ascii encoding")
                    }
                }
            }
        },
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SLONG" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SRATIONAL" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "addDeEntry" : function (type,name,func,TOSTRDesc,explanationArray,Standard) {
        if(TOSTRDesc === undefined) {
            
        } else {
            GPSRef[type]["TOSTR"][name] = TOSTRDesc
        }
        if(explanationArray === undefined) {
            
        } else {
            GPSRef[type]["EXPLANATION"][name] = explanationArray
        }
        if(Standard === undefined) {
            
        } else {
            GPSRef[type]["STANDARD"][name] = Standard
        }
        GPSRef[type]["DEFUNCS"][name] = func
    },
    "rmDeEntry" : function (type,name) {
        if(GPSRef[type]["TOSTR"].hasOwnProperty(name)){
            delete(GPSRef[type]["TOSTR"][name])
        } else {
            
        }
        if(GPSRef[type]["EXPLANATION"].hasOwnProperty(name)){
            delete(GPSRef[type]["EXPLANATION"][name])
        } else {
            
        }
        if(GPSRef[type]["STANDARD"].hasOwnProperty(name)){
            delete(GPSRef[type]["STANDARD"][name])
        } else {
            
        }
        if(GPSRef[type]["DEFUNCS"].hasOwnProperty(name)){
            delete(GPSRef[type]["DEFUNCS"][name])
        } else {
            
        }
    },
    "addEnEntry" : function () {},
    "rmEnEntry" : function () {},
    "add": function () {},
    "remove": function () {}
}

//Interoperability

const InteroperabilityRef = {
    "BYTE" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "ASCII" : {
        "STANDARD" : {},
        "EXPLANATION":{
            "InteroperabilityIndex" : [
                {
                    "R98" : "Indicates a file conforming to R98 file specification of Recommended Exif\n\
                             Interoperability Rules (Exif R 98) or to DCF basic file stipulated by Design\n\
                             Rule for Camera File System.",
                    "THM" : "Indicates a file conforming to DCF thumbnail file stipulated by Design rule\n\
                             for   Camera File System.",
                    "R03" : "Indicates a file conforming to DCF Option File stipulated by Design rule for\n\
                             Camera File System." 
                }
            ]
        },
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SHORT" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR": {},
        "DEFUNCS": {},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "LONG": {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "RATIONAL" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "UNDEFINED" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SLONG" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "SRATIONAL" : {
        "STANDARD" : {},
        "EXPLANATION":{},
        "TOSTR":{},
        "DEFUNCS":{},
        "FROMSTR":{},
        "ENFUNCS":{}
    },
    "addDeEntry" : function (type,name,func,TOSTRDesc,explanationArray,Standard) {
        if(TOSTRDesc === undefined) {
            
        } else {
            InteroperabilityRef[type]["TOSTR"][name] = TOSTRDesc
        }
        if(explanationArray === undefined) {
            
        } else {
            InteroperabilityRef[type]["EXPLANATION"][name] = explanationArray
        }
        if(Standard === undefined) {
            
        } else {
            InteroperabilityRef[type]["STANDARD"][name] = Standard
        }
        InteroperabilityRef[type]["DEFUNCS"][name] = func
    },
    "rmDeEntry" : function (type,name) {
        if(InteroperabilityRef[type]["TOSTR"].hasOwnProperty(name)){
            delete(InteroperabilityRef[type]["TOSTR"][name])
        } else {
            
        }
        if(InteroperabilityRef[type]["EXPLANATION"].hasOwnProperty(name)){
            delete(InteroperabilityRef[type]["EXPLANATION"][name])
        } else {
            
        }
        if(InteroperabilityRef[type]["STANDARD"].hasOwnProperty(name)){
            delete(InteroperabilityRef[type]["STANDARD"][name])
        } else {
            
        }
        if(InteroperabilityRef[type]["DEFUNCS"].hasOwnProperty(name)){
            delete(InteroperabilityRef[type]["DEFUNCS"][name])
        } else {
            
        }
    },
    "addEnEntry" : function () {},
    "rmEnEntry" : function () {},
    "add": function () {},
    "remove": function () {}
}


//

module.exports = {
    PARAMS:PARAMS,
    APEX:APEX,
    IFD0Ref:IFD0Ref,
    IFD1Ref:IFD1Ref,
    ExifRef:ExifRef,
    GPSRef:GPSRef,
    InteroperabilityRef:InteroperabilityRef,
    help:help
}

