import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Badge, IconButton, TextField } from "@mui/material";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import server from "../environment";
import { AuthContext } from "../contexts/AuthContext";

const server_url = server;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const meetingCodeRef = useRef(null);

  useEffect(() => {
    // Capture the code IMMEDIATELY when the page loads
    // This locks "dqdx3p" into memory before any redirects happen
    const segments = window.location.pathname.split("/").filter(Boolean);
    meetingCodeRef.current = segments.pop();

    console.log("Meeting Code Locked:", meetingCodeRef.current);
  }, []);

  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoref = useRef();
  let [isConnecting, setIsConnecting] = useState(false);

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState(true);

  let [audio, setAudio] = useState(true);

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const { addToUserHistory } = useContext(AuthContext);

  const markLeave = async () => {
    try {
      console.log("--- MARK LEAVE STARTED ---");

      if (localStorage.getItem("token")) {
        // USE THE LOCKED CODE (Not window.location)
        const cleanCode = meetingCodeRef.current;

        if (!cleanCode) {
          console.error("ERROR: No meeting code found in Ref!");
          return;
        }

        console.log("Leaving Meeting Code:", cleanCode);

        const data = {
          token: localStorage.getItem("token"),
          meeting_code: cleanCode, // Sends "dqdx3p" even if you are on /home
        };

        await fetch(`${server_url}/api/v1/users/update_leave_time`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true,
        });
      }
    } catch (e) {
      console.error("Error in markLeave:", e);
    }
  };

  // 2. Trigger on Component Unmount (Closing tab or Back button)
  useEffect(() => {
    return () => {
      markLeave();
    };
  }, []);

  useEffect(() => {
    if (
      askForUsername === false &&
      localVideoref.current &&
      window.localStream
    ) {
      localVideoref.current.srcObject = window.localStream;
    }
  }, [askForUsername]);

  useEffect(() => {
    connections = {};
    setMessages([]);
    setVideos([]);

    getPermissions();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      connections = {};
      window.localStream = null;
      setMessages([]);
    };
  }, []);

  // ----------------------------------------------------
  //  FIX 1: UPDATED SCREEN SHARE LOGIC (Auto-Stop & Restart Camera)
  // ----------------------------------------------------
  let getDislayMedia = () => {
    if (screen) {
      // ... (Start logic) ...
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => {
            console.log(e);
            setScreen(false);
          });
      }
    } else {
      // ... (Stop logic) ...
      if (window.localStream) {
        let tracks = window.localStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setVideo(true);
      getUserMedia(); // This triggers getUserMediaSuccess, which now swaps the tracks!
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    // 1. Set the new stream
    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    // -----------------------------------------------------------
    // THE FIX: Apply existing Audio/Video settings to the new stream
    // -----------------------------------------------------------
    // Ensure the new audio track matches your current Mute button state
    if (stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = audio;
    }

    // Ensure the new video track matches your current Video button state
    if (stream.getVideoTracks().length > 0) {
      stream.getVideoTracks()[0].enabled = video;
    }
    // -----------------------------------------------------------

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      // Swap the track so the other person sees the new stream
      let videoTrack = stream.getVideoTracks()[0];
      let audioTrack = stream.getAudioTracks()[0]; // Grab new audio too

      let videoSender = connections[id]
        .getSenders()
        .find((s) => s.track.kind === "video");
      let audioSender = connections[id]
        .getSenders()
        .find((s) => s.track.kind === "audio");

      if (videoSender && videoTrack) videoSender.replaceTrack(videoTrack);
      if (audioSender && audioTrack) audioSender.replaceTrack(audioTrack);

      // If no sender existed, add stream cleanly (fallback)
      if (!videoSender && !audioSender) {
        connections[id].addStream(window.localStream);
      }

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };
  // ----------------------------------------------------
  //  FIX 2: ROBUST GETUSERMEDIA
  // ----------------------------------------------------
  let getUserMedia = () => {
    // Force request for camera and mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(getUserMediaSuccess)
      .catch((e) => console.log(e));
  };

  let getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      // -----------------------------------------------------------
      // THE FIX: Swap Camera Track -> Screen Track
      // -----------------------------------------------------------
      let videoTrack = stream.getVideoTracks()[0];
      let sender = connections[id]
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);

      if (sender) {
        sender.replaceTrack(videoTrack);
      } else {
        connections[id].addStream(window.localStream);
      }
      // -----------------------------------------------------------

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    // --- CRITICAL FIX: Disconnect existing socket if it exists ---
    if (socketRef.current) {
      console.log("Cleaning up previous socket connection...");
      socketRef.current.disconnect();
    }
    // -------------------------------------------------------------

    socketRef.current = io.connect(server_url, {
      secure: false,
      forceNew: true,
    });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
              };
              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  // ----------------------------------------------------
  //  FIX 3: SMART VIDEO BUTTON (Restarts camera if dead)
  // ----------------------------------------------------
  let handleVideo = () => {
    const newVideoState = !video;
    setVideo(newVideoState);

    if (newVideoState === false) {
      if (
        window.localStream &&
        window.localStream.getVideoTracks().length > 0
      ) {
        window.localStream.getVideoTracks()[0].enabled = false;
      }
    } else {
      // Check if stream is alive
      const hasLiveVideo =
        window.localStream &&
        window.localStream.getVideoTracks().length > 0 &&
        window.localStream.getVideoTracks()[0].readyState === "live";

      if (hasLiveVideo) {
        window.localStream.getVideoTracks()[0].enabled = true;
      } else {
        // If dead, restart it!
        getUserMedia();
      }
    }
  };

  let handleAudio = () => {
    const newAudioState = !audio; // Calculate what we WANT
    setAudio(newAudioState); // Update the UI button

    // Force the actual microphone track to match
    if (window.localStream && window.localStream.getAudioTracks().length > 0) {
      window.localStream.getAudioTracks()[0].enabled = newAudioState;
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}

    markLeave();

    setTimeout(() => {
      if (localStorage.getItem("token")) {
        window.location.href = "/home";
      } else {
        window.location.href = "/";
      }
    }, 500);
  };

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };
  let closeChat = () => {
    setModal(false);
  };
  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let connect = () => {
    // 1. Prevent double clicks
    if (isConnecting) return;
    setIsConnecting(true);

    setAskForUsername(false);
    getMedia();

    if (localStorage.getItem("token")) {
      try {
        addToUserHistory(window.location.href)
          .then((response) => {
            console.log("Meeting added to history:", response);
          })
          .catch((err) => {
            console.log("Failed to add history:", err);
          });
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log("Guest user joined - History not saved.");
    }
  };

  // ... all your existing logic above ...

  return (
    // 1. OUTER CONTAINER: Dark Gradient Background
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #1a1a1a, #000000)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* 2. BACKGROUND WAVES */}
      {/* Top Left Waves */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMinYMin slice"
      >
        <path
          d="M-50 250 Q 300 300, 600 650"
          stroke="#ff9800"
          strokeWidth="2"
          strokeDasharray="10 10"
          opacity="0.7"
          fill="none"
        />
        <path
          d="M-50 100 Q 450 150, 750 500"
          stroke="#ff9800"
          strokeWidth="2"
          strokeDasharray="10 10"
          opacity="0.4"
          fill="none"
        />
      </svg>

      {/* Bottom Right Wave */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "500px",
          height: "300px",
          zIndex: 0,
          pointerEvents: "none",
        }}
        viewBox="0 0 500 300"
        fill="none"
      >
        <path
          d="M490 10 C 350 250, 150 50, 10 290"
          stroke="#ff9800"
          strokeWidth="2"
          strokeDasharray="15 15"
          fill="none"
        />
      </svg>

      {/* 3. GLASS OVERLAY */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker tint for video focus
          backdropFilter: "blur(30px)",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          color: "white",
        }}
      >
        {/* --- LOBBY VIEW --- */}
        {askForUsername === true ? (
          <div
            className={styles.lobbyContainer}
            style={{ background: "transparent" }}
          >
            <h1
              style={{
                fontSize: "3rem",
                textShadow: "0 0 20px rgba(255,152,0,0.5)",
              }}
            >
              Enter Lobby
            </h1>

            <div className={styles.lobbyForm}>
              <TextField
                id="outlined-basic"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "#ff9800" },
                    "&.Mui-focused fieldset": { borderColor: "#ff9800" },
                  },
                  "& .MuiInputLabel-root": { color: "#aaa" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#ff9800" },
                }}
              />
              <Button
                variant="contained"
                onClick={connect}
                disabled={isConnecting} // <--- Add this line
                className={`${styles.primaryBtn} ${styles.animateBtn}`}
                style={{
                  background: "#ff9800",
                  color: "black",
                  fontWeight: "bold",
                  padding: "15px 30px",
                  borderRadius: "12px",
                }}
              >
                {isConnecting ? "Joining..." : "Connect"}{" "}
                {/* <--- Optional: Change text */}
              </Button>
            </div>

            <div
              className={styles.videoPreviewContainer}
              style={{
                border: "2px solid #ff9800",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 0 30px rgba(255,152,0,0.2)",
              }}
            >
              <video
                ref={localVideoref}
                autoPlay
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              ></video>
            </div>
          </div>
        ) : (
          // --- MEETING VIEW ---
          <div
            className={styles.meetVideoContainer}
            style={{ background: "transparent", width: "100%", height: "100%" }}
          >
            {/* CHAT MODAL */}
            {showModal ? (
              <div
                className={styles.chatRoom}
                style={{
                  background: "rgba(20,20,20,0.95)",
                  borderLeft: "1px solid #333",
                }}
              >
                <div className={styles.chatContainer}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom: "10px",
                      borderBottom: "1px solid #333",
                    }}
                  >
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        color: "#ff9800",
                      }}
                    >
                      Chat
                    </h1>
                    <IconButton onClick={closeChat} style={{ color: "white" }}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <div className={styles.chattingDisplay}>
                    {messages.length !== 0 ? (
                      messages.map((item, index) => (
                        <div style={{ marginBottom: "15px" }} key={index}>
                          <p
                            style={{
                              fontWeight: "bold",
                              color: "#ff9800",
                              fontSize: "0.9rem",
                            }}
                          >
                            {item.sender}
                          </p>
                          <p style={{ color: "#ddd" }}>{item.data}</p>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#666" }}>No Messages Yet</p>
                    )}
                  </div>
                  <div className={styles.chattingArea}>
                    <TextField
                      value={message}
                      onChange={handleMessage}
                      placeholder="Type a message..."
                      variant="outlined"
                      sx={{
                        input: { color: "white" },
                        fieldset: { borderColor: "#444" },
                      }}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      onClick={sendMessage}
                      style={{
                        marginLeft: "10px",
                        background: "#ff9800",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {/* --- CONTROLS BAR (Golden Glass Style) --- */}
            <div
              className={styles.buttonContainers}
              style={{
                position: "fixed",
                bottom: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "20px",
                padding: "12px 30px",
                background: "rgba(255, 152, 0, 0.15)", // Golden Glass Background
                border: "1px solid rgba(255, 152, 0, 0.3)", // Golden Border
                backdropFilter: "blur(15px)",
                borderRadius: "50px",
                zIndex: 100,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <IconButton
                onClick={handleVideo}
                style={{ color: video ? "white" : "#ff4444" }}
              >
                {video ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>

              <IconButton
                onClick={handleAudio}
                style={{ color: audio ? "white" : "#ff4444" }}
              >
                {audio ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              {screenAvailable && (
                <IconButton
                  onClick={handleScreen}
                  style={{ color: screen ? "#ff9800" : "white" }}
                >
                  {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                </IconButton>
              )}

              <Badge badgeContent={newMessages} max={99} color="warning">
                <IconButton onClick={openChat} style={{ color: "white" }}>
                  <ChatIcon />
                </IconButton>
              </Badge>

              <IconButton
                onClick={handleEndCall}
                style={{
                  background: "#ff4444",
                  color: "white",
                  padding: "8px",
                  marginLeft: "10px",
                }}
              >
                <CallEndIcon />
              </IconButton>
            </div>

            {/* --- MAIN VIDEO GRID --- */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                height: "100%",
                paddingBottom: "100px",
                gap: "20px",
              }}
            >
              {/* Local User Video */}
              <div
                style={{
                  position: "relative",
                  width: "400px",
                  height: "300px",
                  borderRadius: "15px",
                  overflow: "hidden",
                  border: "2px solid rgba(255,152,0,0.5)",
                  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                }}
              >
                <video
                  className={styles.meetUserVideo}
                  ref={localVideoref}
                  autoPlay
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                ></video>
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    background: "rgba(0,0,0,0.6)",
                    padding: "2px 10px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                >
                  You
                </div>
              </div>

              {/* Remote Users Videos */}
              {videos.map((video) => (
                <div
                  key={video.socketId}
                  style={{
                    position: "relative",
                    width: "400px",
                    height: "300px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    border: "1px solid #444",
                    background: "#000",
                  }}
                >
                  <video
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) ref.srcObject = video.stream;
                    }}
                    autoPlay
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  ></video>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
