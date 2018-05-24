const segs = require("./segsDecoder.js")
const app1de = require("./app1Decoder.js")
const app1rd  = require("./app1Reader.js")
const app1doc = require("./app1Doc.js")


module.exports = {
    getArrayBufFromImgFile:segs.getArrayBufFromImgFile,
    decodeAPP1:app1de.decodeAPP1,
    readable:app1rd.readable,
    search:app1rd.search,
    get:app1rd.get,
    listStructure:app1doc.listStructure,
    listTypes:app1doc.listTypes,
    listIFD0Tags:app1doc.listIFD0Tags,
    listExifTags:app1doc.listExifTags,
    listInteroperabilityTags:app1doc.listInteroperabilityTags,
    listGPSInfoTags:app1doc.listGPSInfoTags,
    listIFD1Tags:app1doc.listIFD1Tags,
    man:app1doc.man
}
