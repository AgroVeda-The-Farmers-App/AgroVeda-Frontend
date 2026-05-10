import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import styles from "../styles/AdminDashboard.module.css";

const API   = "http://localhost:5000";
const TOKEN = () => localStorage.getItem("adminToken");

const COLORS_PIE  = ["#34d399","#10b981","#059669","#047857","#065f46","#6ee7b7"];
const COLORS_GENDER = ["#34d399","#f472b6","#a78bfa"];

const ax = (url) => axios.get(`${API}${url}`, {
  headers: { Authorization: `Bearer ${TOKEN()}` }
});

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({ label, value, icon, sub, color }) {
  return (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statTop}>
        <span className={styles.statIcon}>{icon}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
      <div className={styles.statValue}>{value ?? "—"}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#34d399" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard({ admin, onLogout }) {
  const [stats,      setStats]      = useState(null);
  const [byState,    setByState]    = useState([]);
  const [byProf,     setByProf]     = useState([]);
  const [byGender,   setByGender]   = useState([]);
  const [byLang,     setByLang]     = useState([]);
  const [signups,    setSignups]    = useState([]);
  const [users,      setUsers]      = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("overview");
  const [deleteId,   setDeleteId]   = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, st, pr, ge, la, sg] = await Promise.all([
        ax("/admin/stats"),
        ax("/admin/users-by-state"),
        ax("/admin/users-by-profession"),
        ax("/admin/users-by-gender"),
        ax("/admin/users-by-language"),
        ax("/admin/signups-over-time"),
      ]);
      setStats(s.data);
      setByState(st.data.slice(0, 10));
      setByProf(pr.data);
      setByGender(ge.data);
      setByLang(la.data);
      setSignups(sg.data);
    } catch { }
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await ax(`/admin/users?page=${page}&per_page=20&search=${encodeURIComponent(search)}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch { }
  }, [page, search]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN()}` }
      });
      setDeleteId(null);
      fetchUsers(); fetchAll();
    } catch { }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path d="M24 4C24 4 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 4 24 4Z" fill="#34d399" fillOpacity="0.9"/>
              <path d="M24 14C24 14 17 21 17 28C17 31.866 20.134 35 24 35" stroke="#0a0f0a" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className={styles.sidebarBrand}>Agroveda</span>
          </div>
          <div className={styles.sidebarAdminTag}>ADMIN</div>
        </div>

        <nav className={styles.sidebarNav}>
          {[
            { key: "overview", icon: "📊", label: "Overview" },
            { key: "charts",   icon: "📈", label: "Analytics" },
            { key: "users",    icon: "👥", label: "Users" },
          ].map(item => (
            <button key={item.key}
              className={`${styles.navItem} ${activeTab === item.key ? styles.navActive : ""}`}
              onClick={() => setActiveTab(item.key)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {admin?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.adminMeta}>
              <span className={styles.adminName}>{admin?.full_name}</span>
              <span className={styles.adminEmail}>{admin?.email}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>
              {activeTab === "overview" ? "Dashboard Overview" :
               activeTab === "charts"   ? "Analytics" : "User Management"}
            </h1>
            <p className={styles.pageSub}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </p>
          </div>
          <button className={styles.refreshBtn} onClick={() => { fetchAll(); fetchUsers(); }}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingCenter}>
            <div className={styles.loadingSpinner} />
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className={styles.overviewWrap}>
                {/* Stat cards */}
                <div className={styles.statsGrid}>
                  <StatCard label="Total Users"   value={stats?.total}      icon="👥" color="#34d399" sub="All registered farmers" />
                  <StatCard label="Today"         value={stats?.today}      icon="📅" color="#10b981" sub="New signups today" />
                  <StatCard label="This Week"     value={stats?.this_week}  icon="📆" color="#059669" sub="Last 7 days" />
                  <StatCard label="This Month"    value={stats?.this_month} icon="🗓️" color="#047857" sub="Last 30 days" />
                </div>

                {/* Signups line chart */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>📈 Signups — Last 30 Days</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={signups} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }}
                        tickFormatter={v => v.slice(5)} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="count" name="Signups"
                        stroke="#34d399" strokeWidth={2.5} dot={{ fill: "#34d399", r: 3 }}
                        activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent signups mini table */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <h3 className={styles.chartTitle}>🆕 Recent Signups</h3>
                    <button className={styles.viewAllBtn} onClick={() => setActiveTab("users")}>
                      View All →
                    </button>
                  </div>
                  <table className={styles.miniTable}>
                    <thead>
                      <tr>
                        <th>Name</th><th>Phone</th><th>Profession</th><th>Address</th><th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 8).map(u => (
                        <tr key={u.id}>
                          <td><span className={styles.userAvatar}>{u.full_name?.charAt(0)}</span>{u.full_name}</td>
                          <td>{u.phone_no || "—"}</td>
                          <td><span className={styles.profBadge}>{u.profession || "—"}</span></td>
                          <td>{u.address || "—"}</td>
                          <td>{u.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {activeTab === "charts" && (
              <div className={styles.chartsWrap}>
                <div className={styles.chartsGrid}>

                  {/* Users by state */}
                  <div className={`${styles.chartCard} ${styles.chartWide}`}>
                    <div className={styles.chartHeader}>
                      <h3 className={styles.chartTitle}>📍 Users by Location (Top 10)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={byState} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="state" tick={{ fill: "#6b7280", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Users" fill="#34d399" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Profession pie */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h3 className={styles.chartTitle}>💼 By Profession</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={byProf} dataKey="count" nameKey="profession"
                          cx="50%" cy="50%" outerRadius={85} label={({ profession, percent }) =>
                            `${profession} ${(percent * 100).toFixed(0)}%`}
                          labelLine={{ stroke: "#4b5563" }}>
                          {byProf.map((_, i) => <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />)}
                        </Pie>
                        <Tooltip formatter={(val, name) => [val, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gender donut */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h3 className={styles.chartTitle}>🧑 By Gender</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={byGender} dataKey="count" nameKey="gender"
                          cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                          label={({ gender, percent }) => `${gender} ${(percent*100).toFixed(0)}%`}
                          labelLine={{ stroke: "#4b5563" }}>
                          {byGender.map((_, i) => <Cell key={i} fill={COLORS_GENDER[i % COLORS_GENDER.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Language bar */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <h3 className={styles.chartTitle}>🌐 By Language</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={byLang} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
                        <YAxis type="category" dataKey="language" tick={{ fill: "#9ca3af", fontSize: 12 }} width={80} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Users" fill="#10b981" radius={[0,4,4,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === "users" && (
              <div className={styles.usersWrap}>
                <div className={styles.usersTopBar}>
                  <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input className={styles.searchInput} type="text"
                      placeholder="Search by name, phone or address..."
                      value={searchInput}
                      onChange={e => setSearchInput(e.target.value)} />
                    <button type="submit" className={styles.searchBtn}>Search</button>
                    {search && (
                      <button type="button" className={styles.clearBtn}
                        onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}>
                        ✕ Clear
                      </button>
                    )}
                  </form>
                  <span className={styles.totalCount}>{totalUsers} users total</span>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr>
                        <th>#</th><th>Name</th><th>Phone</th>
                        <th>Profession</th><th>Gender</th>
                        <th>Language</th><th>Address</th>
                        <th>Joined</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={9} className={styles.emptyRow}>No users found</td></tr>
                      ) : users.map((u, i) => (
                        <tr key={u.id} className={styles.userRow}>
                          <td className={styles.rowNum}>{(page - 1) * 20 + i + 1}</td>
                          <td>
                            <div className={styles.nameCell}>
                              <span className={styles.tableAvatar}>{u.full_name?.charAt(0)}</span>
                              {u.full_name}
                            </div>
                          </td>
                          <td>{u.phone_no || "—"}</td>
                          <td><span className={styles.profBadge}>{u.profession || "—"}</span></td>
                          <td>{u.gender || "—"}</td>
                          <td>
                            <span className={styles.langBadge}>
                              {u.language === "bn" ? "🇮🇳 Bengali" : "🇬🇧 English"}
                            </span>
                          </td>
                          <td className={styles.addressCell}>{u.address || "—"}</td>
                          <td>{u.created_at}</td>
                          <td>
                            <button className={styles.deleteBtn}
                              onClick={() => setDeleteId(u.id)}>
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Prev</button>
                  <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                  <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Delete User?</h3>
            <p className={styles.modalText}>This action cannot be undone. The user will be permanently removed.</p>
            <div className={styles.modalBtns}>
              <button className={styles.modalCancel} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className={styles.modalConfirm} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}