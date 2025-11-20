interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: "contacts" | "appointments";
  onChangeView: (view: "contacts" | "appointments") => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  activeView,
  onChangeView,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-top">
        {!collapsed && <div className="sidebar-title">Mini CRM</div>}
        <button className="btn-ghost small" type="button" onClick={onToggle}>
          {collapsed ? "»" : "«"}
        </button>
      </div>
      <nav className="sidebar-nav">
        <button
          type="button"
          className={
            activeView === "contacts" ? "nav-btn nav-btn-active" : "nav-btn"
          }
          onClick={() => onChangeView("contacts")}
        >
          Kontakte
        </button>
        <button
          type="button"
          className={
            activeView === "appointments" ? "nav-btn nav-btn-active" : "nav-btn"
          }
          onClick={() => onChangeView("appointments")}
        >
          Termine
        </button>
      </nav>
    </aside>
  );
}
