import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F0F5F4' },
  content: { padding: 18, gap: 14, paddingBottom: 48 },
  hero: { backgroundColor: '#123949', padding: 24, borderRadius: 20, gap: 8 },
  heroTitle: { fontSize: 32, fontWeight: '700', color: 'white', letterSpacing: -1 },
  heroNote: { fontSize: 16, color: '#CCEBE7', lineHeight: 23 },
  card: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D2E0DF', padding: 18, borderRadius: 16, gap: 10 },
  title: { fontSize: 20, color: COLORS.forestDepths, fontWeight: '700' },
  body: { color: '#334C54', fontSize: 16, lineHeight: 23 },
  meta: { color: '#166557', fontSize: 14, fontWeight: '600' },
  input: { color: '#133239', borderRadius: 10, borderColor: '#90AAA8', borderWidth: 1, backgroundColor: 'white', padding: 12 },
  task: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 52, borderTopWidth: 1, borderColor: '#DFE8E5' },
  circle: { color: '#126252', fontSize: 22, width: 26 },
  grow: { flex: 1 }, error: { color: '#923125', fontSize: 15 },
});
