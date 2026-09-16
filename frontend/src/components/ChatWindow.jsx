import { useEffect, useRef, useState } from "react";

const API_BASE_URL = "http://localhost:5000";

function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm Rentora AI. How can I help you find the perfect ride today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const quickQuestions = [
    "I need a bike in Ongole tomorrow",
    "Show me cars in Vijayawada",
    "How much is a Swift for 3 days?",
    "What documents do I need?",
  ];

  // ============================================================
  // CREATE ONE SESSION FOR THIS CUSTOMER/BROWSER
  // ============================================================

  const getSessionId = () => {
    try {
      let sessionId = sessionStorage.getItem(
        "rentoraSessionId"
      );

      if (!sessionId) {
        sessionId =
          "rentora-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substring(2, 10);

        sessionStorage.setItem(
          "rentoraSessionId",
          sessionId
        );
      }

      return sessionId;
    } catch (error) {
      console.error(
        "Could not create Rentora session:",
        error
      );

      return "rentora-fallback-session";
    }
  };

  // ============================================================
  // RESET BACKEND CONVERSATION WHEN CHAT PAGE OPENS
  // ============================================================

  useEffect(() => {
    const resetConversation = async () => {
      const sessionId = getSessionId();

      try {
        await fetch(
          `${API_BASE_URL}/api/ai/reset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId,
            }),
          }
        );

        console.log(
          "Rentora conversation reset:",
          sessionId
        );
      } catch (error) {
        console.error(
          "Could not reset Rentora conversation:",
          error
        );
      }
    };

    resetConversation();

    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          ?.getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // ============================================================
  // CUSTOMER DETAILS
  // ============================================================

  const getCustomerDetails = () => {
    try {
      const savedCustomer =
        localStorage.getItem("rentoraCustomer");

      if (!savedCustomer) {
        return {
          name: "there",
          id: getSessionId(),
        };
      }

      const customer = JSON.parse(savedCustomer);

      return {
        name: customer.name || "there",
        id: getSessionId(),
      };
    } catch (error) {
      console.error(
        "Could not read customer information:",
        error
      );

      return {
        name: "there",
        id: getSessionId(),
      };
    }
  };

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const sendMessage = async (messageText = input) => {
    const text = messageText.trim();

    if (!text || loading) return;

    const customer = getCustomerDetails();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      console.log(
        "Sending message to Rentora backend:",
        text
      );

      const response = await fetch(
        `${API_BASE_URL}/api/ai/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          // IMPORTANT:
          // Backend expects "message".
          // Previously frontend was sending "question".
          body: JSON.stringify({
            message: text,
            sessionId: customer.id,
            customerName: customer.name,
          }),
        }
      );

      console.log(
        "Backend response status:",
        response.status
      );

      const responseText = await response.text();

      console.log(
        "Backend raw response:",
        responseText
      );

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Backend returned an invalid response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Backend error. Status: ${response.status}`
        );
      }

      const answer =
        data.reply ||
        data.answer ||
        data.response ||
        data.message ||
        "I'm sorry, I couldn't understand that.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answer,
        },
      ]);

      console.log(
        "Rentora conversation state:",
        data.state
      );
    } catch (error) {
      console.error(
        "Rentora AI connection error:",
        error
      );

      let errorMessage =
        "I'm having trouble connecting to Rentora right now.";

      if (error instanceof TypeError) {
        errorMessage =
          "I can't reach the Rentora backend. Please make sure the backend is running on port 5000.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // START VOICE RECORDING
  // ============================================================

  const startRecording = async () => {
    if (recording || transcribing) return;

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream
          .getTracks()
          .forEach((track) => track.stop());

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type:
              recorder.mimeType ||
              "audio/webm",
          }
        );

        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current = recorder;

      recorder.start();

      setRecording(true);
    } catch (error) {
      console.error(
        "Microphone error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "I couldn't access your microphone. Please allow microphone permission and try again.",
        },
      ]);
    }
  };

  // ============================================================
  // STOP VOICE RECORDING
  // ============================================================

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      !recording
    ) {
      return;
    }

    mediaRecorderRef.current.stop();

    setRecording(false);
    setTranscribing(true);
  };

  // ============================================================
  // TRANSCRIBE AUDIO
  // ============================================================

  const transcribeAudio = async (audioBlob) => {
    try {
      const formData = new FormData();

      formData.append(
        "audio",
        audioBlob,
        "rentora-voice.webm"
      );

      const response = await fetch(
        `${API_BASE_URL}/api/transcribe`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText =
        await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid transcription response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Transcription failed."
        );
      }

      const transcript =
        data.text ||
        data.transcript ||
        "";

      if (transcript.trim()) {
        setInput(transcript.trim());
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              "I couldn't hear any clear speech. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Voice transcription error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.message ||
            "I couldn't convert that voice message to text.",
        },
      ]);
    } finally {
      setTranscribing(false);
    }
  };

  // ============================================================
  // QUICK QUESTIONS
  // ============================================================

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="rentora-assistant-page">
      <style>{`
        .rentora-assistant-page {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(circle at 10% 0%, rgba(124, 58, 237, 0.10), transparent 30%),
            radial-gradient(circle at 90% 90%, rgba(139, 92, 246, 0.08), transparent 28%),
            #fbfaff;
          color: #171327;
          padding: 32px 18px 45px;
        }

        .assistant-container {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
        }

        .assistant-header {
          background: linear-gradient(135deg, #4c1d95, #6d28d9 52%, #8b5cf6);
          color: white;
          border-radius: 28px;
          padding: 30px 34px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 22px 55px rgba(76, 29, 149, 0.20);
        }

        .assistant-header-content {
          position: relative;
          z-index: 2;
        }

        .assistant-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.20);
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .assistant-header h1 {
          margin: 0;
          font-size: clamp(27px, 4vw, 40px);
          letter-spacing: -1px;
        }

        .assistant-header p {
          margin: 9px 0 0;
          color: rgba(255,255,255,0.78);
          font-size: 14px;
        }

        .ai-orb {
          width: 70px;
          height: 70px;
          flex-shrink: 0;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.20);
          font-size: 31px;
          position: relative;
          z-index: 2;
        }

        .assistant-layout {
          margin-top: 22px;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 22px;
          align-items: stretch;
        }

        .chat-card {
          min-height: 600px;
          background: white;
          border: 1px solid #e7e0f2;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 14px 40px rgba(58, 35, 96, 0.07);
        }

        .chat-topbar {
          padding: 17px 20px;
          border-bottom: 1px solid #eee8f5;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .online-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.10);
        }

        .chat-topbar strong {
          font-size: 14px;
        }

        .chat-topbar span {
          color: #82798f;
          font-size: 11px;
          margin-left: 4px;
        }

        .messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          min-height: 400px;
          max-height: 560px;
          background: linear-gradient(180deg, #fff 0%, #fdfbff 100%);
        }

        .message-row {
          display: flex;
          margin-bottom: 17px;
        }

        .message-row.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 76%;
          padding: 13px 16px;
          border-radius: 17px;
          font-size: 14px;
          line-height: 1.55;
          white-space: pre-wrap;
        }

        .message-row.assistant .message-bubble {
          background: #f2edff;
          color: #302346;
          border: 1px solid #e5dafb;
          border-bottom-left-radius: 5px;
        }

        .message-row.user .message-bubble {
          background: linear-gradient(135deg, #6d28d9, #8b5cf6);
          color: white;
          border-bottom-right-radius: 5px;
          box-shadow: 0 7px 17px rgba(109,40,217,0.17);
        }

        .typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 14px 17px;
        }

        .typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8b5cf6;
          animation: typing 1s infinite;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.30s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.25;
            transform: translateY(0);
          }

          30% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        .quick-section {
          padding: 0 20px 15px;
        }

        .quick-title {
          color: #80768d;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .quick-list {
          display: flex;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .quick-button {
          flex-shrink: 0;
          border: 1px solid #ded3ef;
          background: #fff;
          color: #5e4a77;
          border-radius: 999px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
        }

        .quick-button:hover {
          background: #f3edff;
          border-color: #bfa4ef;
          color: #6d28d9;
        }

        .composer {
          border-top: 1px solid #eee8f5;
          padding: 15px;
          display: flex;
          gap: 9px;
          align-items: center;
          background: white;
        }

        .composer-input {
          flex: 1;
          min-width: 0;
          height: 46px;
          border: 1px solid #ddd3ec;
          border-radius: 13px;
          padding: 0 14px;
          outline: none;
          background: #fff;
          color: #171327;
          font-family: inherit;
          font-size: 13px;
        }

        .composer-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.09);
        }

        .icon-button {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          border: 1px solid #ded3ef;
          background: #faf8ff;
          color: #6d28d9;
          cursor: pointer;
          font-size: 18px;
          flex-shrink: 0;
        }

        .icon-button.recording {
          background: #6d28d9;
          color: white;
          border-color: #6d28d9;
          animation: pulse 1.2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(109,40,217,0.35);
          }

          70% {
            box-shadow: 0 0 0 9px rgba(109,40,217,0);
          }

          100% {
            box-shadow: 0 0 0 0 rgba(109,40,217,0);
          }
        }

        .send-button {
          height: 46px;
          padding: 0 17px;
          border: none;
          border-radius: 13px;
          background: linear-gradient(135deg, #6d28d9, #8b5cf6);
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-card {
          background: white;
          border: 1px solid #e7e0f2;
          border-radius: 21px;
          padding: 20px;
          box-shadow: 0 12px 32px rgba(58, 35, 96, 0.06);
        }

        .info-card.violet {
          background: linear-gradient(145deg, #f4efff, #fff);
          border-color: #ddd0f5;
        }

        .info-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eee7ff;
          color: #6d28d9;
          font-size: 18px;
          margin-bottom: 13px;
        }

        .info-card h3 {
          margin: 0 0 7px;
          font-size: 15px;
        }

        .info-card p {
          margin: 0;
          color: #776e82;
          font-size: 12px;
          line-height: 1.65;
        }

        .capability {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid #eee8f5;
          font-size: 12px;
          color: #5c526a;
        }

        .capability:last-child {
          border-bottom: none;
        }

        .capability-icon {
          width: 27px;
          height: 27px;
          border-radius: 8px;
          background: #f0eaff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6d28d9;
        }

        .voice-status {
          margin-top: 12px;
          padding: 10px 11px;
          border-radius: 10px;
          background: #faf8ff;
          border: 1px solid #ebe4f5;
          color: #756a83;
          font-size: 11px;
        }

        @media (max-width: 850px) {
          .assistant-layout {
            grid-template-columns: 1fr;
          }

          .side-panel {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .rentora-assistant-page {
            padding: 20px 12px 35px;
          }

          .assistant-header {
            padding: 25px 21px;
            border-radius: 22px;
          }

          .ai-orb {
            display: none;
          }

          .messages {
            padding: 17px;
          }

          .message-bubble {
            max-width: 88%;
          }

          .side-panel {
            display: flex;
          }

          .composer {
            padding: 10px;
          }

          .send-button {
            padding: 0 13px;
          }
        }
      `}</style>

      <div className="assistant-container">
        <section className="assistant-header">
          <div className="assistant-header-content">
            <div className="assistant-badge">
              ✦ RENTORA AI
            </div>

            <h1>Your AI rental assistant</h1>

            <p>
              Ask about vehicles, prices, availability or bookings.
            </p>
          </div>

          <div className="ai-orb">
            ✨
          </div>
        </section>

        <div className="assistant-layout">
          <section className="chat-card">
            <div className="chat-topbar">
              <div className="online-dot" />

              <div>
                <strong>Rentora Assistant</strong>
                <span>Online</span>
              </div>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >
                  <div className="message-bubble">
                    {message.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row assistant">
                  <div className="message-bubble typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {transcribing && (
                <div className="message-row assistant">
                  <div className="message-bubble">
                    🎙️ Processing your voice...
                  </div>
                </div>
              )}
            </div>

            <div className="quick-section">
              <div className="quick-title">
                Try asking
              </div>

              <div className="quick-list">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    className="quick-button"
                    onClick={() =>
                      handleQuickQuestion(question)
                    }
                    disabled={loading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="composer">
              <button
                className={
                  recording
                    ? "icon-button recording"
                    : "icon-button"
                }
                onClick={
                  recording
                    ? stopRecording
                    : startRecording
                }
                title={
                  recording
                    ? "Stop recording"
                    : "Start voice input"
                }
                disabled={
                  loading ||
                  transcribing
                }
              >
                {recording ? "■" : "🎙️"}
              </button>

              <input
                className="composer-input"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder={
                  recording
                    ? "Listening..."
                    : "Ask Rentora anything..."
                }
                disabled={
                  recording ||
                  transcribing ||
                  loading
                }
              />

              <button
                className="send-button"
                onClick={() => sendMessage()}
                disabled={
                  !input.trim() ||
                  loading ||
                  recording ||
                  transcribing
                }
              >
                Send
              </button>
            </div>
          </section>

          <aside className="side-panel">
            <div className="info-card violet">
              <div className="info-icon">
                ✨
              </div>

              <h3>What can I help with?</h3>

              <p>
                Talk naturally. Rentora understands
                your request and connects it with
                available rental information.
              </p>
            </div>

            <div className="info-card">
              <h3>Rentora capabilities</h3>

              <div className="capability">
                <div className="capability-icon">
                  🚗
                </div>
                Vehicle search
              </div>

              <div className="capability">
                <div className="capability-icon">
                  💰
                </div>
                Rental pricing
              </div>

              <div className="capability">
                <div className="capability-icon">
                  📍
                </div>
                City availability
              </div>

              <div className="capability">
                <div className="capability-icon">
                  📅
                </div>
                Booking assistance
              </div>

              <div className="capability">
                <div className="capability-icon">
                  📄
                </div>
                Rental policies
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                🎙️
              </div>

              <h3>Voice enabled</h3>

              <p>
                Use the microphone button to speak
                instead of typing.
              </p>

              <div className="voice-status">
                {recording
                  ? "● Listening to you..."
                  : transcribing
                  ? "● Converting voice to text..."
                  : "● Microphone ready"}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;