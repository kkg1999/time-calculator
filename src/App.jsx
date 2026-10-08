import { useState } from 'react'

function parseTimeToMinutes(timeStr) {
  const [hstr, mstr] = timeStr.split(':');
  const hours = Number(hstr);
  const minutes = Number(mstr);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
    throw new Error('Invalid time format');
  }

  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hStr = hours.toString().padStart(2, '0');
  const mStr = mins.toString().padStart(2, '0');
  return `${hStr}:${mStr}`;
}

// NEW: supports both add and subtract
function calculateEndTime(startTimeStr, durationStr, operation) {
  const startMins = parseTimeToMinutes(startTimeStr);

  const [dHrsStr, dMinsStr] = durationStr.split(':');
  const dHrs = Number(dHrsStr);
  const dMins = Number(dMinsStr);

  if (isNaN(dHrs) || isNaN(dMins) || dHrs < 0 || dMins < 0 || dMins >= 60) {
    throw new Error('Invalid duration format');
  }

  const durationTotalMins = dHrs * 60 + dMins;

  let resultMins;
  if (operation === 'add') {
    resultMins = startMins + durationTotalMins;
  } else if (operation === 'subtract') {
    resultMins = startMins - durationTotalMins;
  } else {
    throw new Error('Unknown operation');
  }

  // For now, we’re not handling negative results or > 24h wraparound.
  if (resultMins < 0 || resultMins > 23 * 60 + 59) {
    throw new Error('Result outside a single day (not supported yet).');
  }

  return formatMinutesToTime(resultMins);
}

export default function App() {
  const [startTime, setStartTime] = useState("12:00");
  const [duration, setDuration] = useState("09:00");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // CHANGED: takes operation instead of event
  function handleCalculate(operation) {
    try {
      const endTime = calculateEndTime(startTime, duration, operation);
      setResult(endTime);
      setError("");
    } catch (err) {
      setResult("");
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Time Calculator</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Start time (HH:MM):{" "}
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            step="60"
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Duration (HH:MM):{" "}
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="01:30"
          />
        </label>
      </div>

      {/* NEW: two buttons instead of one submit */}
      <div style={{ marginBottom: "1rem" }}>
        <button type="button" onClick={() => handleCalculate('add')}>
          Add
        </button>{" "}
        <button type="button" onClick={() => handleCalculate('subtract')}>
          Subtract
        </button>
      </div>

      {result && (
        <p>
          Result: <strong>{result}</strong>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
