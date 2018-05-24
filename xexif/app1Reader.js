const utils = require('./utils.js')
const app1Engine = require('./app1Engine.js')


const makeSubIFDsReadable = (ifds,app1s1,whichIFDRef) => {
    for(let tagName in ifds) {
        let ele = ifds[tagName]
        let count = ele.count
        let value = ele.value
        let type = ele.type
        if(type === undefined) {
            
        } else {
            let ref = app1Engine[whichIFDRef][type]
            let defuncs = ref.DEFUNCS
            if(tagName in defuncs) {
                value = defuncs[tagName](value,count)
                ifds[tagName] = value
            } else {
                ifds[tagName] = value
            }
            
        }
    }
}

const makeIFDsReadable = (whichIFDs,app1s1,whichIFDRef) => {
    if(whichIFDRef === undefined) {
        whichIFDRef = "IFD0Ref"
    } else {
        
    }
    if(whichIFDs in app1s1) {
        let ifds = app1s1[whichIFDs]
        makeSubIFDsReadable(ifds,app1s1,whichIFDRef)
        if("ExifIFDs" in app1s1[whichIFDs]) {
            let exifs = app1s1[whichIFDs].ExifIFDs
            makeSubIFDsReadable(exifs,app1s1,"ExifRef")
            if("InteroperabilityIFDs" in app1s1[whichIFDs].ExifIFDs) {
                let interos = app1s1[whichIFDs].ExifIFDs.InteroperabilityIFDs
                makeSubIFDsReadable(interos,app1s1,"InteroperabilityRef")
            } else {
                
            }
        } else {
            
        }
        if("GPSInfoIFDs" in app1s1[whichIFDs]) {
            let gps = app1s1[whichIFDs].GPSInfoIFDs
            makeSubIFDsReadable(gps,app1s1,"GPSRef")
        } else {
            
        }
    } else {
        
    }
}

const readable = (app1s0) => {
    let app1s1 = utils.deepCopyDict(app1s0)
    makeIFDsReadable("IFD0s",app1s1,"IFD0Ref")
    makeIFDsReadable("IFD1s",app1s1,"IFD1Ref")
    return(app1s1)
}

//search is loose mode
const search = (tagName,app1s1) => {
    var rslts = []
    var plMat = utils.dictPathListMat(app1s1)
    for(var i=0;i<plMat.length;i++){
        var level = plMat[i]
        for(var j=0;j<level.length;j++){
            var pl = level[j]
            var lngth = pl.filter(v=>(v.toLowerCase().includes(tagName.toLowerCase()))).length
            if(lngth > 0) {
                var rslt = utils.getItemViaPathList(app1s1,pl)
                rslts.push(
                    {
                        'name':pl[pl.length-1],
                        'path':pl.join("."),
                        'value':rslt
                    }
                )
            } else {
                
            }
        }
    }
    return(rslts)
}

//get is strict mode
const get = (tagName,app1s1,showPath) => {
    var rslts = []
    var plMat = utils.dictPathListMat(app1s1)
    for(var i=0;i<plMat.length;i++){
        var level = plMat[i]
        for(var j=0;j<level.length;j++){
            var pl = level[j]
            var lngth = pl.filter(v=>(v.toLowerCase()  === tagName.toLowerCase())).length
            if(lngth > 0) {
                var rslt = utils.getItemViaPathList(app1s1,pl)
                rslts.push(
                    {
                        'name':pl[pl.length-1],
                        'path':pl.join("."),
                        'value':rslt
                    }
                )
            } else {
                
            }
        }
    }
    if(showPath === undefined) {
        showPath = false
    } else {
        
    }
    if(showPath) {
        return(rslts)
    } else {
        if(rslts.length>1) {
            return(rslts)
        } else {
            return(rslts[0].value)
        }
    }
}

//get path list 
const getPath = (tagName,app1s1) => {
    let rslts = get(tagName,app1s1,true)
    rslts = rslts.map((rslt)=>(rslt['path']))
    return(rslts)
}


module.exports = {
    readable:readable,
    search:search,
    get:get,
    getPath:getPath
}







