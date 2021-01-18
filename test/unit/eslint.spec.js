import {
	join
} from 'path';
import {
	ESLint
} from 'eslint';

function getMessages(errors) {
	return [].concat(
		...errors.map(_ => _.messages)
	);
}

describe('@trigen/eslint-config', () => {
	const eslint = new ESLint();

	describe('javascript', () => {
		it('should validate', async () => {
			const results = await eslint.lintFiles([
				join(__dirname, 'eslint', 'javascript', 'valid.js')
			]);
			const messages = getMessages(
				ESLint.getErrorResults(results)
			);

			expect(messages.length).toBe(0);
		});

		it('should invalidate', async () => {
			const results = await eslint.lintFiles([
				join(__dirname, 'eslint', 'javascript', 'invalid.js')
			]);
			const messages = getMessages(
				ESLint.getErrorResults(results)
			);

			expect(messages.length).toBe(19);
		});
	});

	describe('commonjs', () => {
		it('should validate', async () => {
			const results = await eslint.lintFiles([
				join(__dirname, 'eslint', 'commonjs', 'valid.js')
			]);
			const messages = getMessages(
				ESLint.getErrorResults(results)
			);

			expect(messages.length).toBe(0);
		});
	});

	describe('typescript', () => {
		it('should validate', async () => {
			const results = await eslint.lintFiles([
				join(__dirname, 'eslint', 'typescript', 'valid.ts')
			]);
			const messages = getMessages(
				ESLint.getErrorResults(results)
			);

			expect(messages.length).toBe(0);
		});

		it('should invalidate', async () => {
			const results = await eslint.lintFiles([
				join(__dirname, 'eslint', 'typescript', 'invalid.ts')
			]);
			const messages = getMessages(
				ESLint.getErrorResults(results)
			);

			expect(messages.length).toBe(6);
		});
	});
});
