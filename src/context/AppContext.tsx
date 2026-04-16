"use client";

import { createContext, useContext, useMemo, useReducer, ReactNode } from "react";
import { Feature, MethodId, MoscowCategory, MAX_FEATURES } from "../lib/types";

const ALL_METHODS: MethodId[] = ["moscow", "rice", "ice", "ve"];

interface State {
  features: Feature[];
  methods: MethodId[];
  activeMethod: MethodId;
}

type Action =
  | { type: "ADD_FEATURE" }
  | { type: "REMOVE_FEATURE"; id: string }
  | { type: "UPDATE_FEATURE_META"; id: string; patch: Partial<Pick<Feature, "title" | "description">> }
  | { type: "SET_MOSCOW"; id: string; category: MoscowCategory | null }
  | {
      type: "SET_RICE_FIELD";
      id: string;
      field: "reach" | "impact" | "confidence" | "effort";
      value: number | null;
    }
  | {
      type: "SET_ICE_FIELD";
      id: string;
      field: "impact" | "confidence" | "ease";
      value: number | null;
    }
  | {
      type: "SET_VE_FIELD";
      id: string;
      field: "value" | "effort";
      value: number | null;
    }
  | { type: "SET_ACTIVE_METHOD"; method: MethodId }
  | { type: "RESET" };

const makeFeature = (): Feature => ({
  id: `f-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`,
  title: "",
  description: "",
  moscow: null,
  rice: { reach: null, impact: null, confidence: null, effort: null },
  ice: { impact: null, confidence: null, ease: null },
  ve: { value: null, effort: null },
});

const seedFeatures = (): Feature[] => [
  {
    ...makeFeature(),
    title: "Onboarding checklist redesign",
    description: "Replace the linear 7-step flow with a branching, goal-aware checklist.",
    moscow: "must",
    rice: { reach: 1200, impact: 2, confidence: 80, effort: 4 },
    ice: { impact: 9, confidence: 8, ease: 6 },
    ve: { value: 9, effort: 6 },
  },
  {
    ...makeFeature(),
    title: "Billing history CSV export",
    description: "Let finance teams download their invoices as a single CSV.",
    moscow: "should",
    rice: { reach: 600, impact: 1, confidence: 90, effort: 1 },
    ice: { impact: 7, confidence: 9, ease: 9 },
    ve: { value: 7, effort: 2 },
  },
  {
    ...makeFeature(),
    title: "Slack activity notifications",
    description: "Push key events (new signups, churn) to a chosen Slack channel.",
    moscow: "could",
    rice: { reach: 400, impact: 1, confidence: 70, effort: 2 },
    ice: { impact: 6, confidence: 7, ease: 7 },
    ve: { value: 6, effort: 3 },
  },
];

const initial: State = {
  features: seedFeatures(),
  methods: ALL_METHODS,
  activeMethod: "moscow",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_FEATURE":
      if (state.features.length >= MAX_FEATURES) return state;
      return { ...state, features: [...state.features, makeFeature()] };
    case "REMOVE_FEATURE":
      return { ...state, features: state.features.filter((f) => f.id !== action.id) };
    case "UPDATE_FEATURE_META":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.id ? { ...f, ...action.patch } : f
        ),
      };
    case "SET_MOSCOW":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.id ? { ...f, moscow: action.category } : f
        ),
      };
    case "SET_RICE_FIELD":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.id ? { ...f, rice: { ...f.rice, [action.field]: action.value } } : f
        ),
      };
    case "SET_ICE_FIELD":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.id ? { ...f, ice: { ...f.ice, [action.field]: action.value } } : f
        ),
      };
    case "SET_VE_FIELD":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.id ? { ...f, ve: { ...f.ve, [action.field]: action.value } } : f
        ),
      };
    case "SET_ACTIVE_METHOD":
      return { ...state, activeMethod: action.method };
    case "RESET":
      return { features: [makeFeature()], methods: ALL_METHODS, activeMethod: "moscow" };
    default:
      return state;
  }
};

interface Ctx {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<Ctx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
