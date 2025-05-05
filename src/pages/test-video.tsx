import { useUserStore } from '@/store/user-store';
import { useEffect, useRef, useState } from 'react';
import { ask } from '@tauri-apps/plugin-dialog';

interface SignalMessage {
  meeting_id: string;
  sdp?: RTCSessionDescriptionInit;
  ice_candidate?: RTCIceCandidateInit;
  error?: string;
}

const VideoCall = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [meetingId, setMeetingId] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const userDecoded = useUserStore().decodedUser;
  console.warn(permissionGranted);
  // Cleanup function
  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (ws) {
      ws.close();
    }
    setCameraEnabled(false);
    setMicEnabled(false);
  };

  useEffect(() => {
    if (!userDecoded?._id) {
      setError('User not authenticated');
      return;
    }

    // Connect to WebSocket
    const websocket = new WebSocket(`ws://localhost:8080/ws?user_id=${userDecoded._id}`);
    setWs(websocket);

    websocket.onopen = () => {
      setError(null);
    };

    websocket.onerror = (error) => {
      setError('WebSocket connection error');
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      setError('WebSocket connection closed');
    };

    websocket.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'meeting_created':
            setMeetingId(message.payload.meeting_id);
            break;
            
          case 'offer':
            await handleOffer(message.payload);
            break;
            
          case 'answer':
            await handleAnswer(message.payload);
            break;
            
          case 'ice_candidate':
            await handleICECandidate(message.payload);
            break;
            
          case 'error':
            setError(message.payload.error || 'An error occurred');
            break;
        }
      } catch (err) {
        setError('Failed to process message');
        console.error('Message processing error:', err);
      }
    };

    return () => {
      cleanup();
    };
  }, [userDecoded?._id]);

  const requestMediaPermissions = async () => {
    try {
      // In Tauri, we need to explicitly request permissions
      const permissionGranted = await ask('This app requires access to your camera and microphone. Allow access?', {
        title: 'Media Permissions',
        kind: 'info',
      });

      if (!permissionGranted) {
        setError('Permission denied. Please enable camera/microphone access in your settings.');
        return false;
      }

      setPermissionGranted(true);
      return true;
    } catch (err) {
      console.error('Permission request error:', err);
      setError('Failed to request media permissions');
      return false;
    }
  };

  const toggleCamera = async () => {
    if (!localStream) return;

    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
      const newState = !videoTracks[0].enabled;
      videoTracks[0].enabled = newState;
      setCameraEnabled(newState);
    }
  };

  const toggleMic = async () => {
    if (!localStream) return;

    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      const newState = !audioTracks[0].enabled;
      audioTracks[0].enabled = newState;
      setMicEnabled(newState);
    }
  };

  const createMeeting = async () => {
    if (!ws) {
      setError('WebSocket not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const hasPermissions = await requestMediaPermissions();
      if (!hasPermissions) {
        setIsLoading(false);
        return;
      }

      // Get media devices
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setLocalStream(stream);
      setCameraEnabled(true);
      setMicEnabled(true);

      // Create peer connection with configuration
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          // Add your TURN servers here if needed
        ]
      });
      pcRef.current = pc;

      // Add local stream to connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Setup ICE candidate handler
      pc.onicecandidate = ({ candidate }) => {
        if (candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'ice_candidate',
            payload: {
              meeting_id: meetingId,
              ice_candidate: candidate.toJSON()
            }
          }));
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          setError('ICE connection failed');
        }
      };

      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pc.setLocalDescription(offer);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'create_meeting',
          payload: {
            meeting_id: meetingId,
            sdp: offer
          }
        }));
      } else {
        setError('WebSocket not ready');
      }
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to create meeting');
      cleanup();
    } finally {
      setIsLoading(false);
    }
  };

  const joinMeeting = async () => {
    if (!ws) {
      setError('WebSocket not connected');
      return;
    }

    if (!meetingId) {
      setError('Please enter a meeting ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Setup remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams.length > 0) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Setup ICE candidate handler
      pc.onicecandidate = ({ candidate }) => {
        if (candidate && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'ice_candidate',
            payload: {
              meeting_id: meetingId,
              ice_candidate: candidate.toJSON()
            }
          }));
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed') {
          setError('ICE connection failed');
        }
      };

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'join_meeting',
          payload: { meeting_id: meetingId }
        }));
      } else {
        setError('WebSocket not ready');
      }
    } catch (err) {
      console.error('Error joining meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to join meeting');
      cleanup();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOffer = async (signal: SignalMessage) => {
    if (!pcRef.current || !ws || !signal.sdp) {
      setError('Missing required components for handling offer');
      return;
    }

    try {
      await pcRef.current.setRemoteDescription(signal.sdp);
      const answer = await pcRef.current.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await pcRef.current.setLocalDescription(answer);

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'answer',
          payload: {
            meeting_id: signal.meeting_id,
            sdp: answer
          }
        }));
      } else {
        setError('WebSocket not ready');
      }
    } catch (err) {
      console.error('Error handling offer:', err);
      setError(err instanceof Error ? err.message : 'Failed to handle offer');
    }
  };

  const handleAnswer = async (signal: SignalMessage) => {
    if (!pcRef.current || !signal.sdp) {
      setError('Missing required components for handling answer');
      return;
    }

    try {
      await pcRef.current.setRemoteDescription(signal.sdp);
    } catch (err) {
      console.error('Error handling answer:', err);
      setError(err instanceof Error ? err.message : 'Failed to handle answer');
    }
  };

  const handleICECandidate = async (signal: SignalMessage) => {
    if (!pcRef.current || !signal.ice_candidate) {
      setError('Missing required components for handling ICE candidate');
      return;
    }

    try {
      await pcRef.current.addIceCandidate(signal.ice_candidate);
    } catch (err) {
      console.error('Error handling ICE candidate:', err);
      setError(err instanceof Error ? err.message : 'Failed to handle ICE candidate');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Video Call</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Local Video */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 p-2 flex justify-between items-center">
              <h2 className="text-white font-medium">Your Camera</h2>
              {localStream && (
                <div className="flex space-x-2">
                  <button
                    onClick={toggleCamera}
                    className={`p-1 rounded-full ${cameraEnabled ? 'bg-green-500' : 'bg-red-500'}`}
                    title={cameraEnabled ? 'Disable camera' : 'Enable camera'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`p-1 rounded-full ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}
                    title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-64 bg-black"
            />
          </div>

          {/* Remote Video */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 p-2">
              <h2 className="text-white font-medium">Remote Participant</h2>
            </div>
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-64 bg-black"
            >
              <track kind="captions" src="captions.vtt" srcLang="en" label="English" />
            </video>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col space-y-4">
            <button
              onClick={createMeeting}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'Creating Meeting...' : 'Create New Meeting'}
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder="Enter Meeting ID"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={joinMeeting}
                disabled={isLoading || !meetingId}
                className={`px-4 py-2 rounded-md text-white font-medium ${isLoading || !meetingId ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isLoading ? 'Joining...' : 'Join Meeting'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
