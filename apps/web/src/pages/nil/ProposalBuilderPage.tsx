import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Building2,
  Trophy,
  Heart,
  Film,
  Shirt,
  Download,
  FileText,
  ChevronRight,
  Plus,
  Trash2,
  Zap,
  Save,
  FolderOpen,
  Star,
  Send,
  Eye,
  Check,
  X,
  Clock,
  MoreVertical,
  Mail,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_62b58a24-a85f-4363-8413-49d80cc7ae03/artifacts/hutkfplo_fb%20profile%20hoopwithher.png";

const TEMPLATE_ICONS: Record<string, any> = {
  "facility-access": Building2,
  "presenting-sponsor": Trophy,
  "community-business": Heart,
  "media-content": Film,
  "apparel-equipment": Shirt,
  "nil-partnership": Star,
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, any> = {
  draft: Clock,
  sent: Send,
  viewed: Eye,
  accepted: Check,
  declined: X,
};

const STATIC_TEMPLATES = [
  {
    id: "facility-access",
    name: "Facility Access Partner",
    description: "Request gymnasium and basketball court access for HWH scheduled programming.",
    default_tiers: [
      { tier_name: "Standard Facility Use", commitment: "Provide access to 2 courts during designated season hours.", deliverables: "Featured placement as HWH Facility Partner, website link, and gym signage." }
    ]
  },
  {
    id: "presenting-sponsor",
    name: "Presenting Sponsor",
    description: "Sponsor a specific HWH event or program with high visibility.",
    default_tiers: [
      { tier_name: "Title Sponsor", commitment: "Sponsorship of $5,000.", deliverables: "Title naming rights, logo on all marketing materials, on-site activation booth." }
    ]
  },
  {
    id: "community-business",
    name: "Community Business Partner",
    description: "Support youth development and girls sports as a local business.",
    default_tiers: [
      { tier_name: "Community Partner", commitment: "Contribution of $1,000 or equivalent products/services.", deliverables: "Featured on community partners board, social media spotlight." }
    ]
  },
  {
    id: "media-content",
    name: "Media Content Partner",
    description: "Partner with HWH to produce and distribute media coverage of athletes.",
    default_tiers: [
      { tier_name: "Official Media Partner", commitment: "Provide video/photography coverage for HWH showcase events.", deliverables: "Branding on lower thirds, logo on recap videos, co-branded social distribution." }
    ]
  },
  {
    id: "apparel-equipment",
    name: "Apparel & Equipment Partner",
    description: "Support athletes with training gear, uniforms, and equipment.",
    default_tiers: [
      { tier_name: "Official Outfitter", commitment: "Provide uniforms and training equipment for camp athletes.", deliverables: "Logo on training jersey sleeves, product sampling at event intake." }
    ]
  },
  {
    id: "nil-partnership",
    name: "NIL Athlete Partnership",
    description: "Partner with HWH featured athletes for authentic community campaigns.",
    default_tiers: [
      { tier_name: "NIL Brand Ambassador", commitment: "Provide monthly financial support or product compensation.", deliverables: "Social media posts, event appearances, and co-branded outreach campaigns." }
    ]
  }
];

const STATIC_QUICK_TEMPLATES = [
  {
    id: "qt-1",
    template_type: "facility-access",
    name: "Fayetteville Recreation Center",
    description: "Standard recreation gym agreement",
    prefilled_data: {
      organizationName: "Fayetteville Recreation Center",
      numberOfCourts: "2",
      daysAndTimes: "Saturdays 9am-2pm",
      seasonOrDateRange: "Fall 2026 (September - November)"
    }
  },
  {
    id: "qt-2",
    template_type: "nil-partnership",
    name: "Local Brand Campaign",
    description: "Prefilled for local business NIL deal",
    prefilled_data: {
      athleteName: "HWH Featured Athletes",
      socialMediaFollowing: "25,000+ combined",
      compensationType: "Cash + Product",
      dealDuration: "6 months",
      exclusivityType: "Category Exclusive"
    }
  }
];

interface Proposal {
  id: string;
  template_id: string;
  form_data: any;
  status: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
  last_viewed?: string;
  view_history?: { viewed_at: string }[];
}

const getDefaultFormData = (template: any) => ({
  organizationName: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  proposalNumber: `HWH-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
  validUntil: "30 days",
  preparedBy: "Lamont Revell Sr.",
  yourPhone: "",
  yourEmail: "",
  // Template-specific fields
  numberOfCourts: "2",
  daysAndTimes: "Saturdays 9am-2pm",
  seasonOrDateRange: "Fall 2026 (September - November)",
  eventProgramName: "",
  sponsorshipAmount: "",
  mediaType: "streaming / photography / video",
  // NIL-specific fields
  athleteName: "",
  socialMediaFollowing: "",
  compensationType: "Cash + Product",
  dealDuration: "6 months",
  exclusivityType: "Non-exclusive",
  contentRequirements: "",
  tiers: template?.default_tiers?.map((t: any) => ({ ...t })) || [],
});

export default function ProposalBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(STATIC_TEMPLATES[0]);
  const [formData, setFormData] = useState<any>(getDefaultFormData(STATIC_TEMPLATES[0]));
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [showSavedProposals, setShowSavedProposals] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [savedProposals, setSavedProposals] = useState<Proposal[]>([]);
  const [currentProposalId, setCurrentProposalId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("editor"); // editor, tracking, analytics
  const [emailForm, setEmailForm] = useState({ recipient_email: "", recipient_name: "", subject: "", personal_message: "" });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedProposalAnalytics, setSelectedProposalAnalytics] = useState<Proposal | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load proposals from LocalStorage
  useEffect(() => {
    const local = localStorage.getItem("hwh_proposals");
    if (local) {
      try {
        setSavedProposals(JSON.parse(local));
      } catch (e) {
        console.error("Failed to parse proposals", e);
      }
    }
  }, []);

  const saveToLocalStorage = (proposals: Proposal[]) => {
    localStorage.setItem("hwh_proposals", JSON.stringify(proposals));
    setSavedProposals(proposals);
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setFormData(getDefaultFormData(template));
    setCurrentProposalId(null);
    setActiveView("editor");
  };

  const handleQuickTemplateSelect = (quickTemplate: any) => {
    const template = STATIC_TEMPLATES.find(t => t.id === quickTemplate.template_type);
    if (template) {
      setSelectedTemplate(template);
      const newFormData = {
        ...getDefaultFormData(template),
        ...quickTemplate.prefilled_data
      };
      setFormData(newFormData);
      setCurrentProposalId(null);
    }
    setShowQuickTemplates(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleTierChange = (index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const newTiers = [...prev.tiers];
      newTiers[index] = { ...newTiers[index], [field]: value };
      return { ...prev, tiers: newTiers };
    });
  };

  const addTier = () => {
    setFormData((prev: any) => ({
      ...prev,
      tiers: [...prev.tiers, { tier_name: "New Tier", commitment: "", deliverables: "" }]
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      tiers: prev.tiers.filter((_: any, i: number) => i !== index)
    }));
  };

  const saveProposal = (status = "draft") => {
    setSaving(true);
    const now = new Date().toISOString();
    let updated: Proposal[] = [];

    if (currentProposalId) {
      updated = savedProposals.map(p => {
        if (p.id === currentProposalId) {
          return {
            ...p,
            form_data: formData,
            status,
            updated_at: now
          };
        }
        return p;
      });
    } else {
      const newId = Math.random().toString(36).substring(2, 11);
      const newProposal: Proposal = {
        id: newId,
        template_id: selectedTemplate.id,
        form_data: formData,
        status,
        created_at: now,
        updated_at: now,
        view_count: 0,
        view_history: []
      };
      setCurrentProposalId(newId);
      updated = [newProposal, ...savedProposals];
    }

    saveToLocalStorage(updated);
    setSaving(false);
  };

  const loadProposal = (proposal: Proposal) => {
    const template = STATIC_TEMPLATES.find(t => t.id === proposal.template_id);
    if (template) {
      setSelectedTemplate(template);
      setFormData(proposal.form_data);
      setCurrentProposalId(proposal.id);
      setActiveView("editor");
    }
    setShowSavedProposals(false);
  };

  const updateProposalStatus = (proposalId: string, newStatus: string) => {
    const updated = savedProposals.map(p => {
      if (p.id === proposalId) {
        const viewHistory = [...(p.view_history || [])];
        let viewCount = p.view_count || 0;
        let lastViewed = p.last_viewed;
        
        if (newStatus === "viewed" && p.status !== "viewed") {
          viewCount += 1;
          lastViewed = new Date().toISOString();
          viewHistory.push({ viewed_at: lastViewed });
        }

        return {
          ...p,
          status: newStatus,
          view_count: viewCount,
          last_viewed: lastViewed,
          view_history: viewHistory,
          updated_at: new Date().toISOString()
        };
      }
      return p;
    });
    saveToLocalStorage(updated);
  };

  const deleteProposal = (proposalId: string) => {
    const updated = savedProposals.filter(p => p.id !== proposalId);
    saveToLocalStorage(updated);
    if (currentProposalId === proposalId) {
      setCurrentProposalId(null);
      setFormData(getDefaultFormData(selectedTemplate));
    }
  };

  const openEmailDialog = () => {
    setEmailForm({
      recipient_email: formData.contactEmail || "",
      recipient_name: formData.contactName || "",
      subject: `Partnership Proposal from HoopWithHer - ${formData.organizationName || ""}`,
      personal_message: ""
    });
    setShowEmailDialog(true);
  };

  const sendEmail = () => {
    setSendingEmail(true);
    // Simulate sending email and automatically set to sent status
    setTimeout(() => {
      saveProposal("sent");
      setShowEmailDialog(false);
      setSendingEmail(false);
      alert(`Simulated email sent successfully to ${emailForm.recipient_email}! (Proposals status updated to Sent with tracking enabled)`);
    }, 1000);
  };

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `HWH_Partnership_Proposal_${formData.organizationName || "Draft"}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const filteredQuickTemplates = STATIC_QUICK_TEMPLATES.filter(qt => qt.template_type === selectedTemplate.id);

  // Compute stats locally
  const stats = {
    total: savedProposals.length,
    draft: savedProposals.filter(p => p.status === "draft").length,
    sent: savedProposals.filter(p => p.status === "sent").length,
    viewed: savedProposals.filter(p => p.status === "viewed").length,
    accepted: savedProposals.filter(p => p.status === "accepted").length,
    declined: savedProposals.filter(p => p.status === "declined").length,
    totalViews: savedProposals.reduce((sum, p) => sum + (p.view_count || 0), 0)
  };

  const recentViews = savedProposals
    .filter(p => p.last_viewed)
    .map(p => ({
      id: p.id,
      name: p.form_data?.organizationName || "Draft Proposal",
      viewed_at: p.last_viewed!
    }))
    .sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime())
    .slice(0, 5);

  const topViewed = [...savedProposals]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .filter(p => (p.view_count || 0) > 0)
    .slice(0, 5);

  return (
    <DashboardLayout variant="admin" title="Proposal Builder" subtitle="Create, track, and manage dynamic NIL partnership proposals.">
      <div className="space-y-6">
        {/* Navigation & Controls bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-navy-800/50 p-4 rounded-2xl border border-white/5">
          <div className="flex gap-2">
            <Button
              variant={activeView === "editor" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("editor")}
              className={`text-xs ${activeView === "editor" ? "bg-brand-orange text-white hover:bg-brand-orange/90" : "text-gray-300 hover:text-white"}`}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Editor Canvas
            </Button>
            <Button
              variant={activeView === "tracking" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("tracking")}
              className={`text-xs ${activeView === "tracking" ? "bg-brand-orange text-white hover:bg-brand-orange/90" : "text-gray-300 hover:text-white"}`}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Track Proposals ({stats.total})
            </Button>
            <Button
              variant={activeView === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("analytics")}
              className={`text-xs ${activeView === "analytics" ? "bg-brand-orange text-white hover:bg-brand-orange/90" : "text-gray-300 hover:text-white"}`}
            >
              <BarChart3 className="h-4 w-4 mr-1.5" />
              Analytics Dashboard
            </Button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Dialog open={showSavedProposals} onOpenChange={setShowSavedProposals}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Load Saved
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl bg-navy-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Saved Proposals</DialogTitle>
                  <DialogDescription className="text-gray-400">Load a proposal draft to continue editing.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4 max-h-[60vh] overflow-y-auto">
                  {savedProposals.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No saved proposals yet.</p>
                  ) : (
                    savedProposals.map((proposal) => {
                      const template = STATIC_TEMPLATES.find(t => t.id === proposal.template_id);
                      const StatusIcon = STATUS_ICONS[proposal.status] || Clock;
                      return (
                        <div
                          key={proposal.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-semibold text-white truncate">
                              {proposal.form_data?.organizationName || "Untitled Proposal"}
                            </p>
                            <p className="text-xs text-gray-400">{template?.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              Updated: {new Date(proposal.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={STATUS_COLORS[proposal.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {proposal.status}
                            </Badge>
                            <Button size="sm" className="bg-brand-orange hover:bg-brand-orange/90 text-white" onClick={() => loadProposal(proposal)}>
                              Load
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Views */}
        {activeView === "editor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Input Controls */}
            <div className="lg:col-span-5 bg-navy-800/30 border border-white/5 rounded-3xl p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Template Select</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Select a layout template to start building.</p>
                  </div>
                  {currentProposalId && (
                    <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">Currently Editing</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {STATIC_TEMPLATES.map((t) => {
                    const Icon = TEMPLATE_ICONS[t.id] || FileText;
                    const isSelected = selectedTemplate?.id === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleTemplateSelect(t)}
                        className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors ${
                          isSelected
                            ? "bg-brand-orange/10 border-brand-orange text-white"
                            : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300"
                        }`}
                      >
                        <Icon className={`h-5 w-5 mb-2 ${isSelected ? "text-brand-orange" : "text-gray-400"}`} />
                        <span className="text-xs font-semibold truncate w-full">{t.name}</span>
                      </button>
                    );
                  })}
                </div>

                {filteredQuickTemplates.length > 0 && (
                  <Dialog open={showQuickTemplates} onOpenChange={setShowQuickTemplates}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full border-brand-orange/20 text-brand-orange hover:bg-brand-orange/10">
                        <Zap className="h-4 w-4 mr-2" />
                        Load Quick Prefill Options
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-navy-900 border-white/10 text-white">
                      <DialogHeader>
                        <DialogTitle>Quick Prefills</DialogTitle>
                        <DialogDescription className="text-gray-400">Prefill form values for standard partner categories.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3 mt-4">
                        {filteredQuickTemplates.map((qt) => (
                          <button
                            key={qt.id}
                            onClick={() => handleQuickTemplateSelect(qt)}
                            className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 text-left transition-colors"
                          >
                            <p className="font-semibold text-white text-sm">{qt.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{qt.description}</p>
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <Separator className="bg-white/5" />

              <ScrollArea className="h-[550px] pr-2">
                <div className="space-y-6">
                  {/* Recipient info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recipient Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="organizationName" className="text-gray-300">Company / Organization</Label>
                      <Input
                        id="organizationName"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange("organizationName", e.target.value)}
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-gray-300">Contact Person</Label>
                      <Input
                        id="contactName"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        placeholder="e.g., John Smith"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="text-gray-300">Phone</Label>
                        <Input
                          id="contactPhone"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-gray-300">Email</Label>
                        <Input
                          id="contactEmail"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Proposal values */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposal Properties</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-gray-300">Proposal Date</Label>
                        <Input
                          id="date"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposalNumber" className="text-gray-300">Proposal Number</Label>
                        <Input
                          id="proposalNumber"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.proposalNumber}
                          onChange={(e) => handleInputChange("proposalNumber", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validUntil" className="text-gray-300">Offer Expiration (Valid Until)</Label>
                      <Input
                        id="validUntil"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        value={formData.validUntil}
                        onChange={(e) => handleInputChange("validUntil", e.target.value)}
                        placeholder="e.g., 30 days"
                      />
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Template custom properties */}
                  {selectedTemplate?.id === "facility-access" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Facility Needs</h3>
                      <div className="space-y-2">
                        <Label htmlFor="numberOfCourts" className="text-gray-300">Courts Needed</Label>
                        <Input
                          id="numberOfCourts"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.numberOfCourts}
                          onChange={(e) => handleInputChange("numberOfCourts", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="daysAndTimes" className="text-gray-300">Days / Times</Label>
                        <Input
                          id="daysAndTimes"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.daysAndTimes}
                          onChange={(e) => handleInputChange("daysAndTimes", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seasonOrDateRange" className="text-gray-300">Season / Range</Label>
                        <Input
                          id="seasonOrDateRange"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.seasonOrDateRange}
                          onChange={(e) => handleInputChange("seasonOrDateRange", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedTemplate?.id === "presenting-sponsor" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sponsor Scope</h3>
                      <div className="space-y-2">
                        <Label htmlFor="eventProgramName" className="text-gray-300">Event / Program</Label>
                        <Input
                          id="eventProgramName"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.eventProgramName}
                          onChange={(e) => handleInputChange("eventProgramName", e.target.value)}
                          placeholder="e.g., All-Star Showcase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sponsorshipAmount" className="text-gray-300">Requested Amount</Label>
                        <Input
                          id="sponsorshipAmount"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.sponsorshipAmount}
                          onChange={(e) => handleInputChange("sponsorshipAmount", e.target.value)}
                          placeholder="e.g., $5,000"
                        />
                      </div>
                    </div>
                  )}

                  {selectedTemplate?.id === "media-content" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Scope</h3>
                      <div className="space-y-2">
                        <Label htmlFor="mediaType" className="text-gray-300">Media Format</Label>
                        <Input
                          id="mediaType"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.mediaType}
                          onChange={(e) => handleInputChange("mediaType", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedTemplate?.id === "nil-partnership" && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-brand-orange" />
                        NIL Core Terms
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="athleteName" className="text-gray-300">Athlete(s)</Label>
                        <Input
                          id="athleteName"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.athleteName}
                          onChange={(e) => handleInputChange("athleteName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialMediaFollowing" className="text-gray-300">Combined Reach</Label>
                        <Input
                          id="socialMediaFollowing"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.socialMediaFollowing}
                          onChange={(e) => handleInputChange("socialMediaFollowing", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Compensation</Label>
                          <Select
                            value={formData.compensationType}
                            onValueChange={(val) => handleInputChange("compensationType", val)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-navy-900 border-white/10 text-white">
                              <SelectItem value="Cash">Cash Only</SelectItem>
                              <SelectItem value="Product">Product Only</SelectItem>
                              <SelectItem value="Cash + Product">Cash + Product</SelectItem>
                              <SelectItem value="Cash + Product + Appearances">Cash + Product + Appearances</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">Duration</Label>
                          <Select
                            value={formData.dealDuration}
                            onValueChange={(val) => handleInputChange("dealDuration", val)}
                          >
                            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-navy-900 border-white/10 text-white">
                              <SelectItem value="3 months">3 months</SelectItem>
                              <SelectItem value="6 months">6 months</SelectItem>
                              <SelectItem value="12 months">12 months</SelectItem>
                              <SelectItem value="Per Event">Per Event</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Exclusivity</Label>
                        <Select
                          value={formData.exclusivityType}
                          onValueChange={(val) => handleInputChange("exclusivityType", val)}
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-900 border-white/10 text-white">
                            <SelectItem value="Non-exclusive">Non-exclusive</SelectItem>
                            <SelectItem value="Category Exclusive">Category Exclusive</SelectItem>
                            <SelectItem value="Fully Exclusive">Fully Exclusive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contentRequirements" className="text-gray-300">Content Deliverables</Label>
                        <Textarea
                          id="contentRequirements"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.contentRequirements}
                          onChange={(e) => handleInputChange("contentRequirements", e.target.value)}
                          placeholder="e.g., 2 Instagram posts, 4 stories per month"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="bg-white/5" />

                  {/* Tiers list */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sponsorship Packages</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addTier}
                        className="text-brand-orange hover:bg-brand-orange/10 font-bold"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Package
                      </Button>
                    </div>

                    {formData.tiers.map((tier: any, index: number) => (
                      <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-gray-300">Package {index + 1}</Label>
                          {formData.tiers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTier(index)}
                              className="text-red-400 hover:text-red-500 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          value={tier.tier_name}
                          onChange={(e) => handleTierChange(index, "tier_name", e.target.value)}
                          placeholder="Package Name (e.g. Gold Tier)"
                          className="bg-white/5 border-white/10 text-white font-medium rounded-xl"
                        />
                        <Textarea
                          value={tier.commitment}
                          onChange={(e) => handleTierChange(index, "commitment", e.target.value)}
                          placeholder="Sponsor Commitment (e.g., $1,000 seasonal contribution)"
                          rows={2}
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                        />
                        <Textarea
                          value={tier.deliverables}
                          onChange={(e) => handleTierChange(index, "deliverables", e.target.value)}
                          placeholder="HWH Deliverables (e.g., Jersey branding, flyer logo)"
                          rows={2}
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                        />
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Prepared by */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Signature & Prepared By</h3>
                    <div className="space-y-2">
                      <Label htmlFor="preparedBy" className="text-gray-300">Author Name</Label>
                      <Input
                        id="preparedBy"
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                        value={formData.preparedBy}
                        onChange={(e) => handleInputChange("preparedBy", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yourPhone" className="text-gray-300">Author Phone</Label>
                        <Input
                          id="yourPhone"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.yourPhone}
                          onChange={(e) => handleInputChange("yourPhone", e.target.value)}
                          placeholder="Your phone"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yourEmail" className="text-gray-300">Author Email</Label>
                        <Input
                          id="yourEmail"
                          className="bg-white/5 border-white/10 text-white rounded-xl"
                          value={formData.yourEmail}
                          onChange={(e) => handleInputChange("yourEmail", e.target.value)}
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <Separator className="bg-white/5" />

              {/* Actions panel */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => saveProposal("draft")}
                    disabled={saving}
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-xl"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Draft"}
                  </Button>
                  <Button
                    onClick={openEmailDialog}
                    variant="outline"
                    className="text-brand-orange border-brand-orange/20 hover:bg-brand-orange/10 rounded-xl"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-navy-900 border-white/10 text-white">
                      <DropdownMenuItem onClick={() => saveProposal("sent")} className="hover:bg-white/10">
                        <Send className="h-4 w-4 mr-2" />
                        Mark as Sent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => saveProposal("accepted")} className="hover:bg-white/10">
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Accepted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => saveProposal("declined")} className="hover:bg-white/10 text-red-400">
                        <X className="h-4 w-4 mr-2" />
                        Mark as Declined
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl font-bold py-2.5"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloading ? "Generating PDF..." : "Download PDF Document"}
                </Button>
              </div>
            </div>

            {/* Canvas Preview Area */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-gray-200 overflow-y-auto max-h-[850px] shadow-2xl">
              <div ref={previewRef} className="text-zinc-900 bg-white">
                <ProposalPreview template={selectedTemplate} formData={formData} />
              </div>
            </div>

            {/* Email Dialog */}
            <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
              <DialogContent className="max-w-md bg-navy-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-brand-orange">
                    <Mail className="h-5 w-5" />
                    Send Proposal via Email
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 font-medium">
                    Send proposal link to your brand partner with view analytics enabled.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Recipient Email</Label>
                    <Input
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      value={emailForm.recipient_email}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, recipient_email: e.target.value }))}
                      placeholder="partner@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Recipient Name</Label>
                    <Input
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      value={emailForm.recipient_name}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, recipient_name: e.target.value }))}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Subject</Label>
                    <Input
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Message (optional)</Label>
                    <Textarea
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      value={emailForm.personal_message}
                      onChange={(e) => setEmailForm(prev => ({ ...prev, personal_message: e.target.value }))}
                      placeholder="Add a personal note..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5" onClick={() => setShowEmailDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={sendEmail}
                    disabled={sendingEmail || !emailForm.recipient_email}
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendingEmail ? "Sending..." : "Send Email"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : activeView === "tracking" ? (
          /* Proposals List / Tracking View */
          <div className="bg-navy-800/20 border border-white/5 rounded-3xl p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Proposal Log</h3>
                <p className="text-xs text-gray-400 mt-0.5">Manage and update the status of sent sponsorship sheets.</p>
              </div>
              <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                <div className="px-3 py-1 text-center">
                  <p className="text-sm font-bold text-white">{stats.total}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider">Total</p>
                </div>
                <div className="px-3 py-1 text-center">
                  <p className="text-sm font-bold text-green-400">{stats.accepted}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider">Accepted</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {savedProposals.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-sm">No proposals created yet. Head back to the Editor Canvas to build one.</p>
                </div>
              ) : (
                savedProposals.map((proposal) => {
                  const template = STATIC_TEMPLATES.find(t => t.id === proposal.template_id);
                  const Icon = TEMPLATE_ICONS[proposal.template_id] || FileText;
                  const StatusIcon = STATUS_ICONS[proposal.status] || Clock;
                  return (
                    <div key={proposal.id} className="p-4 bg-navy-800/30 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                          <Icon className="h-5 w-5 text-brand-orange" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {proposal.form_data?.organizationName || "Untitled Proposal"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{template?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                        <div className="text-left md:text-right text-xs text-gray-400">
                          <p>Created: {new Date(proposal.created_at).toLocaleDateString()}</p>
                          <p className="text-[10px] text-gray-500">Id: {proposal.id}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge className={STATUS_COLORS[proposal.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {proposal.status}
                          </Badge>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-navy-900 border-white/10 text-white">
                              <DropdownMenuItem onClick={() => loadProposal(proposal)} className="hover:bg-white/10">
                                <FileText className="h-4 w-4 mr-2" />
                                Edit Proposal
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedProposalAnalytics(proposal); setShowAnalyticsDialog(true); }} className="hover:bg-white/10">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "sent")} className="hover:bg-white/10">
                                <Send className="h-4 w-4 mr-2" />
                                Mark Sent
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "viewed")} className="hover:bg-white/10">
                                <Eye className="h-4 w-4 mr-2" />
                                Mark Viewed (Simulate Open)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "accepted")} className="hover:bg-white/10">
                                <Check className="h-4 w-4 mr-2" />
                                Mark Accepted
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteProposal(proposal.id)} className="hover:bg-white/10 text-red-400">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Analytics Dialog */}
            <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
              <DialogContent className="max-w-md bg-navy-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-brand-orange">
                    <BarChart3 className="h-5 w-5" />
                    Proposal Analytics
                  </DialogTitle>
                </DialogHeader>
                {selectedProposalAnalytics && (
                  <div className="space-y-4 mt-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-3xl font-bold text-brand-orange">{selectedProposalAnalytics.view_count || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">Total View Opens</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-sm font-semibold text-white truncate">
                          {selectedProposalAnalytics.last_viewed
                            ? new Date(selectedProposalAnalytics.last_viewed).toLocaleDateString()
                            : "Never"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Last Viewed</p>
                      </div>
                    </div>

                    {selectedProposalAnalytics.view_history && selectedProposalAnalytics.view_history.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-white mb-2">Detailed Opens Activity</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {selectedProposalAnalytics.view_history.map((view, idx) => (
                            <div key={idx} className="flex justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                              <span>Simulated Client Viewed</span>
                              <span className="text-gray-400">{new Date(view.viewed_at).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* Analytics Overview View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-navy-800/20 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-brand-orange" />
                  <Badge className="bg-brand-orange/10 text-brand-orange border border-brand-orange/20">Total</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-gray-400 mt-1">Active Proposals Tracked</p>
              </div>

              <div className="bg-navy-800/20 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Eye className="h-8 w-8 text-yellow-400" />
                  <Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">Views</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
                <p className="text-xs text-gray-400 mt-1">Total View Opens Registered</p>
              </div>

              <div className="bg-navy-800/20 border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 text-green-400" />
                  <Badge className="bg-green-400/10 text-green-400 border border-green-400/20">Conversion</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{stats.accepted}</p>
                <p className="text-xs text-gray-400 mt-1">Accepted Partnership Proposals</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Open Activity */}
              <div className="bg-navy-800/20 border border-white/5 rounded-3xl p-6">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-brand-orange" />
                  Recent View Actions
                </h3>
                <div className="space-y-3">
                  {recentViews.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No view activity logged yet.</p>
                  ) : (
                    recentViews.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs text-gray-300">
                        <div>
                          <span className="font-semibold text-white">{item.name}</span> was viewed
                        </div>
                        <span className="text-gray-500">{new Date(item.viewed_at).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Viewed Proposals */}
              <div className="bg-navy-800/20 border border-white/5 rounded-3xl p-6">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-yellow-400" />
                  Top Engagement Sheets
                </h3>
                <div className="space-y-3">
                  {topViewed.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">No view counts registered.</p>
                  ) : (
                    topViewed.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{item.form_data?.organizationName || "Draft"}</span>
                        <Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                          {item.view_count} views
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Sub-components: Preview Rendering
function ProposalPreview({ template, formData }: { template: any; formData: any }) {
  if (!template) return null;

  const orgName = formData.organizationName || "[Organization Name]";
  const contactName = formData.contactName || "[Contact Name]";
  const isNIL = template.id === "nil-partnership";

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans leading-relaxed text-zinc-800 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-4 border-b border-gray-100">
        <img src={LOGO_URL} alt="HoopWithHer" className="w-20 h-20 object-contain" />
        <div className="text-right text-sm">
          <p className="font-bold text-[#1E3A8A] uppercase tracking-wider text-base">
            {isNIL ? "NIL PARTNERSHIP SHEET" : "PARTNERSHIP PROPOSAL"}
          </p>
          <p className="text-gray-500 font-semibold mt-1">{template.name}</p>
        </div>
      </div>

      {/* Meta Info Box */}
      <div className="bg-gray-50 p-4 rounded-2xl mb-6 text-xs border border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p><span className="font-bold text-gray-500">PROPOSAL TO:</span> {orgName}</p>
            <p><span className="font-bold text-gray-500">ATTN:</span> {contactName}</p>
            <p><span className="font-bold text-gray-500">PHONE:</span> {formData.contactPhone || "—"}</p>
            <p><span className="font-bold text-gray-500">EMAIL:</span> {formData.contactEmail || "—"}</p>
          </div>
          <div className="text-right space-y-1">
            <p><span className="font-bold text-gray-500">DATE:</span> {formData.date}</p>
            <p><span className="font-bold text-gray-500">NUMBER:</span> {formData.proposalNumber}</p>
            <p><span className="font-bold text-gray-500">EXPIRES:</span> {formData.validUntil}</p>
            <p><span className="font-bold text-gray-500">PREPARED BY:</span> {formData.preparedBy}</p>
          </div>
        </div>
      </div>

      {/* NIL Details */}
      {isNIL && (
        <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-4 mb-6 text-xs">
          <h3 className="font-bold text-brand-orange text-sm mb-2">NIL Parameters</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold text-gray-600">Featured Athlete:</span> {formData.athleteName || "Featured HoopWithHer Athlete"}</p>
              <p><span className="font-semibold text-gray-600">Audience Outreach:</span> {formData.socialMediaFollowing || "TBD"}</p>
            </div>
            <div>
              <p><span className="font-semibold text-gray-600">Compensation:</span> {formData.compensationType}</p>
              <p><span className="font-semibold text-gray-600">Duration:</span> {formData.dealDuration} ({formData.exclusivityType})</p>
            </div>
          </div>
          {formData.contentRequirements && (
            <div className="mt-2.5 border-t border-brand-orange/10 pt-2.5">
              <span className="font-semibold text-gray-600">Posting Requirements:</span>
              <p className="text-gray-700 mt-0.5">{formData.contentRequirements}</p>
            </div>
          )}
        </div>
      )}

      {/* Intro */}
      <div className="mb-6 text-xs">
        <h2 className="text-sm font-bold text-[#1E3A8A] mb-2 uppercase tracking-wide">Introduction</h2>
        <p className="mb-2">Dear {contactName},</p>
        <p className="leading-relaxed text-gray-600">{getIntroText(template.id, orgName, formData)}</p>
      </div>

      {/* Pitch points */}
      <div className="mb-6 text-xs">
        <h2 className="text-sm font-bold text-[#1E3A8A] mb-2 uppercase tracking-wide">Why This Partnership Works</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
          {getWhyPartnerPoints(template.id).map((point: string, i: number) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Seeking points */}
      <div className="mb-6 text-xs">
        <h2 className="text-sm font-bold text-[#1E3A8A] mb-2 uppercase tracking-wide">Seeking Resources</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
          {getSeekingPoints(template.id, formData).map((point: string, i: number) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Brings points */}
      <div className="mb-6 text-xs">
        <h2 className="text-sm font-bold text-[#1E3A8A] mb-2 uppercase tracking-wide">Hoop With Her Deliverables</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
          {getBringsPoints(template.id).map((point: string, i: number) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Tiers list rendering */}
      <div className="mb-6 text-xs">
        <h2 className="text-sm font-bold text-[#1E3A8A] mb-2 uppercase tracking-wide">Packages & Structures</h2>
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-3 font-semibold text-gray-600" style={{ width: "25%" }}>Tier Package</th>
                <th className="p-3 font-semibold text-gray-600" style={{ width: "35%" }}>Commitment</th>
                <th className="p-3 font-semibold text-gray-600" style={{ width: "40%" }}>Deliverables</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formData.tiers.map((tier: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="p-3 font-bold text-[#1E3A8A]">{tier.tier_name}</td>
                  <td className="p-3 text-gray-600">{tier.commitment}</td>
                  <td className="p-3 text-gray-600">{tier.deliverables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8 text-xs text-gray-600">
        <h2 className="text-sm font-bold text-[#1E3A8A] mb-2 uppercase tracking-wide">Next Steps</h2>
        <p className="leading-relaxed">
          We would welcome the opportunity to discuss this proposal and customize the deliverables. Please reach out to{" "}
          <strong>{formData.yourPhone || "[Your Phone]"}</strong> or email <strong>{formData.yourEmail || "[Your Email]"}</strong> to schedule a follow-up discussion.
        </p>
      </div>

      {/* Acceptance Box */}
      <div className="border-t border-gray-200 pt-6 text-xs text-gray-500">
        <p className="mb-4">
          By signing below, {orgName} confirms interest in exploring the outlined partnership. Final terms will be detailed in an official sponsorship agreement.
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold text-gray-600 mb-1">Authorized Representative Signature</p>
            <div className="border-b border-gray-200 h-8"></div>
          </div>
          <div>
            <p className="font-semibold text-gray-600 mb-1">Date</p>
            <div className="border-b border-gray-200 h-8"></div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400 space-y-1">
        <p className="font-bold text-gray-600 text-xs">{formData.preparedBy}</p>
        <p>Founder & Chair, Hoop With Her Girls Basketball</p>
        <p>Fayetteville, NC | Email: {formData.yourEmail || "[Your Email]"} | Phone: {formData.yourPhone || "[Your Phone]"}</p>
      </div>
    </div>
  );
}

// Helpers for template strings
function getIntroText(templateId: string, orgName: string, formData: any) {
  const intros: Record<string, string> = {
    "facility-access": `My name is Lamont Revell Sr., and I am the Founder and Chair of Hoop With Her, a regional girls basketball organization. We are seeking a partnership with ${orgName} to utilize gym facilities for programming on ${formData.daysAndTimes || "scheduled days"}. We believe this alignment will support community mission and maximize court utilization.`,
    "presenting-sponsor": `Hoop With Her is launching a premium showcase platform in Fayetteville. We would like to invite ${orgName} to join us as the presenting sponsor for ${formData.eventProgramName || "our featured program"}, providing key brand visibility in front of active families, high school athletes, and collegiate scouts.`,
    "community-business": `I am writing on behalf of Hoop With Her to explore a community business partnership with ${orgName}. HWH events draw consistent local foot traffic and highly engaged sports families. We believe your business is a fantastic fit to sponsor player awards or seasonal scholarships.`,
    "media-content": `Hoop With Her is building a content-rich media channel. We are seeking a collaboration with ${orgName} to support our digital livestream and athletic highlight edits. A media partnership provides brand integration directly inside shareable player stories.`,
    "apparel-equipment": `We are seeking an equipment and outfitter partnership with ${orgName} to support HWH league players with uniforms and basketball gear. Brand alignment with HWH development camps showcases your products directly inside active regional courts.`,
    "nil-partnership": `Hoop With Her is establishing NIL (Name, Image, Likeness) partnerships. We invite ${orgName} to sponsor HWH brand ambassadors (featured player: ${formData.athleteName || "HWH Athlete"}). Our player-led content drives authentic reach and represents positive youth leadership in our local community.`,
  };
  return intros[templateId] || "";
}

function getWhyPartnerPoints(templateId: string) {
  const points: Record<string, string[]> = {
    "facility-access": [
      "Shared mission around healthy youth development, discipline, and gender equity in sports.",
      "Activate courts during low-utilization slots with reliable regional family attendees.",
      "Positive community recognition for supporting girls athletic access.",
    ],
    "presenting-sponsor": [
      "Premium brand positioning across event banners, digital fliers, and social graphics.",
      "Association with a credible, safe, high-energy environment that families trust.",
      "On-site brand activation opportunities to directly interface with potential local clients.",
    ],
    "community-business": [
      "Visible support for youth programs builds long-term local brand loyalty.",
      "Sponsor logo displayed in community sections of HWH player rosters.",
      "Engagement with active, supportive local Fayetteville parents and business owners.",
    ],
    "media-content": [
      "Highlight reels and player profiles receive consistent organic shares and pageviews.",
      "Reach high school basketball fans, family networks, and college scouts.",
      "Sponsor logo embedded as a permanent watermark on video replays and lower thirds.",
    ],
    "apparel-equipment": [
      "Direct product placement and gear exposure among target youth athletes and families.",
      "Features brand equipment in HWH promotional film shoots and training media.",
      "Supports athletic preparation, uniform presentation, and tournament readiness.",
    ],
    "nil-partnership": [
      "Authentic athlete representation drives high engagement on Instagram, TikTok, and YouTube.",
      "HWH provides professional coordination and full compliance checking for all deals.",
      "Aligns your local business with positive, talented young role models.",
    ]
  };
  return points[templateId] || [];
}

function getSeekingPoints(templateId: string, formData: any) {
  const points: Record<string, string[]> = {
    "facility-access": [
      `Court access to ${formData.numberOfCourts} courts on ${formData.daysAndTimes} during ${formData.seasonOrDateRange}.`,
      "MOU outlining rules, facility safety guidelines, and schedule coordination.",
    ],
    "presenting-sponsor": [
      `Financial sponsorship of ${formData.sponsorshipAmount || "[$ amount]"} for presenting rights.`,
      "Promotional product or giveaway contributions for event guests and champions.",
    ],
    "community-business": [
      "A seasonal scholarship contribution or player support fee sponsorship.",
      "Support with in-kind product vouchers or gift cards for local team banquets.",
    ],
    "media-content": [
      `Digital production support (e.g. photography, audio setups, livestreaming equipment).`,
      "Content editing collaboration for tournament highlights.",
    ],
    "apparel-equipment": [
      "Supply of jerseys, warmups, training bibs, or gym equipment.",
      "Exclusivity options for team apparel brand partnership.",
    ],
    "nil-partnership": [
      `${formData.compensationType} package for the designated athlete.`,
      `Ambassadorship duration of ${formData.dealDuration} under ${formData.exclusivityType.toLowerCase()} terms.`,
    ]
  };
  return points[templateId] || [];
}

function getBringsPoints(templateId: string) {
  const points: Record<string, string[]> = {
    "facility-access": [
      "Comprehensive general liability insurance coverage listing you as additionally insured.",
      "Professional site supervision, setup, and cleanup after every scheduled session.",
      "Named facility partner branding on HWH program fliers and social headers.",
    ],
    "presenting-sponsor": [
      "Presenting naming rights (e.g. 'All-Star Camp Presented by Brand').",
      "Prime logo placement on all event signage, banners, and player registration sheets.",
      "On-site booth space and public announcements acknowledging sponsorship.",
    ],
    "community-business": [
      "Recognition on HWH local business support directories.",
      "Social media showcase post thanking your business for supporting local athletes.",
      "Complimentary tickets to seasonal tournament showcases.",
    ],
    "media-content": [
      "Logo overlay watermark on HWH highlight reels.",
      "Sponsored by credits in livestream intro/outro rolls.",
      "Dedicated social posts tag-out to media channels.",
    ],
    "apparel-equipment": [
      "Official outfitter badge placement on team uniform sleeves.",
      "Digital integration of your brand products in HWH player gear checklists.",
      "Product distribution and brand awareness during athlete check-in.",
    ],
    "nil-partnership": [
      "Authentic athlete content creations showcasing your products/services.",
      "Social posts on athlete accounts tagging your business profile.",
      "HWH compliant deal oversight and regular communication reports.",
    ]
  };
  return points[templateId] || [];
}
