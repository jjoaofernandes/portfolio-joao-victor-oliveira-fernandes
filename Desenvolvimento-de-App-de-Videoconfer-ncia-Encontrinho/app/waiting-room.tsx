import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useSpeedDating } from "@/lib/speed-dating-context";
import { AvatarCard } from "@/components/avatar-card";
import { useColors } from "@/hooks/use-colors";
import { StatusBar } from "expo-status-bar";

export default function WaitingRoomScreen() {
  const { state, dispatch } = useSpeedDating();
  const colors = useColors();
  const pulse = useRef(new Animated.Value(1)).current;
  const partner = state.currentPartner;

  // Pulse animation
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulse]);

  // Auto-enter call after 2s (simulating matchmaking)
  useEffect(() => {
    if (!partner) return;
    const timer = setTimeout(() => {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      dispatch({ type: "SET_EVENT_STATUS", payload: "in-call" });
      router.replace("/video-call" as any);
    }, 2500);
    return () => clearTimeout(timer);
  }, [partner]);

  const handleCancel = () => {
    dispatch({ type: "SET_EVENT_STATUS", payload: "idle" });
    dispatch({ type: "SET_CURRENT_PARTNER", payload: null });
    dispatch({ type: "SET_CURRENT_ROOM", payload: null });
    router.back();
  };

  return (
    <LinearGradient
      colors={["#C41E3A", "#FF1744", "#A01030"]}
      style={styles.root}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.title}>Encontrando parceiro...</Text>
        <Text style={styles.subtitle}>Aguarde enquanto conectamos você</Text>

        {/* Pulse avatar */}
        <View style={styles.pulseWrapper}>
          <Animated.View style={[styles.pulseRing, styles.ring3, { transform: [{ scale: pulse }] }]} />
          <Animated.View style={[styles.pulseRing, styles.ring2, { transform: [{ scale: pulse }] }]} />
          <Animated.View style={[styles.pulseRing, styles.ring1, { transform: [{ scale: pulse }] }]} />
          <View style={styles.avatarCenter}>
            <Text style={styles.avatarEmoji}>🎥</Text>
          </View>
        </View>

        {partner && (
          <View style={styles.partnerFound}>
            <Text style={styles.foundText}>✨ Parceiro encontrado!</Text>
            <AvatarCard
              name={partner.name ?? ""}
              age={partner.age}
              photoUri={partner.photoUri}
              size={72}
              showName
            />
            <Text style={styles.connectingText}>Conectando videochamada...</Text>
          </View>
        )}

        <View style={styles.onlineInfo}>
          <View style={styles.dot} />
          <Text style={styles.onlineText}>
            {partner ? "1 parceiro encontrado" : "Buscando participantes..."}
          </Text>
        </View>

        <Pressable
          onPress={handleCancel}
          style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
  },
  pulseWrapper: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  pulseRing: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 2,
  },
  ring1: {
    width: 100,
    height: 100,
    borderColor: "rgba(255,255,255,0.5)",
  },
  ring2: {
    width: 130,
    height: 130,
    borderColor: "rgba(255,255,255,0.3)",
  },
  ring3: {
    width: 160,
    height: 160,
    borderColor: "rgba(255,255,255,0.15)",
  },
  avatarCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 36 },
  partnerFound: {
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 20,
    width: "100%",
  },
  foundText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  connectingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  onlineInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  onlineText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  cancelBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  cancelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
