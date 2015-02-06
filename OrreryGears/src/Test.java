
public class Test {
	static Gear gear1 = new Gear(50);
	static Gear gear2 = new Gear(100);
	static Gear gear3 = new Gear(50);

	public static void main(String arg[]) {
		
		gear1.addToSisters(gear2);
		gear2.addToChildren(gear3);

		Interaction.interact(gear1, 10);

		System.out.println(gear1.teethNum);
		for (Gear gear : gear1.sisters) {
			System.out.println(gear.teethNum);
		}
		for (Gear gear : gear2.children) {
			System.out.println(gear.teethNum);
		}
		System.out.println(Gear.isSisters(gear1, gear2));
		System.out.println(Gear.isSisters(gear1, gear3));
		System.out.println(Gear.isParent(gear1, gear2));
		System.out.println(Gear.isParent(gear2, gear3));
		System.out.println(gear1.rotateNum);
		System.out.println(gear2.rotateNum);
		System.out.println(gear3.rotateNum);
	}

}
