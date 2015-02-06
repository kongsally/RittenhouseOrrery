
public class Interaction {
	Gear root;

	public void interact(Gear root) {
		sisterInteract(root);
	}

	public void sisterInteract(Gear sister) {
		for (Gear sGear : root.sisters) {
			Gear.rotate (root, sGear);
			childrenInteract(sGear);
		}
	}

	public void childrenInteract(Gear child) {
		for (Gear cGear : root.sisters) {
			Gear.rotate (root, cGear);
			sisterInteract(cGear);
			childrenInteract(cGear);
		}
	}
}
