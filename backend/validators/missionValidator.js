export function missionDraft(body = {}) {
  const clean = value => typeof value === 'string' ? value.trim() : '';
  const title = clean(body?.title);
  const brief = clean(body?.brief);
  const due_on = clean(body?.due_on);
  const tasks = Array.isArray(body?.tasks) ? body.tasks.map(clean) : [];
  const day = new Date(due_on + 'T00:00:00Z');
  if (!title || title.length > 100 || !brief || brief.length > 700)
    throw Object.assign(new Error('Enter a title (up to 100 characters) and brief (up to 700).'), {statusCode: 400});
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due_on) || !Number.isFinite(day.getTime()) || day.toISOString().slice(0,10) !== due_on)
    throw Object.assign(new Error('Enter a valid deadline as YYYY-MM-DD.'), {statusCode: 400});
  if (!tasks.length || tasks.length > 12 || tasks.some(value => !value || value.length > 160))
    throw Object.assign(new Error('Add 1–12 steps of up to 160 characters each.'), {statusCode: 400});
  return {title, brief, due_on, tasks};
}
