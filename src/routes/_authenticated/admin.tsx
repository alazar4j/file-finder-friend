import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useRoles } from "@/hooks/useRoles";
import { useLang } from "@/lib/i18n";
import { createPosterAccount, listAccounts, setPosterRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Gospel for Generation Church" },
      { name: "description", content: "Manage church events, sermons, audio and poster accounts." },
      { property: "og:title", content: "Admin Dashboard — Gospel for Generation Church" },
      { property: "og:description", content: "Content management for church administrators and posters." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:border-gold focus:outline-none";
const goldBtn =
  "inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 font-medium text-primary transition-opacity hover:opacity-90 disabled:opacity-50";
const ghostBtn =
  "inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-gold hover:text-gold";

function AdminPage() {
  const { pick } = useLang();
  const { loading, canPost, isAdmin, user } = useRoles();
  const [tab, setTab] = useState<"events" | "sermons" | "accounts">("events");

  if (loading) return <Shell><p className="text-muted-foreground">{pick("Loading…", "በመጫን ላይ…")}</p></Shell>;
  if (!canPost)
    return (
      <Shell>
        <h1 className="text-3xl">{pick("Access restricted", "መዳረሻ የተገደበ ነው")}</h1>
        <p className="mt-3 text-muted-foreground">
          {pick(
            `${user?.email ?? "This account"} is not an admin or poster. Ask the primary admin to grant access.`,
            "ይህ መለያ አስተዳዳሪ ወይም ለጣፊ አይደለም። ዋናውን አስተዳዳሪ ይጠይቁ።",
          )}
        </p>
        <Link to="/" className={`${goldBtn} mt-6`}>{pick("Back to home", "ወደ መነሻ")}</Link>
      </Shell>
    );

  const tabs = [
    { id: "events" as const, label: pick("Upcoming events", "መጪ ዝግጅቶች") },
    { id: "sermons" as const, label: pick("Recent events & sermons", "የቅርብ ስብከቶች") },
    ...(isAdmin ? [{ id: "accounts" as const, label: pick("Accounts", "መለያዎች") }] : []),
  ];

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-widest text-gold">{isAdmin ? pick("Administrator", "አስተዳዳሪ") : pick("Poster", "ለጣፊ")}</p>
          <h1 className="text-4xl">{pick("Admin Dashboard", "የአስተዳዳሪ ዳሽቦርድ")}</h1>
        </div>
        <span className="text-sm text-muted-foreground">{user?.email}</span>
      </div>
      <div role="tablist" className="mb-8 flex flex-wrap gap-2 border-b border-gold/30">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm transition-colors ${tab === t.id ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "events" ? <EventsAdmin /> : tab === "sermons" ? <SermonsAdmin /> : <AccountsAdmin />}
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto w-full max-w-[1100px]">{children}</div>
    </main>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="my-8 w-full max-w-2xl rounded-lg border border-gold/40 bg-primary p-6 text-primary-foreground shadow-soft">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full text-gold hover:bg-gold/15">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-sm text-primary-foreground/80">{label}</span>
      {children}
    </label>
  );
}

/* ---------------- Events ---------------- */

type EventRow = Tables<"events">;
const emptyEvent = { day_label: "", month_label: "", title_en: "", title_am: "", description_en: "", description_am: "", meta_en: "", meta_am: "", sort_order: 0 };

function EventsAdmin() {
  const { pick } = useLang();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<(typeof emptyEvent & { id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  async function save() {
    if (!editing) return;
    if (!editing.title_en.trim() || !editing.title_am.trim() || !editing.day_label.trim() || !editing.month_label.trim()) {
      toast.error(pick("Fill in titles, day and month.", "ርዕሶችን፣ ቀንና ወርን ይሙሉ።"));
      return;
    }
    setSaving(true);
    const { id, ...payload } = editing;
    const { error } = id
      ? await supabase.from("events").update(payload).eq("id", id)
      : await supabase.from("events").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(pick("Event saved", "ዝግጅቱ ተቀምጧል"));
    setEditing(null);
    void qc.invalidateQueries({ queryKey: ["events"] });
  }

  async function remove(e: EventRow) {
    if (!confirm(pick(`Delete "${e.title_en}"?`, `"${e.title_am}" ይሰረዝ?`))) return;
    const { error } = await supabase.from("events").delete().eq("id", e.id);
    if (error) return toast.error(error.message);
    toast.success(pick("Event deleted", "ዝግጅቱ ተሰርዟል"));
    void qc.invalidateQueries({ queryKey: ["events"] });
  }

  const set = (k: keyof typeof emptyEvent, v: string | number) => setEditing((p) => (p ? { ...p, [k]: v } : p));

  return (
    <section>
      <div className="mb-4 flex justify-end">
        <button type="button" className={goldBtn} onClick={() => setEditing({ ...emptyEvent, sort_order: (data?.length ?? 0) + 1 })}>
          <Plus className="h-4 w-4" /> {pick("Add event", "ዝግጅት ጨምር")}
        </button>
      </div>
      {isLoading ? <p className="text-muted-foreground">…</p> : null}
      {data?.length === 0 ? <p className="text-muted-foreground">{pick("No events yet.", "እስካሁን ዝግጅት የለም።")}</p> : null}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {data?.map((e) => (
          <li key={e.id} className="grid min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]">
            <div className="text-center">
              <div className="display text-2xl text-gold">{e.day_label}</div>
              <div className="text-xs text-muted-foreground">{e.month_label}</div>
            </div>
            <div className="min-w-0">
              <p className="font-medium">{pick(e.title_en, e.title_am)}</p>
              <p className="truncate text-sm text-muted-foreground">{pick(e.meta_en, e.meta_am)}</p>
            </div>
            <div className="col-span-2 flex gap-2 sm:col-span-1">
              <button type="button" className={ghostBtn} onClick={() => setEditing({ ...e })}><Pencil className="h-4 w-4" />{pick("Edit", "አርትዕ")}</button>
              <button type="button" className={`${ghostBtn} hover:!border-destructive hover:!text-destructive`} onClick={() => remove(e)}><Trash2 className="h-4 w-4" />{pick("Delete", "ሰርዝ")}</button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal title={editing.id ? pick("Edit event", "ዝግጅት አርትዕ") : pick("New event", "አዲስ ዝግጅት")} onClose={() => setEditing(null)}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={pick("Day (e.g. 14)", "ቀን")}><input className={inputCls} value={editing.day_label} onChange={(e) => set("day_label", e.target.value)} maxLength={10} /></Field>
            <Field label={pick("Month (e.g. OCT)", "ወር")}><input className={inputCls} value={editing.month_label} onChange={(e) => set("month_label", e.target.value)} maxLength={20} /></Field>
            <Field label={pick("Order", "ቅደም ተከተል")}><input type="number" className={inputCls} value={editing.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title (English)"><input className={inputCls} value={editing.title_en} onChange={(e) => set("title_en", e.target.value)} /></Field>
            <Field label="ርዕስ (አማርኛ)"><input className={inputCls} value={editing.title_am} onChange={(e) => set("title_am", e.target.value)} /></Field>
            <Field label="Description (English)"><textarea rows={3} className={inputCls} value={editing.description_en} onChange={(e) => set("description_en", e.target.value)} /></Field>
            <Field label="መግለጫ (አማርኛ)"><textarea rows={3} className={inputCls} value={editing.description_am} onChange={(e) => set("description_am", e.target.value)} /></Field>
            <Field label="Time / place (English)"><input className={inputCls} value={editing.meta_en} onChange={(e) => set("meta_en", e.target.value)} /></Field>
            <Field label="ሰዓት / ቦታ (አማርኛ)"><input className={inputCls} value={editing.meta_am} onChange={(e) => set("meta_am", e.target.value)} /></Field>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className={ghostBtn} onClick={() => setEditing(null)}>{pick("Cancel", "ይቅር")}</button>
            <button type="button" className={goldBtn} disabled={saving} onClick={save}>{saving ? "…" : pick("Save", "አስቀምጥ")}</button>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}

/* ---------------- Sermons ---------------- */

type SermonRow = Tables<"sermons">;
const emptySermon = {
  title_en: "", title_am: "", speaker_en: "Pastor Gutema", speaker_am: "ፓስተር ጉተማ", date_en: "", date_am: "",
  reference_en: "", reference_am: "", description_en: "", description_am: "", media_url: "" as string | null,
  preached_on: "" as string | null, audio_path: null as string | null, audio_url: null as string | null,
};

function SermonsAdmin() {
  const { pick } = useLang();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<(typeof emptySermon & { id?: string }) | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["sermons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sermons").select("*").order("preached_on", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  function open(s?: SermonRow) {
    setFile(null);
    setEditing(s ? { ...emptySermon, ...s } : { ...emptySermon });
  }

  async function save() {
    if (!editing) return;
    if (!editing.title_en.trim() || !editing.title_am.trim() || !editing.date_en.trim() || !editing.date_am.trim()) {
      toast.error(pick("Fill in titles and dates.", "ርዕሶችንና ቀኖችን ይሙሉ።"));
      return;
    }
    setSaving(true);
    try {
      let audio_path = editing.audio_path;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "mp3";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("sermon-audio").upload(path, file, { contentType: file.type || "audio/mpeg" });
        if (upErr) throw upErr;
        if (audio_path) await supabase.storage.from("sermon-audio").remove([audio_path]);
        audio_path = path;
      }
      const { id, ...rest } = editing;
      const payload = {
        ...rest,
        audio_path,
        audio_url: null,
        media_url: rest.media_url?.trim() || null,
        preached_on: rest.preached_on || null,
      };
      const { error } = id
        ? await supabase.from("sermons").update(payload).eq("id", id)
        : await supabase.from("sermons").insert(payload);
      if (error) throw error;
      toast.success(pick("Sermon saved", "ስብከቱ ተቀምጧል"));
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["sermons"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(s: SermonRow) {
    if (!confirm(pick(`Delete "${s.title_en}"?`, `"${s.title_am}" ይሰረዝ?`))) return;
    if (s.audio_path) await supabase.storage.from("sermon-audio").remove([s.audio_path]);
    const { error } = await supabase.from("sermons").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success(pick("Sermon deleted", "ስብከቱ ተሰርዟል"));
    void qc.invalidateQueries({ queryKey: ["sermons"] });
  }

  const set = (k: keyof typeof emptySermon, v: string | null) => setEditing((p) => (p ? { ...p, [k]: v } : p));

  return (
    <section>
      <div className="mb-4 flex justify-end">
        <button type="button" className={goldBtn} onClick={() => open()}><Plus className="h-4 w-4" /> {pick("Add sermon", "ስብከት ጨምር")}</button>
      </div>
      {isLoading ? <p className="text-muted-foreground">…</p> : null}
      {data?.length === 0 ? <p className="text-muted-foreground">{pick("No sermons yet.", "እስካሁን ስብከት የለም።")}</p> : null}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {data?.map((s) => (
          <li key={s.id} className="grid min-w-0 gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="font-medium">{pick(s.title_en, s.title_am)}</p>
              <p className="text-sm text-muted-foreground">
                {pick(s.speaker_en, s.speaker_am)} · {pick(s.date_en, s.date_am)}
                {s.audio_path ? <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-xs text-gold">♪ {pick("Audio", "ድምፅ")}</span> : null}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className={ghostBtn} onClick={() => open(s)}><Pencil className="h-4 w-4" />{pick("Edit", "አርትዕ")}</button>
              <button type="button" className={`${ghostBtn} hover:!border-destructive hover:!text-destructive`} onClick={() => remove(s)}><Trash2 className="h-4 w-4" />{pick("Delete", "ሰርዝ")}</button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <Modal title={editing.id ? pick("Edit sermon", "ስብከት አርትዕ") : pick("New sermon", "አዲስ ስብከት")} onClose={() => setEditing(null)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title (English)"><input className={inputCls} value={editing.title_en} onChange={(e) => set("title_en", e.target.value)} /></Field>
            <Field label="ርዕስ (አማርኛ)"><input className={inputCls} value={editing.title_am} onChange={(e) => set("title_am", e.target.value)} /></Field>
            <Field label="Speaker (English)"><input className={inputCls} value={editing.speaker_en} onChange={(e) => set("speaker_en", e.target.value)} /></Field>
            <Field label="ሰባኪ (አማርኛ)"><input className={inputCls} value={editing.speaker_am} onChange={(e) => set("speaker_am", e.target.value)} /></Field>
            <Field label="Date label (English)"><input className={inputCls} value={editing.date_en} onChange={(e) => set("date_en", e.target.value)} placeholder="Wednesday, Oct 1" /></Field>
            <Field label="ቀን (አማርኛ)"><input className={inputCls} value={editing.date_am} onChange={(e) => set("date_am", e.target.value)} /></Field>
            <Field label="Scripture (English)"><input className={inputCls} value={editing.reference_en} onChange={(e) => set("reference_en", e.target.value)} /></Field>
            <Field label="ጥቅስ (አማርኛ)"><input className={inputCls} value={editing.reference_am} onChange={(e) => set("reference_am", e.target.value)} /></Field>
            <Field label="Description (English)"><textarea rows={3} className={inputCls} value={editing.description_en} onChange={(e) => set("description_en", e.target.value)} /></Field>
            <Field label="መግለጫ (አማርኛ)"><textarea rows={3} className={inputCls} value={editing.description_am} onChange={(e) => set("description_am", e.target.value)} /></Field>
            <Field label={pick("Preached on (for sorting)", "የተሰበከበት ቀን")}><input type="date" className={inputCls} value={editing.preached_on ?? ""} onChange={(e) => set("preached_on", e.target.value)} /></Field>
            <Field label={pick("Video link (optional)", "የቪዲዮ ሊንክ")}><input type="url" className={inputCls} value={editing.media_url ?? ""} onChange={(e) => set("media_url", e.target.value)} /></Field>
          </div>
          <div className="mt-4 rounded-md border border-dashed border-gold/50 bg-gold/5 p-4">
            <Field label={pick("Audio file (MP3 / WAV)", "የድምፅ ፋይል (MP3 / WAV)")}>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,.mp3,.wav"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  if (f && f.size > 50 * 1024 * 1024) {
                    toast.error(pick("File is larger than 50 MB.", "ፋይሉ ከ50 MB በላይ ነው።"));
                    e.target.value = "";
                    return;
                  }
                  setFile(f);
                }}
                className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gold file:px-3 file:py-2 file:text-primary"
              />
            </Field>
            <p className="mt-2 flex items-center gap-2 text-xs text-primary-foreground/70">
              <Upload className="h-3.5 w-3.5" />
              {file ? file.name : editing.audio_path ? pick("Audio already attached — choose a file to replace it.", "ድምፅ ተያይዟል — ለመተካት ፋይል ይምረጡ።") : pick("No audio attached yet.", "ድምፅ አልተያያዘም።")}
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className={ghostBtn} onClick={() => setEditing(null)}>{pick("Cancel", "ይቅር")}</button>
            <button type="button" className={goldBtn} disabled={saving} onClick={save}>{saving ? pick("Uploading…", "በመስቀል ላይ…") : pick("Save", "አስቀምጥ")}</button>
          </div>
        </Modal>
      ) : null}
    </section>
  );
}

/* ---------------- Accounts ---------------- */

function AccountsAdmin() {
  const { pick } = useLang();
  const qc = useQueryClient();
  const fetchAccounts = useServerFn(listAccounts);
  const toggle = useServerFn(setPosterRole);
  const create = useServerFn(createPosterAccount);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [busy, setBusy] = useState(false);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-accounts"], queryFn: () => fetchAccounts() });

  async function onToggle(userId: string, enabled: boolean) {
    try {
      await toggle({ data: { userId, enabled } });
      toast.success(enabled ? pick("Poster access granted", "ፈቃድ ተሰጥቷል") : pick("Poster access removed", "ፈቃድ ተነስቷል"));
      void qc.invalidateQueries({ queryKey: ["admin-accounts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function onCreate() {
    if (form.password.length < 8) return toast.error(pick("Password must be at least 8 characters.", "የይለፍ ቃል ቢያንስ 8 ፊደል።"));
    setBusy(true);
    try {
      await create({ data: form });
      toast.success(pick("Poster account created", "መለያ ተፈጥሯል"));
      setForm({ email: "", password: "", fullName: "" });
      void qc.invalidateQueries({ queryKey: ["admin-accounts"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <h2 className="mb-3 text-2xl">{pick("Accounts & permissions", "መለያዎችና ፈቃዶች")}</h2>
        {isLoading ? <p className="text-muted-foreground">…</p> : null}
        {error ? <p className="text-destructive">{(error as Error).message}</p> : null}
        <ul className="divide-y divide-border rounded-lg border border-border">
          {data?.map((u) => {
            const admin = u.roles.includes("admin");
            const poster = u.roles.includes("poster");
            return (
              <li key={u.id} className="grid min-w-0 gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <p className="truncate font-medium">{u.name || u.email}</p>
                  <p className="truncate text-sm text-muted-foreground">{u.email}</p>
                  <div className="mt-1 flex gap-1">
                    {admin ? <span className="rounded-full bg-gold px-2 py-0.5 text-xs text-primary">Admin</span> : null}
                    {poster ? <span className="rounded-full border border-gold px-2 py-0.5 text-xs text-gold">Poster</span> : null}
                    {!admin && !poster ? <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">Member</span> : null}
                  </div>
                </div>
                {admin ? (
                  <span className="text-xs text-muted-foreground">{pick("Full access", "ሙሉ መዳረሻ")}</span>
                ) : (
                  <button type="button" className={poster ? ghostBtn : goldBtn} onClick={() => onToggle(u.id, !poster)}>
                    {poster ? pick("Remove poster", "ፈቃድ አንሳ") : pick("Make poster", "ለጣፊ አድርግ")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="h-fit rounded-lg border border-gold/40 bg-primary p-5 text-primary-foreground">
        <h3 className="mb-3 text-xl">{pick("Create poster account", "አዲስ ለጣፊ መለያ")}</h3>
        <div className="space-y-3">
          <Field label={pick("Full name", "ሙሉ ስም")}><input className={inputCls} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field label={pick("Email", "ኢሜይል")}><input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label={pick("Temporary password (8+ chars)", "ጊዜያዊ የይለፍ ቃል")}><input type="text" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
          <button type="button" className={`${goldBtn} w-full justify-center`} disabled={busy || !form.email} onClick={onCreate}>
            {busy ? "…" : pick("Create account", "መለያ ፍጠር")}
          </button>
          <p className="text-xs text-primary-foreground/70">{pick("Share the password privately; they can sign in right away.", "የይለፍ ቃሉን በግል ያጋሩ።")}</p>
        </div>
      </div>
    </section>
  );
}
