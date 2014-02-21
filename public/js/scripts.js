var OSK_Helper = {

	init: function(){
		OSK_Helper.startSocket();
	},


	startSocket: function() {
		var socket = io.connect(window.location.origin);

		socket.on('disablePlace', function(data){
			console.log('disablePlace: '+ data.place);
			$('#status_'+data.place).html('<b>Zajęty</b>').closest('tr').addClass('disabled');
		});

		socket.on('enablePlace', function(data){
			console.log('enablePlace: '+ data.place);
			$('#status_'+data.place).html('Wolny').closest('tr').removeClass('disabled');
		});

	}

}

$(document).ready(OSK_Helper.init);