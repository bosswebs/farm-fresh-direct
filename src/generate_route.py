import os

img_dir = "public/images"
images = [f for f in os.listdir(img_dir) if f.startswith("WhatsApp Image")]
images.sort()

images_js_array = "[\n" + ",\n".join([f'  "{img}"' for img in images]) + "\n]"

code = f"""import {{ createFileRoute }} from "@tanstack/react-router";

export const Route = createFileRoute("/admin/image-viewer")({{
  component: ImageViewer,
}});

const IMAGES = {images_js_array};

function ImageViewer() {{
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-display">Agribusiness Real Photos Directory</h1>
        <p className="text-sm text-gray-500">Please review the grid below and tell me which filenames map to beekeeper.png, farmer.png, tea-plantation.png, fresh-produce.png, hero.png, etc.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {{IMAGES.map((img) => (
          <div key={{img}} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center space-y-3">
            <img src={{`/images/${{img}}`}} alt={{img}} className="w-full h-48 object-cover rounded-xl border border-gray-100" />
            <div className="text-xs font-mono font-bold text-gray-700 bg-gray-50 p-2 rounded-lg break-all select-all select-none">
              {{img}}
            </div>
          </div>
        ))}}
      </div>
    </div>
  );
}}
"""

os.makedirs("src/routes/admin", exist_ok=True)
with open("src/routes/admin/image-viewer.tsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Generated route successfully.")
