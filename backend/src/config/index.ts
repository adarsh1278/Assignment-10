export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-test-secret-replace-in-production',
  jwtExpiresIn: '7d' as const,
  bcryptRounds: 12,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  },
};
