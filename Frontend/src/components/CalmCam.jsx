import React, { useEffect, useRef, useState } from "react";
import * as faceMesh from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE = "/api";
const API_POST = `${API_BASE}/sessions`;
const API_GET = `${API_BASE}/sessions`;

export default function CalmCam() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);

  const faceDetectedRef = useRef(false);
  const focusedRef = useRef(false);
  const mouthOpenRef = useRef(false);

  const secondsRef = useRef(0);
  const focusedSecondsRef = useRef(0);
  const intervalRef = useRef(null);

  const [faceDetected, setFaceDetected] = useState(false);
  const [isLooking, setIsLooking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [focusedSeconds, setFocusedSeconds] = useState(0);
  const [focusPercent, setFocusPercent] = useState(100);
  const [sessionReport, setSessionReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [statusMsg, setStatusMsg] = useState("Idle");

  // Mediapipe init
  useEffect(() => {
    meshRef.current = new faceMesh.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    meshRef.current.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });
    meshRef.current.onResults(onResults);

    return () => {
      stopCamera();
      clearInterval(intervalRef.current);
      meshRef.current?.close();
    };
  }, []);

  const onResults = (results) => {
    const lm = results.multiFaceLandmarks?.[0];
    drawFrame(results);

    if (!lm) {
      faceDetectedRef.current = false;
      focusedRef.current = false;
      mouthOpenRef.current = false;
      setFaceDetected(false);
      setIsLooking(false);
      setMouthOpen(false);
      setStatusMsg("Face not detected");
      return;
    }

    faceDetectedRef.current = true;
    setFaceDetected(true);

    // 🔹 Improved Looking heuristic
    const leftEye = lm[33];   // left eye outer corner
    const rightEye = lm[263]; // right eye outer corner
    const nose = lm[1];
    let looking = true;

    if (leftEye && rightEye && nose) {
      const eyeCenterX = (leftEye.x + rightEye.x) / 2;

      // Basic nose offset
      const dx = Math.abs(nose.x - eyeCenterX);

      // 🔹 Head tilt/yaw compensation
      const eyeDistance = Math.abs(rightEye.x - leftEye.x);
      const threshold = 0.35 * eyeDistance; // stricter, adaptive threshold

      looking = dx < threshold;
    }
    focusedRef.current = looking;
    setIsLooking(looking);

    // Mouth heuristic
    const upperLip = lm[13];
    const lowerLip = lm[14];
    let open = false;
    if (upperLip && lowerLip) {
      const mouthGap = Math.abs(lowerLip.y - upperLip.y);
      open = mouthGap > 0.05;
    }
    mouthOpenRef.current = open;
    setMouthOpen(open);

    setStatusMsg(
      open ? "Distracted: Mouth open" : looking ? "Looking at screen" : "Not looking"
    );
  };

  function drawFrame(results) {
    const canvas = canvasRef.current;
    if (!canvas || !results) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  }

  function startCamera() {
    if (videoRef.current && meshRef.current) {
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await meshRef.current.send({ image: videoRef.current });
        },
        width: 640,
        height: 640,
      });
      cameraRef.current.start();
    }
  }

  function stopCamera() {
    try {
      cameraRef.current?.stop();
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    } catch {}
  }

  function startTicker() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!faceDetectedRef.current) return;
      secondsRef.current += 1;
      if (focusedRef.current && !mouthOpenRef.current)
        focusedSecondsRef.current += 1;

      setSecondsElapsed(secondsRef.current);
      setFocusedSeconds(focusedSecondsRef.current);
      const pct =
        secondsRef.current > 0
          ? Math.round((focusedSecondsRef.current / secondsRef.current) * 100)
          : 100;
      setFocusPercent(pct);
    }, 1000);
  }

  function stopTicker() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  const handleStart = () => {
    secondsRef.current = 0;
    focusedSecondsRef.current = 0;
    setSecondsElapsed(0);
    setFocusedSeconds(0);
    setFocusPercent(100);
    setSessionReport(null);
    setSessionRunning(true);
    setStatusMsg("Session running");
    startCamera();
    startTicker();
  };

  const handleStop = async () => {
    stopTicker();
    stopCamera();
    setSessionRunning(false);

    const total = secondsRef.current;
    const focused = focusedSecondsRef.current;
    const percent = total > 0 ? Math.round((focused / total) * 100) : 0;

    const report = {
      user: { id: "demo", name: "Demo" },
      room: "default",
      startedAt: new Date(Date.now() - total * 1000).toISOString(),
      durationSeconds: total,
      focusedSeconds: focused,
      focusPercent: percent,
    };

    setSessionReport(report);
    try {
      await axios.post(API_POST, report);
      setStatusMsg("Saved session");
    } catch {
      setStatusMsg("Save failed");
    }
    fetchHistory();
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(API_GET);
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="w-full min-h-screen p-8 bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold mb-2 text-blue-900"
      >
      </motion.h2>
      <p className="text-gray-600 mb-6">{statusMsg}</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full lg:w-3/4 aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-200"
        >
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} width={640} height={640} className="absolute top-0 left-0 w-full h-full" />
        </motion.div>

        {/* Controls / Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col gap-6"
        >
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-blue-900">Live Stats</h3>
            <div className="text-4xl font-bold text-blue-900">{focusPercent}%</div>
            <div className="mt-3 space-y-1 text-gray-600 text-sm">
              <p>Face: {faceDetected ? "Yes" : "No"}</p>
              <p>Looking: {isLooking ? "Yes" : "No"}</p>
              <p>Mouth: {mouthOpen ? "Open" : "Closed"}</p>
              <p>Elapsed: {secondsElapsed}s</p>
              <p>Focused: {focusedSeconds}s</p>
            </div>

            <div className="mt-4 flex gap-3">
              {!sessionRunning ? (
                <button
                  onClick={handleStart}
                  className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition"
                >
                  Start Session
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  End Session
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900">Last Report</h3>
            {sessionReport ? (
              <div className="mt-3 text-sm space-y-1 text-gray-700">
                <p><span className="font-semibold">Duration:</span> {sessionReport.durationSeconds}s</p>
                <p><span className="font-semibold">Focused:</span> {sessionReport.focusedSeconds}s</p>
                <p><span className="font-semibold">Focus %:</span> {sessionReport.focusPercent}%</p>
                <p><span className="font-semibold">Started:</span> {new Date(sessionReport.startedAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-gray-400 mt-2">No report yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-8 bg-white p-6 rounded-2xl shadow-md border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">History</h3>
        {history.length === 0 ? (
          <p className="text-gray-500">No sessions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="p-2">When</th>
                  <th className="p-2">Duration (s)</th>
                  <th className="p-2">Focused (s)</th>
                  <th className="p-2">Focus %</th>
                </tr>
              </thead>
              <tbody>
                {history.map((s) => (
                  <tr key={s._id || JSON.stringify(s)} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2">{new Date(s.startedAt || s.createdAt).toLocaleString()}</td>
                    <td className="p-2">{s.durationSeconds ?? "-"}</td>
                    <td className="p-2">{s.focusedSeconds ?? "-"}</td>
                    <td className="p-2">{s.focusPercent ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
