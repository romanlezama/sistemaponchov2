<div class="row">
	<div class="col-md-4 ">
		<ul class="breadcrumb">
			<li><i class="fa fa-home"></i><a href="#">Home</a></li>
			<li class="active">Procesar Excel</li>
		</ul>
	</div>
	<div class="col-md-8 ">
	</div>
</div>

<!-- main -->
<div class="content">
	<div class="main-header">
		<h2>Procesar documento</h2>
		<em>Carga de Excel</em>
	</div>

	<div class="main-content">
		<div class="row">
			<div class="col-md-8" id="areaFormaCarga"></div>
		</div>
		<div class="tab-content profile-page">
			<!-- PROFILE TAB CONTENT -->
			<div class="tab-pane profile active" id="profile-tab">
				<div class="row">
					<p><i class="fa fa-calendar"></i> <strong>Fecha encontrada en el documento:</strong> <em id="dateDocto"></em></p>
				</div>
				<div class="row">
					<!--<div class="col-md-4">
						<div class="user-info-left" id="areaFormaCarga">
						</div>
					</div>-->
					<div class="col-md-4">
						<div class="user-info-right">
							<div class="basic-info">
								<h3><i class="fa fa-square"></i> Bombas</h3>
								<div id="bombas"></div>
							</div>
						</div>
					</div>
					<div class="col-md-8">
						<div class="user-info-right">
							<div class="basic-info">
								<h3><a href="javascript:fnGetClients()"><i class="fa fa-square"></i> Clientes</a></h3>
								<div id="clientes" style="margin-top:10px;"></div>
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
		forma.consulta_json( 'uploadxls', $("#areaFormaCarga") );
	});
	function fnGetClients(){
		oGenerales.fnConsultaCMD({cmd: 'GETCLIENTES'}, function(oClientes){
			console.log(oClientes);
			strClientes = '';
			$.each(oClientes, function(nombre, id){
                strClientes += '<li class="list-group-item">'+nombre+'</li>';
            });
			oGenerales.fnAlert({msg: strClientes, fnAccept:function(){
				$("#dialog-confirm").modal('hide');
			}});
		});
	}
</script>