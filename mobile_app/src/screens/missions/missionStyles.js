import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.boneWhite },
  content: { padding: 18, gap: 14, paddingBottom: 48 },
  hero: { backgroundColor: COLORS.forestDepths, padding: 24, borderRadius: 20, gap: 8 },
  heroTitle: { fontSize: 32, fontWeight: '700', color: COLORS.pureWhite, letterSpacing: -1 },
  heroNote: { fontSize: 16, color: COLORS.paleFern, lineHeight: 23 },
  card: { backgroundColor: COLORS.pureWhite, borderWidth: 1, borderColor: COLORS.mistGreen, padding: 18, borderRadius: 16, gap: 10 },
  title: { fontSize: 20, color: COLORS.forestDepths, fontWeight: '700' },
  body: { color: COLORS.onyxOlive, fontSize: 16, lineHeight: 23 },
  meta: { color: COLORS.deepVerdant, fontSize: 14, fontWeight: '600' },
  field: { gap: 6 },
  fieldLabel: { color: COLORS.onyxOlive, fontSize: 14, fontWeight: '600' },
  multiline: { minHeight: 84, textAlignVertical: 'top' },
  reportRow: { borderTopWidth: 1, borderColor: COLORS.mistGreen, paddingVertical: 14, gap: 8 },
  input: { color: COLORS.carbon, borderRadius: 10, borderColor: COLORS.lichenSage, borderWidth: 1, backgroundColor: COLORS.pureWhite, padding: 12 },
  task: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 52, borderTopWidth: 1, borderColor: COLORS.mistGreen },
  circle: { color: COLORS.deepVerdant, fontSize: 22, width: 26 },
  grow: { flex: 1 }, error: { color: COLORS.danger, fontSize: 15 },
});
