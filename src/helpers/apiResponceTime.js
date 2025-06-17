const fs = require('fs');
const path = require('path');

const responseLogFile = path.join(__dirname, '../../apiResponseTimes.log');

// Ensure the log file exists; if not, create an empty one
if (!fs.existsSync(responseLogFile)) {
  fs.writeFileSync(responseLogFile, 'Route                                     Response Time (ms)     Label\n');
}

function padString(str, length) {
  return str.length > length ? str.substring(0, length - 3) + '...' : str.padEnd(length, ' ');
}

function logResponseTimes(responseTimes) {
  let logEntries = '';

  responseTimes.forEach(rt => {
    const route = padString(rt.route, 40); // Adjust width as needed
    const time = rt.time.toString().padEnd(20, ' ');
    const label = rt.label.padEnd(10, ' ');

    logEntries += `${route}${time}${label}\n`;
  });

  try {
    fs.appendFileSync(responseLogFile, logEntries);
  } catch (err) {
    console.error('Error writing to response log file:', err);
  }
}

module.exports = {
  logResponseTimes,
};
