import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface AvatarCardProps {
  name: string;
  age?: number;
  photoUri?: string | null;
  size?: number;
  showName?: boolean;
  online?: boolean;
  style?: ViewStyle;
}

export function AvatarCard({
  name,
  age,
  photoUri,
  size = 56,
  showName = false,
  online = false,
  style,
}: AvatarCardProps) {
  const colors = useColors();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.avatarWrapper, { width: size, height: size, borderRadius: size / 2 }]}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
          </View>
        )}
        {online && (
          <View
            style={[
              styles.onlineDot,
              {
                width: size * 0.22,
                height: size * 0.22,
                borderRadius: size * 0.11,
                bottom: 1,
                right: 1,
                borderColor: colors.background,
              },
            ]}
          />
        )}
      </View>
      {showName && (
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {name}
          {age ? `, ${age}` : ""}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  avatarWrapper: {
    position: "relative",
  },
  image: {
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  onlineDot: {
    position: "absolute",
    backgroundColor: "#4CAF50",
    borderWidth: 2,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 64,
  },
});
