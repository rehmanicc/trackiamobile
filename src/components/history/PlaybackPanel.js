import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";

export default function PlaybackPanel({
  styles,
  history,
  playbackIndex,
  setPlaybackIndex,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
  currentPoint,
}) {
  return (
    <View style={styles.sliderWrapper}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{new Date(history[0]?.deviceTime).toLocaleTimeString()}</Text>
        <Text style={styles.timeText}>{new Date(currentPoint?.deviceTime).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.sliderRow}>
        <TouchableOpacity style={styles.inlineControlBtn} onPress={() => setIsPlaying(!isPlaying)}>
          <Text style={styles.controlText}>{isPlaying ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
        <Slider
          style={{ flex: 1 }}
          minimumValue={0}
          maximumValue={Math.max(history.length - 1, 0)}
          value={playbackIndex}
          onValueChange={(val) => {
            setIsPlaying(false);
            setPlaybackIndex(Math.floor(val));
          }}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#333"
          thumbTintColor="#fff"
        />
        <TouchableOpacity style={styles.inlineControlBtn} onPress={() => { setIsPlaying(false); setPlaybackIndex(0); }}>
          <Text style={styles.controlText}>⏹</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.speedRow}>
        {[1, 2, 5].map((s) => (
          <TouchableOpacity key={s} style={[styles.speedBtn, speed === s && styles.activeSpeed]} onPress={() => setSpeed(s)}>
            <Text style={{ color: "#fff" }}>{s}x</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}