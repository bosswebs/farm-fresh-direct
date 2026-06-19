import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Send, Bell, Group, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/communication")({
  component: CommunicationCenterPage,
});

function CommunicationCenterPage() {
  const [channel, setChannel] = useState<"sms" | "email" | "push">("sms");
  const [audience, setAudience] = useState("all_farmers");
  const [messageText, setMessageText] = useState("");
  const [subject, setSubject] = useState("");

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText) {
      toast.error("Please enter a message body");
      return;
    }
    toast.success(`Campaign successfully queued for transmission via ${channel.toUpperCase()} to ${audience.replace("_", " ")}`);
    setMessageText("");
    setSubject("");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-display">Communication Center</h1>
        <p className="text-sm text-gray-500">Send bulk SMS bulletins, mobile push notifications, and email newsletters to farmers and buyers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Card */}
        <form onSubmit={handleSendCampaign} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Dispatch Campaign Builder
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Channel</span>
              <Select value={channel} onValueChange={(val: any) => setChannel(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS Text Message</SelectItem>
                  <SelectItem value="email">Email Campaign</SelectItem>
                  <SelectItem value="push">Mobile Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Target Audience</span>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_farmers">All Farmers ({">"}4,800)</SelectItem>
                  <SelectItem value="all_buyers">All Buyers ({">"}12,000)</SelectItem>
                  <SelectItem value="cooperatives">Cooperatives Only</SelectItem>
                  <SelectItem value="musanze_farmers">Musanze District Farmers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {channel === "email" && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Email Subject</span>
              <Input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Market Pricing Update for Potato Cooperatives"
              />
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Message Body</span>
            <Textarea
              required
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={
                channel === "sms"
                  ? "Hello! Potato prices are expected to rise. Post your stock today on Deacomart to find Kigali buyers. Standard SMS limits apply."
                  : "Write your newsletter contents here..."
              }
              className="text-sm"
            />
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Send className="w-4 h-4" /> Send Campaign Now
          </Button>
        </form>

        {/* Templates Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-gray-900">Preset Message Templates</h3>
          <p className="text-xs text-gray-500">Quick-start messages configured for prompt notifications and bulletins.</p>

          <div className="space-y-3">
            <div
              onClick={() => {
                setChannel("sms");
                setMessageText("Emergency Weather Alert: Heavy rain forecast in Musanze. Secure your post-harvest stores today. Contact RAB extension team if needed.");
              }}
              className="border border-gray-100 rounded-xl p-3 hover:border-emerald-200 cursor-pointer transition-colors bg-gray-50/50"
            >
              <div className="text-xs font-semibold text-gray-800 mb-0.5">Heavy Rain Weather Alert (SMS)</div>
              <div className="text-[10px] text-gray-400 line-clamp-2">"Emergency Weather Alert: Heavy rain forecast in Musanze. Secure your..."</div>
            </div>

            <div
              onClick={() => {
                setChannel("email");
                setSubject("Farmer Incentive Program Details");
                setMessageText("Hello Cooperative Leaders, We are pleased to announce the new seed subsidy options sponsored by USAID. Registration is now open on your dashboard.");
              }}
              className="border border-gray-100 rounded-xl p-3 hover:border-emerald-200 cursor-pointer transition-colors bg-gray-50/50"
            >
              <div className="text-xs font-semibold text-gray-800 mb-0.5">Seed Subsidy Launch (Email)</div>
              <div className="text-[10px] text-gray-400 line-clamp-2">"Hello Cooperative Leaders, We are pleased to announce the new seed..."</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
