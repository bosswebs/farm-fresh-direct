import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Search, Send, User, Clock, CheckCircle, RefreshCw, Plus, ToggleLeft, ToggleRight, Sparkles, MessageCircleCode } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { whatsappOrders, getStatusColor, formatRWF } from "../../lib/admin-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/whatsapp")({
  component: WhatsAppCommercePage,
});

function WhatsAppCommercePage() {
  const [orders, setOrders] = useState(whatsappOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [botActive, setBotActive] = useState(true);

  const filteredOrders = orders.filter((o) => {
    return (
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleConfirmOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "confirmed" as const } : o));
    toast.success(`WhatsApp order ${id} confirmed and forwarded to fulfillment`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-display">WhatsApp Commerce</h1>
          <p className="text-sm text-gray-500">Track and approve conversational agribusiness orders from +250 780 165 257</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-600">AI Bot Responder:</span>
          <button onClick={() => {
            setBotActive(!botActive);
            toast.info(`AI auto-responder ${!botActive ? "enabled" : "disabled"}`);
          }} className="focus:outline-none">
            {botActive ? (
              <ToggleRight className="w-9 h-9 text-emerald-600 cursor-pointer" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-gray-300 cursor-pointer" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Orders Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, phone, or product..."
              className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm h-auto"
            />
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-950">{order.customer}</h3>
                      <p className="text-xs text-gray-400">{order.phone} · {order.date}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-2 border border-gray-100 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Ref:</span>
                    <span className="font-semibold text-gray-700">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Requested Items:</span>
                    <span className="font-semibold text-gray-800">{order.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount Estimate:</span>
                    <span className="font-bold text-emerald-700">{formatRWF(order.amount)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success(`Chat opened with ${order.customer}`)}>
                    Open Chat
                  </Button>
                  {order.status === "pending" && (
                    <Button onClick={() => handleConfirmOrder(order.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white size-sm text-xs py-1">
                      Approve & Process
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Broadcast Templates */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Broadcast Broadcasts
            </h3>
            <p className="text-xs text-gray-500">Send bulk announcements to farmers and buyers regarding markets and weather updates.</p>

            <div className="space-y-3">
              <div className="border border-gray-100 rounded-xl p-3 hover:border-emerald-200 cursor-pointer transition-colors bg-gray-50/50">
                <div className="text-xs font-semibold text-gray-800 mb-1">Market Pricing Update</div>
                <div className="text-[10px] text-gray-400 line-clamp-2">"Hello [Farmer]! Today's wholesale price for potatoes is 400 RWF/kg in Musanze..."</div>
              </div>
              <div className="border border-gray-100 rounded-xl p-3 hover:border-emerald-200 cursor-pointer transition-colors bg-gray-50/50">
                <div className="text-xs font-semibold text-gray-800 mb-1">Upcoming Crop Academy Training</div>
                <div className="text-[10px] text-gray-400 line-clamp-2">"Join our Modern Agribusiness class this Friday at 10 AM. Free certificates..."</div>
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Send className="w-4 h-4" /> Create Broadcast Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
