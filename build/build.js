const fs = require('fs');
const parser = require('./parser');

const Build = {
	init: function () {
		Build._readCsv();
	},

	_readCsv: function () {
		fs.readFile('redirects.csv', 'utf-8', Build._parseCsv);
	},

	_parseCsv: function (error, csvString) {
		if (error) {
			throw error;
		} else {
			let csvData = parser.parse(csvString);

			// Remove header rows
			csvData.splice(0, 1);

			Build._createRedirects(csvData);
		}
	},

	_createRedirects: function (csvData) {
		csvData.forEach(row => Build._createRedirect(row));
	},

	_createRedirect: function (csvRow) {
		let redirectFrom = csvRow[0];
		let redirectTo = csvRow[1];

		let redirectPath = redirectFrom.replace(/^https?:\/\/(\w+\.)?\w+\.\w+/, '');

		redirectPath = './' + redirectPath.replace(/\\/g, '/').toLowerCase();

		fs.mkdir(
			redirectPath,
			{ recursive: true },
			Build._createRedirectFile(redirectPath, redirectTo)
		);
	},

	_createRedirectFile: function (redirectPath, redirectTo) {
		return function (error) {
			if (error) {
				throw error;
			} else {
				let fileContents = Build._createRedirectFileContents(redirectTo);

				fs.writeFile(redirectPath + '/index.html', fileContents, Build._redirectCreated);
			}
		};
	},

	_redirectCreated: function (error) {
		if (error) {
			throw error;
		}
	},

	_createRedirectFileContents: function (redirectTo) {
		let fileContents = `<html>
<head>
	<title>Redirect</title>
	<meta http-equiv="refresh" content="0;URL='${redirectTo}'" />
</head>
<body>
</body>
</html>`;

		return fileContents;
	}
};

Build.init();
