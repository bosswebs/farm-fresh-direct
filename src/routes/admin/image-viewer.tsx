import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/image-viewer")({
  component: ImageViewer,
});

const IMAGES = [
  "WhatsApp Image 2026-06-19 at 9.06.35 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.39 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.40 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.41 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.42 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.42 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.43 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.46 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.48 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.48 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.49 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.49 AM (2).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.49 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.50 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.51 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.54 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.55 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.55 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.56 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.56 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.57 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.57 AM (2).jpeg",
  "WhatsApp Image 2026-06-19 at 9.06.57 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.01 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.02 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.08 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.09 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.09 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.10 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.10 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.11 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.12 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.12 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.13 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.13 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.14 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.14 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.15 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.17 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.19 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.19 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.20 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.20 AM (2).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.20 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.21 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.21 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.22 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.22 AM (2).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.22 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.23 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.23 AM (2).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.23 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.24 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.25 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.25 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.26 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.26 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.27 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.28 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.32 AM (1).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.32 AM (2).jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.32 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.33 AM.jpeg",
  "WhatsApp Image 2026-06-19 at 9.07.34 AM.jpeg"
];

function ImageViewer() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-display">Agribusiness Real Photos Directory</h1>
        <p className="text-sm text-gray-500">Please review the grid below and tell me which filenames map to beekeeper.png, farmer.png, tea-plantation.png, fresh-produce.png, hero.png, etc.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {IMAGES.map((img) => (
          <div key={img} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center space-y-3">
            <img src={`/images/${img}`} alt={img} className="w-full h-48 object-cover rounded-xl border border-gray-100" />
            <div className="text-xs font-mono font-bold text-gray-700 bg-gray-50 p-2 rounded-lg break-all select-all select-none">
              {img}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
