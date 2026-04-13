import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator
} from "react-native";
import { createClient } from "@supabase/supabase-js";

/* 🔥 SUPABASE CONFIG */
const supabase = createClient(
  "https://ytvjjvqxsuljnkxveukh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0dmpqdnF4c3Vsam5reHZldWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTc4NTQsImV4cCI6MjA4NzU3Mzg1NH0.YhZ2VMmly6mD6kniedpUofF-vdxhj3paEllFMuDNjf4"
);

/* 🤖 AI REVIEW ANALYZER */
function analyzeReviews(reviews = []) {
  let score = 0;

  const dangerWords = [
    "harassment",
    "blackmail",
    "threat",
    "abuse",
    "contact",
    "call",
    "pressure",
    "7 days",
    "7 day",
    "seven days",
    "weekly loan",
    "short term loan"
  ];

  reviews.forEach(r => {
    const text = (r || "").toLowerCase();

    dangerWords.forEach(word => {
      if (text.includes(word)) score++;
    });
  });

  const has7Day = reviews.some(r =>
    (r || "").toLowerCase().includes("7 day") ||
    (r || "").toLowerCase().includes("7 days")
  );

  if (has7Day) score += 2;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [score, setScore] = useState("");
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    setLoading(true);
    const { data, error } = await supabase.from("apps").select("*");

    if (error) {
      console.log("ERROR:", error);
    } else {
      setApps(data || []);
    }
    setLoading(false);
  }

  const searchResult = apps.find(a =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const eligibleApps = apps.filter(a =>
    a.min_score <= Number(score) && a.risk === "low"
  );

  function getRiskColor(risk) {
    if (risk === "high") return "#ef4444";
    if (risk === "medium") return "#facc15";
    return "#22c55e";
  }

  /* 🔥 AI RISK */
  const aiRisk = analyzeReviews(searchResult?.reviews || []);

  return (
    <View style={{ flex: 1, backgroundColor: "#020617", padding: 20 }}>

      {/* 🏠 HOME */}
      {screen === "home" && (
        <>
          <Text style={{ color: "#22c55e", fontSize: 26, fontWeight: "bold" }}>
            Loan Guard AI
          </Text>

          {loading ? (
            <ActivityIndicator color="#22c55e" style={{ marginTop: 20 }} />
          ) : (
            <Text style={{ color: "#aaa", marginTop: 10 }}>
              {apps.length} apps loaded 🔥
            </Text>
          )}

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

      {/* 🔎 RESULT */}
      {screen === "result" && (
        <>
          {searchResult ? (
            <>
              <Text style={{ color: "#fff", fontSize: 22 }}>
                {searchResult.name}
              </Text>

              {/* 🔴 ORIGINAL RISK */}
              <Text style={{ color: "#aaa", marginTop: 5 }}>
                DB Risk: {searchResult.risk.toUpperCase()}
              </Text>

              {/* 🤖 AI RISK */}
              <Text
                style={{
                  color: getRiskColor(aiRisk),
                  marginTop: 10,
                  fontSize: 18
                }}
              >
                AI Risk: {aiRisk.toUpperCase()}
              </Text>

              <Text style={{ color: "#aaa", marginTop: 10 }}>
                ⭐ {searchResult.rating}
              </Text>

              {/* 🧠 SMART WARNINGS */}
              {aiRisk === "high" && (
                <Text style={{ color: "#ef4444", marginTop: 10 }}>
                  ⚠️ High risk detected (AI) – possible harassment / 7-day trap
                </Text>
              )}

              {aiRisk === "medium" && (
                <Text style={{ color: "#facc15", marginTop: 10 }}>
                  ⚠️ Some risky patterns found
                </Text>
              )}

              {aiRisk === "low" && (
                <Text style={{ color: "#22c55e", marginTop: 10 }}>
                  ✅ Looks safe based on reviews
                </Text>
              )}

              <TouchableOpacity
                onPress={() => Linking.openURL(searchResult.link)}
                style={{
                  backgroundColor: "#22c55e",
                  padding: 12,
                  marginTop: 15,
                  borderRadius: 8
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  Open App
                </Text>
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

      {/* 💳 CREDIT */}
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

          {eligibleApps.map((app, i) => (
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

              <Text style={{ color: "#22c55e", marginTop: 5 }}>
                ✅ Eligible for your score
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
          ))}

          <TouchableOpacity onPress={() => setScreen("home")}>
            <Text style={{ color: "#22c55e", marginTop: 20 }}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
