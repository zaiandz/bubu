# -*- coding: utf-8 -*-
"""
把 tools/newcontent/*.json（每篇教程的 JSON 片段）合并进 js/data.js。

用法：python tools/merge-tutorials.py           # 写入 js/data.js
      python tools/merge-tutorials.py --check   # 只校验不写入

校验内容：
  - JSON 可解析、必填字段齐全
  - 只允许约定的内容块类型
  - img/video 引用的文件必须真实存在（避免破图）
  - 步骤数、标题长度、不含 code 块
最后重建新版 SUBCATEGORY_CONTENT，并保留原文件头部注释与其它常量。
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "js", "data.js")
SRC = os.path.join(ROOT, "tools", "newcontent")

ALLOWED = {"p", "list", "olist", "tip", "warn", "table", "img", "video"}
FORBIDDEN = {"code"}
MEDIA_EXT = (".svg", ".png", ".jpg", ".jpeg", ".webp", ".mp4", ".gif")


def validate(key, obj):
    errs = []
    if not isinstance(obj, dict):
        return [f"{key}: 顶层不是对象"]
    if not obj.get("desc"):
        errs.append(f"{key}: 缺少 desc")
    steps = obj.get("steps")
    if not isinstance(steps, list) or not steps:
        return errs + [f"{key}: steps 为空"]
    for i, st in enumerate(steps):
        tag = f"{key}#{i + 1}"
        if not st.get("title"):
            errs.append(f"{tag}: 缺少标题")
        elif len(st["title"]) > 20:
            errs.append(f"{tag}: 标题过长（{len(st['title'])}）")
        body = st.get("body")
        if not isinstance(body, list) or not body:
            errs.append(f"{tag}: 正文为空")
            continue
        for j, b in enumerate(body):
            t = b.get("type")
            if t in FORBIDDEN:
                errs.append(f"{tag}.{j}: 不允许的块类型 {t}")
            elif t not in ALLOWED:
                errs.append(f"{tag}.{j}: 未知块类型 {t}")
            if t in ("p", "tip", "warn") and not b.get("text"):
                errs.append(f"{tag}.{j}: 缺少 text")
            if t in ("list", "olist") and not b.get("items"):
                errs.append(f"{tag}.{j}: 缺少 items")
            if t == "table" and not (b.get("head") and b.get("rows")):
                errs.append(f"{tag}.{j}: 表格缺 head/rows")
            if t in ("img", "video"):
                src = b.get("src", "")
                if not src.endswith(MEDIA_EXT):
                    errs.append(f"{tag}.{j}: 可疑媒体路径 {src}")
                if not os.path.exists(os.path.join(ROOT, src)):
                    errs.append(f"{tag}.{j}: 文件不存在 {src}")
    return errs


def load_all():
    out = {}
    for name in sorted(os.listdir(SRC)):
        if not name.endswith(".json"):
            continue
        key = name[:-5]
        with open(os.path.join(SRC, name), encoding="utf-8") as f:
            out[key] = json.load(f)
    return out


def js_literal(obj, indent=2):
    """输出与现有 data.js 风格一致的 JSON（2 空格缩进）。"""
    return json.dumps(obj, ensure_ascii=False, indent=indent)


def main():
    check_only = "--check" in sys.argv
    content = load_all()

    # 只合并分类树里存在的 id
    with open(DATA, encoding="utf-8") as f:
        src = f.read()
    ids = set(re.findall(r'\{ id: "([^"]+)"', src))
    unknown = [k for k in content if k not in ids]
    missing = sorted(i for i in ids if i not in content)

    all_errs = []
    for k, v in content.items():
        all_errs += validate(k, v)

    print(f"内容文件 {len(content)} 个；目录中缺失 {len(missing)} 个：{missing[:8]}")
    if unknown:
        print(f"警告：以下文件不在分类树中，将被忽略 {unknown}")
    for e in all_errs[:40]:
        print("  ✗", e)
    print(f"校验问题 {len(all_errs)} 处")

    if check_only or all_errs or missing:
        return 1 if (all_errs or missing) else 0

    # 重建 SUBCATEGORY_CONTENT
    parts = []
    order = re.findall(r'\{ id: "([^"]+)"', src)
    seen = set()
    for cid in order:
        if cid in seen or cid not in content:
            continue
        seen.add(cid)
        parts.append(f'  {json.dumps(cid, ensure_ascii=False)}: ' + js_literal(content[cid], 2).replace("\n", "\n  "))

    block = "const SUBCATEGORY_CONTENT = {\n" + ",\n\n".join(parts) + "\n};\n"
    head = src[: src.index("const SUBCATEGORY_CONTENT = {")]
    new_src = head + block

    with open(DATA, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_src)
    print("已写入", DATA, len(new_src), "字节")
    return 0


if __name__ == "__main__":
    sys.exit(main())
