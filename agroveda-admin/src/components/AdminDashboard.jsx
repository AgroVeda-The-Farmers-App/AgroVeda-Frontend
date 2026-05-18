import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import styles from "../styles/AdminDashboard.module.css";

const API   = "http://localhost:5000";
const TOKEN = () => localStorage.getItem("adminToken");

const GREEN_RAMP_DARK  = ["#22c55e","#1d9e75","#0f6e56","#085041","#04342c"];
const GREEN_RAMP_LIGHT = ["#16a34a","#15803d","#166534","#14532d","#052e16"];
const GENDER_COLORS_DARK  = ["#22c55e","#a78bfa","#fbbf24"];
const GENDER_COLORS_LIGHT = ["#16a34a","#7c3aed","#d97706"];

const ax = (url) =>
  axios.get(`${API}${url}`, { headers: { Authorization: `Bearer ${TOKEN()}` } });

/* ── Stat Card ── */
function StatCard({ label, value, icon, sub, delta, colorClass, iconClass }) {
  return (
    <div className={`${styles.statCard} ${styles[colorClass]}`}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        <div className={`${styles.statIconWrap} ${styles[iconClass]}`}>{icon}</div>
      </div>
      <div className={styles.statValue}>{value ?? "—"}</div>
      <div className={styles.statSub}>
        {sub}
        {delta && <span className={styles.statDelta}>{delta}</span>}
      </div>
    </div>
  );
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#22c55e", fontSize: "0.82rem" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ── Horizontal Bar ── */
function HBar({ name, pct, color }) {
  return (
    <div className={styles.hBarRow}>
      <div className={styles.hBarTop}>
        <span className={styles.hBarName}>{name}</span>
        <span className={styles.hBarPct}>{pct}%</span>
      </div>
      <div className={styles.hBarTrack}>
        <div className={styles.hBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function AdminDashboard({ admin, onLogout }) {
  const [stats,       setStats]       = useState(null);
  const [byState,     setByState]     = useState([]);
  const [byProf,      setByProf]      = useState([]);
  const [byGender,    setByGender]    = useState([]);
  const [byLang,      setByLang]      = useState([]);
  const [signups,     setSignups]     = useState([]);
  const [users,       setUsers]       = useState([]);
  const [totalUsers,  setTotalUsers]  = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("overview");
  const [deleteId,    setDeleteId]    = useState(null);
  const [dark,        setDark]        = useState(true);

  const GREEN_RAMP    = dark ? GREEN_RAMP_DARK  : GREEN_RAMP_LIGHT;
  const GENDER_COLORS = dark ? GENDER_COLORS_DARK : GENDER_COLORS_LIGHT;
  const chartGrid     = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
  const tooltipStyle  = dark
    ? { background:"#1a2318", border:"1px solid rgba(34,197,94,0.18)", borderRadius:8, color:"#e6ede6" }
    : { background:"#ffffff", border:"1px solid rgba(22,163,74,0.2)", borderRadius:8, color:"#111a0e" };
  const axisColor     = dark ? "#3f5440" : "#9ab094";
  const areaGradStop1 = dark ? 0.2 : 0.15;

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
    } catch {}
    setLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await ax(`/admin/users?page=${page}&per_page=20&search=${encodeURIComponent(search)}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.total);
      setTotalPages(res.data.total_pages);
    } catch {}
  }, [page, search]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      setDeleteId(null);
      fetchUsers(); fetchAll();
    } catch {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const tabs = [
    { key: "overview", icon: "📊", label: "Overview" },
    { key: "charts",   icon: "📈", label: "Analytics" },
    { key: "users",    icon: "👥", label: "Users" },
  ];

  const pageTitles = { overview: "Dashboard overview", charts: "Analytics", users: "User management" };

  return (
    <div className={styles.page}>
      {/* ── SIDEBAR ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarLogo}>
            <div className={styles.sidebarLogoIcon}>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C24 4 10 16 10 28C10 35.732 16.268 42 24 42C31.732 42 38 35.732 38 28C38 16 24 4 24 4Z" fill="#22c55e"/>
                <path d="M24 14C24 14 17 21 17 28C17 31.866 20.134 35 24 35" stroke="#0b0e0b" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className={styles.sidebarBrand}>Agroveda</span>
          </div>
          <div className={styles.sidebarAdminTag}>ADMIN</div>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>Main</div>
          {tabs.map(t => (
            <button key={t.key}
              className={`${styles.navItem} ${activeTab === t.key ? styles.navActive : ""}`}
              onClick={() => setActiveTab(t.key)}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
          <div className={styles.navSection}>System</div>
          <button className={styles.navItem}><span>⚙️</span><span>Settings</span></button>
          <button className={styles.navItem}><span>🔔</span><span>Alerts</span></button>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              {admin?.full_name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.adminMeta}>
              <span className={styles.adminName}>{admin?.full_name}</span>
              <span className={styles.adminRole}>Super admin</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>{pageTitles[activeTab]}</h1>
            <p className={styles.pageSub}>
              {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.themeToggle}
              onClick={() => setDark(d => !d)}
              aria-label="Toggle light/dark mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <button className={styles.btnOutline}>⬇ Export</button>
            <button className={styles.btnGreen} onClick={() => { fetchAll(); fetchUsers(); }}>↻ Refresh</button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingCenter}>
            <div className={styles.loadingSpinner} />
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <>
                <div className={styles.statsGrid}>
                  <StatCard label="Total users"  value={stats?.total?.toLocaleString()}      colorClass="colorGreen"  iconClass="g" icon="👥" sub="All registered farmers" />
                  <StatCard label="Today"        value={stats?.today}                         colorClass="colorViolet" iconClass="v" icon="📅" sub="New signups" delta="+12%" />
                  <StatCard label="This week"    value={stats?.this_week?.toLocaleString()}   colorClass="colorAmber"  iconClass="a" icon="📆" sub="Last 7 days" delta="+8%" />
                  <StatCard label="This month"   value={stats?.this_month?.toLocaleString()}  colorClass="colorRed"    iconClass="r" icon="🗓️" sub="Last 30 days" />
                </div>

                <div className={styles.chartsGrid}>
                  {/* Signups area chart */}
                  <div className={`${styles.chartCard} ${styles.chartWide}`}>
                    <div className={styles.chartHeader}>
                      <div>
                        <div className={styles.chartTitle}>Signups — last 30 days</div>
                        <div className={styles.chartSub}>Daily new user registrations</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={signups} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="sgGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2}/>
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                        <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                        <YAxis tick={{ fill: axisColor, fontSize: 10 }} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="count" name="Signups"
                          stroke="#22c55e" strokeWidth={2}
                          fill="url(#sgGrad)"
                          dot={false} activeDot={{ r: 4, fill: "#22c55e" }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Users by state bar */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <div>
                        <div className={styles.chartTitle}>Users by state</div>
                        <div className={styles.chartSub}>Top 6 locations</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={byState.slice(0,6)} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                        <XAxis dataKey="state" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: axisColor, fontSize: 10 }} allowDecimals={false} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(34,197,94,0.06)" }} />
                        <Bar dataKey="count" name="Users" radius={[4,4,0,0]}>
                          {byState.slice(0,6).map((_, i) => (
                            <Cell key={i} fill={GREEN_RAMP[Math.min(i, GREEN_RAMP.length-1)]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gender donut */}
                  <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                      <div>
                        <div className={styles.chartTitle}>By gender</div>
                        <div className={styles.chartSub}>User gender distribution</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={byGender} dataKey="count" nameKey="gender"
                          cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                          strokeWidth={0}>
                          {byGender.map((_, i) => (
                            <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v, n]} contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ color: "#7a9478", fontSize: "12px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent signups */}
                <div className={styles.miniTableCard}>
                  <div className={styles.miniTableHead}>
                    <div className={styles.miniTableTitle}>Recent signups</div>
                    <button className={styles.viewAllBtn} onClick={() => setActiveTab("users")}>View all →</button>
                  </div>
                  <table className={styles.miniTable}>
                    <thead>
                      <tr><th>Name</th><th>Phone</th><th>Profession</th><th>Address</th><th>Joined</th></tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 6).map(u => (
                        <tr key={u.id}>
                          <td><div className={styles.nameCell}><span className={styles.tableAvatar}>{u.full_name?.charAt(0)}</span>{u.full_name}</div></td>
                          <td>{u.phone_no || "—"}</td>
                          <td><span className={styles.badgeGreen}>{u.profession || "—"}</span></td>
                          <td>{u.address || "—"}</td>
                          <td>{u.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ── ANALYTICS ── */}
            {activeTab === "charts" && (
              <div className={styles.chartsGrid}>
                {/* State bar wide */}
                <div className={`${styles.chartCard} ${styles.chartWide}`}>
                  <div className={styles.chartHeader}>
                    <div>
                      <div className={styles.chartTitle}>Users by location — top 10 states</div>
                      <div className={styles.chartSub}>Registered farmer count per state</div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={byState} margin={{ top: 5, right: 10, left: -20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
                      <XAxis dataKey="state" tick={{ fill: axisColor, fontSize: 10 }} angle={-30} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: axisColor, fontSize: 10 }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(34,197,94,0.06)" }} />
                      <Bar dataKey="count" name="Users" radius={[4,4,0,0]}>
                        {byState.map((_, i) => (
                          <Cell key={i} fill={GREEN_RAMP[Math.min(i, GREEN_RAMP.length-1)]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Profession horizontal bars */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <div>
                      <div className={styles.chartTitle}>By profession</div>
                      <div className={styles.chartSub}>User profession breakdown</div>
                    </div>
                  </div>
                  <div className={styles.hBars}>
                    {byProf.map((p, i) => {
                      const total = byProf.reduce((s, x) => s + x.count, 0);
                      const pct = total ? Math.round((p.count / total) * 100) : 0;
                      const colors = ["#22c55e","#a78bfa","#fbbf24","#6b7280"];
                      return <HBar key={i} name={p.profession} pct={pct} color={colors[i % colors.length]} />;
                    })}
                  </div>
                </div>

                {/* Language horizontal bars */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <div>
                      <div className={styles.chartTitle}>By language</div>
                      <div className={styles.chartSub}>Preferred app language</div>
                    </div>
                  </div>
                  <div className={styles.hBars}>
                    {byLang.map((l, i) => {
                      const total = byLang.reduce((s, x) => s + x.count, 0);
                      const pct = total ? Math.round((l.count / total) * 100) : 0;
                      const colors = ["#22c55e","#a78bfa"];
                      return <HBar key={i} name={l.language === "bn" ? "Bengali" : "English"} pct={pct} color={colors[i % colors.length]} />;
                    })}
                  </div>
                </div>

                {/* Gender donut */}
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}>
                    <div>
                      <div className={styles.chartTitle}>By gender</div>
                      <div className={styles.chartSub}>Full gender breakdown</div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={byGender} dataKey="count" nameKey="gender"
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={0}
                        label={({ gender, percent }) => `${gender} ${Math.round(percent*100)}%`}
                        labelLine={{ stroke: "#1e2b1f" }}>
                        {byGender.map((_, i) => (
                          <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {activeTab === "users" && (
              <div className={styles.usersWrap}>
                <div className={styles.usersTopBar}>
                  <form onSubmit={handleSearch} style={{ display:"flex", gap:8, flex:1, maxWidth:400 }}>
                    <div className={styles.searchRow}>
                      <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#3f5440" strokeWidth="1.5"/><path d="M12.5 12.5L16 16" stroke="#3f5440" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <input className={styles.searchInput} type="text"
                        placeholder="Search by name, phone or address..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)} />
                    </div>
                    <button type="submit" className={styles.searchBtn}>Search</button>
                    {search && (
                      <button type="button" className={styles.clearBtn}
                        onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}>
                        ✕
                      </button>
                    )}
                  </form>
                  <span className={styles.totalCount}>{totalUsers.toLocaleString()} users total</span>
                </div>

                <div className={styles.tableWrap}>
                  <table className={styles.usersTable}>
                    <thead>
                      <tr><th>#</th><th>Name</th><th>Phone</th><th>Profession</th><th>Gender</th><th>Language</th><th>Address</th><th>Joined</th><th></th></tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={9} className={styles.emptyRow}>No users found</td></tr>
                      ) : users.map((u, i) => (
                        <tr key={u.id} className={styles.userRow}>
                          <td className={styles.rowNum}>{(page-1)*20+i+1}</td>
                          <td><div className={styles.nameCell}><span className={styles.tableAvatar}>{u.full_name?.charAt(0)}</span>{u.full_name}</div></td>
                          <td>{u.phone_no || "—"}</td>
                          <td><span className={styles.badgeGreen}>{u.profession || "—"}</span></td>
                          <td>{u.gender || "—"}</td>
                          <td><span className={styles.badgeViolet}>{u.language === "bn" ? "Bengali" : "English"}</span></td>
                          <td className={styles.addressCell}>{u.address || "—"}</td>
                          <td>{u.created_at}</td>
                          <td>
                            <button className={styles.deleteBtn} onClick={() => setDeleteId(u.id)}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.pagination}>
                  <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}>← Prev</button>
                  <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                  <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}>Next →</button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── DELETE MODAL ── */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3 className={styles.modalTitle}>Delete user?</h3>
            <p className={styles.modalText}>This action cannot be undone. The user will be permanently removed from the platform.</p>
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