<!DOCTYPE html PUBLIC "-//TENSHI//DTD XHTML11 plus VML//EN" "http://mojura.110mb.com/i-component/xhtml11-vml.dtd" >
<html
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:v="urn:schemas-microsoft-com:vml"
	xmlns:i="urn:markup:iface"
	>
<head>
	<title>UI Components Index</title>
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<link href="../-/index.css" rel="stylesheet" />
	<!--[if IE ]><script src="../-/compiled.vml.js"></script><![endif]-->
	<script src="../-/index.js" type="text/javascript"></script>
</head>
<body>
		<? foreach( $pageList as $page ): ?>
			<a href="<?= $page['link']; ?>">
				<i:docpage-menu-item><?= $page['title']; ?></i:docpage-menu-item>
			</a>
		<? endforeach; ?>
</body>
</html>
