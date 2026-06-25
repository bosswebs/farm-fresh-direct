import os

img_dir = "public/images"
image_extensions = {".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
images = [
    f
    for f in os.listdir(img_dir)
    if os.path.splitext(f)[1].lower() in image_extensions
]
images.sort()

html = """<!DOCTYPE html>
<html>
<head>
    <title>Image Viewer</title>
    <style>
        body { font-family: sans-serif; background: #f3f4f6; padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 12px; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: center; }
        img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; }
        .name { font-size: 11px; color: #4b5563; margin-top: 8px; word-break: break-all; }
    </style>
</head>
<body>
    <h1>Deacomart Image Gallery</h1>
    <div class="grid">
"""

for img in images:
    html += f"""
        <div class="card">
            <img src="/images/{img}" alt="{img}">
            <div class="name">{img}</div>
        </div>
    """

html += """
    </div>
</body>
</html>
"""

os.makedirs("public", exist_ok=True)
with open("public/image-viewer.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"Generated viewer with {len(images)} images.")
