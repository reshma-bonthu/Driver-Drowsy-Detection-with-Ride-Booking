import React from 'react';
import { useNavigate } from 'react-router-dom';

function RoleSelectionPage() {
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    navigate(`/login/${selectedRole}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <h2 style={styles.title}>Choose Your Role</h2>
        <div style={styles.buttonContainer}>
          <div style={{ ...styles.roleCard, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleRoleSelection('driver')}>
            <img src="https://em-content.zobj.net/source/microsoft-teams/363/automobile_1f697.png" alt="Driver Car" style={{ ...styles.icon, marginBottom: '8px' }} />
            <p style={styles.roleText}>Driver</p>
          </div>

          <div style={{ ...styles.roleCard, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleRoleSelection('user')}>
            <img src="https://em-content.zobj.net/source/microsoft-teams/363/person_1f9d1.png" alt="User" style={{ ...styles.icon, marginBottom: '8px' }} />
            <p style={styles.roleText}>User</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: `url('/cars-bg.avif') no-repeat center center fixed`,
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
    fontFamily: 'Arial, sans-serif',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15), inset 0 2px 10px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: '24px',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '25px',
    justifyContent: 'center',
  },
  roleCard: {
    cursor: 'pointer',
    width: '130px',
    height: '130px',
    borderRadius: '10px',
    border: '2px solid #eee',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  },
  icon: {
    height: '80px',
    width: '80px',
  },
  roleText: {
    fontSize: '18px',
    marginTop: '5px',
  },
};

export default RoleSelectionPage;
