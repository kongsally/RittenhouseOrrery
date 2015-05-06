
var paragraphs = [];
var editing = false;
var historyPs = [];

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