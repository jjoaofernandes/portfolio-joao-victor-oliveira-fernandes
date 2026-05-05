import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Platform,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useSpeedDating, Gender, Preference } from "@/lib/speed-dating-context";
import { GradientButton } from "@/components/gradient-button";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

const GENDERS: { label: string; value: Gender }[] = [
  { label: "Homem", value: "man" },
  { label: "Mulher", value: "woman" },
  { label: "Não-binário", value: "nonbinary" },
  { label: "Outro", value: "other" },
];

const PREFERENCES: { label: string; value: Preference }[] = [
  { label: "Homens", value: "men" },
  { label: "Mulheres", value: "women" },
  { label: "Todos", value: "all" },
];

const DURATIONS = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
];

export default function ProfileScreen() {
  const { state, dispatch } = useSpeedDating();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [name, setName] = useState(state.profile.name);
  const [age, setAge] = useState(String(state.profile.age));
  const [gender, setGender] = useState<Gender>(state.profile.gender);
  const [preference, setPreference] = useState<Preference>(state.profile.preference);
  const [bio, setBio] = useState(state.profile.bio);
  const [photoUri, setPhotoUri] = useState<string | null>(state.profile.photoUri);
  const [editing, setEditing] = useState(false);

  const pickPhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const parsedAge = parseInt(age, 10);
    if (!name.trim() || isNaN(parsedAge) || parsedAge < 18) {
      Alert.alert("Dados inválidos", "Verifique nome e idade.");
      return;
    }
    dispatch({
      type: "SET_PROFILE",
      payload: { name: name.trim(), age: parsedAge, gender, preference, bio: bio.trim(), photoUri },
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setEditing(false);
  };

  const handleReset = () => {
    Alert.alert(
      "Resetar dados",
      "Isso apagará todos os seus matches e histórico. Continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "LOAD_STATE", payload: { matches: [], encounters: [], messages: [] } });
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <LinearGradient
          colors={["#C41E3A", "#FF1744"]}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Pressable onPress={editing ? pickPhoto : undefined} style={styles.photoWrapper}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoInitials}>
                  {name ? name[0].toUpperCase() : "?"}
                </Text>
              </View>
            )}
            {editing && (
              <View style={styles.editPhotoOverlay}>
                <Text style={styles.editPhotoText}>📷</Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.profileName}>{state.profile.name || "Seu Nome"}</Text>
          <Text style={styles.profileBio}>{state.profile.bio || "Adicione uma bio"}</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{state.matches.length}</Text>
            <Text style={[styles.statLbl, { color: colors.muted }]}>Matches</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>{state.encounters.length}</Text>
            <Text style={[styles.statLbl, { color: colors.muted }]}>Encontros</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statNum, { color: colors.primary }]}>
              {state.encounters.length > 0
                ? Math.round((state.encounters.filter((e) => e.liked).length / state.encounters.length) * 100)
                : 0}%
            </Text>
            <Text style={[styles.statLbl, { color: colors.muted }]}>Curtidas</Text>
          </View>
        </View>

        {/* Edit Toggle */}
        <Pressable
          onPress={() => setEditing(!editing)}
          style={[styles.editToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.editToggleText, { color: colors.primary }]}>
            {editing ? "✕ Cancelar edição" : "✏️ Editar perfil"}
          </Text>
        </Pressable>

        {editing && (
          <View style={styles.editForm}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Nome</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                maxLength={40}
              />
            </View>

            {/* Age */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Idade</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                maxLength={2}
              />
            </View>

            {/* Gender */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Gênero</Text>
              <View style={styles.chips}>
                {GENDERS.map((g) => (
                  <Pressable
                    key={g.value}
                    onPress={() => setGender(g.value)}
                    style={[
                      styles.chip,
                      { backgroundColor: gender === g.value ? colors.primary : colors.surface, borderColor: gender === g.value ? colors.primary : colors.border },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: gender === g.value ? "#fff" : colors.foreground }]}>
                      {g.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Preference */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Interessa-se por</Text>
              <View style={styles.chips}>
                {PREFERENCES.map((p) => (
                  <Pressable
                    key={p.value}
                    onPress={() => setPreference(p.value)}
                    style={[
                      styles.chip,
                      { backgroundColor: preference === p.value ? colors.primary : colors.surface, borderColor: preference === p.value ? colors.primary : colors.border },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: preference === p.value ? "#fff" : colors.foreground }]}>
                      {p.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Bio */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.foreground }]}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                style={[styles.input, styles.bioInput, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                maxLength={150}
              />
              <Text style={[styles.charCount, { color: colors.muted }]}>{bio.length}/150</Text>
            </View>

            <GradientButton label="Salvar alterações" onPress={handleSave} />
          </View>
        )}

        {/* Duration Setting */}
        <View style={[styles.settingSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.settingTitle, { color: colors.foreground }]}>⏱️ Duração dos encontros</Text>
          <View style={styles.chips}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d.value}
                onPress={() => dispatch({ type: "SET_CALL_DURATION", payload: d.value })}
                style={[
                  styles.chip,
                  {
                    backgroundColor: state.callDuration === d.value ? colors.primary : colors.background,
                    borderColor: state.callDuration === d.value ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: state.callDuration === d.value ? "#fff" : colors.foreground }]}>
                  {d.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Danger Zone */}
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [
            styles.dangerBtn,
            { borderColor: colors.error },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={[styles.dangerText, { color: colors.error }]}>🗑️ Resetar histórico</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: 16, paddingBottom: 48 },
  profileHeader: {
    alignItems: "center",
    padding: 32,
    paddingTop: 24,
    gap: 8,
  },
  photoWrapper: { position: "relative" },
  photo: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: "#fff" },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoInitials: { fontSize: 36, color: "#fff", fontWeight: "700" },
  editPhotoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editPhotoText: { fontSize: 14 },
  profileName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  profileBio: { color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center" },
  statsRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  statNum: { fontSize: 22, fontWeight: "800" },
  statLbl: { fontSize: 11, fontWeight: "500" },
  editToggle: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  editToggleText: { fontSize: 15, fontWeight: "700" },
  editForm: { paddingHorizontal: 16, gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  bioInput: { minHeight: 80, textAlignVertical: "top", paddingTop: 12 },
  charCount: { fontSize: 12, textAlign: "right" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontWeight: "600" },
  settingSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  settingTitle: { fontSize: 15, fontWeight: "700" },
  dangerBtn: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
  },
  dangerText: { fontSize: 15, fontWeight: "600" },
});
