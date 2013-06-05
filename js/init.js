$(document).bind("mobileinit", function(){
  
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  $.mobile.page.prototype.options.domCache = false;
  
		
		
  $.mobile.page.prototype.options.backBtnText = "Back";
    //$.mobile.page.prototype.options.addBackBtn      = true;
    $.mobile.page.prototype.options.backBtnTheme    = "a";

    // Page
    $.mobile.page.prototype.options.headerTheme = "a";  // Page header only
    $.mobile.page.prototype.options.contentTheme    = "a";
    $.mobile.page.prototype.options.footerTheme = "a";

    // Listviews
    $.mobile.listview.prototype.options.headerTheme = "a";  // Header for nested lists
    $.mobile.listview.prototype.options.theme           = "a";  // List items / content
    $.mobile.listview.prototype.options.dividerTheme    = "d";  // List divider

    $.mobile.listview.prototype.options.splitTheme   = "a";
    $.mobile.listview.prototype.options.countTheme   = "a";
    $.mobile.listview.prototype.options.filterTheme = "a";
    $.mobile.listview.prototype.options.filterPlaceholder = "Filter data...";
});

$(window).on( "orientationchange", function( event ) {
	setWindow()
});



$(document).on( 'pageinit',function(event, data){

			
			onDeviceReady();
			
			setWindow();
			
			/* home button */
			$('.home').bind('touchstart mousedown', function(){
				sessionStorage.toPage = "user.html";
				$.mobile.changePage( "user.html", { transition: "fade", changeHash: false} );
			});
			
			
			/* eventList button */
			$('#eventListButton').bind('touchstart mousedown', function(){
				sessionStorage.toPage = "eventList.html";
				$.mobile.changePage( "eventList.html", { transition: "fade", changeHash: false} );
			});
			
			/* tagwallList button */
			$('#tagwallButton').bind('touchstart mousedown', function(){
				sessionStorage.toPage = "tagwallList.html";
				$.mobile.changePage( "tagwallList.html", { transition: "fade", changeHash: false} );
			});
			
			
			jQuery.validator.setDefaults({
				errorElement: "span",
				errorContainer: "#olebole",
				errorPlacement: function(error, element) {
					//$(element).parent().css({'background-color':'#ffc83c', });
					$(document).find('.ui-btn-active').removeClass('ui-btn-active');
					//$(element).html('ole');
					//error.appendTo(element.prev());
				},
				highlight: function(element) {
					$(element).parent().addClass("errorsField");
				},
				unhighlight: function(element) {
					$(element).parent().removeClass("errorsField");
					//$(element).parent().find(".validationError").hide();
					//$(element).parent().data('tooltip').getTip().css({'visibility':'visible'});
				}
			});
			
			
			$("#loginForm").validate({
				
				submitHandler: function(form) {
				
					var username = $('#loginForm #username').val();
					var password = $('#loginForm #password').val();
				
								
					$.ajax({
						url: 'http://bandplan/ios/fetchData.php?action=login&username='+username+'&password='+password+'',
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						success: function(data, status){
							
							sessionStorage.username = username;
							sessionStorage.password = password;
							sessionStorage.bandname = data.bandname;
							sessionStorage.bandId = data.bandId;
							sessionStorage.eventCount = data.eventCount;
							sessionStorage.tagwallCount = data.tagwallCount;
							
							console.debug(data);
							$.mobile.changePage( "user.html", { transition: "fade", changeHash: false} );
							
						},
						error: function(data, status){
							
						}
					});
				}
			});
			
			

			
			
			
			
			
			
});

$(document).on( 'pageshow',function(event, data){
	
	$("#" + event.target.id).find("[data-role=footer]").load("footer.html", function(){
		$("#" + event.target.id).find("[data-role=navbar]").navbar();
	});
	var headerText = (typeof sessionStorage.bandname == "undefined") ? "BandPlan Mobile" : sessionStorage.bandname
	$('[data-role="header"]').find('h3').text(headerText);
	
});

$(document).on('pageinit', '#eventListPage',  function(event, data){
	$.ajax({
		url: 'http://bandplan/ios/fetchData.php?action=eventList&bandId='+sessionStorage.bandId,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		success: function(data, status){
			var items = [];
		
			$.each(data, function(key, data) {
				items.push('<li id="' + data.id + '"><a href="#">' + data.playPlace + '</a></li>');
			});
			$('#eventListList').html(items);
			$('#eventListList').trigger('create');    
			$('#eventListList').listview('refresh');
		},
		error: function(data, status){
			
		}
	});
});

$(document).on('pageinit', '#tagwallPage',  function(event, data){
	$.ajax({
		url: 'http://bandplan/ios/fetchData.php?action=tagwall&limit=10&bandId='+sessionStorage.bandId,
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		success: function(data, status){
			var items = [];
			$.each(data, function(key, data) {
				items.push('<li id="' + data.id + '"><a href="#">' + data.headline + ' <span class="tagwallAuthor">af '+ data.userId +'</span></a></li>');
			});
			$('#tagwallListList').html(items);
			$('#tagwallListList').trigger('create');    
			$('#tagwallListList').listview('refresh');
		},
		error: function(data, status){
			
		}
	});
});



function onDeviceReady() {   

    $('body').animate({
    	opacity: 1
    }, 1500, function() {
	    
    });
    
    checkAuthedUser(sessionStorage.username, sessionStorage.password);
}

function checkAuthedUser(username, password) {
	
	$.ajax({
		url: 'http://bandplan/ios/fetchData.php?action=login&username='+username+'&password='+password+'',
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		success: function(data, status){
			var toPage = sessionStorage.toPage;
			typeof toPage === 'undefined' ? $.mobile.changePage("user.html", {reverse: false, changeHash: false}) : $.mobile.changePage(toPage, {reverse: false, changeHash: false})
		},
		error: function(data, status){
			$.mobile.changePage('login.html', {reverse: false, changeHash: false});
		}
	});
	//console.debug(ole);
}

function setWindow() {
	var the_height = ($(window).height() - $(this).find('[data-role="header"]').height() - $(this).find('[data-role="footer"]').height());
  	$(document).find('[data-role="content"]').height(the_height);
}

