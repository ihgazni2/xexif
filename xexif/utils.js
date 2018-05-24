

const arrayBuf2Buf = (arrayBuf) => {
    let buf = Buffer.from( new Uint8Array(arrayBuf) )
    return(buf)
}

//buf2ArrayBuf buf.buffer


const latin1Str2Buf = (s) => {
    let buf = Buffer.from(s,"latin1")
    return(buf)
}

// buf2Latin1Str buf.toString('latin1')


const latin1StrFromDV = (dv, start, length) => {
    if(start === undefined) {
        start = 0
    } else {
        
    }
    if(length === undefined) {
        length = dv.byteLength
    } else {
        
    }
    let arrayBuf = dv.buffer.slice(start,start+length)
    let buf = Buffer.from( new Uint8Array(arrayBuf) )
    let s = buf.toString('latin1')
    return(s);
}

const DV2latin1Str = latin1StrFromDV


const latin1Str2DV = (s) => {
    let buf = Buffer.from(s,"latin1")
    let arrayBuf = buf.buffer
    let dv = new DataView(arrayBuf)
    return(dv)
}

//

const latin1Str2ArrayBuf = (s) => {
    let buf = Buffer.from(s,"latin1")
    let arrayBuf = buf.buffer
    return(arrayBuf)
}

const arrayBuf2Latin1Str = (arrayBuf) => {
    let buf = Buffer.from( new Uint8Array(arrayBuf) )
    let s = buf.toString('latin1')
    return(s);
}

const latin1StrFromArrayBuf = arrayBuf2Latin1Str

//





const hex = (n,radix=10) => {
    //add prepend padding
    n = parseInt(n,radix)
    h = n.toString(16)
    return(h)
}


const isEmptyObjectForIn = (obj) => {
     for(var key in obj){
          return(false)
     }
     return(true)
}

const isEmptyObjectForOf = (obj) => {
     for(var value of obj){
          return(false)
     }
     return(true)
}


const classOf = (o) => {
    if(o===null){
        return("null")
    } else if(o === undefined) {
        return("undefined")
    } else {
        return(Object.prototype.toString.call(o).slice(8,-1))
    }
}

const dictLength = (obj) => {
    return(Object.keys(obj).length)
}


const dictMirror = (obj) => {
    nobj = {}
    for(var k in obj) {
        let v = obj[k]
        nobj[v] = k
    }
    return(nobj)
}


const deepCopyDict = (obj) => { 
    var rslt = {};
    for (var key in obj) {
          rslt[key] = (
              classOf(obj[key]).toLowerCase() ==="object" ? 
              deepCopyDict(obj[key]): 
              obj[key]
          );
    } 
    return(rslt)
}


const float2Rational = (f) => {
    if(isNaN(f)) {
        return({ numerator: 0, denominator: 0 })
    } else {
        let arr = f.toString().split(".")
        let rslt;
        if(arr.length === 1) {
            let n = parseInt(arr[0])
            rslt = { numerator: n, denominator: 1 }
        } else {
            let bitsnum = arr[1].length
            let co = 10**bitsnum
            let n = f * co
            let d = co 
            rslt = { numerator: n, denominator: d }
        }
        return(rslt)
    }
}


const rational2Float = (r) => {
    return(r.numerator/r.denominator)
}


const getItemViaPathList = (d,pl) => {
    let tmp = d
    for(let i=0;i<pl.length;i++){
        tmp = tmp[pl[i]]
    }
    return(tmp)
}

const dictPathListMat = (d) => {
    let mat = []
    let ks
    let unhandled
    let nextUnhandled
    ks = Object.keys(d)
    let pls = ks.map(k=>([k]))
    mat.push(pls)
    unhandled = ks.filter(k=>(classOf(d[k]).toLowerCase()==="object"))
    unhandled = unhandled.map(ele=>([ele]))
    while(unhandled.length>0) {
        nextUnhandled = []
        for(let i=0;i<unhandled.length;i++){
            let pl = unhandled[i]
            let v = getItemViaPathList(d,pl)
            ks = Object.keys(v)
            let pls = ks.map(
                (k)=> {
                          let npl = Array.from(pl)
                          npl.push(k)
                          return(npl)
                      }
                ) 
            nextUnhandled = nextUnhandled.concat(pls)
        }
        mat.push(nextUnhandled)
        nextUnhandled = nextUnhandled.filter(pl=>(classOf(getItemViaPathList(d,pl)).toLowerCase()==="object"))
        unhandled = nextUnhandled
    }
    return(mat)
}





module.exports = {
    arrayBuf2Buf:arrayBuf2Buf,
    latin1Str2Buf:latin1Str2Buf,
    latin1StrFromDV:latin1StrFromDV,
    latin1Str2DV:latin1Str2DV,
    latin1Str2ArrayBuf:latin1Str2ArrayBuf,
    DV2latin1Str:DV2latin1Str,
    arrayBuf2Latin1Str:arrayBuf2Latin1Str,
    latin1StrFromArrayBuf:latin1StrFromArrayBuf,
    hex:hex,
    isEmptyObjectForIn:isEmptyObjectForIn,
    isEmptyObjectForOf:isEmptyObjectForOf,
    classOf:classOf,
    dictLength:dictLength,
    dictMirror:dictMirror,
    deepCopyDict:deepCopyDict,
    float2Rational:float2Rational,
    rational2Float:rational2Float,
    getItemViaPathList:getItemViaPathList,
    dictPathListMat:dictPathListMat

}