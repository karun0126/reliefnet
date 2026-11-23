import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  Zap, 
  Target, 
  Map as MapIcon, 
  Camera, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  Users, 
  FileText, 
  Compass, 
  MapPin, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail
} from 'lucide-react';
import { CurrentUser, UserRole, LocationCoordinates } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CurrentUser) => void;
  onReportWithoutSignin: () => void;
  initialMode?: 'signin' | 'register';
  initialRole?: UserRole;
}

const AVAILABLE_SKILLS = [
  'medical',
  'first aid',
  'nursing',
  'counseling',
  'cooking',
  'food distribution',
  'driving',
  'logistics',
  'construction',
  'shelter management',
  'water supply',
  'electrical'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onReportWithoutSignin,
  initialMode = 'signin',
  initialRole = null
}) => {
  const [mode, setMode] = useState<'signin' | 'select_role' | 'register_details'>(() => 
    initialMode === 'register' ? 'select_role' : 'signin'
  );
  const [selectedRole, setSelectedRole] = useState<'reporter' | 'volunteer' | 'coordinator'>(() => 
    (initialRole && initialRole !== null) ? initialRole : 'volunteer'
  );

  // Sign in fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);

  // Register details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 98112 44556');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'medical',
    'first aid',
    'driving',
    'food distribution',
    'water supply'
  ]);
  const [locationText, setLocationText] = useState('Ghaziabad, NCR');
  const [coords, setCoords] = useState<LocationCoordinates>({
    lat: 28.6692,
    lng: 77.4538,
    address: 'Ghaziabad, NCR'
  });
  const [willingKm, setWillingKm] = useState<number>(15);
  const [inviteCode, setInviteCode] = useState('RELIEF-HQ-2026');
  const [orgName, setOrgName] = useState('Red Cross Disaster Relief');
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
            address: 'GPS Verified Location'
          });
          setLocationText('GPS Location Detected');
        },
        () => {
          setCoords({
            lat: 28.633780,
            lng: 77.445487,
            address: 'Ghaziabad Central'
          });
          setLocationText('Ghaziabad Central');
        }
      );
    }
  };

  // Quick Demo Logins for the 3 Individuals
  const handleQuickLogin = (role: 'coordinator' | 'volunteer' | 'reporter') => {
    if (role === 'coordinator') {
      onLoginSuccess({
        id: 'COORD-01',
        name: 'Dr. Priya Sen',
        email: 'coord@ngo.com',
        role: 'coordinator',
        organization: 'National Disaster Coordination HQ',
        phone: '+91 98110 99887'
      });
    } else if (role === 'volunteer') {
      onLoginSuccess({
        id: 'VOL-101',
        name: 'Kavita Rao',
        email: 'vol@ngo.com',
        role: 'volunteer',
        phone: '+91 98990 11223',
        skills: ['First Aid', 'Swift Water Rescue', 'Paramedic', 'Logistics'],
        location: { lat: 28.6310, lng: 77.3600, address: 'Sector 4 Staging Post' },
        travelRadiusKm: 20,
        rating: 4.9,
        completedMissions: 42
      });
    } else {
      onLoginSuccess({
        id: 'REP-204',
        name: 'Sunita Sharma',
        email: 'rep@ngo.com',
        role: 'reporter',
        phone: '+91 98112 34567',
        location: { lat: 28.6300, lng: 77.3620, address: 'Sector 4 Community' }
      });
    }
    onClose();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter your email address');
      return;
    }

    const lower = email.toLowerCase();
    if (lower.includes('vol')) {
      handleQuickLogin('volunteer');
    } else if (lower.includes('coord') || lower.includes('admin')) {
      handleQuickLogin('coordinator');
    } else {
      handleQuickLogin('reporter');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = name.trim() || (
      selectedRole === 'coordinator' ? 'Coordinator Lead' :
      selectedRole === 'volunteer' ? 'Field Volunteer' : 'Community Reporter'
    );

    const userEmail = email.trim() || `${selectedRole}@reliefnet.org`;

    const newUser: CurrentUser = {
      id: `USER-${Date.now().toString().slice(-4)}`,
      name: userName,
      email: userEmail,
      role: selectedRole,
      phone,
      location: coords,
      skills: selectedRole === 'volunteer' ? selectedSkills : undefined,
      travelRadiusKm: selectedRole === 'volunteer' ? willingKm : undefined,
      organization: selectedRole === 'coordinator' ? orgName : undefined,
      completedMissions: selectedRole === 'volunteer' ? 0 : undefined,
      rating: selectedRole === 'volunteer' ? 5.0 : undefined
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="rn-auth-overlay" onClick={onClose}>
      <div className="rn-auth-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          type="button" 
          className="rn-auth-close-btn" 
          onClick={onClose}
          aria-label="Close authentication modal"
        >
          <X size={20} />
        </button>

        {/* Left Showcase Pane — Deep Green Gradient */}
        <div className="rn-auth-left-pane">
          <div className="rn-auth-brand">
            <div className="rn-auth-logo-badge">
              <Leaf size={20} color="#10b981" />
            </div>
            <div>
              <div className="rn-auth-brand-name">ReliefNet</div>
              <div className="rn-auth-brand-sub">CRISIS COORDINATION</div>
            </div>
          </div>

          <div className="rn-auth-hero-copy">
            <h2>Coordinate relief with intelligence.</h2>
            <p>
              AI-powered volunteer coordination that gets the right help to the right people — fast.
            </p>
          </div>

          <div className="rn-auth-features-list">
            <div className="rn-auth-feat-item">
              <div className="rn-feat-icon-bubble"><Zap size={14} /></div>
              <span>AI-powered urgency classification</span>
            </div>
            <div className="rn-auth-feat-item">
              <div className="rn-feat-icon-bubble"><Target size={14} /></div>
              <span>Smart volunteer matching by skill &amp; location</span>
            </div>
            <div className="rn-auth-feat-item">
              <div className="rn-feat-icon-bubble"><MapIcon size={14} /></div>
              <span>Real-time map with crisis visualization</span>
            </div>
            <div className="rn-auth-feat-item">
              <div className="rn-feat-icon-bubble"><Camera size={14} /></div>
              <span>Image reporting via Gemini Vision</span>
            </div>
          </div>

          <div className="rn-auth-stats-grid">
            <div className="rn-auth-stat-box">
              <div className="rn-stat-val">2.4k</div>
              <div className="rn-stat-lbl">Needs resolved</div>
            </div>
            <div className="rn-auth-stat-box">
              <div className="rn-stat-val">340</div>
              <div className="rn-stat-lbl">Volunteers active</div>
            </div>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="rn-auth-right-pane">
          {/* =========================================================
              VIEW 1: SIGN IN (Screenshot 2)
              ========================================================= */}
          {mode === 'signin' && (
            <div className="rn-auth-form-wrap">
              <div className="rn-auth-header-title">
                <h1>Welcome back</h1>
                <p>Sign in to your ReliefNet account</p>
              </div>

              {authError && (
                <div className="rn-auth-alert-banner">
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSignInSubmit} className="rn-auth-form">
                <div className="rn-form-group">
                  <label htmlFor="auth-email">EMAIL ADDRESS</label>
                  <div className="rn-input-with-icon">
                    <Mail size={16} className="rn-field-icon" />
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        setAuthError(null);
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="rn-form-group">
                  <label htmlFor="auth-password">PASSWORD</label>
                  <div className="rn-input-with-icon">
                    <Lock size={16} className="rn-field-icon" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="rn-toggle-pw"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="rn-auth-primary-btn" id="signin-submit-btn">
                  <span>Sign in</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* DEMO CREDENTIALS QUICK PICKER (3 Individuals) */}
              <div className="rn-auth-demo-section">
                <div className="rn-demo-divider">
                  <span>Demo credentials</span>
                </div>

                <div className="rn-demo-buttons-grid">
                  <button
                    type="button"
                    className="rn-demo-card"
                    onClick={() => handleQuickLogin('coordinator')}
                    title="Sign in as Coordinator"
                  >
                    <div className="rn-demo-card-icon">
                      <Compass size={18} color="#059669" />
                    </div>
                    <div className="rn-demo-card-info">
                      <strong>Coordinator</strong>
                      <span>coord@ngo.com</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="rn-demo-card"
                    onClick={() => handleQuickLogin('volunteer')}
                    title="Sign in as Volunteer"
                  >
                    <div className="rn-demo-card-icon">
                      <Users size={18} color="#10b981" />
                    </div>
                    <div className="rn-demo-card-info">
                      <strong>Volunteer</strong>
                      <span>vol@ngo.com</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="rn-demo-card"
                    onClick={() => handleQuickLogin('reporter')}
                    title="Sign in as Reporter"
                  >
                    <div className="rn-demo-card-icon">
                      <FileText size={18} color="#0284c7" />
                    </div>
                    <div className="rn-demo-card-info">
                      <strong>Reporter</strong>
                      <span>rep@ngo.com</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="rn-auth-footer-links">
                <p>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="rn-link-btn green"
                    onClick={() => setMode('select_role')}
                  >
                    Register free
                  </button>
                </p>
                <button
                  type="button"
                  className="rn-link-btn muted"
                  onClick={() => {
                    onClose();
                    onReportWithoutSignin();
                  }}
                >
                  Report a need without signing in &rarr;
                </button>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 2: ROLE SELECTION (Screenshot 4)
              ========================================================= */}
          {mode === 'select_role' && (
            <div className="rn-auth-form-wrap">
              <div className="rn-auth-header-title">
                <h1>Create your account</h1>
                <div className="rn-auth-step-indicator">
                  <span>Step 1 of 2</span>
                  <div className="rn-step-bars">
                    <span className="rn-step-bar active"></span>
                    <span className="rn-step-bar"></span>
                  </div>
                </div>
                <p className="rn-role-select-prompt">I want to join as a...</p>
              </div>

              <div className="rn-role-cards-stack">
                {/* 1. Reporter */}
                <div
                  className={`rn-role-choice-card ${selectedRole === 'reporter' ? 'is-selected' : ''}`}
                  onClick={() => setSelectedRole('reporter')}
                >
                  <div className="rn-role-card-icon reporter-bg">
                    <FileText size={22} color="#0284c7" />
                  </div>
                  <div className="rn-role-card-text">
                    <h3>Reporter</h3>
                    <p>Submit community needs via text or photo. Track resolution status in real time.</p>
                  </div>
                  <div className="rn-role-radio">
                    {selectedRole === 'reporter' && <Check size={14} color="#ffffff" />}
                  </div>
                </div>

                {/* 2. Volunteer */}
                <div
                  className={`rn-role-choice-card ${selectedRole === 'volunteer' ? 'is-selected' : ''}`}
                  onClick={() => setSelectedRole('volunteer')}
                >
                  <div className="rn-role-card-icon volunteer-bg">
                    <Users size={22} color="#10b981" />
                  </div>
                  <div className="rn-role-card-text">
                    <h3>Volunteer</h3>
                    <p>Get matched to needs by your skills and location. Help communities in the field.</p>
                  </div>
                  <div className="rn-role-radio">
                    {selectedRole === 'volunteer' && <Check size={14} color="#ffffff" />}
                  </div>
                </div>

                {/* 3. Coordinator */}
                <div
                  className={`rn-role-choice-card ${selectedRole === 'coordinator' ? 'is-selected' : ''}`}
                  onClick={() => setSelectedRole('coordinator')}
                >
                  <div className="rn-role-card-icon coordinator-bg">
                    <Compass size={22} color="#059669" />
                  </div>
                  <div className="rn-role-card-text">
                    <h3>Coordinator</h3>
                    <p>Manage assignments, view maps, and deploy volunteers.</p>
                    <span className="rn-role-badge-note">⚡ Requires coordinator invite code</span>
                  </div>
                  <div className="rn-role-radio">
                    {selectedRole === 'coordinator' && <Check size={14} color="#ffffff" />}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="rn-auth-primary-btn"
                onClick={() => setMode('register_details')}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>

              <div className="rn-auth-footer-links">
                <p>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="rn-link-btn green"
                    onClick={() => setMode('signin')}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: REGISTER DETAILS & SKILLS (Screenshot 3)
              ========================================================= */}
          {mode === 'register_details' && (
            <div className="rn-auth-form-wrap">
              <div className="rn-auth-header-title">
                <h1>Create your account</h1>
                <div className="rn-auth-step-indicator">
                  <span>Step 2 of 2</span>
                  <div className="rn-step-bars">
                    <span className="rn-step-bar active"></span>
                    <span className="rn-step-bar active"></span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="rn-auth-form scrollable">
                <div className="rn-form-group">
                  <label htmlFor="reg-name">YOUR FULL NAME</label>
                  <input
                    id="reg-name"
                    type="text"
                    placeholder={selectedRole === 'volunteer' ? 'e.g. Kavita Rao' : 'Your Name'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="rn-form-group">
                  <label htmlFor="reg-email">EMAIL ADDRESS</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@domain.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* ROLE SPECIFIC: Volunteer Skills & Radius */}
                {selectedRole === 'volunteer' && (
                  <>
                    <div className="rn-form-group">
                      <div className="rn-skills-label-row">
                        <label>YOUR SKILLS * (SELECT ALL THAT APPLY)</label>
                        <span className="rn-skills-count">✓ {selectedSkills.length} skills selected</span>
                      </div>
                      <div className="rn-skills-pill-wrap">
                        {AVAILABLE_SKILLS.map(skill => {
                          const isSel = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              className={`rn-skill-toggle-pill ${isSel ? 'is-selected' : ''}`}
                              onClick={() => handleToggleSkill(skill)}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rn-form-group">
                      <label htmlFor="reg-loc">YOUR LOCATION</label>
                      <div className="rn-loc-input-row">
                        <input
                          id="reg-loc"
                          type="text"
                          value={locationText}
                          onChange={e => setLocationText(e.target.value)}
                          placeholder="City, District"
                        />
                        <button
                          type="button"
                          className="rn-detect-loc-btn"
                          onClick={handleDetectLocation}
                        >
                          <MapPin size={14} />
                          <span>Detect</span>
                        </button>
                      </div>

                      <div className="rn-coords-row">
                        <div className="rn-coord-field">
                          <span>LATITUDE</span>
                          <input type="text" readOnly value={coords.lat} />
                        </div>
                        <div className="rn-coord-field">
                          <span>LONGITUDE</span>
                          <input type="text" readOnly value={coords.lng} />
                        </div>
                      </div>
                    </div>

                    <div className="rn-form-group">
                      <div className="rn-travel-slider-header">
                        <label>WILLING TO TRAVEL:</label>
                        <span className="rn-slider-val-tag">{willingKm} KM</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={willingKm}
                        onChange={e => setWillingKm(Number(e.target.value))}
                        className="rn-range-slider"
                      />
                      <div className="rn-range-ends">
                        <span>1km</span>
                        <span>50km</span>
                      </div>
                    </div>
                  </>
                )}

                {/* ROLE SPECIFIC: Coordinator Invite Code */}
                {selectedRole === 'coordinator' && (
                  <>
                    <div className="rn-form-group">
                      <label htmlFor="reg-org">NGO / DISASTER AGENCY</label>
                      <input
                        id="reg-org"
                        type="text"
                        value={orgName}
                        onChange={e => setOrgName(e.target.value)}
                        placeholder="e.g. Red Cross, FEMA, NDMA"
                        required
                      />
                    </div>
                    <div className="rn-form-group">
                      <label htmlFor="reg-invite">COORDINATOR INVITE CODE *</label>
                      <input
                        id="reg-invite"
                        type="text"
                        value={inviteCode}
                        onChange={e => setInviteCode(e.target.value)}
                        placeholder="RELIEF-HQ-XXXX"
                        required
                      />
                      <span className="rn-field-hint">
                        Default demo code: <code>RELIEF-HQ-2026</code>
                      </span>
                    </div>
                  </>
                )}

                {/* ROLE SPECIFIC: Reporter Contact */}
                {selectedRole === 'reporter' && (
                  <div className="rn-form-group">
                    <label htmlFor="reg-phone">PHONE NUMBER (FOR DISPATCH UPDATES)</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      required
                    />
                  </div>
                )}

                <div className="rn-register-btn-row">
                  <button
                    type="button"
                    className="rn-auth-secondary-btn"
                    onClick={() => setMode('select_role')}
                  >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <button type="submit" className="rn-auth-primary-btn">
                    <Check size={16} />
                    <span>Create Account</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
