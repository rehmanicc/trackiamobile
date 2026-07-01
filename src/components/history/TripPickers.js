import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TripPickers({
  showCustomDate,
  customTripDate,
  setShowCustomDate,
  setCustomTripDate,
  onSelectDate,
}) {
  return (
    <>
      {showCustomDate && (
        <DateTimePicker
          value={customTripDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            if (event?.type === "dismissed") {
              setShowCustomDate(false);
              return;
            }
            if (!selectedDate) return;
            setCustomTripDate(selectedDate);
            onSelectDate?.(selectedDate);
            setShowCustomDate(false);
          }}
        />
      )}
    </>
  );
}