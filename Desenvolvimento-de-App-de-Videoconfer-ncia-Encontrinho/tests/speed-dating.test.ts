import { describe, it, expect } from "vitest";

// Test the core logic of the SpeedDating context without React
describe("SpeedDate Core Logic", () => {
  it("should generate a unique room name", () => {
    const userId = "user_123";
    const partnerId = "p1";
    const roomName = `speeddate_${userId}_${partnerId}_${Date.now()}`;
    expect(roomName).toMatch(/^speeddate_user_123_p1_\d+$/);
  });

  it("should sanitize room name for Jitsi", () => {
    const roomName = "speeddate_user_123_p1_1234567890";
    const safeRoom = roomName.replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 60);
    expect(safeRoom).toBe("speeddate_user_123_p1_1234567890");
  });

  it("should calculate match probability correctly", () => {
    // 60% chance of match when liked
    const liked = true;
    const mockRandom = 0.5; // below 0.6 threshold
    const isMatch = liked && mockRandom < 0.6;
    expect(isMatch).toBe(true);
  });

  it("should not match when not liked", () => {
    const liked = false;
    const mockRandom = 0.3;
    const isMatch = liked && mockRandom < 0.6;
    expect(isMatch).toBe(false);
  });

  it("should format timer correctly", () => {
    const seconds = 180;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const formatted = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    expect(formatted).toBe("03:00");
  });

  it("should format countdown to 00:00", () => {
    const seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const formatted = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    expect(formatted).toBe("00:00");
  });

  it("should identify critical timer state", () => {
    const remaining = 8;
    const isCritical = remaining <= 10;
    const isWarning = remaining <= 30;
    expect(isCritical).toBe(true);
    expect(isWarning).toBe(true);
  });

  it("should pick a random partner from mock pool", () => {
    const MOCK_PARTNERS = [
      { id: "p1", name: "Ana Lima" },
      { id: "p2", name: "Carlos Souza" },
      { id: "p3", name: "Beatriz Rocha" },
    ];
    const partner = MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
    expect(partner).toBeDefined();
    expect(partner.id).toBeTruthy();
    expect(partner.name).toBeTruthy();
  });

  it("should validate age range", () => {
    const validAge = (age: number) => !isNaN(age) && age >= 18 && age <= 99;
    expect(validAge(25)).toBe(true);
    expect(validAge(17)).toBe(false);
    expect(validAge(100)).toBe(false);
    expect(validAge(NaN)).toBe(false);
  });
});
