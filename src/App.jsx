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

function addTime(startTimeStr, durationStr) {
  const startMins = parseTimeToMinutes(startTimeStr);

  const [dHrsStr, dMinsStr] = durationStr.split(':');
  const dHrs = Number(dHrsStr);
  const dMins = Number(dMinsStr);

  if (isNaN(dHrs) || isNaN(dMins) || dHrs < 0 || dMins < 0 || dMins >= 60) {
    throw new Error('Invalid duration format');
  }

  const durationTotalMins = dHrs * 60 + dMins;
  const resultMins = startMins + durationTotalMins;
  return formatMinutesToTime(resultMins);
}


export default function App() {
  const [startTime, setStartTime] = useState("12:00");
  const [duration, setDuration] = useState("09:00");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function handleCalculate(e) {
    e.preventDefault();

    try {
      const endTime = addTime(startTime, duration);
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
      <form onSubmit={handleCalculate}>
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

        <button type="submit">Calculate</button>
      </form>

      {result && (
        <p>
          End time: <strong>{result}</strong>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
