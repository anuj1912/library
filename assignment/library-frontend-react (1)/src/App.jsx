import React, { useEffect, useMemo, useState } from "react";
import { api, API_BASE_URL } from "./api.js";
import Section from "./components/Section.jsx";
import Toast from "./components/Toast.jsx";

function formatDate(val) {
  if (!val) return "-";
  try {
    return new Date(val).toLocaleString();
  } catch {
    return String(val);
  }
}

export default function App() {
  const [tab, setTab] = useState("books");

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => setToast({ message, type });
  const clearToast = () => setToast({ message: "", type: "info" });

  async function refreshBooks() {
    const data = await api.listBooks();
    setBooks(Array.isArray(data) ? data : []);
  }

  async function refreshMembers() {
    const data = await api.listMembers();
    setMembers(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    // initial load
    (async () => {
      try {
        await Promise.all([refreshBooks(), refreshMembers()]);
      } catch (e) {
        showToast(e.message || "Failed to load data. Is backend running?", "error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = useMemo(() => {
    if (tab === "books") return <BooksPanel books={books} onRefresh={refreshBooks} onToast={showToast} />;
    if (tab === "members") return <MembersPanel members={members} onRefresh={refreshMembers} onToast={showToast} />;
    return <BorrowPanel books={books} members={members} onRefreshAll={async()=>{await refreshBooks(); await refreshMembers();}} onToast={showToast} />;
  }, [tab, books, members]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand__logo">📚</div>
          <div>
            <div className="brand__title">Neighborhood Library</div>
            <div className="brand__subtitle">Frontend (React) — API: {API_BASE_URL}</div>
          </div>
        </div>

        <nav className="tabs">
          <button className={`tab ${tab === "books" ? "tab--active" : ""}`} onClick={() => setTab("books")}>Books</button>
          <button className={`tab ${tab === "members" ? "tab--active" : ""}`} onClick={() => setTab("members")}>Members</button>
          <button className={`tab ${tab === "borrow" ? "tab--active" : ""}`} onClick={() => setTab("borrow")}>Borrow / Return</button>
        </nav>
      </header>

      <main className="container">
        {content}
      </main>

      <Toast message={toast.message} type={toast.type} onClose={clearToast} />
    </div>
  );
}

function BooksPanel({ books, onRefresh, onToast }) {
  const [form, setForm] = useState({ title: "", author: "", isbn: "", total_copies: 1 });

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        isbn: form.isbn.trim() || null,
        total_copies: Number(form.total_copies || 1),
      };
      if (!payload.title || !payload.author) throw new Error("Title and author are required.");
      await api.createBook(payload);
      setForm({ title: "", author: "", isbn: "", total_copies: 1 });
      await onRefresh();
      onToast("Book created successfully.", "success");
    } catch (err) {
      onToast(err.message || "Failed to create book.", "error");
    }
  }

  return (
    <div className="grid">
      <Section
        title="Add a Book"
        subtitle="Create a new book record"
      >
        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Title *</span>
            <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="e.g., Clean Code" />
          </label>
          <label className="field">
            <span>Author *</span>
            <input value={form.author} onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))} placeholder="e.g., Robert C. Martin" />
          </label>
          <label className="field">
            <span>ISBN</span>
            <input value={form.isbn} onChange={(e) => setForm((s) => ({ ...s, isbn: e.target.value }))} placeholder="optional" />
          </label>
          <label className="field">
            <span>Total copies</span>
            <input type="number" min="1" value={form.total_copies} onChange={(e) => setForm((s) => ({ ...s, total_copies: e.target.value }))} />
          </label>

          <div className="row">
            <button className="btn" type="submit">Create Book</button>
            <button className="btn btn--ghost" type="button" onClick={onRefresh}>Refresh list</button>
          </div>
        </form>
      </Section>

      <Section
        title="Books"
        subtitle="All books in the system"
        actions={<button className="btn btn--ghost" onClick={onRefresh}>Refresh</button>}
      >
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Total</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {books?.length ? books.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.total_copies}</td>
                  <td>{b.available_copies}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="muted">No books yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function MembersPanel({ members, onRefresh, onToast }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
      };
      if (!payload.name) throw new Error("Member name is required.");
      await api.createMember(payload);
      setForm({ name: "", email: "", phone: "" });
      await onRefresh();
      onToast("Member created successfully.", "success");
    } catch (err) {
      onToast(err.message || "Failed to create member.", "error");
    }
  }

  return (
    <div className="grid">
      <Section title="Add a Member" subtitle="Create a new member record">
        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Name *</span>
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g., Anuj Singh" />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="optional" />
          </label>
          <label className="field">
            <span>Phone</span>
            <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="optional" />
          </label>

          <div className="row">
            <button className="btn" type="submit">Create Member</button>
            <button className="btn btn--ghost" type="button" onClick={onRefresh}>Refresh list</button>
          </div>
        </form>
      </Section>

      <Section
        title="Members"
        subtitle="All members in the system"
        actions={<button className="btn btn--ghost" onClick={onRefresh}>Refresh</button>}
      >
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {members?.length ? members.map((m) => (
                <tr key={m.id}>
                  <td className="mono">{m.id}</td>
                  <td>{m.name}</td>
                  <td>{m.email || "-"}</td>
                  <td>{m.phone || "-"}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="muted">No members yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function BorrowPanel({ books, members, onRefreshAll, onToast }) {
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [borrowResult, setBorrowResult] = useState(null);

  const [recordId, setRecordId] = useState("");

  async function borrow(e) {
    e.preventDefault();
    try {
      if (!bookId) throw new Error("Select a book.");
      if (!memberId) throw new Error("Select a member.");
      const res = await api.borrowBook(bookId, memberId);
      setBorrowResult(res);
      setRecordId(res?.id || "");
      await onRefreshAll();
      onToast("Borrow recorded successfully.", "success");
    } catch (err) {
      onToast(err.message || "Failed to borrow.", "error");
    }
  }

  async function doReturn(e) {
    e.preventDefault();
    try {
      const id = recordId.trim();
      if (!id) throw new Error("Borrow record id is required.");
      const res = await api.returnBook(id);
      setBorrowResult(res);
      await onRefreshAll();
      onToast("Return recorded successfully.", "success");
    } catch (err) {
      onToast(err.message || "Failed to return.", "error");
    }
  }

  return (
    <div className="grid">
      <Section title="Borrow a Book" subtitle="Creates a borrow record and reduces available copies">
        <form className="form" onSubmit={borrow}>
          <label className="field">
            <span>Book</span>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">-- Select book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author} (avail: {b.available_copies})
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Member</span>
            <select value={memberId} onChange={(e) => setMemberId(e.target.value)}>
              <option value="">-- Select member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email || "no email"})
                </option>
              ))}
            </select>
          </label>

          <div className="row">
            <button className="btn" type="submit">Borrow</button>
            <button className="btn btn--ghost" type="button" onClick={() => { setBorrowResult(null); setRecordId(""); }}>Clear</button>
          </div>

          {borrowResult?.id ? (
            <div className="result">
              <div><b>Borrow record id:</b> <span className="mono">{borrowResult.id}</span></div>
              <div><b>Borrowed at:</b> {formatDate(borrowResult.borrowed_at)}</div>
              <div><b>Due date:</b> {formatDate(borrowResult.due_date)}</div>
              <div><b>Returned at:</b> {formatDate(borrowResult.returned_at)}</div>
            </div>
          ) : null}
        </form>
      </Section>

      <Section title="Return a Book" subtitle="Return by borrow record id (from borrow response)">
        <form className="form" onSubmit={doReturn}>
          <label className="field">
            <span>Borrow record id</span>
            <input value={recordId} onChange={(e) => setRecordId(e.target.value)} placeholder="paste record id here" />
          </label>

          <div className="row">
            <button className="btn" type="submit">Return</button>
          </div>

          {borrowResult?.returned_at ? (
            <div className="result">
              <div><b>Returned at:</b> {formatDate(borrowResult.returned_at)}</div>
            </div>
          ) : null}
        </form>
      </Section>
    </div>
  );
}
