import React, {
	SVGProps,
	PureComponent
} from 'react';
import PropTypes from 'prop-types';

interface ISelfProps {
	glyph?: string;
	width?: number;
	height?: number;
}

export type IProps = ISelfProps & SVGProps<SVGElement>;

const headBase = typeof document !== 'undefined'
	? document.querySelector('head > base')
	: null;
const shoudlPrepandPathname = headBase?.hasAttribute('href');
let iconClassName = null;

export function setIconClassName(className: string) {
	iconClassName = className;
}

export default class Icon extends PureComponent<IProps> {
	static propTypes = {
		'className': PropTypes.string,
		'style': PropTypes.object,
		'glyph': PropTypes.string,
		'width': PropTypes.number,
		'height': PropTypes.number,
		'tabIndex': PropTypes.number,
		'aria-hidden': PropTypes.bool,
		'role': PropTypes.string
	};

	static defaultProps = {
		glyph: '',
		tabIndex: -1
	};

	private useRef: SVGUseElement = null;
	private hrefListenerRemover: () => void = null;
	private readonly getUseRef = shoudlPrepandPathname ? (ref: SVGUseElement) => {
		this.useRef = ref;
	} : null;

	render() {
		const {
			className,
			style,
			glyph,
			width,
			height,
			tabIndex,
			'aria-hidden': ariaHidden,
			role,
			...props
		} = this.props;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const focusable: any = tabIndex < 0
			? {
				focusable: false
			}
			: {
				tabIndex
			};
		const hidden = typeof ariaHidden !== 'undefined'
			? ariaHidden
			: typeof role !== 'string';
		const href = this.getHref();

		return (
			<svg
				{...props}
				{...focusable}
				className={[className, iconClassName].filter(Boolean).join(' ')}
				style={{
					width,
					height,
					...style
				}}
				data-glyph={glyph}
				aria-hidden={hidden}
			>
				<use
					ref={this.getUseRef}
					xlinkHref={href}
					href={href}
				/>
			</svg>
		);
	}

	componentDidMount() {
		if (shoudlPrepandPathname) {
			this.setHref();
			this.hrefListenerRemover = addHrefListener(
				this.setHref.bind(this)
			);
		}
	}

	componentWillUnmount() {
		const {
			hrefListenerRemover
		} = this;

		if (shoudlPrepandPathname
			&& typeof hrefListenerRemover === 'function'
		) {
			hrefListenerRemover();
		}
	}

	// https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2
	private getPathname() {
		if (shoudlPrepandPathname) {
			return `${location.pathname}${location.search}`;
		}

		return '';
	}

	private getHref() {
		const {
			glyph
		} = this.props;

		return `${this.getPathname()}#${glyph}`;
	}

	private setHref() {
		const {
			useRef
		} = this;

		if (useRef) {
			const href = this.getHref();

			useRef.setAttribute('xlink:href', href);
			useRef.setAttribute('href', href);
		}
	}
}

const hrefListeners = [];

function addHrefListener(listener) {
	hrefListeners.push(listener);
	return hrefListeners.splice.bind(
		hrefListeners,
		hrefListeners.indexOf(listener),
		1
	);
}

if (shoudlPrepandPathname) {
	const hrefListenerTimeout = 1500;
	let prevHref = location.href;

	setInterval(() => {
		if (prevHref !== location.href) {
			prevHref = location.href;
			hrefListeners.forEach((listener) => {
				listener();
			});
		}
	}, hrefListenerTimeout);
}
