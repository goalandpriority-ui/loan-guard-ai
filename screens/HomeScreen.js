import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

export default function HomeScreen({ setScreen, setQuery }) {

  return (
    <View style={{ flex:1, backgroundColor:COLORS.bg, padding:20 }}>

      <Text style={{ color:COLORS.primary, fontSize:26 }}>
        Loan Guard AI
      </Text>

      <TextInput
        placeholder="Search Loan App..."
        placeholderTextColor="#888"
        onChangeText={setQuery}
        style={{
          backgroundColor:"#111",
          color:"#fff",
          padding:15,
          marginTop:20,
          borderRadius:10
        }}
      />

      <TouchableOpacity
        onPress={() => setScreen("result")}
        style={{
          backgroundColor:COLORS.primary,
          padding:15,
          marginTop:10,
          borderRadius:10
        }}
      >
        <Text style={{ textAlign:"center" }}>Check App</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setScreen("credit")}
        style={{
          backgroundColor:"#2563eb",
          padding:15,
          marginTop:10,
          borderRadius:10
        }}
      >
        <Text style={{ textAlign:"center", color:"#fff" }}>
          Check Credit Score
        </Text>
      </TouchableOpacity>

    </View>
  );
}
