var Gear = function (teethNum) {
	this.name = '';
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

function isSisters (gear1, gear2) {
	if (contains(gear1.sisters, gear2) || contains(gear2.sisters, gear1)) {
		return true;
	}
	else return false;
}

function isParent (gear1, gear2) {
	if (contains(gear1.children, gear2)) {
			return true;
		}
		else return false;
}

function addToSisters (root, sister) {
	root.sisters.push(sister);
}

function addToChildren (root, child) {
	root.children.push(child);
}

function rotate (gear1, gear2) {
	if (isSisters(gear1, gear2)) {
			gear2.rotateNum = (gear2.teethNum / gear1.teethNum) * gear1.rotateNum;
		}
		else if (isParent(gear1, gear2)) {
			gear2.rotateNum = - gear1.rotateNum;
		}
}

function sisterInteract (root) {
	for (var i = 0; i < root.sisters.length; i++) {
		rotate (root, root.sisters[i]);
		childrenInteract(root.sisters[i]);
	}
}

function childrenInteract (root) {
	for (var i = 0; i < root.children.length; i++) {
		rotate (root, root.children[i]);
		sisterInteract (root.children[i]);
		childrenInteract (root.children[i]);
	}
}

function interact (root, rotateNum) {
	root.rotateNum = rotateNum;
	sisterInteract(root);
}

