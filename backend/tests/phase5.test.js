// Phase 5 automated verification suite for demo readiness, RBAC, multi-institution privacy,
// standard response envelopes, and the 5 seeded virtual drill scenarios (15-17 questions each).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable, PassThrough } from 'stream';
import { describe, it, before, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

import { supabase } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { requireAdmin, requireRole } from '../middleware/role.js';
import { notFoundHandler, errorHandler } from '../middleware/errorMiddleware.js';
import moduleRoute from '../routes/moduleRoute.js';
import lessonRoute from '../routes/lessonRoute.js';
import quizRoute from '../routes/quizRoute.js';
import drillRoute from '../routes/drillRoute.js';
import leaderboardRoute from '../routes/leaderboardRoute.js';
import contactRoute from '../routes/contactRoute.js';
import alertRoute from '../routes/alertRoute.js';
import dashboardRoute from '../routes/dashboardRoute.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

/**
 * Dispatches an HTTP-like request directly through the Express app in memory (no TCP sockets).
 */
const invokeApp = (app, { method = 'GET', url = '/', headers = {}, body = null }) => {
  return new Promise((resolve, reject) => {
    const rawBody = body ? JSON.stringify(body) : '';
    const req = new Readable({
      read() {
        if (rawBody) this.push(rawBody);
        this.push(null);
      },
    });

    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.headers = {
      ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])),
      ...(rawBody
        ? {
            'content-type': 'application/json',
            'content-length': String(Buffer.byteLength(rawBody)),
          }
        : {}),
    };
    const mockSocket = new PassThrough();
    req.connection = mockSocket;
    req.socket = mockSocket;

    const resHeaders = {};
    const chunks = [];
    const res = {
      statusCode: 200,
      headersSent: false,
      locals: {},
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      getHeader(name) {
        return resHeaders[name.toLowerCase()];
      },
      removeHeader(name) {
        delete resHeaders[name.toLowerCase()];
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.headersSent = true;
        resolve({ status: this.statusCode, headers: resHeaders, body: payload });
        return this;
      },
      send(payload) {
        this.headersSent = true;
        let parsed = payload;
        if (typeof payload === 'string') {
          try {
            parsed = JSON.parse(payload);
          } catch {
            parsed = payload;
          }
        }
        resolve({ status: this.statusCode, headers: resHeaders, body: parsed });
        return this;
      },
      write(chunk) {
        chunks.push(Buffer.from(chunk));
      },
      end(chunk) {
        if (chunk) chunks.push(Buffer.from(chunk));
        if (!this.headersSent) {
          this.headersSent = true;
          const text = Buffer.concat(chunks).toString('utf8');
          let parsed = text;
          try {
            parsed = JSON.parse(text);
          } catch {
            // keep text
          }
          resolve({ status: this.statusCode, headers: resHeaders, body: parsed });
        }
      },
    };

    app(req, res, (err) => {
      if (err) reject(err);
    });
  });
};

/**
 * Helper to create a fluent mock Supabase query builder resolving with { data, error, count }.
 */
const createQueryMock = (result) => {
  const builder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    eq: () => builder,
    in: () => builder,
    is: () => builder,
    or: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => result,
    then: (resolve) => resolve(result),
  };
  return builder;
};

/**
 * Extracts and parses the 5 added drill scenarios from the Phase 5 migration SQL.
 */
const loadAddedDrillScenariosFromSql = () => {
  const migrationPath = path.join(
    rootDir,
    'supabase/migrations/20261111000000_add_drill_scenarios.sql'
  );
  const sql = fs.readFileSync(migrationPath, 'utf8');
  const scenarioPattern =
    /'(66666666-6666-6666-6666-66666666660\d)',\s*'([^']+)',\s*'(\[[\s\S]*?\])'::jsonb/g;

  const scenarios = [];
  for (const match of sql.matchAll(scenarioPattern)) {
    scenarios.push({
      id: match[1],
      title: match[2],
      steps: JSON.parse(match[3]),
    });
  }
  return scenarios;
};

describe('Phase 5: Demo Readiness & Presentation Checks', () => {
  let app;
  let activeProfile;
  let queryTracker;

  const setupAuthMock = () => {
    activeProfile = {
      id: '10000000-0000-0000-0000-000000000001',
      email: 'student@inst-a.edu',
      role: 'student',
      institution_id: '11111111-1111-1111-1111-111111111111',
      full_name: 'Demo Student',
      points: 100,
    };
    queryTracker = [];

    mock.method(supabase.auth, 'getUser', async (token) => {
      if (token === 'invalid-token') {
        return { data: { user: null }, error: { message: 'Invalid token' } };
      }
      return {
        data: {
          user: {
            id: activeProfile.id,
            email: activeProfile.email,
          },
        },
        error: null,
      };
    });
  };

  before(() => {
    app = express();
    app.use(express.json());
    app.get('/api/v1/health', (_req, res) =>
      sendSuccess(res, { status: 'online' })
    );
    app.use('/api/v1/modules', moduleRoute);
    app.use('/api/v1/lessons', lessonRoute);
    app.use('/api/v1/quizzes', quizRoute);
    app.use('/api/v1/drills', drillRoute);
    app.use('/api/v1/leaderboard', leaderboardRoute);
    app.use('/api/v1/contacts', contactRoute);
    app.use('/api/v1/alerts', alertRoute);
    app.use('/api/v1/dashboard', dashboardRoute);
    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe('1. Seed Data & 5 Virtual Drill Scenarios (15-17 Questions Each)', () => {
    it('contains all 5 new drill scenarios with 15-17 well-formed questions each', () => {
      const scenarios = loadAddedDrillScenariosFromSql();
      assert.equal(scenarios.length, 5, 'Expected exactly 5 new drill scenarios');

      for (const scenario of scenarios) {
        assert.ok(scenario.title.length > 10, `Scenario ${scenario.id} should have a descriptive title`);
        assert.ok(
          scenario.steps.length >= 15 && scenario.steps.length <= 17,
          `Scenario "${scenario.title}" has ${scenario.steps.length} questions, expected 15-17`
        );

        scenario.steps.forEach((stepItem, index) => {
          assert.equal(stepItem.step, index + 1, `Step numbering mismatch in "${scenario.title}"`);
          assert.equal(typeof stepItem.scenario, 'string');
          assert.ok(stepItem.scenario.length > 20, `Step ${stepItem.step} prompt too short`);
          assert.ok(Array.isArray(stepItem.options) && stepItem.options.length >= 3);

          const maxPoints = Math.max(...stepItem.options.map((o) => o.points));
          assert.ok(maxPoints > 0, `Step ${stepItem.step} must have a positive scoring option`);

          stepItem.options.forEach((opt) => {
            assert.equal(typeof opt.action, 'string');
            assert.ok(opt.action.length > 5);
            assert.equal(typeof opt.points, 'number');
            assert.ok(opt.points >= 0);
            assert.equal(typeof opt.feedback, 'string');
            assert.ok(opt.feedback.length > 10);
          });
        });
      }
    });

    it('seeds modules, lessons, quizzes, national contacts, and 5 drill scenarios in seed.sql & schema.sql', () => {
      const seedSql = fs.readFileSync(path.join(rootDir, 'supabase/seed.sql'), 'utf8');
      const schemaSql = fs.readFileSync(path.join(rootDir, 'supabase/schema.sql'), 'utf8');

      for (const sqlText of [seedSql, schemaSql]) {
        assert.match(sqlText, /'earthquake'/);
        assert.match(sqlText, /'flood'/);
        assert.match(sqlText, /'fire'/);
        assert.match(sqlText, /'112'/);
        assert.match(sqlText, /'101'/);
        assert.match(sqlText, /'102'/);
        assert.match(sqlText, /'1078'/);
        for (let i = 1; i <= 5; i++) {
          assert.match(sqlText, new RegExp(`66666666-6666-6666-6666-66666666660${i}`));
        }
      }
    });

    it('sanitizes points/feedback on GET /api/v1/drills and grades 16-question drill submission accurately', async () => {
      setupAuthMock();
      const [drill1] = loadAddedDrillScenariosFromSql();

      mock.method(supabase, 'from', (table) => {
        if (table === 'profiles') return createQueryMock({ data: activeProfile, error: null });
        if (table === 'drill_scenarios') return createQueryMock({ data: [drill1], error: null });
        if (table === 'drill_attempts') return createQueryMock({ data: [], error: null });
        return createQueryMock({ data: null, error: null });
      });

      const listRes = await invokeApp(app, {
        method: 'GET',
        url: '/api/v1/drills',
        headers: { Authorization: 'Bearer student-token' },
      });

      assert.equal(listRes.status, 200);
      assert.equal(listRes.body.success, true);
      assert.equal(listRes.body.error, null);
      assert.equal(listRes.body.data[0].total_steps, 16);
      assert.equal(listRes.body.data[0].steps[0].options[0].points, undefined);
      assert.equal(listRes.body.data[0].steps[0].options[0].feedback, undefined);

      mock.restoreAll();
      setupAuthMock();
      mock.method(supabase, 'from', (table) => {
        if (table === 'profiles') return createQueryMock({ data: activeProfile, error: null });
        if (table === 'drill_scenarios') return createQueryMock({ data: drill1, error: null });
        if (table === 'drill_attempts') return createQueryMock({ data: [], error: null });
        return createQueryMock({ data: null, error: null });
      });

      const choices = drill1.steps.map((s) => ({
        step: s.step,
        action: s.options[0].action,
      }));

      const submitRes = await invokeApp(app, {
        method: 'POST',
        url: `/api/v1/drills/${drill1.id}/submit`,
        headers: { Authorization: 'Bearer student-token' },
        body: { choices },
      });

      assert.equal(submitRes.status, 200, JSON.stringify(submitRes.body));
      assert.equal(submitRes.body.success, true);
      assert.equal(submitRes.body.data.score, 100);
      assert.equal(submitRes.body.data.review.length, 16);
      assert.equal(submitRes.body.data.points_awarded, submitRes.body.data.max_possible_points);
    });
  });

  describe('2. Student vs Admin Access Control (RBAC)', () => {
    it('forbids students from creating alerts (403)', async () => {
      setupAuthMock();
      mock.method(supabase, 'from', () => createQueryMock({ data: activeProfile, error: null }));

      const res = await invokeApp(app, {
        method: 'POST',
        url: '/api/v1/alerts',
        headers: { Authorization: 'Bearer student-token' },
        body: {
          title: 'Unauthorized Alert',
          message: 'Student should not post alerts',
          severity: 'critical',
        },
      });

      assert.equal(res.status, 403);
      assert.deepEqual(res.body, {
        success: false,
        data: null,
        error: 'Access forbidden: administrator privileges required',
      });
    });

    it('forbids students from accessing admin dashboard (403)', async () => {
      setupAuthMock();
      mock.method(supabase, 'from', () => createQueryMock({ data: activeProfile, error: null }));

      const res = await invokeApp(app, {
        method: 'GET',
        url: '/api/v1/dashboard',
        headers: { Authorization: 'Bearer student-token' },
      });

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.data, null);
    });

    it('forbids students from adding local emergency contacts (403)', async () => {
      setupAuthMock();
      mock.method(supabase, 'from', () => createQueryMock({ data: activeProfile, error: null }));

      const res = await invokeApp(app, {
        method: 'POST',
        url: '/api/v1/contacts',
        headers: { Authorization: 'Bearer student-token' },
        body: { name: 'Test', phone: '9876543210' },
      });

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    it('allows admin to create alerts', async () => {
      setupAuthMock();
      activeProfile = {
        ...activeProfile,
        role: 'admin',
        email: 'admin@inst-a.edu',
      };

      mock.method(supabase, 'from', (table) => {
        if (table === 'profiles') return createQueryMock({ data: activeProfile, error: null });
        if (table === 'alerts') {
          return createQueryMock({
            data: {
              id: 'aaaaaaaa-0000-0000-0000-000000000001',
              institution_id: activeProfile.institution_id,
              title: 'Drill Tomorrow',
              message: 'Be ready at 10 AM',
              severity: 'warning',
              created_at: new Date().toISOString(),
            },
            error: null,
          });
        }
        return createQueryMock({ data: [], error: null });
      });

      const res = await invokeApp(app, {
        method: 'POST',
        url: '/api/v1/alerts',
        headers: { Authorization: 'Bearer admin-token' },
        body: {
          title: 'Drill Tomorrow',
          message: 'Be ready at 10 AM',
          severity: 'warning',
        },
      });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.error, null);
      assert.equal(res.body.data.institution_id, activeProfile.institution_id);
    });

    it('verifies requireRole middleware rejects non-permitted roles', () => {
      let statusCode = 200;
      let jsonBody = null;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(payload) {
          jsonBody = payload;
          return this;
        },
      };
      let nextCalled = false;
      requireAdmin({ user: { role: 'student' } }, res, () => {
        nextCalled = true;
      });
      assert.equal(nextCalled, false);
      assert.equal(statusCode, 403);
      assert.equal(jsonBody.success, false);

      const roleGuard = requireRole(['admin']);
      roleGuard({ user: { role: 'admin' } }, res, () => {
        nextCalled = true;
      });
      assert.equal(nextCalled, true);
    });
  });

  describe('3. Multi-Institution Privacy Isolation', () => {
    it('filters alerts, leaderboard, and contacts strictly by the authenticated user institution_id', async () => {
      setupAuthMock();
      const instB = '99999999-9999-9999-9999-999999999999';
      activeProfile = {
        ...activeProfile,
        institution_id: instB,
      };

      mock.method(supabase, 'from', (table) => {
        const filters = [];
        const builder = {
          select: () => builder,
          eq: (col, val) => {
            filters.push({ op: 'eq', col, val });
            return builder;
          },
          or: (expr) => {
            filters.push({ op: 'or', expr });
            return builder;
          },
          is: (col, val) => {
            filters.push({ op: 'is', col, val });
            return builder;
          },
          order: () => builder,
          single: async () => ({ data: activeProfile, error: null }),
          then: (resolve) => {
            queryTracker.push({ table, filters });
            return resolve({ data: [], error: null });
          },
        };
        return builder;
      });

      await invokeApp(app, {
        method: 'GET',
        url: '/api/v1/alerts',
        headers: { Authorization: 'Bearer inst-b-token' },
      });
      await invokeApp(app, {
        method: 'GET',
        url: '/api/v1/leaderboard',
        headers: { Authorization: 'Bearer inst-b-token' },
      });
      await invokeApp(app, {
        method: 'GET',
        url: '/api/v1/contacts',
        headers: { Authorization: 'Bearer inst-b-token' },
      });

      const alertQuery = queryTracker.find((q) => q.table === 'alerts');
      assert.ok(
        alertQuery.filters.some((f) => f.col === 'institution_id' && f.val === instB),
        'Alerts query must filter by institution_id'
      );

      const leaderboardQuery = queryTracker.find((q) => q.table === 'profiles');
      assert.ok(
        leaderboardQuery.filters.some((f) => f.col === 'institution_id' && f.val === instB),
        'Leaderboard query must filter by institution_id'
      );
      assert.ok(
        leaderboardQuery.filters.some((f) => f.col === 'role' && f.val === 'student'),
        'Leaderboard query must filter role = student'
      );

      const contactsQuery = queryTracker.find((q) => q.table === 'emergency_contacts');
      assert.ok(
        contactsQuery.filters.some(
          (f) => f.op === 'or' && f.expr === `institution_id.is.null,institution_id.eq.${instB}`
        ),
        'Contacts query must return only national (null) or matching institution_id contacts'
      );
    });
  });

  describe('4. Standard { success, data, error } Response Format', () => {
    it('enforces { success, data, error } across health, 401 auth errors, and 404 unknown routes', async () => {
      const healthRes = await invokeApp(app, { method: 'GET', url: '/api/v1/health' });
      assert.equal(healthRes.status, 200);
      assert.deepEqual(Object.keys(healthRes.body).sort(), ['data', 'error', 'success']);
      assert.equal(healthRes.body.success, true);
      assert.equal(healthRes.body.error, null);

      const unauthRes = await invokeApp(app, { method: 'GET', url: '/api/v1/modules' });
      assert.equal(unauthRes.status, 401);
      assert.deepEqual(Object.keys(unauthRes.body).sort(), ['data', 'error', 'success']);
      assert.equal(unauthRes.body.success, false);
      assert.equal(unauthRes.body.data, null);

      const notFoundRes = await invokeApp(app, { method: 'GET', url: '/api/v1/nonexistent' });
      assert.equal(notFoundRes.status, 404);
      assert.deepEqual(Object.keys(notFoundRes.body).sort(), ['data', 'error', 'success']);
      assert.equal(notFoundRes.body.success, false);
      assert.equal(notFoundRes.body.data, null);
    });

    it('verifies sendSuccess and sendError helpers directly', () => {
      const capture = {};
      const mockRes = {
        status(code) {
          capture.status = code;
          return this;
        },
        json(payload) {
          capture.payload = payload;
          return this;
        },
      };

      sendSuccess(mockRes, { ok: 1 }, 201);
      assert.equal(capture.status, 201);
      assert.deepEqual(capture.payload, { success: true, data: { ok: 1 }, error: null });

      sendError(mockRes, 'Validation failed', 400);
      assert.equal(capture.status, 400);
      assert.deepEqual(capture.payload, { success: false, data: null, error: 'Validation failed' });
    });
  });
});
