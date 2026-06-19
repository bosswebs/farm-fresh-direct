import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings, Shield, CreditCard, Mail, Key, Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "payments" | "security">("general");

  // General Company Settings state
  const [companyName, setCompanyName] = useState("Deacomart Ltd");
  const [companyEmail, setCompanyEmail] = useState("info@deacomart.rw");
  const [companyPhone, setCompanyPhone] = useState("+250 780 165 257");

  // Payments Gateway Settings state
  const [momoActive, setMomoActive] = useState(true);
  const [airtelActive, setAirtelActive] = useState(true);
  const [bankActive, setBankActive] = useState(true);

  // RBAC Permission state (sample toggle)
  const [allowRefunds, setAllowRefunds] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("System configurations successfully saved!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">System Settings</h1>
          <p className="text-sm text-gray-500">Configure global platform options, payment credentials, and access policies</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Save className="w-4 h-4" /> Save Configurations
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px
            ${activeTab === "general"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px
            ${activeTab === "payments"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Payment Channels
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3.5 px-4 text-sm font-semibold transition-all border-b-2 -mb-px
            ${activeTab === "security"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
        >
          Access Controls (RBAC)
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-2xl">
        {activeTab === "general" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-2">
              <Settings className="w-4 h-4 text-emerald-600" /> Company Contact Profile
            </h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-gray-500 block uppercase">Legal Entity Name</span>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-gray-500 block uppercase">Primary Support Email</span>
                <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="mt-1" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-gray-500 block uppercase">WhatsApp Hotline</span>
                <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="mt-1" />
              </label>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" /> Mobile Money & Bank Gateways
            </h3>
            <p className="text-xs text-gray-500 mb-4">Toggle active customer payment methods at checkout.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm font-bold text-gray-900">MTN MoMo Pay</div>
                  <div className="text-xs text-gray-400">Merchant Code integrations</div>
                </div>
                <Switch checked={momoActive} onCheckedChange={setMomoActive} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm font-bold text-gray-900">Airtel Money</div>
                  <div className="text-xs text-gray-400">Conversational wallet API</div>
                </div>
                <Switch checked={airtelActive} onCheckedChange={setAirtelActive} />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm font-bold text-gray-900">Bank Transfer</div>
                  <div className="text-xs text-gray-400">Manual verification invoice uploading</div>
                </div>
                <Switch checked={bankActive} onCheckedChange={setBankActive} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Role Permissions
            </h3>
            <p className="text-xs text-gray-500 mb-4">Control what team roles are authorized to execute transaction refunds.</p>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-bold text-gray-900">Allow Finance Manager Refunds</div>
                <div className="text-xs text-gray-400">Perform direct credit card & MoMo transactions back to buyer</div>
              </div>
              <Switch checked={allowRefunds} onCheckedChange={setAllowRefunds} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
