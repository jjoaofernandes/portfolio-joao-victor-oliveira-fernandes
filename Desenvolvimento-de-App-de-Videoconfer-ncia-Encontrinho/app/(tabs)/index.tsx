import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSpeedDating } from "@/lib/speed-dating-context";
import { GradientButton } from "@/components/gradient-button";
import { AvatarCard } from "@/components/avatar-card";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

function useCountdown(targetHour: number, targetMin: number) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, targetMin, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      setSeconds(Math.floor((target.getTime() - now.getTime()) / 1000));
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetHour, targetMin]);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function HomeScreen() {
  const { state, startEvent } = useSpeedDating();
  const colors = useColors();
  const countdown = useCountdown(21, 0); // Evento às 21:00

  const handleJoinEvent = () => {
    startEvent();
    router.push("/waiting-room" as any);
  };

  const handleMatchPress = (matchId: string) => {
    router.push({ pathname: "/chat" as any, params: { matchId } });
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.muted }]}>Olá,</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {state.profile.name || "Visitante"} 👋
            </Text>
          </View>
          <AvatarCard
            name={state.profile.name || "?"}
            photoUri={state.profile.photoUri}
            size={48}
          />
        </View>

        {/* Event Card */}
        <LinearGradient
          colors={["#C41E3A", "#FF1744"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventCard}
        >
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>AO VIVO EM BREVE</Text>
          </View>
          <Text style={styles.eventTitle}>Speed Dating</Text>
          <Text style={styles.eventSubtitle}>Encontros de 3 minutos</Text>
          <View style={styles.countdownRow}>
            <Text style={styles.countdownLabel}>Próximo evento em</Text>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
          <Pressable
            onPress={handleJoinEvent}
            style={({ pressed }) => [
              styles.joinBtn,
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.joinBtnText}>🎥 Entrar no Evento</Text>
          </Pressable>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{state.matches.length}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Matches</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{state.encounters.length}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Encontros</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {state.encounters.filter((e) => e.liked).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Curtidas</Text>
          </View>
        </View>

        {/* Recent Matches */}
        {state.matches.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Seus Matches ❤️</Text>
            <FlatList
              data={state.matches.slice(0, 8)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.matchList}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleMatchPress(item.id)} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
                  <AvatarCard
                    name={item.name}
                    age={item.age}
                    photoUri={item.photoUri}
                    size={60}
                    showName
                    online
                  />
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Recent Encounters */}
        {state.encounters.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Histórico</Text>
            {state.encounters.slice(0, 5).map((enc) => (
              <View
                key={enc.id}
                style={[styles.encounterCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <AvatarCard name={enc.partnerName} photoUri={enc.partnerPhotoUri} size={44} />
                <View style={styles.encounterInfo}>
                  <Text style={[styles.encounterName, { color: colors.foreground }]}>{enc.partnerName}</Text>
                  <Text style={[styles.encounterTime, { color: colors.muted }]}>
                    {new Date(enc.encounteredAt).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <Text style={styles.encounterHeart}>{enc.liked ? "❤️" : "👋"}</Text>
              </View>
            ))}
          </View>
        )}

        {state.encounters.length === 0 && state.matches.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💫</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Pronto para começar?</Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Entre em um evento e conheça pessoas incríveis em encontros de 3 minutos!
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { fontSize: 14, fontWeight: "500" },
  name: { fontSize: 22, fontWeight: "800" },
  eventCard: {
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },
  eventBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  eventBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  eventTitle: { color: "#fff", fontSize: 26, fontWeight: "800" },
  eventSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  countdownRow: { marginTop: 4 },
  countdownLabel: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  countdown: { color: "#fff", fontSize: 32, fontWeight: "800", fontVariant: ["tabular-nums"] },
  joinBtn: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  joinBtnText: { color: "#C41E3A", fontSize: 16, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  statNumber: { fontSize: 24, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "500" },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  matchList: { gap: 16, paddingHorizontal: 4 },
  encounterCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  encounterInfo: { flex: 1 },
  encounterName: { fontSize: 15, fontWeight: "600" },
  encounterTime: { fontSize: 12, marginTop: 2 },
  encounterHeart: { fontSize: 20 },
  emptyState: { alignItems: "center", paddingVertical: 32, gap: 12 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 22, paddingHorizontal: 16 },
});
