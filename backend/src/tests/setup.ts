import 'dotenv/config';
process.env.JWT_SECRET ||= 'test-secret-pliego-ci-123456';
process.env.NODE_ENV ||= 'test';
process.env.DATABASE_URL ||= 'file:./dev.db';
process.env.CORS_ORIGIN ||= 'http://127.0.0.1:45321';
process.env.FRONTEND_URL ||= 'http://127.0.0.1:45321';
process.env.UPLOAD_DIR ||= './uploads';
process.env.EXPORT_DIR ||= './exports';
process.env.CHROME_PATH ||= '/usr/local/bin/google-chrome';
