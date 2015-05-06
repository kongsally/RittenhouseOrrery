
var paragraphs = [];
var editing = false;
var historyPs = [];
var signinToggle = false;
var isAdmin = false;

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
}

function editDescription() {

	paragraphs = [];
	historyPs = $("#historyP").children();

	if(!editing) {
		$("#editDescription").html("Save");
		for(var i = 0; i < historyPs.length; i++) {
			paragraphs.push(historyPs[i].innerHTML);
			$("#" + historyPs[i].id).css("display", "none");
			$("#editsP").append("<textarea id='e" + historyPs[i].id + 
				"'rows='10' cols='100'>" + "</textarea>");
			$("#e" + historyPs[i].id).val(paragraphs[i]);
		}
	} else {
		saveDescriptions();
		$("#editsP").empty();
		for(var i = 0; i < historyPs.length; i++) {
			$("#" + historyPs[i].id).css("display", "block");
		}
		$("#editDescription").html("Edit Description");
	}

	editing = !editing;
}

function saveDescriptions() {
	editPs = $("#editsP").children();
	console.log(editPs);
	for(var i = 0; i < editPs.length; i++) {
		console.log(historyPs[i]);
		historyPs[i].innerHTML = $("#" + editPs[i].id).val();
	}
}