
var paragraphs = [];
var editing = false;
var historyPs = [];
var signinToggle = false;
var isAdmin = false;
var historyObj;

//toggle sign-in with esc key
$(document).keyup(function(e) {
  if (e.keyCode == 27) {
  	if(!isAdmin) {
	  	if(!signinToggle) {
	  		$("#signin").css("display", "block");
	  	} else {
	  		$("#signin").css("display", "none");
	  	}
  	} else {
  		if(!signinToggle) {
  			$("#signout").css("display", "block");
  		} else {
  			$("#signout").css("display", "none");
  		}
  	}
  	signinToggle = !signinToggle;
 }
});

//initialize Parse
$(function(){
	Parse.initialize("vlxm5ebk6uC1dGyTpxHCdUFeUruXyzzMupZq28eB", "YW7U8uMUzlMspFam3lrAdbRYHCVnXuBRHAB4YnSM");
	var history = Parse.Object.extend("History");
	var query = new Parse.Query(history);
	query.equalTo("type", "history");
	query.find({
	  success: function(results) {
	  	historyObj = results[0];
	    paragraphs = results[0].attributes.texts;
	    loadDescriptions();
	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
});


function login() {
	Parse.User.logIn($("#username").val(), $("#password").val(), {
	  success: function(user) {
	    // Do stuff after successful login.
	    var currentUser = Parse.User.current();
			if (currentUser) {
		    	// do stuff with the user
				$("#username").val("");
				$("#password").val("");
				$("#signin").css("display","none");
				$("#signout").css("display", "block");
				if(currentUser.attributes.username === "admin") {
					isAdmin = true;
					$("#editDescription").css("display", "block");
				}
			
			} else {
		    	// show the signup or login page
			}
	  },
	  error: function(user, error) {
	    // The login failed. Check error to see why.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function signout() {
	Parse.User.logOut();
	isAdmin = false;
	if(editing) {
		saveDescriptions();
		$("#editsP").empty();
		for(var i = 0; i < historyPs.length; i++) {
			$("#" + historyPs[i].id).css("display", "block");
		}
		$("#editDescription").html("Edit Description");
	}
	$("#signout").css("display","none");
	$("#editDescription").css("display", "none");
	$("#addDescription").css("display", "none");
}

function loadDescriptions() {
	for(var i = 0; i < paragraphs.length; i++) {
		$("#historyP").append("<p id = 'p" + i + "'>" + 
			paragraphs[i] + "</p>");
		historyPs.push("p" + i);
	}
}

function editDescription() {
	if(!editing) {
		$("#editDescription").html("Save");
		$("#addDescription").css("display", "block");
		for(var i = 0; i < paragraphs.length; i++) {
			$("#" + historyPs[i]).css("display", "none");
			$("#editsP").append("<textarea id='e" + historyPs[i] + 
				"'rows='10' cols='100'>" + "</textarea>");
			$("#e" + historyPs[i]).val(paragraphs[i]);
		}
	} else {
		saveDescriptions();
		$("#editsP").empty();
		for(var i = 0; i < historyPs.length; i++) {
			$("#" + historyPs[i]).css("display", "block");
		}
		$("#editDescription").html("Edit Description");
		$("#addDescription").css("display", "none");
	}
	editing = !editing;
}

function saveDescriptions() {
	editPs = $("#editsP").children();
	for(var i = 0; i < historyPs.length; i++) {
		$("#" + historyPs[i])[0].innerHTML = $("#" + editPs[i].id).val();
		paragraphs[i] = $("#" + editPs[i].id).val();
	}
	historyObj.set("texts", paragraphs);
	historyObj.save();
}

function appendParagraph() {
	historyPs.push("p" + paragraphs.length);
	$("#historyP").append("<p id = 'p" + paragraphs.length + "'></p>");
	paragraphs.push("");
	$("#editsP").append("<textarea id='e" + historyPs[historyPs.length - 1] + 
				"'rows='10' cols='100'>" + "</textarea>");
}

