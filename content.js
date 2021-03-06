function r(num){
	return (Math.round(num*100)/100+0.01).toFixed(2);
}

function login(){
	if($('.ssc-lifg').size()) {
		$('#ssc-liu').val(localStorage.bf_user);
		$('#ssc-lipw').val(localStorage.bf_pass);
		$('#ssc-lis').click();
	}	
	
}

$(function(){
	login();
});

setInterval(function(){

	login();
	
	$.getScript('https://bot-ao.com/betfair/ids.php',function(){
		var ids=[];
		$(JSON.parse(localStorage.ids) ).each(function(){
			ids.push(this.marketId);
		})
		if(ids.length==0) {
			console.log('sem apostas');
			return;
		}
		
		$.ajax({
		   url: 'https://ero.betfair.com/www/sports/exchange/readonly/v1/bymarket?alt=json&currencyCode=BRL&locale=pt_BR&marketIds='+ids.join(',')+'&rollupLimit=50&rollupModel=STAKE&types=RUNNER_EXCHANGE_PRICES_BEST',
		   xhrFields: {
			  withCredentials: true
		   },
		   success:function(res){
			   console.log(res);
			   
			   var data=[];
			   $(res.eventTypes[0].eventNodes).each(function(){
				   if ( !('availableToBack' in  this.marketNodes[0].runners[1].exchange) ) return;
				   if ( !('availableToLay' in  this.marketNodes[0].runners[1].exchange) ) return;
				   
				   data.push({
					   marketId: this.marketNodes[0].marketId,
					   selectionId: this.marketNodes[0].runners[1].selectionId,
					   odds: r((2*this.marketNodes[0].runners[1].exchange.availableToBack[0].price+this.marketNodes[0].runners[1].exchange.availableToLay[0].price)/3)
				   });
			   });
			   $.getScript('https://bot-ao.com/betfair/apostar.php?data='+JSON.stringify(data));
		   }
		});
	});
},60*1000);




