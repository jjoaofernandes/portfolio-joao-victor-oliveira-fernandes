import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useSpeedDating, Gender, Preference } from "@/lib/speed-dating-context";
import { GradientButton } from "@/components/gradient-button";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { StatusBar } from "expo-status-bar";

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

export default function SetupScreen() {
  const { state, dispatch } = useSpeedDating();
  const colors = useColors();
  const [name, setName] = useState(state.profile.name);
  const [age, setAge] = useState(String(state.profile.age));
  const [gender, setGender] = useState<Gender>(state.profile.gender);
  const [preference, setPreference] = useState<Preference>(state.profile.preference);
  const [bio, setBio] = useState(state.profile.bio);
  const [photoUri, setPhotoUri] = useState<string | null>(state.profile.photoUri);

  const pickPhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
        return;
      }
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
    if (!name.trim()) {
      Alert.alert("Nome obrigatório", "Por favor, insira seu nome.");
      return;
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 99) {
      Alert.alert("Idade inválida", "Por favor, insira uma idade entre 18 e 99.");
      return;
    }
    dispatch({
      type: "SET_PROFILE",
      payload: {
        name: name.trim(),
        age: parsedAge,
        gender,
        preference,
        bio: bio.trim(),
        photoUri,
        setupComplete: true,
      },
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} containerClassName="bg-background">
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Seu Perfil</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Conte um pouco sobre você para começar
        </Text>

        {/* Photo */}
        <Pressable onPress={pickPhoto} style={styles.photoWrapper}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={[styles.photoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={styles.photoEmoji}>📷</Text>
              <Text style={[styles.photoLabel, { color: colors.muted }]}>Adicionar foto</Text>
            </View>
          )}
        </Pressable>

        {/* Name */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>Nome de exibição</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Como quer ser chamado?"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
            maxLength={40}
            returnKeyType="done"
          />
        </View>

        {/* Age */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>Idade</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Sua idade"
            placeholderTextColor={colors.muted}
            keyboardType="number-pad"
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
            maxLength={2}
            returnKeyType="done"
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
                  {
                    backgroundColor: gender === g.value ? colors.primary : colors.surface,
                    borderColor: gender === g.value ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: gender === g.value ? "#fff" : colors.foreground },
                  ]}
                >
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
                  {
                    backgroundColor: preference === p.value ? colors.primary : colors.surface,
                    borderColor: preference === p.value ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: preference === p.value ? "#fff" : colors.foreground },
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.foreground }]}>Bio curta</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Conte algo sobre você..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            style={[
              styles.input,
              styles.bioInput,
              { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            maxLength={150}
          />
          <Text style={[styles.charCount, { color: colors.muted }]}>{bio.length}/150</Text>
        </View>

        <GradientButton label="Salvar e Continuar" onPress={handleSave} size="lg" style={styles.saveBtn} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 24,
    gap: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  photoWrapper: {
    alignSelf: "center",
    marginVertical: 8,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoEmoji: { fontSize: 28 },
  photoLabel: { fontSize: 11, fontWeight: "600" },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  charCount: { fontSize: 12, textAlign: "right" },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  saveBtn: { marginTop: 8 },
});
