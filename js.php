<?php # js-suki # rev: 3 # license: public domain

# входные параметры
$mode= @$_GET['mode'] or $mode= 'index';
if( $mode === 'source' ) highlight_file( __FILE__ ) and die();
$name= preg_replace( '![^\w-]+!', '', @$_GET['name'] ) or $name= 'main';
$prefix=
'//' . $_SERVER['SERVER_NAME']
. ':' . $_SERVER['SERVER_PORT']
. dirname( $_SERVER['SCRIPT_NAME'] ) . '/'
;

# подготовка файловой системы
chdir( $name );
@mkdir( '-', 0777, true );

# составление списка файлов пакета
$files= glob( "??*/*/*.js", GLOB_BRACE );
sort( $files );

# компиляция в один файл
$compile= array();
foreach( $files as $file ):
	$compile[]= "/* include( '../../{$file}' ); */";
	$compile[]= file_get_contents( $file ) . "\n";
endforeach;
$compile= implode( $compile, "\n\n" );
file_put_contents( "-/-/compiled.js", $compile );

# формирование индекса
$index= preg_replace( '!(.+)!', '( "../../$1" )', $files );
array_unshift( $index, "( function( path ){ document.write( '<script src=\"{$prefix}{$name}/-/-/' + path + '\"></script>' ); return arguments.callee } )" );
$index= implode( $index, "\n" );
file_put_contents( "-/-/index.js", $index );

# браузеру отдаётся ссылка на нужный файл
switch( $mode ){
	case 'index': case 'compiled':
		$location= "{$name}/-/-/{$mode}.js";
		header( "Content-Type: text/javascript", true, 200 );
		echo "document.write( \"<script src='{$prefix}{$location}'></script>\" );\n";
		break;
	default:
		echo "wrong mode";
}

exit(); ?>

параметры:
    mode - режим работы
    name - имя пакета

режимы работы:
    source - исходник js-suki
    index - ссылка на индексный файл подключающий все файлы
    compiled - ссылка на содержимое всех файлов одной простынёй
