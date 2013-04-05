var OSK_Helper = {

	init: function(){
		OSK_Helper.startSocket();
	},


	startSocket: function() {

		var socket = io.connect('http://localhost:3000');

		socket.on('disablePlace', function(data){
			console.log('disaplePlace: '+ data.place);
			$('#status_'+data.place).text('Zajęty').closest('tr').addClass('disabled');
		});

	}

}

$(document).ready(OSK_Helper.init);