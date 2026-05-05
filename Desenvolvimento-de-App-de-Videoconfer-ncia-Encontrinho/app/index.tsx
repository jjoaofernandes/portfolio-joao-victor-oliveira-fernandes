import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useSpeedDating } from "@/lib/speed-dating-context";
import { useColors } from "@/hooks/use-colors";

export default function IndexScreen() {
  const { state } = useSpeedDating();
  const colors = useColors();

  useEffect(() => {
    // Small delay to let state load from AsyncStorage
    const timer = setTimeout(() => {
      if (!state.onboardingDone) {
        router.replace("/onboarding" as any);
      } else if (!state.profile.setupComplete) {
        router.replace("/setup" as any);
      } else {
        router.replace("/(tabs)");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [state.onboardingDone, state.profile.setupComplete]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
