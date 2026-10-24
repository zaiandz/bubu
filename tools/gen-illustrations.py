# -*- coding: utf-8 -*-
"""
为 24 个教程生成线条型设备插图（SVG），替代原先的小尺寸图标。

设计规范：
  - 64×64 网格，1.8px 圆角描边，无填充（纯线条），随 HTML 中的 CSS 变量着色
  - 每篇教程按实际机型与操作步骤绘制：云台（含续航手柄/全能配件/补光灯）、
    运动相机（街拍手柄/挂脖支架/Vlog 手柄）、全景相机（自拍杆/三脚架）、
    微单（镜头焦段差异）、卡片机（自拍杆）、CCD（弹出闪光）、三脚架（云台/配件）、
    数据找回（SD 卡/TF 卡）
  - 输出：images/illustrations/<教程 id>.svg

运行：python tools/gen-illustrations.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "illustrations")

# ---------------------------------------------------------------- 组件
def gimbal_cam(x=0, y=0, s=1):
    """Pocket 系列机身：屏幕 + 云台镜头。"""
    return (f'<use href="#gimbal" x="{x}" y="{y}" transform="scale({s})"/>')

# 各机型底座/配件
PARTS = {
    # ---------- 手持云台 ----------
    "gimbal-phone": """
    <rect x="22" y="5" width="20" height="14" rx="3"/>
    <circle cx="32" cy="12" r="3.4"/>
    <path d="M32 19v4.4"/>
    <path d="M25 27.6a7 7 0 0 0 14 0"/>
    <rect x="27" y="27.4" width="10" height="15.4" rx="3"/>
    <path d="M30.4 34.6h3.2"/>""",
    "gimbal-one": """
    <rect x="22" y="3" width="20" height="13.6" rx="3"/>
    <circle cx="32" cy="9.6" r="3.4"/>
    <path d="M32 16.6v3.6"/>
    <path d="M25 24.4a7 7 0 0 0 14 0"/>
    <rect x="27" y="24.2" width="10" height="10" rx="2.8"/>
    <rect x="27" y="34" width="10" height="14" rx="3"/>
    <path d="M30.4 40.4h3.2"/>
    <path d="M30 48v2.4h4V48"/>""",
    "gimbal-two": """
    <rect x="16" y="4" width="19" height="13" rx="3"/>
    <circle cx="25.5" cy="10.5" r="3.2"/>
    <path d="M25.5 17v3.4"/>
    <path d="M19 24.4a6.6 6.6 0 0 0 13.2 0"/>
    <rect x="20.5" y="24.2" width="10" height="9" rx="2.6"/>
    <path d="M21 35v2.6M30 35v2.6M18.6 37.6h13.8"/>
    <circle cx="46" cy="10" r="5"/><circle cx="52.4" cy="16" r="4.2"/>
    <path d="M42.6 12.6l5.4 2.2M49 14.4l1.8-2.2"/>
    <rect x="38" y="30" width="16" height="12" rx="2.4"/>
    <path d="M41 34h10M41 38h10"/>""",
    "gimbal-pocket4pro-standard": """
    <rect x="26" y="3" width="20" height="14" rx="3"/>
    <circle cx="36" cy="10" r="3.4"/>
    <path d="M36 17v3.6"/>
    <path d="M29 24.4a7 7 0 0 0 14 0"/>
    <rect x="31" y="24.2" width="10" height="15.4" rx="3"/>
    <path d="M34.4 31.4h3.2"/>
    <rect x="27" y="2.2" width="18" height="2.6" rx="1.3"/>
    <path d="M8 22h12v14H8z"/><path d="M11 36l-2 4M17 36l2 4"/><path d="M11 26h6"/>""",
    "gimbal-pocket4pro-combo": """
    <rect x="18" y="3" width="18" height="13" rx="3"/>
    <circle cx="27" cy="9.5" r="3.2"/>
    <path d="M27 16v3.4"/>
    <path d="M20.6 23.4a6.4 6.4 0 0 0 12.8 0"/>
    <rect x="22" y="23.2" width="10" height="9" rx="2.6"/>
    <path d="M25 31h4"/>
    <rect x="41" y="4" width="14" height="10" rx="2.2"/>
    <path d="M44 7.4h8M44 11h8"/>
    <circle cx="44" cy="22" r="3.4"/><circle cx="53" cy="22" r="3.4"/>
    <path d="M47.4 22h2.2"/>
    <path d="M14 40l10 10M10 44l10 10M14 50h-6"/>""",
    # ---------- 运动相机 ----------
    "action-standard": """
    <path d="M24.5 10h3l1.6 2.6h3l1.6-2.6h3"/>
    <rect x="18.5" y="12.6" width="27" height="21" rx="4.4"/>
    <circle cx="32" cy="23" r="6.2"/>
    <circle cx="32" cy="23" r="2.4"/>
    <path d="M39 17.6h3.2"/>""",
    "action-street": """
    <path d="M18.5 13.6h27v13.2h-27z"/>
    <circle cx="31" cy="20.2" r="4.6"/>
    <path d="M36 20.2l8.5 8.6"/>
    <rect x="41.5" y="28.8" width="7.4" height="9.4" rx="3"/>
    <path d="M18.5 13.6v-2.2M45.5 13.6v-2.2"/>
    <circle cx="23" cy="31" r="2"/><path d="M25 31h10"/>""",
    "action-neck": """
    <path d="M20 14h24v9.4H20z"/>
    <circle cx="32" cy="18.7" r="3.4"/>
    <path d="M20 15.4c-4 3.4-5.6 9.4-3.4 15.6M44 15.4c4 3.4 5.6 9.4 3.4 15.6"/>
    <path d="M16.6 18.4l3.4 2.2M47.4 18.4l-3.4 2.2"/>
    <path d="M26 30h12"/>""",
    "action-vlog": """
    <path d="M20 9h24v12H20z"/>
    <circle cx="32" cy="15" r="4"/>
    <path d="M32 21v4"/>
    <path d="M26.6 26.6h10.8l1.4 9.4H25.2z"/>
    <path d="M20 9v-2.4" />
    <path d="M14 40.5h36"/>""",
    # ---------- 全景相机 ----------
    "insta360-x6-standard": """
    <rect x="17.5" y="13" width="29" height="17.4" rx="5.4"/>
    <circle cx="26" cy="21.7" r="5.2"/><circle cx="38" cy="21.7" r="5.2"/>
    <circle cx="26" cy="21.7" r="1.8"/><circle cx="38" cy="21.7" r="1.8"/>
    <rect x="30.8" y="18.6" width="2.4" height="6.2" rx="1"/>""",
    "insta360-x6-allround": """
    <rect x="13.5" y="14" width="24" height="13.6" rx="4.6"/>
    <circle cx="20.4" cy="20.8" r="3.9"/><circle cx="30.6" cy="20.8" r="3.9"/>
    <path d="M43 15.4v20.4M43 19.4h3.6"/>
    <path d="M13.5 32h11.8"/>
    <rect x="30" y="30.4" width="8.4" height="4.6" rx="1.6"/>""",
    "insta360-x6-travel": """
    <rect x="17.5" y="8" width="29" height="15" rx="4.6"/>
    <circle cx="25" cy="15.5" r="4.4"/><circle cx="39" cy="15.5" r="4.4"/>
    <path d="M32 23v8.4"/>
    <path d="M24 45l8-13.6L40 45M27.6 38.4h8.8"/>
    <path d="M45 30l4.4 8.4M48 30.6l2.4 7"/>""",
    # ---------- 微单（按镜头区分） ----------
    "mirrorless-entry": """
    <rect x="14.5" y="18" width="35" height="22" rx="4"/>
    <path d="M24 18l2-3.4h9l2 3.4"/>
    <circle cx="31" cy="29" r="6.4"/>
    <circle cx="31" cy="29" r="2.6"/>
    <path d="M45 22.4h2.4v4h-2.4"/>""",
    "mirrorless-plus": """
    <rect x="11.5" y="18" width="31" height="22" rx="4"/>
    <path d="M20 18l2-3.4h9l2 3.4"/>
    <circle cx="26" cy="29" r="6"/>
    <circle cx="26" cy="29" r="2.4"/>
    <path d="M34 23.4h12v11.2H34z"/>
    <path d="M38 23.4v11.2M44 23.4v11.2"/>""",
    "mirrorless-pro": """
    <rect x="12.5" y="19" width="29" height="21" rx="4"/>
    <path d="M20 19l2-3.2h8l2 3.2"/>
    <circle cx="24" cy="29" r="5.6"/>
    <circle cx="24" cy="29" r="2.2"/>
    <path d="M31 20h6.4v18H31z"/>
    <path d="M39 19.6h5.6v15.6H39z"/>
    <path d="M44.6 22.4h6.4v10h-6.4z"/>""",
    "mirrorless-one": """
    <rect x="12.5" y="19" width="27" height="21" rx="4"/>
    <path d="M18 19l2-3.2h8l2 3.2"/>
    <circle cx="22" cy="29" r="5.2"/>
    <path d="M26.4 20.4h3.2v17.2h-3.2"/>
    <path d="M29.6 21.6h7.2v14.8h-7.2"/>
    <path d="M36.8 22.8h5.6v12.4h-5.6M42.4 24l6.6-1.2v10.4l-6.6-1.2"/>""",
    # ---------- 卡片机 / CCD ----------
    "compact-entry": """
    <rect x="17" y="15.5" width="30" height="18" rx="3.2"/>
    <path d="M23 15.5l1.4-2.4h5l1.4 2.4"/>
    <circle cx="30" cy="24.5" r="5.4"/>
    <circle cx="30" cy="24.5" r="2.2"/>
    <rect x="38.6" y="18.6" width="6" height="4.6" rx="1"/>
    <path d="M19 33.5v2.6h5"/>""",
    "compact-vlog": """
    <rect x="10" y="22" width="22" height="14" rx="3"/>
    <circle cx="19" cy="29" r="4.2"/><circle cx="19" cy="29" r="1.7"/>
    <path d="M22.4 26h2.6M22.4 29h2.6M22.4 32h2.6"/>
    <path d="M32 29h5.4"/>
    <circle cx="43" cy="29" r="4.6"/>
    <path d="M43 24.4v-2.6M38.4 29h-2.6M47.6 29h2.6M40 26l-1.8-1.8M46 26l1.8-1.8"/>
    <path d="M37.6 29a5.4 5.4 0 0 1 10.8 0"/>""",
    "canon-ixus-210": """
    <rect x="15" y="17" width="34" height="21" rx="5"/>
    <rect x="15" y="17" width="34" height="7" rx="4"/>
    <circle cx="25" cy="30" r="5.6"/><circle cx="25" cy="30" r="13.6" opacity=".35"/>
    <rect x="33" y="27" width="8.6" height="6.6" rx="1"/>
    <path d="M18 11.6h13l3 5.4H18z"/>
    <path d="M22 38v3.2h6"/>""",
    "canon-ixus-130": """
    <rect x="16" y="18" width="32" height="20" rx="7"/>
    <circle cx="25.4" cy="28" r="6.2"/><circle cx="25.4" cy="28" r="15" opacity=".3"/>
    <circle cx="25.4" cy="28" r="2.4"/>
    <rect x="33.4" y="25" width="9" height="6.4" rx="1.4"/>
    <path d="M38 18v-3.4M40.6 16.4l3.4 1.2"/>
    <circle cx="20" cy="41" r="1"/>""",
    # ---------- 佳能 PowerShot G12（专业便携机：双层转盘 + 前部拨轮 + 翻转屏） ----------
    "compact-g12": """
    <rect x="17" y="18" width="30" height="19" rx="3.4"/>
    <circle cx="30" cy="27.5" r="6.2"/>
    <circle cx="30" cy="27.5" r="2.4"/>
    <path d="M39 23.4h5.6v5.4H39z"/>
    <path d="M23 18l1.4-2.6h5l1.4 2.6"/>
    <circle cx="40" cy="12.6" r="3.2"/>
    <circle cx="40" cy="12.6" r="1.2"/>
    <path d="M45.4 10.6h3.4M45.4 14.6h3.4"/>
    <path d="M19 40.4h26M22 40.4v3.2M42 40.4v3.2"/>
    <path d="M14 24.4v6.2"/>""",
    # ---------- 三脚架 ----------
    "tripod-live": """
    <path d="M22 8h20v4H22z"/>
    <circle cx="32" cy="16.6" r="4"/>
    <path d="M32 20.6v8.2"/>
    <path d="M32 28.8L16 54M32 28.8l16 25.2"/>
    <path d="M23 41h18"/>
    <path d="M32 28.8L26 54M32 28.8l6 25.2"/>""",
    "tripod-cam": """
    <rect x="8" y="12" width="14" height="10" rx="2.4"/>
    <rect x="25" y="12" width="14" height="10" rx="2.4"/>
    <rect x="42" y="12" width="14" height="10" rx="2.4"/>
    <path d="M13 22v6h10M30 22v6h10M47 22v6h10"/>
    <rect x="8" y="30" width="14" height="10" rx="2.4"/>
    <path d="M12 30l4-2.4 4 2.4"/>
    <path d="M40 31l8 8M44 30l4 10"/>
    <circle cx="31" cy="37" r="4"/><path d="M27 37h8M31 33v8"/>
    <rect x="44" y="30" width="12" height="4" rx="2"/>""",
    # ---------- 数据找回 ----------
    "recovery-sd": """
    <path d="M18 12h28v30H18z"/>
    <path d="M23 12V5.6M28 12V5.6M33 12V5.6M38 12V5.6"/>
    <path d="M18 12l-1.6 2v3"/>
    <path d="M24 22h16v12H24z"/>
    <path d="M12 48h8a6 6 0 0 1 6 6h22"/>
    <path d="M44 50l4.4 4-4.4 4"/>""",
    "recovery-tf": """
    <path d="M24 14h14l6 6v16H24z"/>
    <path d="M24 14l-2.4 2.6v3.4"/>
    <path d="M28 14v5.6M32 14v5.6M36 14v5.6"/>
    <path d="M29 26h9v7h-9z"/>
    <path d="M17 36.4h4.6M17 41.4h4.6M17 46.4h4.6"/>
    <path d="M42 40.4h5.4M42 45.4h5.4"/>
    <path d="M25.6 43.4l-3.2 2.6 3.2 2.6"/>""",
}


def svg_for(key):
    body = PARTS[key]
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" '
        'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" '
        'stroke-linejoin="round" aria-hidden="true">\n'
        + body.strip()
        + "\n</svg>\n"
    )


def main():
    os.makedirs(OUT, exist_ok=True)
    for key in PARTS:
        path = os.path.join(OUT, key + ".svg")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(svg_for(key))
    print("generated", len(PARTS), "illustrations in", OUT)


if __name__ == "__main__":
    main()
