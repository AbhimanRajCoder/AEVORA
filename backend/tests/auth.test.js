// Automated tests for backend-proxied auth and institution endpoints.

import { Readable, PassThrough } from 'stream';
import { describe, it, before, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

import { supabase, supabaseAuth } from '../config/supabase.js';
import { notFoundHandler, errorHandler } from '../middleware/errorMiddleware.js';
import authRoute from '../routes/authRoute.js';
import institutionRoute from '../routes/institutionRoute.js';

/**
 * Dispatches a request directly through the Express app in memory.
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
        resolve({ status: this.statusCode, headers: resHeaders, body: payload });
        return this;
      },
      redirect(code, target) {
        this.statusCode = typeof code === 'number' ? code : 302;
        resHeaders.location = typeof code === 'string' ? code : target;
        this.headersSent = true;
        resolve({ status: this.statusCode, headers: resHeaders, body: null });
        return this;
      },
    };

    app(req, res, (err) => {
      if (err) reject(err);
    });
  });
};

const createQueryMock = (result) => {
  const builder = {
    select: () => builder,
    upsert: () => builder,
    eq: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => result,
    then: (resolve) => resolve(result),
  };
  return builder;
};

describe('Phase 0: Auth Proxy & Institution Endpoints', () => {
  let app;

  const sampleProfile = {
    id: '10000000-0000-0000-0000-000000000001',
    full_name: 'Demo Student',
    role: 'student',
    institution_id: '11111111-1111-1111-1111-111111111111',
    points: 50,
  };

  before(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/institutions', institutionRoute);
    app.use(notFoundHandler);
    app.use(errorHandler);
  });

  afterEach(() => {
    mock.restoreAll();
  });

  it('GET /api/v1/institutions returns public institution list', async () => {
    const institutions = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Apex Institute of Technology',
        state: 'Maharashtra',
        district: 'Pune',
      },
    ];
    mock.method(supabase, 'from', () => createQueryMock({ data: institutions, error: null }));

    const res = await invokeApp(app, { method: 'GET', url: '/api/v1/institutions' });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.deepEqual(res.body.data, institutions);
  });

  it('POST /api/v1/auth/signup validates input and registers user via backend', async () => {
    const badRes = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/signup',
      body: { full_name: '', email: 'bad-email', password: '123' },
    });
    assert.equal(badRes.status, 400);
    assert.equal(badRes.body.success, false);

    mock.method(supabase, 'from', (table) => {
      if (table === 'institutions') {
        return createQueryMock({ data: { id: sampleProfile.institution_id }, error: null });
      }
      if (table === 'profiles') {
        return createQueryMock({ data: sampleProfile, error: null });
      }
      return createQueryMock({ data: null, error: null });
    });

    mock.method(supabase.auth.admin, 'createUser', async () => ({
      data: { user: { id: sampleProfile.id, email: 'student@inst-a.edu' } },
      error: null,
    }));

    mock.method(supabaseAuth.auth, 'signInWithPassword', async () => ({
      data: {
        user: { id: sampleProfile.id, email: 'student@inst-a.edu' },
        session: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_at: 1999999999,
        },
      },
      error: null,
    }));

    const res = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/signup',
      body: {
        full_name: 'Demo Student',
        email: 'student@inst-a.edu',
        password: 'password123',
        institution_id: sampleProfile.institution_id,
      },
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.access_token, 'mock-access-token');
    assert.equal(res.body.data.user.role, 'student');
  });

  it('POST /api/v1/auth/login returns tokens on valid credentials and 401 on invalid', async () => {
    mock.method(supabaseAuth.auth, 'signInWithPassword', async ({ password }) => {
      if (password !== 'secret123') {
        return { data: { user: null, session: null }, error: { message: 'Invalid login' } };
      }
      return {
        data: {
          user: { id: sampleProfile.id, email: 'student@inst-a.edu' },
          session: {
            access_token: 'login-access-token',
            refresh_token: 'login-refresh-token',
            expires_at: 1999999999,
          },
        },
        error: null,
      };
    });

    mock.method(supabase, 'from', () => createQueryMock({ data: sampleProfile, error: null }));

    const failRes = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/login',
      body: { email: 'student@inst-a.edu', password: 'wrong' },
    });
    assert.equal(failRes.status, 401);
    assert.equal(failRes.body.success, false);

    const okRes = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/login',
      body: { email: 'student@inst-a.edu', password: 'secret123' },
    });
    assert.equal(okRes.status, 200);
    assert.equal(okRes.body.success, true);
    assert.equal(okRes.body.data.access_token, 'login-access-token');
    assert.equal(okRes.body.data.user.full_name, 'Demo Student');
  });

  it('POST /api/v1/auth/refresh refreshes session token', async () => {
    mock.method(supabaseAuth.auth, 'refreshSession', async () => ({
      data: {
        session: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_at: 2000000000,
        },
      },
      error: null,
    }));

    const res = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/refresh',
      body: { refresh_token: 'old-refresh-token' },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.access_token, 'new-access-token');
  });

  it('POST /api/v1/auth/logout and GET /api/v1/auth/me work as expected', async () => {
    const logoutRes = await invokeApp(app, { method: 'POST', url: '/api/v1/auth/logout' });
    assert.equal(logoutRes.status, 200);
    assert.equal(logoutRes.body.data.message, 'Logged out successfully');

    const unauthMe = await invokeApp(app, { method: 'GET', url: '/api/v1/auth/me' });
    assert.equal(unauthMe.status, 401);

    mock.method(supabase.auth, 'getUser', async () => ({
      data: { user: { id: sampleProfile.id, email: 'student@inst-a.edu' } },
      error: null,
    }));
    mock.method(supabase, 'from', () => createQueryMock({ data: sampleProfile, error: null }));

    const okMe = await invokeApp(app, {
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { Authorization: 'Bearer valid-token' },
    });
    assert.equal(okMe.status, 200);
    assert.equal(okMe.body.data.email, 'student@inst-a.edu');
    assert.equal(okMe.body.data.role, 'student');
  });

  it('Supabase Google Sign-In start, launch cookie redirect, callback bridge, complete, status poll, and id_token work', async () => {
    mock.method(supabaseAuth.auth, 'signInWithOAuth', async ({ provider, options }) => ({
      data: { provider, url: `https://example.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(options.redirectTo)}` },
      error: null,
    }));

    const startRes = await invokeApp(app, { method: 'POST', url: '/api/v1/auth/google/start', body: {} });
    assert.equal(startRes.status, 200);
    assert.ok(startRes.body.data.auth_url.includes('/api/v1/auth/google/launch?state='));
    const { state } = startRes.body.data;

    const launchRes = await invokeApp(app, {
      method: 'GET',
      url: `/api/v1/auth/google/launch?state=${state}`,
    });
    assert.equal(launchRes.status, 302);
    assert.ok(launchRes.headers.location.includes('provider=google'));
    assert.ok(String(launchRes.headers['set-cookie']).includes(`aevora_oauth_state=${state}`));

    const pendingRes = await invokeApp(app, {
      method: 'GET',
      url: `/api/v1/auth/google/status?state=${state}`,
    });
    assert.equal(pendingRes.status, 200);
    assert.equal(pendingRes.body.data.status, 'pending');

    const cbRes = await invokeApp(app, {
      method: 'GET',
      url: '/api/v1/auth/google/callback',
    });
    assert.equal(cbRes.status, 200);
    assert.ok(String(cbRes.body).includes('/api/v1/auth/google/complete'));

    mock.method(supabase.auth, 'getUser', async () => ({
      data: {
        user: {
          id: sampleProfile.id,
          email: 'google@inst-a.edu',
          user_metadata: { full_name: 'Google Student' },
        },
      },
      error: null,
    }));
    mock.method(supabase, 'from', () => createQueryMock({ data: sampleProfile, error: null }));

    const completeRes = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/google/complete',
      headers: { Cookie: `aevora_oauth_state=${state}` },
      body: { access_token: 'google-sb-access', refresh_token: 'google-sb-refresh', expires_at: 2000000000 },
    });
    assert.equal(completeRes.status, 200);
    assert.equal(completeRes.body.data.ok, true);

    const doneRes = await invokeApp(app, {
      method: 'GET',
      url: `/api/v1/auth/google/status?state=${state}`,
    });
    assert.equal(doneRes.status, 200);
    assert.equal(doneRes.body.data.status, 'completed');
    assert.equal(doneRes.body.data.access_token, 'google-sb-access');
    assert.equal(doneRes.body.data.user.email, 'google@inst-a.edu');

    mock.method(supabaseAuth.auth, 'signInWithIdToken', async () => ({
      data: {
        session: { access_token: 'idtoken-sb-access', refresh_token: 'idtoken-sb-refresh', expires_at: 2000000000 },
        user: { id: sampleProfile.id, email: 'google@inst-a.edu', user_metadata: { full_name: 'Google Student' } },
      },
      error: null,
    }));

    const tokenRes = await invokeApp(app, {
      method: 'POST',
      url: '/api/v1/auth/google',
      body: { id_token: 'valid-google-id-token' },
    });
    assert.equal(tokenRes.status, 200);
    assert.equal(tokenRes.body.data.access_token, 'idtoken-sb-access');
  });
});

