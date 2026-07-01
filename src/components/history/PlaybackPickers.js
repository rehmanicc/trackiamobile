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
<<<<<<< HEAD
            // User cancelled
=======
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
            if (event?.type === "dismissed") {
              setShowPlaybackDate(false);
              return;
            }
<<<<<<< HEAD
            // User confirmed selection
            if (event?.type === "set" && selectedDate) {
              setPlaybackDate(selectedDate);
              // Only trigger history load on confirm, not on every scroll
              onSelectDate?.(selectedDate);
              setShowPlaybackDate(false);
            }
=======
            if (!selectedDate) return;
            setPlaybackDate(selectedDate);
            onSelectDate?.(selectedDate);
            setShowPlaybackDate(false);
>>>>>>> 1fd94de4b6f1b2b73ad59d1fa8f561711b1895ec
          }}
        />
      )}
    </>
  );
}