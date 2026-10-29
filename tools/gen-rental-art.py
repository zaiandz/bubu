# -*- coding: utf-8 -*-
"""
生成租赁页白底产品图（自绘矢量，不使用品牌官方图片，避免版权问题）。
输出：images/rental/<型号id>.svg，640×640 白底，产品居中等比缩放。

运行：python tools/gen-rental-art.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "rental")

W = H = 640
# 通用配色（写实质感）
BODY = "#424852"
BODY_L = "#5a626e"
BODY_D = "#2c3138"
GLASS = "#1b2f4d"
GLASS_HI = "#7fa6d6"
ACCENT = "#e0e4ea"
SCREEN = "#0b0e13"
SCREEN_HI = "#1a2230"


def svg(inner, extra_defs=""):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
<linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BODY_L}"/><stop offset="1" stop-color="{BODY}"/></linearGradient>
<linearGradient id="bodyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BODY}"/><stop offset="1" stop-color="{BODY_D}"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{GLASS_HI}"/><stop offset=".45" stop-color="{GLASS}"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{SCREEN_HI}"/><stop offset="1" stop-color="{SCREEN}"/></linearGradient>
<linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f9"/><stop offset=".5" stop-color="#cfd5dd"/><stop offset="1" stop-color="#98a0ab"/></linearGradient>
<radialGradient id="shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
{extra_defs}
</defs>
<rect width="{W}" height="{H}" fill="#ffffff"/>
<ellipse cx="{W/2}" cy="548" rx="190" ry="26" fill="url(#shadow)"/>
<g transform="translate(320 312) scale(1.16)">
{inner}
</g>
</svg>
'''


# ---------------- 手持云台：Pocket 3 / Pocket 4 Pro ----------------
def pocket(with_light=False):
    light = """
  <rect x="-16" y="-232" width="86" height="26" rx="13" fill="#1c1f25"/>
  <rect x="30" y="-232" width="40" height="26" rx="13" fill="#efe3c8"/>
  <rect x="34" y="-228" width="32" height="18" rx="9" fill="#fff5dc"/>""" if with_light else ""
    return f'''
  <!-- 手柄 -->
  <rect x="-46" y="18" width="92" height="150" rx="26" fill="url(#bodyD)"/>
  <rect x="-20" y="30" width="40" height="66" rx="12" fill="#20242a"/>
  <path d="M-14 62h28" stroke="#3a4048" stroke-width="4" stroke-linecap="round"/>
  <circle cx="-14" cy="120" r="9" fill="#20252c" stroke="#3a4048" stroke-width="3"/>
  {light}
  <!-- 云台臂 -->
  <path d="M0 18V-42" stroke="#30353d" stroke-width="26" stroke-linecap="round"/>
  <circle cx="0" cy="-42" r="24" fill="url(#body)" stroke="#000" stroke-opacity=".25"/>
  <!-- 屏幕机身 -->
  <rect x="-86" y="-232" width="172" height="196" rx="26" fill="url(#body)"/>
  <rect x="-74" y="-220" width="148" height="172" rx="16" fill="url(#screen)"/>
  <rect x="-74" y="-220" width="148" height="60" rx="16" fill="#22304a" opacity=".55"/>
  <circle cx="-52" cy="-206" r="4" fill="#f59e0b"/>
  <rect x="-38" y="-210" width="78" height="8" rx="4" fill="#5b6472" opacity=".7"/>
  <!-- 云台镜头 -->
  <circle cx="-34" cy="-96" r="34" fill="url(#bodyD)"/>
  <circle cx="-34" cy="-96" r="26" fill="url(#glass)"/>
  <circle cx="-34" cy="-96" r="13" fill="#05070a"/>
  <circle cx="-42" cy="-106" r="6" fill="#8fa3bd" opacity=".65"/>
  <!-- 侧边按键 -->
  <rect x="86" y="-170" width="10" height="42" rx="5" fill="#4a5058"/>
  <rect x="86" y="-112" width="10" height="26" rx="5" fill="#20252c"/>
  <!-- 转轴 -->
  <circle cx="0" cy="18" r="12" fill="#4a5058"/>
'''


# ---------------- 运动相机：Ace Pro 2 ----------------
def ace_pro():
    return '''
  <rect x="-150" y="-110" width="300" height="220" rx="46" fill="url(#body)"/>
  <rect x="-150" y="-110" width="300" height="220" rx="46" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3"/>
  <!-- 前置镜头 -->
  <circle cx="-46" cy="-16" r="74" fill="#30353d"/>
  <circle cx="-46" cy="-16" r="66" fill="url(#metal)"/>
  <circle cx="-46" cy="-16" r="52" fill="url(#glass)"/>
  <circle cx="-46" cy="-16" r="26" fill="#05070a"/>
  <circle cx="-64" cy="-38" r="11" fill="#9fb4cc" opacity=".6"/>
  <!-- 翻转屏 -->
  <rect x="34" y="-92" width="104" height="184" rx="14" fill="#20252c"/>
  <rect x="40" y="-86" width="92" height="172" rx="10" fill="url(#screen)"/>
  <rect x="40" y="-86" width="92" height="52" rx="10" fill="#24344f" opacity=".6"/>
  <!-- 按键 -->
  <rect x="-140" y="-98" width="34" height="16" rx="8" fill="#4a5058"/>
  <circle cx="-70" cy="80" r="11" fill="#20252c" stroke="#4a5058" stroke-width="3"/>
  <!-- 顶部散热格栅 -->
  <path d="M-96 -110h120" stroke="#171b21" stroke-width="6" stroke-linecap="round"/>
'''


# ---------------- 全景相机：Insta360 X6 ----------------
def insta_x6():
    return '''
  <rect x="-130" y="-86" width="260" height="172" rx="40" fill="url(#body)"/>
  <circle cx="-58" cy="0" r="56" fill="#30353d"/>
  <circle cx="-58" cy="0" r="46" fill="url(#glass)"/>
  <circle cx="-58" cy="0" r="18" fill="#05070a"/>
  <circle cx="58" cy="0" r="56" fill="#30353d"/>
  <circle cx="58" cy="0" r="46" fill="url(#glass)"/>
  <circle cx="58" cy="0" r="18" fill="#05070a"/>
  <circle cx="-72" cy="-16" r="9" fill="#9fb4cc" opacity=".55"/>
  <circle cx="44" cy="-16" r="9" fill="#9fb4cc" opacity=".55"/>
  <!-- 屏幕 -->
  <rect x="-26" y="-62" width="52" height="124" rx="10" fill="#20252c"/>
  <rect x="-21" y="-57" width="42" height="114" rx="7" fill="url(#screen)"/>
  <rect x="-21" y="-57" width="42" height="36" rx="7" fill="#2b3f61" opacity=".7"/>
  <!-- 顶部按键 -->
  <rect x="-18" y="-100" width="36" height="16" rx="8" fill="#4a5058"/>
  <!-- 底部接口 -->
  <rect x="-16" y="86" width="32" height="10" rx="5" fill="#11141a"/>
'''


# ---------------- 位图感相机：微单 R50（带镜头） ----------------
def mirrorless():
    return '''
  <!-- 镜头 -->
  <ellipse cx="-150" cy="10" rx="40" ry="96" fill="url(#bodyD)"/>
  <ellipse cx="-116" cy="10" rx="34" ry="92" fill="#2f343b"/>
  <path d="M-150 -84v188M-116 -80v180" stroke="#171b21" stroke-width="5" opacity=".5"/>
  <ellipse cx="-116" cy="10" rx="26" ry="78" fill="url(#glass)"/>
  <ellipse cx="-116" cy="10" rx="14" ry="44" fill="#05070a"/>
  <!-- 机身 -->
  <rect x="-70" y="-86" width="230" height="184" rx="30" fill="url(#body)"/>
  <rect x="-70" y="-86" width="230" height="184" rx="30" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="3"/>
  <!-- 手柄 -->
  <path d="M96 -60h34a18 18 0 0 1 18 18v96a18 18 0 0 1-18 18H96z" fill="url(#bodyD)"/>
  <!-- 取景器 -->
  <path d="M-30 -86h96v-30a10 10 0 0 0-10-10H-20a10 10 0 0 0-10 10z" fill="#2f343b"/>
  <!-- 翻转屏 -->
  <rect x="8" y="-50" width="96" height="112" rx="10" fill="#20252c"/>
  <rect x="13" y="-45" width="86" height="102" rx="7" fill="url(#screen)"/>
  <rect x="13" y="-45" width="86" height="32" rx="7" fill="#2b3f61" opacity=".7"/>
  <!-- 快门与拨盘 -->
  <circle cx="120" cy="-96" r="22" fill="url(#metal)"/>
  <circle cx="120" cy="-96" r="12" fill="#8e959f"/>
  <rect x="38" y="-106" width="54" height="18" rx="9" fill="#4a5058"/>
  <circle cx="-40" cy="-52" r="5" fill="#f59e0b"/>
'''


# ---------------- 卡片机 G7 X III ----------------
def compact_g7x():
    return '''
  <rect x="-150" y="-70" width="300" height="150" rx="30" fill="url(#body)"/>
  <path d="M-70 -70l12-22h70l12 22z" fill="#2f343b"/>
  <!-- 镜头（伸缩） -->
  <circle cx="-62" cy="6" r="74" fill="#30353d"/>
  <circle cx="-62" cy="6" r="62" fill="url(#metal)"/>
  <circle cx="-62" cy="6" r="48" fill="url(#glass)"/>
  <circle cx="-62" cy="6" r="22" fill="#05070a"/>
  <circle cx="-82" cy="-18" r="10" fill="#9fb4cc" opacity=".6"/>
  <!-- 翻转屏 -->
  <rect x="42" y="-52" width="96" height="116" rx="10" fill="#20252c"/>
  <rect x="47" y="-47" width="86" height="106" rx="7" fill="url(#screen)"/>
  <rect x="47" y="-47" width="86" height="32" rx="7" fill="#2b3f61" opacity=".7"/>
  <!-- 闪光灯与按键 -->
  <rect x="-140" y="-58" width="34" height="14" rx="7" fill="#dfe3e9"/>
  <circle cx="96" cy="-72" r="14" fill="url(#metal)"/>
  <rect x="-20" y="-88" width="46" height="18" rx="9" fill="#4a5058"/>
'''


# ---------------- 卡片机 G12 ----------------
def compact_g12():
    return '''
  <rect x="-160" y="-76" width="320" height="162" rx="26" fill="url(#body)"/>
  <!-- 手柄凸起 -->
  <rect x="-160" y="-52" width="46" height="138" rx="20" fill="url(#bodyD)"/>
  <path d="M-146 -40v110" stroke="#171b21" stroke-width="4" opacity=".4"/>
  <!-- 镜头（较厚） -->
  <circle cx="-40" cy="4" r="86" fill="#30353d"/>
  <circle cx="-40" cy="4" r="72" fill="url(#metal)"/>
  <circle cx="-40" cy="4" r="56" fill="url(#glass)"/>
  <circle cx="-40" cy="4" r="24" fill="#05070a"/>
  <!-- 弹出闪光灯 -->
  <rect x="-150" y="-104" width="52" height="30" rx="6" fill="#2f343b"/>
  <rect x="-146" y="-100" width="44" height="22" rx="4" fill="#eef1f5"/>
  <!-- 双层转盘 -->
  <circle cx="70" cy="-90" r="40" fill="url(#metal)"/>
  <circle cx="70" cy="-90" r="26" fill="#8e959f"/>
  <path d="M70 -112v-10" stroke="#3a4048" stroke-width="5" stroke-linecap="round"/>
  <circle cx="126" cy="-70" r="20" fill="#4a5058"/>
  <!-- 翻转屏 -->
  <rect x="34" y="-40" width="104" height="106" rx="10" fill="#20252c"/>
  <rect x="39" y="-35" width="94" height="96" rx="7" fill="url(#screen)"/>
  <rect x="39" y="-35" width="94" height="28" rx="7" fill="#2b3f61" opacity=".7"/>
'''


# ---------------- CCD：IXUS 210 / IXUS 130 ----------------
def ixus_210():
    return '''
  <path d="M-170 -40h340a44 44 0 0 1 44 44v46a44 44 0 0 1-44 44H-170a44 44 0 0 1-44-44V4a44 44 0 0 1 44-44z"
        transform="translate(24 6) scale(.92)" fill="url(#body)"/>
  <!-- 镜头 -->
  <circle cx="-70" cy="26" r="62" fill="#30353d"/>
  <circle cx="-70" cy="26" r="50" fill="url(#metal)"/>
  <circle cx="-70" cy="26" r="38" fill="url(#glass)"/>
  <circle cx="-70" cy="26" r="16" fill="#05070a"/>
  <!-- 大触摸屏 -->
  <rect x="10" y="-30" width="150" height="112" rx="10" fill="#20252c"/>
  <rect x="15" y="-25" width="140" height="102" rx="7" fill="url(#screen)"/>
  <rect x="15" y="-25" width="140" height="34" rx="7" fill="#2b3f61" opacity=".7"/>
  <!-- 闪光灯与 Logo 区 -->
  <rect x="-160" y="-20" width="40" height="16" rx="8" fill="#dfe3e9"/>
  <rect x="-150" y="74" width="120" height="8" rx="4" fill="#5b6472" opacity=".5"/>
'''


def ixus_130():
    return '''
  <rect x="-180" y="-46" width="360" height="112" rx="52" fill="url(#body)"/>
  <circle cx="-86" cy="10" r="56" fill="#30353d"/>
  <circle cx="-86" cy="10" r="44" fill="url(#metal)"/>
  <circle cx="-86" cy="10" r="32" fill="url(#glass)"/>
  <circle cx="-86" cy="10" r="13" fill="#05070a"/>
  <rect x="-10" y="-26" width="140" height="88" rx="10" fill="#20252c"/>
  <rect x="-5" y="-21" width="130" height="78" rx="7" fill="url(#screen)"/>
  <rect x="-5" y="-21" width="130" height="26" rx="7" fill="#2b3f61" opacity=".7"/>
  <rect x="-160" y="46" width="30" height="12" rx="6" fill="#dfe3e9"/>
  <path d="M-40 26h70" stroke="#5b6472" stroke-width="6" stroke-linecap="round" opacity=".45"/>
'''


# ---------------- 三脚架 ----------------
def tripod():
    return '''
  <!-- 液压云台 -->
  <rect x="-64" y="-230" width="128" height="26" rx="10" fill="url(#body)"/>
  <rect x="-84" y="-204" width="168" height="64" rx="16" fill="url(#bodyD)"/>
  <path d="M-84 -170h168" stroke="#4a5058" stroke-width="4" opacity=".6"/>
  <!-- 摇臂 -->
  <path d="M84 -172l96 40" stroke="#2f343b" stroke-width="16" stroke-linecap="round"/>
  <circle cx="180" cy="-132" r="14" fill="#11141a"/>
  <!-- 中柱 -->
  <rect x="-14" y="-140" width="28" height="150" rx="6" fill="url(#metal)"/>
  <!-- 三条腿 -->
  <path d="M0 -10L-118 196" stroke="#2f343b" stroke-width="20" stroke-linecap="round"/>
  <path d="M0 -10L118 196" stroke="#2f343b" stroke-width="20" stroke-linecap="round"/>
  <path d="M0 -10L8 200" stroke="#3c424b" stroke-width="18" stroke-linecap="round"/>
  <!-- 脚管锁扣 -->
  <rect x="-92" y="72" width="26" height="14" rx="6" fill="#4a5058" transform="rotate(-58 -79 79)"/>
  <rect x="66" y="72" width="26" height="14" rx="6" fill="#4a5058" transform="rotate(58 79 79)"/>
  <rect x="-2" y="92" width="24" height="14" rx="6" fill="#4a5058"/>
  <!-- 水平泡 -->
  <circle cx="-40" cy="-196" r="9" fill="#9ae6b4" opacity=".85"/>
'''


# ---------------- 存储卡：SD / TF ----------------
def sd_card():
    return '''
  <path d="M-110 -170h200v340h-200z" fill="url(#bodyD)" rx="12"/>
  <path d="M-110 -170l-18 20v-6l18-26z" fill="#2b2f36"/>
  <!-- 金手指 -->
  <path d="M-96 -170v-30M-74 -170v-30M-52 -170v-30M-30 -170v-30M-8 -170v-30" stroke="#c9a227" stroke-width="12" stroke-linecap="round"/>
  <!-- 标签 -->
  <rect x="-84" y="-60" width="150" height="190" rx="12" fill="#e8ecf2"/>
  <rect x="-84" y="-60" width="150" height="46" rx="12" fill="#1e4fd8"/>
  <rect x="-64" y="10" width="110" height="10" rx="5" fill="#b6bfcc"/>
  <rect x="-64" y="40" width="86" height="10" rx="5" fill="#cfd6e0"/>
  <rect x="-64" y="70" width="110" height="10" rx="5" fill="#cfd6e0"/>
  <path d="M-40 110h62v52h-62z" fill="#11141a" rx="6"/>
'''


def tf_card():
    return '''
  <path d="M-96 -186h132l40 42v330h-172z" fill="url(#bodyD)"/>
  <path d="M-96 -186l-24 26v24l24-50z" fill="#2b2f36"/>
  <!-- 金手指 -->
  <path d="M-70 -186v34M-44 -186v34M-18 -186v34M8 -186v34" stroke="#c9a227" stroke-width="12" stroke-linecap="round"/>
  <rect x="-80" y="-96" width="124" height="196" rx="10" fill="#e8ecf2"/>
  <rect x="-80" y="-96" width="124" height="40" rx="10" fill="#0f766e"/>
  <rect x="-62" y="-30" width="88" height="9" rx="4" fill="#b6bfcc"/>
  <rect x="-62" y="-4" width="66" height="9" rx="4" fill="#cfd6e0"/>
  <path d="M-36 36h52v44h-52z" fill="#11141a" rx="5"/>
'''


ART = {
    "pocket-3": pocket(False),
    "pocket-4-pro": pocket(True),
    "ace-pro-2": ace_pro(),
    "insta360-x6": insta_x6(),
    "canon-r50": mirrorless(),
    "g7x-mark3": compact_g7x(),
    "g12": compact_g12(),
    "ixus-210": ixus_210(),
    "ixus-130": ixus_130(),
    "fy-830": tripod(),
    "sd-recovery": sd_card(),
    "tf-recovery": tf_card(),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for key, inner in ART.items():
        path = os.path.join(OUT, key + ".svg")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(svg(inner))
    print("generated", len(ART), "white-background product images")


if __name__ == "__main__":
    main()
