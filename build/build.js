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
		let albumPath = csvRow[0];
		let redirectTo = csvRow[1];

		albumPath = './' + albumPath.replace(/\\/g, '/');

		fs.mkdir(
			albumPath,
			{ recursive: true },
			Build._createRedirectFile(albumPath, redirectTo)
		);
	},

	_createRedirectFile: function (albumPath, redirectTo) {
		return function (error) {
			if (error) {
				throw error;
			} else {
				let fileContents = Build._createRedirectFileContents(redirectTo);

				fs.writeFile(albumPath + '/index.html', fileContents, Build._redirectCreated);
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
