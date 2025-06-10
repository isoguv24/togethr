import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebRTCProps {
  roomId?: string;
  isEnabled?: boolean;
}

interface WebRTCState {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isMuted: boolean;
  isConnected: boolean;
  error: string | null;
  devices: {
    videoDevices: MediaDeviceInfo[];
    audioDevices: MediaDeviceInfo[];
  };
}

interface WebRTCActions {
  startVideo: () => Promise<void>;
  stopVideo: () => void;
  toggleVideo: () => Promise<void>;
  toggleAudio: () => void;
  toggleMute: () => void;
  switchCamera: () => Promise<void>;
  getDevices: () => Promise<void>;
  selectVideoDevice: (deviceId: string) => Promise<void>;
  selectAudioDevice: (deviceId: string) => Promise<void>;
  shareScreen: () => Promise<void>;
  stopScreenShare: () => void;
}

export const useWebRTC = ({ roomId, isEnabled = true }: UseWebRTCProps = {}): WebRTCState & WebRTCActions => {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStreams: new Map(),
    isVideoEnabled: false,
    isAudioEnabled: true,
    isMuted: false,
    isConnected: false,
    error: null,
    devices: {
      videoDevices: [],
      audioDevices: []
    }
  });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);
  const currentVideoDeviceRef = useRef<string>('');
  const currentAudioDeviceRef = useRef<string>('');
  const isScreenSharingRef = useRef<boolean>(false);

  // Constraints for media
  const getMediaConstraints = useCallback((deviceId?: string, isAudio = false) => {
    if (isAudio) {
      return {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        video: false
      };
    }
    
    return {
      video: deviceId 
        ? { 
            deviceId: { exact: deviceId },
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30 },
            facingMode: 'user'
          }
        : {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30 },
            facingMode: 'user'
          },
      audio: !state.isMuted
    };
  }, [state.isMuted]);

  // Get available devices
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      setState(prev => ({
        ...prev,
        devices: { videoDevices, audioDevices },
        error: null
      }));
    } catch (error) {
      console.error('❌ Failed to get devices:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to access media devices'
      }));
    }
  }, []);

  // Start video stream
  const startVideo = useCallback(async () => {
    try {
      console.log('📹 Starting video stream...');
      
      // Stop existing stream
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }

      const constraints = getMediaConstraints(currentVideoDeviceRef.current);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Store device IDs
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      
      if (videoTrack) {
        currentVideoDeviceRef.current = videoTrack.getSettings().deviceId || '';
      }
      if (audioTrack) {
        currentAudioDeviceRef.current = audioTrack.getSettings().deviceId || '';
      }

      setState(prev => ({
        ...prev,
        localStream: stream,
        isVideoEnabled: true,
        isAudioEnabled: !prev.isMuted,
        error: null
      }));

      console.log('✅ Video stream started successfully');
    } catch (error) {
      console.error('❌ Failed to start video:', error);
      setState(prev => ({
        ...prev,
        error: 'Could not access camera. Please check permissions.',
        isVideoEnabled: false
      }));
    }
  }, [state.localStream, getMediaConstraints]);

  // Stop video stream
  const stopVideo = useCallback(() => {
    if (state.localStream) {
      // Stop only video tracks so audio can continue if enabled
      state.localStream.getVideoTracks().forEach(track => track.stop());

      const audioTracks = state.localStream.getAudioTracks();
      const newStream = audioTracks.length > 0 ? new MediaStream(audioTracks) : null;

      setState(prev => ({
        ...prev,
        localStream: newStream,
        isVideoEnabled: false,
        // Preserve current audio state
        isAudioEnabled: audioTracks.length > 0 ? prev.isAudioEnabled : false
      }));
    }
    console.log('📹 Video stream stopped');
  }, [state.localStream]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (state.isVideoEnabled) {
      stopVideo();
    } else {
      await startVideo();
    }
  }, [state.isVideoEnabled, startVideo, stopVideo]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setState(prev => ({
          ...prev,
          isAudioEnabled: audioTrack.enabled
        }));
      }
    }
  }, [state.localStream]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMutedState = !prev.isMuted;
      
      // Update audio track if exists
      if (prev.localStream) {
        const audioTrack = prev.localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = !newMutedState;
        }
      }
      
      return {
        ...prev,
        isMuted: newMutedState,
        isAudioEnabled: !newMutedState
      };
    });
  }, []);

  // Switch camera (front/back)
  const switchCamera = useCallback(async () => {
    if (!state.localStream) return;

    try {
      const videoTrack = state.localStream.getVideoTracks()[0];
      const currentFacingMode = videoTrack.getSettings().facingMode;
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

      // Stop current video track
      videoTrack.stop();

      // Get new stream with different facing mode
      const constraints = {
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: !state.isMuted
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Replace video track
      const newVideoTrack = newStream.getVideoTracks()[0];
      const audioTrack = state.localStream.getAudioTracks()[0];
      
      const updatedStream = new MediaStream();
      updatedStream.addTrack(newVideoTrack);
      if (audioTrack) {
        updatedStream.addTrack(audioTrack);
      }

      setState(prev => ({
        ...prev,
        localStream: updatedStream
      }));
    } catch (error) {
      console.error('❌ Failed to switch camera:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to switch camera'
      }));
    }
  }, [state.localStream, state.isMuted]);

  // Select specific video device
  const selectVideoDevice = useCallback(async (deviceId: string) => {
    if (!state.isVideoEnabled) return;

    try {
      currentVideoDeviceRef.current = deviceId;
      await startVideo();
    } catch (error) {
      console.error('❌ Failed to select video device:', error);
    }
  }, [state.isVideoEnabled, startVideo]);

  // Select specific audio device
  const selectAudioDevice = useCallback(async (deviceId: string) => {
    if (!state.localStream) return;

    try {
      currentAudioDeviceRef.current = deviceId;
      
      // Get new audio stream
      const audioConstraints = getMediaConstraints(deviceId, true);
      const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
      const newAudioTrack = audioStream.getAudioTracks()[0];
      
      // Replace audio track
      const videoTrack = state.localStream.getVideoTracks()[0];
      const updatedStream = new MediaStream();
      
      if (videoTrack) {
        updatedStream.addTrack(videoTrack);
      }
      updatedStream.addTrack(newAudioTrack);

      setState(prev => ({
        ...prev,
        localStream: updatedStream
      }));
    } catch (error) {
      console.error('❌ Failed to select audio device:', error);
    }
  }, [state.localStream, getMediaConstraints]);

  // Share screen
  const shareScreen = useCallback(async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });

      // Keep audio from original stream
      const audioTrack = state.localStream?.getAudioTracks()[0];
      const screenTrack = displayStream.getVideoTracks()[0];
      
      const combinedStream = new MediaStream();
      combinedStream.addTrack(screenTrack);
      if (audioTrack) {
        combinedStream.addTrack(audioTrack);
      }

      // Handle screen share end
      screenTrack.addEventListener('ended', () => {
        stopScreenShare();
      });

      isScreenSharingRef.current = true;
      setState(prev => ({
        ...prev,
        localStream: combinedStream
      }));

      console.log('🖥️ Screen sharing started');
    } catch (error) {
      console.error('❌ Failed to share screen:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to share screen'
      }));
    }
  }, [state.localStream]);

  // Stop screen share
  const stopScreenShare = useCallback(() => {
    if (isScreenSharingRef.current) {
      isScreenSharingRef.current = false;
      // Restart normal camera
      startVideo();
      console.log('🖥️ Screen sharing stopped');
    }
  }, [startVideo]);

  // Initialize devices on mount
  useEffect(() => {
    if (isEnabled) {
      getDevices();
    }
  }, [isEnabled, getDevices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.localStream) {
        state.localStream.getTracks().forEach(track => track.stop());
      }
      
      // Close all peer connections
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
      
      // Close websocket
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return {
    ...state,
    startVideo,
    stopVideo,
    toggleVideo,
    toggleAudio,
    toggleMute,
    switchCamera,
    getDevices,
    selectVideoDevice,
    selectAudioDevice,
    shareScreen,
    stopScreenShare
  };
}; 