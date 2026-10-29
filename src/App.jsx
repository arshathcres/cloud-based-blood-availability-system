import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Droplet,
  HeartPulse,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { api } from "./services/api.js";

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const components = ["RBC", "PLASMA", "PLATELETS", "WHOLE_BLOOD"];
const navItems = [
  ["/", "Overview"],
  ["/search", "Find blood"],
  ["/banks", "Blood banks"],
  ["/register-bank", "Register bank"],
  ["/request", "Emergency request"],
  ["/track", "Track request"],
  ["/admin", "Admin"],
];

function Alert({ children, tone = "error" }) {
  return children ? (
    <div
      className={`alert ${tone}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      {children}
    </div>
  ) : null;
}
function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}
function PageTitle({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Droplet size={20} fill="currentColor" />
          </span>
          <span>
            blood<span className="brand-light">bridge</span>
            <small>EMERGENCY COORDINATION</small>
          </span>
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={open ? "nav open" : "nav"}
        >
          {navItems.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="top-status">
          <span className="status-dot" /> API-backed data
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>
          BloodBridge <b>·</b> Cloud-based emergency blood coordination
        </span>
        <span>
          For demonstration only. Not a substitute for clinical advice or
          blood-bank confirmation.
        </span>
      </footer>
    </div>
  );
}

function Home() {
  const [banks, setBanks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState("O+");
  const [city, setCity] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    api
      .getBloodBanks()
      .then((d) => setBanks(d?.bloodBanks || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-tag">
            <span className="live-dot" /> CONNECTING CARE, WHEN IT MATTERS
          </div>
          <h1>
            Every second counts.
            <br />
            <em>Find blood nearby.</em>
          </h1>
          <p>
            Search reported blood availability from participating banks and
            coordinate an emergency request from one clear place.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/search">
              <Search size={17} /> Find availability <ArrowRight size={16} />
            </Link>
            <Link className="button soft" to="/request">
              Make an urgent request
            </Link>
          </div>
          <div className="hero-note">
            <ShieldCheck size={16} /> Reported inventory should be confirmed
            directly with the blood bank.
          </div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-cross">
            <Droplet size={84} fill="currentColor" strokeWidth={1.2} />
            <span>+</span>
          </div>
          <div className="float-card float-top">
            <span className="float-icon">
              <Activity size={18} />
            </span>
            <span>
              <b>Live coordination</b>
              <small>API-connected availability</small>
            </span>
          </div>
          <div className="float-card float-bottom">
            <span className="float-pulse">
              <HeartPulse size={20} />
            </span>
            <span>
              <b>Request tracking</b>
              <small>Follow status updates</small>
            </span>
          </div>
          <div className="art-label">CARE IN EVERY DROP</div>
        </div>
      </section>
      <section className="quick-search">
        <div className="quick-heading">
          <span className="section-icon">
            <Search size={18} />
          </span>
          <div>
            <b>Search blood availability</b>
            <small>Search the live directory by blood group and location</small>
          </div>
        </div>
        <div className="quick-fields">
          <Field label="Blood group">
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              {groups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="City or location">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Chennai"
            />
          </Field>
          <button
            className="button primary"
            onClick={() =>
              navigate(
                `/search?bloodGroup=${encodeURIComponent(group)}&city=${encodeURIComponent(city)}`,
              )
            }
          >
            <Search size={16} /> Search availability
          </button>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">QUICK SELECT</div>
            <h2>Choose a blood group</h2>
          </div>
          <Link to="/search" className="text-link">
            Advanced search <ArrowRight size={15} />
          </Link>
        </div>
        <div className="group-grid">
          {groups.map((g) => (
            <Link
              key={g}
              className="group-tile"
              to={`/search?bloodGroup=${encodeURIComponent(g)}`}
            >
              <span className="group-drop">
                <Droplet size={17} fill="currentColor" />
              </span>
              <b>{g}</b>
              <span>Search availability</span>
              <ArrowRight className="tile-arrow" size={15} />
            </Link>
          ))}
        </div>
      </section>
      <section className="split-section">
        <div>
          <div className="eyebrow">SIMPLE, COORDINATED CARE</div>
          <h2>
            From searching to coordinating—
            <br />
            all in one place.
          </h2>
          <p className="body-copy">
            BloodBridge connects people looking for blood with participating
            blood banks through a shared availability and request workflow.
          </p>
          <div className="steps">
            <div>
              <span>01</span>
              <div>
                <b>Search availability</b>
                <small>Look up reported stock by group and location.</small>
              </div>
            </div>
            <div>
              <span>02</span>
              <div>
                <b>Coordinate a request</b>
                <small>Submit a request to a participating bank.</small>
              </div>
            </div>
            <div>
              <span>03</span>
              <div>
                <b>Track the status</b>
                <small>Use your request ID to check progress.</small>
              </div>
            </div>
          </div>
        </div>
        <div className="bank-preview">
          <div className="preview-head">
            <span className="section-icon">
              <Building2 size={18} />
            </span>
            <div>
              <b>Participating blood banks</b>
              <small>Directory from the connected API</small>
            </div>
            <Link to="/banks" aria-label="View blood banks">
              <ArrowRight size={17} />
            </Link>
          </div>
          <Alert>{error}</Alert>
          {loading ? (
            <div className="loading-line">
              <Spinner /> Loading directory…
            </div>
          ) : banks.length ? (
            banks.slice(0, 3).map((b) => (
              <div className="bank-row" key={b.bankId}>
                <span className="bank-avatar">
                  <Building2 size={17} />
                </span>
                <span>
                  <b>{b.name || b.bankName || "Blood bank"}</b>
                  <small>
                    {[b.city, b.address].filter(Boolean).join(" · ")}
                  </small>
                </span>
                <span className="verified">
                  {b.verified ? (
                    <>
                      <CheckCircle2 size={14} /> Verified
                    </>
                  ) : (
                    "Listed"
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="muted empty-small">
              No blood banks returned by the API yet.
            </p>
          )}
          <Link className="preview-link" to="/banks">
            Browse directory <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <section className="cta">
        <div className="cta-mark">
          <HeartPulse size={25} />
        </div>
        <div>
          <div className="eyebrow">NEED HELP COORDINATING?</div>
          <h2>Submit an emergency blood request.</h2>
          <p>
            Provide the necessary details and receive a request ID to track
            status.
          </p>
        </div>
        <Link className="button white" to="/request">
          Start a request <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}

function SearchPage() {
  const params = new URLSearchParams(location.search);
  const [form, setForm] = useState({
    bloodGroup: params.get("bloodGroup") || "O+",
    city: params.get("city") || "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await api.searchBlood({ bloodGroup: form.bloodGroup });
      const all = data?.bloodBanks || [];
      const locationTerm = form.city.trim().toLocaleLowerCase();
      setResults(
        locationTerm
          ? all.filter((bank) =>
              `${bank.city || ""} ${bank.address || ""}`
                .toLocaleLowerCase()
                .includes(locationTerm),
            )
          : all,
      );
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (params.get("bloodGroup")) submit({ preventDefault() {} });
  }, []);
  return (
    <div className="content-page">
      <PageTitle
        eyebrow="LIVE AVAILABILITY"
        title="Find blood availability"
        subtitle="Search reported inventory from participating blood banks."
      />
      <form className="panel search-form" onSubmit={submit}>
        <div className="form-grid">
          <Field label="Blood group">
            <select
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            >
              {groups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="City or location">
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Optional location"
            />
          </Field>
          <button className="button primary" disabled={loading}>
            {loading ? <Spinner /> : <Search size={17} />} Search
          </button>
        </div>
        <p className="form-note">
          Location is matched against the city and address fields returned by
          the API. Component and quantity filters are not available here.
        </p>
      </form>
      <Alert>{error}</Alert>
      {loading && (
        <div className="center-state">
          <Spinner /> Searching live availability…
        </div>
      )}
      {!loading && searched && results.length === 0 && !error && (
        <div className="empty-state">
          <span>
            <Search size={22} />
          </span>
          <h3>No matching availability found</h3>
          <p>
            Try another blood group or location, or contact participating blood
            banks directly.
          </p>
          <button className="button outline" onClick={submit}>
            Retry search
          </button>
        </div>
      )}
      {!loading && results.length > 0 && (
        <>
          <div className="results-meta">
            <b>
              {results.length} {results.length === 1 ? "result" : "results"}
            </b>
            <span>Availability reported by the connected API</span>
          </div>
          <div className="result-grid">
            {results.map((r, i) => (
              <article
                className="result-card"
                key={`${r.bankId}-${r.bloodGroup}-${r.component}-${i}`}
              >
                <div className="result-top">
                  <span className="group-badge">
                    <Droplet size={16} fill="currentColor" />
                    {r.bloodGroup || form.bloodGroup}
                  </span>
                  {r.verified && (
                    <span className="verified">
                      <CheckCircle2 size={14} /> Verified
                    </span>
                  )}
                </div>
                <h3>{r.bankName || r.name || "Blood bank"}</h3>
                <p className="result-address">
                  <Building2 size={15} />
                  {[r.city, r.address].filter(Boolean).join(" · ") ||
                    "Location not provided"}
                </p>
                <div className="inventory-line">
                  <div>
                    <small>Reported availability</small>
                    <b>
                      {r.availableUnits ?? "—"}{" "}
                      <span>
                        {r.availableUnits === undefined ? "" : "units"}
                      </span>
                    </b>
                  </div>
                  <span className="component-pill">
                    {r.component || "Component not specified"}
                  </span>
                </div>
                {r.bankId && (
                  <Link
                    className="contact-link"
                    to={`/request?bankId=${encodeURIComponent(r.bankId)}&bloodGroup=${encodeURIComponent(r.bloodGroup || form.bloodGroup)}&component=${encodeURIComponent(r.component || "RBC")}`}
                  >
                    Request from this bank <ArrowRight size={14} />
                  </Link>
                )}{" "}
                {r.phone && (
                  <a className="bank-phone" href={`tel:${r.phone}`}>
                    Call bank: {r.phone}
                  </a>
                )}
                {r.lastUpdated && (
                  <div className="updated">
                    <Clock3 size={13} /> Updated{" "}
                    {new Date(r.lastUpdated).toLocaleString()}
                  </div>
                )}
              </article>
            ))}
          </div>
          <Alert tone="warning">
            Availability is reported inventory, not a guarantee. Confirm
            suitability and stock directly with the blood bank.
          </Alert>
        </>
      )}
    </div>
  );
}

function BanksPage() {
  const [banks, setBanks] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [filter, setFilter] = useState("");
  const load = () => {
    setLoading(true);
    setError("");
    api
      .getBloodBanks()
      .then((d) => setBanks(d?.bloodBanks || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const shown = banks.filter((b) =>
    `${b.name || b.bankName || ""} ${b.city || ""} ${b.address || ""}`
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );
  return (
    <div className="content-page">
      <PageTitle
        eyebrow="DIRECTORY"
        title="Participating blood banks"
        subtitle="Browse blood banks returned by the live API."
        action={
          <button className="button outline" onClick={load} disabled={loading}>
            {loading ? <Spinner /> : "↻"} Refresh
          </button>
        }
      />
      <div className="toolbar">
        <div className="search-input">
          <Search size={17} />
          <input
            placeholder="Search name, city, or address"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <span className="count-label">{banks.length} listed</span>
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <div className="center-state">
          <Spinner /> Loading directory…
        </div>
      ) : shown.length === 0 ? (
        <div className="empty-state">
          <span>
            <Building2 size={22} />
          </span>
          <h3>{banks.length ? "No matches" : "No banks listed yet"}</h3>
          <p>
            {banks.length
              ? "Try a different search."
              : "The API returned no participating blood banks."}
          </p>
        </div>
      ) : (
        <div className="bank-grid">
          {shown.map((b) => (
            <article className="bank-card" key={b.bankId}>
              <div className="bank-card-icon">
                <Building2 size={20} />
              </div>
              <span className={`status-chip ${b.verified ? "green" : ""}`}>
                {b.verified ? "Verified" : "Listed"}
              </span>
              <h3>{b.name || b.bankName || "Blood bank"}</h3>
              <div className="bank-detail">
                <span>
                  <Activity size={15} />
                </span>
                <div>
                  {b.city || "City not provided"}
                  {b.address && <small>{b.address}</small>}
                </div>
              </div>
              {b.phone && (
                <a className="bank-phone" href={`tel:${b.phone}`}>
                  {b.phone}
                </a>
              )}
              <div className="bank-id">
                Bank ID <b>{b.bankId || "Not provided"}</b>
              </div>
            </article>
          ))}
        </div>
      )}
      <Alert tone="warning">
        Directory fields reflect API data. Confirm current stock and eligibility
        directly with each bank.
      </Alert>
    </div>
  );
}

function RequestPage() {
  const requestParams = new URLSearchParams(location.search);
  const [form, setForm] = useState({
    bankId: requestParams.get("bankId") || "",
    requesterName: "",
    requesterPhone: "",
    bloodGroup: requestParams.get("bloodGroup") || "O+",
    component: requestParams.get("component") || "RBC",
    quantity: 1,
    urgency: "NORMAL",
  });
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [banksError, setBanksError] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const loadBanks = () => {
    setBanksLoading(true);
    setBanksError("");
    api
      .getBloodBanks()
      .then((d) => setBanks(d?.bloodBanks || []))
      .catch((e) => setBanksError(e.message))
      .finally(() => setBanksLoading(false));
  };
  useEffect(loadBanks, []);
  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await api.createBloodRequest({
        ...form,
        quantity: Number(form.quantity),
      });
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  };
  return (
    <div className="content-page narrow">
      <PageTitle
        eyebrow="EMERGENCY COORDINATION"
        title="Create a blood request"
        subtitle="Submit only the information required by the connected API."
      />
      {result ? (
        <div className="success-panel">
          <span>
            <CheckCircle2 size={28} />
          </span>
          <div className="eyebrow">REQUEST SUBMITTED</div>
          <h2>Request received</h2>
          <p>{result.message || "The API confirmed your request."}</p>
          {result.requestId && (
            <div className="request-id">
              <small>YOUR REQUEST ID</small>
              <b>{result.requestId}</b>
            </div>
          )}
          <p className="muted">
            Status: <b>{result.status || "Received"}</b>. Keep the request ID to
            track progress.
          </p>
          <Link
            className="button primary"
            to={`/track?requestId=${encodeURIComponent(result.requestId || "")}`}
          >
            Track this request <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <form
          className="panel form-panel"
          onSubmit={(e) => {
            e.preventDefault();
            setConfirm(true);
          }}
        >
          <Alert>{error}</Alert>
          <Alert>{banksError}</Alert>
          {banksError && (
            <button
              type="button"
              className="button outline retry-banks"
              onClick={loadBanks}
              disabled={banksLoading}
            >
              {banksLoading ? <Spinner /> : "Retry loading banks"}
            </button>
          )}
          <div className="form-grid two">
            <Field label="Participating blood bank">
              <select
                required
                value={form.bankId}
                onChange={(e) => set("bankId", e.target.value)}
                disabled={banksLoading || !banks.length}
              >
                <option value="">
                  {banksLoading
                    ? "Loading blood banks…"
                    : banks.length
                      ? "Choose a blood bank"
                      : "No blood banks available"}
                </option>
                {banks.map((b) => (
                  <option key={b.bankId} value={b.bankId}>
                    {b.name || b.bankName} — {b.city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Blood group">
              <select
                value={form.bloodGroup}
                onChange={(e) => set("bloodGroup", e.target.value)}
              >
                {groups.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Component">
              <select
                value={form.component}
                onChange={(e) => set("component", e.target.value)}
              >
                {components.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Quantity (units)">
              <input
                type="number"
                min="1"
                step="1"
                required
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
              />
            </Field>
            <Field label="Requester name">
              <input
                required
                maxLength="100"
                value={form.requesterName}
                onChange={(e) => set("requesterName", e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Contact phone">
              <input
                type="tel"
                required
                pattern="[0-9+() -]{7,20}"
                value={form.requesterPhone}
                onChange={(e) => set("requesterPhone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
            <Field label="Urgency">
              <select
                value={form.urgency}
                onChange={(e) => set("urgency", e.target.value)}
              >
                <option value="NORMAL">Normal</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </Field>
          </div>
          <p className="form-note">
            The verified contract does not include patient clinical details,
            hospital, or notes. Do not enter sensitive medical information.
          </p>
          <button
            className="button primary full"
            disabled={busy || !banks.length}
          >
            {busy ? <Spinner /> : "Review request"} <ArrowRight size={15} />
          </button>
          {!banks.length && (
            <small className="muted">
              A bank directory response is required to select a bank.
            </small>
          )}
        </form>
      )}
      {confirm && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <button
              className="modal-close"
              onClick={() => setConfirm(false)}
              aria-label="Close"
            >
              <X size={19} />
            </button>
            <div className="eyebrow">FINAL CHECK</div>
            <h2 id="confirm-title">Submit this request?</h2>
            <p>Review the request details before sending them to the API.</p>
            <dl>
              {[
                [
                  "Blood bank",
                  banks.find((b) => b.bankId === form.bankId)?.name ||
                    form.bankId,
                ],
                ["Blood group", form.bloodGroup],
                ["Component", form.component],
                ["Quantity", `${form.quantity} unit(s)`],
                ["Urgency", form.urgency],
                ["Requester", form.requesterName],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="modal-actions">
              <button
                className="button outline"
                onClick={() => setConfirm(false)}
              >
                Back to edit
              </button>
              <button
                className="button primary"
                disabled={busy}
                onClick={submit}
              >
                {busy ? <Spinner /> : "Confirm and submit"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function RegisterBank() {
  const [form, setForm] = useState({
      bankId: "",
      name: "",
      city: "",
      address: "",
      phone: "",
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState(null);
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      setResult(await api.addBloodBank(form));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="content-page narrow">
      <PageTitle
        eyebrow="PARTICIPATING BANKS"
        title="Register a blood bank"
        subtitle="Submit a registration using the fields required by the existing API."
      />
      {result ? (
        <div className="success-panel">
          <span>
            <CheckCircle2 size={28} />
          </span>
          <div className="eyebrow">API CONFIRMED</div>
          <h2>Registration submitted</h2>
          <p>{result.message || "The API accepted the registration."}</p>
          {result.bloodBank?.bankId && (
            <div className="request-id">
              <small>BANK ID</small>
              <b>{result.bloodBank.bankId}</b>
            </div>
          )}
          <button className="button outline" onClick={() => setResult(null)}>
            Register another bank
          </button>
        </div>
      ) : (
        <form className="panel form-panel" onSubmit={submit}>
          <Alert>{error}</Alert>
          <div className="form-grid two">
            <Field label="Bank ID">
              <input
                required
                maxLength="64"
                value={form.bankId}
                onChange={(e) => update("bankId", e.target.value)}
                placeholder="Unique identifier"
              />
            </Field>
            <Field label="Blood bank name">
              <input
                required
                maxLength="120"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>
            <Field label="City">
              <input
                required
                maxLength="100"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </Field>
            <Field label="Contact phone">
              <input
                required
                type="tel"
                pattern="[0-9+() -]{7,20}"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
            <div className="span-two">
              <Field label="Address">
                <input
                  required
                  maxLength="200"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </Field>
            </div>
          </div>
          <p className="form-note">
            Registration writes to the connected API. Only submit information
            you are authorized to provide.
          </p>
          <button className="button primary full" disabled={busy}>
            {busy ? <Spinner /> : "Submit registration"}{" "}
            <ArrowRight size={15} />
          </button>
        </form>
      )}
    </div>
  );
}

function TrackPage() {
  const [requestId, setRequestId] = useState(
    new URLSearchParams(location.search).get("requestId") || "",
  );
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      setData(await api.trackBloodRequest(requestId.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (requestId) submit();
  }, []);
  return (
    <div className="content-page narrow">
      <PageTitle
        eyebrow="REQUEST STATUS"
        title="Track a request"
        subtitle="Enter the request ID returned by the API when the request was created."
      />
      <form className="panel tracking-form" onSubmit={submit}>
        <Field label="Request ID">
          <input
            required
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            placeholder="e.g. REQ-…"
          />
        </Field>
        <button className="button primary" disabled={loading}>
          {loading ? <Spinner /> : <Search size={16} />} Track request
        </button>
      </form>
      <Alert>{error}</Alert>
      {loading && (
        <div className="center-state">
          <Spinner /> Checking request status…
        </div>
      )}
      {data && (
        <article className="tracking-card">
          <div className="tracking-head">
            <div>
              <div className="eyebrow">REQUEST DETAILS</div>
              <h2>{data.requestId || requestId}</h2>
            </div>
            <span
              className={`status-chip ${String(data.status).toLowerCase()}`}
            >
              {data.status || "Status unavailable"}
            </span>
          </div>
          <div className="track-grid">
            {[
              ["Blood group", data.bloodGroup],
              ["Component", data.component],
              ["Quantity", data.quantity],
              ["Urgency", data.urgency],
              ["Blood bank", data.bankId],
              [
                "Created",
                data.createdAt && new Date(data.createdAt).toLocaleString(),
              ],
            ]
              .filter(([, v]) => v !== undefined && v !== null)
              .map(([k, v]) => (
                <div key={k}>
                  <small>{k}</small>
                  <b>{v}</b>
                </div>
              ))}
          </div>
          <div className="status-note">
            <Clock3 size={16} />
            <span>
              Status is shown as reported by the API. Contact the blood bank for
              urgent clinical coordination.
            </span>
          </div>
        </article>
      )}
      <div className="privacy-note">
        <ShieldCheck size={17} />
        <p>
          Tracking uses the request ID as returned by this API. The backend does
          not appear to require additional identity verification; avoid sharing
          request IDs publicly. This demo should not be used for sensitive
          patient data.
        </p>
      </div>
    </div>
  );
}

function Login({ onAuth }) {
  const [password, setPassword] = useState(""),
    [error, setError] = useState("");
  const expected = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "demo-admin";
  const submit = (e) => {
    e.preventDefault();
    if (password === expected) {
      sessionStorage.setItem("bb-demo-admin", "true");
      onAuth(true);
    } else setError("Incorrect demo password.");
  };
  return (
    <div className="content-page narrow">
      <PageTitle
        eyebrow="DEMO ACCESS"
        title="Admin sign in"
        subtitle="Demo-only client-side gate; it does not authorize API operations."
      />
      <form className="panel form-panel" onSubmit={submit}>
        <div className="demo-warning">
          <ShieldCheck size={18} />
          <span>
            This password gate is not backend security. Do not use sensitive
            data.
          </span>
        </div>
        <Alert>{error}</Alert>
        <Field label="Demonstration password">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <button className="button primary full">Continue to admin demo</button>
        <small className="muted">
          Configure <code>VITE_DEMO_ADMIN_PASSWORD</code>; default is{" "}
          <code>demo-admin</code>.
        </small>
      </form>
    </div>
  );
}

function AdminRegisterBank({ onCreated }) {
  const [form, setForm] = useState({
      bankId: "",
      name: "",
      city: "",
      address: "",
      phone: "",
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api.addBloodBank(form);
      setNotice(result?.message || "Blood bank registered successfully.");
      setForm({ bankId: "", name: "", city: "", address: "", phone: "" });
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel admin-panel">
      <div className="panel-title">
        <div>
          <div className="eyebrow">REGISTRATION</div>
          <h2>Add a blood bank</h2>
        </div>
        <span className="section-icon">
          <Building2 size={18} />
        </span>
      </div>
      <Alert>{error}</Alert>
      <Alert tone="success">{notice}</Alert>
      <form onSubmit={submit}>
        <Field label="Bank ID">
          <input
            required
            maxLength="64"
            value={form.bankId}
            onChange={(e) => set("bankId", e.target.value)}
            placeholder="Unique identifier"
          />
        </Field>
        <Field label="Blood bank name">
          <input
            required
            maxLength="120"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="City">
          <input
            required
            maxLength="100"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field label="Address">
          <input
            required
            maxLength="200"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>
        <Field label="Contact phone">
          <input
            required
            type="tel"
            pattern="[0-9+() -]{7,20}"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <button className="button primary full" disabled={busy}>
          {busy ? <Spinner /> : "Register bank"} <ArrowRight size={15} />
        </button>
      </form>
      <p className="form-note">
        This writes a new record to the connected API. The backend must enforce
        authorization and unique IDs.
      </p>
    </section>
  );
}

function DeleteBank({ banks, onDeleted }) {
  const [bankId, setBankId] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [confirm, setConfirm] = useState(false);
  const bank = banks.find((item) => item.bankId === bankId);
  const remove = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api.deleteBloodBank(bankId);
      setNotice(result?.message || "Blood bank deleted successfully.");
      setBankId("");
      setConfirm(false);
      onDeleted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel admin-panel delete-panel">
      <div className="panel-title">
        <div>
          <div className="eyebrow">DANGER ZONE</div>
          <h2>Delete a blood bank</h2>
        </div>
        <span className="section-icon delete-icon">
          <X size={18} />
        </span>
      </div>
      <p className="delete-help">
        Permanently remove a bank from the connected directory. This action may
        not be reversible.
      </p>
      <Alert>{error}</Alert>
      <Alert tone="success">{notice}</Alert>
      <Field label="Blood bank to delete">
        <select value={bankId} onChange={(e) => setBankId(e.target.value)}>
          <option value="">Choose a blood bank</option>
          {banks.map((item) => (
            <option key={item.bankId} value={item.bankId}>
              {item.name || item.bankName || "Blood bank"} · {item.bankId}
            </option>
          ))}
        </select>
      </Field>
      <button
        type="button"
        className="button danger-button full"
        disabled={!bank || busy}
        onClick={() => {
          setError("");
          setConfirm(true);
        }}
      >
        Delete selected bank
      </button>
      {!banks.length && (
        <small className="muted">No banks are available to delete.</small>
      )}
      {confirm && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <button
              className="modal-close"
              onClick={() => setConfirm(false)}
              aria-label="Close"
              disabled={busy}
            >
              <X size={19} />
            </button>
            <div className="eyebrow">PERMANENT ACTION</div>
            <h2 id="delete-confirm-title">Delete this blood bank?</h2>
            <p>
              This will send a delete request to the API for the selected bank.
              Please confirm the record before continuing.
            </p>
            <dl>
              <div>
                <dt>Blood bank</dt>
                <dd>{bank?.name || bank?.bankName || "Blood bank"}</dd>
              </div>
              <div>
                <dt>Bank ID</dt>
                <dd>{bank?.bankId}</dd>
              </div>
            </dl>
            <div className="modal-actions">
              <button
                className="button outline"
                disabled={busy}
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="button danger-button"
                disabled={busy}
                onClick={remove}
              >
                {busy ? <Spinner /> : "Yes, delete bank"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function Admin({ authenticated, onAuth }) {
  const [banks, setBanks] = useState([]),
    [requests, setRequests] = useState([]),
    [selected, setSelected] = useState(""),
    [activeTab, setActiveTab] = useState("banks"),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [acting, setActing] = useState(""),
    [inventory, setInventory] = useState({
      bloodGroup: "O+",
      component: "RBC",
      availableUnits: 0,
    });
  const loadBanks = () =>
    api.getBloodBanks().then((d) => {
      const list = d?.bloodBanks || [];
      setBanks(list);
      if (!list.some((b) => b.bankId === selected))
        setSelected(list[0]?.bankId || "");
    });
  const load = async () => {
    setLoading(true);
    setError("");
    setNotice("");
    setRequests([]);
    try {
      const d = await api.getBloodBanks();
      const list = d?.bloodBanks || [];
      setBanks(list);
      const bankId = list.some((b) => b.bankId === selected)
        ? selected
        : list[0]?.bankId || "";
      if (bankId !== selected) setSelected(bankId);
      else if (bankId) {
        const req = await api.getBankRequests(bankId);
        setRequests(req?.requests || []);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (authenticated) load();
  }, [authenticated]);
  useEffect(() => {
    if (!authenticated || !selected) {
      setRequests([]);
      return;
    }
    let active = true;
    const fetchRequests = async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
        setRequests([]);
      }
      setError("");
      try {
        const d = await api.getBankRequests(selected);
        if (active) setRequests(d?.requests || []);
      } catch (e) {
        if (active) {
          setRequests([]);
          setError(e.message);
        }
      } finally {
        if (active && showLoading) setLoading(false);
      }
    };
    fetchRequests(true);
    const timer = setInterval(() => fetchRequests(), 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [selected, authenticated]);
  const pendingCount = requests.filter(
    (r) => String(r.status).toUpperCase() === "PENDING",
  ).length;
  const update = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      const d = await api.updateInventory({
        bankId: selected,
        ...inventory,
        availableUnits: Number(inventory.availableUnits),
      });
      setNotice(d?.message || "Inventory updated.");
    } catch (e) {
      setError(e.message);
    }
  };
  const action = async (id, action) => {
    setError("");
    setNotice("");
    setActing(id);
    try {
      const d = await api.manageBloodRequest({ requestId: id, action });
      setNotice(d?.message || "Request updated.");
      const r = await api.getBankRequests(selected);
      setRequests(r?.requests || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setActing("");
    }
  };
  if (!authenticated) return <Login onAuth={onAuth} />;
  return (
    <div className="content-page admin-dashboard">
      <PageTitle
        eyebrow="STAFF TOOLS · DEMO GATE"
        title="Blood bank management"
        subtitle="Manage inventory and incoming requests through the existing API."
        action={
          <button className="button outline" onClick={load} disabled={loading}>
            {loading ? <Spinner /> : "↻"} Refresh
          </button>
        }
      />
      <div className="demo-warning wide">
        <ShieldCheck size={18} />
        <span>
          Demo-only access control. API authorization and bank ownership are not
          enforced by this frontend. Do not use for real patient or operational
          data.
        </span>
        <button
          className="text-link"
          onClick={() => {
            sessionStorage.removeItem("bb-demo-admin");
            onAuth(false);
          }}
        >
          Sign out
        </button>
      </div>
      <Alert>{error}</Alert>
      <Alert tone="success">{notice}</Alert>
      <div
        className="admin-tabs"
        role="group"
        aria-label="Admin dashboard categories"
      >
        <button
          type="button"
          aria-pressed={activeTab === "banks"}
          className={activeTab === "banks" ? "admin-tab active" : "admin-tab"}
          onClick={() => setActiveTab("banks")}
        >
          <Building2 size={17} /> Blood Bank Management
        </button>
        <button
          type="button"
          aria-pressed={activeTab === "inventory"}
          className={
            activeTab === "inventory" ? "admin-tab active" : "admin-tab"
          }
          onClick={() => setActiveTab("inventory")}
        >
          <Activity size={17} /> Inventory Management
        </button>
        <button
          type="button"
          aria-pressed={activeTab === "requests"}
          className={
            activeTab === "requests" ? "admin-tab active" : "admin-tab"
          }
          onClick={() => setActiveTab("requests")}
        >
          <HeartPulse size={17} /> Emergency Requests
        </button>
      </div>
      {activeTab === "banks" && (
        <div className="admin-layout bank-management-grid">
          <AdminRegisterBank onCreated={loadBanks} />
          <DeleteBank banks={banks} onDeleted={loadBanks} />
        </div>
      )}
      {activeTab === "inventory" && (
        <div className="admin-layout inventory-layout">
          <section className="panel admin-panel">
            <div className="panel-title">
              <div>
                <div className="eyebrow">INVENTORY</div>
                <h2>Update availability</h2>
              </div>
              <span className="section-icon">
                <Activity size={18} />
              </span>
            </div>
            <form onSubmit={update}>
              <Field label="Blood bank">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  required
                >
                  <option value="">Choose a bank</option>
                  {banks.map((b) => (
                    <option key={b.bankId} value={b.bankId}>
                      {b.name || b.bankName} · {b.bankId}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="form-grid two">
                <Field label="Blood group">
                  <select
                    value={inventory.bloodGroup}
                    onChange={(e) =>
                      setInventory({ ...inventory, bloodGroup: e.target.value })
                    }
                  >
                    {groups.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Component">
                  <select
                    value={inventory.component}
                    onChange={(e) =>
                      setInventory({ ...inventory, component: e.target.value })
                    }
                  >
                    {components.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Available units">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={inventory.availableUnits}
                  onChange={(e) =>
                    setInventory({
                      ...inventory,
                      availableUnits: e.target.value,
                    })
                  }
                  required
                />
              </Field>
              <button className="button primary full" disabled={!selected}>
                Save inventory
              </button>
            </form>
          </section>
          <aside className="panel admin-panel inventory-info">
            <span className="section-icon">
              <Droplet size={21} />
            </span>
            <h2>Availability updates</h2>
            <p>
              Choose a bank, blood group, component, and unit count to publish
              an inventory update.
            </p>
            <p>
              The current API supports updating inventory but does not provide
              an inventory read operation for this dashboard, so saved stock
              cannot be displayed here.
            </p>
            <Alert tone="warning">
              Reported availability should be confirmed directly with the blood
              bank.
            </Alert>
          </aside>
        </div>
      )}
      {activeTab === "requests" && (
        <div className="admin-layout requests-layout">
          <section
            className="panel admin-panel requests-panel"
            id="incoming-requests"
          >
            <div className="panel-title">
              <div>
                <div className="eyebrow">INCOMING REQUESTS</div>
                <h2>Review and respond</h2>
              </div>
              <div
                className={`pending-badge ${pendingCount ? "has-pending" : ""}`}
              >
                {pendingCount} pending
              </div>
            </div>
            <p className="request-help">
              Requests are listed for the selected blood bank. Refresh or leave
              this page open to check for new requests.
            </p>
            <Field label="Selected bank">
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="">Choose a bank</option>
                {banks.map((b) => (
                  <option key={b.bankId} value={b.bankId}>
                    {b.name || b.bankName}
                  </option>
                ))}
              </select>
            </Field>
            {loading ? (
              <div className="loading-line">
                <Spinner /> Loading requests…
              </div>
            ) : !selected ? (
              <div className="empty-small">
                Register or select a blood bank to load its request queue.
              </div>
            ) : !requests.length ? (
              <div className="empty-small">
                No requests returned for this bank yet. New requests for this
                bank will appear here.
              </div>
            ) : (
              requests.map((r) => (
                <div
                  className={`request-row ${String(r.urgency).toUpperCase() === "EMERGENCY" && String(r.status).toUpperCase() === "PENDING" ? "emergency-request" : ""}`}
                  key={r.requestId}
                >
                  <div className="request-row-main">
                    <b>
                      {String(r.urgency).toUpperCase() === "EMERGENCY" && (
                        <span className="urgent-flag">EMERGENCY</span>
                      )}{" "}
                      {r.bloodGroup} · {r.component} <span>× {r.quantity}</span>
                    </b>
                    <small>
                      {r.requesterName || "Requester"} · {r.urgency || "—"}
                    </small>
                    <small className="mono">{r.requestId}</small>
                    {r.requesterPhone && (
                      <small>Contact: {r.requesterPhone}</small>
                    )}
                  </div>
                  <span
                    className={`status-chip ${String(r.status).toLowerCase()}`}
                  >
                    {r.status}
                  </span>
                  {String(r.status).toUpperCase() === "PENDING" && (
                    <div className="request-actions">
                      <button
                        className="button mini accept"
                        disabled={acting === r.requestId}
                        onClick={() => action(r.requestId, "ACCEPT")}
                      >
                        {acting === r.requestId ? "Saving…" : "Accept request"}
                      </button>
                      <button
                        className="button mini reject"
                        disabled={acting === r.requestId}
                        onClick={() => action(r.requestId, "REJECT")}
                      >
                        {acting === r.requestId ? "Saving…" : "Reject request"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </section>
        </div>
      )}
      <div className="privacy-note">
        <ShieldCheck size={17} />
        <p>
          Requests can include contact information. This page displays fields
          returned by the API without backend identity or ownership
          verification. Restrict API access before real use.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("bb-demo-admin") === "true",
  );
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/banks" element={<BanksPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/register-bank" element={<RegisterBank />} />
        <Route path="/track" element={<TrackPage />} />
        <Route
          path="/admin"
          element={
            <Admin authenticated={authenticated} onAuth={setAuthenticated} />
          }
        />
        <Route
          path="*"
          element={
            <div className="content-page">
              <PageTitle eyebrow="NOT FOUND" title="Page not found" />
              <Link className="button primary" to="/">
                Back to overview
              </Link>
            </div>
          }
        />
      </Routes>
    </Shell>
  );
}
