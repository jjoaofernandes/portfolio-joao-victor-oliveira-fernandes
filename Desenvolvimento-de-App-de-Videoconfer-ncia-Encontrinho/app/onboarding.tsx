import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSpeedDating } from "@/lib/speed-dating-context";
import { GradientButton } from "@/components/gradient-button";
import { useColors } from "@/hooks/use-colors";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const slides = [
  {
    emoji: "⚡",
    title: "Encontros em 3 Minutos",
    subtitle:
      "Conheça pessoas incríveis em videochamadas rápidas e descubra conexões reais sem perder tempo.",
    gradient: ["#C41E3A", "#FF1744"] as [string, string],
  },
  {
    emoji: "🎥",
    title: "Vídeo ao Vivo",
    subtitle:
      "Powered by Jitsi Meet — videochamadas seguras, sem cadastro externo, direto no app.",
    gradient: ["#FF1744", "#C41E3A"] as [string, string],
  },
  {
    emoji: "❤️",
    title: "Descubra Conexões Reais",
    subtitle:
      "Ao final de cada encontro, vote se quer continuar. Match mútuo = conexão real!",
    gradient: ["#C41E3A", "#FF1744"] as [string, string],
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const { dispatch } = useSpeedDating();
  const colors = useColors();

  const goTo = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrent(index);
  };

  const handleNext = () => {
    if (current < slides.length - 1) {
      goTo(current + 1);
    } else {
      handleStart();
    }
  };

  const handleStart = () => {
    dispatch({ type: "SET_ONBOARDING_DONE" });
    router.replace("/setup" as any);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scroll}
      >
        {slides.map((slide, i) => (
          <LinearGradient
            key={i}
            colors={slide.gradient}
            style={[styles.slide, { width }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.slideContent}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)} style={styles.dotWrapper}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === current ? "#C41E3A" : colors.border,
                    width: i === current ? 24 : 8,
                  },
                ]}
              />
            </Pressable>
          ))}
        </View>

        <GradientButton
          label={current === slides.length - 1 ? "Começar" : "Próximo"}
          onPress={handleNext}
          size="lg"
        />

        {current < slides.length - 1 && (
          <Pressable onPress={handleStart} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.muted }]}>Pular</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: "center",
    gap: 20,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 16,
    alignItems: "stretch",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  dotWrapper: { padding: 4 },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
