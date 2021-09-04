<div class="row">
	<div class="col-md-4 ">
		<ul class="breadcrumb">
			<li><i class="fa fa-home"></i><a href="#">Home</a></li>
			<li class="active">Crear Cliente</li>
		</ul>
	</div>
	<div class="col-md-8 ">
	</div>
</div>

<!-- main -->
<div class="content">
	<div class="main-header">
		<h2>Crear Cliente</h2>
		<em>Crear nuevo registro de Clientes</em>
	</div>

	<div class="main-content">
		<div class="row">
			<div class="col-md-12" id="areaNuevoCliente">
				
			</div>
		</div>
	</div><!-- /main-content -->
</div><!-- /main -->
<script>
	$(document).ready(function(e){
		forma.consulta_json( 'nuevocliente', $("#areaNuevoCliente") );
	});
</script>