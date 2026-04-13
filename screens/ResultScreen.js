import { View, Text, TouchableOpacity } from "react-native";
import { getRiskColor } from "../utils";
import AppCard from "../components/AppCard";

export default function ResultScreen({ app, setScreen }) {

  if(!app){
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>No app found 😅</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, backgroundColor:"#020617", padding:20 }}>

      <Text style={{ color:"#fff", fontSize:22 }}>
        {app.name}
      </Text>

      <Text style={{
        color:getRiskColor(app.risk),
        marginTop:10
      }}>
        {app.risk.toUpperCase()}
      </Text>

      <AppCard app={app} />

      <TouchableOpacity onPress={() => setScreen("home")}>
        <Text style={{ color:"#22c55e", marginTop:20 }}>← Back</Text>
      </TouchableOpacity>

    </View>
  );
}
