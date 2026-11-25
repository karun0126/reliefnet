import React, { useState } from 'react';
import { ActiveTab, NeedReport, Volunteer, CurrentUser, UserRole } from './types';
import { INITIAL_NEEDS, INITIAL_VOLUNTEERS } from './services/mockData';
import { CurvedNavbar } from './components/CurvedNavbar';
import { LeftDockNavbar, CoordinatorSubTab, VolunteerSubTab, ReporterSubTab } from './components/LeftDockNavbar';
import { LandingPage } from './components/LandingPage';
import { CoordinatorDashboard } from './components/CoordinatorDashboard';
import { VolunteerPortal } from './components/VolunteerPortal';
import { ReporterPortal } from './components/ReporterPortal';
import { ReportNeedModal } from './components/ReportNeedModal';
import { AuthModal } from './components/AuthModal';

// Retrieve initial role tab from URL hash or localStorage
const getInitialTab = (): ActiveTab => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'coordinator' || hash === 'dashboard') return 'dashboard';
    if (hash === 'volunteer') return 'volunteer';
    if (hash === 'reporter') return 'reporter';

    const savedTab = localStorage.getItem('reliefnet_active_tab') as ActiveTab | null;
    if (savedTab && ['landing', 'dashboard', 'volunteer', 'reporter'].includes(savedTab)) {
      return savedTab;
    }
  }
  return 'landing';
};

const getInitialUser = (tab: ActiveTab): CurrentUser | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('reliefnet_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
  }
  if (tab === 'dashboard') {
    return {
      id: 'COORD-01',
      name: 'Dr. Priya Sen',
      email: 'coord@ngo.com',
      role: 'coordinator',
      organization: 'National Disaster Coordination HQ',
      phone: '+91 98110 99887'
    };
  }
  if (tab === 'volunteer') {
    return {
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
    };
  }
  if (tab === 'reporter') {
    return {
      id: 'REP-204',
      name: 'Sunita Sharma',
      email: 'rep@ngo.com',
      role: 'reporter',
      phone: '+91 98112 34567',
      location: { lat: 28.6300, lng: 77.3620, address: 'Sector 4 Community' }
    };
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);
  const [needs, setNeeds] = useState<NeedReport[]>(INITIAL_NEEDS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  
  // Current active individual (persisted across refresh)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getInitialUser(getInitialTab()));

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>(null);

  // Active sub-page tabs for each role portal (restored from localStorage)
  const [coordinatorSubTab, setCoordinatorSubTab] = useState<CoordinatorSubTab>(() => {
    return (localStorage.getItem('reliefnet_coordinator_subtab') as CoordinatorSubTab) || 'operations';
  });
  const [volunteerSubTab, setVolunteerSubTab] = useState<VolunteerSubTab>(() => {
    return (localStorage.getItem('reliefnet_volunteer_subtab') as VolunteerSubTab) || 'active_mission';
  });
  const [reporterSubTab, setReporterSubTab] = useState<ReporterSubTab>(() => {
    return (localStorage.getItem('reliefnet_reporter_subtab') as ReporterSubTab) || 'tracking';
  });

  const criticalCount = needs.filter(n => n.urgency === 'CRITICAL' && n.status !== 'RESOLVED').length || 6;
  const activeVolunteersCount = volunteers.filter(v => v.status === 'AVAILABLE' || v.status === 'DEPLOYED').length || 34;

  // Disable browser automatic scroll restoration and force top on load & tab switch
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  // Sync activeTab to localStorage and URL hash
  React.useEffect(() => {
    localStorage.setItem('reliefnet_active_tab', activeTab);
    const hash = activeTab === 'dashboard' ? 'coordinator' : activeTab;
    if (window.location.hash.replace('#', '') !== hash) {
      window.history.replaceState(null, '', `#${hash}`);
    }
  }, [activeTab]);

  // Sync currentUser to localStorage
  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('reliefnet_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('reliefnet_current_user');
    }
  }, [currentUser]);

  // Sync subtabs to localStorage
  React.useEffect(() => {
    localStorage.setItem('reliefnet_coordinator_subtab', coordinatorSubTab);
  }, [coordinatorSubTab]);

  React.useEffect(() => {
    localStorage.setItem('reliefnet_volunteer_subtab', volunteerSubTab);
  }, [volunteerSubTab]);

  React.useEffect(() => {
    localStorage.setItem('reliefnet_reporter_subtab', reporterSubTab);
  }, [reporterSubTab]);

  // Listen to hash change (browser back/forward buttons or direct hash entry)
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'coordinator' || hash === 'dashboard') {
        handleSwitchRole('coordinator');
      } else if (hash === 'volunteer') {
        handleSwitchRole('volunteer');
      } else if (hash === 'reporter') {
        handleSwitchRole('reporter');
      } else if (hash === 'landing' || hash === '') {
        setActiveTab('landing');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Open Auth Modal helper
  const handleOpenAuth = (mode: 'signin' | 'register', role?: UserRole) => {
    setAuthModalMode(mode);
    setAuthInitialRole(role || null);
    setIsAuthModalOpen(true);
  };

  // Successful Login / Registration
  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
    if (user.role === 'coordinator') {
      setActiveTab('dashboard');
    } else if (user.role === 'volunteer') {
      setActiveTab('volunteer');
    } else {
      setActiveTab('reporter');
    }
  };

  // Switch Role quickly from top navbar
  const handleSwitchRole = (role: UserRole) => {
    if (!role) {
      setCurrentUser(null);
      setActiveTab('landing');
      return;
    }

    if (role === 'coordinator') {
      setCurrentUser({
        id: 'COORD-01',
        name: 'Dr. Priya Sen',
        email: 'coord@ngo.com',
        role: 'coordinator',
        organization: 'National Disaster Coordination HQ',
        phone: '+91 98110 99887'
      });
      setActiveTab('dashboard');
    } else if (role === 'volunteer') {
      setCurrentUser({
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
      setActiveTab('volunteer');
    } else if (role === 'reporter') {
      setCurrentUser({
        id: 'REP-204',
        name: 'Sunita Sharma',
        email: 'rep@ngo.com',
        role: 'reporter',
        phone: '+91 98112 34567',
        location: { lat: 28.6300, lng: 77.3620, address: 'Sector 4 Community' }
      });
      setActiveTab('reporter');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
  };

  // Coordinator dispatches volunteer to need
  const handleDispatchVolunteer = (needId: string, volunteerId: string) => {
    const vol = volunteers.find(v => v.id === volunteerId);
    setNeeds(prev => prev.map(n => {
      if (n.id === needId) {
        return {
          ...n,
          status: 'ASSIGNED',
          assignedVolunteerId: volunteerId,
          recommendedVolunteer: vol ? {
            id: vol.id,
            name: vol.name,
            role: vol.role,
            distance: `${vol.distanceKm || 1.2} km away`,
            rating: vol.rating,
            completedMissions: vol.completedMissions,
            skills: vol.skills
          } : n.recommendedVolunteer
        };
      }
      return n;
    }));

    setVolunteers(prev => prev.map(v => {
      if (v.id === volunteerId) {
        return { ...v, status: 'DEPLOYED' };
      }
      return v;
    }));
  };

  // Volunteer claims need directly from nearby alerts
  const handleVolunteerClaimNeed = (needId: string) => {
    const volId = currentUser?.id || 'VOL-101';
    handleDispatchVolunteer(needId, volId);
  };

  // Add new reported need from reporter or modal
  const handleAddReport = (newNeedData: Partial<NeedReport>) => {
    const newId = `RN-${8942 + needs.length}`;
    const created: NeedReport = {
      id: newId,
      title: newNeedData.title || 'Community Emergency Incident',
      description: newNeedData.description || 'Ground crisis reported by civilian.',
      category: newNeedData.category || 'Rescue',
      urgency: newNeedData.urgency || 'HIGH',
      priorityScore: newNeedData.priorityScore || 85,
      peopleCount: newNeedData.peopleCount || '5-10 people',
      riskLevel: newNeedData.riskLevel || 'High hazard',
      targetEta: '< 20m',
      location: newNeedData.location || {
        lat: 28.6320,
        lng: 77.3620,
        address: 'Sector 4, East Valley District',
        district: 'East Valley'
      },
      status: 'SUBMITTED',
      reportedAt: 'Just now',
      reporterName: newNeedData.reporterName || currentUser?.name || 'Ground Witness',
      reporterContact: newNeedData.reporterContact || currentUser?.phone || '+91 98112 34567',
      imageUrl: newNeedData.imageUrl || '/images/flood-card.jpg',
      requiredSkills: newNeedData.requiredSkills || ['First Aid', 'Swift Water Rescue'],
      aiConfidence: 96,
      aiClassificationNotes: newNeedData.aiClassificationNotes || 'AI validated incident. Urgent priority scored at 85/100.',
      recommendedVolunteer: {
        id: 'VOL-101',
        name: 'Kavita Rao',
        role: 'Senior Paramedic',
        distance: '0.9 km away',
        rating: 4.9,
        skills: ['First Aid', 'Triage', 'Drone Recon']
      }
    };

    setNeeds(prev => [created, ...prev]);
  };

  // Volunteer mission status update
  const handleVolunteerUpdateStatus = (needId: string, newStatus: 'IN_PROGRESS' | 'RESOLVED') => {
    setNeeds(prev => prev.map(n => {
      if (n.id === needId) {
        return { ...n, status: newStatus };
      }
      return n;
    }));

    if (newStatus === 'RESOLVED') {
      const need = needs.find(n => n.id === needId);
      if (need?.assignedVolunteerId) {
        setVolunteers(prev => prev.map(v => {
          if (v.id === need.assignedVolunteerId) {
            return {
              ...v,
              status: 'AVAILABLE',
              completedMissions: v.completedMissions + 1
            };
          }
          return v;
        }));
      }
    }
  };

  const handleToggleVolunteerAvailability = (volId: string) => {
    setVolunteers(prev => prev.map(v => {
      if (v.id === volId) {
        const nextStatus = v.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
        return { ...v, status: nextStatus };
      }
      return v;
    }));
  };

  const volunteerProfile: CurrentUser = currentUser && currentUser.role === 'volunteer' 
    ? currentUser 
    : {
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
      };

  const reporterProfile: CurrentUser = currentUser && currentUser.role === 'reporter'
    ? currentUser
    : {
        id: 'REP-204',
        name: 'Sunita Sharma',
        email: 'rep@ngo.com',
        role: 'reporter',
        phone: '+91 98112 34567',
        location: { lat: 28.6300, lng: 77.3620, address: 'Sector 4 Community' }
      };

  return (
    <div className="rn-app-root">
      {/* Left-Side Dedicated Workspace Role Dock */}
      <LeftDockNavbar
        activeTab={activeTab}
        currentUser={currentUser}
        coordinatorSubTab={coordinatorSubTab}
        onCoordinatorSubTabChange={setCoordinatorSubTab}
        volunteerSubTab={volunteerSubTab}
        onVolunteerSubTabChange={setVolunteerSubTab}
        reporterSubTab={reporterSubTab}
        onReporterSubTabChange={setReporterSubTab}
        criticalIncidentCount={criticalCount}
        activeVolunteerCount={activeVolunteersCount}
        deployedAssetCount={76}
        onTabChange={setActiveTab}
        onSwitchRole={handleSwitchRole}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Top Floating Curved Notch Navbar (Cool Unique Style Restored) */}
      <CurvedNavbar
        activeTab={activeTab}
        currentUser={currentUser}
        onTabChange={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onSwitchRole={handleSwitchRole}
        onLogout={handleLogout}
        isModalOpen={isReportModalOpen}
      />

      {/* Main View Router with Smooth Page Transitions */}
      <main className="rn-main-viewport">
        <div key={activeTab} className="rn-page-transition-wrap">
          {/* VIEW 1: FIGMA HERO LANDING PAGE */}
          {activeTab === 'landing' && (
            <LandingPage
              onOpenDashboard={() => handleSwitchRole('coordinator')}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenVolunteerPortal={() => handleSwitchRole('volunteer')}
              onOpenReporterPortal={() => handleSwitchRole('reporter')}
              onOpenAuthModal={handleOpenAuth}
              needs={needs}
            />
          )}

          {/* VIEW 2: COORDINATOR DASHBOARD (HQ Crisis Command Hub) */}
          {activeTab === 'dashboard' && (
            <CoordinatorDashboard
              needs={needs}
              volunteers={volunteers}
              activeSubTab={coordinatorSubTab}
              onSubTabChange={setCoordinatorSubTab}
              onDispatchVolunteer={handleDispatchVolunteer}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onSwitchToLanding={() => setActiveTab('landing')}
              onSwitchRole={handleSwitchRole}
              onOpenAuthModal={() => handleOpenAuth('signin')}
            />
          )}

          {/* VIEW 3: VOLUNTEER PORTAL (Field Responder View - Clean & Uncluttered) */}
          {activeTab === 'volunteer' && (
            <div className="rn-subview-container">
              <VolunteerPortal
                currentVolunteer={volunteerProfile}
                assignedNeeds={needs.filter(n => n.assignedVolunteerId === volunteerProfile.id || (n.status === 'ASSIGNED' && !n.assignedVolunteerId))}
                unassignedNearbyNeeds={needs.filter(n => n.status === 'SUBMITTED')}
                activeSubTab={volunteerSubTab}
                onSubTabChange={setVolunteerSubTab}
                onUpdateStatus={handleVolunteerUpdateStatus}
                onToggleAvailability={handleToggleVolunteerAvailability}
                onClaimNeed={handleVolunteerClaimNeed}
                onSwitchToLanding={() => setActiveTab('landing')}
                onSwitchRole={handleSwitchRole}
                onOpenAuthModal={() => handleOpenAuth('signin')}
              />
            </div>
          )}

          {/* VIEW 4: REPORTER PORTAL (Civilian & Scout Reporting Hub) */}
          {activeTab === 'reporter' && (
            <div className="rn-subview-container">
              <ReporterPortal
                currentUser={reporterProfile}
                needs={needs}
                activeSubTab={reporterSubTab}
                onSubTabChange={setReporterSubTab}
                onSubmitNewReport={handleAddReport}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onSwitchToLanding={() => setActiveTab('landing')}
                onSwitchRole={handleSwitchRole}
                onOpenAuthModal={() => handleOpenAuth('signin')}
              />
            </div>
          )}
        </div>
      </main>

      {/* Auth & Role Selection Modal (Screenshots 2, 3, 4) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onReportWithoutSignin={() => setIsReportModalOpen(true)}
        initialMode={authModalMode}
        initialRole={authInitialRole}
      />

      {/* Global Community Report Modal */}
      <ReportNeedModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddReport}
      />
    </div>
  );
}
