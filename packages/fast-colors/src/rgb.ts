
function hexToRgb(hex){
      var r,g,b,a;
      var rgb=false;
      var rgba=false;
      hex = hex.replace('#', '');
      if (3 === hex.length && /([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        rgb = true;
        r = hex.charAt(0);
        g = hex.charAt(1);
        b = hex.charAt(2);
      } else if (4 === hex.length &&/([A-Fa-f0-9]{4}){1,2}$/) {
        rgba = true;
        r = hex.charAt(0);
        g = hex.charAt(1);
        b = hex.charAt(2);
        a = hex.charAt(3);
      } else if (6 === hex.length && /([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        rgb = true;
        r = hex.substring(0, 2);
        g = hex.substring(2, 4);
        b = hex.substring(4, 6);
      } else if (8 === hex.length && /([A-Fa-f0-9]{4}){1,2}$/) {
        rgba = true;
        r = hex.substring(0, 2);
        g = hex.substring(2, 4);
        b = hex.substring(4, 6);
        a = hex.substring(6, 8);
      } else {
        throw new Error("Not a valid hex value") ;
      }

      if (r.length === 1) {
        r += r;
      }
      if (g.length === 1) {
        g += g;
      }
      if (b.length === 1) {
        b += b;
      }

      if(rgb){
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);
        return 'rgb(' + r + ', ' + g + ', ' + b+')';
      } else if(rgba){
        if (a.length === 1) {
            a += a;
          }
    
          r = parseInt(r, 16);
          g = parseInt(g, 16);
          b = parseInt(b, 16);
          a = parseInt(a, 16) / 255;
          return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
      }
      
}
  

