import { View, Text, TextInput } from "react-native";
import styles from "../../styles/FormStyles";

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  editable = true,
  keyboardType = "default",
  secureTextEntry = false,
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        editable={editable}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}