var Gear = function (name, teethNum) {
	this.name = name;
	this.size = 0;
	this.teethNum = teethNum;
	this.rotateNum = 0;
	this.sisters = [];
	this.children = [];
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

/*isSisters check two gears (gear1 and gear2) 
whether they belongs to each others' sister array or not. */
function isSisters (gear1, gear2) {
	if (contains(gear1.sisters, gear2) || contains(gear2.sisters, gear1)) {
		return true;
	}
	else return false;
}

/*isParent check whether gear1 is the parent gear of gear2;
namely, whether gear2 is in the children array of gear1. */
function isParent (gear1, gear2) {
	if (contains(gear1.children, gear2)) {
			return true;
		}
		else return false;
}
/*addToSisters add a sister gear to the current gear (gear struture) called root*/
function addToSisters (root, sister) {
	root.sisters.push(sister);
}

/*addToSisters add a child gear to the current gear (gear struture) called root*/
function addToChildren (root, child) {
	root.children.push(child);
}

/*rotate takes in two gear (gear1 and gear2) and
first check their relationships (namely sisters or children/parent) and
then change the 'rotateNum' for certain gears*/
function rotate (gear1, gear2) {
	if (isSisters(gear1, gear2)) {
			gear2.rotateNum = (gear2.teethNum / gear1.teethNum) * gear1.rotateNum;
		}
		else if (isParent(gear1, gear2)) {
			gear2.rotateNum = - gear1.rotateNum;
		}
}

/*sisterInteract takes in a gear root 
and loop over all its sisters on the roate function*/
function sisterInteract (root) {
	for (var i = 0; i < root.sisters.length; i++) {
		rotate (root, root.sisters[i]);
		childrenInteract(root.sisters[i]);
	}
}

/*childInteract takes in a gear root 
and loop over all its children on the roate function
as well as call rotateSister on all its children*/
function childrenInteract (root) {
	for (var i = 0; i < root.children.length; i++) {
		rotate (root, root.children[i]);
		sisterInteract (root.children[i]);
		childrenInteract (root.children[i]);
	}
}

/*general function for giving a root gear, a roateNum
and move the whole gear tree structure*/
function interact (root, rotateNum) {
	root.rotateNum = rotateNum;
	sisterInteract(root);
}

/*examples for testing purposes*/
/*example 1: 
gear1 is the root;
gear2 is the sister of gear1;
gear3 is the child of gear2 */

var gear1 = new Gear(50);
var gear2 = new Gear(100);
var gear3 = new Gear(50);
console.log(gear2);

addToSisters(gear1, gear2);
addToChildren(gear2, gear3);

interact(gear1,10);
console.log(gear1);
console.log(gear2);
console.log(gear3);
