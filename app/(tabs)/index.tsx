import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Link, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [numberOfTeams, setNumberOfTeams] = useState('');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [restDuration, setRestDuration] = useState('5');
  const [sessionStart, setSessionStart] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const generateSchedule = () => {
    const scheduleData = {
      teams: parseInt(numberOfTeams),
      duration: parseInt(sessionDuration),
      rest: parseInt(restDuration),
      startTime: sessionStart.toISOString(),
    };

    router.push({
      pathname: '/schedule',
      params: scheduleData,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/history')}
        >
          <Ionicons name="time-outline" size={24} color="#6366f1" />
          <Text style={styles.historyButtonText}>View History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of Teams</Text>
        <TextInput
          style={styles.input}
          value={numberOfTeams}
          onChangeText={setNumberOfTeams}
          keyboardType="numeric"
          placeholder="Enter number of teams"
          placeholderTextColor="#71717a"
        />

        <Text style={styles.label}>Session Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={sessionDuration}
          onChangeText={setSessionDuration}
          keyboardType="numeric"
          placeholder="Enter session duration"
          placeholderTextColor="#71717a"
        />

        <Text style={styles.label}>Rest Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={restDuration}
          onChangeText={setRestDuration}
          keyboardType="numeric"
          placeholder="Enter rest duration"
          placeholderTextColor="#71717a"
        />

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.timeButtonText}>
            {sessionStart.toLocaleTimeString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={sessionStart}
            mode="time"
            is24Hour={true}
            onChange={(event, selectedTime) => {
              setShowDatePicker(false);
              if (selectedTime) {
                setSessionStart(selectedTime);
              }
            }}
          />
        )}

        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateSchedule}
        >
          <Text style={styles.generateButtonText}>Generate Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  historyButtonText: {
    color: '#6366f1',
    marginLeft: 8,
    fontFamily: 'InterMedium',
  },
  inputContainer: {
    padding: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'InterMedium',
  },
  input: {
    backgroundColor: '#27272a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'InterMedium',
  },
  timeButton: {
    backgroundColor: '#27272a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterMedium',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterBold',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'InterMedium',
    marginTop: -8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 8,
  },
  cardText: {
    color: '#71717a',
    fontSize: 14,
    fontFamily: 'InterMedium',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#3f3f46',
    marginVertical: 16,
  },
  infoSection: {
    padding: 16,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'InterBold',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoHeading: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterBold',
    marginBottom: 4,
  },
  infoDescription: {
    color: '#71717a',
    fontSize: 14,
    fontFamily: 'InterMedium',
  }
});