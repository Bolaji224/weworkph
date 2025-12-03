import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
    functional: true,
  });

  useEffect(() => {
    const consent = sessionStorage.getItem("cookie_consent");
    if (!consent) setOpen(true);
  }, []);

  const acceptAll = () => {
    sessionStorage.setItem("cookie_consent", "accepted");
    sessionStorage.setItem("analytics_allowed", "true");
    sessionStorage.setItem("marketing_allowed", "true");
    sessionStorage.setItem("functional_allowed", "true");
    setOpen(false);
  };

  const rejectAll = () => {
    sessionStorage.setItem("cookie_consent", "rejected");
    sessionStorage.setItem("analytics_allowed", "false");
    sessionStorage.setItem("marketing_allowed", "false");
    sessionStorage.setItem("functional_allowed", "false");
    setOpen(false);
  };

  const savePreferences = () => {
    sessionStorage.setItem("cookie_consent", "custom");
    sessionStorage.setItem("analytics_allowed", String(preferences.analytics));
    sessionStorage.setItem("marketing_allowed", String(preferences.marketing));
    sessionStorage.setItem("functional_allowed", String(preferences.functional));
    setShowPrefs(false);
  };

  if (!open) return null;

  return (
    <>
      <div style={styles.banner}>
        <div style={styles.content}>
          <div style={styles.textSection}>
            <h2 style={styles.title}>We value your privacy</h2>
            <p style={styles.description}>
              We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.{" "}
              <a href="#" style={styles.link}>Cookie Policy</a>
            </p>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              style={styles.customiseBtn} 
              onClick={() => setShowPrefs(!showPrefs)}
            >
              Customise
            </button>
            <button style={styles.rejectBtn} onClick={rejectAll}>
              Reject All
            </button>
            <button style={styles.acceptBtn} onClick={acceptAll}>
              Accept All
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPrefs && (
        <div style={styles.modalOverlay} onClick={() => setShowPrefs(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Cookie Preferences</h3>
              <button 
                style={styles.closeBtn} 
                onClick={() => setShowPrefs(false)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  disabled
                  style={styles.checkbox}
                />
                <div>
                  <strong>Functional Cookies</strong>
                  <p style={styles.checkboxDesc}>Required for the site to work (always enabled)</p>
                </div>
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  style={styles.checkbox}
                />
                <div>
                  <strong>Analytics Cookies</strong>
                  <p style={styles.checkboxDesc}>Help us understand how visitors interact with our website</p>
                </div>
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  style={styles.checkbox}
                />
                <div>
                  <strong>Marketing Cookies</strong>
                  <p style={styles.checkboxDesc}>Used to deliver personalized advertisements</p>
                </div>
              </label>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.saveBtn} onClick={savePreferences}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  banner: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    background: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: 9999,
    padding: "20px 40px",
  } as React.CSSProperties,

  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
  } as React.CSSProperties,

  textSection: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,

  title: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#000",
  } as React.CSSProperties,

  description: {
    fontSize: "14px",
    lineHeight: "1.5",
    margin: 0,
    color: "#4a4a4a",
  } as React.CSSProperties,

  link: {
    color: "#0d7f4f",
    textDecoration: "underline",
  } as React.CSSProperties,

  buttonGroup: {
    display: "flex",
    gap: "12px",
    flexShrink: 0,
  } as React.CSSProperties,

  customiseBtn: {
    padding: "10px 24px",
    background: "#ffffff",
    border: "2px solid #0d7f4f",
    color: "#0d7f4f",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  } as React.CSSProperties,

  rejectBtn: {
    padding: "10px 24px",
    background: "#0d7f4f",
    border: "2px solid #0d7f4f",
    color: "#ffffff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  } as React.CSSProperties,

  acceptBtn: {
    padding: "10px 24px",
    background: "#0d7f4f",
    border: "2px solid #0d7f4f",
    color: "#ffffff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  } as React.CSSProperties,

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    padding: "20px",
  } as React.CSSProperties,

  modal: {
    background: "#ffffff",
    borderRadius: "8px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "80vh",
    overflow: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  } as React.CSSProperties,

  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as React.CSSProperties,

  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  } as React.CSSProperties,

  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    color: "#666",
    padding: 0,
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,

  modalBody: {
    padding: "24px",
  } as React.CSSProperties,

  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "20px",
    cursor: "pointer",
  } as React.CSSProperties,

  checkbox: {
    marginTop: "3px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  } as React.CSSProperties,

  checkboxDesc: {
    fontSize: "13px",
    color: "#666",
    margin: "4px 0 0 0",
  } as React.CSSProperties,

  modalFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "flex-end",
  } as React.CSSProperties,

  saveBtn: {
    padding: "10px 32px",
    background: "#0d7f4f",
    border: "none",
    color: "#ffffff",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  } as React.CSSProperties,
};