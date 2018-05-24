const utils = require("./utils.js")
//LE in buf  by default
//> app1DV.getUint16(0,true)
//30789  '0x7845'
//> app1DV.getUint16(0,false)
//17784   '0x4578'
//> utils.arrayBuf2Buf(app1DV.buffer.slice(0,2))
//<Buffer 45 78>
//>


//endian
const endianRef =  {
    "II" : "LE",
    "MM" : "BE",
}

const endianRefMD =  {
    "LE":"II",
    "BE":"MM",
}

const isBigEndian = (byteOrder) => {
    if(byteOrder==="MM") {
        return(true)
    } else {
        return(false)
    }
}

//type
const typeRef = {
    "BYTE":1,   
    "ASCII":2,    
    "SHORT":3, 
    "LONG":4,
    "RATIONAL":5,
    "UNDEFINED":7,
    "SLONG":9,
    "SRATIONAL":10 
}

const typeRefMD = {
    1 : "BYTE",   
    2 : "ASCII",    
    3 : "SHORT", 
    4 : "LONG",
    5 : "RATIONAL",
    7 : "UNDEFINED",
    9 : "SLONG",
    10: "SRATIONAL" 
}


//bytes-count
const ifdBytsCountRef = {
    "BYTE":1,   
    "ASCII":1,    
    "SHORT":2, 
    "LONG":4,
    "RATIONAL":8,
    "UNDEFINED":1,
    "SLONG":4,
    "SRATIONAL":8 
}

const getIFDbytsCount = (count,type,bigEndian) => {
    return(count*ifdBytsCountRef[type])
}

//


//DC-008-Translation-2016-E
//Page 91
//B.  APP1 Interoperability structure 
const initAPP1 = (app1DV,APP1) => {
    let cursor = 0
    APP1["exifIDCode"] =  utils.latin1StrFromDV(app1DV,cursor,4)
    cursor = cursor+4
    APP1["padding"] = app1DV.buffer.slice(cursor,cursor+2)
    cursor = cursor+2
    return(cursor)
}


/*
DC-008-Translation-2016-E
Page 19
Table 1 TIFF Headers 
*/
const getAPP1TIFFHeader = (APP1,app1DV,cursor) => {
    APP1["tiffHeader"] = {}
    //TIFFHeader ------
    APP1["tiffHeader"]["byteOrder"] = utils.latin1StrFromDV(app1DV,cursor,2)
    cursor = cursor+2
    APP1["tiffHeader"]['fixed'] = app1DV.buffer.slice(cursor,cursor+2)
    cursor = cursor+2
    let bigEndian = isBigEndian(APP1["tiffHeader"]['byteOrder'])
    APP1["tiffHeader"]["0thIFDOffset"] = app1DV.getUint32(cursor,!bigEndian)
    cursor = cursor + 4
    cursor = cursor + APP1["tiffHeader"]["0thIFDOffset"] - 8
    return(cursor)
}

//


//need to handle counts
const decodeIFDValue = (value,count,type,bigEndian) => {
    let rslt = value
    value = new DataView(value)
    switch(type){
        case "BYTE":{
            break;
        }
        case "ASCII":{
            rslt = utils.latin1StrFromDV(value,0,value.byteLength-1)
            break;
        }
        case "SHORT":{
            rslt = []
            for(let i = 0;i<count;i++){
                let ele = value.getUint16(i*2,!bigEndian)
                rslt.push(ele)
            }
            break;
        }
        case "LONG":{
            rslt = []
            for(let i = 0;i<count;i++){
                let ele = value.getUint32(i*4,!bigEndian)
                rslt.push(ele)
            }
            break;
        }
        case "RATIONAL":{
            rslt = []
            for(let i = 0;i<count;i++){
                let numerator = value.getUint32(i*8,!bigEndian)
                let denominator = value.getUint32(i*8+4,!bigEndian)
                ele = {}
                ele['numerator'] = numerator
                ele['denominator'] = denominator
                rslt.push(ele)
            }
            break;
        }
        case "UNDEFINED":{
            break;
        }
        case "SLONG":{
            rslt = []
            for(let i = 0;i<count;i++){
                let ele = value.getInt32(i*4,!bigEndian)
                rslt.push(ele)
            }
            break;
        }
        case "SRATIONAL":{
            rslt = []
            for(let i = 0;i<count;i++){
                let numerator = value.getInt32(i*8,!bigEndian)
                let denominator = value.getInt32(i*8+4,!bigEndian)
                ele = {}
                ele['numerator'] = numerator
                ele['denominator'] = denominator
                rslt.push(ele)
            }
            break;
        }
        default : {
            
        }
    }
    return(rslt)
}

const decodeIFD = (refMD,container,app1DV,cursor,bigEndian) => {
    let tagNum = app1DV.getUint16(cursor,!bigEndian)
    let tag;
    if(refMD.hasOwnProperty(tagNum)) {
        tag = refMD[tagNum]
    } else {
        tag = tagNum
    }
    cursor = cursor + 2
    //
    let typeNum = app1DV.getUint16(cursor,!bigEndian)
    let type = typeRefMD[typeNum]
    cursor = cursor + 2
    let count = app1DV.getUint32(cursor,!bigEndian)
    let bytsCount = getIFDbytsCount(count,type)
    cursor = cursor + 4
    //
    let value;
    let offset;
    if(bytsCount<=4){
        //In cases where the value fits in 4 Bytes, the value itself is recorded
        //If the value is smaller than 4 Bytes
        //the value is stored in the 4-Byte area starting from the left, 
        //i.e., from the lower end of the byte offset area.
        // For example, in big endian format, 
        //if the type is SHORT and the value is 1, it is recorded as 00010000.H. 
        offset = cursor
        value = app1DV.buffer.slice(cursor,cursor+bytsCount)
    } else {
        //This tag records the offset 
        //from the start of the TIFF header to the position 
        //where the value itself is recorded.
        offset = app1DV.getUint32(cursor,!bigEndian)
        //6 exifIDCode.length + padding.length
        value = app1DV.buffer.slice(offset+6,offset+6+bytsCount)
    }
    cursor = cursor + 4
    //
    value = decodeIFDValue(value,count,type,bigEndian)
    //
    container[tag] = {}
    container[tag]['type'] = type
    container[tag]['count'] = count
    container[tag]['bytsCount'] = bytsCount
    container[tag]['offset'] = offset
    container[tag]['value'] = value
    return(cursor)
}

//IFD0  tags 
const ifd0TagsRef = {
    'TransferFunction': 301,
    'WhitePoint': 318,
    'PrimaryChromaticities': 319,
    'JPEGInterchangeFormat': 513,
    'JPEGInterchangeFormatLength': 514,
    'YCbCrCoefficients': 529,
    'YCbCrSubSampling': 530,
    'YCbCrPositioning': 531,
    'ReferenceBlackWhite': 532,
    'ImageWidth': 256,
    'ImageLength': 257,
    'BitsPerSample': 258,
    'Compression': 259,
    'PhotometricInterpretation': 262,
    'ImageDescription': 270,
    'Make': 271,
    'Model': 272,
    'StripOffsets': 273,
    'Orientation': 274,
    'SamplesPerPixel': 277,
    'RowsPerStrip': 278,
    'StripByteCounts': 279,
    'XResolution': 282,
    'YResolution': 283,
    'PlanarConfiguration': 284,
    'ResolutionUnit': 296,
    'Software': 305,
    'DateTime': 306,
    'Artist': 315,
    'Copyright': 33432,
    'ExifIFDPointer': 34665,
    'GPSInfoIFDPointer': 34853,
    'PrintImageMatching': 50341,
    'DocumentName': 269,
    'PageName': 285,
    'XPosition': 286,
    'YPosition': 287,
    'T4Options': 292,
    'T6Options': 293,
    'PageNumber': 297,
    'Predictor': 317,
    'HalftoneHints': 321,
    'TileWidth': 322,
    'TileLength': 323,
    'TileOffsets': 324,
    'TileByteCounts': 325,
    'BadFaxLines': 326,
    'CleanFaxData': 327,
    'ConsecutiveBadFaxLines': 328,
    'SubIFDs': 330,
    'InkSet': 332,
    'InkNames': 333,
    'NumberOfInks': 334,
    'DotRange': 336,
    'TargetPrinter': 337,
    'SampleFormat': 339,
    'SMinSampleValue': 340,
    'SMaxSampleValue': 341,
    'TransferRange': 342,
    'ClipPath': 343,
    'XClipPathUnits': 344,
    'YClipPathUnits': 345,
    'Indexed': 346,
    'JPEGTables': 347,
    'OPIProxy': 351,
    'GlobalParametersIFD': 400,
    'ProfileType': 401,
    'FaxProfile': 402,
    'CodingMethods': 403,
    'VersionYear': 404,
    'ModeNumber': 405,
    'Decode': 433,
    'DefaultImageColor': 434,
    'JPEGProc': 512,
    'JPEGRestartInterval': 515,
    'JPEGLosslessPredictors': 517,
    'JPEGPointTransforms': 518,
    'JPEGQTables': 519,
    'JPEGDCTables': 520,
    'JPEGACTables': 521,
    'StripRowCounts': 559,
    'XMP': 700,
    'ImageID': 32781,
    'ImageLayer': 34732
}

const ifd0TagsRefMD = {
    301: 'TransferFunction',
    318: 'WhitePoint',
    319: 'PrimaryChromaticities',
    513: 'JPEGInterchangeFormat',
    514: 'JPEGInterchangeFormatLength',
    529: 'YCbCrCoefficients',
    530: 'YCbCrSubSampling',
    531: 'YCbCrPositioning',
    532: 'ReferenceBlackWhite',
    256: 'ImageWidth',
    257: 'ImageLength',
    258: 'BitsPerSample',
    259: 'Compression',
    262: 'PhotometricInterpretation',
    270: 'ImageDescription',
    271: 'Make',
    272: 'Model',
    273: 'StripOffsets',
    274: 'Orientation',
    277: 'SamplesPerPixel',
    278: 'RowsPerStrip',
    279: 'StripByteCounts',
    282: 'XResolution',
    283: 'YResolution',
    284: 'PlanarConfiguration',
    296: 'ResolutionUnit',
    305: 'Software',
    306: 'DateTime',
    315: 'Artist',
    33432: 'Copyright',
    34665: 'ExifIFDPointer',
    34853: 'GPSInfoIFDPointer',
    50341: 'PrintImageMatching',
    269: 'DocumentName',
    285: 'PageName',
    286: 'XPosition',
    287: 'YPosition',
    292: 'T4Options',
    293: 'T6Options',
    297: 'PageNumber',
    317: 'Predictor',
    321: 'HalftoneHints',
    322: 'TileWidth',
    323: 'TileLength',
    324: 'TileOffsets',
    325: 'TileByteCounts',
    326: 'BadFaxLines',
    327: 'CleanFaxData',
    328: 'ConsecutiveBadFaxLines',
    330: 'SubIFDs',
    332: 'InkSet',
    333: 'InkNames',
    334: 'NumberOfInks',
    336: 'DotRange',
    337: 'TargetPrinter',
    339: 'SampleFormat',
    340: 'SMinSampleValue',
    341: 'SMaxSampleValue',
    342: 'TransferRange',
    343: 'ClipPath',
    344: 'XClipPathUnits',
    345: 'YClipPathUnits',
    346: 'Indexed',
    347: 'JPEGTables',
    351: 'OPIProxy',
    400: 'GlobalParametersIFD',
    401: 'ProfileType',
    402: 'FaxProfile',
    403: 'CodingMethods',
    404: 'VersionYear',
    405: 'ModeNumber',
    433: 'Decode',
    434: 'DefaultImageColor',
    512: 'JPEGProc',
    515: 'JPEGRestartInterval',
    517: 'JPEGLosslessPredictors',
    518: 'JPEGPointTransforms',
    519: 'JPEGQTables',
    520: 'JPEGDCTables',
    521: 'JPEGACTables',
    559: 'StripRowCounts',
    700: 'XMP',
    32781: 'ImageID',
    34732: 'ImageLayer'
}


//
/*DC-008-Translation-2016-E
Page 85
Table 21  Tag Support Levels (5)  - 1st IFD TIFF Tag - 
IFD1 tags
*/

const ifd1TagsRef = {
    'ImageWidth': 256,
    'ImageLength': 257,
    'BitsPerSample': 258,
    'Compression': 259,
    'PhotometricInterpretation': 262,
    'ImageDescription': 270,
    'Make': 271,
    'Model': 272,
    'StripOffsets': 273,
    'Orientation': 274,
    'SamplesPerPixel': 277,
    'RowsPerStrip': 278,
    'StripByteCounts': 279,
    'XResolution': 282,
    'YResolution': 283,
    'PlanarConfiguration': 284,
    'ResolutionUnit': 296,
    'TransferFunction': 301,
    'Software': 305,
    'DateTime': 306,
    'Artist': 315,
    'WhitePoint': 318,
    'PrimaryChromaticities': 319,
    'JPEGInterchangeFormat': 513,
    'JPEGInterchangeFormatLength': 514,
    'YCbCrCoefficients': 529,
    'YCbCrSubSampling': 530,
    'YCbCrPositioning': 531,
    'ReferenceBlackWhite': 532,
    'Copyright': 33432,
    'GPSInfoIFDPointer': 34853,
    'ExifIFDPointer': 34665
}

const ifd1TagsRefMD = {
    256: 'ImageWidth',
    257: 'ImageLength',
    258: 'BitsPerSample',
    259: 'Compression',
    262: 'PhotometricInterpretation',
    270: 'ImageDescription',
    271: 'Make',
    272: 'Model',
    273: 'StripOffsets',
    274: 'Orientation',
    277: 'SamplesPerPixel',
    278: 'RowsPerStrip',
    279: 'StripByteCounts',
    282: 'XResolution',
    283: 'YResolution',
    284: 'PlanarConfiguration',
    296: 'ResolutionUnit',
    301: 'TransferFunction',
    305: 'Software',
    306: 'DateTime',
    315: 'Artist',
    318: 'WhitePoint',
    319: 'PrimaryChromaticities',
    513: 'JPEGInterchangeFormat',
    514: 'JPEGInterchangeFormatLength',
    529: 'YCbCrCoefficients',
    530: 'YCbCrSubSampling',
    531: 'YCbCrPositioning',
    532: 'ReferenceBlackWhite',
    33432: 'Copyright',
    34853: 'GPSInfoIFDPointer',
    34665: 'ExifIFDPointer'
}

const getIFDs = (APP1,app1DV,cursor,seq,tagsRefMD) => {
    let bigEndian = isBigEndian(APP1["tiffHeader"]['byteOrder'])
    APP1["IFD"+seq+"sNum"] = app1DV.getUint16(cursor,!bigEndian)
    cursor = cursor + 2
    APP1["IFD"+seq+"s"] = {}
    for (var i=0;i<APP1["IFD"+seq+"sNum"];i++) {
        cursor = decodeIFD(tagsRefMD,APP1["IFD"+seq+"s"],app1DV,cursor,bigEndian)
    }
    return(cursor)
}
//






//
/*
DC-008-Translation-2016-E
Page 80
Table 16  Interoperability IFD Attribute Information 
出现在ExifTags
Page 82
 Interoperability IFD Pointer 40965 A005 
*/

const interoperabilityTagsRef = {
    'InteroperabilityIndex' : 1
}

const interoperabilityTagsRefMD = {
    1: 'InteroperabilityIndex'
}

const getInteroperabilityIFD = (ExifIFDs,app1DV,bigEndian) => {
    //DC-008-Translation-2016-E
    //Page 80
    //Tags Relating to Interoperability
    let cursor;
    if(ExifIFDs.hasOwnProperty("InteroperabilityIFDPointer")) {
        cursor = ExifIFDs.InteroperabilityIFDPointer.value[0]
        //+6 exifIDCode.length + padding.length
        ExifIFDs['InteroperabilityIFDsNum']=app1DV.getUint16(cursor+6,!bigEndian)
        cursor = cursor + 6 + 2
        ExifIFDs['InteroperabilityIFDs'] = {}
        for (let i=0;i<ExifIFDs["InteroperabilityIFDsNum"];i++) {
            cursor = decodeIFD(interoperabilityTagsRefMD,ExifIFDs['InteroperabilityIFDs'],app1DV,cursor,bigEndian)
        }
        
    } else {
        
    }
    return(cursor)
}


//

/*
DC-008-Translation-2016-E
Page 82
Table 18  Tag Support Levels (2)  - 0th IFD Exif Private Tags – 

*/
const exifTagsRef = {
    'ExposureTime': 33434,
    'FNumber': 33437,
    'ExposureProgram': 34850,
    'SpectralSensitivity': 34852,
    'PhotographicSensitivity': 34855,
    'OECF': 34856,
    'SensitivityType': 34864,
    'StandardOutputSensitivity': 34865,
    'RecommendedExposureIndex': 34866,
    'ISOSpeed': 34867,
    'ISOSpeedLatitudeyyy': 34868,
    'ISOSpeedLatitudezzz': 34869,
    'ExifVersion': 36864,
    'DateTimeOriginal': 36867,
    'DateTimeDigitized': 36868,
    'OffsetTime': 36880,
    'OffsetTimeOriginal': 36881,
    'OffsetTimeDigitized': 36882,
    'ComponentsConfiguration': 37121,
    'CompressedBitsPerPixel': 37122,
    'ShutterSpeedValue': 37377,
    'ApertureValue': 37378,
    'BrightnessValue': 37379,
    'ExposureBiasValue': 37380,
    'MaxApertureValue': 37381,
    'SubjectDistance': 37382,
    'MeteringMode': 37383,
    'LightSource': 37384,
    'Flash': 37385,
    'FocalLength': 37386,
    'SubjectArea': 37396,
    'MakerNote': 37500,
    'UserComment': 37510,
    'SubSecTime': 37520,
    'SubSecTimeOriginal': 37521,
    'SubSecTimeDigitized': 37522,
    'Temperature': 37888,
    'Humidity': 37889,
    'Pressure': 37890,
    'WaterDepth': 37891,
    'Acceleration': 37892,
    'CameraElevationAngle': 37893,
    'FlashpixVersion': 40960,
    'ColorSpace': 40961,
    'PixelXDimension': 40962,
    'PixelYDimension': 40963,
    'RelatedSoundFile': 40964,
    'InteroperabilityIFDPointer': 40965,
    'FlashEnergy': 41483,
    'SpatialFrequencyResponse': 41484,
    'FocalPlaneXResolution': 41486,
    'FocalPlaneYResolution': 41487,
    'FocalPlaneResolutionUnit': 41488,
    'SubjectLocation': 41492,
    'ExposureIndex': 41493,
    'SensingMethod': 41495,
    'FileSource': 41728,
    'SceneType': 41729,
    'CFAPattern': 41730,
    'CustomRendered': 41985,
    'ExposureMode': 41986,
    'WhiteBalance': 41987,
    'DigitalZoomRatio': 41988,
    'FocalLengthIn35mmFilm': 41989,
    'SceneCaptureType': 41990,
    'GainControl': 41991,
    'Contrast': 41992,
    'Saturation': 41993,
    'Sharpness': 41994,
    'DeviceSettingDescription': 41995,
    'SubjectDistanceRange': 41996,
    'ImageUniqueID': 42016,
    'CameraOwnerName': 42032,
    'BodySerialNumber': 42033,
    'LensSpecification': 42034,
    'LensMake': 42035,
    'LensModel': 42036,
    'LensSerialNumber': 42037,
    'Gamma': 42240
}

const exifTagsRefMD = {
    33434: 'ExposureTime',
    33437: 'FNumber',
    34850: 'ExposureProgram',
    34852: 'SpectralSensitivity',
    34855: 'PhotographicSensitivity',
    34856: 'OECF',
    34864: 'SensitivityType',
    34865: 'StandardOutputSensitivity',
    34866: 'RecommendedExposureIndex',
    34867: 'ISOSpeed',
    34868: 'ISOSpeedLatitudeyyy',
    34869: 'ISOSpeedLatitudezzz',
    36864: 'ExifVersion',
    36867: 'DateTimeOriginal',
    36868: 'DateTimeDigitized',
    36880: 'OffsetTime',
    36881: 'OffsetTimeOriginal',
    36882: 'OffsetTimeDigitized',
    37121: 'ComponentsConfiguration',
    37122: 'CompressedBitsPerPixel',
    37377: 'ShutterSpeedValue',
    37378: 'ApertureValue',
    37379: 'BrightnessValue',
    37380: 'ExposureBiasValue',
    37381: 'MaxApertureValue',
    37382: 'SubjectDistance',
    37383: 'MeteringMode',
    37384: 'LightSource',
    37385: 'Flash',
    37386: 'FocalLength',
    37396: 'SubjectArea',
    37500: 'MakerNote',
    37510: 'UserComment',
    37520: 'SubSecTime',
    37521: 'SubSecTimeOriginal',
    37522: 'SubSecTimeDigitized',
    37888: 'Temperature',
    37889: 'Humidity',
    37890: 'Pressure',
    37891: 'WaterDepth',
    37892: 'Acceleration',
    37893: 'CameraElevationAngle',
    40960: 'FlashpixVersion',
    40961: 'ColorSpace',
    40962: 'PixelXDimension',
    40963: 'PixelYDimension',
    40964: 'RelatedSoundFile',
    40965: 'InteroperabilityIFDPointer',
    41483: 'FlashEnergy',
    41484: 'SpatialFrequencyResponse',
    41486: 'FocalPlaneXResolution',
    41487: 'FocalPlaneYResolution',
    41488: 'FocalPlaneResolutionUnit',
    41492: 'SubjectLocation',
    41493: 'ExposureIndex',
    41495: 'SensingMethod',
    41728: 'FileSource',
    41729: 'SceneType',
    41730: 'CFAPattern',
    41985: 'CustomRendered',
    41986: 'ExposureMode',
    41987: 'WhiteBalance',
    41988: 'DigitalZoomRatio',
    41989: 'FocalLengthIn35mmFilm',
    41990: 'SceneCaptureType',
    41991: 'GainControl',
    41992: 'Contrast',
    41993: 'Saturation',
    41994: 'Sharpness',
    41995: 'DeviceSettingDescription',
    41996: 'SubjectDistanceRange',
    42016: 'ImageUniqueID',
    42032: 'CameraOwnerName',
    42033: 'BodySerialNumber',
    42034: 'LensSpecification',
    42035: 'LensMake',
    42036: 'LensModel',
    42037: 'LensSerialNumber',
    42240: 'Gamma'
}

const getExifIFDs = (APP1,app1DV,parentIFD) => {
    //DC-008-Translation-2016-E
    //Page 82
    //Table 18  Tag Support Levels (2)  
    //- 0th IFD Exif Private Tags – 
    let bigEndian = isBigEndian(APP1["tiffHeader"]['byteOrder']);
    let cursor;
    if(APP1[parentIFD].hasOwnProperty("ExifIFDPointer")) {
        //It is pointed to by the offset from the TIFF header (Value Offset) 
        //indicated by an Exif private tag value. 
        cursor = APP1[parentIFD].ExifIFDPointer.value[0]
        //+6 exifIDCode.length + padding.length
        APP1[parentIFD]['ExifIFDsNum']=app1DV.getUint16(cursor+6,!bigEndian)
        cursor = cursor + 6 + 2
        APP1[parentIFD]['ExifIFDs'] = {}
        for (let i=0;i<APP1[parentIFD]["ExifIFDsNum"];i++) {
            cursor = decodeIFD(exifTagsRefMD,APP1[parentIFD]["ExifIFDs"],app1DV,cursor,bigEndian)
        }
        
        cursor = getInteroperabilityIFD(APP1[parentIFD]['ExifIFDs'],app1DV,bigEndian)
        
    } else {
        
    }
    return(cursor)
}

//
/*
DC-008-Translation-2016-E
Page 83
Table 19  Tag Support Levels (3)  - 0th IFD GPS Info Tags - 
*/
const GPSInfoTagsRef = {
    'GPSVersionID': 0,
    'GPSLatitudeRef': 1,
    'GPSLatitude': 2,
    'GPSLongitudeRef': 3,
    'GPSLongitude': 4,
    'GPSAltitudeRef': 5,
    'GPSAltitude': 6,
    'GPSTimeStamp': 7,
    'GPSSatellites': 8,
    'GPSStatus': 9,
    'GPSMeasureMode': 10,
    'GPSDOP': 11,
    'GPSSpeedRef': 12,
    'GPSSpeed': 13,
    'GPSTrackRef': 14,
    'GPSTrack': 15,
    'GPSImgDirectionRef': 16,
    'GPSImgDirection': 17,
    'GPSMapDatum': 18,
    'GPSDestLatitudeRef': 19,
    'GPSDestLatitude': 20,
    'GPSDestLongitudeRef': 21,
    'GPSDestLongitude': 22,
    'GPSDestBearingRef': 23,
    'GPSDestBearing': 24,
    'GPSDestDistanceRef': 25,
    'GPSDestDistance': 26,
    'GPSProcessingMethod': 27,
    'GPSAreaInformation': 28,
    'GPSDateStamp': 29,
    'GPSDifferential': 30,
    'GPSHPositioningError': 31
}

const GPSInfoTagsRefMD = {
    0: 'GPSVersionID',
    1: 'GPSLatitudeRef',
    2: 'GPSLatitude',
    3: 'GPSLongitudeRef',
    4: 'GPSLongitude',
    5: 'GPSAltitudeRef',
    6: 'GPSAltitude',
    7: 'GPSTimeStamp',
    8: 'GPSSatellites',
    9: 'GPSStatus',
    10: 'GPSMeasureMode',
    11: 'GPSDOP',
    12: 'GPSSpeedRef',
    13: 'GPSSpeed',
    14: 'GPSTrackRef',
    15: 'GPSTrack',
    16: 'GPSImgDirectionRef',
    17: 'GPSImgDirection',
    18: 'GPSMapDatum',
    19: 'GPSDestLatitudeRef',
    20: 'GPSDestLatitude',
    21: 'GPSDestLongitudeRef',
    22: 'GPSDestLongitude',
    23: 'GPSDestBearingRef',
    24: 'GPSDestBearing',
    25: 'GPSDestDistanceRef',
    26: 'GPSDestDistance',
    27: 'GPSProcessingMethod',
    28: 'GPSAreaInformation',
    29: 'GPSDateStamp',
    30: 'GPSDifferential',
    31: 'GPSHPositioningError'
}

const getGPSInfoIFDs = (APP1,app1DV,parentIFD) => {
    //DC-008-Translation-2016-E
    //Page 83
    //Table 19  Tag Support Levels (3)   
    //- 0th IFD GPSInfo Private Tags – 
    let bigEndian = isBigEndian(APP1["tiffHeader"]['byteOrder'])
    let cursor
    if(APP1[parentIFD].hasOwnProperty("GPSInfoIFDPointer")) {
        //It is pointed to by the offset from the TIFF header (Value Offset) 
        //indicated by an GPSInfo private tag value. 
        cursor = APP1[parentIFD].GPSInfoIFDPointer.value[0]
        //+6 Code.length + padding.length
        APP1[parentIFD]['GPSInfoIFDsNum']=app1DV.getUint16(cursor+6,!bigEndian)
        cursor = cursor + 6 + 2
        APP1[parentIFD]['GPSInfoIFDs'] = {}
        for (let i=0;i<APP1[parentIFD]["GPSInfoIFDsNum"];i++) {
            cursor = decodeIFD(GPSInfoTagsRefMD,APP1[parentIFD]["GPSInfoIFDs"],app1DV,cursor,bigEndian)
        }
        
    } else {
        
    }
    return(cursor)
}
//


//
/*
DC-008-Translation-2016-E
Page 91
APP1 Interoperability structure
*/

const decodeAPP1= (app1ArrayBuf) => {
    let app1DV = new DataView(app1ArrayBuf)
    let APP1 = {}
    let cursor = initAPP1(app1DV,APP1)
    cursor = getAPP1TIFFHeader(APP1,app1DV,cursor)
    let bigEndian = isBigEndian(APP1["tiffHeader"]['byteOrder'])
    cursor = getIFDs(APP1,app1DV,cursor,0,ifd0TagsRefMD)
    let cursorExifIFD0 = getExifIFDs(APP1,app1DV,"IFD0s")
    let cursorGPSInfoIFD0 = getGPSInfoIFDs(APP1,app1DV,"IFD0s")
    //The 0th IFD Offset of Next IFD indicates the start address 
    //of the 1st IFD (thumbnail images). When the 1st IFD is not recorded, 
    //the 0th IFD Offset of Next IFD shall terminate with 00000000.H. 
    APP1['IFD0s']['NextIFDOffset'] = app1DV.getUint32(cursor,!bigEndian)
    if(APP1['IFD0s']['NextIFDOffset']===0) {
        
    } else {
        //+6 Code.length + padding.length
        cursor = APP1['IFD0s']['NextIFDOffset'] + 6
        cursor = getIFDs(APP1,app1DV,cursor,1,ifd1TagsRefMD)
        let cursorExifIFD1 = getExifIFDs(APP1,app1DV,"IFD1s")
        let cursorGPSInfoIFD1 = getGPSInfoIFDs(APP1,app1DV,"IFD1s")
    
    }
    return(APP1)
}








module.exports = {
    endianRef:endianRef,
    endianRefMD:endianRefMD,
    typeRef:typeRef,
    typeRefMD:typeRefMD,
    ifd0TagsRef:ifd0TagsRef,
    ifd0TagsRefMD:ifd0TagsRefMD,
    ifd1TagsRef:ifd1TagsRef,
    ifd1TagsRefMD:ifd1TagsRefMD,
    interoperabilityTagsRef:interoperabilityTagsRef,
    interoperabilityTagsRefMD:interoperabilityTagsRefMD,
    exifTagsRef:exifTagsRef,
    exifTagsRefMD:exifTagsRefMD,
    GPSInfoTagsRef:GPSInfoTagsRef,
    GPSInfoTagsRefMD:GPSInfoTagsRefMD,
    decodeAPP1:decodeAPP1,
}

