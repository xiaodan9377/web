var isIE = testIE();
var pageW = 0;
var cols = 0;
var main_top = 0;
var first_run = true;
var windowWidth = $(window).width();
var projectFullHeight = 0;
var newpage = false;
var spaceMaker = false;


/////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
	$(document).trigger("pageReady");
	$(document).trigger("initNextProject");
	
	$(document).trigger("contentResize");
	$(window).resize(function() {
		if($("#freshbox").length <= 0) {
			// Adjust the width of items container on window resize
	    	windowWidth = $(window).width();
	    	if($("#maincontainer.page_container").length == 0) {
	    		$(document).trigger("contentResize");
	    	}
	    }
    });
    
	$(".nav_wrapper").append($(".header_img, .nav_container"));
	
	// Temporary things.
	$(".nav_container").append($(".view_tag_info"));
	
	
	$(".thumb_tag").each(function() {
		if (!$("a", this).length > 0) {
			$(this).remove();
		}
	});
	
	// Thumbnail interventions	
	$(".project_thumb").click(function(e){ 
		var linkTarget = e.target;
		linkTarget = linkTarget+" ";
		if (linkTarget.indexOf('http') < 0) {
			$("a[rel=history]", this).click();
		}
	});

	$("#page_1 .project_thumb").each(function() {
		var thumbHeight = $(".cardimgcrop img", this).height();
			thumbHeight = thumbHeight - 134;
			thumbHeight = thumbHeight / 2;
		if(spaceMaker) $(this).css({"marginBottom" : thumbHeight, "marginTop" : thumbHeight});
	});
	
	if ($(".permalink_page").length == 0) {
		// This hack gets around masonry choking the browser
		if($("#page_1").css("display") == "none") {
			$("#page_1").css({
				"display" : "block",
				"visibility" : "hidden"
			});
			$(document).trigger("contentResize");
			$(document).trigger("contentResize",[true, true, 1]);
			$("#page_1").css({
				"display" : "none",
				"visibility" : "visible"
			});
		} else {
			doMason("1");	
		}
	}
	
	// Footer area
	$("#page_footer").append($(".cargo_link"));
	$("body").append($("#page_footer"));
	
	paginationArrows();
	
	$("body").css("visibility", "visible");
});
///////////////////////////////////////////////////////////////////////////////////////////////////
function doMason(which_page) {
	if(isNaN(parseInt(which_page))) which_page = $("#current_page").val();
	$("#page_"+which_page).masonry({
		singleMode: false,
		itemSelector: '.project_thumb',
 		resizeable: true,
		animate: false,
		saveOptions: true
	});
	
	$("#page_"+which_page+" .project_thumb").each(function() {
		var thumbHeight = $(".cardimgcrop img", this).height();
			thumbHeight = thumbHeight - 134;
			thumbHeight = thumbHeight / 2;
		if(spaceMaker) $(this).css({"marginBottom" : thumbHeight, "marginTop" : thumbHeight});
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////
$(document).bind("projectCloseComplete", function(e, pid) {
	//if($("#page_"+$("#current_page").val()).css("display") == "none") doMason($("#current_page").val());
	doMason($("#current_page").val());
});
///////////////////////////////////////////////////////////////////////////////////////////////////
$(document).bind("projectLoadComplete", function(e, dataObj) {
	if ($(".project_index").length > 0 && $(".project_next").length > 0) {
		$(".project_header div:first-child").addClass("last");
	}
	var remason = (newpage) ? true : false;
	$(document).trigger("contentResize",[true, remason, newpage]);
});
/////////////////////////////////////////////////////////////////////////////////////////////////
$(document).bind("pageChangeComplete", function(e, newpage) {
	paginationArrows();	
	var remason = (newpage) ? true : false;
	$(document).trigger("contentResize",[true, remason, newpage]);
});
/////////////////////////////////////////////////////////////////////////////////////////////////
$(document).bind("projectClose", function(e){
	$(document).trigger("contentResize");
});
///////////////////////////////////////////////////////////////////////////////////////////////////
function checkFixedBottom() {
	if($("body").height() < $(window).height()) {
		$("#page_footer").addClass("fixed");
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////
function getColumnCount() {
	var minCols = 3;
	var bodyWidth = $("body").width();
		bodyWidth = bodyWidth - 120;
	
	var thumbWidth = $("#page_"+$("#current_page").val()+" .project_thumb").outerWidth(true);
	var thumbCols = Math.floor(bodyWidth / thumbWidth);
		thumbCols = thumbCols < minCols ? minCols : thumbCols;

	return Array(thumbCols,thumbWidth,bodyWidth,minCols);
}
///////////////////////////////////////////////////////////////////////////////////////////////////
$(document).bind("contentResize", function(e, is_new, remason, new_page) {
	if(remason) doMason(newpage);
	
	// Adjust the width of the #items_container incrementally
	// to allow fluid width while retaining center position.
	var columnCount = getColumnCount();
	thumbCols = columnCount[0];
	thumbWidth = columnCount[1];
	bodyWidth = columnCount[2];
	minCols = columnCount[3];
	
	$("div[id^=page_]").each(function() { // select the proper page
		if($(this).css("display") != "none" && $(this).attr("id") != "page_footer") this_page = $(this);
	});
	
	var thumbBorderStyle = $(".project_thumb").css("borderRight");
	var new_entry_width = thumbWidth * thumbCols - thumbWidth - 60;
	
	if(new_entry_width != $("#content_container").width()) {
		var items_width = (windowWidth < thumbWidth * minCols) ? (thumbWidth * minCols) : (thumbWidth * thumbCols);
		if(thumbWidth > 100) {
			$("#content_container").css("width", items_width);
		}
	}
	
	$("body").css("visibility","visible");
});
/////////////////////////////////////////////////////////////////////////////////////////////////
function paginationArrows() {
	$(".prev_page").before("<span class='left_arrow'>&larr;</span> ");
	$(".next_page").after(" <span class='right_arrow'>&rarr;</span>");
}
/////////////////////////////////////////////////////////////////////////////////////////////////