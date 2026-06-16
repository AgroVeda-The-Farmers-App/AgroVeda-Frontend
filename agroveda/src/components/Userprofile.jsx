// import { useState, useEffect } from "react";
// import { database } from "../firebase";
// import { ref, onValue } from "firebase/database";
// import styles from "../styles/UserProfile.module.css";

// export default function UserProfile() {
//     const [user, setUser] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [motionStatus, setMotionStatus] = useState(null); // ← added

//     // Load logged-in user from localStorage
//     useEffect(() => {
//         const stored = localStorage.getItem("user");
//         setUser(stored ? JSON.parse(stored) : null);
//     }, []);

//     // Listen for motion status from Firebase  ← added
//     useEffect(() => {
//         const motionRef = ref(database, "motionStatus");
//         const unsubscribe = onValue(motionRef, (snapshot) => {
//             setMotionStatus(snapshot.val());
//         });
//         return () => unsubscribe();
//     }, []);

//     // Listen for alert/notification list from Firebase
//     useEffect(() => {
//         const notifRef = ref(database, "notifications");
//         const unsubscribe = onValue(notifRef, (snapshot) => {
//             const data = snapshot.val();
//             if (!data) {
//                 setMessages([]);
//                 return;
//             }
//             const list = Object.entries(data).map(([id, value]) => ({
//                 id,
//                 ...value,
//             }));
//             list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
//             setMessages(list);
//         });
//         return () => unsubscribe();
//     }, []);

//     const firstName = user?.full_name?.split(" ")[0] || "Farmer";
//     const initial = firstName.charAt(0).toUpperCase();
//     const formatTime = (ts) => {
//         if (!ts) return "—";
//         return new Date(ts).toLocaleString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     return (
//         <div className={styles.page}>
//             <div className={styles.header}>
//                 <div className={styles.avatarLarge}>{initial}</div>
//                 <div>
//                     <h1 className={styles.name}>{user?.full_name || "Farmer"}</h1>
//                     <p className={styles.email}>{user?.email || ""}</p>
//                 </div>
//             </div>

//             {/* ── Motion Status ── added block */}
//             <section className={styles.section}>
//                 <h2 className={styles.sectionTitle}>Motion Status</h2>
//                 {motionStatus ? (
//                     <div className={styles.row}>
//                         <div className={styles.dot} />
//                         <p className={styles.message}>
//                             {motionStatus.status || "—"}
//                         </p>
//                         <span className={styles.time}>
//                             {formatTime(motionStatus.timestamp)}
//                         </span>
//                     </div>
//                 ) : (
//                     <p className={styles.empty}>Waiting for motion data…</p>
//                 )}
//             </section>

//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import styles from "../styles/UserProfile.module.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [motionStatus, setMotionStatus] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, []);

  useEffect(() => {
    const motionRef = ref(database, "motionStatus");
    const unsubscribe = onValue(motionRef, (snapshot) => {
      setMotionStatus(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const notifRef = ref(database, "notifications");
    const unsubscribe = onValue(notifRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) { setMessages([]); return; }
      const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "Farmer";
  const initial = firstName.charAt(0).toUpperCase();

  const formatTime = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  };

  const formatDob = (dob) => {
    if (!dob) return "—";
    return new Date(dob).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const langMap = { en: "English", bn: "Bengali (বাংলা)" };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.avatarLarge}>{initial}</div>
        <div>
          <h1 className={styles.name}>{user?.full_name || "Farmer"}</h1>
          <p className={styles.sub}>
            {user?.phone_no ? `+91 ${user.phone_no}` : user?.email || ""}
          </p>
          <span className={styles.memberBadge}>Agroveda Member</span>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Date of birth</p>
          <p className={styles.infoVal}>{formatDob(user?.dob)}</p>
        </div>
        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Gender</p>
          <p className={styles.infoVal}>{user?.gender || "—"}</p>
        </div>
        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Language</p>
          <p className={styles.infoVal}>{langMap[user?.language] || user?.language || "—"}</p>
        </div>
        <div className={styles.infoCard}>
          <p className={styles.infoLabel}>Location</p>
          <p className={styles.infoVal}>{user?.address || "—"}</p>
        </div>
      </div>

      {/* ── Motion Status (original) ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Motion Status</h2>
        {motionStatus ? (
          <div className={styles.row}>
            <div className={styles.dot} />
            <p className={styles.message}>{motionStatus.status || "—"}</p>
            <span className={styles.time}>{formatTime(motionStatus.timestamp)}</span>
          </div>
        ) : (
          <p className={styles.empty}>Waiting for motion data…</p>
        )}
      </section>

    </div>
  );
}