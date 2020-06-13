
export function my_test()
{
  return true
}

const testConst = 2;

let testLet = 3;

if (testConst == 2) {
	testLet = testConst;
} else
if (testConst == 3) {
	testLet = testConst * 2;
} else {
	testLet = 404;
}
switch (testLet) {
	case 404:
		myTest();
	case 404:
		myTest();
		break;
	default:
		break;
}

my_test.apply(undefined, [])
