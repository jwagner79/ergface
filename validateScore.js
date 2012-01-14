$(document).ready(function(){
// ====================================================== //

var jVal = {
	
	'scoreDate' : function (){
		
		$('body').append('<div id="birthInfo" class="info"></div>');

		var birthInfo = $('#birthInfo');
		var ele = $('#scoreDate');
		var pos = ele.offset();
		
		birthInfo.css({
			top: pos.top-3,
			left: pos.left+ele.width()+15
		});
		
		var pattern = new RegExp(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{4}\b/); 
		if(!pattern.test(ele.val())) {
			jVal.errors = true;
				birthInfo.removeClass('correct').addClass('error').html('&larr; must be format mm/dd/yyyy').show();
				ele.removeClass('normal').addClass('wrong');					
		} else {
				birthInfo.removeClass('error').addClass('correct').html('&radic;').show();
				ele.removeClass('wrong').addClass('normal');
		}
		
	},
	'validateSplit' : function() {
		$('body').append('<div id="splitInfo" class="info"></div>');

		var splitInfo = $('#splitInfo');
		var ele = $('#split');
		var pos = ele.offset();
		
		splitInfo.css({
			top: pos.top-3,
			left: pos.left+ele.width()+15
		});
		
		if (ele.val() == "") {
			jVal.split = false;
			return true;
		}
		
		var pattern = new RegExp(/\b\d{1}[:]\d{2}\b/); 
		if(!pattern.test(ele.val())) {
			jVal.errors = true;
				splitInfo.removeClass('correct').addClass('error').html('&larr; must be format m:ss').show();
				ele.removeClass('normal').addClass('wrong');					
		} else {
				splitInfo.removeClass('error').addClass('correct').html('&radic;').show();
				ele.removeClass('wrong').addClass('normal');
		}	
	},
	
	'validateDistance' : function() {
		$('body').append('<div id="distanceInfo" class="info"></div>');

		var distanceInfo = $('#distanceInfo');
		var ele = $('#distance');
		var pos = ele.offset();
		
		distanceInfo.css({
			top: pos.top-3,
			left: pos.left+ele.width()+15
		});
		
		if (ele.val() == "") {
			jVal.distance = false;
			return true;
		}
		
		var pattern = new RegExp(/\b\d{1,7}\b/);
		if(!pattern.test(ele.val())) {
			jVal.errors = true;
				distanceInfo.removeClass('correct').addClass('error').html('&larr; must be format dddd').show();
				ele.removeClass('normal').addClass('wrong');					
		} else {
				distanceInfo.removeClass('error').addClass('correct').html('&radic;').show();
				ele.removeClass('wrong').addClass('normal');
		}			
	},
	
	'validateTime' : function() {
		$('body').append('<div id="timeInfo" class="info"></div>');

		var info = $('#timeInfo');
		var ele = $('#time');
		var pos = ele.offset();
		
		info.css({
			top: pos.top-3,
			left: pos.left+ele.width()+15
		});
		
		if (ele.val() == "") {
			jVal.distance = false;
			return true;
		}
		
		var pattern  = new RegExp(/\b\d{1}[:]\d{2}\b/);
		if(!pattern.test(ele.val())) {
			jVal.errors = true;
				info.removeClass('correct').addClass('error').html('&larr; must be format dddd').show();
				ele.removeClass('normal').addClass('wrong');					
		} else {
				info.removeClass('error').addClass('correct').html('&radic;').show();
				ele.removeClass('wrong').addClass('normal');
		}			
	},
	
	'sendIt' : function (){
		if(!jVal.errors) {
			$('#newScore').submit();
		}
	},
	 'setToday' : function() {
		 var ele = $('#scoreDate');
		 var date = new Date();
		 var month = date.getMonth() + 1;
		 var days = date.getDate();
		 var year = date.getFullYear();
		 ele.val(month + "/" + days + "/" + year);
	 }
};
jVal.setToday();

// ====================================================== //

$('#send').click(function (){
	var obj = $.browser.webkit ? $('body') : $('html');
	obj.animate({ scrollTop: $('#newScore').offset().top }, 750, function (){
		jVal.errors = false;
		jVal.scoreDate();
		jVal.validateSplit();
		jVal.validateDistance();
		jVal.sendIt();
	});
	return false;
});

$('#scoreDate').change(jVal.scoreDate);

// ====================================================== //
});