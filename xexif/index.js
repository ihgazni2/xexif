import getArrayBufFromImgFile from "./segsDecoder.js"
import decodeAPP1 from "./app1Decoder.js"
import readable from "./app1Reader.js"
import search from "./app1Reader.js"
import get from "./app1Reader.js"

import listStructure from "./app1Doc.js"
import listTypes from "./app1Doc.js"
import listIFD0Tags from "./app1Doc.js"
import listExifTags from "./app1Doc.js"
import listInteroperabilityTags from "./app1Doc.js"
import listGPSInfoTags from "./app1Doc.js"
import listIFD1Tags from "./app1Doc.js"
import man from "./app1Doc.js"


module.exports = {
    getArrayBufFromImgFile:getArrayBufFromImgFile,
    decodeAPP1:decodeAPP1,
    readable:readable,
    search:search,
    get:get,
    listStructure:listStructure,
    listTypes:listTypes,
    listIFD0Tags:listIFD0Tags,
    listExifTags:listExifTags,
    listInteroperabilityTags:listInteroperabilityTags,
    listGPSInfoTags:listGPSInfoTags,
    listIFD1Tags:listIFD1Tags,
    man:man
}
