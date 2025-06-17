const fs = require('fs');
const path = require('path');

require("dotenv").config();

const logFilePath = path.resolve(__dirname, '../../app.log');

// Function to read and parse log file
function readLogFile() {
  try {
    const logData = fs.readFileSync(logFilePath, 'utf8');
    const logEntries = logData.split('\n').filter(entry => entry.trim() !== '').map(entry => {
      try {
        // Adjusted regular expression to match the provided log format
        const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+Z) \[ERROR\] (.*) \(Status Code: (\d{3})\) \(Error Path: (.*)\)/;
        const matches = entry.match(regex);
        if (!matches) return null;

        const timestamp = new Date(matches[1]).toLocaleString(); // Convert timestamp to local format
        const message = matches[2];
        const statusCode = matches[3];
        const errorPath = matches[4];

        // Skip entries where error path is '/favicon.ico'
        if (errorPath.includes('/favicon.ico')) return null;

        return {
          timestamp,
          message,
          statusCode,
          errorPath,
        };
      } catch (error) {
        console.error('Error parsing log entry:', error);
        return null; // Handle parsing errors
      }
    }).filter(entry => entry !== null);

    return logEntries;
  } catch (error) {
    console.error('Error reading log file:', error);
    return [];
  }
}

// Function to generate HTML for log table
function generateLogTable(logEntries) {
  if (logEntries.length === 0) {
    return '<p>No recent log entries found.</p>';
  }

  let tableHtml = `
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Status Code</th>
          <th>Message</th>
          <th>Error Path</th>
        </tr>
      </thead>
      <tbody>
  `;

  logEntries.forEach(entry => {
    tableHtml += `
      <tr>
        <td>${entry.timestamp}</td>
        <td>${entry.statusCode}</td>
        <td>${entry.message}</td>
        <td>${entry.errorPath}</td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
  `;

  return tableHtml;
}

function generateResponseTimesTable(responseTimes) {
  if (responseTimes.length === 0) {
    return '<p>No response time data available.</p>';
  }

  let tableHtml = `
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Response Time (ms)</th>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
  `;

  responseTimes.forEach(entry => {
    // Determine CSS class based on label value
    let labelClass = entry.label === "High" ? "high-label" : "";

    // Construct table row with conditional class
    tableHtml += `
      <tr class="${labelClass}">
        <td>${entry.route}</td>
        <td>${entry.time}</td>
        <td>${entry.label}</td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
  `;

  return tableHtml;
}

// Function to generate the HTML page
function serverHomePage(req, responseTimes) {
  const logEntries = readLogFile();
  const logTableHtml = generateLogTable(logEntries);
  const responseTimesTableHtml = generateResponseTimesTable(responseTimes);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${process.env.PROJECT_NAME} Server</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to right, #ff7e5f, #feb47b);
            font-family: Arial, sans-serif;
            margin: 0;
          }
          .container {
            text-align: center;
            background: white;
            padding: 2em;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 800px;
            width: 100%;
            margin: auto;
          }
          h1 {
            font-size: 2.5em;
            margin: 0.5em 0;
          }
          .high-label {
            background-color: red; /* or any other style you want to apply */
            color: white; /* optional: white text on red background */
          }
          p {
            font-size: 1.2em;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="container animate__animated animate__bounce">
          <h1>${req.t(`${process.env.PROJECT_NAME} Server is alive!`)}</h1>
          <p>Welcome to our awesome server!</p>
          <div id="response-times">
            <h2>API Response Times</h2>
            ${responseTimesTableHtml}
          </div>
          <div id="log-table">
            <h2>Recent Log Entries</h2>
            ${logTableHtml}
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = serverHomePage;
