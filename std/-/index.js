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
( "../i-field-text/i-field-text.js" )
( "../i-hlight-/i-hlight.js" )
( "../i-hlight-bb/i-hlight-bb.js" )
( "../i-hlight-code/i-hlight-code.js" )
( "../i-hlight-js/i-hlight-js.js" )
( "../i-hlight-md/i-hlight-md.js" )
( "../i-noframe/i-noframe.js" )
