<div id="loading_overlay">
	<div class="loading_message round_bottom">
		<img src="img/loading.gif" alt="loading">
	</div>
</div>
<!-- Modal -->
<div id="dialog-filtro" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Filtrar información</h4>
      </div>
      <div class="modal-body" id="espacio_filtro"></div>
      <div class="modal-footer" id="dialog-filtro-footer"></div>
    </div>
  </div>
</div>
<!-- Modal -->
<div class="modal fade" id="dialog-form" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title" id="title_popup">Cargando contenido</h4>
            </div>
            <div class="modal-body" id="dialog-form-content">
                <p>Some text in the modal.</p>
            </div>
        </div>
    </div>
</div>
<!-- Modal confirm -->
<div class="modal fade" id="dialog-confirm" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Alerta</h4>
            </div>
            <div class="modal-body" id="dialog-alert-content"></div>
            <div class="modal-footer" id="modal-footer-btns">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-info" id="dialog-alert-aceptar">Aceptar</button>
            </div>
        </div>
    </div>
</div>

<!-- WRAPPER -->
<div class="wrapper">
	
	<!-- TOP GENERAL ALERT -->
	<div class="alert alert-danger top-general-alert">
		<span>If you <strong>can't see the logo</strong> on the top left, please reset the style on right style switcher (for upgraded theme only).</span>
		<a type="button" class="close">&times;</a>
	</div>
	<!-- END TOP GENERAL ALERT -->

	<!-- TOP BAR -->
	<div class="top-bar">
		<div class="container">
			<div class="row">
				<!-- logo -->
				<div class="col-md-2 logo">
					<!--<a href="#/dashboard/"><img src="img/logo_blanco.png" alt="KingAdmin - Admin Dashboard" class="logo-img" /></a>
					<h1 class="sr-only">Ingenia</h1>-->
				</div>
				<!-- end logo -->
				<div class="col-md-10">
					<div class="row">
						<div class="col-md-3"></div>
						<div class="col-md-9">
							<div class="top-bar-right">
								<!-- responsive menu bar icon -->
								<a href="#" class="hidden-md hidden-lg main-nav-toggle"><i class="fa fa-bars"></i></a>
								<!-- end responsive menu bar icon -->
								<div class="notifications">
									<ul>
										<!-- notification: general -->
										<!--<li class="notification-item general">
											<div class="btn-group">
												<a href="#" class="dropdown-toggle" data-toggle="dropdown">
													<i class="fa fa-bell"></i><span class="count">2</span>
													<span class="circle"></span>
												</a>
												<ul class="dropdown-menu" role="menu">
													<li class="notification-header">
														<em>Usted tiene 2 notificaciones</em>
													</li>
													<li>
														<a href="#">
															<i class="fa fa-user green-font"></i>
															<span class="text">Nuevo usuario registrado</span>
														</a>
													</li>
													<li>
														<a href="#">
															<i class="fa fa-edit yellow-font"></i>
															<span class="text">Pendiente de aceptar transferencia</span>
														</a>
													</li>
													<li class="notification-footer">
														<a href="#">Ver todas las notificaciones</a>
													</li>
												</ul>
											</div>
										</li>-->
										<!-- end notification: general -->
									</ul>
								</div>

								<!-- logged user and the menu -->
								<!--<div class="logged-user">
									<div class="btn-group">
										<a href="#" class="btn btn-link dropdown-toggle" data-toggle="dropdown">
											<img src="img/perfil/perfil-google.jpg" class="foto-perfil" />
											<span class="name">Admin</span> <span class="caret"></span>
										</a>
										<ul class="dropdown-menu" role="menu">
											<li>
												<a href="/#/perfil/">
													<i class="fa fa-user"></i>
													<span class="text">Perfil</span>
												</a>
											</li>
											<li>
												<a href="#">
													<i class="fa fa-power-off"></i>
													<span class="text">Salir</span>
												</a>
											</li>
										</ul>
									</div>
								</div>-->
								<!-- end logged user and the menu -->
							</div><!-- /top-bar-right -->
						</div>
					</div><!-- /row -->
				</div>
			</div><!-- /row -->
		</div><!-- /container -->
	</div><!-- /top -->
	

	<!-- BOTTOM: LEFT NAV AND RIGHT MAIN CONTENT -->
	<div class="bottom">
		<div class="container">
			<div class="row">
				<!-- left sidebar -->
				<div class="col-md-2 left-sidebar">

					<!-- main-nav -->
					<nav class="main-nav">
						
						<ul class="main-menu"></ul>
					</nav><!-- /main-nav -->

					<div class="sidebar-minified js-toggle-minified">
						<i class="fa fa-angle-left"></i>
					</div>
				</div>
				<!-- end left sidebar -->
				<!-- content-wrapper -->
				<div class="col-md-10 content-wrapper" id="espacio">
				</div><!-- /content-wrapper -->
			</div><!-- /row -->
		</div><!-- /container -->
	</div>
	<!-- END BOTTOM: LEFT NAV AND RIGHT MAIN CONTENT -->
	<div class="push-sticky-footer"></div>
</div><!-- /wrapper -->
<script src="js/menu.js"></script>