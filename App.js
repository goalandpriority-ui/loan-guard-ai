import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert
} from "react-native";
import { createClient } from "@supabase/supabase-js";

/* 🔥 SUPABASE CONFIG */
const supabase = createClient(
  "https://ytvjjvqxsuljnkxveukh.supabase.co",
  "YOUR_ANON_KEY"
);

/* 🤖 AI REVIEW ANALYZER */
function analyzeReviews(reviews = []) {
  let score = 0;

  const dangerWords = [
    "harassment","blackmail","threat","abuse",
    "contact","call","pressure",
    "7 days","7 day","seven days",
    "weekly loan","short term loan"
  ];

  reviews.forEach(r => {
    const text = (r || "").toLowerCase();
    dangerWords.forEach(word => {
      if (text.includes(word)) score++;
    });
  });

  if (reviews.some(r => (r || "").includes("7 day"))) score += 2;

  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

/* 🧠 REASON FUNCTION */
function getScamReason(reviews = []) {
  const text = reviews.join(" ").toLowerCase();

  if (text.includes("7 day")) return "7-day loan trap detected";
  if (text.includes("harassment")) return "Harassment complaints";
  if (text.includes("blackmail")) return "Blackmail risk";

  return "Multiple complaints detected";
}

export default function App() {

  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [score, setScore] = useState("");
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [liveResults, setLiveResults] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveRisks, setLiveRisks] = useState({});
  const [liveReviews, setLiveReviews] = useState({});

  /* 🚨 REPORT STATE */
  const [selectedApp, setSelectedApp] = useState(null);
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    setLoading(true);
    const { data } = await supabase.from("apps").select("*");
    setApps(data || []);
    setLoading(false);
  }

  async function fetchLiveApps() {
    if (!query) return;

    setLiveLoading(true);

    const res = await fetch(
      "https://loan-guard-backend.onrender.com/search?q=" + query
    );
    const data = await res.json();

    setLiveResults(data || []);
    runAIForApps(data || []);

    setLiveLoading(false);
  }

  async function fetchReviews(appId) {
    const res = await fetch(
      "https://loan-guard-backend.onrender.com/reviews?appId=" + appId
    );
    return await res.json();
  }

  async function runAIForApps(appList) {
    const riskMap = {};
    const reviewMap = {};

    for (let app of appList) {
      const reviews = await fetchReviews(app.appId);
      reviewMap[app.appId] = reviews;
      riskMap[app.appId] = analyzeReviews(reviews);
    }

    setLiveRisks(riskMap);
    setLiveReviews(reviewMap);
  }

  function getRiskColor(risk) {
    if (risk === "high") return "#ef4444";
    if (risk === "medium") return "#facc15";
    return "#22c55e";
  }

  /* 🚨 SUBMIT REPORT */
  async function submitReport() {
    if (!reportText) return;

    await supabase.from("reports").insert([
      {
        app_name: selectedApp.title,
        report: reportText
      }
    ]);

    Alert.alert("Report submitted 🚀");
    setReportText("");
    setScreen("result");
  }

  const searchResult = apps.find(a =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const eligibleApps = apps.filter(a =>
    a.min_score <= Number(score) && a.risk === "low"
  );

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
            onPress={async () => {
              await fetchLiveApps();
              setScreen("result");
            }}
            style={{
              backgroundColor: "#22c55e",
              padding: 15,
              marginTop: 10,
              borderRadius: 10
            }}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Check App (Live + AI)
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
        <ScrollView>

          {searchResult && (
            <>
              <Text style={{ color: "#fff", fontSize: 22 }}>
                {searchResult.name}
              </Text>
            </>
          )}

          <Text style={{ color: "#22c55e", marginTop: 20 }}>
            🔴 Live Play Store Results
          </Text>

          {liveResults.map((app, i) => {
            const risk = liveRisks[app.appId] || "loading";
            const reviews = liveReviews[app.appId] || [];

            return (
              <View key={i} style={{
                backgroundColor:"#111",
                padding:15,
                marginTop:10,
                borderRadius:10
              }}>

                <Text style={{ color:"#fff" }}>{app.title}</Text>
                <Text style={{ color:"#aaa" }}>⭐ {app.score}</Text>

                <Text style={{ color:getRiskColor(risk) }}>
                  {risk==="loading"?"Analyzing...":risk.toUpperCase()}
                </Text>

                {/* 🚨 SCAM ALERT */}
                {risk==="high" && (
                  <View style={{ marginTop:10 }}>
                    <Text style={{ color:"#ef4444",fontWeight:"bold" }}>
                      🚨 SCAM ALERT
                    </Text>
                    <Text style={{ color:"#fca5a5" }}>
                      {getScamReason(reviews)}
                    </Text>
                  </View>
                )}

                {/* REPORT BUTTON */}
                <TouchableOpacity
                  onPress={()=>{
                    setSelectedApp(app);
                    setScreen("report");
                  }}
                  style={{
                    backgroundColor:"#ef4444",
                    padding:10,
                    marginTop:10,
                    borderRadius:8
                  }}
                >
                  <Text style={{ color:"#fff" }}>Report App</Text>
                </TouchableOpacity>

              </View>
            );
          })}

          <TouchableOpacity onPress={()=>setScreen("home")}>
            <Text style={{ color:"#22c55e",marginTop:20 }}>← Back</Text>
          </TouchableOpacity>

        </ScrollView>
      )}

      {/* 🚨 REPORT SCREEN */}
      {screen==="report" && (
        <>
          <Text style={{ color:"#fff",fontSize:22 }}>
            Report {selectedApp?.title}
          </Text>

          <TextInput
            placeholder="Explain issue..."
            value={reportText}
            onChangeText={setReportText}
            style={{
              backgroundColor:"#111",
              color:"#fff",
              padding:15,
              marginTop:20,
              borderRadius:10
            }}
          />

          <TouchableOpacity
            onPress={submitReport}
            style={{
              backgroundColor:"#ef4444",
              padding:15,
              marginTop:10,
              borderRadius:10
            }}
          >
            <Text style={{ color:"#fff",textAlign:"center" }}>
              Submit Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>setScreen("result")}>
            <Text style={{ color:"#22c55e",marginTop:20 }}>← Back</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
                    }
