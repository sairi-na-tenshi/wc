/* include( '../_base/CClock.js' ); */

var CClock= function( ){
	if( this instanceof CClock ) return
	var clock= new CClock

	var timerID= FProp()

	var active= FProp( false )
	clock.active= FPoly( active, function( val ){
		active( val )
		if( timerID() ) timerID( window.clearTimeout( timerID() ) )
		if( val ) timerID( window.setTimeout( proc(), latency() ) )
		return this
	})

	var latency= FProp( 0 )
	clock.latency= FPoly( latency, function( val ){
		latency( val )
		clock.active( active() )
		return this
	} )

	var proc= FProp()
	clock.proc= FPoly( proc, function( val ){
		proc( val )
		clock.active( active() )
		return this
	} )

	return clock
}



/* include( '../_base/CComponent.js' ); */

var CComponent= new function(){

Version: 3
Description: 'attach widget constructor to DOM as live component'
License: 'public domain'
Implementation:

var CComponent= function( tag, factory ){
    if(!( this instanceof CComponent )) return new CComponent( tag, factory )

    var elements= [], widgets= []
    var timerTracking, timerCleaning

    var latencyTracking= 50
    var latencyCleaning= 100
    var field= 'CComponent:' + Math.random()

    var attach= function( el ){
        var widget= new factory( el ) || null
        el[ field ]= widget
        if( !widget ) return
        elements.push( el )
        widgets.push( widget )
    }

    var attachIfLoaded= function( el ){
        var cur= el
        do {
            if( !cur.nextSibling ) continue
            attach( el )
            break
        } while( cur= cur.parentNode )
    }

    var tracking= function( ){
        var nodes= CComponent.tags( tag )
        for( var i= 0, len= nodes.length; i < len; ++i ){
            var el= nodes[ i ]
            var widget= el[ field ]
            if( typeof widget === 'object' ) continue
            attachIfLoaded( el )
        }
        timerTracking= setTimeout( tracking, latencyTracking )
    }

    var cleaning= function( ){
        var doc= document.documentElement
        checking: for( var i= elements.length; i--; ){
            var el= elements[ i ]
            var cur= el
            do {
                if( cur === doc ) continue checking
            } while( cur= cur.parentNode )
            var widget= el[ field ]
            if( widget.destroy ) widget.destroy()
            el[ field ]= void 0
            elements.splice( i, 1 )
            widgets.splice( i, 1 )
        }
        timerCleaning= setTimeout( cleaning, latencyCleaning )
    }

    var revive= function( ){
        tracking()
        cleaning()
    }
    var freeze= function( ){
        timerTracking= clearTimeout( timerTracking )
        timerCleaning= clearTimeout( timerCleaning )
    }

    var destroy= function( ){
        freeze()
        for( var i= elements.length; i--; ){
            var widget= widgets[ i ]
            if( widget.destroy ) widget.destroy()
        }
        elements= []
        widgets= []
    }

    var onload= function( ){ attachIfLoaded= attach }
    window.addEventListener
    ? window.addEventListener( 'load', onload, false )
    : window.attachEvent( 'onload', onload )

    this.tag= function( ){ return tag }
    this.field= function( ){ return field }
    this.factory= function( ){ return factory }
    this.latencyTracking= function( ){ return latencyTracking }
    this.latencyCleaning= function( ){ return latencyCleaning }
    this.elements= function( ){ return elements.slice( 0 ) }
    this.widgets= function( ){ return widgets.slice( 0 ) }
    this.revive= revive
    this.freeze= freeze
    this.destroy= destroy

    revive()
}

var cacheTags= {}

CComponent.tags= function( name ){
    var nodes= cacheTags[ name ]
    if( !nodes ){
        var isIE= /*@cc_on!@*/ false
        var chunks= /(?:(\w+):)?([-\w]+)/.exec( name )
        var scope= isIE && chunks[1] || ''
        var tag= isIE && chunks[2]|| name
        nodes= cacheTags[ name ]= document.getElementsByTagName( tag )
        nodes.scopeName= scope
    }
    var res= [], scope= nodes.scopeName
    if( scope ){
        for( var i= 0, len= nodes.length; i < len; ++i ){
            var node= nodes[ i ]
            if( node.scopeName !== scope ) continue
            res.push( node )
        }
    } else     {
        for( var i= 0, len= nodes.length; i < len; ++i )
            res.push( nodes[ i ] )
    };
    return res
}

Export: return CComponent

}



/* include( '../_base/CHiqus.js' ); */

var CHiqus= new function(){

Version: 1
Description: "parse, serialize and merge any 'HIerarhical QUery String'"
License: 'public domain'

Implementation:

var sepHiqusList= '/|; &'
var sepPathList= '=:_'

var sepHiqusDefault= sepHiqusList.charAt(0)
var sepPathDefault= sepPathList.charAt(0)

var sepHiqusRegexp= RegExp( '[' + sepHiqusList + ']', 'g' )
var sepPathRegexp= RegExp( '[' + sepPathList + ']', 'g' )

var encode= function( str ){
    return encodeURIComponent( str ).split( '_' ).join( '%5F' )
}
var decode= function( str ){
    return decodeURIComponent( str )
}

var splitHiqus= function( str ){
    return str.split( sepHiqusRegexp )
}
var splitPath= function( str ){
    var path= String( str ).split( sepPathRegexp )
    for( var j= path.length - 1; j >= 0; --j ) path[ j ]= decode( path[ j ] )
    return path
}

var get= function( ){
    var obj= this
    for( var i= 0, len= arguments.length; i < len; ++i ){
        var name= arguments[ i ]
        if( !name ) throw new Error( 'name is empty' )
        obj= obj[ name ]
        if( typeof obj !== 'object' ) return obj
    }
    return obj
}

var placin= function( ){
    var obj= this
    for( var i= 0, len= arguments.length; i < len; ++i ){
        var name= arguments[ i ]
        if( name ){
            var o= obj[ name ]
            if(( !o )||( typeof o !== 'object' )) o= obj[ name ]= []
        } else {
            var o= []
            obj.push( o )
        }
        obj= o
    }
    return obj
}

var put= function( ){
    var obj= this
    var len= arguments.length
    if( !len ) return this
    var val= arguments[ len - 1 ]
    var key= arguments[ len - 2 ]
    if( len > 2 ){
        var path= [];
        for( var i= len - 2; i-- ;)
        	path[ i ]= arguments[ i ]
        obj= placin.apply( obj, path )
    }
    if( typeof val === 'object' ){
        var v= ( len === 1 )
        	? obj
        	: placin.call( obj, key )
        for( var i in val )
        	if( val.hasOwnProperty( i ) )
        		put.call( v, i, val[ i ] )
    } else {
        if( key === void 0 ) obj[ val ]= true
        else obj[ key ]= val
    }
    return this
}

var parsin= function( str ){
    var chunks= splitHiqus( str )
    for( var i= 0, len= chunks.length; i < len; ++i ){
        var path= chunks[i]
        if( !path ) continue
        path= splitPath( path )
        put.apply( this, path )
    }
      return this
}

var serialize= function( prefix, obj ){
    var list= []
    for( var key in obj ) if( obj.hasOwnProperty( key ) ){
        var val= obj[ key ]
        var k= encode( key )
        if( !val ) continue;
        if(( val === true )&&( !prefix )){
        	list.push( k )
	    } else if( typeof val !== 'object' ){
	        list.push( prefix + k + sepPathDefault + encode( val ) )
	    } else {
        	list.push( serialize( prefix + k + sepPathDefault, val ) )
        }
    }
    return list.join( sepHiqusDefault )
}

var CHiqus= function( ){
    var hiqus= ( this instanceof CHiqus ) ? this: new CHiqus
    var data= placin.call( hiqus, '_data' )
    for( var i= 0, len= arguments.length; i < len; ++i ){
        var arg= arguments[i]
        if( arg instanceof CHiqus ) arg= arg._data
        var invoke= ( Object( arg ) instanceof String ) ? parsin : put
        invoke.call( data, arg )
    }
    return hiqus
}

CHiqus.prototype= new function(){

    this.put= function(){
        var hiqus= CHiqus( this )
        put.apply( hiqus._data, arguments )
        return hiqus
    }

    this.get= function( ){
        var val= get.apply( this._data, arguments )
        if( typeof val === 'object' ) val= put.call( [], val )
        return val
    }

    this.sub= function(){
        var hiqus= CHiqus()
        var val= get.apply( this._data, arguments )
        if( typeof val !== 'object' ) val= [ val ]
        hiqus._data= val
        return hiqus
    }

    this.toString = function(){
        var str= serialize( '', this._data )
        this.toString= function(){ return str }
        return str
    }

}

Export: return CHiqus

Usage:

alert(
    CHiqus
    (    CHiqus( '| a:b:c:1 / a:b: ; a:b::c & a=b__d' )
        .sub( 'a', 'b' )
        .put( [ 'e', 'f' ] )
    ,    'g/h'
    )
    .get( 4 )
) // alerts 'g'

}


/*;(function( x, y ){
    if( '' + x != y ){
	    console.log( x, y )
	    throw new Error( 'fail test: [ ' + x + ' ]!=[ ' + y + ' ]' )
	}
	return arguments.callee
})

( CHiqus( ),    '' )
( CHiqus( {} ), '' )
( CHiqus( [] ), '' )
( CHiqus( [1] ), '0=1' )
( CHiqus( [true] ), '0' )
( CHiqus( {1:true} ), '1' )
( CHiqus( [1,2] ), '0=1/1=2' )
( CHiqus( [false,true] ), '1' )
( CHiqus( {a:1} ), 'a=1' )
( CHiqus( {'a_b':1} ), 'a%5Fb=1' )
( CHiqus( {a:{b:1}} ), 'a=b=1' )
( CHiqus( {a:1,b:2} ), 'a=1/b=2' )
( CHiqus( {a:1},{b:2} ), 'a=1/b=2' )
( CHiqus( {a:1},'b:2' ), 'a=1/b=2' )
( CHiqus( {a:1},{b:2} ), new CHiqus( {a:1},{b:2} ) )
( CHiqus( CHiqus({a:1}), CHiqus({b:2}) ), 'a=1/b=2' )

( CHiqus( '' ), '' )
( CHiqus( 'x' ), 'x' )
( CHiqus( '=a' ), '=a' )
( CHiqus( 'b=1' ), 'b=1' )
( CHiqus( 'c:1' ), 'c=1' )
( CHiqus( 'd_1' ), 'd=1' )
( CHiqus( 'a=b=1' ), 'a=b=1' )
( CHiqus( 'a=1/b=2' ), 'a=1/b=2' )
( CHiqus( 'a=1;b=2' ), 'a=1/b=2' )
( CHiqus( 'a=1 b=2' ), 'a=1/b=2' )
( CHiqus( 'a=1&b=2' ), 'a=1/b=2' )
( CHiqus( 'a=1|b=2' ), 'a=1/b=2' )

( CHiqus( '1/2' ).get(), ',true,true' )
( CHiqus( 'a=1/b=2' ).get( 'a' ), '1' )
( CHiqus( 'a=1=2/b=2=3' ).get( 'b', 2 ), '3' )
( ( ( a= CHiqus( 'a=1/b=2' ) ).get( 'a' ), a ), 'a=1/b=2' )

( CHiqus( 'a=1/b=2' ).sub(), 'a=1/b=2' )
( CHiqus( 'a=b=1/a=c=2/d=3' ).sub( 'a' ), 'b=1/c=2' )
( ( a= CHiqus( 'a=1/b=2' ) ).sub( 'a' ) && a, 'a=1/b=2' )

( CHiqus( 'a=1' ).put( {b:2} ), 'a=1/b=2' )
( CHiqus( 'a=1' ).put( 'a', {b:2} ), 'a=b=2' )
( ( a= CHiqus( 'c=1' ) ).put( 'b=2' ) && a, 'c=1' )
; */


/* include( '../_base/FCached.js' ); */

var FCached= function( func ){
	var cache= {}
	return function( arg ){
		key= 'cache:' + arg
		if( key in cache ) return cache[ key ]
		return cache[ key ]= func.apply( this, arguments )
	}
}



/* include( '../_base/FLazy.js' ); */

var FLazy= function( gen ){
	var value= function(){
		value= gen()
		return value.apply( this, arguments )
	}
	return function(){
		return value.apply( this. arguments )
	}
}



/* include( '../_base/FPipe.js' ); */

FPipe= function( ){
	var list= arguments
	var len= list.length
	return function( data ){
		for( var i= 0; i < len; ++i ) data= list[ i ].call( this, data )
		return data
	}
}


/* include( '../_base/FPoly.js' ); */

var FPoly= function(){
	var map= arguments
	return function(){
		return map[ arguments.length ].apply( this, arguments )
	}
}



/* include( '../_base/FProp.js' ); */

var FProp= function( value ){
	return FPoly
	(   function(){
			return value
		}
	,	function( val ){
			value= val
			return this
		}
	)
}



/* include( '../_base/FTrottler.js' ); */

var FTrottler= function( latency, func ){
	var timer= 0
    return function(){
    	if( timer ) timer= clearTimeout( timer )
    	timer= setTimeout( func, latency )
    }
}



/* include( '../_base/FValue.js' ); */

var FValue= function( val ){
	return function(){
		return val
	}
}



/* include( '../i-field-text/i-field-text.js' ); */

CComponent( 'i:field-text', function( el ){
	var lang= CHiqus( el.className ).get( 'lang' )
	var input= el.getElementsByTagName( 'textarea' )[0]
	input.style.display= 'none'
	var editor= document.createElement( 'i:field-text-content' )
	editor.innerHTML= input.value
	editor.contentEditable= true
	el.appendChild( editor )

	var html2text= function( str ){
		noLFCR:     str= str.split( /[\n\r]+/ ).join( '' )
		BR2CR:      str= str.replace( /<br ?\/?>/gi, '\n' )
		stripTags:  str= str.split( /<.*?>/ ).join( '' )
		decodeNBSP: str= str.split( '&nbsp;' ).join( ' ' )
		decodeGT:   str= str.split( '&gt;' ).join( '>' )
		decodeLT:   str= str.split( '&lt;' ).join( '<' )
		decodeAMP:  str= str.split( '&amp;' ).join( '&' )
		return str
	}

	var selected= FPoly
	(	function(){
			if( document.selection ){
				var sel= document.selection
				return sel.createRange()
			} else {
				var sel= window.getSelection()
				return sel.rangeCount
				?	sel.getRangeAt(0)
				:	null
			}
		}
	,	function( range ){
			if( range.select ) range.select()
			else {
				var sel= window.getSelection()
		        sel.removeAllRanges()
		        sel.addRange( range )
		    }
		}
	)

    var traverse= function( root, handler ){
    	if( handler( root ) ) return true
    	var child= root.firstChild
    	while( child ){
    		if( traverse( child, handler ) ) return true
    		child= child.nextSibling
    	}
    	return false
    }

    var nodeLength= function( node ){
    	switch( node.nodeName ){
    		case '#text': return node.nodeValue.length
    		case 'BR': return 1
    		default: return 0
    	}
    }

	var pos= FPoly
	(	function(){
			var range= selected()
			if( !range ) return null

			if( range.move ){
                range.moveStart( 'character', -10000 )
                return html2text( range.htmlText ).length
			}

	        var target= range.endContainer;
	        var offset= range.endOffset;

	        if( target.nodeName !== '#text' ) {
	            target= target.childNodes[ offset ]
	            offset= 0
	        }

	        var found= traverse( editor, function( node ){
	        	if( node === target ) return true
	        	offset+= nodeLength( node )
	        });

	        return found ? offset : null;
		}
	,	function( offset ){
			if( pos === null ) return
	        var target= editor;

			if( target.createTextRange ){
				var range= target.createTextRange()
				range.move( 'character', offset )
				selected( range )
				return
			}

	        traverse( target, function( node ){
	        	var length= nodeLength( node );
	            target= node
	            if( offset <= length ) return true;
	            offset-= length;
	        })

			var range= document.createRange()
			if( target.nodeName === 'BR' ){
				range.setEndAfter( target )
				range.setStartAfter( target )
			} else {
				range.setEnd( target, offset )
				range.setStart( target, offset )
			}
			range.collapse( false )

	        selected( range )
	    }
	)

	var normalize= function(){

		Opera_Hack:
		var brs= editor.getElementsByTagName( 'br' )
		for( var i= 0; i < brs.length; ++i ){
			var br= brs[i]
			var prev= br.previousSibling
			if( prev && prev.nodeName !== 'BR' ) continue
			br.parentNode.insertBefore( document.createTextNode( '' ), br )
		}

		WebKit_Hack:
		var childLength= editor.childNodes.length
		if( childLength ){
			var lastChild= editor.childNodes[ childLength - 1 ]
			if( lastChild.nodeName !== 'BR' ) editor.appendChild( document.createElement( 'br' ) )
		}

	}

	var htmlLast
	var highlight= FTrottler( 40, function(){
		var htmlNew= editor.innerHTML
		if( htmlNew === htmlLast ) return
		var langContent= HLight.lang[ lang ] || HLight.lang.text
		var textNew= html2text( htmlNew )
		input.value= textNew
		htmlNew= langContent( textNew )
		input.value= htmlNew
		var p= pos()
		editor.innerHTML= htmlNew
		htmlLast= editor.innerHTML
		normalize()
		pos( p )
	})
	highlight()

	var observe= function( node, event, handler ){
		if( node.attachEvent ){
			node.attachEvent( 'on' + event, handler )
			return
		}
		node.addEventListener( event, handler, false )
	}

	observe( editor, 'keypress', function( evt ){
		if( !evt ) evt= event
		switch( evt.keyCode ){
			case 13:
				var range= selected()
				if( range.pasteHTML ){
					range.pasteHTML( '<br />' )
					evt.returnValue= false
				} else {
					range.deleteContents()
					var br= document.createElement( 'br' )
					range.insertNode( br )
					range.selectNode( br )
					evt.preventDefault()
				}
				range.collapse( false )
				selected( range )
				break;
		}
		highlight()
	})

	observe( editor, 'keyup', function( evt ){
		if( !evt ) evt= event
		switch( evt.keyCode ){
		}
		highlight()
	})

})



/* include( '../i-hlight-/i-hlight.js' ); */

var HLight= {}

HLight.lang= {}

HLight.lang.text= function( str ){
	return String( str || '' )
	.split( '&' ).join( '&amp;' )
	.split( '>' ).join( '&gt;' )
	.split( '<' ).join( '&lt;' )
	.split( '\n' ).join( '<br />' )
}

HLight.TagWrapper= function( name ){
	var open= '<' + name + '>'
	var close= '</' + name + '>'
	return function( str ){
		return open + str + close
	}
}

HLight.FConcurentLang= function( map ){
	var syntaxes= []
	for( var syntax in map ) syntaxes.push( syntax )
	var parser= RegExp( '([\\s\\S]*?)((' + syntaxes.join( ')|(' ) + ')|$)', 'g' )
//	console.log( parser );
	var proc= function( str, prefix, content ){
		prefix= HLight.lang.text( prefix || '' )
		if( !content ) return prefix
		var argN= 4
		var synN= 0
		while( synN < syntaxes.length ){
            var handler= map[ syntaxes[ synN ] ]
            if( arguments[ argN - 1 ] ){
	            var args= [].slice.call( arguments, argN, argN + handler.length )
	            content= handler.apply( this, args )
	            return prefix + content
	        } else {
                argN+= handler.length + 1
                ++synN
	        }
		}
	}
	return FCached( function( str ){
		return String( str || '' ).replace( parser, proc )
	})
}

HLight.revert= function( str ){
	noLFCR:     str= str.split( /\r/ ).join( '' )
	stripTags:  str= str.split( /<.*?>/ ).join( '' )
	decodeNBSP: str= str.split( '&nbsp;' ).join( ' ' )
	decodeGT:   str= str.split( '&gt;' ).join( '>' )
	decodeLT:   str= str.split( '&lt;' ).join( '<' )
	decodeAMP:  str= str.split( '&amp;' ).join( '&' )
	return str
}

CComponent( 'i:hlight', function( el ){
	var lang= CHiqus( el.className ).get( 'lang' )
	var hlight= HLight.lang[ lang ] || HLight.lang.text
	el.innerHTML= hlight( HLight.revert( el.innerHTML ) )
})



/* include( '../i-hlight-bb/i-hlight-bb.js' ); */

with( HLight ) lang.bb= FPipe( FConcurentLang( new function(){

	var wrapGhost= TagWrapper( 'i:hlight-bb-ghost' )

	this[ '(\\[(b)\\])([\\s\\S]*?)(\\[\\/b\\])' ]=
	this[ '(\\[(i)\\])([\\s\\S]*?)(\\[\\/i\\])' ]=
	this[ '(\\[(u)\\])([\\s\\S]*?)(\\[\\/u\\])' ]=
	function( prefix, mode, content, postfix ){
		var tagMod=
		{	b: 'bold'
		,	i: 'italic'
		,	u: 'underline'
		}[ mode ]
		content= TagWrapper( 'i:hlight-bb-' + tagMod )( lang.bb( content ) )
		prefix= wrapGhost( prefix )
		postfix= wrapGhost( postfix )
		return prefix + content + postfix
	}

}), TagWrapper( 'i:hlight-bb' ))



/* include( '../i-hlight-code/i-hlight-code.js' ); */

with( HLight ) lang.code_sign= FCached
(	FPipe
	(   lang.text
	,	TagWrapper( 'i:hlight-code-sign' )
	)
)

with( HLight ) lang.code= FCached( function( str ){
	return String( str || '' )
	.replace
	(	/^(\n?#![^\n]*(\w{2,})[^\n]*)?([\s\S]*)$/
	,	function( str, sign, langName, content ){
			var langContent= lang[ langName ] || lang.text
			sign= sign ? lang.code_sign( sign ) : ''
			content= langContent( content )
			return sign + content
		}
	)
})



/* include( '../i-hlight-js/i-hlight-js.js' ); */

with( HLight ) lang.js= FPipe( FConcurentLang( new function(){

	var wrapRemark= TagWrapper( 'i:hlight-js-remark' )
	this[ '\\/\\*([\\s\\S]*?)\\*\\/' ]= function( content ){
		content= lang.text( content )
		return wrapRemark( '/*' + content + '*/' )
	}
	this[ '\\/\\/([\\s\\S]*?)(?=\\n|$)' ]= function( content ){
		content= lang.text( content )
		return wrapRemark( '//' + content )
	}

	var wrapString= TagWrapper( 'i:hlight-js-string' )
	this[ '"([^\\n]*?)"' ]= function( content ){
		content= lang.text( content )
		return wrapString( '"' + content + '"' )
	}

	var wrapKeyword= TagWrapper( 'i:hlight-js-keyword' )
	this[ '\\b(this|function|new|var|if|else|switch|case|default|for|in|while|do|with|boolean|continue|break|throw|true|false|try|catch|null|typeof|instanceof|return|delete)\\b' ]= function( content ){
		content= content || ''
		return wrapKeyword( content )
	}
}), TagWrapper( 'i:hlight-js' ) )



/* include( '../i-hlight-md/i-hlight-md.js' ); */

with( HLight ) lang.md_inline= FConcurentLang( new function(){
	var wrapGhost= TagWrapper( 'i:hlight-md-ghost' )
	var wrapQuote= TagWrapper( 'i:hlight-md-quote' )
	var wrapRemark= TagWrapper( 'i:hlight-md-remark' )
	var wrapStrong= TagWrapper( 'i:hlight-md-strong' )
	var wrapEm= TagWrapper( 'i:hlight-md-em' )
	var wrapCode= TagWrapper( 'i:hlight-md-code' )
	var wrapLink= TagWrapper( 'i:hlight-md-link' )

	this[ '((?:ftp|http):\\/\\/\\S+)' ]= function( href ){
		href= wrapLink( lang.text( href ) )
		return href
	}
	this[ '(""|\\*\\*|//|``)' ]= function( str ){
		return str.charAt(0) + wrapGhost( str.charAt(1) )
	}
	this[ '(^|[\\s\\n])"([^"\\s](?:[\\s\\S]*?[^"\\s])?)"(?=[\\s,.;\\n]|$)' ]= function( prefix, content ){
		prefix= lang.text( prefix )
		content= lang.md_inline( content )
		return prefix + wrapQuote( '"' + content + '"' )
	}
	this[ "(^|[\\s\\n])'([^'\\s](?:[\\s\\S]*?[^'\\s])?)'(?=[\\s,.;\\n]|$)" ]= function( prefix, content ){
		prefix= lang.text( prefix )
		content= lang.md_inline( content )
		return prefix + wrapQuote( "'" + content + "'" )
	}
	this[ '«([\\s\\S]+?)»' ]= function( content ){
		content= lang.md_inline( content )
		return wrapQuote( '«' + content + '»' )
	}
	this[ '(^|[\\s\\n])\\(([^\\(\\s](?:[\\s\\S]*?[^\\)\\s])?)\\)(?=[\\s,.;\\n]|$)' ]= function( prefix, content ){
		prefix= lang.text( prefix )
		content= lang.md_inline( content )
		return prefix + wrapRemark( '(' + content + ')' )
	}
	this[ '(^|[\\s\\n])\\*([^*\\s](?:[\\s\\S]*?[^*\\s])?)\\*(?=[\\s,.;\\n]|$)' ]= function( prefix, content ){
		prefix= lang.text( prefix )
		content= wrapStrong( lang.md_inline( content ) )
		var marker= wrapGhost( '*' )
		return prefix + marker + content + marker
	}
	this[ '(^|[\\s\\n])/([^/\\s](?:[\\s\\S]*?[^/\\s])?)/(?=[\\s,.;\\n]|$)' ]= function( prefix, content ){
		prefix= lang.text( prefix )
		content= wrapEm( lang.md_inline( content ) )
		var marker= wrapGhost( '/' )
		return prefix + marker + content + marker
	}
	this[ '`([\\s\\S]+?)`' ]= function( content ){
		content= wrapCode( lang.text( content ) )
		var marker= wrapGhost( '`' )
		return marker + content + marker
	}
})

with( HLight ) lang.md= FConcurentLang( new function(){
	var wrapGhost= TagWrapper( 'i:hlight-md-ghost' )
	var wrapBlock= TagWrapper( 'i:hlight-md-block' )

	var brIn= '\n'
	var brOut= lang.text( brIn )
	var FirstBREnshurer= function( func ){
		return function( content ){
			var firstBR= ( content.charAt(0) === brIn )
			if( !firstBR ) content= brIn + content
			content= func.call( this, content )
			if( !firstBR ) content= content.replace( brOut, '' )
			return content
		}
	}
	var RecursiveBlock= function( marker, name, contentLang ){
		var markerIn= brIn + marker
		var markerOut= brOut + lang.text( marker )
		var markerOutGhost= wrapGhost( markerOut )
		var blockWrap= TagWrapper( name )
		return FirstBREnshurer( function( content ){
			content= content.split( markerIn ).join( brIn )
			content= lang[ contentLang ]( content )
			content= content.split( brOut ).join( markerOutGhost )
			content= blockWrap( content )
			return content
		})
	}
	this[ '(^|\\n)(!{1,3} )([^\\n]*)' ]= function( prefix, marker, content ){
		var level= marker.length - 1
		prefix= lang.text( prefix )
		marker= wrapGhost( marker )
		content= TagWrapper( 'i:hlight-md-header-' + level )( lang.md_inline( content ) )
		return prefix + marker + content
	}
	this[ '((?:(?:^|\\n)> [^\\n]*)+)' ]= RecursiveBlock( '> ', 'i:hlight-md-quote', 'md' )
	this[ '((?:(?:^|\\n)  [^\\n]*)+)' ]= RecursiveBlock( '  ', 'i:hlight-md-code', 'code' )
	this[ '((?:(?:^|\\n)\\t[^\\n]*)+)' ]= RecursiveBlock( '\t', 'i:hlight-md-code', 'code' )
	this[ '((?:(?:^|\\n)\\* [^\\n]*)+)' ]= RecursiveBlock( '\*', 'i:hlight-md-list-item', 'md' )
	this[ '((?:(?:^|\\n)(?!> |\t|  |\\* )[^\\n]+)+)' ]= function( content ){
		content= wrapBlock( lang.md_inline( content ) )
		return content
	}
})



/* include( '../i-noframe/i-noframe.js' ); */

CComponent( 'i:noframe', function( el ){

	var nodeLoader= FLazy( function(){
		var node= el.getElementsByTagName( 'iframe' )[0]
		return FValue( node )
	})
	var nodeContent= FLazy( function(){
		var node= document.createElement( 'i:noframe-content' )
		el.appendChild( node )
		return FValue( node )
	})
	var docLoaded= function(){
    	return nodeLoader().contentWindow.document
	}
	var bodyLoaded= function(){
    	var doc= docLoaded()
    	var body= doc.getElementsByTagName( 'body' )[0]
    	return body
	}

    var updateContent= function(){
    	var body= bodyLoaded()
    	var content= nodeContent()
    	content.innerHTML= ''
    	var frag= docLoaded().createDocumentFragment()
		var child; while( child= body.firstChild ) frag.appendChild( child )
		content.appendChild( frag )
		el.className+= ' loaded=true'
		var hrefLoaded= docLoaded().location.href
		var hrefCurrent= document.location.href
		var links= document.links
		for( var i= 0; i < links.length; ++i ){
			var link= links[i]
			if( link.href === hrefCurrent ) link.className+= ' target=true'
			if( link.target !== nodeLoader().name ) continue
			if( link.href === hrefLoaded ) link.className+= ' target=true'
			else link.className= link.className.replace( /\btarget=true\b/, '' )
		}
		document.title= docLoaded().title
    }

    var loader= nodeLoader()
    loader.attachEvent
    	? loader.attachEvent( 'onload', updateContent )
    	: loader.onload= updateContent
    if( bodyLoaded() ) updateContent()

})
