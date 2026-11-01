"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, UserRole } from "@/types";
import { DEMO_PROFILES } from "@/lib/mock-data";

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isDemoMode: boolean;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  savedResourceIds: string[];
  toggleSaveResource: (resourceId: string) => void;
  resetDemoData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("student");
  const [user, setUser] = useState<Profile | null>(DEMO_PROFILES.student);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([
    "33333333-3333-3333-3333-333333333301",
    "33333333-3333-3333-3333-333333333302",
  ]);

  useEffect(() => {
    // Load persisted demo role if present
    const savedRole = localStorage.getItem("rh_user_role") as UserRole | null;
    if (savedRole && DEMO_PROFILES[savedRole]) {
      setRole(savedRole);
      setUser(DEMO_PROFILES[savedRole]);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    const profile = DEMO_PROFILES[newRole];
    if (profile) {
      setRole(newRole);
      setUser(profile);
      localStorage.setItem("rh_user_role", newRole);
    }
  };

  const login = async (email: string, requestedRole: UserRole = "student"): Promise<boolean> => {
    // In demo or Supabase mode, find matching profile or assign requested role
    const matched = Object.values(DEMO_PROFILES).find(p => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      setRole(matched.role);
      localStorage.setItem("rh_user_role", matched.role);
    } else {
      const customProfile: Profile = {
        id: `usr-${Date.now()}`,
        full_name: email.split("@")[0].replace(".", " ").toUpperCase(),
        email,
        role: requestedRole,
        institution_name: "Indian Institute of Technology & Science (IITS)",
        department: requestedRole === "student" ? "Engineering Capstone" : "Faculty Research",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      };
      setUser(customProfile);
      setRole(requestedRole);
      localStorage.setItem("rh_user_role", requestedRole);
    }
    return true;
  };

  const logout = () => {
    // Revert to student persona
    switchRole("student");
  };

  const toggleSaveResource = (resourceId: string) => {
    setSavedResourceIds(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const resetDemoData = async () => {
    try {
      await fetch("/api/demo/reset", { method: "POST" });
      switchRole("student");
      window.location.reload();
    } catch (e) {
      console.error("Failed to reset demo data", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isDemoMode,
        switchRole,
        login,
        logout,
        savedResourceIds,
        toggleSaveResource,
        resetDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

