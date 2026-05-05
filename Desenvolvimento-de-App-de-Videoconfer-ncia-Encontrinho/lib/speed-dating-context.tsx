import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Gender = "man" | "woman" | "nonbinary" | "other";
export type Preference = "men" | "women" | "all";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  preference: Preference;
  bio: string;
  photoUri: string | null;
  setupComplete: boolean;
}

export interface Match {
  id: string;
  userId: string;
  name: string;
  age: number;
  photoUri: string | null;
  matchedAt: string;
  roomName: string;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export interface EncounterRecord {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerPhotoUri: string | null;
  roomName: string;
  duration: number; // seconds
  liked: boolean;
  matchedAt?: string;
  encounteredAt: string;
}

export type EventStatus = "idle" | "waiting" | "in-call" | "post-call" | "results";

interface State {
  profile: UserProfile;
  onboardingDone: boolean;
  matches: Match[];
  encounters: EncounterRecord[];
  messages: ChatMessage[];
  eventStatus: EventStatus;
  currentPartner: Partial<UserProfile> | null;
  currentRoomName: string | null;
  callDuration: number; // seconds per round
}

type Action =
  | { type: "SET_PROFILE"; payload: Partial<UserProfile> }
  | { type: "SET_ONBOARDING_DONE" }
  | { type: "SET_EVENT_STATUS"; payload: EventStatus }
  | { type: "SET_CURRENT_PARTNER"; payload: Partial<UserProfile> | null }
  | { type: "SET_CURRENT_ROOM"; payload: string | null }
  | { type: "ADD_MATCH"; payload: Match }
  | { type: "ADD_ENCOUNTER"; payload: EncounterRecord }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_CALL_DURATION"; payload: number }
  | { type: "LOAD_STATE"; payload: Partial<State> };

// ─── Mock partner pool ────────────────────────────────────────────────────────

export const MOCK_PARTNERS: Partial<UserProfile>[] = [
  { id: "p1", name: "Ana Lima", age: 27, gender: "woman", bio: "Amo viajar e descobrir novos sabores!", photoUri: null },
  { id: "p2", name: "Carlos Souza", age: 31, gender: "man", bio: "Dev apaixonado por música e café.", photoUri: null },
  { id: "p3", name: "Beatriz Rocha", age: 25, gender: "woman", bio: "Artista e amante de livros.", photoUri: null },
  { id: "p4", name: "Lucas Mendes", age: 29, gender: "man", bio: "Esportes, natureza e boas conversas.", photoUri: null },
  { id: "p5", name: "Fernanda Costa", age: 33, gender: "woman", bio: "Chef de cozinha e viajante.", photoUri: null },
];

// ─── Initial state ────────────────────────────────────────────────────────────

const defaultProfile: UserProfile = {
  id: `user_${Date.now()}`,
  name: "",
  age: 25,
  gender: "other",
  preference: "all",
  bio: "",
  photoUri: null,
  setupComplete: false,
};

const initialState: State = {
  profile: defaultProfile,
  onboardingDone: false,
  matches: [],
  encounters: [],
  messages: [],
  eventStatus: "idle",
  currentPartner: null,
  currentRoomName: null,
  callDuration: 180, // 3 minutes default
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case "SET_ONBOARDING_DONE":
      return { ...state, onboardingDone: true };
    case "SET_EVENT_STATUS":
      return { ...state, eventStatus: action.payload };
    case "SET_CURRENT_PARTNER":
      return { ...state, currentPartner: action.payload };
    case "SET_CURRENT_ROOM":
      return { ...state, currentRoomName: action.payload };
    case "ADD_MATCH":
      return { ...state, matches: [action.payload, ...state.matches] };
    case "ADD_ENCOUNTER":
      return { ...state, encounters: [action.payload, ...state.encounters] };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_CALL_DURATION":
      return { ...state, callDuration: action.payload };
    case "LOAD_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  startEvent: () => void;
  endCall: (liked: boolean) => void;
  sendMessage: (matchId: string, text: string) => void;
  getMatchMessages: (matchId: string) => ChatMessage[];
}

const SpeedDatingContext = createContext<ContextValue | null>(null);

const STORAGE_KEY = "speeddate_state_v1";

export function SpeedDatingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist & load state
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<State>;
          dispatch({ type: "LOAD_STATE", payload: saved });
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    const toSave: Partial<State> = {
      profile: state.profile,
      onboardingDone: state.onboardingDone,
      matches: state.matches,
      encounters: state.encounters,
      messages: state.messages,
      callDuration: state.callDuration,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state.profile, state.onboardingDone, state.matches, state.encounters, state.messages, state.callDuration]);

  // ── Actions ──

  function startEvent() {
    // Pick a random mock partner
    const partner = MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
    const roomName = `speeddate_${state.profile.id}_${partner.id}_${Date.now()}`;
    dispatch({ type: "SET_CURRENT_PARTNER", payload: partner });
    dispatch({ type: "SET_CURRENT_ROOM", payload: roomName });
    dispatch({ type: "SET_EVENT_STATUS", payload: "waiting" });
  }

  function endCall(liked: boolean) {
    if (!state.currentPartner || !state.currentRoomName) return;

    const encounter: EncounterRecord = {
      id: `enc_${Date.now()}`,
      partnerId: state.currentPartner.id ?? "unknown",
      partnerName: state.currentPartner.name ?? "Desconhecido",
      partnerPhotoUri: state.currentPartner.photoUri ?? null,
      roomName: state.currentRoomName,
      duration: state.callDuration,
      liked,
      encounteredAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ENCOUNTER", payload: encounter });

    // Simulate mutual match: 60% chance if liked
    if (liked && Math.random() < 0.6) {
      const match: Match = {
        id: `match_${Date.now()}`,
        userId: state.currentPartner.id ?? "unknown",
        name: state.currentPartner.name ?? "Desconhecido",
        age: state.currentPartner.age ?? 0,
        photoUri: state.currentPartner.photoUri ?? null,
        matchedAt: new Date().toISOString(),
        roomName: state.currentRoomName,
      };
      dispatch({ type: "ADD_MATCH", payload: match });
    }

    dispatch({ type: "SET_EVENT_STATUS", payload: "results" });
    dispatch({ type: "SET_CURRENT_PARTNER", payload: null });
    dispatch({ type: "SET_CURRENT_ROOM", payload: null });
  }

  function sendMessage(matchId: string, text: string) {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: state.profile.id,
      text,
      sentAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: msg });
  }

  function getMatchMessages(matchId: string): ChatMessage[] {
    return state.messages.filter((m) => m.matchId === matchId);
  }

  return (
    <SpeedDatingContext.Provider value={{ state, dispatch, startEvent, endCall, sendMessage, getMatchMessages }}>
      {children}
    </SpeedDatingContext.Provider>
  );
}

export function useSpeedDating() {
  const ctx = useContext(SpeedDatingContext);
  if (!ctx) throw new Error("useSpeedDating must be used within SpeedDatingProvider");
  return ctx;
}
