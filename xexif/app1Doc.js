const app1Decoder = require('./app1Decoder.js')
const app1Engine = require('./app1Engine.js')

const listTypes = () => {
    console.log(Object.keys(app1Decoder.typeRef))
}

const listIFD0Tags = () => {
    console.log(Object.keys(app1Decoder.ifd0TagsRef))
}

const listExifTags = () => {
    console.log(Object.keys(app1Decoder.exifTagsRef))
}

const listInteroperabilityTags = () => {
    console.log(Object.keys(app1Decoder.interoperabilityTagsRef))
}

const listGPSInfoTags = () => {
    console.log(Object.keys(app1Decoder.GPSInfoTagsRef))
}
 
const listIFD1Tags = () => {
    console.log(Object.keys(app1Decoder.ifd0TagsRef))
}

const listStructure = () => {
    let s = "\n\
    exifIDCode\n\
    padding\n\
    tiffHeader\n\
        |---byteOrder\n\
        |---fixed\n\
        |---0thIFDOffset\n\
    IFD0sNum\n\
    IFD0s\n\
        |---<TIFFTags 0>\n\
        |---<TIFFTags 1>\n\
        |----...........\n\
        |---<TIFFTags n>\n\
        |---ExifIFDPointer\n\
        |---GPSInfoIFDPointer\n\
        |---ExifIFDsNum\n\
        |---ExifIFDs\n\
                |---<ExifTags 0>\n\
                |---<ExifTags 1>\n\
                |----...........\n\
                |---<ExifTags n>\n\
                |---InteroperabilityIFDPointer\n\
                |---InteroperabilityIFDsNum\n\
                |---InteroperabilityIFDs\n\
                        |---InteroperabilityIndex\n\
        |---GPSInfoIFDsNum\n\
        |---GPSInfoIFDs\n\
                |---<GPSInfoTags 0>\n\
                |---<GPSInfoTags 1>\n\
                |----...........\n\
                |---<GPSInfoTags n>\n\
        |----NextIFDOffset\n\
    IFD1sNum\n\
    IFD1s\n\
        |---<TIFFTags 0>\n\
        |---<TIFFTags 1>\n\
        |----...........\n\
        |---<TIFFTags n>\n\
        |---ExifIFDPointer\n\
        |---GPSInfoIFDPointer\n\
        |---ExifIFDsNum\n\
        |---ExifIFDs\n\
                |---<ExifTags 0>\n\
                |---<ExifTags 1>\n\
                |----...........\n\
                |---<ExifTags n>\n\
                |---InteroperabilityIFDPointer\n\
                |---InteroperabilityIFDsNum\n\
                |---InteroperabilityIFDs\n\
                        |---InteroperabilityIndex\n\
        |---GPSInfoIFDsNum\n\
        |---GPSInfoIFDs\n\
                |---<GPSInfoTags 0>\n\
                |---<GPSInfoTags 1>\n\
                |----...........\n\
                |---<GPSInfoTags n>\n\
    "
    console.log(s)
}

const man = (tagName) => {
    app1Engine.help(tagName)
}


module.exports = {
    listStructure:listStructure,
    listTypes:listTypes,
    listIFD0Tags:listIFD0Tags,
    listExifTags:listExifTags,
    listInteroperabilityTags:listInteroperabilityTags,
    listGPSInfoTags:listGPSInfoTags,
    man:man
}







