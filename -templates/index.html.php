<!DOCTYPE html>
<html
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:std="http://sairi-na-tenshi.github.com/wc/std"
	>
<head>
	<title>Web Components Index</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<link href="../-/index.css" rel="stylesheet" />
	<!--[if IE ]><script src="../-/compiled.vml.js"></script><![endif]-->
	<script src="../-/index.js" type="text/javascript"></script>
</head>
<body>
	<std:topmenu>
		<? foreach( $pageList as $page ): ?>
			<a href="<?= $page['link']; ?>">
				<?= $page['title']; ?>
			</a>
		<? endforeach; ?>
	</std:topmenu>
</body>
</html>
