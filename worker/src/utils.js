
import fs from 'fs';
import path from 'path';

// ----------
// -- logs --
// ----------

const logDir = path.resolve('./logs');
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

function writeLog(message, from) {
	const logFile = path.join(logDir, `${from}.log`);
	const timestamp = new Date().toISOString();
	fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

// -------------
// -- request --
// -------------

const ancient_api_key = process.env.ANCIENT_API_KEY;
const ancient_api_url = process.env.ANCIENT_API_URL;

const api_url = 'http://localhost:8000/';


async function getByField(field) {
	const myHeaders = new Headers();
	myHeaders.append("X-Group-Authorization", ancient_api_key);

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
		redirect: "follow"
	};

	const response = await fetch(ancient_api_url + field, requestOptions);
	return await response.json();
}

async function getImageByFieldId(field, id) {
	const myHeaders = new Headers();
	myHeaders.append("X-Group-Authorization", ancient_api_key);

	const requestOptions = {
		method: "GET",
		headers: myHeaders,
		redirect: "follow"
	};

	try {
		const response = await fetch(`${ancient_api_url}${field}/${id}/image`, requestOptions);
		if (!response.ok) {
			writeLog(`⚠️ Impossible to get image for ${field} id=${id}`, field);
			return null;
		}
		return await response.text();
	} catch (error) {
		writeLog(`❌ Error when trying to get image ${field} id=${id} : ${error}`, field);
		return null;
	}
}


async function addInField(field, item) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(item),
		redirect: "follow"
	};

	try {
		const response = await fetch(api_url + field, requestOptions);
		const result = await response.text();
		writeLog(`✅ ${field} send :` + result, field);
	} catch (error) {
		writeLog(`❌ Error when sending a ${field} :` + error, field);
	}
}

export default { writeLog, getByField, addInField, getImageByFieldId }