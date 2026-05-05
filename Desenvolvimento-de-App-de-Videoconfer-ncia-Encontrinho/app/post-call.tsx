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

export default function PostCallScreen() {
  const { state } = useSpeedDating();
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Check if last encounter resulted in a match
  const lastEncounter = state.encounters[0];
  const lastMatch = state.matches[0];
  const isMatch =
    lastEncounter &&
    lastMatch &&
    lastMatch.userId === lastEncounter.partnerId &&
    Math.abs(
      new Date(lastMatch.matchedAt).getTime() -
        new Date(lastEncounter.encounteredAt).getTime()
    ) < 5000;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 150 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    if (isMatch && Platform.OS !== "web") {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 400);
    }
  }, [isMatch]);

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleGoMatches = () => {
    router.replace("/(tabs)/matches" as any);
  };

  if (isMatch) {
    return (
      <LinearGradient
        colors={["#C41E3A", "#FF1744"]}
        style={styles.root}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar style="light" />
        <Animated.View
          style={[styles.content, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={styles.matchEmoji}>🎉</Text>
          <Text style={styles.matchTitle}>É um Match!</Text>
          <Text style={styles.matchSubtitle}>
            Você e {lastMatch?.name} se curtiram!
          </Text>

          {lastMatch && (
            <View style={styles.matchAvatars}>
              <AvatarCard
                name={state.profile.name || "Você"}
                photoUri={state.profile.photoUri}
                size={80}
                showName
              />
              <Text style={styles.heartBetween}>❤️</Text>
              <AvatarCard
                name={lastMatch.name}
                photoUri={lastMatch.photoUri}
                size={80}
                showName
              />
            </View>
          )}

          <Pressable
            onPress={handleGoMatches}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.primaryBtnText}>💬 Enviar Mensagem</Text>
          </Pressable>

          <Pressable
            onPress={handleGoHome}
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.secondaryBtnText}>Continuar Encontros</Text>
          </Pressable>
        </Animated.View>
      </LinearGradient>
    );
  }

  // No match
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <Animated.View
        style={[styles.content, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.noMatchEmoji}>👋</Text>
        <Text style={[styles.noMatchTitle, { color: colors.foreground }]}>
          Encontro encerrado!
        </Text>
        <Text style={[styles.noMatchSubtitle, { color: colors.muted }]}>
          {lastEncounter?.liked
            ? `Você curtiu ${lastEncounter.partnerName}. Aguardando resposta deles...`
            : "Não foi dessa vez, mas há muitas pessoas incríveis esperando!"}
        </Text>

        {lastEncounter && (
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AvatarCard
              name={lastEncounter.partnerName}
              photoUri={lastEncounter.partnerPhotoUri}
              size={64}
              showName
            />
            <View style={styles.summaryInfo}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>Duração</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {Math.floor(lastEncounter.duration / 60)}min
              </Text>
            </View>
            <Text style={styles.summaryHeart}>{lastEncounter.liked ? "❤️" : "👋"}</Text>
          </View>
        )}

        <Pressable
          onPress={handleGoHome}
          style={({ pressed }) => [
            styles.homeBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
        >
          <Text style={styles.homeBtnText}>🏠 Voltar ao Início</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.replace("/waiting-room" as any);
          }}
          style={({ pressed }) => [styles.nextBtn, { borderColor: colors.primary }, pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.nextBtnText, { color: colors.primary }]}>⚡ Próximo Encontro</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 20,
  },
  // Match styles
  matchEmoji: { fontSize: 72 },
  matchTitle: { fontSize: 36, fontWeight: "800", color: "#fff" },
  matchSubtitle: { fontSize: 16, color: "rgba(255,255,255,0.85)", textAlign: "center" },
  matchAvatars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginVertical: 8,
  },
  heartBetween: { fontSize: 32 },
  primaryBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    width: "100%",
    alignItems: "center",
  },
  primaryBtnText: { color: "#C41E3A", fontSize: 16, fontWeight: "800" },
  secondaryBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryBtnText: { color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: "600" },
  // No match styles
  noMatchEmoji: { fontSize: 64 },
  noMatchTitle: { fontSize: 26, fontWeight: "800", textAlign: "center" },
  noMatchSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
    width: "100%",
  },
  summaryInfo: { flex: 1 },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 18, fontWeight: "700" },
  summaryHeart: { fontSize: 24 },
  homeBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
    width: "100%",
    alignItems: "center",
  },
  homeBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  nextBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 2,
    width: "100%",
    alignItems: "center",
  },
  nextBtnText: { fontSize: 15, fontWeight: "700" },
});
