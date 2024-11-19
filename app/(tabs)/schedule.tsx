import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Match {
  team1: string;
  team2: string;
  duration: number;
  startTime: Date;
}

interface ScheduleStats {
  totalMatches: number;
  totalPlayTime: number;
  averageMatchDuration: number;
  totalRestTime: number;
  matchesPerTeam: number;
}

export default function ScheduleScreen() {
  const params = useLocalSearchParams();
  const { teams, duration, rest, startTime } = params;

  const generateMatches = (): [Match[], ScheduleStats] => {
    const numTeams = parseInt(teams as string);
    const sessionDuration = parseInt(duration as string);
    const restDuration = parseInt(rest as string);
    const startDateTime = new Date(startTime as string);

    const totalMatches = (numTeams * (numTeams - 1)) / 2;
    const availableMinutes = sessionDuration - (Math.floor(totalMatches / 2) * restDuration);
    const matchDuration = Math.floor(availableMinutes / totalMatches);

    let currentTime = new Date(startDateTime);
    const matches: Match[] = [];

    for (let i = 0; i < numTeams - 1; i++) {
      for (let j = i + 1; j < numTeams; j++) {
        matches.push({
          team1: `Team ${i + 1}`,
          team2: `Team ${j + 1}`,
          duration: matchDuration,
          startTime: new Date(currentTime),
        });

        currentTime = new Date(currentTime.getTime() + matchDuration * 60000);

        if (matches.length % 2 === 0 && matches.length < totalMatches) {
          currentTime = new Date(currentTime.getTime() + restDuration * 60000);
        }
      }
    }

    const stats: ScheduleStats = {
      totalMatches: matches.length,
      totalPlayTime: matches.length * matchDuration,
      averageMatchDuration: matchDuration,
      totalRestTime: Math.floor(matches.length / 2) * restDuration,
      matchesPerTeam: (matches.length * 2) / numTeams,
    };

    return [matches, stats];
  };

  const [matches, stats] = generateMatches();

  const handleSaveSchedule = () => {
    // TODO: Implement saving schedule to local storage
    router.back();
  };

  if (matches.length === 0) {
    return (
      <View style={styles.noMatchesContainer}>
        <Text style={styles.noMatchesText}>
          Not enough teams to generate a schedule.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Schedule Summary</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Matches</Text>
          <Text style={styles.statValue}>{stats.totalMatches}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Play Time</Text>
          <Text style={styles.statValue}>{stats.totalPlayTime} min</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Match Duration</Text>
          <Text style={styles.statValue}>{stats.averageMatchDuration} min</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Rest Time</Text>
          <Text style={styles.statValue}>{stats.totalRestTime} min</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Matches per Team</Text>
          <Text style={styles.statValue}>{stats.matchesPerTeam}</Text>
        </View>
      </View>

      {matches.map((match, index) => (
        <View key={index} style={styles.matchCard}>
          <Text style={styles.matchTime}>
            {match.startTime.toLocaleTimeString()}
          </Text>
          <Text style={styles.matchTeams}>
            {match.team1} vs {match.team2}
          </Text>
          <Text style={styles.matchDuration}>
            Duration: {match.duration} min
          </Text>
          {index % 2 === 1 && index < matches.length - 1 && (
            <View style={styles.restPeriod}>
              <Text style={styles.restPeriodText}>
                Rest Period: {params.rest} min
              </Text>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveSchedule}
      >
        <Text style={styles.saveButtonText}>Save Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    paddingTop: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    marginBottom: 16,
  },
  summaryText: {
    color: '#71717a',
    fontSize: 14,
    fontFamily: 'InterMedium',
    marginBottom: 8,
  },
  matchCard: {
    backgroundColor: '#27272a',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  matchTime: {
    color: '#6366f1',
    fontSize: 14,
    fontFamily: 'InterMedium',
    marginBottom: 8,
  },
  matchTeams: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'InterBold',
    marginBottom: 8,
  },
  matchDuration: {
    color: '#71717a',
    fontSize: 14,
    fontFamily: 'InterMedium',
    marginBottom: 4,
  },
  restPeriod: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  restPeriodText: {
    color: '#6366f1',
    fontSize: 14,
    fontFamily: 'InterMedium',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 8,
  },
  statsContainer: {
    backgroundColor: '#27272a',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterBold',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#71717a',
    fontSize: 14,
    fontFamily: 'InterMedium',
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterBold',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterBold',
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noMatchesText: {
    color: '#71717a',
    fontSize: 16,
    fontFamily: 'InterMedium',
    textAlign: 'center',
  }
});