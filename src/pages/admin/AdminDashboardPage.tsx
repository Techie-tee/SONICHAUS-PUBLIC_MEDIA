import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../../components/common/BrandLogo';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Sliders,
  Mic,
  Users,
  MessageSquare,
  HelpCircle,
  FileText,
  LogOut,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Booking, PaymentTransaction, ServiceItem, EquipmentItem, TeamMember, Enquiry, ChatbotKnowledge, AuditLog, ServicePackage } from '../../types';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'metrics' | 'bookings' | 'payments' | 'services' | 'equipment' | 'enquiries' | 'chatbot' | 'audit'>('metrics');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');

  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [knowledge, setKnowledge] = useState<ChatbotKnowledge[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Auth verification check
  useEffect(() => {
    const savedToken = localStorage.getItem('sv_admin_token');
    const savedUser = localStorage.getItem('sv_admin_user');

    if (!savedToken) {
      navigate('/admin/login');
      return;
    }

    setToken(savedToken);
    if (savedUser) setAdminUser(JSON.parse(savedUser));
    loadAllData(savedToken);
  }, [navigate]);

  const loadAllData = async (authToken: string) => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      const [mRes, bRes, sRes, eRes, eqRes, kRes, aRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch('/api/bookings', { headers }),
        fetch('/api/services', { headers }),
        fetch('/api/enquiries', { headers }),
        fetch('/api/equipment', { headers }),
        fetch('/api/chatbot/knowledge', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (bRes.ok) setBookings(await bRes.json());
      if (sRes.ok) setServices(await sRes.json());
      if (eRes.ok) setEnquiries(await eRes.json());
      if (eqRes.ok) setEquipment(await eqRes.json());
      if (kRes.ok) setKnowledge(await kRes.json());
      if (aRes.ok) setAuditLogs(await aRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).finally(() => {
      localStorage.removeItem('sv_admin_token');
      localStorage.removeItem('sv_admin_user');
      navigate('/admin/login');
    });
  };

  // Price approval action
  const handleApprovePrice = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/services/${serviceId}/approve-pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setMessage('Service pricing approved successfully.');
        loadAllData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update booking status action
  const handleUpdateBookingStatus = async (reference: string, bookingStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${reference}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingStatus }),
      });
      if (res.ok) {
        setMessage(`Booking ${reference} updated to ${bookingStatus}`);
        loadAllData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#4E85BF] selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#080c14] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Monogram */}
          <div className="space-y-2 pb-3 border-b border-white/10">
            <BrandLogo variant="horizontal" size="sm" />
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="text-slate-400">CONSOLE</span>
              <span className="text-[#89AACC] truncate max-w-[120px]">{adminUser?.name || 'Admin'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-mono">
            {[
              { id: 'metrics', label: 'METRICS & OVERVIEW', icon: LayoutDashboard },
              { id: 'bookings', label: 'BOOKINGS CALENDAR', icon: Calendar },
              { id: 'services', label: 'SERVICES & PRICING', icon: Sliders },
              { id: 'equipment', label: 'EQUIPMENT INVENTORY', icon: Mic },
              { id: 'enquiries', label: 'CUSTOMER ENQUIRIES', icon: MessageSquare },
              { id: 'chatbot', label: 'CHATBOT KNOWLEDGE', icon: HelpCircle },
              { id: 'audit', label: 'AUDIT ACTIVITY LOGS', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left ${
                    isActive
                      ? 'accent-gradient text-white font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <button
            onClick={() => loadAllData(token)}
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>SYNC DATA</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        {/* Banner Alert if any */}
        {message && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: METRICS & OVERVIEW                                 */}
        {/* ========================================================= */}
        {activeTab === 'metrics' && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                BUSINESS DASHBOARD
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                EXECUTIVE SUMMARY
              </h2>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-1">
                <span className="text-xs font-mono text-slate-400">TOTAL RECORDING REVENUE</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  ₦{metrics?.totalRevenueNgn?.toLocaleString() || '0'}
                </div>
                <span className="text-[10px] font-mono text-slate-500 block">Verified via Paystack</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-1">
                <span className="text-xs font-mono text-slate-400">CONFIRMED SESSIONS</span>
                <div className="text-2xl font-bold font-mono text-white">
                  {metrics?.confirmedBookings || 0}
                </div>
                <span className="text-[10px] font-mono text-[#89AACC] block">On active calendar</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-1">
                <span className="text-xs font-mono text-slate-400">PENDING BOOKINGS</span>
                <div className="text-2xl font-bold font-mono text-amber-300">
                  {metrics?.pendingBookings || 0}
                </div>
                <span className="text-[10px] font-mono text-slate-500 block">Awaiting deposit/review</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-1">
                <span className="text-xs font-mono text-slate-400">UNREAD ENQUIRIES</span>
                <div className="text-2xl font-bold font-mono text-[#4E85BF]">
                  {metrics?.unreadEnquiries || 0}
                </div>
                <span className="text-[10px] font-mono text-slate-500 block">Awaiting manager response</span>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  RECENT SESSION BOOKINGS
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-mono text-[#89AACC] hover:underline"
                >
                  VIEW ALL BOOKINGS →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 text-[11px]">
                      <th className="pb-3">REF</th>
                      <th className="pb-3">ARTIST</th>
                      <th className="pb-3">SERVICE</th>
                      <th className="pb-3">DATE & TIME</th>
                      <th className="pb-3">PRICE / DEPOSIT</th>
                      <th className="pb-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.reference} className="hover:bg-white/5">
                        <td className="py-3 font-bold text-white">{b.reference}</td>
                        <td className="py-3 text-slate-300">{b.clientName}</td>
                        <td className="py-3 text-[#89AACC]">{b.serviceName}</td>
                        <td className="py-3 text-slate-400">{b.date} ({b.timeSlot})</td>
                        <td className="py-3 text-slate-300">
                          ₦{b.priceNgn.toLocaleString()} / ₦{b.depositNgn.toLocaleString()}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.bookingStatus === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {b.bookingStatus.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BOOKINGS CALENDAR & STATUS MANAGEMENT              */}
        {/* ========================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                  CALENDAR & CONFLICT MANAGEMENT
                </span>
                <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                  SESSION RESERVATIONS
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {bookings.length} TOTAL BOOKINGS
              </span>
            </div>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.reference}
                  className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold font-mono text-white">{b.reference}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {b.bookingStatus.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Created: {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">CLIENT DETAILS</span>
                      <span className="font-bold text-white block">{b.clientName}</span>
                      <span className="text-slate-400 block">{b.clientEmail}</span>
                      <span className="text-slate-400 block">{b.clientPhone}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">SESSION SPEC</span>
                      <span className="font-bold text-[#89AACC] block">{b.serviceName}</span>
                      <span className="text-slate-300 block">{b.packageName}</span>
                      <span className="text-slate-400 block">{b.durationHours} hours</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">SCHEDULED TIME</span>
                      <span className="font-bold text-white block">{b.date}</span>
                      <span className="text-slate-300 block">{b.timeSlot}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">FINANCIAL STATUS</span>
                      <span className="text-white font-bold block">Total: ₦{b.priceNgn.toLocaleString()}</span>
                      <span className="text-slate-400 block">Deposit: ₦{b.depositNgn.toLocaleString()}</span>
                      <span className="text-emerald-400 block uppercase">{b.paymentStatus.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {b.projectDetails && (
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300">
                      <span className="text-[10px] font-mono text-slate-500 block">ARTIST NOTES:</span>
                      {b.projectDetails}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {b.bookingStatus !== 'confirmed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.reference, 'confirmed')}
                        className="py-1.5 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-600/30 cursor-pointer"
                      >
                        CONFIRM SESSION
                      </button>
                    )}
                    {b.bookingStatus !== 'completed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.reference, 'completed')}
                        className="py-1.5 px-3 rounded-lg bg-[#4E85BF]/20 border border-[#4E85BF]/30 text-[#89AACC] text-xs font-mono hover:bg-[#4E85BF]/30 cursor-pointer"
                      >
                        MARK COMPLETED
                      </button>
                    )}
                    {b.bookingStatus !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.reference, 'cancelled')}
                        className="py-1.5 px-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-mono hover:bg-rose-500/30 cursor-pointer"
                      >
                        CANCEL SESSION
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SERVICES & PRICING APPROVAL WORKFLOW               */}
        {/* ========================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                CATALOGUE & RATES CONTROL
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                SERVICES & PRICING APPROVAL
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Notice: Proposed starting rates require explicit administrator approval before publication.
              </p>
            </div>

            <div className="space-y-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-white">{srv.title}</h3>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                            srv.isPriceApproved
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {srv.isPriceApproved ? 'PRICE APPROVED' : 'DRAFT / PROPOSED PRICE'}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        Room: {srv.verifiedRoom} · Category: {srv.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate-500 block">BASE RATE</span>
                        <span className="font-mono text-lg font-bold text-[#89AACC]">
                          ₦{srv.draftPriceNgn.toLocaleString()}
                        </span>
                      </div>

                      {!srv.isPriceApproved && (
                        <button
                          onClick={() => handleApprovePrice(srv.id)}
                          className="py-2 px-4 rounded-xl accent-gradient text-white text-xs font-bold tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                        >
                          APPROVE PRICING
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Packages breakdown */}
                  {srv.packages && srv.packages.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">
                        PACKAGES & LOCKOUT RULES
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {srv.packages.map((pkg: ServicePackage) => (
                          <div key={pkg.id} className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs font-mono">
                            <div className="font-bold text-white">{pkg.name}</div>
                            <div className="text-slate-400">{pkg.durationHours} hours · Deposit: ₦{pkg.depositNgn.toLocaleString()}</div>
                            <div className="text-[#89AACC] font-bold mt-1">₦{pkg.priceNgn.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: EQUIPMENT INVENTORY                                */}
        {/* ========================================================= */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                  HARDWARE & RIG MANAGEMENT
                </span>
                <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                  EQUIPMENT INVENTORY
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {equipment.length} VERIFIED PIECES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#080b12] border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-black/50 p-1 flex items-center justify-center border border-white/5 shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-white">{item.name}</h4>
                      <span className="text-[10px] font-mono text-[#89AACC] block">{item.manufacturer}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">{item.room}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CUSTOMER ENQUIRIES                                 */}
        {/* ========================================================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                COMMUNICATIONS & LEADS
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                CONTACT ENQUIRIES
              </h2>
            </div>

            <div className="space-y-3">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{enq.name}</span>
                      <span className="text-slate-400 block">{enq.email} · {enq.phone}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-[#89AACC]">
                      {enq.serviceInterest}
                    </span>
                  </div>
                  <p className="p-3 rounded-xl bg-black/40 text-slate-300 font-sans">{enq.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CHATBOT KNOWLEDGE BASE                             */}
        {/* ========================================================= */}
        {activeTab === 'chatbot' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                AUTOMATION & KNOWLEDGE VAULT
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                CHATBOT APPROVED FAQS
              </h2>
            </div>

            <div className="space-y-3">
              {knowledge.map((k) => (
                <div key={k.id} className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-bold text-white">{k.question}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#89AACC]">
                      {k.category}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{k.answer}</p>
                  <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px] text-slate-500">
                    <span>Keywords:</span>
                    {k.keywords.map((kw: string, i: number) => (
                      <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded text-slate-400">{kw}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: AUDIT ACTIVITY LOGS                                */}
        {/* ========================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                SECURITY & AUDIT TRAIL
              </span>
              <h2 className="font-display text-3xl font-extrabold text-white uppercase">
                SYSTEM ACTIVITY LOGS
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-[#080b12] border border-white/10 space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 border-b border-white/5 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-[#89AACC] mr-2">[{log.action}]</span>
                    <span className="text-slate-300">{log.details}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleString()} · {log.user}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
