import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Building2,
  Trophy,
  Heart,
  Film,
  Shirt,
  LogOut,
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
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOGO_URL = "https://customer-assets.emergentagent.com/job_62b58a24-a85f-4363-8413-49d80cc7ae03/artifacts/hutkfplo_fb%20profile%20hoopwithher.png";

const TEMPLATE_ICONS = {
  "facility-access": Building2,
  "presenting-sponsor": Trophy,
  "community-business": Heart,
  "media-content": Film,
  "apparel-equipment": Shirt,
  "nil-partnership": Star,
};

const STATUS_COLORS = {
  draft: "bg-zinc-100 text-zinc-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

const STATUS_ICONS = {
  draft: Clock,
  sent: Send,
  viewed: Eye,
  accepted: Check,
  declined: X,
};

const getDefaultFormData = (template) => ({
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
  tiers: template?.default_tiers?.map(t => ({...t})) || [],
});

export default function DashboardPage({ onLogout }) {
  const [templates, setTemplates] = useState([]);
  const [quickTemplates, setQuickTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(getDefaultFormData(null));
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showQuickTemplates, setShowQuickTemplates] = useState(false);
  const [showSavedProposals, setShowSavedProposals] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [savedProposals, setSavedProposals] = useState([]);
  const [currentProposalId, setCurrentProposalId] = useState(null);
  const [proposalStats, setProposalStats] = useState(null);
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [selectedProposalAnalytics, setSelectedProposalAnalytics] = useState(null);
  const [activeView, setActiveView] = useState("editor"); // editor, tracking, analytics
  const [emailForm, setEmailForm] = useState({ recipient_email: "", recipient_name: "", subject: "", personal_message: "" });
  const [sendingEmail, setSendingEmail] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    fetchTemplates();
    fetchQuickTemplates();
    fetchProposals();
    fetchProposalStats();
    fetchAnalyticsOverview();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data);
      if (response.data.length > 0) {
        setSelectedTemplate(response.data[0]);
        setFormData(getDefaultFormData(response.data[0]));
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickTemplates = async () => {
    try {
      const response = await axios.get(`${API}/quick-templates`);
      setQuickTemplates(response.data);
    } catch (err) {
      console.error("Failed to fetch quick templates:", err);
    }
  };

  const fetchProposals = async () => {
    try {
      const response = await axios.get(`${API}/proposals`);
      setSavedProposals(response.data);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
    }
  };

  const fetchProposalStats = async () => {
    try {
      const response = await axios.get(`${API}/proposals/stats/summary`);
      setProposalStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchAnalyticsOverview = async () => {
    try {
      const response = await axios.get(`${API}/analytics/overview`);
      setAnalyticsOverview(response.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const fetchProposalAnalytics = async (proposalId) => {
    try {
      const response = await axios.get(`${API}/proposals/${proposalId}/analytics`);
      setSelectedProposalAnalytics(response.data);
      setShowAnalyticsDialog(true);
    } catch (err) {
      console.error("Failed to fetch proposal analytics:", err);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData(getDefaultFormData(template));
    setCurrentProposalId(null);
    setActiveView("editor");
  };

  const handleQuickTemplateSelect = (quickTemplate) => {
    const template = templates.find(t => t.id === quickTemplate.template_type);
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData(prev => {
      const newTiers = [...prev.tiers];
      newTiers[index] = { ...newTiers[index], [field]: value };
      return { ...prev, tiers: newTiers };
    });
  };

  const addTier = () => {
    setFormData(prev => ({
      ...prev,
      tiers: [...prev.tiers, { tier_name: "New Tier", commitment: "", deliverables: "" }]
    }));
  };

  const removeTier = (index) => {
    setFormData(prev => ({
      ...prev,
      tiers: prev.tiers.filter((_, i) => i !== index)
    }));
  };

  const saveProposal = async (status = "draft") => {
    setSaving(true);
    try {
      if (currentProposalId) {
        await axios.put(`${API}/proposals/${currentProposalId}`, {
          form_data: formData,
          status
        });
      } else {
        const response = await axios.post(`${API}/proposals`, {
          template_id: selectedTemplate.id,
          form_data: formData,
          status
        });
        setCurrentProposalId(response.data.id);
      }
      fetchProposals();
      fetchProposalStats();
    } catch (err) {
      console.error("Failed to save proposal:", err);
    } finally {
      setSaving(false);
    }
  };

  const loadProposal = async (proposal) => {
    const template = templates.find(t => t.id === proposal.template_id);
    if (template) {
      setSelectedTemplate(template);
      setFormData(proposal.form_data);
      setCurrentProposalId(proposal.id);
      setActiveView("editor");
    }
    setShowSavedProposals(false);
  };

  const updateProposalStatus = async (proposalId, newStatus) => {
    try {
      await axios.put(`${API}/proposals/${proposalId}`, { status: newStatus });
      fetchProposals();
      fetchProposalStats();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteProposal = async (proposalId) => {
    try {
      await axios.delete(`${API}/proposals/${proposalId}`);
      fetchProposals();
      fetchProposalStats();
      fetchAnalyticsOverview();
      if (currentProposalId === proposalId) {
        setCurrentProposalId(null);
        setFormData(getDefaultFormData(selectedTemplate));
      }
    } catch (err) {
      console.error("Failed to delete proposal:", err);
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

  const sendEmail = async () => {
    if (!currentProposalId) {
      // Save first if not saved
      await saveProposal("draft");
    }
    
    setSendingEmail(true);
    try {
      await axios.post(`${API}/proposals/${currentProposalId}/send-email`, {
        proposal_id: currentProposalId,
        ...emailForm
      });
      setShowEmailDialog(false);
      fetchProposals();
      fetchProposalStats();
      alert("Email sent successfully!");
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
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

  const filteredQuickTemplates = selectedTemplate 
    ? quickTemplates.filter(qt => qt.template_type === selectedTemplate.id)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="HWH" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-heading font-bold text-sm text-zinc-900">HOOPWITHHER</h1>
              <p className="text-xs text-zinc-500">Proposal Builder</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {proposalStats && (
          <div className="p-4 border-b border-zinc-200 bg-zinc-50">
            <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
              Proposal Stats
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white rounded p-2">
                <p className="text-lg font-bold text-[#1E3A8A]">{proposalStats.total}</p>
                <p className="text-xs text-zinc-500">Total</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-lg font-bold text-green-600">{proposalStats.by_status?.accepted || 0}</p>
                <p className="text-xs text-zinc-500">Accepted</p>
              </div>
            </div>
            {analyticsOverview && (
              <div className="mt-2 bg-white rounded p-2 text-center">
                <p className="text-lg font-bold text-[#F97316]">{analyticsOverview.total_views}</p>
                <p className="text-xs text-zinc-500">Total Views</p>
              </div>
            )}
          </div>
        )}

        {/* View Toggle */}
        <div className="p-2 border-b border-zinc-200">
          <div className="flex gap-1">
            <Button
              variant={activeView === "editor" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("editor")}
              className={`flex-1 text-xs ${activeView === "editor" ? "bg-[#1E3A8A]" : ""}`}
              data-testid="view-editor-btn"
            >
              <FileText className="h-3 w-3 mr-1" />
              Editor
            </Button>
            <Button
              variant={activeView === "tracking" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("tracking")}
              className={`flex-1 text-xs ${activeView === "tracking" ? "bg-[#1E3A8A]" : ""}`}
              data-testid="view-tracking-btn"
            >
              <Eye className="h-3 w-3 mr-1" />
              Track
            </Button>
            <Button
              variant={activeView === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => { setActiveView("analytics"); fetchAnalyticsOverview(); }}
              className={`flex-1 text-xs ${activeView === "analytics" ? "bg-[#1E3A8A]" : ""}`}
              data-testid="view-analytics-btn"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Analytics
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 px-4 py-2">
            Templates
          </p>
          {templates.map((template) => {
            const Icon = TEMPLATE_ICONS[template.id] || FileText;
            const isActive = selectedTemplate?.id === template.id;
            const isNIL = template.id === "nil-partnership";
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-[#1E3A8A]"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
                data-testid={`template-${template.id}`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isNIL ? "text-[#F97316]" : ""}`} />
                <span className="text-sm font-medium truncate">{template.name}</span>
                {isNIL && <Badge className="bg-[#F97316] text-white text-[10px] px-1">NEW</Badge>}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </button>
            );
          })}
        </ScrollArea>

        <div className="p-4 border-t border-zinc-200 space-y-2">
          <Dialog open={showSavedProposals} onOpenChange={setShowSavedProposals}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-zinc-600"
                data-testid="load-proposal-btn"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Load Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Saved Proposals</DialogTitle>
                <DialogDescription>Load a previously saved proposal to edit or track.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                {savedProposals.length === 0 ? (
                  <p className="text-center text-zinc-500 py-8">No saved proposals yet.</p>
                ) : (
                  savedProposals.map((proposal) => {
                    const template = templates.find(t => t.id === proposal.template_id);
                    const StatusIcon = STATUS_ICONS[proposal.status] || Clock;
                    return (
                      <div
                        key={proposal.id}
                        className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-zinc-900">
                            {proposal.form_data?.organizationName || "Untitled Proposal"}
                          </p>
                          <p className="text-sm text-zinc-500">{template?.name}</p>
                          <p className="text-xs text-zinc-400">
                            Updated: {new Date(proposal.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={STATUS_COLORS[proposal.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {proposal.status}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => loadProposal(proposal)}
                            data-testid={`load-${proposal.id}`}
                          >
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

          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full justify-start text-zinc-500 hover:text-zinc-900"
            data-testid="logout-button"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === "editor" ? (
        <>
          {/* Editor Panel */}
          <div className="w-[420px] bg-white border-r border-zinc-200 overflow-y-auto">
            <div className="p-6 border-b border-zinc-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-heading text-xl font-bold tracking-tight text-zinc-900">
                    {selectedTemplate?.name}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">{selectedTemplate?.description}</p>
                </div>
                {currentProposalId && (
                  <Badge className="bg-green-100 text-green-700">Saved</Badge>
                )}
              </div>

              {/* Quick Templates Button */}
              {filteredQuickTemplates.length > 0 && (
                <Dialog open={showQuickTemplates} onOpenChange={setShowQuickTemplates}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 text-[#F97316] border-[#F97316] hover:bg-[#F97316]/10"
                      data-testid="quick-templates-btn"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Quick Templates
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Quick Templates</DialogTitle>
                      <DialogDescription>
                        Start with pre-filled data for common partner types.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {filteredQuickTemplates.map((qt) => (
                        <button
                          key={qt.id}
                          onClick={() => handleQuickTemplateSelect(qt)}
                          className="p-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors text-left"
                          data-testid={`quick-${qt.id}`}
                        >
                          <p className="font-semibold text-zinc-900 text-sm">{qt.name}</p>
                          <p className="text-xs text-zinc-500 mt-1">{qt.description}</p>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="p-6 space-y-6">
                {/* Recipient Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                    Recipient Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange("organizationName", e.target.value)}
                      placeholder="Enter organization name"
                      data-testid="input-organization-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      placeholder="Enter contact name"
                      data-testid="input-contact-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        placeholder="Phone number"
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        placeholder="Email address"
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Proposal Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                    Proposal Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        data-testid="input-date"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proposalNumber">Proposal #</Label>
                      <Input
                        id="proposalNumber"
                        value={formData.proposalNumber}
                        onChange={(e) => handleInputChange("proposalNumber", e.target.value)}
                        data-testid="input-proposal-number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      value={formData.validUntil}
                      onChange={(e) => handleInputChange("validUntil", e.target.value)}
                      placeholder="e.g., 30 days"
                      data-testid="input-valid-until"
                    />
                  </div>
                </div>

                <Separator />

                {/* Template-Specific Fields */}
                {selectedTemplate?.id === "facility-access" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Facility Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="numberOfCourts">Number of Courts</Label>
                      <Input
                        id="numberOfCourts"
                        value={formData.numberOfCourts}
                        onChange={(e) => handleInputChange("numberOfCourts", e.target.value)}
                        data-testid="input-number-of-courts"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daysAndTimes">Days/Times</Label>
                      <Input
                        id="daysAndTimes"
                        value={formData.daysAndTimes}
                        onChange={(e) => handleInputChange("daysAndTimes", e.target.value)}
                        data-testid="input-days-times"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seasonOrDateRange">Season/Date Range</Label>
                      <Input
                        id="seasonOrDateRange"
                        value={formData.seasonOrDateRange}
                        onChange={(e) => handleInputChange("seasonOrDateRange", e.target.value)}
                        data-testid="input-season-date-range"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate?.id === "presenting-sponsor" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Sponsorship Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="eventProgramName">Event/Program Name</Label>
                      <Input
                        id="eventProgramName"
                        value={formData.eventProgramName}
                        onChange={(e) => handleInputChange("eventProgramName", e.target.value)}
                        placeholder="e.g., All-Star Showcase 2026"
                        data-testid="input-event-program-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsorshipAmount">Sponsorship Amount</Label>
                      <Input
                        id="sponsorshipAmount"
                        value={formData.sponsorshipAmount}
                        onChange={(e) => handleInputChange("sponsorshipAmount", e.target.value)}
                        placeholder="e.g., $5,000"
                        data-testid="input-sponsorship-amount"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate?.id === "media-content" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Media Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="mediaType">Media Type</Label>
                      <Input
                        id="mediaType"
                        value={formData.mediaType}
                        onChange={(e) => handleInputChange("mediaType", e.target.value)}
                        placeholder="e.g., streaming / photography / video"
                        data-testid="input-media-type"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate?.id === "nil-partnership" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#F97316]" />
                      NIL Partnership Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="athleteName">Athlete Name(s)</Label>
                      <Input
                        id="athleteName"
                        value={formData.athleteName}
                        onChange={(e) => handleInputChange("athleteName", e.target.value)}
                        placeholder="e.g., Featured HWH Athletes"
                        data-testid="input-athlete-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialMediaFollowing">Combined Social Media Following</Label>
                      <Input
                        id="socialMediaFollowing"
                        value={formData.socialMediaFollowing}
                        onChange={(e) => handleInputChange("socialMediaFollowing", e.target.value)}
                        placeholder="e.g., 50,000+ followers"
                        data-testid="input-social-following"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="compensationType">Compensation Type</Label>
                        <Select
                          value={formData.compensationType}
                          onValueChange={(value) => handleInputChange("compensationType", value)}
                        >
                          <SelectTrigger data-testid="select-compensation">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash Only</SelectItem>
                            <SelectItem value="Product">Product Only</SelectItem>
                            <SelectItem value="Cash + Product">Cash + Product</SelectItem>
                            <SelectItem value="Cash + Product + Appearances">Cash + Product + Appearances</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dealDuration">Deal Duration</Label>
                        <Select
                          value={formData.dealDuration}
                          onValueChange={(value) => handleInputChange("dealDuration", value)}
                        >
                          <SelectTrigger data-testid="select-duration">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3 months">3 months</SelectItem>
                            <SelectItem value="6 months">6 months</SelectItem>
                            <SelectItem value="12 months">12 months</SelectItem>
                            <SelectItem value="Per Event">Per Event</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exclusivityType">Exclusivity</Label>
                      <Select
                        value={formData.exclusivityType}
                        onValueChange={(value) => handleInputChange("exclusivityType", value)}
                      >
                        <SelectTrigger data-testid="select-exclusivity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Non-exclusive">Non-exclusive</SelectItem>
                          <SelectItem value="Category Exclusive">Category Exclusive</SelectItem>
                          <SelectItem value="Fully Exclusive">Fully Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentRequirements">Content Requirements</Label>
                      <Textarea
                        id="contentRequirements"
                        value={formData.contentRequirements}
                        onChange={(e) => handleInputChange("contentRequirements", e.target.value)}
                        placeholder="e.g., 2 Instagram posts per month, 4 stories per month, 1 TikTok video per month"
                        rows={3}
                        data-testid="input-content-requirements"
                      />
                    </div>
                  </div>
                )}

                {selectedTemplate?.id !== "nil-partnership" && <Separator />}

                {/* Partnership Tiers */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                      Partnership Tiers
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addTier}
                      className="text-[#1E3A8A] hover:text-[#1E3A8A]/80"
                      data-testid="add-tier-button"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tier
                    </Button>
                  </div>

                  {formData.tiers.map((tier, index) => (
                    <div key={index} className="p-4 bg-zinc-50 rounded-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Tier {index + 1}</Label>
                        {formData.tiers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTier(index)}
                            className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
                            data-testid={`remove-tier-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        value={tier.tier_name}
                        onChange={(e) => handleTierChange(index, "tier_name", e.target.value)}
                        placeholder="Tier Name"
                        className="font-medium"
                        data-testid={`tier-name-${index}`}
                      />
                      <Textarea
                        value={tier.commitment}
                        onChange={(e) => handleTierChange(index, "commitment", e.target.value)}
                        placeholder="Partner Commitment"
                        rows={2}
                        data-testid={`tier-commitment-${index}`}
                      />
                      <Textarea
                        value={tier.deliverables}
                        onChange={(e) => handleTierChange(index, "deliverables", e.target.value)}
                        placeholder="HWH Deliverables"
                        rows={2}
                        data-testid={`tier-deliverables-${index}`}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Your Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                    Your Contact Information
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="preparedBy">Prepared By</Label>
                    <Input
                      id="preparedBy"
                      value={formData.preparedBy}
                      onChange={(e) => handleInputChange("preparedBy", e.target.value)}
                      data-testid="input-prepared-by"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yourPhone">Your Phone</Label>
                      <Input
                        id="yourPhone"
                        value={formData.yourPhone}
                        onChange={(e) => handleInputChange("yourPhone", e.target.value)}
                        placeholder="Your phone"
                        data-testid="input-your-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yourEmail">Your Email</Label>
                      <Input
                        id="yourEmail"
                        value={formData.yourEmail}
                        onChange={(e) => handleInputChange("yourEmail", e.target.value)}
                        placeholder="Your email"
                        data-testid="input-your-email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="p-4 border-t border-zinc-200 bg-white space-y-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => saveProposal("draft")}
                  disabled={saving}
                  variant="outline"
                  className="flex-1"
                  data-testid="save-draft-button"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={openEmailDialog}
                  variant="outline"
                  className="text-[#F97316] border-[#F97316] hover:bg-[#F97316]/10"
                  data-testid="send-email-button"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" data-testid="save-status-dropdown">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => saveProposal("sent")}>
                      <Send className="h-4 w-4 mr-2" />
                      Mark as Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => saveProposal("accepted")}>
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => saveProposal("declined")}>
                      <X className="h-4 w-4 mr-2" />
                      Mark as Declined
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                onClick={downloadPDF}
                disabled={downloading}
                className="w-full bg-[#1E3A8A] text-white rounded-sm px-6 py-2.5 font-semibold text-sm hover:bg-[#1E3A8A]/90 transition-colors"
                data-testid="download-pdf-button"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? "Generating PDF..." : "Download PDF"}
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 bg-zinc-100 p-8 overflow-y-auto">
            <div className="fade-in" ref={previewRef}>
              <ProposalPreview template={selectedTemplate} formData={formData} />
            </div>
          </div>

          {/* Email Dialog */}
          <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#F97316]" />
                  Send Proposal via Email
                </DialogTitle>
                <DialogDescription>
                  Send this proposal directly to the partner with tracking enabled.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input
                    value={emailForm.recipient_email}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, recipient_email: e.target.value }))}
                    placeholder="partner@company.com"
                    data-testid="email-recipient"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Recipient Name</Label>
                  <Input
                    value={emailForm.recipient_name}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, recipient_name: e.target.value }))}
                    placeholder="John Smith"
                    data-testid="email-recipient-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Partnership Proposal from HoopWithHer"
                    data-testid="email-subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Personal Message (optional)</Label>
                  <Textarea
                    value={emailForm.personal_message}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, personal_message: e.target.value }))}
                    placeholder="Add a personal note to your email..."
                    rows={3}
                    data-testid="email-message"
                  />
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-sm text-zinc-600">
                  <p className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#F97316]" />
                    <strong>Tracking enabled:</strong> You'll see when they open this email
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={sendEmail}
                  disabled={sendingEmail || !emailForm.recipient_email}
                  className="bg-[#F97316] hover:bg-[#F97316]/90"
                  data-testid="send-email-confirm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendingEmail ? "Sending..." : "Send Email"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : activeView === "tracking" ? (
        /* Tracking View */
        <div className="flex-1 bg-zinc-50 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-zinc-900">
                Proposal Tracking
              </h2>
              <p className="text-zinc-500 mt-1">Monitor the status of all your partnership proposals.</p>
            </div>

            {/* Stats Cards */}
            {proposalStats && (
              <div className="grid grid-cols-5 gap-4 mb-8">
                {Object.entries(proposalStats.by_status || {}).map(([status, count]) => {
                  const StatusIcon = STATUS_ICONS[status] || Clock;
                  return (
                    <div key={status} className="bg-white rounded-lg p-4 border border-zinc-200">
                      <div className="flex items-center justify-between">
                        <StatusIcon className={`h-5 w-5 ${status === "accepted" ? "text-green-600" : status === "declined" ? "text-red-600" : status === "viewed" ? "text-yellow-600" : "text-zinc-400"}`} />
                        <span className="text-2xl font-bold text-zinc-900">{count}</span>
                      </div>
                      <p className="text-sm text-zinc-500 mt-2 capitalize">{status}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Proposals List */}
            <div className="bg-white rounded-lg border border-zinc-200">
              <div className="p-4 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900">All Proposals</h3>
              </div>
              <div className="divide-y divide-zinc-200">
                {savedProposals.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                    <p>No proposals yet. Create your first proposal to get started!</p>
                  </div>
                ) : (
                  savedProposals.map((proposal) => {
                    const template = templates.find(t => t.id === proposal.template_id);
                    const Icon = TEMPLATE_ICONS[proposal.template_id] || FileText;
                    const StatusIcon = STATUS_ICONS[proposal.status] || Clock;
                    return (
                      <div key={proposal.id} className="p-4 hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-zinc-100 rounded-lg">
                              <Icon className="h-5 w-5 text-[#1E3A8A]" />
                            </div>
                            <div>
                              <p className="font-semibold text-zinc-900">
                                {proposal.form_data?.organizationName || "Untitled Proposal"}
                              </p>
                              <p className="text-sm text-zinc-500">{template?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm text-zinc-500">
                              <p>Created: {new Date(proposal.created_at).toLocaleDateString()}</p>
                              <p>Updated: {new Date(proposal.updated_at).toLocaleDateString()}</p>
                            </div>
                            <Badge className={STATUS_COLORS[proposal.status]}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {proposal.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => loadProposal(proposal)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => fetchProposalAnalytics(proposal.id)}>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "sent")}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Mark Sent
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "viewed")}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Mark Viewed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "accepted")}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark Accepted
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateProposalStatus(proposal.id, "declined")}>
                                  <X className="h-4 w-4 mr-2" />
                                  Mark Declined
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteProposal(proposal.id)}
                                  className="text-red-600"
                                >
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
            </div>
          </div>

          {/* Analytics Dialog */}
          <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#F97316]" />
                  Proposal Analytics
                </DialogTitle>
              </DialogHeader>
              {selectedProposalAnalytics && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-[#1E3A8A]">{selectedProposalAnalytics.total_views}</p>
                      <p className="text-sm text-zinc-500">Total Views</p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg text-center">
                      <p className="text-lg font-semibold text-zinc-900">
                        {selectedProposalAnalytics.last_viewed 
                          ? new Date(selectedProposalAnalytics.last_viewed).toLocaleDateString()
                          : "Never"}
                      </p>
                      <p className="text-sm text-zinc-500">Last Viewed</p>
                    </div>
                  </div>
                  
                  {selectedProposalAnalytics.view_history?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-zinc-900 mb-2">View History</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedProposalAnalytics.view_history.map((view, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-zinc-50 rounded text-sm">
                            <span className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-zinc-400" />
                              Viewed
                            </span>
                            <span className="text-zinc-500">
                              {new Date(view.viewed_at).toLocaleString()}
                            </span>
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
        /* Analytics View */
        <div className="flex-1 bg-zinc-50 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-[#F97316]" />
                Analytics Dashboard
              </h2>
              <p className="text-zinc-500 mt-1">Track engagement and views across all proposals.</p>
            </div>

            {analyticsOverview && (
              <>
                {/* Overview Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-6 border border-zinc-200">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-8 w-8 text-[#1E3A8A]" />
                      <Badge className="bg-blue-100 text-blue-700">Total</Badge>
                    </div>
                    <p className="text-3xl font-bold text-zinc-900">{analyticsOverview.total_proposals}</p>
                    <p className="text-sm text-zinc-500 mt-1">Proposals Created</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-zinc-200">
                    <div className="flex items-center justify-between mb-4">
                      <Eye className="h-8 w-8 text-[#F97316]" />
                      <Badge className="bg-orange-100 text-orange-700">Views</Badge>
                    </div>
                    <p className="text-3xl font-bold text-zinc-900">{analyticsOverview.total_views}</p>
                    <p className="text-sm text-zinc-500 mt-1">Total Email Opens</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 border border-zinc-200">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="h-8 w-8 text-green-600" />
                      <Badge className="bg-green-100 text-green-700">Rate</Badge>
                    </div>
                    <p className="text-3xl font-bold text-zinc-900">
                      {analyticsOverview.total_proposals > 0 
                        ? Math.round((analyticsOverview.total_views / analyticsOverview.total_proposals) * 100) / 100
                        : 0}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">Avg Views per Proposal</p>
                  </div>
                </div>

                {/* Recent Views */}
                <div className="bg-white rounded-lg border border-zinc-200 mb-8">
                  <div className="p-4 border-b border-zinc-200">
                    <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Activity
                    </h3>
                  </div>
                  <div className="divide-y divide-zinc-200">
                    {analyticsOverview.recent_views?.length > 0 ? (
                      analyticsOverview.recent_views.map((view, i) => {
                        const proposal = savedProposals.find(p => p.id === view.proposal_id);
                        return (
                          <div key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#F97316]/10 rounded-full">
                                <Eye className="h-4 w-4 text-[#F97316]" />
                              </div>
                              <div>
                                <p className="font-medium text-zinc-900">
                                  {proposal?.form_data?.organizationName || "Unknown Proposal"}
                                </p>
                                <p className="text-sm text-zinc-500">was viewed</p>
                              </div>
                            </div>
                            <p className="text-sm text-zinc-500">
                              {new Date(view.viewed_at).toLocaleString()}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-zinc-500">
                        <Eye className="h-12 w-12 mx-auto mb-4 text-zinc-300" />
                        <p>No views yet. Send proposals to start tracking engagement!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Viewed Proposals */}
                {analyticsOverview.top_viewed_proposals?.length > 0 && (
                  <div className="bg-white rounded-lg border border-zinc-200">
                    <div className="p-4 border-b border-zinc-200">
                      <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Most Viewed Proposals
                      </h3>
                    </div>
                    <div className="divide-y divide-zinc-200">
                      {analyticsOverview.top_viewed_proposals.map((item, i) => {
                        const proposal = savedProposals.find(p => p.id === item._id);
                        return (
                          <div key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
                                {i + 1}
                              </div>
                              <p className="font-medium text-zinc-900">
                                {proposal?.form_data?.organizationName || "Unknown Proposal"}
                              </p>
                            </div>
                            <Badge className="bg-[#F97316]/10 text-[#F97316]">
                              {item.view_count} views
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProposalPreview({ template, formData }) {
  if (!template) return null;

  const orgName = formData.organizationName || "[Organization Name]";
  const contactName = formData.contactName || "[Contact Name]";
  const isNIL = template.id === "nil-partnership";

  return (
    <div className="proposal-paper">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <img src={LOGO_URL} alt="HoopWithHer" className="w-24 h-24 object-contain" />
        <div className="text-right text-sm text-zinc-600">
          <p className="font-semibold text-[#1E3A8A]">
            {isNIL ? "NIL PARTNERSHIP PROPOSAL" : "PARTNERSHIP PROPOSAL"}
          </p>
          <p className="text-xs mt-1">{template.name}</p>
        </div>
      </div>

      {/* Recipient Info Box */}
      <div className="bg-zinc-50 p-4 rounded mb-6 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><span className="font-semibold">TO:</span> {orgName}</p>
            <p><span className="font-semibold">CONTACT:</span> {contactName}</p>
            <p><span className="font-semibold">PHONE:</span> {formData.contactPhone || "[Contact Phone]"}</p>
            <p><span className="font-semibold">EMAIL:</span> {formData.contactEmail || "[Contact Email]"}</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">DATE:</span> {formData.date}</p>
            <p><span className="font-semibold">PROPOSAL #:</span> {formData.proposalNumber}</p>
            <p><span className="font-semibold">VALID UNTIL:</span> {formData.validUntil}</p>
            <p><span className="font-semibold">PREPARED BY:</span> {formData.preparedBy}</p>
          </div>
        </div>
      </div>

      {/* NIL-Specific Section */}
      {isNIL && (
        <div className="bg-[#F97316]/10 border border-[#F97316]/30 rounded p-4 mb-6">
          <h3 className="font-heading text-lg font-bold text-[#F97316] mb-3">NIL Partnership Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Athletes:</span> {formData.athleteName || "HoopWithHer Featured Athletes"}</p>
              <p><span className="font-semibold">Social Reach:</span> {formData.socialMediaFollowing || "To be determined"}</p>
            </div>
            <div>
              <p><span className="font-semibold">Compensation:</span> {formData.compensationType}</p>
              <p><span className="font-semibold">Duration:</span> {formData.dealDuration}</p>
              <p><span className="font-semibold">Exclusivity:</span> {formData.exclusivityType}</p>
            </div>
          </div>
          {formData.contentRequirements && (
            <div className="mt-3">
              <p className="font-semibold">Content Requirements:</p>
              <p className="text-sm text-zinc-700">{formData.contentRequirements}</p>
            </div>
          )}
        </div>
      )}

      {/* Introduction */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">Introduction</h2>
        <p className="text-sm text-zinc-700 leading-relaxed mb-3">
          Dear {contactName},
        </p>
        <p className="text-sm text-zinc-700 leading-relaxed">
          {getIntroText(template.id, orgName, formData)}
        </p>
      </div>

      {/* Why Partner */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">Why This Partnership Makes Sense</h2>
        <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
          {getWhyPartnerPoints(template.id).map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* What HWH Seeks */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">What Hoop With Her Is Seeking</h2>
        <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
          {getSeekingPoints(template.id, formData).map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* What HWH Brings */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">What Hoop With Her Brings</h2>
        <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
          {getBringsPoints(template.id).map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Partnership Tiers Table */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">Suggested Partnership Structure</h2>
        <table className="tier-table">
          <thead>
            <tr>
              <th style={{ width: "25%" }}>Tier</th>
              <th style={{ width: "35%" }}>Partner Commitment</th>
              <th style={{ width: "40%" }}>HWH Deliverables</th>
            </tr>
          </thead>
          <tbody>
            {formData.tiers.map((tier, i) => (
              <tr key={i}>
                <td className="font-semibold">{tier.tier_name}</td>
                <td>{tier.commitment}</td>
                <td>{tier.deliverables}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Next Steps */}
      <div className="mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">Next Steps</h2>
        <p className="text-sm text-zinc-700 leading-relaxed">
          We would welcome the opportunity to discuss this partnership and customize the structure for both organizations. 
          Contact us at <strong>{formData.yourPhone || "[Your Phone Number]"}</strong> or{" "}
          <strong>{formData.yourEmail || "[Your Email Address]"}</strong> to schedule a follow-up conversation.
        </p>
      </div>

      {/* Signature Section */}
      <div className="border-t-2 border-zinc-200 pt-6 mt-8">
        <h2 className="font-heading text-lg font-bold text-[#1E3A8A] mb-3">Acceptance of Interest</h2>
        <p className="text-sm text-zinc-700 mb-6">
          {orgName} expresses interest in exploring this {isNIL ? "NIL " : ""}partnership with Hoop With Her. 
          Final terms will be confirmed in a formal agreement{isNIL ? ", NIL contract," : ""} or MOU before activation.
        </p>
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div>
            <p className="text-sm font-semibold mb-2">Authorized Signature:</p>
            <div className="border-b border-zinc-400 h-8"></div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Date:</p>
            <div className="border-b border-zinc-400 h-8"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t border-zinc-200 text-center">
        <p className="text-sm font-semibold text-[#1E3A8A]">{formData.preparedBy}</p>
        <p className="text-xs text-zinc-500">Founder & Chair, Hoop With Her</p>
        <p className="text-xs text-zinc-500">Fayetteville, NC | HoopWithHER.com</p>
        <p className="text-xs text-zinc-500 mt-1">
          Phone: {formData.yourPhone || "[Your Phone Number]"} | Email: {formData.yourEmail || "[Your Email Address]"}
        </p>
      </div>
    </div>
  );
}

// Helper functions for template content
function getIntroText(templateId, orgName, formData) {
  const intros = {
    "facility-access": `My name is Lamont Revell Sr., and I am the Founder and Chair of Hoop With Her, a girls basketball organization serving Fayetteville and the surrounding region through leagues, camps, clinics, tournaments, and community-based development programs. We are seeking a partnership with ${orgName} to access your gymnasium and basketball courts for scheduled programming that serves girls and families throughout the year. We believe this partnership can align community mission, facility utilization, and long-term visibility for your organization.`,
    "presenting-sponsor": `Hoop With Her is building a platform that gives girls basketball players in our region the exposure, structure, and community support they deserve. We would like to invite ${orgName} to become a presenting sponsor for ${formData.eventProgramName || "[event/program name]"}, giving your brand premium visibility in front of athletes, parents, coaches, and supporters who are deeply engaged with youth sports and community impact.`,
    "community-business": `I am reaching out on behalf of Hoop With Her to explore a community partnership with ${orgName}. Our platform serves girls basketball players and their families through leagues, camps, clinics, and special events that bring together a highly engaged local audience. We believe your business is a strong fit for a partnership that combines community impact, family visibility, and direct support for girls who are working hard both on and off the court.`,
    "media-content": `Hoop With Her is building a media-forward platform for girls basketball that goes beyond simply hosting games. We evaluate, cover, highlight, and celebrate athletes in a way that creates real visibility for players and real engagement for families. We would love to explore a media partnership with ${orgName} to help produce, distribute, and elevate that coverage through ${formData.mediaType} collaboration.`,
    "apparel-equipment": `Hoop With Her is more than a league or event brand. We are building an ecosystem around girls basketball that includes visibility, development, confidence, and culture. We would love to explore a partnership with ${orgName} that helps us better serve athletes through apparel, equipment, player development resources, or recovery and wellness support.`,
    "nil-partnership": `Hoop With Her is pioneering NIL (Name, Image, and Likeness) opportunities for girls basketball athletes in our region. We are reaching out to ${orgName} to explore a partnership that connects your brand with authentic, talented young athletes who resonate with families and communities. Our athletes represent the next generation of leaders, and partnering with HWH athletes offers a unique opportunity to align your brand with youth empowerment, athletic excellence, and genuine community connection.`,
  };
  return intros[templateId] || "";
}

function getWhyPartnerPoints(templateId) {
  const points = {
    "facility-access": [
      "Shared mission around youth development, physical wellness, leadership, and community enrichment.",
      "Reliable family foot traffic generated by leagues, clinics, camps, and showcase events.",
      "Positive visibility as a facility that actively supports girls sports and access to opportunity.",
      "Ability to formalize a season-long relationship instead of handling one-off or last-minute rentals.",
    ],
    "presenting-sponsor": [
      "Strong alignment with youth empowerment, leadership, community visibility, and gender equity in sports.",
      "Brand exposure before, during, and after the event through digital content, signage, and announcements.",
      "Association with a positive, high-energy platform that families view as credible and community-centered.",
      "Opportunity for sponsor activation on-site through booths, giveaways, speaking moments, or branded experiences.",
    ],
    "community-business": [
      "Local businesses gain credibility when they visibly support youth development and girls sports.",
      "Hoop With Her families are active, connected, and likely to remember businesses that invest back into the community.",
      "Smaller partnerships can still create strong goodwill and consistent brand recognition when structured well.",
      "Scholarship support, player awards, and family-facing activations create stories people want to share.",
    ],
    "media-content": [
      "Girls basketball is underserved in local sports media, creating room for meaningful and differentiated coverage.",
      "Hoop With Her already has an engaged audience that values player spotlights, event recaps, and highlight-driven storytelling.",
      "A content partnership can create repeatable assets before, during, and after events instead of a single exposure moment.",
      "Partners benefit from access to compelling stories, emotional community moments, and highly shareable youth sports content.",
    ],
    "apparel-equipment": [
      "Your products or services can be seen in action within a credible youth basketball environment.",
      "Families value partners that tangibly improve athlete experience, preparation, and presentation.",
      "This type of partnership can create both transactional and brand-building upside through merchandise, clinics, activations, or featured products.",
      "A development-focused partner reinforces that Hoop With Her is serious about athlete growth, not just event operations.",
    ],
    "nil-partnership": [
      "NIL partnerships with youth athletes create authentic brand connections that resonate with Gen Z and family audiences.",
      "HWH athletes are community role models with engaged social followings and positive public images.",
      "Early investment in emerging athletes builds long-term brand loyalty and ambassadorship potential.",
      "Supporting girls basketball NIL opportunities positions your brand on the right side of the growing women's sports movement.",
      "HWH provides compliance guidance and professional management of athlete partnerships.",
    ],
  };
  return points[templateId] || [];
}

function getSeekingPoints(templateId, formData) {
  const points = {
    "facility-access": [
      `Scheduled access to ${formData.numberOfCourts} courts on ${formData.daysAndTimes} during ${formData.seasonOrDateRange}.`,
      "Use of the full gymnasium for designated showcase dates, tournaments, or special events.",
      "A formal Facility Use Agreement or MOU outlining rules, safety expectations, and scheduling procedures.",
    ],
    "presenting-sponsor": [
      `Cash sponsorship of ${formData.sponsorshipAmount || "[$ amount]"} for ${formData.eventProgramName || "[event/program name]"}.`,
      "Potential in-kind support such as promotional materials, scholarships, giveaways, hospitality, or production support.",
      `Permission to list your organization as a presenting or official partner across marketing assets.`,
    ],
    "community-business": [
      "A scholarship contribution, player support fund, family giveaway, or modest sponsorship investment.",
      "Optional product, gift card, or service donation that can be tied to a player recognition moment or event activation.",
      "Permission to feature your organization as a community partner across selected HWH content and event materials.",
    ],
    "media-content": [
      `Coverage support such as livestream production, game photography, recap edits, interviews, social clips, or branded media assets.`,
      "A co-branded distribution plan for event-day content and post-event storytelling.",
      "Clear agreement on content ownership, usage rights, branding, and turnaround expectations.",
    ],
    "apparel-equipment": [
      "Product support, discounted pricing, co-branded merchandise opportunities, training resources, or sponsored sessions.",
      "Potential support for uniforms, event shirts, warmups, basketballs, recovery tools, or player development programming.",
      "A clear agreement defining inventory, usage, promotion expectations, and exclusivity if applicable.",
    ],
    "nil-partnership": [
      `${formData.compensationType} compensation structure for athlete partnership.`,
      `${formData.dealDuration} partnership duration with ${formData.exclusivityType.toLowerCase()} terms.`,
      formData.contentRequirements ? `Content deliverables: ${formData.contentRequirements}` : "Agreed-upon content creation and posting schedule.",
      "Permission for athletes to use brand products/services and represent the brand at HWH events.",
      "Clear agreement on usage rights, approval processes, and performance expectations.",
    ],
  };
  return points[templateId] || [];
}

function getBringsPoints(templateId) {
  const points = {
    "facility-access": [
      "Named partner recognition in event flyers, banners, social media posts, website mentions, and printed programs.",
      "Professional scheduling, advance communication, and compliance with facility rules and safety expectations.",
      "Proof of liability insurance and a collaborative working relationship throughout the year.",
      "Consistent programming that helps activate your space with an engaged family audience.",
    ],
    "presenting-sponsor": [
      "Title or presenting sponsor naming rights where appropriate.",
      "Logo placement on flyers, tickets, website pages, social graphics, video assets, and event signage.",
      "Public acknowledgment through announcements, captions, sponsor thank-you content, and post-event recap materials.",
      "Access to a family-centered audience and a positive platform for brand storytelling.",
    ],
    "community-business": [
      "Community partner recognition on relevant flyers, event signage, social content, and thank-you posts.",
      "Story-driven visibility tied to scholarships, awards, or family support initiatives.",
      "Positive association with empowerment, discipline, and local girls basketball development.",
      "An easy-entry sponsorship path that can grow into a larger seasonal relationship over time.",
    ],
    "media-content": [
      "Official media partner designation where appropriate.",
      "Branding on event graphics, lower thirds, recap posts, sponsor thank-you content, and selected website placements.",
      "Access to storylines, players, coaches, and events that produce recurring, high-interest content.",
      "A chance to help shape the visual identity of girls basketball coverage in the region.",
    ],
    "apparel-equipment": [
      "Official partner recognition in relevant campaigns, event signage, social content, and merchandising materials.",
      "Product or service integration into athlete-facing experiences such as camps, showcases, and training sessions.",
      "Opportunity to test, feature, or sell products within a community that already trusts the Hoop With Her platform.",
      "Storytelling around how your brand helps young athletes feel prepared, confident, and seen.",
    ],
    "nil-partnership": [
      "Access to HWH athletes with authentic community connections and engaged social followings.",
      "Professional athlete management, content coordination, and brand-safe partnership execution.",
      "Social media exposure across athlete accounts, HWH platforms, and event coverage.",
      "Photo and video content featuring athletes with your brand for multi-channel use.",
      "Event appearances, meet-and-greets, and on-site activation opportunities.",
      "Regular performance reporting and partnership optimization support.",
    ],
  };
  return points[templateId] || [];
}
