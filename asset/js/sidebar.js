$(function(){
	$("#sidebar").load("asset/html/sidebar.html"); 
	var pathname = window.location.pathname;
  	pathname = pathname.replace('.html', '');
  	pathname = pathname.replace('/', '');
  	setTimeout(function(){
	  	$('#'+pathname).addClass('active');
  	}, 20);
});