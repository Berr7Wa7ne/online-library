const { register, createLibrarian, login } = require('../../online-library/src/controllers/authController');
const { mockPrisma } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mocking bcryptjs and jsonwebtoken for testing
jest.mock('bcryptjs');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked_token'), // Mock JWT token sign method
}));

// Test suite for createLibrarian functionality
describe('createLibrarian', () => {
  let req, res;

  // Setting up mock request and response objects for each test
  beforeEach(() => {
    req = {
      body: { email: 'librarian@example.com', password: 'password123' },
      file: { path: 'uploads/profile.jpg' },
      user: { role: 'SUPERADMIN' }, // Mock authenticated user with SUPERADMIN role
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Clear any previous mock data
  });

  // Test case: Should return 403 if user is not a SUPERADMIN
  test('should return 403 if user is not a SUPERADMIN', async () => {
    req.user.role = 'ADMIN'; // Simulate non-SUPERADMIN user
    
    // Mock SUPERADMIN existence in DB
    mockPrisma.user.findFirst.mockResolvedValue({ role: 'SUPERADMIN' });

    await createLibrarian(req, res);

    expect(res.status).toHaveBeenCalledWith(403); // Check status code for forbidden access
    expect(res.json).toHaveBeenCalledWith({
      error: 'Only super admin can create librarian accounts', // Expected error message
    });
  });
  

  // Test case: Should return 500 if no SUPERADMIN exists in the database
  test('should return 500 if no SUPERADMIN exists in the database', async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null); // No SUPERADMIN in DB

    await createLibrarian(req, res);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { role: 'SUPERADMIN' },
    });
    expect(res.status).toHaveBeenCalledWith(500); // Internal server error
    expect(res.json).toHaveBeenCalledWith({
      error: 'No SUPERADMIN exists. Please initialize the database.',
    });
  });

  // Test case: Should create librarian successfully
  test('should create librarian successfully', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({ role: 'SUPERADMIN' }); // SUPERADMIN exists in DB

    await createLibrarian(req, res);

    expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
      where: { role: 'SUPERADMIN' },
    });
    expect(res.status).not.toHaveBeenCalledWith(500); // No internal server error expected
    expect(res.status).not.toHaveBeenCalledWith(403); // No forbidden error expected
  });
});

// Test suite for Auth Controller - Register functionality
describe('Auth Controller - Register', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: 'testuser@example.com', password: 'password123' },
      file: { path: 'uploads/profile.jpg' },
      user: { role: 'READER' }, // Mock authenticated user with READER role
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Clear any previous mock data
  });

  // Test case: Should register a new user successfully
  test('should register a new user successfully', async () => {
    req.body = {
      email: 'testuser@example.com',
      password: 'password123',
      role: 'READER',
    };
    req.file = { path: 'uploads/profile.jpg' }; // Mock file upload

    // Mock database and bcrypt behavior
    mockPrisma.user.findUnique.mockResolvedValue(null); // No existing user
    bcrypt.hash.mockResolvedValue('hashed_password'); // Mock password hash
    mockPrisma.user.create.mockResolvedValue({
      id: 1,
      email: req.body.email,
      role: req.body.role,
    });

    await register(req, res);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10); // Mock bcrypt hash call
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: req.body.email,
        password: 'hashed_password',
        role: req.body.role,
        profilePhoto: req.file.path,
      },
    });
    expect(res.status).toHaveBeenCalledWith(201); // Expect successful creation status
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user: { email: req.body.email, role: req.body.role },
    });
  });

  // Test case: Should return 400 if user already exists
  test('should return 400 if user already exists', async () => {
    req.body.email = 'existinguser@example.com';

    // Mock existing user
    mockPrisma.user.findUnique.mockResolvedValue({ email: req.body.email });

    await register(req, res);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(400); // Expect bad request status
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' }); // Expected error message
  });

  // Test case: Should return 403 if attempting to register as a librarian
  test('should return 403 if attempting to register as a librarian', async () => {
    req.body = {
      email: 'librarian@example.com',
      password: 'password123',
      role: 'LIBRARIAN',
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(403); // Forbidden status for unauthorized role
    expect(res.json).toHaveBeenCalledWith({ error: 'Cannot register as librarian' }); // Expected error message
  });

  // Test case: Should return 500 on registration error
  test('should return 500 on registration error', async () => {
    req.body = {
      email: 'testuser@example.com',
      password: 'password123',
      role: 'READER',
    };

    // Mock database error
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Internal server error status
    expect(res.json).toHaveBeenCalledWith({ error: 'Error registering user' }); // Expected error message
  });
});

// Test suite for Auth Controller - Login functionality
describe('Auth Controller - Login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { email: 'testuser@example.com', password: 'password123' },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    process.env.JWT_SECRET_KEY = 'mocked_secret_key'; // Set mocked JWT secret key for testing

    jest.clearAllMocks(); // Clear any previous mock data
  });

  // Test case: Should log in successfully with valid credentials
  test('should log in successfully with valid credentials', async () => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // Mock database and bcrypt behavior
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: req.body.email,
      password: hashedPassword,
      role: 'READER',
    });
    bcrypt.compare.mockResolvedValue(true); // Password matches
    jwt.sign.mockReturnValue('mocked_token'); // Mock JWT token

    await login(req, res);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, hashedPassword); // Mock bcrypt comparison
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1, role: 'READER' },
      'mocked_secret_key', 
      { expiresIn: '1h' } // Token expiration time
    );
    expect(res.status).toHaveBeenCalledWith(200); // Success status for login
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'mocked_token', // Mocked token response
    });
  });

  // Test case: Should return 401 if user does not exist
  test('should return 401 if user does not exist', async () => {
    req.body.email = 'nonexistent@example.com';

    // Mock database returns no user
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await login(req, res);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(401); // Unauthorized status
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' }); // Expected error message
  });

  // Test case: Should return 401 if password is incorrect
  test('should return 401 if password is incorrect', async () => {
    req.body = {
      email: 'testuser@example.com',
      password: 'wrong_password',
    };

    // Mock database and bcrypt behavior
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: req.body.email,
      password: 'hashed_password',
      role: 'READER',
    });
    bcrypt.compare.mockResolvedValue(false); // Password does not match

    await login(req, res);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, 'hashed_password');
    expect(res.status).toHaveBeenCalledWith(401); // Unauthorized status
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' }); // Expected error message
  });

  // Test case: Should return 500 on login error
  test('should return 500 on login error', async () => {
    req.body = {
      email: 'testuser@example.com',
      password: 'password123',
    };

    // Mock database error
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

    await login(req, res);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(res.status).toHaveBeenCalledWith(500); // Internal server error
    expect(res.json).toHaveBeenCalledWith({ error: 'Error logging in' }); // Expected error message
  });
});
