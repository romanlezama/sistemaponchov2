<div class="row">
	<div class="col-md-4 ">
		<ul class="breadcrumb">
			<li><i class="fa fa-home"></i><a href="#">Home</a></li>
			<li class="active">Cargar Tickets</li>
		</ul>
	</div>
	<div class="col-md-8 ">
	</div>
</div>

<!-- main -->
<div class="content">
	<div class="main-header">
		<h2>CARGA DE FOLIOS TICKETS</h2>
		<em>Carga de Excel</em>
	</div>

	<div class="main-content">
		<div class="row">
			<div class="col-md-8" id="areaFormaCargaTickets"></div>
		</div>
		<div class="tab-content profile-page">
			<!-- PROFILE TAB CONTENT -->
			<div class="tab-pane profile active" id="profile-tab">
				<!--<div class="row">
					<p><i class="fa fa-calendar"></i> <strong>Fecha encontrada en el documento:</strong> <em id="dateDocto"></em></p>
				</div>-->
				<div class="row">
					<!--<div class="col-md-4">
						<div class="user-info-left" id="areaFormaCarga">
						</div>
					</div>-->
					<!--<div class="col-md-4">
						<div class="user-info-right">
							<div class="basic-info">
								<h3><i class="fa fa-square"></i> Bombas</h3>
								<div id="bombas"></div>
							</div>
						</div>
					</div>-->
					<div class="col-md-12">
						<div class="user-info-right">
							<div class="basic-info">
								<h3><i class="fa fa-square"></i> Tickets</h3>
								<div id="tickets" style="margin-top:10px;"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- END PROFILE TAB CONTENT -->
		</div>
	</div><!-- /main-content -->
</div><!-- /main -->
<script type="text/javascript">
	$(document).ready(function(e){
		forma.consulta_json( 'uploadtickets', $("#areaFormaCargaTickets") );
	});
</script>