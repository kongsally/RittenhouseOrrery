
public class Interaction {

	public static void interact(Gear root, int rotateNum) {
		root.rotateNum = rotateNum;
		sisterInteract(root);
	}

	public static void sisterInteract(Gear root) {
		for (Gear sGear : root.sisters) {
			Gear.rotate (root, sGear);
			childrenInteract(sGear);
		}
	}

	public static void childrenInteract(Gear root) {
		for (Gear cGear : root.children) {
			Gear.rotate (root, cGear);
			sisterInteract(cGear);
			childrenInteract(cGear);
		}
	}
}
