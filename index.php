<?php

$reqFile= $_SERVER[ 'QUERY_STRING' ];

if( $reqFile === basename( __FILE__ ) ):
    highlight_file( __FILE__ );
	die();
endif;

$storedDir= getcwd();
chdir( dirname( __FILE__ ) );

$rootURI=
'//' . $_SERVER['SERVER_NAME']
. ':' . $_SERVER['SERVER_PORT']
. dirname( $_SERVER['SCRIPT_NAME'] ) . '/'
;

$packDirList= filterFileList( glob( "*", GLOB_BRACE | GLOB_ONLYDIR ) );

function filterFileList( $list ){
	return preg_grep( '!(?:^|/)[-.]!m', $list, PREG_GREP_INVERT );
}
function collect( $fileName ){
	$fileList= glob( "*/{$fileName}", GLOB_BRACE );
	$fileList= filterFileList( $fileList );
	sort( $fileList );
    return $fileList;
}

foreach( $packDirList as $packDir ):
	chdir( $packDir );

	@mkdir( '-', 0777, true );

	# CSS

    $fileList= collect( '*.css' );
	$fileCount= count( $fileList );
	$pageLimit= 30;

	if( $fileCount > pow( $pageLimit, 2 ) ) throw new Exception( 'too many css files' );

	if( $fileCount < $pageLimit ):
		$index= preg_replace( '!(.+)!', '../$1', $fileList );
	else:
		$index= array();
		for( $page= 0; ( $page * $pageLimit ) < $fileCount; ++$page ):
			$index[]= "page_{$page}.css";
		endfor;
	endif;

	$index= preg_replace( '!(.+)!', '@import url( "$1" );', $index );
	$index= implode( $index, "\n" );
	file_put_contents( "-/index.css", $index );

	if( $fileCount >= $pageLimit ):
		for( $page= 0; ( $page * $pageLimit ) < $fileCount; ++$page ):
			$pageFileList= array_slice( $fileList, $page * $pageLimit, $pageLimit );
			$pageFileList= implode( preg_replace( '!(.+)!', '@import url( "../$1" );', $pageFileList ), "\n" );
			file_put_contents( "-/page_{$page}.css", $pageFileList );
		endfor;
	endif;

	$compiled= array();
	foreach( $fileList as $file ):
		$compiled[]= "/* @import url( '../{$file}' ); */";
		$compiled[]= file_get_contents( $file ) . "\n";
	endforeach;
	$compiled= implode( $compiled, "\n\n" );
	file_put_contents( "-/compiled.css", $compiled );

	# JS

    $fileList= collect( '*.js' );

	$index= preg_replace( '!(.+)!', '( "../$1" )', $fileList );
	array_unshift( $index, "( function( path ){ document.write( '<script src=\"{$rootURI}{$packDir}/-/' + path + '\"></script>' ); return arguments.callee } )" );
	$index= implode( $index, "\n" );
	file_put_contents( "-/index.js", $index );

	$compiled= array();
	foreach( $fileList as $file ):
		$compiled[]= "/* include( '../{$file}' ); */";
		$compiled[]= file_get_contents( $file ) . "\n";
	endforeach;
	$compiled= implode( $compiled, "\n\n" );
	file_put_contents( "-/compiled.js", $compiled );

	# VML

    $fileList= collect( '*.vml' );

	$replaces= array( '"' => '\\"', '\\' => '\\\\', "\r" => "", "\n" => "\" +\n\"" );
	$compiled= array( 'document.write("' );
	foreach( $fileList as $file ):
		$compiled[]= strtr( "\n<!-- include '../{$file}' -->\n" . file_get_contents( $file ), $replaces );
	endforeach;
	$compiled[]= '")';
	$compiled= implode( $compiled, "" );
	file_put_contents( "-/compiled.vml.js", $compiled );

	# HTML

    $fileList= collect( '*.html' );

	$pageList= array();
	foreach( $fileList as $file ):
		$pageList[]= array(
			'link' => '../' . $file,
			'title' => DOMDocument::load( $file )->getElementsByTagName( 'title' )->item(0)->nodeValue,
		);
	endforeach;
	ob_start();
		include( 'index.tpl' );
	$index= ob_get_clean();

	file_put_contents( "-/index.html", $index );


	chdir( '..' );
endforeach;

chdir( $storedDir );

if( $reqFile ):
	?><!doctype html>
	<style> * { margin: 0; padding: 0; border: none; width: 100%; height: 100% } html, body { overflow: hidden } </style>
	<iframe src="<?= $reqFile; ?>" frameborder="0"></iframe>
	<?
endif;
