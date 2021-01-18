
interface IMetaObject {
	a?: boolean;
	b?: number;
	c?: string[];
}

const meta: IMetaObject = {
	a: true,
	c: []
};

export {
	meta
};

function EmptyDecorator() {
	console.info(EmptyDecorator);
}

export class TestMemberOrdering {
	static method() {
		console.info(this);
	}

	static field = 'Hey!';

	@EmptyDecorator
	decoratedMethod() {
		this.privateMethod();
	}

	instanceMethod() {
		this.privateMethod();
	}

	@EmptyDecorator
	decoratedMethod2() {
		this.privateMethod();
	}

	instanceMethod2() {
		this.privateMethod();
	}

	private privateMethod() {
		console.info(this);
	}
}
