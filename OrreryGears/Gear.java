import java.util.ArrayList;


public class Gear {
	
	Gear root;
	String name;
	int radius;
	double teethNum;
	double rotateNum;
	double angularSpeed;
	boolean isMoved;
	ArrayList<Gear> sisters = new ArrayList<Gear>();
	ArrayList<Gear> children = new ArrayList<Gear>();
	

	public Gear(String name) {
		this.name = name;
		isMoved = false;
	}

	public Gear (int teethNum) {
		this.radius = radius;
	}
	
	public static boolean isSisters(Gear gear1, Gear gear2) {
		if (gear1.sisters.contains(gear2) || gear2.sisters.contains(gear1)) {
			return true;
		}
		else return false;
	}
	
	public static boolean isParent(Gear gear1, Gear gear2) {
		if (gear1.children.contains(gear2)) {
			return true;
		}
		else return false;
	}
	
	public static void rotate (Gear gear1, Gear gear2, int rotateNum) {
		gear1.rotateNum = rotateNum;
		if (isSisters(gear1, gear2)) {
			gear2.rotateNum = (double) (gear1.teethNum / gear2.teethNum) * gear1.rotateNum;
			gear2.angularSpeed = gear1.angularSpeed;
		}
		
		else if (isParent(gear1, gear2)) {
			gear2.rotateNum = gear1.rotateNum;
			gear2.angularSpeed = - (double) (gear1.teethNum / gear2.teethNum) * gear1.angularSpeed;
		}
		
	}

	public void addToSisters (Gear sister) {
		root.sisters.add(sister);
	}

	public void addToChildren (Gear child) {
		root.children.add(child);
	}
}
