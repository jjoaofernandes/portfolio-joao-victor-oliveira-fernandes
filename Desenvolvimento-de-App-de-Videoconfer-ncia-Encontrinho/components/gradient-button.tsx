import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  colors?: [string, string];
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function GradientButton({
  label,
  onPress,
  colors = ["#C41E3A", "#FF1744"],
  style,
  textStyle,
  disabled = false,
  size = "md",
}: GradientButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
    md: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 28 },
    lg: { paddingVertical: 18, paddingHorizontal: 48, borderRadius: 32 },
  };

  const textSizes = {
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrapper,
        style,
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
        disabled && { opacity: 0.5 },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyles[size]]}
      >
        <Text style={[styles.label, textSizes[size], textStyle]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
