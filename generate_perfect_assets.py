import os
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

base_dir = r"c:\Users\sahil\Desktop\SHAHIM\cursor all projects\ZipZap"
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def get_artwork_svg_content():
    return """
    <!-- GRID -->
    <g fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.32">
      <line x1="231" y1="45" x2="231" y2="1490"/>
      <line x1="363" y1="45" x2="363" y2="1490"/>
      <line x1="494" y1="45" x2="494" y2="1490"/>
      <line x1="624" y1="45" x2="624" y2="1490"/>
      <line x1="756" y1="45" x2="756" y2="1490"/>
      <line x1="886" y1="45" x2="886" y2="1490"/>
      <line x1="1016" y1="45" x2="1016" y2="1490"/>

      <line x1="55" y1="214" x2="1480" y2="214"/>
      <line x1="55" y1="351" x2="1480" y2="351"/>
      <line x1="55" y1="489" x2="1480" y2="489"/>
      <line x1="55" y1="624" x2="1480" y2="624"/>
      <line x1="55" y1="757" x2="1480" y2="757"/>
      <line x1="55" y1="894" x2="1480" y2="894"/>
      <line x1="55" y1="1032" x2="1480" y2="1032"/>
    </g>

    <!-- CONTINUOUS ZIG-ZAG -->
    <polyline points="430,390 660,475 520,620 790,635 650,800 870,885" fill="none" stroke="#ffffff" stroke-width="92" stroke-linejoin="miter" stroke-linecap="butt" transform="translate(166.421 100.209) translate(623.5 625) rotate(-3) scale(1.637 1.637) translate(-623.5 -625)" opacity="100" style="filter: drop-shadow(rgb(107, 107, 107) 0px 0px 10px) drop-shadow(rgb(107, 107, 107) 0px 0px 4px) brightness(125%) !important;"/>

    <!-- TOP CIRCLE -->
    <circle cx="352" cy="350" r="108" fill="#ffffff" transform="translate(166.421 100.209) translate(623.5 625) rotate(-3) scale(1.637 1.637) translate(-623.5 -625)" opacity="100" style="filter: drop-shadow(rgb(107, 107, 107) 0px 0px 10px) drop-shadow(rgb(107, 107, 107) 0px 0px 4px) brightness(125%) !important;"/>

    <!-- BOTTOM CIRCLE -->
    <circle cx="895" cy="900" r="108" fill="#ffffff" transform="translate(166.421 100.209) translate(623.5 625) rotate(-3) scale(1.637 1.637) translate(-623.5 -625)" opacity="100" style="filter: drop-shadow(rgb(107, 107, 107) 0px 0px 10px) drop-shadow(rgb(107, 107, 107) 0px 0px 4px) brightness(125%) !important;"/>
    """

def get_master_icon_svg():
    artwork = get_artwork_svg_content()
    # Using rx="340" inside 1488x1488 squircle with scale(0.70)
    # The circles are pulled inward by 30%, giving 350+ px safety margin from the boundary
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1536 1536">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1536" y2="1536" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ff7600"/>
      <stop offset="45%" stop-color="#ff4809"/>
      <stop offset="100%" stop-color="#f10b21"/>
    </linearGradient>
    <clipPath id="squircleClip">
      <rect x="24" y="24" width="1488" height="1488" rx="340"/>
    </clipPath>
  </defs>

  <rect x="24" y="24" width="1488" height="1488" rx="340" fill="url(#bgGrad)"/>

  <g clip-path="url(#squircleClip)">
    <g transform="translate(768 768) scale(0.70) translate(-768 -768)">
      {artwork}
    </g>
  </g>
</svg>"""

def get_adaptive_foreground_svg():
    artwork = get_artwork_svg_content()
    # In Android adaptive icons:
    # Canvas = 108dp. Safe zone = inner 66dp diameter circle (approx 61% of canvas width).
    # Scaling to 0.54 centered at (768, 768) ensures the entire zigzag artwork
    # and both circles reside completely within the inner 60% safe zone.
    # No matter how Xiaomi/HyperOS or Samsung or Pixel masks the icon, the circles will never be touched!
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1536 1536">
  <g transform="translate(768 768) scale(0.54) translate(-768 -768)">
    {artwork}
  </g>
</svg>"""

def get_round_icon_svg():
    artwork = get_artwork_svg_content()
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1536 1536">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1536" y2="1536" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ff7600"/>
      <stop offset="45%" stop-color="#ff4809"/>
      <stop offset="100%" stop-color="#f10b21"/>
    </linearGradient>
    <clipPath id="circleClip">
      <circle cx="768" cy="768" r="740"/>
    </clipPath>
  </defs>

  <circle cx="768" cy="768" r="740" fill="url(#bgGrad)"/>

  <g clip-path="url(#circleClip)">
    <g transform="translate(768 768) scale(0.66) translate(-768 -768)">
      {artwork}
    </g>
  </g>
</svg>"""

def get_splash_icon_svg():
    # Android 12+ SplashScreen Animated Icon
    # In Android 12+, the icon is masked by a 160dp diameter circle in a 288dp viewport.
    # To prevent Android from clipping the corners of the squircle, the squircle is sized
    # to 660x660 with rx=180 inside the 1536x1536 canvas (diagonal fits comfortably inside 853px circle).
    # NO shadow filter is used, ensuring 100% crisp rounded corners and zero dark corner smudges.
    artwork = get_artwork_svg_content()
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 1536 1536">
  <defs>
    <linearGradient id="splashBgGrad" x1="438" y1="438" x2="1098" y2="1098" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ff7600"/>
      <stop offset="45%" stop-color="#ff4809"/>
      <stop offset="100%" stop-color="#f10b21"/>
    </linearGradient>
    <clipPath id="splashSquircleClip">
      <rect x="438" y="438" width="660" height="660" rx="180"/>
    </clipPath>
  </defs>

  <!-- Clean rounded squircle with NO dark shadow -->
  <rect x="438" y="438" width="660" height="660" rx="180" fill="url(#splashBgGrad)"/>

  <g clip-path="url(#splashSquircleClip)">
    <!-- Artwork centered at 768, 768 and scaled to 0.44 -->
    <g transform="translate(768 768) scale(0.44) translate(-768 -768)">
      {artwork}
    </g>
  </g>
</svg>"""

def render_svg_to_png(svg_str, width, height, output_path):
    html = f"""<!DOCTYPE html><html>
    <head><style>body,html{{margin:0;padding:0;background:transparent;overflow:hidden;width:{width}px;height:{height}px;}}</style></head>
    <body>{svg_str}</body>
    </html>"""
    tmp_path = os.path.join(base_dir, f"_tmp_{os.path.basename(output_path)}.html")
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(html)
    
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        f"--screenshot={output_path}",
        f"--window-size={width},{height}",
        "--default-background-color=00000000",
        f"file:///{tmp_path}"
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    if os.path.exists(tmp_path):
        os.remove(tmp_path)

def create_splash_screen(width, height, master_icon_img, output_path):
    # Pure white background as requested
    splash = Image.new("RGB", (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(splash)
    
    # Determine icon size proportional to screen
    min_dim = min(width, height)
    icon_size = int(min_dim * 0.38) # ~38% of screen width/height
    if icon_size < 120:
        icon_size = 120
    
    # Resize master icon (user's rounded-corner squircle icon)
    icon_resized = master_icon_img.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    
    # Paste icon cleanly in center without dark corner shadows
    center_x = width // 2
    center_y = int(height * 0.44) if height > width else height // 2
    
    icon_x = center_x - icon_size // 2
    icon_y = center_y - icon_size // 2
    splash.paste(icon_resized, (icon_x, icon_y), icon_resized)
    
    # Render typography "ZipZag" on white background
    try:
        font_size = max(int(icon_size * 0.28), 24)
        sub_size = max(int(font_size * 0.42), 12)
        font = ImageFont.truetype("arial.ttf", font_size)
        font_sub = ImageFont.truetype("arial.ttf", sub_size)
    except:
        font = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    text = "ZipZag"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    text_y = icon_y + icon_size + int(icon_size * 0.16)
    
    # Title in deep slate #0f172a
    draw.text((center_x - tw // 2, text_y), text, font=font, fill=(15, 23, 42, 255))
    
    subtext = "GRID LINE PUZZLE"
    s_bbox = draw.textbbox((0, 0), subtext, font=font_sub)
    stw = s_bbox[2] - s_bbox[0]
    sub_y = text_y + th + int(font_size * 0.25)
    # Subtitle in theme orange
    draw.text((center_x - stw // 2, sub_y), subtext, font=font_sub, fill=(255, 72, 9, 230))
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    splash.save(output_path, "PNG", optimize=True)
    print(f"Generated splash: {output_path} ({width}x{height})")

def main():
    print("Generating assets...")
    
    # 1. Write updated public/favicon.svg
    master_svg = get_master_icon_svg()
    fav_svg_path = os.path.join(base_dir, "public", "favicon.svg")
    with open(fav_svg_path, "w", encoding="utf-8") as f:
        f.write(master_svg)
    print("Updated public/favicon.svg")
    
    # 2. Render 1024x1024 master icon PNG
    master_png_path = os.path.join(base_dir, "_tmp_master.png")
    render_svg_to_png(master_svg, 1024, 1024, master_png_path)
    master_img = Image.open(master_png_path).convert("RGBA")
    
    # 3. Render 1024x1024 adaptive foreground PNG
    fg_svg = get_adaptive_foreground_svg()
    fg_png_path = os.path.join(base_dir, "_tmp_fg.png")
    render_svg_to_png(fg_svg, 1024, 1024, fg_png_path)
    fg_img = Image.open(fg_png_path).convert("RGBA")
    
    # 4. Render 1024x1024 round icon PNG
    round_svg = get_round_icon_svg()
    round_png_path = os.path.join(base_dir, "_tmp_round.png")
    render_svg_to_png(round_svg, 1024, 1024, round_png_path)
    round_img = Image.open(round_png_path).convert("RGBA")
    
    # 5. Render 512x512 splash icon PNG for Android 12+
    splash_icon_svg = get_splash_icon_svg()
    splash_icon_path = os.path.join(base_dir, "android", "app", "src", "main", "res", "drawable", "splash_icon.png")
    os.makedirs(os.path.dirname(splash_icon_path), exist_ok=True)
    render_svg_to_png(splash_icon_svg, 512, 512, splash_icon_path)
    print(f"Generated Android 12+ splash_icon.png: {splash_icon_path}")
    
    # 6. Save web icons
    pub_dir = os.path.join(base_dir, "public")
    master_img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(pub_dir, "icon-512.png"), "PNG")
    master_img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(pub_dir, "icon-192.png"), "PNG")
    master_img.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(pub_dir, "favicon.png"), "PNG")
    master_img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(pub_dir, "logo.png"), "PNG")
    print("Saved public web icons (favicon.png, icon-192.png, icon-512.png, logo.png)")
    
    # 7. Save master icon to Android drawable
    drawable_dir = os.path.join(base_dir, "android", "app", "src", "main", "res", "drawable")
    master_img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(drawable_dir, "ic_launcher_master.png"), "PNG")
    
    # 8. Save Android mipmaps
    densities = {
        "mipmap-mdpi": (48, 108),
        "mipmap-hdpi": (72, 162),
        "mipmap-xhdpi": (96, 216),
        "mipmap-xxhdpi": (144, 324),
        "mipmap-xxxhdpi": (192, 432)
    }
    
    res_dir = os.path.join(base_dir, "android", "app", "src", "main", "res")
    for folder, (icon_sz, fg_sz) in densities.items():
        target_dir = os.path.join(res_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        # ic_launcher.png (legacy squircle)
        master_img.resize((icon_sz, icon_sz), Image.Resampling.LANCZOS).save(os.path.join(target_dir, "ic_launcher.png"), "PNG")
        # ic_launcher_round.png (legacy circle)
        round_img.resize((icon_sz, icon_sz), Image.Resampling.LANCZOS).save(os.path.join(target_dir, "ic_launcher_round.png"), "PNG")
        # ic_launcher_foreground.png (Android adaptive foreground)
        fg_img.resize((fg_sz, fg_sz), Image.Resampling.LANCZOS).save(os.path.join(target_dir, "ic_launcher_foreground.png"), "PNG")
        print(f"Updated {folder}: icon {icon_sz}x{icon_sz}, fg {fg_sz}x{fg_sz}")
        
    # 9. Generate splash screens across all folders
    splash_targets = [
        # default
        (os.path.join(drawable_dir, "splash.png"), 1080, 1920),
        (os.path.join(pub_dir, "splash.png"), 1080, 1920),
        # port
        (os.path.join(res_dir, "drawable-port-mdpi", "splash.png"), 320, 480),
        (os.path.join(res_dir, "drawable-port-hdpi", "splash.png"), 480, 800),
        (os.path.join(res_dir, "drawable-port-xhdpi", "splash.png"), 720, 1280),
        (os.path.join(res_dir, "drawable-port-xxhdpi", "splash.png"), 1080, 1920),
        (os.path.join(res_dir, "drawable-port-xxxhdpi", "splash.png"), 1440, 2560),
        # land
        (os.path.join(res_dir, "drawable-land-mdpi", "splash.png"), 480, 320),
        (os.path.join(res_dir, "drawable-land-hdpi", "splash.png"), 800, 480),
        (os.path.join(res_dir, "drawable-land-xhdpi", "splash.png"), 1280, 720),
        (os.path.join(res_dir, "drawable-land-xxhdpi", "splash.png"), 1920, 1080),
        (os.path.join(res_dir, "drawable-land-xxxhdpi", "splash.png"), 2560, 1440),
    ]
    
    for path, w, h in splash_targets:
        create_splash_screen(w, h, master_img, path)
        
    # Clean up temp files
    for p in [master_png_path, fg_png_path, round_png_path]:
        if os.path.exists(p):
            os.remove(p)
            
    print("ALL ASSETS GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
