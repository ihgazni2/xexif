//handle imgArrayBuf 
//

const codeNumDict = {
     65496:
            {
             'markerAbbr': 'SOI',
             'markerName': 'Start of Image',
             'Description': 'Start of compressed data'
            },
     65504:
            {
             'markerAbbr': 'APP0',
             'markerName': 'JFIF',
             'Description': ''
            },
     65505:
            {
             'markerAbbr': 'APP1',
             'markerName': 'Application Segment 1',
             'Description': 'Exif attribute information'
            },
     65506:
            {
             'markerAbbr': 'APP2',
             'markerName': 'Application Segment 2',
             'Description': 'Exif extended data'
            },
     65499:
            {
             'markerAbbr': 'DQT',
             'markerName': 'Define Quantization Table',
             'Description': 'Quantization table definition'
            },
     65476:
            {
             'markerAbbr': 'DHT',
             'markerName': 'Define Huffman Table',
             'Description': 'Huffman table definition'
            },
     65501:
            {
             'markerAbbr': 'DRI',
             'markerName': 'Define Restart Interoperability',
             'Description': 'Restart Interoperability definition'
            },
     65472:
            {
             'markerAbbr': 'SOF',
             'markerName': 'Start of Frame',
             'Description': 'Parameter data relating to frame'
            },
     65498:
            {
             'markerAbbr': 'SOS',
             'markerName': 'Start of Scan',
             'Description': 'Parameters relating to components'
            },
     65497:
            {
             'markerAbbr': 'EOI',
             'markerName': 'End of Image',
             'Description': 'End of compressed data'
            }
}

const abbrCodeNumDict = {
 'SOI':
        {
         'markerName': 'Start of Image',
         'markerCode': 65496,
         'Description': 'Start of compressed data'
        },
 'APP0':
         {
          'markerName': 'JFIF',
          'markerCode': 65504,
          'Description': ''
         },
 'APP1':
         {
          'markerName': 'Application Segment 1',
          'markerCode': 65505,
          'Description': 'Exif attribute information'
         },
 'APP2':
         {
          'markerName': 'Application Segment 2',
          'markerCode': 65506,
          'Description': 'Exif extended data'
         },
 'DQT':
        {
         'markerName': 'Define Quantization Table',
         'markerCode': 65499,
         'Description': 'Quantization table definition'
        },
 'DHT':
        {
         'markerName': 'Define Huffman Table',
         'markerCode': 65476,
         'Description': 'Huffman table definition'
        },
 'DRI':
        {
         'markerName': 'Define Restart Interoperability',
         'markerCode': 65501,
         'Description': 'Restart Interoperability definition'
        },
 'SOF':
        {
         'markerName': 'Start of Frame',
         'markerCode': 65472,
         'Description': 'Parameter data relating to frame'
        },
 'SOS':
        {
         'markerName': 'Start of Scan',
         'markerCode': 65498,
         'Description': 'Parameters relating to components'
        },
 'EOI':
        {
         'markerName': 'End of Image',
         'markerCode': 65497,
         'Description': 'End of compressed data'
        }
}

//
const getSOISeg = (imgArrayBuf,markSegments) => {
    //Marker Prefix  0xFF
    //SOI            0xD8
    let cursor = 0
    let SOI = new DataView(imgArrayBuf,cursor,2)
    let code = SOI.getUint16(0)
    cursor = cursor + 2
    let valid = codeNumDict.hasOwnProperty(code)
    if(valid) {
        let abbr = codeNumDict[code]['markerAbbr']
        let cond = ('SOI' === abbr)
        if(cond) {
            markSegments['SOI'] = imgArrayBuf.slice(cursor,cursor)
        } else {
            return(null)
        }
    } else {
        return(null)
    }
    return(cursor)
}

const getMarkerSeg = (cursor,imgArrayBuf,markSegments) => {
    let marker = new DataView(imgArrayBuf,cursor,2)
    let code = marker.getUint16(0)
    cursor = cursor + 2
    let lngth = new DataView(imgArrayBuf,cursor,2)
    lngth = lngth.getUint16(0)
    cursor = cursor + 2
    valid = codeNumDict.hasOwnProperty(code)
    if(valid) {
        let abbr = codeNumDict[code]['markerAbbr']
        if(abbr === "DQT") {
           let dqt = imgArrayBuf.slice(cursor,cursor+lngth-2)
           markSegments['DQTs'].push(dqt)
        } else if(abbr === "DHT") {
           let dht = imgArrayBuf.slice(cursor,cursor+lngth-2)
           markSegments['DHTs'].push(dht)
        }else {
           markSegments[abbr] = imgArrayBuf.slice(cursor,cursor+lngth-2)
        }
        
    } else {
        markSegments[code] = imgArrayBuf.slice(cursor,cursor+lngth-2)
    }
    cursor = cursor + lngth-2
    return(cursor)
}

const getSegments = (imgArrayBuf) => {
    //SOI
    let markSegments = {}
    let cursor = getSOISeg(imgArrayBuf,markSegments)
    if(cursor === null) {
        return(null)
    } else {
        
    }
    //multiple DQT DHT
    markSegments['DQTs'] = []
    markSegments['DHTs'] = []
    //
    let totalLngth = imgArrayBuf.byteLength
    while(cursor<totalLngth) {
        cursor = getMarkerSeg(cursor,imgArrayBuf,markSegments)
        //DC-008-Translation-2016-E
        //Page 88
        //DQT, DHT, DRI and SOF may line up in any order, 
        //but shall be recorded after APP1 (or APP2 if any) and before SOS.
        let cond = markSegments.hasOwnProperty('SOS')
        if(cond){
            markSegments['UNHANDLED'] = imgArrayBuf.slice(cursor)
            break
        } else {
            
        }
    }
    return(markSegments)
}


////
const getArrayBufFromImgFile = (fn,markerName) => {
    //by default ,get APP1 which contain tiff,exif and GPSInfo
    if(markerName === undefined) {
        markerName = "APP1"
    } else {
        
    }
    markerName = markerName.toUpperCase()
    //1. read image file to buffer
    let buf = fs.readFileSync(fn)
    let imgArrayBuf = buf.buffer
    //2. get APP1 segment (which contain EXIF) to arrayBuffer
    let markSegments = mksg.getSegments(imgArrayBuf)
    let arrayBuf = markSegments[markerName]
    return(arrayBuf)
}



////
const help = () => {
    let msg = "\n\
        var fs = require('fs');\n\
        var buf = fs.readFileSync('./1.jpg');\n\
        var imgArrayBuf = buf.buffer;\n\
        var markSegments = getSegments(imgArrayBuf);\n\
        markSegments\
    "
    console.log(msg)
}


module.exports = {
    codeNumDict:codeNumDict,
    abbrCodeNumDict:abbrCodeNumDict,
    getSOISeg:getSOISeg,
    getMarkerSeg:getMarkerSeg,
    getSegments:getSegments,
    getArrayBufFromImgFile:getArrayBufFromImgFile,
    help:help
}
