import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'الصفحة غير موجودة',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#ffffff',
      }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          عذراً، هذه الصفحة غير موجودة
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </ThemedText>
        <Link href="/(home)" style={styles.link}>
          <ThemedText type="link" style={styles.linkText}>
            العودة إلى الصفحة الرئيسية
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#cccccc',
    lineHeight: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  linkText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
