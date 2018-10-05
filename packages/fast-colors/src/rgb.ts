import Chroma from "chroma-js";

function hexToRgb(hex) {
    var regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    var result = regex.exec(hex);
    if(regex.test(hex)){
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        };
        
    } else {
        return null;
    }
}

function hexToRgba(hex){
    
}

