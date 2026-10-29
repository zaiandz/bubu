# -*- coding: utf-8 -*-
"""
把用户提供的商品图处理成网站统一规格：
  清理背景（去浅灰分隔线/底色）→ 按产品轮廓裁切 → 等比缩放到统一长边占比 → 900×900 纯白画布居中
输出到网站根目录 images/products/<型号id>.png

用法：
  python tools/process-product-images.py <图片目录>      # 按内置文件名映射处理
处理规则在下面 MAP 中维护：源文件名 → 型号 id。
"""
import os
import sys
from PIL import Image, ImageChops, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, "images", "products")

# 源文件名 → 型号 id（与 js/rental-data.js 的 items[].id 对应）
MAP = {
    "大疆pocket3.png": "pocket-3",
    "大疆pocket4Pro.png": "pocket-4-pro",
    "影石ACE Pro2.PNG": "ace-pro-2",
    "影石isnta X6.PNG": "insta360-x6",
    "佳能R50.PNG": "canon-r50",
    "佳能G7x3.PNG": "g7x-mark3",
    "佳能G12.PNG": "g12",
    "佳能IXUS 210.PNG": "ixus-210",
    "佳能IXUS 130.PNG": "ixus-130",
}

SIZE = 900          # 输出画布边长
LONG_EDGE = 0.72    # 产品长边占画布比例：统一这个值，保证各机型视觉大小一致


def white_clean_mask(im, cutoff=246):
    """
    生成“真正的产品像素”掩码：
      只有离白色足够远、并且周围有足够多同类像素的点才算产品，
      这样可以滤掉原图里的浅灰分隔线、边缘渐变、淡淡的水印等背景杂质。
    """
    rgb = im.convert("RGB")
    diff = ImageChops.difference(rgb, Image.new("RGB", rgb.size, (255, 255, 255))).convert("L")
    mask = diff.point(lambda v: 255 if v > (255 - cutoff) else 0)
    # 轻微收缩再膨胀，去掉零散的灰线像素
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    return mask


def trim_to_product(im, cutoff=246):
    """按“产品像素”裁切，忽略浅灰背景线与留白。"""
    mask = white_clean_mask(im, cutoff)
    bbox = mask.getbbox()
    return im.crop(bbox) if bbox else im


def flatten_background(im):
    """
    把产品以外的区域统一刷成纯白：
      保留产品及紧邻的柔和投影阴影，但清掉大片浅灰底色与横向分隔线。
    """
    rgb = im.convert("RGB")
    mask = white_clean_mask(rgb)
    # 膨胀若干次，保住产品边缘的抗锯齿和投影
    grown = mask.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MaxFilter(9))
    white = Image.new("RGB", rgb.size, (255, 255, 255))
    out = Image.composite(rgb, white, grown)
    # 边缘再柔和过渡一次，避免切边生硬
    soft = grown.filter(ImageFilter.GaussianBlur(2))
    return Image.composite(rgb, out, soft)


def normalize(im):
    im = flatten_background(im)      # 先清干净背景
    im = trim_to_product(im)         # 再按产品轮廓裁切
    canvas = Image.new("RGB", (SIZE, SIZE), (255, 255, 255))
    w, h = im.size
    # 以产品长边为基准统一缩放：竖长机型也不会显得比横宽机型更大
    target = int(SIZE * LONG_EDGE)
    scale = target / max(w, h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    canvas.paste(im, ((SIZE - nw) // 2, (SIZE - nh) // 2))
    return canvas


def main():
    if len(sys.argv) < 2:
        print("用法：python tools/process-product-images.py <图片目录>")
        return 1
    src_dir = sys.argv[1]
    os.makedirs(DST, exist_ok=True)
    done = 0
    for fn, pid in MAP.items():
        src = os.path.join(src_dir, fn)
        if not os.path.exists(src):
            print("跳过（文件不存在）:", fn)
            continue
        img = normalize(Image.open(src))
        out = os.path.join(DST, pid + ".png")
        img.save(out, "PNG", optimize=True)
        print(f"✓ {fn} -> images/products/{pid}.png")
        done += 1
    print(f"完成 {done} 张，输出目录：images/products/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
