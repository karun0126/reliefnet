import React, { useState } from 'react';
import { NeedReport, CurrentUser } from '../types';
import { 
  CheckCircle, 
  MapPin, 
  Navigation, 
  Phone, 
  Shield, 
  CheckCircle2, 
  Users, 
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ExternalLink,
  Award,
  Check,
  Compass,
  FileText
} from 'lucide-react';

interface VolunteerPortalProps {
  currentVolunteer: CurrentUser;
  assignedNeeds: NeedReport[];
  unassignedNearbyNeeds: NeedReport[];
  onUpdateStatus: (needId: string, status: 'IN_PROGRESS' | 'RESOLVED') => void;
  onToggleAvailability: (volId: string) => void;
  onClaimNeed: (needId: string) => void;
  onSwitchToLanding: () => void;
  onSwitchRole: (role: 'coordinator' | 'volunteer' | 'reporter') => void;
  onOpenAuthModal: () => void;
  activeSubTab?: 'active_mission' | 'nearby_alerts' | 'history';
  onSubTabChange?: (tab: 'active_mission' | 'nearby_alerts' | 'history') => void;
}

export const VolunteerPortal: React.FC<VolunteerPortalProps> = ({
  currentVolunteer,
  assignedNeeds,
  unassignedNearbyNeeds,
  onUpdateStatus,
  onToggleAvailability,
  onClaimNeed,
  onSwitchToLanding,
  onSwitchRole,
  onOpenAuthModal,
  activeSubTab,
  onSubTabChange
}) => {
  const [internalTab, setInternalTab] = useState<'active_mission' | 'nearby_alerts' | 'history'>('active_mission');
  const activeTab = activeSubTab || internalTab;
  const setActiveTab = (tab: 'active_mission' | 'nearby_alerts' | 'history') => {
    setInternalTab(tab);
    onSubTabChange?.(tab);
  };

  // Always start cleanly from the top
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const [isAvailable, setIsAvailable] = useState(true);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'First Aid Trauma Pouch': true,
    'High-Visibility Rescue Vest': true,
    'VHF Tactical Radio (CH-4)': true,
    'GPS Offline Map Cached': false
  });

  const toggleChecklistItem = (item: string) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const activeMission = assignedNeeds.find(n => n.status !== 'RESOLVED');
  const completedMissions = assignedNeeds.filter(n => n.status === 'RESOLVED');

  return (
    <div className="rn-volunteer-portal-clean">
      {/* Volunteer Header Profile Card */}
      <div className="rn-vol-profile-banner">
        <div className="rn-vol-banner-left">
          <div className="rn-vol-avatar-circle">
            {currentVolunteer.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="rn-vol-meta-info">
            <div className="rn-vol-role-badge">CERTIFIED FIELD RESPONDER</div>
            <h2>{currentVolunteer.name}</h2>
            <div className="rn-vol-stats-inline">
              <span>⭐ {currentVolunteer.rating || 4.9} Rating</span>
              <span>•</span>
              <span>🛡️ {currentVolunteer.completedMissions || 42} Missions Completed</span>
              <span>•</span>
              <span>📍 {currentVolunteer.location?.address || 'Sector 4 Staging Depot'}</span>
              <span>•</span>
              <span>📡 Radius: {currentVolunteer.travelRadiusKm || 20}km</span>
            </div>

            <div className="rn-vol-skills-wrap">
              {(currentVolunteer.skills || ['First Aid', 'Water Rescue', 'Drone Pilot']).map(s => (
                <span key={s} className="rn-skill-pill-active">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rn-vol-banner-right">
          <span className="rn-duty-label">DUTY AVAILABILITY</span>
          <button
            type="button"
            className={`rn-duty-toggle-btn ${isAvailable ? 'is-available' : 'is-offline'}`}
            onClick={() => {
              setIsAvailable(!isAvailable);
              onToggleAvailability(currentVolunteer.id);
            }}
          >
            <span className="rn-duty-dot" />
            <span>{isAvailable ? 'AVAILABLE FOR DISPATCH' : 'OFF DUTY / RESTING'}</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="rn-vol-subtabs">
        <button
          type="button"
          className={`rn-vol-tab ${activeTab === 'active_mission' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('active_mission')}
        >
          <span>Current Active Mission</span>
          {activeMission && <span className="rn-tab-badge pulse-green">1 ACTIVE</span>}
        </button>

        <button
          type="button"
          className={`rn-vol-tab ${activeTab === 'nearby_alerts' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('nearby_alerts')}
        >
          <span>Nearby Emergency Alerts</span>
          <span className="rn-tab-badge">{unassignedNearbyNeeds.length}</span>
        </button>

        <button
          type="button"
          className={`rn-vol-tab ${activeTab === 'history' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span>Mission History &amp; Badges</span>
        </button>
      </div>

      {/* Main Subview */}
      <div className="rn-vol-body-container">
        {/* =========================================================
            TAB 1: ACTIVE MISSION SPOTLIGHT
            ========================================================= */}
        {activeTab === 'active_mission' && (
          <div className="rn-vol-active-view">
            {!activeMission ? (
              <div className="rn-no-active-mission-card">
                <CheckCircle2 size={48} color="#10b981" />
                <h3>No Dispatched Emergency Currently</h3>
                <p>
                  You are currently on active standby. When an emergency incident matches your certified skills within {currentVolunteer.travelRadiusKm || 20}km, HQ will dispatch you here instantly.
                </p>
                <button
                  type="button"
                  className="rn-auth-primary-btn"
                  onClick={() => setActiveTab('nearby_alerts')}
                >
                  <Navigation size={16} />
                  <span>Browse Nearby Ground Alerts ({unassignedNearbyNeeds.length})</span>
                </button>
              </div>
            ) : (
              <div className="rn-mission-spotlight-card">
                <div className="rn-spotlight-top">
                  <div className="rn-spotlight-badges">
                    <span className={`rn-urgency-pill urgency-${activeMission.urgency.toLowerCase()}`}>
                      {activeMission.urgency} PRIORITY
                    </span>
                    <span className="rn-spotlight-cat">{activeMission.category}</span>
                    <span className="rn-spotlight-id">Case #{activeMission.id}</span>
                  </div>
                  <span className="rn-spotlight-eta">TARGET ETA: {activeMission.targetEta || '< 15m'}</span>
                </div>

                <h3 className="rn-spotlight-title">{activeMission.title}</h3>
                <p className="rn-spotlight-desc">{activeMission.description}</p>

                {/* Location and Reporter Strip */}
                <div className="rn-spotlight-meta-grid">
                  <div className="rn-meta-box">
                    <MapPin size={18} color="#ef4444" />
                    <div>
                      <strong>Incident Location:</strong>
                      <p>{activeMission.location.address}</p>
                    </div>
                  </div>

                  <div className="rn-meta-box">
                    <Users size={18} color="#3b82f6" />
                    <div>
                      <strong>Stranded Civilians:</strong>
                      <p>{activeMission.peopleCount || '5-10 people'}</p>
                    </div>
                  </div>

                  <div className="rn-meta-box">
                    <Phone size={18} color="#10b981" />
                    <div>
                      <strong>Civilian Reporter Contact:</strong>
                      <p>{activeMission.reporterName || 'Ground Witness'} ({activeMission.reporterContact || '+91 98112 34567'})</p>
                    </div>
                  </div>
                </div>

                {/* Action Button Controls */}
                <div className="rn-spotlight-actions">
                  {activeMission.status === 'ASSIGNED' && (
                    <button
                      type="button"
                      className="rn-btn-start-nav"
                      onClick={() => onUpdateStatus(activeMission.id, 'IN_PROGRESS')}
                    >
                      <Navigation size={18} />
                      <span>Start Navigation / En Route to Scene</span>
                    </button>
                  )}

                  {activeMission.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      className="rn-btn-mark-resolved"
                      onClick={() => onUpdateStatus(activeMission.id, 'RESOLVED')}
                    >
                      <CheckCircle size={18} />
                      <span>Confirm Safe Evacuation / Mark Mission Resolved</span>
                    </button>
                  )}

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeMission.location.lat},${activeMission.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rn-btn-open-maps"
                  >
                    <ExternalLink size={16} />
                    <span>Open in GPS Navigation</span>
                  </a>

                  <a
                    href={`tel:${activeMission.reporterContact || '+919811234567'}`}
                    className="rn-btn-call-reporter"
                  >
                    <Phone size={16} />
                    <span>Call Civilian On-Scene</span>
                  </a>
                </div>
              </div>
            )}

            {/* Field Readiness Checklist */}
            <div className="rn-vol-checklist-card">
              <div className="rn-checklist-header">
                <Shield size={18} color="#10b981" />
                <h4>FIELD RESPONDER SAFETY PROTOCOL</h4>
              </div>
              <div className="rn-checklist-items">
                {Object.entries(checklist).map(([item, checked]) => (
                  <button
                    key={item}
                    type="button"
                    className={`rn-checklist-btn ${checked ? 'is-checked' : ''}`}
                    onClick={() => toggleChecklistItem(item)}
                  >
                    <div className="rn-chk-box">
                      {checked && <Check size={13} color="#ffffff" />}
                    </div>
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: NEARBY EMERGENCY ALERTS
            ========================================================= */}
        {activeTab === 'nearby_alerts' && (
          <div className="rn-vol-alerts-view">
            <div className="rn-alerts-intro">
              <h3>Live Ground Incidents Within Your Radius</h3>
              <p>These incidents require immediate assistance. You can claim and self-deploy to any alert.</p>
            </div>

            <div className="rn-alerts-grid">
              {unassignedNearbyNeeds.map(need => (
                <div key={need.id} className="rn-alert-card">
                  <div className="rn-alert-top">
                    <span className={`rn-urgency-pill urgency-${need.urgency.toLowerCase()}`}>
                      {need.urgency}
                    </span>
                    <span className="rn-alert-cat">{need.category}</span>
                    <span className="rn-alert-time">{need.reportedAt}</span>
                  </div>

                  <h4 className="rn-alert-title">{need.title}</h4>
                  <p className="rn-alert-desc">{need.description}</p>

                  <div className="rn-alert-loc">
                    <MapPin size={14} color="#ef4444" />
                    <span>{need.location.address}</span>
                  </div>

                  <div className="rn-alert-skills-row">
                    {need.requiredSkills.map(s => (
                      <span key={s} className="rn-req-skill-pill">{s}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="rn-btn-claim-alert"
                    onClick={() => onClaimNeed(need.id)}
                  >
                    <span>Accept Mission &amp; Deploy</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: HISTORY & BADGES
            ========================================================= */}
        {activeTab === 'history' && (
          <div className="rn-vol-history-view">
            <div className="rn-history-badges-row">
              <div className="rn-badge-card">
                <Award size={28} color="#10b981" />
                <h4>Swift Water Master</h4>
                <span>Completed 15+ water extractions</span>
              </div>
              <div className="rn-badge-card">
                <Shield size={28} color="#3b82f6" />
                <h4>Rapid First Responder</h4>
                <span>Average response time &lt; 12 mins</span>
              </div>
              <div className="rn-badge-card">
                <CheckCircle size={28} color="#d97706" />
                <h4>100% Mission Clearance</h4>
                <span>Zero casualties on assigned sectors</span>
              </div>
            </div>

            <div className="rn-resolved-history-list">
              <h3>Recently Resolved Missions</h3>
              {completedMissions.map(m => (
                <div key={m.id} className="rn-history-item">
                  <div className="rn-hist-icon">
                    <CheckCircle2 size={18} color="#10b981" />
                  </div>
                  <div className="rn-hist-info">
                    <h4>{m.title}</h4>
                    <span>{m.location.address} • Closed {m.reportedAt}</span>
                  </div>
                  <span className="rn-hist-status">RESOLVED</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
