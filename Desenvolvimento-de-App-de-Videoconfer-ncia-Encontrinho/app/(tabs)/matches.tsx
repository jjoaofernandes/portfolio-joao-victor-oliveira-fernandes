import React from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSpeedDating, Match } from "@/lib/speed-dating-context";
import { AvatarCard } from "@/components/avatar-card";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

function MatchItem({ match, onPress }: { match: Match; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.matchCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      <AvatarCard
        name={match.name}
        age={match.age}
        photoUri={match.photoUri}
        size={56}
        online
      />
      <View style={styles.matchInfo}>
        <Text style={[styles.matchName, { color: colors.foreground }]}>{match.name}</Text>
        {match.age > 0 && (
          <Text style={[styles.matchAge, { color: colors.muted }]}>{match.age} anos</Text>
        )}
        <Text style={[styles.matchTime, { color: colors.muted }]}>
          Match em {new Date(match.matchedAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>
      <View style={[styles.chatBtn, { backgroundColor: colors.primary }]}>
        <Text style={styles.chatBtnText}>💬</Text>
      </View>
    </Pressable>
  );
}

export default function MatchesScreen() {
  const { state } = useSpeedDating();
  const colors = useColors();

  const handleMatchPress = (match: Match) => {
    router.push({ pathname: "/chat" as any, params: { matchId: match.id } });
  };

  if (state.matches.length === 0) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Matches ❤️</Text>
        </View>
        <View style={styles.emptyState}>
          <LinearGradient
            colors={["#C41E3A22", "#FF174422"]}
            style={styles.emptyIcon}
          >
            <Text style={styles.emptyEmoji}>💔</Text>
          </LinearGradient>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Nenhum match ainda
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Participe de um evento de Speed Dating e comece a se conectar com pessoas incríveis!
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Matches ❤️</Text>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{state.matches.length}</Text>
        </View>
      </View>

      <FlatList
        data={state.matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MatchItem match={item} onPress={() => handleMatchPress(item)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 26, fontWeight: "800" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  matchInfo: { flex: 1, gap: 2 },
  matchName: { fontSize: 16, fontWeight: "700" },
  matchAge: { fontSize: 13 },
  matchTime: { fontSize: 12, marginTop: 2 },
  chatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  chatBtnText: { fontSize: 18 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  emptySubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});
