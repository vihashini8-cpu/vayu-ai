import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'vayu-ai-super-secret-key-2026';

// In-memory mock database (since we don't have a real DB connection string)
// In production on Vercel, this should be replaced with Supabase or Postgres
const usersDb = [
  {
    id: '1',
    email: 'devraj.observer@vayu.in',
    passwordHash: bcrypt.hashSync('demo-metops-2026', 10),
    name: 'Devraj Singh',
    role: 'citizen',
    region: 'Maharashtra',
    status: 'active'
  },
  {
    id: '2',
    email: 'swaminathan@vayu.gov.in',
    passwordHash: bcrypt.hashSync('demo-metops-2026', 10),
    name: 'Dr. K. Swaminathan',
    role: 'meteorologist',
    region: 'National',
    status: 'active',
    isAdmin: true
  },
  {
    id: '3',
    email: 'deshmukh@sdma.gov.in',
    passwordHash: bcrypt.hashSync('demo-metops-2026', 10),
    name: 'Ananya Deshmukh',
    role: 'sdma',
    region: 'Odisha',
    status: 'active'
  }
];

// Register route (Citizen Only)
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, region } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (usersDb.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = {
    id: String(usersDb.length + 1),
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    name,
    role: 'citizen', // Hardcoded for security
    region: region || 'Unknown',
    status: 'active'
  };
  
  usersDb.push(newUser);
  
  const token = generateToken(newUser);
  res.cookie('vayu_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  const { passwordHash, ...userProfile } = newUser;
  res.status(201).json({ message: 'Registration successful', user: userProfile });
});

// Helper to generate tokens
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role, region: user.region, isAdmin: user.isAdmin || false }, JWT_SECRET, { expiresIn: '1d' });
};

// Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = usersDb.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials or unverified account.' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Account is pending approval or disabled.' });
  }

  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = generateToken(user);
  
  // Set HttpOnly cookie
  res.cookie('vayu_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  const { passwordHash, ...userProfile } = user;
  res.json({ user: userProfile });
});

// Admin middleware
const requireAdmin = (req, res, next) => {
  const token = req.cookies.vayu_session;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = usersDb.find(u => u.id === decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Requires Administrator privileges.' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin Invite Route
app.post('/api/auth/admin/invite', requireAdmin, (req, res) => {
  const { email, name, role, region } = req.body;
  
  if (usersDb.some(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  const setupToken = jwt.sign({ email, role, region, name }, JWT_SECRET, { expiresIn: '7d' });

  const newUser = {
    id: Date.now().toString(),
    email,
    name,
    role,
    region: region || 'Unknown',
    status: 'pending',
    setupToken // Storing it to verify later
  };

  usersDb.push(newUser);
  
  // In a real app, this would send an email. For demo, we return the link.
  res.json({ 
    message: 'Invitation generated successfully', 
    setupLink: `/setup-account?token=${setupToken}`
  });
});

// Setup Password Route (for invited officials)
app.post('/api/auth/setup-password', (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = usersDb.find(u => u.email === decoded.email && u.setupToken === token);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired setup token.' });
    }

    user.passwordHash = bcrypt.hashSync(password, 10);
    user.status = 'active';
    delete user.setupToken;

    res.json({ message: 'Account activated successfully. You can now log in.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired setup token.' });
  }
});

// Logout Route
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('vayu_session');
  res.json({ success: true });
});

// Get Current Session
app.get('/api/auth/session', (req, res) => {
  const token = req.cookies.vayu_session;
  if (!token) return res.status(401).json({ user: null });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = usersDb.find(u => u.id === decoded.id);
    if (!user) throw new Error('User not found');
    
    const { passwordHash, ...userProfile } = user;
    res.json({ user: userProfile });
  } catch (err) {
    res.clearCookie('vayu_session');
    res.status(401).json({ user: null });
  }
});

// Example of a Protected Route (Meteorologist Only)
app.get('/api/events/verify', (req, res) => {
  const token = req.cookies.vayu_session;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'meteorologist') {
      return res.status(403).json({ error: 'Forbidden: Requires Meteorologist privileges.' });
    }
    res.json({ success: true, message: 'Access granted to verification endpoint.' });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Verification Endpoint using Open-Meteo
app.post('/api/verify-report', async (req, res) => {
  const { lat, lng, category } = req.body;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing coordinates' });
  }

  try {
    // We use the current weather endpoint from Open-Meteo for real-time verification
    // We request temperature, precipitation, wind speed, and weather code.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const current = data.current;
    
    if (!current) {
       throw new Error('No current weather data returned from Open-Meteo');
    }

    let evidenceStatus = 'insufficient';
    let explanation = 'Insufficient data to verify report.';
    let preliminaryScore = 50;

    const retrievedMeasurements = {
      'Temperature (°C)': current.temperature_2m,
      'Precipitation (mm)': current.precipitation,
      'Wind Speed (km/h)': current.wind_speed_10m
    };

    // Rule-based assessment based on category
    switch (category) {
      case 'rainfall':
      case 'flooding':
      case 'thunderstorm':
        if (current.precipitation > 0) {
          evidenceStatus = 'supporting';
          explanation = `Local observation confirms precipitation (${current.precipitation} mm).`;
          preliminaryScore = 85 + Math.min(10, current.precipitation);
        } else {
          // Do not automatically reject, flag for review
          evidenceStatus = 'conflicting';
          explanation = `Grid-level data shows 0 mm precipitation, conflicting with report. May be a localized cell or delay in observation grid. Human review required.`;
          preliminaryScore = 30;
        }
        break;
      case 'heatwave':
        if (current.temperature_2m >= 40) {
          evidenceStatus = 'supporting';
          explanation = `Local observation confirms extreme heat (${current.temperature_2m}°C).`;
          preliminaryScore = 95;
        } else if (current.temperature_2m >= 35) {
          evidenceStatus = 'insufficient';
          explanation = `High temperatures observed (${current.temperature_2m}°C), but falls below standard heatwave threshold.`;
          preliminaryScore = 60;
        } else {
          evidenceStatus = 'conflicting';
          explanation = `Local temperature (${current.temperature_2m}°C) does not support heatwave report.`;
          preliminaryScore = 20;
        }
        break;
      case 'strong_winds':
      case 'cyclone':
        if (current.wind_speed_10m >= 40) {
          evidenceStatus = 'supporting';
          explanation = `Local observation confirms strong winds (${current.wind_speed_10m} km/h).`;
          preliminaryScore = 90;
        } else {
          evidenceStatus = 'conflicting';
          explanation = `Grid-level wind speed (${current.wind_speed_10m} km/h) is below severe thresholds. Human review required for potential localized gusts.`;
          preliminaryScore = 40;
        }
        break;
      default:
        evidenceStatus = 'insufficient';
        explanation = `Rule-based verification is not configured for category: ${category}.`;
        preliminaryScore = 50;
        break;
    }

    res.json({
      evidenceAssessment: {
        evidenceStatus,
        retrievedMeasurements,
        observationTime: current.time,
        source: 'Open-Meteo',
        explanation,
        preliminaryScore
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to retrieve weather evidence. API unavailable or rate limited.' });
  }
});

export default app;
