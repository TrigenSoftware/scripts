import fs from 'fs';
import {
	request
} from 'https';
import archiver from 'archiver';
import nodemailer from 'nodemailer';
import FormData from 'form-data';

const [
	dir
] = process.argv.slice(2);

if (!fs.existsSync(dir)) {
	process.exit();
}

const archive = archiver('zip', {
	zlib: {
		level: 9
	}
});

archive.directory(dir, false);
archive.finalize();

async function sendToEthereal() {

	const testAccount = await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass
		}
	});
	const info = await transporter.sendMail({
		to: 'publish@test.artifacts',
		text: `Artifacts: ${dir}`,
		attachments: [{
			filename: 'artifacts.zip',
			content: archive
		}]
	});

	console.log('Artifacts: %s', nodemailer.getTestMessageUrl(info));
}

function sendToFileio() {

	const form = new FormData();

	form.append('file', archive, {
		filename: 'artifacts.zip',
		contentType: 'application/zip'
	});

	const req = request('https://file.io/?expires=1d', {
		method: 'POST',
		headers: form.getHeaders()
	}, (response) => {

		const chunks = [];

		response.on('data', _ => chunks.push(_));
		response.on('end', () => {

			const result = JSON.parse(Buffer.concat(chunks).toString());

			console.log('Artifacts: %s', result.link);
		});
	});

	form.pipe(req);
}

if (process.env.USE_ETHEREAL) {
	sendToEthereal().catch(console.error);
} else {
	sendToFileio();
}
