import { View, Text, TouchableOpacity, Linking } from "react-native";
import { COLORS } from "../constants";

export default function AppCard({ app }) {
  return (
    <View style={{
      backgroundColor:"#111",
      padding:15,
      marginTop:10,
      borderRadius:10
    }}>
      <Text style={{ color:COLORS.text, fontSize:18 }}>
        {app.name}
      </Text>

      <Text style={{ color:COLORS.subtext }}>
        ⭐ {app.rating}
      </Text>

      <TouchableOpacity
        onPress={() => Linking.openURL(app.link)}
        style={{
          backgroundColor:COLORS.primary,
          padding:10,
          marginTop:10,
          borderRadius:8
        }}
      >
        <Text style={{ textAlign:"center" }}>
          Open App
        </Text>
      </TouchableOpacity>
    </View>
  );
}
