(new function(){
	var scripts= document.getElementsByTagName('script')
	var script= scripts[ scripts.length -1 ]
	var dir= script.getAttribute( 'src' ).replace( /[^\/]+$/, '' )
    return function( path ){
    	document.write( '<script src="' + dir + path + '"></script>' )
    	return arguments.callee
    }
})
( "../_base/CClock.js" )
( "../_base/CComponent.js" )
( "../_base/CHiqus.js" )
( "../_base/FCached.js" )
( "../_base/FLazy.js" )
( "../_base/FPipe.js" )
( "../_base/FPoly.js" )
( "../_base/FProp.js" )
( "../_base/FTrottler.js" )
( "../_base/FValue.js" )
( "../std-field-text/std-field-text.js" )
( "../std-hlight/std-hlight.js" )
( "../std-hlight-bb/std-hlight-bb.js" )
( "../std-hlight-code/std-hlight-code.js" )
( "../std-hlight-js/std-hlight-js.js" )
( "../std-hlight-md/std-hlight-md.js" )
( "../std-noframe/std-noframe.js" )
