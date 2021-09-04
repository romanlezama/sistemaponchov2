var menu = {
	getJson : function( menu ){
		$.ajax({
			url: "json/menus/menu_usr.json",
			cache: false,
			dataType: "json",
			success: function(data){
				console.log( data );
				var aMenu = data.menu;
				var sMenu = '<li class="active"><a href="#/dashboard/"><i class="fa fa-upload"></i><span class="text">Procesar Excel</span></a></li>';
				for(var i=0; i<aMenu.length; i++){
					var oOpcion = aMenu[i];
					var aSubOpciones = oOpcion.submenus;
					if( aSubOpciones.length > 0 ){
						sMenu += '<li ><a href="#" class="js-sub-menu-toggle"><i class="fa '+oOpcion.icon+'"></i><span class="text">'+oOpcion.leyendamenu+'</span><i class="toggle-icon fa fa-angle-left"></i></a>';
						var sSubMenu = '<ul class="sub-menu">';
						for( var j=0; j<aSubOpciones.length; j++ ){
							var oSubOpcion = aSubOpciones[j];
							sSubMenu += '<li ><a href="'+oSubOpcion.accionmenu+'"><span class="text">'+oSubOpcion.leyendamenu+'</span></a></li>';
						}
						sSubMenu += '</ul>';
						sMenu += sSubMenu+'</li>';
					} else{
						sMenu += '<li ><a href="'+oOpcion.accionmenu+'"><i class="fa '+oOpcion.icon+'"></i><span class="text">'+oOpcion.leyendamenu+'</span></a></li>';
					}
				}
				$(".main-menu").html( sMenu );
				$('.main-menu .js-sub-menu-toggle').click( function(e){
					e.preventDefault();
					$li = $(this).parents('li');
					if( !$li.hasClass('active')){
						$li.find('.toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
						$li.addClass('active');
					}
					else {
						$li.find('.toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
						$li.removeClass('active');
					} 

					$li.find('.sub-menu').slideToggle(300);
				});

				$('.js-toggle-minified').clickToggle(
					function() {
						$('.left-sidebar').addClass('minified');
						$('.content-wrapper').addClass('expanded');

						$('.left-sidebar .sub-menu')
						.css('display', 'none')
						.css('overflow', 'hidden'); 
						
						$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
					},
					function() {
						$('.left-sidebar').removeClass('minified');
						$('.content-wrapper').removeClass('expanded');
						$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
					}
				);

				// main responsive nav toggle
				$('.main-nav-toggle').clickToggle(
					function() {
						$('.left-sidebar').slideDown(300)
					},
					function() {
						$('.left-sidebar').slideUp(300);
					}
				);
			},
			error: function(){
				console.error("Ocurrió un error al cargar el menú.");
			}
		});
	}
};

menu.getJson();