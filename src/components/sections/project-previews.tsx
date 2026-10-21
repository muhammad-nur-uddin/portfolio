// Application previews — Task 07A.
//
// No genuine product screenshots exist in `public/` yet (TBD — swap for real
// captures when available), so the homepage renders polished, responsive
// HTML/CSS previews built from the verified feature lists. All in-preview
// content is structural placeholder data only: no customer identities, no
// revenue figures, no analytics claims, no fabricated business results —
// decorative interface illustrations framed inside project window chrome.

/** Shared framed window chrome for both previews. */
function PreviewFrame({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "light" | "dark";
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none rounded-2xl border border-accent/30 bg-surface p-1.5 shadow-[0_0_40px_rgba(65,105,225,0.12)]"
    >
      <div
        className={
          "relative overflow-hidden rounded-xl " +
          (tone === "light" ? "bg-[#f3f5fa]" : "bg-[#0a101f]")
        }
      >
        {children}
      </div>
    </div>
  );
}

/* ==========================================================================
   Finvia — invoice & business finance SaaS. Light dashboard with structural
   placeholders (em-dashes instead of figures, IDs instead of client names).
   ========================================================================== */

const finviaNav = ["Dashboard", "Invoices", "Clients", "Financing", "Analytics", "Settings"];

const finviaInvoices: Array<{ id: string; note: string; status: string }> = [
  { id: "INV-0012", note: "Financing requested", status: "In review" },
  { id: "INV-0011", note: "Payment received", status: "Paid" },
  { id: "INV-0010", note: "Awaiting approval", status: "Pending" },
];

export function FinviaPreview() {
  return (
    <PreviewFrame tone="light">
      <div className="flex aspect-[16/10] min-h-[220px] text-[#16203a]">
        {/* Sidebar */}
        <div className="flex w-20 shrink-0 flex-col gap-3 border-r border-[#dfe4f0] bg-[#e9edf7] p-3 sm:w-28 sm:gap-3.5 sm:p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#4169e1] text-[9px] font-bold text-white sm:h-6 sm:w-6">
              F
            </span>
            <span className="hidden text-xs font-semibold tracking-tight sm:block">Finvia</span>
          </div>
          <nav className="flex flex-col gap-1.5 sm:gap-2">
            {finviaNav.map((item, i) => (
              <div
                key={item}
                className={
                  "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[8px] sm:gap-2 sm:px-2 sm:py-1.5 sm:text-[10px] " +
                  (i === 0 ? "bg-[#4169e1] font-medium text-white" : "text-[#5b6684]")
                }
              >
                <span
                  className={
                    "h-1.5 w-1.5 rounded-[2px] " + (i === 0 ? "bg-white/90" : "bg-[#aab4cf]")
                  }
                />
                {item}
              </div>
            ))}
          </nav>
        </div>
        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-5 flex-1 rounded-md border border-[#dfe4f0] bg-white px-2 text-[8px] leading-5 text-[#93a0bd] sm:h-7 sm:px-3 sm:text-[10px] sm:leading-7">
              Search invoices, clients…
            </div>
            <div className="h-5 w-5 rounded-full border border-[#dfe4f0] bg-white sm:h-7 sm:w-7" />
          </div>
          <div>
            <p className="text-[10px] font-semibold sm:text-xs">Dashboard</p>
            <p className="text-[8px] text-[#7a86a5] sm:text-[10px]">Business overview</p>
          </div>
          {/* Stat tiles — labels only; values intentionally left as em-dashes. */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
            {["Total invoice value", "Financed amount", "Active clients", "Pending invoices"].map(
              (label) => (
                <div
                  key={label}
                  className="rounded-lg border border-[#e2e7f2] bg-white px-2 py-1.5 sm:px-3 sm:py-2.5"
                >
                  <p className="truncate text-[7px] text-[#7a86a5] sm:text-[9px]">{label}</p>
                  <p className="text-[11px] font-semibold text-[#16203a] sm:text-sm">—</p>
                </div>
              ),
            )}
          </div>
          {/* Invoice list + financing panel */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[1.4fr_1fr] sm:gap-2.5">
            <div className="rounded-lg border border-[#e2e7f2] bg-white p-2 sm:p-3">
              <p className="mb-1.5 text-[8px] font-medium sm:text-[10px]">Recent invoices</p>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {finviaInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-2 border-b border-[#eef1f8] pb-1.5 last:border-0 sm:pb-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[8px] font-medium sm:text-[10px]">
                        {inv.id}
                      </p>
                      <p className="truncate text-[7px] text-[#7a86a5] sm:text-[9px]">{inv.note}</p>
                    </div>
                    <span
                      className={
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-medium sm:px-2 sm:text-[8px] " +
                        (inv.status === "Paid"
                          ? "bg-[#e4f5ea] text-[#1d7a45]"
                          : inv.status === "In review"
                            ? "bg-[#e7edfd] text-[#2c4db8]"
                            : "bg-[#fdf1de] text-[#8a5b12]")
                      }
                    >
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden rounded-lg border border-[#e2e7f2] bg-white p-3 sm:block">
              <p className="mb-2 text-[10px] font-medium">Financing</p>
              <div className="flex flex-col gap-2">
                {["Application", "Disbursement"].map((step) => (
                  <div key={step} className="rounded-md bg-[#f4f6fb] px-2.5 py-2">
                    <p className="text-[9px] font-medium">{step}</p>
                    <p className="text-[8px] text-[#7a86a5]">Status —</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

/* ==========================================================================
   Nebula — real-time communication platform. Dark chat UI with presence
   dots, typing indicator, and a media attachment (verified features).
   Demo conversation content is generic, non-personal illustration copy.
   ========================================================================== */

const nebulaNav = ["Chats", "Channels", "Contacts", "Calls", "Settings"];

const nebulaConversations = [
  { title: "# design", preview: "New mockups are up", time: "9:41", online: true, initials: "DS" },
  { title: "# general", preview: "Sync notes posted", time: "8:15", online: true, initials: "GN" },
  { title: "Direct messages", preview: "See you later", time: "Mon", online: false, initials: "DM" },
];

export function NebulaPreview() {
  return (
    <PreviewFrame tone="dark">
      <div className="flex aspect-[16/10] min-h-[220px] text-[#dfe6f5]">
        {/* Sidebar */}
        <div className="flex w-14 shrink-0 flex-col gap-3 border-r border-[#1b2740] bg-[#0c1426] p-2.5 sm:w-24 sm:gap-3.5 sm:p-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4169e1] text-[9px] font-bold text-white sm:h-6 sm:w-6">
              N
            </span>
            <span className="hidden text-xs font-semibold tracking-tight sm:block">Nebula</span>
          </div>
          <nav className="flex flex-col gap-1.5 sm:gap-2">
            {nebulaNav.map((item, i) => (
              <div
                key={item}
                className={
                  "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[8px] sm:gap-2 sm:px-2 sm:py-1.5 sm:text-[10px] " +
                  (i === 0 ? "bg-[#4169e1]/20 font-medium text-[#9db8ff]" : "text-[#7f8db0]")
                }
              >
                <span
                  className={
                    "h-1.5 w-1.5 rounded-full " + (i === 0 ? "bg-[#4169e1]" : "bg-[#33436b]")
                  }
                />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </nav>
        </div>
        {/* Conversation list — tablet and up. */}
        <div className="hidden w-32 shrink-0 flex-col gap-2 border-r border-[#1b2740] bg-[#0b1223] p-2.5 md:flex md:w-40 md:p-3.5">
          <div className="h-5 rounded-md bg-[#111c33] px-2 text-[8px] leading-5 text-[#5f6f94] md:h-6 md:leading-6">
            Search conversations…
          </div>
          {nebulaConversations.map((conv, i) => (
            <div
              key={conv.title}
              className={
                "flex items-center gap-2 rounded-md px-1.5 py-1.5 " + (i === 0 ? "bg-[#16233f]" : "")
              }
            >
              <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#22325a] text-[8px] font-semibold text-[#9db8ff]">
                {conv.initials}
                {conv.online ? (
                  <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-[#0b1223] bg-[#33c46a]" />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9px] font-medium">{conv.title}</p>
                <p className="truncate text-[7px] text-[#66769c] sm:text-[8px]">{conv.preview}</p>
              </div>
              <span className="shrink-0 text-[7px] text-[#52628a]">{conv.time}</span>
            </div>
          ))}
        </div>

        {/* Thread */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#1b2740] px-3 py-2 sm:px-4 sm:py-2.5">
            <div>
              <p className="text-[10px] font-semibold sm:text-xs"># design</p>
              <p className="flex items-center gap-1 text-[7px] text-[#33c46a] sm:text-[8px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#33c46a]" />
                Online — presence active
              </p>
            </div>
            <div className="flex gap-1.5">
              <span className="h-4 w-4 rounded-full border border-[#22325a] sm:h-5 sm:w-5" />
              <span className="h-4 w-4 rounded-full border border-[#22325a] sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 px-3 py-2 sm:gap-2 sm:px-4 sm:py-3">
            <div className="max-w-[70%] rounded-xl rounded-bl-sm bg-[#16233f] px-2.5 py-1.5 text-[8px] sm:px-3 sm:py-2 sm:text-[10px]">
              Are you free for a quick sync?
            </div>
            <div className="max-w-[70%] self-end rounded-xl rounded-br-sm bg-[#4169e1] px-2.5 py-1.5 text-[8px] text-white sm:px-3 sm:py-2 sm:text-[10px]">
              Sure — 5 minutes works.
            </div>
            <div className="flex max-w-[60%] items-center gap-2 self-end rounded-lg border border-[#22325a] bg-[#111c33] px-2 py-1.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#4169e1]/25 text-[8px] text-[#9db8ff]">
                zip
              </span>
              <div className="min-w-0">
                <p className="truncate font-mono text-[7px] sm:text-[9px]">design-system.zip</p>
                <p className="text-[7px] text-[#66769c]">Media sharing</p>
              </div>
            </div>
            <p className="px-1 text-[7px] italic text-[#5f6f94] sm:text-[8px]">typing…</p>
          </div>
          <div className="flex items-center gap-2 border-t border-[#1b2740] px-3 py-2 sm:px-4 sm:py-2.5">
            <div className="h-5 flex-1 rounded-full bg-[#111c33] px-3 text-[8px] leading-5 text-[#5f6f94] sm:h-6 sm:leading-6">
              Type a message…
            </div>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4169e1] sm:h-6 sm:w-6">
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}
