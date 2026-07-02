import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PlaybackPickers({
  showPlaybackDate,
  playbackDate,
  setShowPlaybackDate,
  setPlaybackDate,
  onSelectDate,
}) {
  return (
    <>
      {showPlaybackDate && (
        <DateTimePicker
          value={playbackDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            // User cancelled
            if (event?.type === "dismissed") {
              setShowPlaybackDate(false);
              return;
            }
            // User confirmed selection – only trigger on 'set'
            if (event?.type === "set" && selectedDate) {
              setPlaybackDate(selectedDate);
              onSelectDate?.(selectedDate);
              setShowPlaybackDate(false);
            }
          }}
        />
      )}
    </>
  );
}