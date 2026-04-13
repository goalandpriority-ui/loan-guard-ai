import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking
} from "react-native";
import { createClient } from "@supabase/supabase-js";

/* 🔥 SUPABASE CONFIG */
const supabase = createClient(
  "https://ytvjjvqxsuljnkxveukh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dmpqdnF4c3Vsam5reHZldWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTc4NTQsImV4cCI6MjA4NzU3Mzg1NH0.YhZ2VMmly6mD6kniedpUofF-vdxhj3paEllFMuDNjf4"
);

export default function App() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [score, setScore] = useState("");
  const [apps, setApps] = useState([]);

  /* 🔥 FETCH DATA FROM SUPABASE */
  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    const { data, error } = await supabase.from("apps").select("*");

    if (error) {
      console.log("ERROR:", error);
    } else {
      setApps(data || []);
    }
  }

  /* 🔎 SEARCH RESULT */
  const searchResult = apps.find(a =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  /* 💳 CREDIT FILTER */
  const eligibleApps = apps.filter(a =>
    a.min_score <= Number(score) && a.risk === "low"
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#020617", padding: 20 }}>

      {/* 🏠 HOME */}
      {screen === "home" && (
        <>
          <Text style={{ color: "#22c55e", fontSize: 26, fontWeight: "bold" }}>
            Loan Guard AI
          </Text>

          <TextInput
            placeholder="Search Loan App..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            style={{
              backgroundColor: "#111",
              color: "#fff",
              padding: 15,
              marginTop: 20,
              borderRadius: 10
            }}
          />

          <TouchableOpacity
            onPress={() => setScreen("result")}
            style={{
              backgroundColor: "#22c55e",
              padding: 15,
              marginTop: 10,
              borderRadius: 10
            }}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Check App
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setScreen("credit")}
            style={{
              backgroundColor: "#2563eb",
              padding: 15,
              marginTop: 10,
              borderRadius: 10
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Check Credit Score
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* 🔎 RESULT SCREEN */}
      {screen === "result" && (
        <>
          {searchResult ? (
            <>
              <Text style={{ color: "#fff", fontSize: 22 }}>
                {searchResult.name}
              </Text>

              <Text
                style={{
                  color:
                    searchResult.risk === "high"
                      ? "#ef4444"
                      : searchResult.risk === "medium"
                      ? "#facc15"
                      : "#22c55e",
                  marginTop: 10,
                  fontSize: 18
                }}
              >
                {searchResult.risk.toUpperCase()}
              </Text>

              <Text style={{ color: "#aaa", marginTop: 10 }}>
                ⭐ {searchResult.rating}
              </Text>

              <TouchableOpacity
                onPress={() => Linking.openURL(searchResult.link)}
                style={{
                  backgroundColor: "#22c55e",
                  padding: 10,
                  marginTop: 10,
                  borderRadius: 8
                }}
              >
                <Text style={{ textAlign: "center" }}>Open App</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={{ color: "#fff", marginTop: 20 }}>
              No app found 😅
            </Text>
          )}

          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={{ color: "#22c55e", marginTop: 20 }}>← Back</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 💳 CREDIT INPUT */}
      {screen === "credit" && (
        <>
          <Text style={{ color: "#fff", fontSize: 22 }}>
            Enter Credit Score
          </Text>

          <TextInput
            placeholder="e.g. 760"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={score}
            onChangeText={setScore}
            style={{
              backgroundColor: "#111",
              color: "#fff",
              padding: 15,
              marginTop: 20,
              borderRadius: 10
            }}
          />

          <TouchableOpacity
            onPress={() => setScreen("creditResult")}
            style={{
              backgroundColor: "#22c55e",
              padding: 15,
              marginTop: 10,
              borderRadius: 10
            }}
          >
            <Text style={{ textAlign: "center" }}>
              See Safe Loan Options
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* 💳 CREDIT RESULT */}
      {screen === "creditResult" && (
        <ScrollView>
          <Text style={{ color: "#fff", fontSize: 22 }}>
            Your Score: {score}
          </Text>

          {eligibleApps.length > 0 ? (
            eligibleApps.map((app, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: "#111",
                  padding: 15,
                  marginTop: 10,
                  borderRadius: 10
                }}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>
                  {app.name}
                </Text>

                <Text style={{ color: "#aaa" }}>
                  ⭐ {app.rating}
                </Text>

                <TouchableOpacity
                  onPress={() => Linking.openURL(app.link)}
                  style={{
                    backgroundColor: "#22c55e",
                    padding: 10,
                    marginTop: 10,
                    borderRadius: 8
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Apply Loan
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{ color: "#fff", marginTop: 20 }}>
              No eligible safe apps found 😅
            </Text>
          )}

          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={{ color: "#22c55e", marginTop: 20 }}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
