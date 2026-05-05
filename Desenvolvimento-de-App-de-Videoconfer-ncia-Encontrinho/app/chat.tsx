import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSpeedDating, ChatMessage } from "@/lib/speed-dating-context";
import { AvatarCard } from "@/components/avatar-card";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { state, sendMessage, getMatchMessages } = useSpeedDating();
  const colors = useColors();
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const match = state.matches.find((m) => m.id === matchId);
  const messages = getMatchMessages(matchId ?? "");

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!text.trim() || !matchId) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    sendMessage(matchId, text.trim());
    setText("");
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === state.profile.id;
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        {!isMe && match && (
          <AvatarCard name={match.name} photoUri={match.photoUri} size={28} />
        )}
        <View
          style={[
            styles.bubble,
            isMe
              ? [styles.bubbleMe, { backgroundColor: colors.primary }]
              : [styles.bubbleThem, { backgroundColor: colors.surface, borderColor: colors.border }],
          ]}
        >
          <Text style={[styles.bubbleText, { color: isMe ? "#fff" : colors.foreground }]}>
            {item.text}
          </Text>
          <Text style={[styles.bubbleTime, { color: isMe ? "rgba(255,255,255,0.6)" : colors.muted }]}>
            {new Date(item.sentAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  if (!match) {
    return (
      <ScreenContainer>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.muted }]}>Match não encontrado</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Voltar</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <StatusBar style="auto" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: colors.primary }]}>‹</Text>
        </Pressable>
        <AvatarCard name={match.name} photoUri={match.photoUri} size={40} online />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: colors.foreground }]}>{match.name}</Text>
          <Text style={[styles.headerStatus, { color: colors.success }]}>● Online</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatEmoji}>💬</Text>
            <Text style={[styles.emptyChatText, { color: colors.muted }]}>
              Comece a conversa com {match.name}!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input */}
        <View style={[styles.inputRow, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={`Mensagem para ${match.name}...`}
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!text.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: text.trim() ? colors.primary : colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 10,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 32, fontWeight: "300", lineHeight: 36 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: "700" },
  headerStatus: { fontSize: 12 },
  messageList: { padding: 16, gap: 8, paddingBottom: 24 },
  msgRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginVertical: 2,
  },
  msgRowMe: { justifyContent: "flex-end" },
  msgRowThem: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "75%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 2,
  },
  bubbleMe: { borderBottomRightRadius: 4 },
  bubbleThem: { borderWidth: 1, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  bubbleTime: { fontSize: 10, textAlign: "right" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    borderTopWidth: 0.5,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: { color: "#fff", fontSize: 18, fontWeight: "700" },
  emptyChat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyChatEmoji: { fontSize: 48 },
  emptyChatText: { fontSize: 15, textAlign: "center" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16 },
  backLink: { fontSize: 16, fontWeight: "600" },
});
