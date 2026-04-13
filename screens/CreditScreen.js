import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import AppCard from "../components/AppCard";

export default function CreditScreen({ apps, setScreen }) {

  const [score, setScore] = useState("");
  const [result, setResult] = useState([]);

  function check() {
    const filtered = apps.filter(a =>
      a.min_score <= Number(score) && a.risk === "low"
    );
    setResult(filtered);
  }

  return (
    <View style={{ flex:1, backgroundColor:"#020617", padding:20 }}>

      <Text style={{ color:"#fff", fontSize:22 }}>
        Enter Credit Score
      </Text>

      <TextInput
        placeholder="e.g. 760"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={score}
        onChangeText={setScore}
        style={{
          backgroundColor:"#111",
          color:"#fff",
          padding:15,
          marginTop:20,
          borderRadius:10
        }}
      />

      <TouchableOpacity
        onPress={check}
        style={{
          backgroundColor:"#22c55e",
          padding:15,
          marginTop:10,
          borderRadius:10
        }}
      >
        <Text style={{ textAlign:"center" }}>
          See Safe Loan Options
        </Text>
      </TouchableOpacity>

      <ScrollView>
        {result.map((app,i) => (
          <AppCard key={i} app={app} />
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => setScreen("home")}>
        <Text style={{ color:"#22c55e", marginTop:20 }}>← Back</Text>
      </TouchableOpacity>

    </View>
  );
}
