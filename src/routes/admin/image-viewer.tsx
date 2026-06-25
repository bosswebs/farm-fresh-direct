import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/image-viewer")({
  component: ImageViewer,
});

const IMAGES = [
  "3green-tea.jpeg",
  "AMBIANCE JUICE.jpeg",
  "AMBIANCE JUICES.jpeg",
  "AVOCADO AIL.jpeg",
  "GRANOLA BAR.jpeg",
  "HIBISCUS TEA.jpeg",
  "JAMA FRUITS JUICE.jpeg",
  "LEMONGRASS GINGER TEA BAG.jpeg",
  "MINI-WATER.jpeg",
  "OGI BLACK TEA.jpeg",
  "PANDA-MINI WATER.jpeg",
  "SLIDER6.jpeg",
  "TANGAWIZI TEA.jpeg",
  "Tea1.jpeg",
  "ZIMA COOKIES.jpeg",
  "ZIMA SUN FLOWEW.jpeg",
  "black tea (2).jpeg",
  "black tea bag.jpeg",
  "black tea.jpeg",
  "black-tea new.jpeg",
  "black-tea-.jpeg",
  "black-tea.jpeg",
  "cashew nut.jpeg",
  "chia seeds.jpeg",
  "coffee beans.jpeg",
  "detox.jpeg",
  "ginger tea.jpeg",
  "green tea.jpeg",
  "green-tea.jpeg",
  "hibiscuss-tea.jpeg",
  "layed abiscuss tea.jpeg",
  "logo.jpg",
  "mexed tea.jpeg",
  "panda.jpeg",
  "pumpkin seed oil.jpeg",
  "pumpkin seeds.jpeg",
  "rwiza tea.jpeg",
  "stand-habiscuss.jpeg",
  "whatsapp.svg"
];

function ImageViewer() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-display">Agribusiness Real Photos Directory</h1>
        <p className="text-sm text-gray-500">Current image files available from the public images directory.</p>
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
