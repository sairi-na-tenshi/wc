document.write("" +
"<!-- include '../i-button/i-button-inner_shapetype.vml' -->" +
"<?import namespace=\"v\" implementation=\"#default#VML\" ?>" +
"<v:shapetype" +
"	id='i:button'" +
"	adj='4'" +
"	strokecolor='#666'" +
"	coordorigin='0 0'" +
"	coordsize='1000000 1000000'" +
"	>" +
"" +
"	<v:formulas>" +
"		<v:f eqn='val width'/>" +
"		<v:f eqn='val height'/>" +
"		<v:f eqn='prod @0 1 pixelwidth'/>" +
"		<v:f eqn='prod @1 1 pixelheight'/>" +
"		<v:f eqn='sum pixelwidth 0 #0'/>" +
"		<v:f eqn='sum pixelheight 0 #0'/>" +
"		<v:f eqn='prod #0 @2 1'/>" +
"		<v:f eqn='prod #0 @3 1'/>" +
"		<v:f eqn='prod @4 @2 1'/>" +
"		<v:f eqn='prod @5 @3 1'/>" +
"	</v:formulas>" +
"" +
"	<v:path v='m @6,l @8,0 qx @0,@7 l @0,@9 qy @8,@1 l @6,@1 qx 0,@9 l 0,@7 qy @6,0 xe' />" +
"" +
"	<v:fill" +
"		type='gradient'" +
"		angle='180'" +
"		color='#fff'" +
"		color2='#ddd'" +
"		>" +
"	</v:fill>" +
"" +
"	<v:shadow" +
"		on='true'" +
"		type='double'" +
"		opacity='1'" +
"		color='#333'" +
"		color2='#999'" +
"		offset='1px 1px'" +
"		offset2='2px 2px'" +
"		>" +
"	</v:shadow>" +
"" +
"</v:shapetype>" +
"" +
"<!-- include '../i-cpanel/i-panel-shape_shapetype.vml' -->" +
"<?import namespace=\"v\" implementation=\"#default#VML\" ?>" +
"<v:shapetype" +
"	xmlns:v=\"urn:schemas-microsoft-com:vml\"" +
"	id='i-cpanel-shape'" +
"	adj='10'" +
"	strokecolor='#aaa'" +
"	coordorigin='0 0'" +
"	coordsize='1000000 1000000'" +
"	path=' m @6,0 l @8,0 qx @0,@7 l @0,@9 qy @8,@1 l @6,@1 qx 0,@9 l 0,@7 qy @6,0 x e '" +
"	>" +
"" +
"	<v:formulas>" +
"		<v:f eqn='val width'/>" +
"		<v:f eqn='val height'/>" +
"		<v:f eqn='prod @0 1 pixelwidth'/>" +
"		<v:f eqn='prod @1 1 pixelheight'/>" +
"		<v:f eqn='sum pixelwidth 0 #0'/>" +
"		<v:f eqn='sum pixelheight 0 #0'/>" +
"		<v:f eqn='prod #0 @2 1'/>" +
"		<v:f eqn='prod #0 @3 1'/>" +
"		<v:f eqn='prod @4 @2 1'/>" +
"		<v:f eqn='prod @5 @3 1'/>" +
"	</v:formulas>" +
"" +
"	<v:fill" +
"		type='gradient'" +
"		angle='270'" +
"		color='#ccc'" +
"		color2='#fff'" +
"		>" +
"	</v:fill>" +
"" +
"	<v:shadow" +
"		on='true'" +
"		type='double'" +
"		opacity='.5'" +
"		color='#ccc'" +
"		color2='#ddd'" +
"		offset='3px 3px'" +
"		offset2='4px 4px'" +
"		>" +
"	</v:shadow>" +
"" +
"</v:shapetype>" +
"")