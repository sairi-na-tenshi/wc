<?php # vml-suki # rev: 5 # license: public domain

# входные параметры
$mode= @$_GET['mode'] or $mode= 'compiled';
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
$files= glob( "??*/*/*.vml", GLOB_BRACE );
sort( $files );

# компиляция в один файл
$compile= array( 'document.write("' );
$replaces= array( '"' => '\\"', '\\' => '\\\\', "\n" => "\" +\n\"" );
foreach( $files as $file ):
	$compile[]= strtr( "\n<!-- include '../../{$file}' -->\n" . file_get_contents( $file ), $replaces );
endforeach;
$compile[]= '")';
$compile= implode( $compile, "" );
file_put_contents( "-/-/compiled_vml.js", $compile );

# браузеру отдаётся ссылка на нужный файл
switch( $mode ){
	case 'compiled':
		$location= "{$name}/-/-/{$mode}_vml.js";
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
    source - исходник vml-suki
    compiled - ссылка на содержимое всех файлов одной простынёй
