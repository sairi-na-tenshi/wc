(new function(){
	var scripts= document.getElementsByTagName('script')
	var script= scripts[ scripts.length -1 ]
	var dir= script.getAttribute( 'src' ).replace( /[^\/]+$/, '' )
    return function( path ){
    	document.write( '<script src="' + dir + path + '"></script>' )
    	return arguments.callee
    }
})
<? foreach( $scriptList as $path ): ?>
( "<?= $path; ?>" )
<? endforeach; ?>