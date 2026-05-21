import { useState, useRef, useEffect } from "react";
import styles from "../styles/SupportBot.module.css";
import axios from "axios";



const API = "http://localhost:5000";
const TOKEN = () => localStorage.getItem("token");

const ISSUES = [
    { key: "website", icon: "⚠️", label: "Website not working" },
    { key: "helpline", icon: "📞", label: "Helpline & contact authority" },
    { key: "yield", icon: "📊", label: "Yield predictor not working" },
    { key: "weather", icon: "🌦️", label: "Weather alerts not showing" },
    { key: "account", icon: "👤", label: "Account & login issues" },
];

const ANSWERS = {
    website: `Sorry to hear that! Please try the following steps:

1. Clear your browser cache and cookies
2. Try a different browser (Chrome or Firefox)
3. Check your internet connection
4. Disable any VPN or ad-blocker

If the issue persists, our team has been notified and will fix it within 2–4 hours. Ticket #AGR-2841 has been raised for you.`,

    helpline: `You can reach our support team through these channels:

📞 Helpline: 1800-XXX-XXXX (Toll Free, Mon–Sat 9am–6pm)
📧 Email: support@agroveda.com

For urgent farming emergencies, the Kisan Call Centre is available 24×7 at 1551.`,

    yield: `We're aware of an intermittent issue with the Yield Predictor. Here's what to check:

1. Ensure all required fields are filled (crop, land size, season)
2. Make sure your location is set correctly
3. Try refreshing the page and submitting again

Our AI team has been alerted. Expected fix: within 1 hour. Your complaint ID: #YP-5512.`,

    weather: `Weather data requires location access to work. Please:

1. Allow location permission in your browser/app settings
2. Make sure your pincode is saved in your profile
3. Weather updates refresh every 30 minutes — please wait a moment

If alerts are still missing, your area may have limited IMD coverage. We're working to expand it.`,

    account: `For account or login problems:

1. Use 'Forgot Password' on the login page to reset
2. Check that your phone number is entered correctly
3. OTPs expire in 10 minutes — request a fresh one if needed

If you're locked out, email us at accounts@agroveda.com with your registered phone number and we'll restore access within 24 hours.`,
};

function getTime() {
    return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function SupportBot({ userName = "" }) {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState("issues"); // "issues" | "typing" | "answered"
    const [selected, setSelected] = useState(null);
    const [hasNew, setHasNew] = useState(true);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [phase, selected]);

    const handleIssue = async (issue) => {
        setSelected(issue);
        setPhase("typing");

        try {
            await axios.post(
                `${API}/support-tickets`,
                {
                    issue_key: issue.key,
                    issue_label: issue.label,
                    bot_reply: ANSWERS[issue.key],
                },
                {
                    headers: {
                        Authorization: `Bearer ${TOKEN()}`
                    }
                }
            );
        } catch (err) {
            console.error("Failed to save support ticket:", err);
        }

        setTimeout(() => {
            setPhase("answered");
        }, 1500);
    };

    const reset = () => {
        setSelected(null);
        setPhase("issues");
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className={styles.fabWrap}>
                {open && (
                    <div className={styles.panel} role="dialog" aria-label="Agroveda support chat">
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerLeft}>
                                <div className={styles.headerAvatar}>🎧</div>
                                <div>
                                    <div className={styles.headerName}>Agroveda Support</div>
                                    <div className={styles.headerStatus}>
                                        <div className={styles.statusDot} />
                                        Online · Replies instantly
                                    </div>
                                </div>
                            </div>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setOpen(false)}
                                aria-label="Close chat"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className={styles.body} ref={bodyRef}>

                            {/* Bot greeting */}
                            <div className={`${styles.msg} ${styles.bot}`}>
                                <div className={styles.msgAvatar}>🎧</div>
                                <div className={styles.msgBubble}>
                                    Namaste! 🌱 I'm Agroveda's support assistant. Please select the issue you're facing and I'll help you right away.
                                </div>
                            </div>

                            {/* Issue buttons */}
                            {phase === "issues" && (
                                <div className={styles.issuesGrid}>
                                    {ISSUES.map((issue) => (
                                        <button
                                            key={issue.key}
                                            className={styles.issueBtn}
                                            onClick={() => handleIssue(issue)}
                                        >
                                            <span className={styles.issueIcon}>{issue.icon}</span>
                                            {issue.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* User message */}
                            {(phase === "typing" || phase === "answered") && selected && (
                                <div className={`${styles.msg} ${styles.user}`}>
                                    <div className={styles.msgBubble}>{selected.label}</div>
                                    <div className={styles.msgAvatarUser}>
                                        {userName ? userName.charAt(0).toUpperCase() : "👤"}
                                    </div>
                                </div>
                            )}

                            {/* Typing indicator */}
                            {phase === "typing" && (
                                <div className={`${styles.msg} ${styles.bot}`}>
                                    <div className={styles.msgAvatar}>🎧</div>
                                    <div className={styles.typing}>
                                        <span /><span /><span />
                                    </div>
                                </div>
                            )}

                            {/* Bot answer */}
                            {phase === "answered" && selected && (
                                <>
                                    <div className={`${styles.msg} ${styles.bot}`}>
                                        <div className={styles.msgAvatar}>🎧</div>
                                        <div className={styles.msgBubble} style={{ whiteSpace: "pre-line" }}>
                                            {ANSWERS[selected.key]}
                                        </div>
                                    </div>
                                    <div className={styles.resolvedRow}>
                                        <div className={styles.resolvedBadge}>
                                            ✅ Issue logged · Our team will follow up
                                        </div>
                                        <button className={styles.resetBtn} onClick={reset}>
                                            Report another issue
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className={styles.footerNote}>
                            Powered by Agroveda · All queries are recorded
                        </div>
                    </div>
                )}

                <button
                    className={styles.fab}
                    onClick={() => { setOpen((o) => !o); setHasNew(false); }}
                    aria-label="Open support chat"
                >
                    {open ? "✕" : "💬"}
                    {hasNew && !open && <div className={styles.fabBadge}>1</div>}
                </button>
            </div>
        </>
    );
}