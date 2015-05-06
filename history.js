function signup() {
	var user = new Parse.User();
	user.set("username", $("#username").val());
	user.set("password", $("#password").val());

	user.signUp(null, {
	  success: function(user) {
	    // Hooray! Let them use the app now.
	    login();
	  },
	  error: function(user, error) {
	    // Show the error message somewhere and let the user try again.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

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
				$("#signout").show();
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
	$("#signout").css("display","none");
	$("#signin").show();
	var currentUser = Parse.User.current();  // this will now be null
}