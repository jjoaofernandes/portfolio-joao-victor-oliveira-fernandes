import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import { useSpeedDating } from "@/lib/speed-dating-context";
import { ScreenContainer } from "@/components/screen-container";
import { AvatarCard } from "@/components/avatar-card";
import { StatusBar } from "expo-status-bar";

// ─── Jitsi Meet HTML com Recursos Avançados ───────────────────────────────────
// Integração completa do Jitsi Meet com:
// - Chat de texto
// - Controle de qualidade de vídeo
// - Compartilhamento de tela
// - Detecção de participantes
// - Indicador de volume
// - Modo fullscreen
// - Efeitos de fundo virtual

function buildJitsiHtml(roomName: string, displayName: string): string {
  // Sanitize room name for Jitsi (alphanumeric + hyphens only)
  const safeRoom = roomName.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 60);
  const safeName = displayName.replace(/['"<>]/g, "").slice(0, 40);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <title>Encontrinho - Videochamada</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; }
    #jitsi-container { width: 100%; height: 100%; }
    .stats-overlay {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 1000;
      font-weight: 600;
    }
    .quality-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .quality-good { background: #4CAF50; }
    .quality-fair { background: #FFC107; }
    .quality-poor { background: #F44336; }
  </style>
</head>
<body>
  <div id="jitsi-container"></div>
  <div class="stats-overlay">
    <span class="quality-indicator quality-good"></span>
    <span id="connection-status">Conectado</span>
  </div>
  <script src="https://meet.jitsi.si/external_api.js"></script>
  <script>
    var api;
    var callStats = {
      duration: 0,
      videoQuality: 'HD',
      participants: 1,
      audioLevel: 0,
      connectionQuality: 'good'
    };
    
    try {
      api = new JitsiMeetExternalAPI("meet.jitsi.si", {
        roomName: "encontrinho-speeddate-${safeRoom}",
        parentNode: document.getElementById("jitsi-container"),
        userInfo: {
          displayName: "${safeName}"
        },
        configOverwrite: {
          // Configurações de áudio e vídeo
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          
          // Recursos avançados
          enableLipSync: true,
          enableNoAudioDetection: true,
          enableNoisyMicDetection: true,
          
          // Chat e compartilhamento
          disableInviteFunctions: false,
          enableWelcomePage: false,
          
          // Qualidade de vídeo
          constraints: {
            video: {
              height: { ideal: 720, max: 1080, min: 360 },
              width: { ideal: 1280, max: 1920, min: 640 }
            }
          },
          
          // Efeitos de fundo
          virtualBackground: {
            enabled: true,
            blur: { enabled: true }
          }
        },
        interfaceConfigOverwrite: {
          // UI customizada
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings',
            'raisehand', 'videoquality', 'filmstrip', 'invite',
            'feedback', 'stats', 'shortcuts', 'tileview', 'download',
            'help', 'mute-everyone', 'e2ee', 'security'
          ],
          VERTICAL_FILMSTRIP: false,
          FILMSTRIP_ONLY: false,
          HIDE_INVITE_MORE_HEADER: false
        }
      });

      // ─── Event Listeners ──────────────────────────────────────────────────
      
      // Quando a conferência está pronta
      api.addEventListener("videoConferenceJoined", function(data) {
        console.log("Joined Jitsi Meet conference:", data);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "conference_joined", data: data })
        );
      });

      // Quando um participante entra
      api.addEventListener("participantJoined", function(data) {
        console.log("Participant joined:", data);
        callStats.participants++;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "participant_joined", data: data })
        );
      });

      // Quando um participante sai
      api.addEventListener("participantLeft", function(data) {
        console.log("Participant left:", data);
        callStats.participants = Math.max(1, callStats.participants - 1);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "participant_left", data: data })
        );
      });

      // Mudança de qualidade de vídeo
      api.addEventListener("videoQualityChanged", function(data) {
        console.log("Video quality changed:", data);
        callStats.videoQuality = data.videoQuality || 'HD';
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "video_quality_changed", data: data })
        );
      });

      // Nível de áudio detectado
      api.addEventListener("audioLevelChanged", function(data) {
        callStats.audioLevel = data.audioLevel || 0;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "audio_level_changed", data: data })
        );
      });

      // Compartilhamento de tela
      api.addEventListener("screenSharingStatusChanged", function(data) {
        console.log("Screen sharing status changed:", data);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "screen_sharing", data: data })
        );
      });

      // Chamada encerrada
      api.addEventListener("videoConferenceLeft", function() {
        console.log("Left Jitsi Meet conference");
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "call_ended" })
        );
      });

      api.addEventListener("readyToClose", function() {
        console.log("Ready to close");
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: "ready_to_close" })
        );
      });

      // Monitorar qualidade de conexão
      setInterval(function() {
        var status = document.getElementById("connection-status");
        if (callStats.connectionQuality === "good") {
          status.textContent = "Conectado - Excelente";
        } else if (callStats.connectionQuality === "fair") {
          status.textContent = "Conectado - Bom";
        } else {
          status.textContent = "Conectado - Fraco";
        }
      }, 5000);

    } catch(e) {
      console.error("Jitsi Meet Error:", e);
      document.body.innerHTML = '<div style="color:white;padding:20px;text-align:center;margin-top:40%"><h2>Erro ao conectar ao Jitsi Meet</h2><p>' + e.message + '</p><p>Verifique sua conexão com a internet</p></div>';
    }
  </script>
</body>
</html>`;
}

// ─── Timer Component ──────────────────────────────────────────────────────────

function CallTimer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [remaining, onExpire]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const isWarning = remaining <= 30;
  const isCritical = remaining <= 10;

  return (
    <View
      style={[
        timerStyles.container,
        isWarning && timerStyles.warning,
        isCritical && timerStyles.critical,
      ]}
    >
      <Text style={timerStyles.text}>
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </Text>
    </View>
  );
}

const timerStyles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  warning: {
    backgroundColor: "rgba(255,193,7,0.2)",
    borderColor: "#FFC107",
  },
  critical: {
    backgroundColor: "rgba(244,67,54,0.2)",
    borderColor: "#F44336",
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function VideoCallScreen() {
  useKeepAwake();
  const { state, endCall } = useSpeedDating();
  const partner = state.currentPartner;
  const roomName = state.currentRoomName ?? `speeddate_${Date.now()}`;
  const displayName = state.profile.name || "Anônimo";
  const [showControls, setShowControls] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<string>("good");
  const [participantCount, setParticipantCount] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Fallback para web - não suporta WebView
  if (Platform.OS === "web") {
    const jitsiUrl = `https://meet.jitsi.si/encontrinho-speeddate-${roomName}`;
    return (
      <ScreenContainer className="bg-background">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center gap-6 p-6">
            <Text className="text-2xl font-bold text-foreground text-center">
              Videochamada - Encontrinho
            </Text>
            <Text className="text-base text-muted text-center">
              No navegador, clique no botão abaixo para abrir o Jitsi Meet em uma nova aba.
            </Text>
            <Pressable
              onPress={() => window.open(jitsiUrl, "_blank")}
              className="bg-error px-8 py-4 rounded-full active:opacity-80"
            >
              <Text className="text-background font-bold text-center">Abrir Videochamada</Text>
            </Pressable>
            <Text className="text-sm text-muted text-center mt-4">
              Para testar completamente, use o app no Expo Go no seu celular (iOS ou Android).
            </Text>
            <Pressable
              onPress={() => {
                endCall(false);
                router.back();
              }}
              className="mt-6 px-6 py-2 border border-border rounded-lg"
            >
              <Text className="text-foreground font-semibold">Voltar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Auto-hide controls after 4s
  const resetControlsTimer = useCallback(() => {
    clearTimeout(controlsTimer.current);
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    setShowControls(true);
    controlsTimer.current = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() =>
        setShowControls(false)
      );
    }, 4000);
  }, [fadeAnim]);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimer.current);
  }, [resetControlsTimer]);

  // Android back button
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleEndCall(false);
      return true;
    });
    return () => sub.remove();
  }, []);

  const handleTimerExpire = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    endCall(false);
    router.replace("/post-call" as any);
  }, [endCall]);

  const handleEndCall = useCallback((liked: boolean) => {
    endCall(liked);
    router.replace("/post-call" as any);
  }, [endCall]);

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("WebView message:", data);

      switch (data.type) {
        case "conference_joined":
          setParticipantCount(1);
          break;
        case "participant_joined":
          setParticipantCount((c) => c + 1);
          break;
        case "participant_left":
          setParticipantCount((c) => Math.max(1, c - 1));
          break;
        case "video_quality_changed":
          setConnectionQuality(data.data?.videoQuality || "good");
          break;
        case "call_ended":
          handleEndCall(false);
          break;
      }
    } catch (e) {
      console.error("Error parsing WebView message:", e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} />

      {/* Jitsi WebView */}
      <WebView
        source={{ html: buildJitsiHtml(roomName || "demo", displayName) }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={false}
        originWhitelist={["*"]}
      />

      {/* Overlay Controls */}
      {showControls && (
        <Animated.View style={[styles.controlsOverlay, { opacity: fadeAnim }]}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <CallTimer totalSeconds={180} onExpire={handleTimerExpire} />
          </View>

          {/* Partner Info */}
          {partner && (
            <View style={styles.partnerInfo}>
              <AvatarCard
                name={partner.name || "Anônimo"}
                age={partner.age || 0}
                photoUri={partner.photoUri || ""}
                showName={true}
              />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <Pressable
              onPress={() => handleEndCall(false)}
              style={({ pressed }) => [
                styles.button,
                styles.skipButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.buttonText}>⏭️ Pular</Text>
            </Pressable>

            <Pressable
              onPress={() => handleEndCall(true)}
              style={({ pressed }) => [
                styles.button,
                styles.likeButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.buttonText}>❤️ Curtir</Text>
            </Pressable>
          </View>

          {/* Connection Status */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {connectionQuality === "good" ? "✓" : "!"} {participantCount} participante(s)
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Tap to show controls */}
      {!showControls && (
        <Pressable
          onPress={resetControlsTimer}
          style={styles.tapZone}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    padding: 16,
    pointerEvents: "box-none",
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  partnerInfo: {
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 100,
    alignItems: "center",
  },
  skipButton: {
    backgroundColor: "rgba(200, 200, 200, 0.9)",
  },
  likeButton: {
    backgroundColor: "rgba(196, 30, 58, 0.95)",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  statusBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  tapZone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
