"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { RepairTicketCopy } from "./repair-ticket-print";
import {
  Activity,
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  FileText,
  HardDrive,
  LayoutDashboard,
  Leaf,
  LoaderCircle,
  Menu,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
  Wifi,
  Wrench,
  X,
} from "lucide-react";

type Employee = {
  id: number;
  name: string;
  office: string;
  position: string;
  email: string | null;
};
type RequestTicket = {
  id: number;
  employeeId: number;
  employeeName: string;
  office: string;
  position: string;
  requestedAt: string;
  issue: string;
  category: string;
  deviceKind: string;
  brand: string | null;
  model: string | null;
  description: string;
  initialAction: string;
  resolvedAction: string;
  action: string;
  technician: string;
  priority: string;
  status: string;
  resolvedAt: string | null;
};
type Data = {
  employees: Employee[];
  tickets: RequestTicket[];
  demo: boolean;
  agency: string;
  headerGovernment: string;
  headerDepartment: string;
  headerAgency: string;
  headerAddress: string;
  headerEmail: string;
  headerWebsite: string;
  ticketTitle: string;
  itPersonnelName: string;
  itPersonnelPosition: string;
};
type View = "Dashboard" | "Requests" | "Employees" | "Analytics" | "Settings";
const statusList = ["Pending", "In progress", "Resolved", "Cancelled"];
const offices = [
  "Administrative Division",
  "Finance Division",
  "Office of the Executive Director",
  "Planning Division",
  "Research Division",
  "Technical Assistance Division",
];
const colors = ["#168361", "#e6aa35", "#628ed2", "#b1bbc7"];
const formatDate = (date: string | Date, short = false) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    ...(short ? {} : { year: "numeric" }),
  });
const ticketNumber = (t: RequestTicket) =>
  `IT-${new Date(t.requestedAt).getFullYear()}-${String(t.id).padStart(4, "0")}`;
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
const dateInput = (value?: string) => {
  const d = value ? new Date(value) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className={`brand ${small ? "small" : ""}`}>
      <Image
        className="brand-logo"
        src="/philfida-logo.png"
        alt=""
        width={64}
        height={64}
      />
      <div>
        <strong>
          PhilFIDA<span className="brand-dot">.</span>
        </strong>
        <small>IT TICKETING SYSTEM</small>
      </div>
    </div>
  );
}
function Status({ status }: { status: string }) {
  return (
    <span className={`status ${status.toLowerCase().replace(" ", "-")}`}>
      <i />
      {status}
    </span>
  );
}
function Sparkline({
  variant = 0,
  color = "#168361",
}: {
  variant?: number;
  color?: string;
}) {
  const paths = [
    "0,28 9,26 18,30 27,17 36,20 45,13 54,19 63,10 72,13 81,3",
    "0,20 9,15 18,21 27,12 36,17 45,23 54,18 63,25 72,20 81,27",
    "0,28 9,21 18,25 27,13 36,16 45,12 54,20 63,15 72,7 81,11",
    "0,28 9,25 18,20 27,24 36,14 45,18 54,11 63,14 72,4 81,1",
  ];
  return (
    <svg className="sparkline" viewBox="0 0 84 38" fill="none">
      <polyline
        points={paths[variant]}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function WelcomeArt() {
  return (
    <svg
      className="welcome-art"
      width="244"
      height="150"
      viewBox="0 0 244 150"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="143" cy="83" r="67" fill="#dceee5" />
      <circle cx="143" cy="83" r="52" stroke="#bfdccd" strokeDasharray="4 5" />
      <path d="M40 126h178" stroke="#bad8c9" />
      <rect
        x="80"
        y="31"
        width="116"
        height="80"
        rx="8"
        fill="white"
        stroke="#6eaa8e"
        strokeWidth="1.5"
      />
      <path d="M81 44h114" stroke="#cee2d6" />
      <circle cx="89" cy="38" r="2" fill="#81b096" />
      <circle cx="96" cy="38" r="2" fill="#bdd8c9" />
      <circle cx="103" cy="38" r="2" fill="#bdd8c9" />
      <path
        d="M126 112v13m23-13v13m-32 1h42"
        stroke="#6eaa8e"
        strokeWidth="2"
      />
      <rect x="92" y="55" width="32" height="43" rx="3" fill="#edf5ef" />
      <path
        d="m101 69 5 5 10-12"
        stroke="#589578"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M99 83h17m-17 6h12m20-29h51m-51 10h38m-38 10h45m-45 10h28"
        stroke="#b6d4c2"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="175"
        y="79"
        width="35"
        height="42"
        rx="5"
        fill="#f9fcfa"
        stroke="#8bb89f"
      />
      <path
        d="m185 94 5 5 10-11"
        stroke="#21835c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M184 109h17"
        stroke="#b6d4c2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M61 126v-23m0 10c-14-1-17-12-13-18 10 0 15 9 13 18Zm1-8c-1-12 6-21 14-19 1 11-5 17-14 19Z"
        fill="#a8cbb6"
        stroke="#79aa8d"
      />
      <path d="M52 114h19l-3 12H55l-3-12Z" fill="#e4eae2" stroke="#a9bfab" />
      <path d="m203 33 2-6 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#7fb69a" />
      <circle cx="61" cy="58" r="4" stroke="#a4c6b2" />
      <path d="M219 68h6m-3-3v6" stroke="#8ab599" />
    </svg>
  );
}

export default function Workspace({
  initialWelcome = false,
}: {
  initialWelcome?: boolean;
}) {
  const [data, setData] = useState<Data>({
    employees: [],
    tickets: [],
    demo: false,
    agency: "PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY",
    headerGovernment: "Republic of the Philippines",
    headerDepartment: "Department of Agriculture",
    headerAgency: "PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY",
    headerAddress: "Purok 1A, Pigdaulan, Butuan City",
    headerEmail: "robutuan@philfida.da.gov.ph",
    headerWebsite: "www.philfida.da.gov.ph",
    ticketTitle: "REPAIR REQUEST TICKET",
    itPersonnelName: "IT Personnel",
    itPersonnelPosition: "IT Personnel",
  });
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);
  const [view, setView] = useState<View>("Dashboard");
  const [range, setRange] = useState("month");
  const [query, setQuery] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [filter, setFilter] = useState("All requests");
  const [officeFilter, setOfficeFilter] = useState("All offices");
  const [page, setPage] = useState(1);
  const [ticketModal, setTicketModal] = useState<RequestTicket | "new" | null>(
    null,
  );
  const [employeeModal, setEmployeeModal] = useState<Employee | "new" | null>(
    null,
  );
  const [help, setHelp] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const [welcomeOnly, setWelcomeOnly] = useState(initialWelcome);
  const [toast, setToast] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [printTicket, setPrintTicket] = useState<RequestTicket | null>(null);
  const [printAnalytics, setPrintAnalytics] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const notify = useCallback((message: string) => setToast(message), []);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/workspace", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setData(result);
      setConnected(true);
      setLastSync(new Date());
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const initial = window.setTimeout(() => {
      void refresh();
    }, 0);
    const id = window.setInterval(refresh, 5000);
    const focus = () => {
      void refresh();
    };
    window.addEventListener("focus", focus);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(id);
      window.removeEventListener("focus", focus);
    };
  }, [refresh]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setTicketModal(null);
        setEmployeeModal(null);
        setHelp(false);
        setNotifications(false);
        setConfirmClear(false);
        setMobileNav(false);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    const after = () => {
      setPrintTicket(null);
      setPrintAnalytics(false);
    };
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);
  const navigate = (next: View) => {
    setView(next);
    setQuery("");
    setFilter("All requests");
    setOfficeFilter("All offices");
    setGlobalQuery("");
    setMobileNav(false);
    setWelcomeOnly(false);
  };
  const printRequest = (t: RequestTicket) => {
    setPrintTicket(t);
    setPrintAnalytics(false);
    setTimeout(async () => {
      await document.fonts.load('11pt "Repair Form"');
      await document.fonts.load('bold 9pt "Repair Form"');
      await document.fonts.load('italic 11pt "Repair Form"');
      window.print();
    }, 150);
  };
  const printReport = () => {
    setPrintTicket(null);
    setPrintAnalytics(true);
    setTimeout(() => window.print(), 150);
  };
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (range === "week" ? 6 : 29));
    return d;
  }, [range]);
  const periodTickets = useMemo(
    () => data.tickets.filter((t) => new Date(t.requestedAt) >= cutoff),
    [data.tickets, cutoff],
  );
  const counts = {
    total: periodTickets.length,
    pending: periodTickets.filter((t) => t.status === "Pending").length,
    progress: periodTickets.filter((t) => t.status === "In progress").length,
    resolved: periodTickets.filter((t) => t.status === "Resolved").length,
  };
  const allPending = data.tickets.filter((t) => t.status === "Pending").length;
  const rate = counts.total
    ? Math.round((counts.resolved / counts.total) * 100)
    : 0;
  const filtered = data.tickets.filter(
    (t) =>
      (filter === "All requests" || t.status === filter) &&
      (officeFilter === "All offices" || t.office === officeFilter) &&
      `${ticketNumber(t)} ${t.employeeName} ${t.office} ${t.issue} ${t.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const requestPages = Math.max(1, Math.ceil(filtered.length / 8));
  const requestPage = Math.min(page, requestPages);
  const shownTickets = filtered.slice((requestPage - 1) * 8, requestPage * 8);
  const filteredEmployees = data.employees.filter(
    (e) =>
      `${e.name} ${e.office} ${e.position}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (officeFilter === "All offices" || e.office === officeFilter),
  );
  const employeePages = Math.max(1, Math.ceil(filteredEmployees.length / 10));
  const employeePage = Math.min(page, employeePages);
  const globalResults = globalQuery.trim()
    ? {
        tickets: data.tickets
          .filter((t) =>
            `${ticketNumber(t)} ${t.employeeName} ${t.issue}`
              .toLowerCase()
              .includes(globalQuery.toLowerCase()),
          )
          .slice(0, 4),
        employees: data.employees
          .filter((e) =>
            `${e.name} ${e.office}`
              .toLowerCase()
              .includes(globalQuery.toLowerCase()),
          )
          .slice(0, 3),
      }
    : null;
  const saveData = async (body: Record<string, unknown>) => {
    const response = await fetch("/api/workspace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    await refresh();
    return result;
  };
  const clearDemo = async () => {
    setClearing(true);
    try {
      await saveData({ entity: "clear-demo" });
      setConfirmClear(false);
      notify("Sample data cleared. Your local workspace is ready.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not clear sample data.");
    } finally {
      setClearing(false);
    }
  };
  const download = (content: string, filename: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    notify("Your export has been downloaded.");
  };
  const exportCSV = () => {
    const esc = (s: unknown) => {
      let v = String(s ?? "");
      if (/^[=+@\-\t\r]/.test(v)) v = "'" + v;
      return '"' + v.replaceAll('"', '""') + '"';
    };
    const rows = [
      [
        "Ticket",
        "Request date",
        "Employee",
        "Office",
        "Position",
        "Issue",
        "Category",
        "Priority",
        "Status",
        "IT action",
        "Technician",
      ],
      ...periodTickets.map((t) => [
        ticketNumber(t),
        formatDate(t.requestedAt),
        t.employeeName,
        t.office,
        t.position,
        t.issue,
        t.category,
        t.priority,
        t.status,
        t.action,
        t.technician,
      ]),
    ];
    download(
      "\uFEFF" + rows.map((row) => row.map(esc).join(",")).join("\r\n"),
      "PhilFIDA-IT-requests.csv",
      "text/csv;charset=utf-8;",
    );
  };

  return (
    <>
      <div className="application">
        {mobileNav && (
          <div className="sidebar-scrim" onClick={() => setMobileNav(false)} />
        )}
        <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
          <button
            className="brand-button"
            onClick={() => {
              setWelcomeOnly(true);
              setMobileNav(false);
            }}
            aria-label="PhilFIDA welcome page"
          >
            <Brand />
          </button>
          <div className="workspace-switch">
            <div className="workspace-icon">
              <Building2 size={17} />
            </div>
            <div>
              <strong>PhilFIDA Workspace</strong>
              <span>Central Office</span>
            </div>
            <span className="workspace-check">
              <Check size={13} />
            </span>
          </div>
          <div className="nav-label">WORKSPACE</div>
          <nav>
            {(
              [
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Requests", icon: Ticket },
                { name: "Employees", icon: Users },
                { name: "Analytics", icon: ChartNoAxesCombined },
              ] as const
            ).map((item) => (
              <button
                key={item.name}
                className={`nav-item ${view === item.name && !welcomeOnly ? "active" : ""}`}
                onClick={() => navigate(item.name)}
              >
                <item.icon size={19} />
                <span>{item.name}</span>
                {item.name === "Requests" && allPending > 0 && (
                  <b>{allPending}</b>
                )}
              </button>
            ))}
          </nav>
          <div className="nav-label system-label">SYSTEM</div>
          <nav>
            <button
              className={`nav-item ${view === "Settings" && !welcomeOnly ? "active" : ""}`}
              onClick={() => navigate("Settings")}
            >
              <Settings2 size={19} />
              <span>Settings</span>
            </button>
            <button className="nav-item" onClick={() => setHelp(true)}>
              <CircleHelp size={19} />
              <span>Help & information</span>
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="local-card">
              <div>
                <span
                  className={`connection-dot ${!connected ? "offline" : ""}`}
                />
                <strong>
                  {connected ? "Running locally" : "Reconnecting"}
                </strong>
                <Server size={14} />
              </div>
              <p>
                Your data stays in your agency.
                <br />
                Secure. Local. Always yours.
              </p>
            </div>
            <div className="support-profile">
              <div className="profile-avatar">IT</div>
              <div>
                <strong>IT Personnel</strong>
                <span>Local workspace · No sign-in</span>
              </div>
              <ShieldCheck size={17} />
            </div>
          </div>
        </aside>
        <div className="workspace-main">
          <header className="topbar">
            <div className="breadcrumb">
              <button
                className="mobile-menu icon-button"
                onClick={() => setMobileNav(true)}
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>
              <span>Workspace</span>
              <ChevronRight size={13} />
              <strong>{welcomeOnly ? "Welcome" : view}</strong>
            </div>
            <div className="topbar-right">
              <div className="global-search">
                <Search size={16} />
                <input
                  ref={searchRef}
                  value={globalQuery}
                  onChange={(e) => setGlobalQuery(e.target.value)}
                  placeholder="Search anything..."
                  aria-label="Search tickets and employees"
                />
                <kbd>⌘ K</kbd>
                {globalResults && (
                  <div className="search-results">
                    <div className="dropdown-label">REQUESTS</div>
                    {globalResults.tickets.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setTicketModal(t);
                          setGlobalQuery("");
                        }}
                      >
                        <Ticket size={16} />
                        <span>
                          <strong>{t.issue}</strong>
                          <small>
                            {ticketNumber(t)} · {t.employeeName}
                          </small>
                        </span>
                        <ArrowUpRight size={14} />
                      </button>
                    ))}
                    <div className="dropdown-label">EMPLOYEES</div>
                    {globalResults.employees.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          setEmployeeModal(e);
                          setGlobalQuery("");
                        }}
                      >
                        <Users size={16} />
                        <span>
                          <strong>{e.name}</strong>
                          <small>{e.office}</small>
                        </span>
                      </button>
                    ))}
                    {!globalResults.tickets.length &&
                      !globalResults.employees.length && (
                        <p>No matching records found.</p>
                      )}
                  </div>
                )}
              </div>
              <div className="topbar-divider" />
              <div className="notification-wrap">
                <button
                  className="icon-button notification-button"
                  aria-label="View pending requests"
                  onClick={() => setNotifications(!notifications)}
                >
                  <Bell size={19} />
                  {allPending > 0 && <i />}
                </button>
                {notifications && (
                  <div className="notifications">
                    <h3>
                      Needs your attention <span>{allPending}</span>
                    </h3>
                    <p>Requests waiting for IT assistance</p>
                    {data.tickets
                      .filter((t) => t.status === "Pending")
                      .slice(0, 4)
                      .map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTicketModal(t);
                            setNotifications(false);
                          }}
                        >
                          <span className="notification-icon">
                            <Ticket size={17} />
                          </span>
                          <span>
                            <strong>{t.issue}</strong>
                            <small>
                              {t.employeeName} ·{" "}
                              {formatDate(t.requestedAt, true)}
                            </small>
                          </span>
                        </button>
                      ))}
                    {!allPending && (
                      <div className="all-caught-up">
                        <CheckCircle2 size={25} />
                        All caught up. No pending requests.
                      </div>
                    )}
                    <button
                      className="notification-all"
                      onClick={() => {
                        navigate("Requests");
                        setFilter("Pending");
                        setNotifications(false);
                      }}
                    >
                      View pending requests <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="top-avatar">IT</div>
            </div>
          </header>
          <main className="main-content">
            {!connected && (
              <div className="error-banner">
                <Wifi size={17} />
                Cannot reach the local database. Changes have not been lost;
                reconnecting automatically.
                <button onClick={refresh}>Retry now</button>
              </div>
            )}
            {welcomeOnly ? (
              <section className="welcome-page">
                <div className="welcome-page-emblem">
                  <Image
                    src="/philfida-logo.png"
                    alt="PhilFIDA logo"
                    width={160}
                    height={160}
                  />
                </div>
                <span className="eyebrow">
                  PHILIPPINE FIBER INDUSTRY DEVELOPMENT AUTHORITY
                </span>
                <h1>
                  Welcome to PhilFIDA
                  <br />
                  <em>IT Ticketing System.</em>
                </h1>
                <p>
                  Better support starts here. A simple, local workspace for
                  managing employee IT concerns, tracking repairs, and keeping
                  your agency connected.
                </p>
                <button
                  className="button primary large"
                  onClick={() => {
                    navigate("Dashboard");
                    setWelcome(false);
                  }}
                >
                  Enter workspace <ArrowRight size={18} />
                </button>
                <div className="welcome-benefits">
                  <span>
                    <ShieldCheck size={17} />
                    No accounts required
                  </span>
                  <span>
                    <Server size={17} />
                    Locally stored data
                  </span>
                  <span>
                    <Activity size={17} />
                    Live request tracking
                  </span>
                </div>
                <div className="welcome-feature-grid">
                  {[
                    {
                      icon: Users,
                      title: "People, not paperwork",
                      text: "Select registered employees and keep their office details in one place.",
                    },
                    {
                      icon: Wrench,
                      title: "Every request, accounted for",
                      text: "Follow repairs from the first concern to the final resolution.",
                    },
                    {
                      icon: Printer,
                      title: "Ready for your records",
                      text: "Print identical A4 ticket copies and clear, useful analytics.",
                    },
                  ].map((f) => (
                    <article key={f.title}>
                      <f.icon size={24} />
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <>
                <div className="page-heading">
                  <div>
                    <div className="heading-line">
                      <h1>{view}</h1>
                      {view === "Dashboard" && (
                        <span className="live-tag">
                          <i />
                          Live overview
                        </span>
                      )}
                    </div>
                    <p>
                      {view === "Dashboard"
                        ? "A little clarity for a more connected workplace. Here’s your IT support at a glance."
                        : view === "Requests"
                          ? "Manage employee concerns, track repairs, and keep every request moving."
                          : view === "Employees"
                            ? "Your agency directory. Add employees once, select them for every request."
                            : view === "Analytics"
                              ? "Turn your support activity into a clearer picture of agency IT performance."
                              : "Manage your local workspace and keep your agency’s records safe."}
                    </p>
                  </div>
                  <div className="heading-actions">
                    {view === "Dashboard" && (
                      <button
                        className="button secondary print-report-top"
                        onClick={printReport}
                      >
                        <Printer size={16} />
                        Print report
                      </button>
                    )}
                    {view === "Employees" ? (
                      <button
                        className="button primary"
                        onClick={() => setEmployeeModal("new")}
                      >
                        <Plus size={17} />
                        Add employee
                      </button>
                    ) : view === "Dashboard" || view === "Requests" ? (
                      <button
                        className="button primary"
                        onClick={() => setTicketModal("new")}
                      >
                        <Plus size={17} />
                        New request
                      </button>
                    ) : view === "Analytics" ? (
                      <>
                        <button
                          className="button secondary"
                          onClick={exportCSV}
                        >
                          <ArrowDownToLine size={16} />
                          Export CSV
                        </button>
                        <button
                          className="button primary"
                          onClick={printReport}
                        >
                          <Printer size={16} />
                          Print analytics
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
                {view === "Dashboard" && (
                  <>
                    {welcome && (
                      <section className="welcome-banner">
                        <div>
                          <div className="welcome-eyebrow">
                            <span />
                            WELCOME TO PHILFIDA IT TICKETING
                          </div>
                          <h2>Better support. A smoother workday.</h2>
                          <p>
                            Manage requests, support your people, and keep the
                            agency moving.
                          </p>
                          <button
                            onClick={() => {
                              setWelcome(false);
                              notify(
                                "Welcome! Your workspace is ready. Create a request to get started.",
                              );
                            }}
                          >
                            Enter workspace <ArrowRight size={14} />
                          </button>
                        </div>
                        <WelcomeArt />
                        <button
                          className="banner-dismiss"
                          onClick={() => setWelcome(false)}
                          aria-label="Dismiss welcome"
                        >
                          <X size={16} />
                        </button>
                      </section>
                    )}
                    <div className="section-toolbar">
                      <div>
                        <h2>Overview</h2>
                        <span className="period-description">
                          {range === "month" ? "Last 30 days" : "Last 7 days"}
                        </span>
                      </div>
                      <div className="period-controls">
                        <div className="segmented">
                          <button
                            className={range === "week" ? "selected" : ""}
                            onClick={() => setRange("week")}
                          >
                            Weekly
                          </button>
                          <button
                            className={range === "month" ? "selected" : ""}
                            onClick={() => setRange("month")}
                          >
                            Monthly
                          </button>
                        </div>
                        <span className="date-range">
                          <CalendarDays size={15} />
                          {formatDate(cutoff, true)} – {formatDate(new Date())}
                        </span>
                      </div>
                    </div>
                    <Stats
                      counts={counts}
                      loading={loading}
                      onSelect={(s) => {
                        navigate("Requests");
                        setFilter(s);
                      }}
                    />
                    <div className="charts-grid">
                      <TrendChart tickets={periodTickets} range={range} />
                      <StatusChart tickets={periodTickets} />
                    </div>
                    <section className="card requests-card">
                      <div className="card-heading">
                        <div>
                          <h2>
                            Recent requests{" "}
                            <span className="number-pill">
                              {data.tickets.length}
                            </span>
                          </h2>
                          <p>
                            A quick look at the latest IT concerns in your
                            agency.
                          </p>
                        </div>
                        <button
                          className="text-button"
                          onClick={() => navigate("Requests")}
                        >
                          View all requests <ArrowRight size={15} />
                        </button>
                      </div>
                      <div className="table-toolbar">
                        <div className="table-tabs">
                          {[
                            "All requests",
                            "Pending",
                            "In progress",
                            "Resolved",
                          ].map((s) => (
                            <button
                              key={s}
                              className={filter === s ? "active" : ""}
                              onClick={() => setFilter(s)}
                            >
                              {s}
                              {s === "Pending" && <span>{allPending}</span>}
                            </button>
                          ))}
                        </div>
                        <div className="table-search">
                          <Search size={15} />
                          <input
                            placeholder="Search requests..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search recent requests"
                          />
                        </div>
                      </div>
                      <TicketTable
                        tickets={filtered.slice(0, 5)}
                        loading={loading}
                        open={setTicketModal}
                      />
                      <div className="table-footer">
                        <span>
                          Showing {Math.min(5, filtered.length)} of{" "}
                          {filtered.length} requests
                        </span>
                        <span className="auto-update">
                          <span className="connection-dot" />
                          Updated automatically every 5 seconds
                        </span>
                      </div>
                    </section>
                  </>
                )}
                {view === "Requests" && (
                  <>
                    <div className="request-summary">
                      <button
                        onClick={() => setFilter("All requests")}
                        className={filter === "All requests" ? "selected" : ""}
                      >
                        <Ticket size={19} />
                        All requests <strong>{data.tickets.length}</strong>
                      </button>
                      {statusList.slice(0, 3).map((s) => (
                        <button
                          key={s}
                          className={filter === s ? "selected" : ""}
                          onClick={() => setFilter(s)}
                        >
                          <span
                            className={`status-icon ${s.toLowerCase().replace(" ", "-")}`}
                          >
                            {s === "Pending" ? (
                              <Clock3 size={19} />
                            ) : s === "Resolved" ? (
                              <CheckCircle2 size={19} />
                            ) : (
                              <Wrench size={19} />
                            )}
                          </span>
                          {s}
                          <strong>
                            {data.tickets.filter((t) => t.status === s).length}
                          </strong>
                        </button>
                      ))}
                    </div>
                    <section className="card">
                      <div className="list-toolbar">
                        <div className="table-search wide">
                          <Search size={16} />
                          <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by ticket, employee, or issue..."
                            aria-label="Search requests"
                          />
                        </div>
                        <div className="filter-group">
                          <select
                            aria-label="Filter by office"
                            value={officeFilter}
                            onChange={(e) => setOfficeFilter(e.target.value)}
                          >
                            <option>All offices</option>
                            {Array.from(
                              new Set(data.employees.map((e) => e.office)),
                            )
                              .sort()
                              .map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                          </select>
                          <select
                            aria-label="Filter by status"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                          >
                            <option>All requests</option>
                            {statusList.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <TicketTable
                        tickets={shownTickets}
                        loading={loading}
                        open={setTicketModal}
                      />
                      <div className="table-footer">
                        <span>
                          Showing{" "}
                          {filtered.length ? (requestPage - 1) * 8 + 1 : 0}–
                          {Math.min(requestPage * 8, filtered.length)} of{" "}
                          {filtered.length} requests
                        </span>
                        <Pagination
                          page={requestPage}
                          total={requestPages}
                          setPage={setPage}
                        />
                      </div>
                    </section>
                    <div className="tip">
                      <Printer size={17} />
                      <span>
                        Need a paper record? Open any request to print two
                        identical copies on one landscape A4 sheet.
                      </span>
                    </div>
                  </>
                )}
                {view === "Employees" && (
                  <>
                    <div className="directory-overview">
                      <div className="directory-icon">
                        <Users size={26} />
                      </div>
                      <div>
                        <h2>{data.employees.length} registered employees</h2>
                        <p>
                          Across{" "}
                          {new Set(data.employees.map((e) => e.office)).size}{" "}
                          units and offices
                        </p>
                      </div>
                      <span className="soft-badge">
                        <CheckCircle2 size={14} />
                        Ready for quick request entry
                      </span>
                    </div>
                    <section className="card">
                      <div className="list-toolbar">
                        <div className="table-search wide">
                          <Search size={16} />
                          <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search employees, positions, or offices..."
                            aria-label="Search employees"
                          />
                        </div>
                        <select
                          aria-label="Filter employees by office"
                          value={officeFilter}
                          onChange={(e) => setOfficeFilter(e.target.value)}
                        >
                          <option>All offices</option>
                          {Array.from(
                            new Set(data.employees.map((e) => e.office)),
                          )
                            .sort()
                            .map((o) => (
                              <option key={o}>{o}</option>
                            ))}
                        </select>
                      </div>
                      <div className="table-scroll">
                        <table className="employees-table">
                          <thead>
                            <tr>
                              <th>Employee</th>
                              <th>Unit / Office</th>
                              <th>Position</th>
                              <th>Requests</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {filteredEmployees
                              .slice((employeePage - 1) * 10, employeePage * 10)
                              .map((e, i) => (
                                <tr key={e.id}>
                                  <td>
                                    <div className="employee-cell">
                                      <span
                                        className={`person-avatar color-${i % 5}`}
                                      >
                                        {initials(e.name)}
                                      </span>
                                      <div>
                                        <strong>{e.name}</strong>
                                        <small>
                                          {e.email || "Agency employee"}
                                        </small>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{e.office}</td>
                                  <td>{e.position}</td>
                                  <td>
                                    <span className="number-pill">
                                      {
                                        data.tickets.filter(
                                          (t) => t.employeeId === e.id,
                                        ).length
                                      }
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      className="icon-button"
                                      onClick={() => setEmployeeModal(e)}
                                      aria-label={`Edit ${e.name}`}
                                    >
                                      <Pencil size={15} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        {!filteredEmployees.length && (
                          <EmptyState
                            icon="people"
                            title={
                              query
                                ? "No employees found"
                                : "Your employee directory starts here"
                            }
                            text={
                              query
                                ? "Try a different name, position, or office."
                                : "Add your first employee to make creating requests quick and easy."
                            }
                            action={
                              !query ? () => setEmployeeModal("new") : undefined
                            }
                            actionLabel="Add employee"
                          />
                        )}
                      </div>
                      <div className="table-footer">
                        <span>
                          {filteredEmployees.length} employees in your directory
                        </span>
                        <Pagination
                          page={employeePage}
                          total={employeePages}
                          setPage={setPage}
                        />
                      </div>
                    </section>
                  </>
                )}
                {view === "Analytics" && (
                  <>
                    <div className="section-toolbar">
                      <div>
                        <h2>Support performance</h2>
                        <span className="period-description">
                          {range === "week" ? "Last 7 days" : "Last 30 days"}
                        </span>
                      </div>
                      <div className="period-controls">
                        <div className="segmented">
                          <button
                            className={range === "week" ? "selected" : ""}
                            onClick={() => setRange("week")}
                          >
                            Weekly
                          </button>
                          <button
                            className={range === "month" ? "selected" : ""}
                            onClick={() => setRange("month")}
                          >
                            Monthly
                          </button>
                        </div>
                        <span className="date-range">
                          <CalendarDays size={15} />
                          {formatDate(cutoff, true)} – {formatDate(new Date())}
                        </span>
                      </div>
                    </div>
                    <Stats counts={counts} loading={loading} />
                    <div className="charts-grid">
                      <TrendChart tickets={periodTickets} range={range} />
                      <StatusChart tickets={periodTickets} />
                    </div>
                    <div className="analytics-bottom">
                      <section className="card">
                        <div className="card-heading">
                          <div>
                            <h2>Requests by office</h2>
                            <p>Where support is needed most.</p>
                          </div>
                          <Building2 size={19} />
                        </div>
                        <div className="office-breakdown">
                          {Array.from(
                            new Set(periodTickets.map((t) => t.office)),
                          )
                            .map((office) => ({
                              office,
                              total: periodTickets.filter(
                                (t) => t.office === office,
                              ).length,
                            }))
                            .sort((a, b) => b.total - a.total)
                            .map((o) => (
                              <div key={o.office}>
                                <div>
                                  <span>{o.office}</span>
                                  <strong>{o.total}</strong>
                                </div>
                                <div className="bar-track">
                                  <div
                                    style={{
                                      width: `${(o.total / Math.max(1, counts.total)) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          {!periodTickets.length && (
                            <p>No requests recorded for this period.</p>
                          )}
                        </div>
                      </section>
                      <section className="card">
                        <div className="card-heading">
                          <div>
                            <h2>Service insights</h2>
                            <p>A closer look at your support outcomes.</p>
                          </div>
                          <Activity size={19} />
                        </div>
                        <div className="insights">
                          <div>
                            <span>Resolution rate</span>
                            <strong>
                              {rate}
                              <small>%</small>
                            </strong>
                            <div className="bar-track">
                              <div style={{ width: `${rate}%` }} />
                            </div>
                            <p>
                              {counts.resolved} of {counts.total} submitted
                              requests resolved
                            </p>
                          </div>
                          <div className="insight-row">
                            <span>
                              <Clock3 size={17} />
                              Open requests
                            </span>
                            <b>{counts.pending + counts.progress}</b>
                          </div>
                          <div className="insight-row">
                            <span>
                              <CheckCheck size={17} />
                              Most frequent concern
                            </span>
                            <b>
                              {periodTickets.length
                                ? Object.entries(
                                    periodTickets.reduce(
                                      (a, t) => ({
                                        ...a,
                                        [t.category]: (a[t.category] || 0) + 1,
                                      }),
                                      {} as Record<string, number>,
                                    ),
                                  ).sort((a, b) => b[1] - a[1])[0]?.[0]
                                : "—"}
                            </b>
                          </div>
                          <div className="insight-row">
                            <span>
                              <Users size={17} />
                              Employees assisted
                            </span>
                            <b>
                              {
                                new Set(
                                  periodTickets
                                    .filter((t) => t.status === "Resolved")
                                    .map((t) => t.employeeId),
                                ).size
                              }
                            </b>
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}
                {view === "Settings" && (
                  <div className="settings-grid">
                    <SettingsEditor
                      data={data}
                      onSave={async (values) => {
                        await saveData(values);
                        notify("Print header and IT personnel details saved.");
                      }}
                    />
                    <section className="card settings-card">
                      <div className="settings-icon">
                        <Building2 size={24} />
                      </div>
                      <h2>Your agency workspace</h2>
                      <p>
                        A dedicated, account-free IT support system for
                        PhilFIDA.
                      </p>
                      <dl>
                        <div>
                          <dt>Agency</dt>
                          <dd>{data.agency}</dd>
                        </div>
                        <div>
                          <dt>Office</dt>
                          <dd>Central Office</dd>
                        </div>
                        <div>
                          <dt>Access mode</dt>
                          <dd>No accounts · IT personnel entry</dd>
                        </div>
                        <div>
                          <dt>Database</dt>
                          <dd>
                            <span className="connection-dot" />
                            Local PostgreSQL
                          </dd>
                        </div>
                        <div>
                          <dt>Live refresh</dt>
                          <dd>Every 5 seconds</dd>
                        </div>
                      </dl>
                      <div className="info-note">
                        <ShieldCheck size={18} />
                        <p>
                          This workspace has no authentication. Run it on your
                          computer or a trusted agency network only. Do not
                          expose it to the public internet.
                        </p>
                      </div>
                    </section>
                    <div>
                      <section className="card settings-card">
                        <div className="settings-icon">
                          <HardDrive size={24} />
                        </div>
                        <h2>Data & backups</h2>
                        <p>
                          Export a copy of all employees and requests for your
                          agency’s records.
                        </p>
                        <button
                          className="button secondary"
                          onClick={() =>
                            download(
                              JSON.stringify(
                                {
                                  ...data,
                                  exportedAt: new Date().toISOString(),
                                },
                                null,
                                2,
                              ),
                              "PhilFIDA-workspace-backup.json",
                              "application/json",
                            )
                          }
                        >
                          <ArrowDownToLine size={16} />
                          Download data backup
                        </button>
                        <small className="settings-hint">
                          JSON archive · Includes employee details and ticket
                          history. Store securely; contains personnel
                          information.
                        </small>
                      </section>
                      {data.demo && (
                        <section className="card settings-card demo-card">
                          <span className="demo-label">SAMPLE WORKSPACE</span>
                          <h2>Ready to make it your own?</h2>
                          <p>
                            This workspace includes fictional employees and
                            sample requests. Clear the workspace before entering
                            your agency’s real records.
                          </p>
                          <button
                            className="button danger"
                            onClick={() => setConfirmClear(true)}
                          >
                            <Trash2 size={16} />
                            Clear sample workspace
                          </button>
                        </section>
                      )}
                    </div>
                  </div>
                )}
                <footer className="main-footer">
                  <span>
                    <Leaf size={13} />
                    PhilFIDA IT Ticketing System <i />
                    Built for better public service.
                  </span>
                  <span>
                    {data.demo && (
                      <button
                        onClick={() => navigate("Settings")}
                        className="demo-footer"
                      >
                        Sample data
                      </button>
                    )}
                    <span
                      className={`connection-dot ${!connected ? "offline" : ""}`}
                    />
                    {loading
                      ? "Connecting to local database"
                      : connected
                        ? "All changes saved locally"
                        : "Offline"}
                    {lastSync && (
                      <span className="sync-time">
                        {" "}
                        · Synced{" "}
                        {lastSync.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </span>
                </footer>
              </>
            )}
          </main>
        </div>
      </div>
      {ticketModal && (
        <TicketEditor
          ticket={ticketModal}
          employees={data.employees}
          onClose={() => setTicketModal(null)}
          onSave={async (values) => {
            await saveData(values);
            setTicketModal(null);
            notify(
              ticketModal === "new"
                ? "Request created successfully."
                : "Request updated successfully.",
            );
          }}
          onDelete={async (id) => {
            const r = await fetch(`/api/workspace?entity=ticket&id=${id}`, {
              method: "DELETE",
            });
            const res = await r.json();
            if (!r.ok) throw new Error(res.error);
            await refresh();
            setTicketModal(null);
            notify("Request deleted permanently.");
          }}
          onPrint={printRequest}
          onAddEmployee={() => setEmployeeModal("new")}
        />
      )}
      {employeeModal && (
        <EmployeeEditor
          employee={employeeModal}
          onClose={() => setEmployeeModal(null)}
          onSave={async (values) => {
            await saveData(values);
            setEmployeeModal(null);
            notify(
              employeeModal === "new"
                ? "Employee added to the directory."
                : "Employee details updated.",
            );
          }}
          onDelete={async (id) => {
            const r = await fetch(`/api/workspace?id=${id}`, {
              method: "DELETE",
            });
            const res = await r.json();
            if (!r.ok) throw new Error(res.error);
            await refresh();
            setEmployeeModal(null);
            notify("Employee removed.");
          }}
        />
      )}
      {help && (
        <Modal
          title="A little help, when you need it"
          subtitle="Your guide to the PhilFIDA IT workspace"
          onClose={() => setHelp(false)}
        >
          <div className="help-content">
            {[
              {
                icon: Users,
                title: "1. Build your employee directory",
                text: "Go to Employees and add a name, unit or office, and position. You only need to enter each employee once.",
              },
              {
                icon: Ticket,
                title: "2. Record an IT concern",
                text: "Choose New request, select the employee, and enter the request date, issue, and description. Device brand and model are optional.",
              },
              {
                icon: Wrench,
                title: "3. Track the work",
                text: "Open any request to add IT actions, assign a technician, and update its status. A resolution action is required to mark a request as resolved.",
              },
              {
                icon: Printer,
                title: "4. Print and file",
                text: "Open a saved ticket and choose Print ticket. Two copies fit on a single landscape A4 page—one for the employee and one for IT. Use Print analytics for a period report.",
              },
              {
                icon: Activity,
                title: "5. Stay up to date",
                text: "The dashboard refreshes from your local database every five seconds. Switch between weekly (7 days) and monthly (30 days) to review submission trends.",
              },
            ].map((i) => (
              <div className="help-step" key={i.title}>
                <i.icon size={20} />
                <div>
                  <h3>{i.title}</h3>
                  <p>{i.text}</p>
                </div>
              </div>
            ))}
            <div className="info-note">
              <Server size={20} />
              <p>
                No cloud service or account is required. Keep this app and
                PostgreSQL running on your local computer. See the project’s
                LOCAL-SETUP.md for installation and backup instructions.
              </p>
            </div>
          </div>
        </Modal>
      )}
      {confirmClear && (
        <Modal
          title="Start with a clean workspace?"
          subtitle="This action cannot be undone."
          onClose={() => setConfirmClear(false)}
        >
          <div className="confirm-content">
            <div className="warning-icon">
              <Trash2 size={25} />
            </div>
            <p>
              This will permanently delete{" "}
              <strong>
                all {data.tickets.length} requests and {data.employees.length}{" "}
                employees
              </strong>{" "}
              currently in this sample workspace, including any records you have
              added.
            </p>
            <p>
              Download a data backup in Settings first if you need to keep
              anything. Your workspace will remain available with an empty
              directory.
            </p>
            <div className="modal-actions">
              <button
                className="button secondary"
                onClick={() => setConfirmClear(false)}
              >
                Keep my data
              </button>
              <button
                disabled={clearing}
                className="button danger"
                onClick={clearDemo}
              >
                {clearing ? (
                  <LoaderCircle size={16} className="spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Clear all sample workspace data
              </button>
            </div>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
      {printTicket && (
        <div className="print-document rq-sheet">
          {[1, 2].map((copy) => (
            <RepairTicketCopy key={copy} ticket={printTicket} data={data} />
          ))}
        </div>
      )}
      {printAnalytics && (
        <div className="print-document analytics-print">
          <div className="report-header">
            <PrintHeader data={data} />
            <div>
              <h1>IT Support Analytics Report</h1>
              <p>{data.headerAgency}</p>
            </div>
          </div>
          <div className="report-period">
            <strong>{range === "week" ? "Weekly" : "Monthly"} report</strong>
            <span>
              {formatDate(cutoff)} – {formatDate(new Date())}
            </span>
            <span>Generated {formatDate(new Date())}</span>
          </div>
          {data.demo && (
            <p className="report-demo">
              Sample workspace — fictional demonstration records
            </p>
          )}
          <div className="report-kpis">
            {[
              ["Total requests", counts.total],
              ["Pending", counts.pending],
              ["In progress", counts.progress],
              ["Resolved", counts.resolved],
              ["Resolution rate", `${rate}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <h2>Requests by office</h2>
          <table>
            <thead>
              <tr>
                <th>Unit / Office</th>
                <th>Total</th>
                <th>Pending</th>
                <th>In progress</th>
                <th>Resolved</th>
                <th>Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(periodTickets.map((t) => t.office)))
                .sort()
                .map((o) => (
                  <tr key={o}>
                    <td>{o}</td>
                    <td>
                      {periodTickets.filter((t) => t.office === o).length}
                    </td>
                    {statusList.map((s) => (
                      <td key={s}>
                        {
                          periodTickets.filter(
                            (t) => t.office === o && t.status === s,
                          ).length
                        }
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <h2>Request register</h2>
          <table>
            <thead>
              <tr>
                <th>Ticket number</th>
                <th>Date</th>
                <th>Employee</th>
                <th>Issue / Concern</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {periodTickets.map((t) => (
                <tr key={t.id}>
                  <td>{ticketNumber(t)}</td>
                  <td>{formatDate(t.requestedAt, true)}</td>
                  <td>{t.employeeName}</td>
                  <td>{t.issue}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!periodTickets.length && <p>No requests in the selected period.</p>}
          <footer>
            Prepared by: {data.itPersonnelName} — {data.itPersonnelPosition}{" "}
            &nbsp;&nbsp; Date: _________________________
            <br />
            {data.headerAgency} · Locally generated report · All statuses are
            current at time of printing.
          </footer>
        </div>
      )}
    </>
  );
}

function Stats({
  counts,
  loading,
  onSelect,
}: {
  counts: {
    total: number;
    pending: number;
    progress: number;
    resolved: number;
  };
  loading: boolean;
  onSelect?: (s: string) => void;
}) {
  const stats = [
    {
      label: "Total requests",
      value: counts.total,
      icon: Ticket,
      color: "green",
      note: "Submitted this period",
      filter: "All requests",
    },
    {
      label: "Pending requests",
      value: counts.pending,
      icon: Clock3,
      color: "amber",
      note: "Awaiting IT assistance",
      filter: "Pending",
    },
    {
      label: "In progress",
      value: counts.progress,
      icon: Wrench,
      color: "blue",
      note: "Currently being worked on",
      filter: "In progress",
    },
    {
      label: "Resolved requests",
      value: counts.resolved,
      icon: CheckCircle2,
      color: "emerald",
      note: "Successfully completed",
      filter: "Resolved",
    },
  ];
  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <button
          className={`stat-card ${s.color}`}
          key={s.label}
          onClick={() => onSelect?.(s.filter)}
          style={!onSelect ? { cursor: "default" } : undefined}
        >
          <div className="stat-top">
            <span>{s.label}</span>
            <div className="stat-icon">
              <s.icon size={19} />
            </div>
          </div>
          <div className="stat-value">
            {loading ? <span className="skeleton-number" /> : s.value}
            <Sparkline
              variant={i}
              color={i === 1 ? "#dfa33b" : i === 2 ? "#6392d5" : "#399775"}
            />
          </div>
          <div className="stat-foot">
            {i === 3 ? (
              <Check size={13} />
            ) : i === 0 ? (
              <ArrowUpRight size={13} />
            ) : i === 1 ? (
              <Clock3 size={12} />
            ) : (
              <Activity size={12} />
            )}
            <span>{s.note}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
function TrendChart({
  tickets,
  range,
}: {
  tickets: RequestTicket[];
  range: string;
}) {
  const points = useMemo(() => {
    const length = range === "week" ? 7 : 6;
    return Array.from({ length }, (_, i) => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(
        start.getDate() - (range === "week" ? 6 - i : (5 - i) * 5 + 4),
      );
      const end = new Date(start);
      end.setDate(end.getDate() + (range === "week" ? 1 : 5));
      return {
        label: start.toLocaleDateString(
          "en-US",
          range === "week"
            ? { weekday: "short" }
            : { month: "short", day: "numeric" },
        ),
        total: tickets.filter(
          (t) =>
            new Date(t.requestedAt) >= start && new Date(t.requestedAt) < end,
        ).length,
        resolved: tickets.filter(
          (t) =>
            t.status === "Resolved" &&
            new Date(t.requestedAt) >= start &&
            new Date(t.requestedAt) < end,
        ).length,
      };
    });
  }, [tickets, range]);
  const max = Math.max(
    5,
    Math.ceil(Math.max(...points.map((p) => p.total)) / 5) * 5,
  );
  const coords = (key: "total" | "resolved") =>
    points.map((p, i) => ({
      x: 43 + i * (550 / (points.length - 1)),
      y: 160 - (p[key] / max) * 132,
    }));
  const line = (key: "total" | "resolved") => {
    const p = coords(key);
    return p
      .map((v, i) =>
        i === 0
          ? `M ${v.x} ${v.y}`
          : `C ${p[i - 1].x + (550 / (points.length - 1)) * 0.45} ${p[i - 1].y}, ${v.x - (550 / (points.length - 1)) * 0.45} ${v.y}, ${v.x} ${v.y}`,
      )
      .join(" ");
  };
  return (
    <section className="card trend-card">
      <div className="card-heading">
        <div>
          <h2>Request activity</h2>
          <p>Submissions and resolutions over time</p>
        </div>
        <div className="chart-legend">
          <span>
            <i className="legend-submitted" />
            Submitted
          </span>
          <span>
            <i className="legend-resolved" />
            Resolved
          </span>
        </div>
      </div>
      <div className="line-chart">
        <svg
          viewBox="0 0 625 195"
          role="img"
          aria-label={`Request activity: ${tickets.length} submitted, ${tickets.filter((t) => t.status === "Resolved").length} resolved in the last ${range === "week" ? 7 : 30} days`}
        >
          <defs>
            <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#289774" stopOpacity=".16" />
              <stop offset="100%" stopColor="#289774" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <text
                x="25"
                y={32 + i * 33}
                textAnchor="end"
                className="chart-label"
              >
                {max - (i * max) / 4}
              </text>
              <line
                x1="43"
                x2="593"
                y1={28 + i * 33}
                y2={28 + i * 33}
                stroke="#edf0f2"
                strokeDasharray={i === 4 ? "0" : "3 4"}
              />
            </g>
          ))}
          <path
            d={`${line("total")} L 593 160 L 43 160 Z`}
            fill="url(#chart-area)"
          />
          <path
            d={line("total")}
            stroke="#228767"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d={line("resolved")}
            stroke="#8eaccb"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 5"
          />
          {points.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={coords("total")[i].x}
                cy={coords("total")[i].y}
                r="3.5"
                fill="white"
                stroke="#228767"
                strokeWidth="2"
              >
                <title>{`${p.label}: ${p.total} submitted, ${p.resolved} resolved`}</title>
              </circle>
              <text
                x={coords("total")[i].x}
                y="185"
                textAnchor="middle"
                className="chart-label"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="chart-bottom">
        <span>
          <span className="chart-trend-icon">
            <ArrowUpRight size={13} />
          </span>
          <strong>{tickets.length} requests</strong> submitted this{" "}
          {range === "week" ? "week" : "30-day period"}
        </span>
        <span>By request date</span>
      </div>
    </section>
  );
}
function StatusChart({ tickets }: { tickets: RequestTicket[] }) {
  const statuses = ["Resolved", "Pending", "In progress", "Cancelled"];
  const values = statuses.map(
    (s) => tickets.filter((t) => t.status === s).length,
  );
  let acc = 0;
  const gradient = values
    .map((n, i) => {
      const start = acc;
      acc += tickets.length ? (n / tickets.length) * 100 : 0;
      return `${colors[i]} ${start}% ${acc}%`;
    })
    .join(",");
  return (
    <section className="card status-card">
      <div className="card-heading">
        <div>
          <h2>Request status</h2>
          <p>Every request, accounted for</p>
        </div>
        <span
          className="chart-info"
          title="Current status of requests submitted in the selected period"
        >
          <CircleHelp size={16} />
        </span>
      </div>
      <div className="donut-area">
        <div
          className="donut"
          style={{
            background: tickets.length
              ? `conic-gradient(${gradient})`
              : "#edf1ef",
          }}
        >
          <div>
            <strong>{tickets.length}</strong>
            <span>Total requests</span>
          </div>
        </div>
        <div className="donut-legend">
          {statuses.map((s, i) => (
            <div key={s}>
              <span>
                <i style={{ background: colors[i] }} />
                {s}
              </span>
              <strong>
                {values[i]}
                <small>
                  {tickets.length
                    ? Math.round((values[i] / tickets.length) * 100)
                    : 0}
                  %
                </small>
              </strong>
            </div>
          ))}
        </div>
      </div>
      <div className="status-bottom">
        <span className="resolution-icon">
          <CheckCircle2 size={15} />
        </span>
        <strong>
          {tickets.length ? Math.round((values[0] / tickets.length) * 100) : 0}%
          resolution rate
        </strong>
        <span>Keep up the good work!</span>
      </div>
    </section>
  );
}
function TicketTable({
  tickets,
  loading,
  open,
}: {
  tickets: RequestTicket[];
  loading: boolean;
  open: (ticket: RequestTicket) => void;
}) {
  return (
    <div className="table-scroll">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Employee</th>
            <th>Issue / Concern</th>
            <th>Date requested</th>
            <th>Status</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((t, i) => (
            <tr key={t.id} onClick={() => open(t)}>
              <td>
                <button
                  className="ticket-id"
                  onClick={(e) => {
                    e.stopPropagation();
                    open(t);
                  }}
                >
                  {ticketNumber(t)}
                </button>
              </td>
              <td>
                <div className="employee-cell">
                  <span className={`person-avatar color-${i % 5}`}>
                    {initials(t.employeeName)}
                  </span>
                  <div>
                    <strong>{t.employeeName}</strong>
                    <small>{t.office}</small>
                  </div>
                </div>
              </td>
              <td>
                <div className="issue-cell">
                  <strong>{t.issue}</strong>
                  <small>
                    {t.category}
                    {(t.priority === "High" || t.priority === "Urgent") && (
                      <span className="priority-mark">
                        {" "}
                        · {t.priority} priority
                      </span>
                    )}
                  </small>
                </div>
              </td>
              <td className="date-cell">{formatDate(t.requestedAt)}</td>
              <td>
                <Status status={t.status} />
              </td>
              <td>
                <button
                  className="icon-button row-menu"
                  title="Edit request"
                  aria-label={`Edit request ${ticketNumber(t)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    open(t);
                  }}
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading ? (
        <div className="loading-state">
          <LoaderCircle className="spin" size={22} />
          Loading your local workspace…
        </div>
      ) : !tickets.length ? (
        <EmptyState
          title="No requests to show"
          text="New requests will appear here. Try another filter or create your first request."
        />
      ) : null}
    </div>
  );
}
function Pagination({
  page,
  total,
  setPage,
}: {
  page: number;
  total: number;
  setPage: (p: number) => void;
}) {
  return (
    <div className="pagination">
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span>
        Page {page} of {Math.max(1, total)}
      </span>
      <button
        disabled={page >= total}
        onClick={() => setPage(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
function EmptyState({
  icon,
  title,
  text,
  action,
  actionLabel,
}: {
  icon?: string;
  title: string;
  text: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="empty-state">
      <div>
        {icon === "people" ? <Users size={25} /> : <Ticket size={25} />}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button className="button primary" onClick={action}>
          <Plus size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = ref.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
      );
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    ref.current?.addEventListener("keydown", trap);
    const el = ref.current;
    return () => {
      document.body.style.overflow = overflow;
      el?.removeEventListener("keydown", trap);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${wide ? "wide-modal" : ""}`}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-heading">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={21} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function TicketEditor({
  ticket,
  employees,
  onClose,
  onSave,
  onDelete,
  onPrint,
  onAddEmployee,
}: {
  ticket: RequestTicket | "new";
  employees: Employee[];
  onClose: () => void;
  onSave: (v: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onPrint: (t: RequestTicket) => void;
  onAddEmployee: () => void;
}) {
  const existing = ticket === "new" ? null : ticket;
  const [employeeId, setEmployeeId] = useState(
    String(existing?.employeeId || ""),
  );
  const [status, setStatus] = useState(existing?.status || "Pending");
  const [resolvedAction, setResolvedAction] = useState(
    existing?.resolvedAction ||
      (existing?.status === "Resolved" ? existing.action : ""),
  );
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const person = employees.find((e) => String(e.id) === employeeId);
  const changeStatus = (next: string) => {
    setStatus(next);
    if (next !== "Resolved") setResolvedAction("");
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await onSave({
        ...values,
        entity: "ticket",
        id: existing?.id,
        employeeId: Number(employeeId),
        requestedAt: new Date(String(values.requestedAt)).toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save request.");
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!existing) return;
    setSaving(true);
    setError("");
    try {
      await onDelete(existing.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete request.",
      );
      setConfirmDelete(false);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      title={existing ? ticketNumber(existing) : "Create a new request"}
      subtitle={
        existing
          ? "Review the concern, record your action, and keep the request moving."
          : "A few details now. A smoother resolution ahead."
      }
      onClose={onClose}
      wide
    >
      <form onSubmit={submit}>
        <div className="form-body">
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="form-section-title">
            <span>
              <Users size={17} />
              Requesting employee
            </span>
            <button
              type="button"
              className="text-button"
              onClick={onAddEmployee}
            >
              <Plus size={14} />
              Add employee
            </button>
          </div>
          <div className="form-grid">
            <label>
              Request date & time <em>*</em>
              <input
                name="requestedAt"
                type="datetime-local"
                defaultValue={dateInput(existing?.requestedAt)}
                required
              />
            </label>
            <label>
              Find employee
              <input
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Type a name or office to filter..."
              />
            </label>
            <label className="full">
              Employee <em>*</em>
              <select
                name="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              >
                <option value="">Select a registered employee</option>
                {employees
                  .filter(
                    (e) =>
                      e.id === Number(employeeId) ||
                      `${e.name} ${e.office}`
                        .toLowerCase()
                        .includes(employeeSearch.toLowerCase()),
                  )
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} — {e.office}
                    </option>
                  ))}
              </select>
              {!employees.length && (
                <small className="field-hint">
                  Add an employee first using the button above.
                </small>
              )}
            </label>
          </div>
          {person && (
            <div className="employee-preview">
              <span className="person-avatar">{initials(person.name)}</span>
              <div>
                <small>UNIT / OFFICE</small>
                <strong>
                  {existing && existing.employeeId === person.id
                    ? existing.office
                    : person.office}
                </strong>
              </div>
              <div>
                <small>POSITION</small>
                <strong>
                  {existing && existing.employeeId === person.id
                    ? existing.position
                    : person.position}
                </strong>
              </div>
              <ShieldCheck size={19} />
            </div>
          )}
          <div className="form-section-title">
            <span>
              <Ticket size={17} />
              Request details
            </span>
            <small>
              <em>*</em> Required fields
            </small>
          </div>
          <div className="form-grid">
            <label className="full">
              Issue / Concern <em>*</em>
              <input
                name="issue"
                defaultValue={existing?.issue}
                placeholder="e.g. Laptop cannot connect to office Wi-Fi"
                maxLength={200}
                required
              />
            </label>
            <label>
              Category
              <select
                name="category"
                defaultValue={existing?.category || "Hardware"}
              >
                {[
                  "Hardware",
                  "Software",
                  "Network",
                  "Account & Access",
                  "Other",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Priority
              <select
                name="priority"
                defaultValue={existing?.priority || "Normal"}
              >
                {["Low", "Normal", "High", "Urgent"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="full">
              Device Kind
              <input
                name="deviceKind"
                defaultValue={existing?.deviceKind || ""}
                placeholder="e.g. Laptop, printer, desktop, monitor"
                maxLength={100}
              />
            </label>
            <label>
              Device brand <span className="optional">(optional)</span>
              <input
                name="brand"
                defaultValue={existing?.brand || ""}
                placeholder="e.g. Lenovo, Dell, Epson"
                maxLength={100}
              />
            </label>
            <label>
              Device model <span className="optional">(optional)</span>
              <input
                name="model"
                defaultValue={existing?.model || ""}
                placeholder="e.g. ThinkPad E14"
                maxLength={100}
              />
            </label>
            <label className="full">
              Description <em>*</em>
              <textarea
                name="description"
                defaultValue={existing?.description}
                placeholder="Describe the issue, when it started, and any relevant details..."
                rows={3}
                maxLength={5000}
                required
              />
            </label>
          </div>
          <div className="form-section-title">
            <span>
              <Wrench size={17} />
              IT personnel action
            </span>
            {existing && <Status status={existing.status} />}
          </div>
          <div className="form-grid">
            <label>
              Status
              <select
                name="status"
                value={status}
                onChange={(e) => changeStatus(e.target.value)}
              >
                {statusList.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label>
              IT personnel / Technician
              <input
                name="technician"
                defaultValue={existing?.technician}
                placeholder="Name of attending IT personnel"
                maxLength={150}
              />
            </label>
            <label className="full">
              Initial action{" "}
              <span className="optional">(assessment and troubleshooting)</span>
              <textarea
                name="initialAction"
                defaultValue={
                  existing?.initialAction ||
                  (existing?.status !== "Resolved" ? existing?.action : "")
                }
                placeholder="Record the assessment and troubleshooting steps..."
                rows={3}
                maxLength={5000}
              />
            </label>
            <label
              className={`full resolved-action-field ${status === "Resolved" ? "is-resolved" : ""}`}
            >
              Resolved action{" "}
              {status === "Resolved" ? (
                <em>*</em>
              ) : (
                <span className="optional">
                  (available when status is Resolved)
                </span>
              )}
              <textarea
                name="resolvedAction"
                value={status === "Resolved" ? resolvedAction : ""}
                onChange={(e) => setResolvedAction(e.target.value)}
                disabled={status !== "Resolved"}
                placeholder={
                  status === "Resolved"
                    ? "Record the final resolution and verification..."
                    : "Set status to Resolved to enter the final resolution."
                }
                rows={3}
                maxLength={5000}
                required={status === "Resolved"}
              />
              {status !== "Resolved" && (
                <small className="field-hint">
                  Set status to Resolved to enter the final resolution.
                </small>
              )}
            </label>
          </div>
          <div className="form-note">
            <ShieldCheck size={15} />
            This request is saved to your agency’s local database.
          </div>
          {confirmDelete && existing && (
            <div className="delete-confirm" role="alert">
              <p>
                Permanently delete <strong>{ticketNumber(existing)}</strong> for{" "}
                <strong>{existing.employeeName}</strong>? This cannot be undone.
              </p>
              <button
                type="button"
                disabled={saving}
                className="button danger"
                onClick={remove}
              >
                {saving ? (
                  <LoaderCircle size={16} className="spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {saving ? "Deleting..." : "Yes, delete ticket"}
              </button>
              <button
                type="button"
                disabled={saving}
                className="text-button"
                onClick={() => setConfirmDelete(false)}
              >
                Keep ticket
              </button>
            </div>
          )}
        </div>
        <div className="modal-actions sticky-actions">
          {existing && (
            <button
              type="button"
              className="icon-button delete-button"
              title="Delete ticket"
              aria-label={`Delete request ${ticketNumber(existing)}`}
              disabled={saving}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={17} />
            </button>
          )}
          {existing && (
            <button
              type="button"
              className="button secondary print-ticket-button"
              onClick={() => onPrint(existing)}
            >
              <Printer size={16} />
              Print saved ticket
            </button>
          )}
          <div className="action-spacer" />
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button primary"
            disabled={saving || !employees.length}
          >
            {saving ? (
              <LoaderCircle size={16} className="spin" />
            ) : existing ? (
              <Check size={16} />
            ) : (
              <Plus size={16} />
            )}{" "}
            {saving
              ? "Saving..."
              : existing
                ? "Save changes"
                : "Create request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
function PrintHeader({ data }: { data: Data }) {
  return (
    <div className="print-header">
      <Image
        className="print-logo"
        src="/philfida-logo.png"
        alt=""
        width={64}
        height={64}
      />
      <div className="print-header-text">
        {data.headerGovernment && <div>{data.headerGovernment}</div>}
        {data.headerDepartment && <div>{data.headerDepartment}</div>}
        {data.headerAgency && <strong>{data.headerAgency}</strong>}
        {data.headerAddress && <div>{data.headerAddress}</div>}
        <div className="print-contact">
          {data.headerEmail && <>Email: {data.headerEmail}</>}
          {data.headerEmail && data.headerWebsite && <span>, </span>}
          {data.headerWebsite && <>Website: {data.headerWebsite}</>}
        </div>
      </div>
    </div>
  );
}

function SettingsEditor({
  data,
  onSave,
}: {
  data: Data;
  onSave: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...Object.fromEntries(new FormData(e.currentTarget)),
        entity: "settings",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className="card settings-card settings-header-card">
      <div className="settings-icon">
        <Pencil size={24} />
      </div>
      <h2>Print header & IT personnel</h2>
      <p>
        Edit the values used in every printed repair request ticket. This keeps
        the same layout reusable for another region or office.
      </p>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
      <form
        key={[
          data.headerGovernment,
          data.headerDepartment,
          data.headerAgency,
          data.headerAddress,
          data.headerEmail,
          data.headerWebsite,
          data.ticketTitle,
          data.itPersonnelName,
          data.itPersonnelPosition,
        ].join("|")}
        onSubmit={submit}
      >
        <div className="form-grid settings-form-grid">
          <label>
            Government line
            <input
              name="headerGovernment"
              defaultValue={data.headerGovernment}
              maxLength={250}
            />
          </label>
          <label>
            Department line
            <input
              name="headerDepartment"
              defaultValue={data.headerDepartment}
              maxLength={250}
            />
          </label>
          <label className="full">
            Agency line <em>*</em>
            <input
              name="headerAgency"
              defaultValue={data.headerAgency}
              required
              maxLength={250}
            />
          </label>
          <label className="full">
            Address line
            <input
              name="headerAddress"
              defaultValue={data.headerAddress}
              maxLength={250}
            />
          </label>
          <label>
            Email line
            <input
              name="headerEmail"
              defaultValue={data.headerEmail}
              maxLength={250}
            />
          </label>
          <label>
            Website line
            <input
              name="headerWebsite"
              defaultValue={data.headerWebsite}
              maxLength={250}
            />
          </label>
          <label className="full">
            Ticket title <em>*</em>
            <input
              name="ticketTitle"
              defaultValue={data.ticketTitle}
              required
              maxLength={120}
            />
          </label>
          <label>
            IT personnel name <em>*</em>
            <input
              name="itPersonnelName"
              defaultValue={data.itPersonnelName}
              required
              maxLength={150}
            />
          </label>
          <label>
            IT personnel position <em>*</em>
            <input
              name="itPersonnelPosition"
              defaultValue={data.itPersonnelPosition}
              required
              maxLength={150}
            />
          </label>
        </div>
        <div className="settings-form-footer">
          <span className="field-hint">
            The logo and PhilFIDA color palette are used automatically in the
            system and print layout.
          </span>
          <button className="button primary" disabled={saving}>
            {saving ? (
              <LoaderCircle size={16} className="spin" />
            ) : (
              <Check size={16} />
            )}{" "}
            {saving ? "Saving..." : "Save print settings"}
          </button>
        </div>
      </form>
    </section>
  );
}

function EmployeeEditor({
  employee,
  onClose,
  onSave,
  onDelete,
}: {
  employee: Employee | "new";
  onClose: () => void;
  onSave: (v: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const person = employee === "new" ? null : employee;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...Object.fromEntries(new FormData(e.currentTarget)),
        entity: "employee",
        id: person?.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save employee.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      title={person ? "Edit employee" : "Add an employee"}
      subtitle="Register their details once. Select their name for every request."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="form-body">
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="form-grid">
            <label className="full">
              Full name <em>*</em>
              <input
                name="name"
                defaultValue={person?.name}
                required
                placeholder="e.g. Maria Santos"
                maxLength={150}
              />
            </label>
            <label className="full">
              Unit / Office <em>*</em>
              <input
                name="office"
                list="office-options"
                defaultValue={person?.office}
                required
                placeholder="Select or enter a unit / office"
                maxLength={200}
              />
              <datalist id="office-options">
                {offices.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </label>
            <label className="full">
              Position <em>*</em>
              <input
                name="position"
                defaultValue={person?.position}
                required
                placeholder="e.g. Administrative Officer IV"
                maxLength={200}
              />
            </label>
            <label className="full">
              Email address <span className="optional">(optional)</span>
              <input
                name="email"
                type="email"
                defaultValue={person?.email || ""}
                placeholder="employee@agency.gov.ph"
                maxLength={200}
              />
            </label>
          </div>
          <div className="info-note">
            <Users size={18} />
            <p>
              {person
                ? "Updates apply to future requests. Employee details on previous tickets are preserved for accurate records."
                : "This employee will be available in the employee selector when you create a request."}
            </p>
          </div>
          {confirm && (
            <div className="delete-confirm">
              <p>
                Remove this employee? Employees with ticket history cannot be
                removed.
              </p>
              <button
                type="button"
                disabled={saving}
                className="button danger"
                onClick={async () => {
                  if (!person) return;
                  setSaving(true);
                  setError("");
                  try {
                    await onDelete(person.id);
                  } catch (err) {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Could not delete employee.",
                    );
                    setConfirm(false);
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                Confirm removal
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setConfirm(false)}
              >
                Keep employee
              </button>
            </div>
          )}
        </div>
        <div className="modal-actions sticky-actions">
          {person && (
            <button
              type="button"
              className="icon-button delete-button"
              aria-label="Delete employee"
              onClick={() => setConfirm(true)}
            >
              <Trash2 size={17} />
            </button>
          )}
          <div className="action-spacer" />
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button primary" disabled={saving}>
            {saving ? (
              <LoaderCircle className="spin" size={16} />
            ) : (
              <Check size={16} />
            )}{" "}
            {saving ? "Saving..." : person ? "Save changes" : "Add employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
