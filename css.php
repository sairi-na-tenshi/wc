<?php # css-suki # rev: 2 # license: public domain

# входные параметры
$mode= @$_GET['mode'] or $mode= 'index';
if( $mode === 'source' ) highlight_file( __FILE__ ) and die();
$name= preg_replace( '![^\w-]+!', '', @$_GET['name'] ) or $name= 'main';

# константы
$pageLimit= 30;

# подготовка файловой системы
chdir( $name );
@mkdir( '-', 0777, true );
@mkdir( '-/-', 0777, true );

# составление списка файлов пакета
$files= glob( "??*/*/*.css", GLOB_BRACE );
sort( $files );
$filesCount= count( $files );
if( $filesCount > pow( $pageLimit, 2 ) ) print 'too many files' and die();

# компиляция в один файл
$compile= array();
foreach( $files as $file ):
	$compile[]= "/* @import url( '../../{$file}' ); */";
	$compile[]= file_get_contents( $file ) . "\n";
endforeach;
$compile= implode( $compile, "\n\n" );
file_put_contents( "-/-/compiled.css", $compile );

# формирование индекса
if( $filesCount < $pageLimit ):
	$index= preg_replace( '!(.+)!', '../../$1', $files );
else:
	$index= array();
	for( $page= 0; ( $page * $pageLimit ) < $filesCount; ++$page ):
		$index[]= "page={$page}.css";
	endfor;
endif;

# сохранение индекса на диск
$index= preg_replace( '!(.+)!', '@import url( "$1" );', $index );
$index= implode( $index, "\n" );
file_put_contents( "-/-/index.css", $index );

# нарезание списка файлов на страницы и запись их на диск
if( $filesCount >= $pageLimit ):
	for( $page= 0; ( $page * $pageLimit ) < $filesCount; ++$page ):
		$pageFiles= array_slice( $files, $page * $pageLimit, $pageLimit );
		$pageFiles= implode( preg_replace( '!(.+)!', '@import url( "../../$1" );', $pageFiles ), "\n" );
		file_put_contents( "-/-/page={$page}.css", $pageFiles );
	endfor;
endif;

# браузеру отдаётся ссылка на нужный файл
switch( $mode ){
	case 'index': case 'compiled':
		$location= "{$name}/-/-/{$mode}.css";
		header( "Content-Type: text/css", true, 200 );
		echo "@import url( '{$location}' );\n";
		break;
	default:
		echo "wrong mode";
}

exit(); ?>

параметры:
    mode - режим работы
    name - имя пакета

режимы работы:
    source - исходник css-suki
    index - ссылка на индексный файл подключающий все файлы, принеобходимости разбивает вывод на страницы
    compiled - ссылка на содержимое всех файлов одной простынёй
