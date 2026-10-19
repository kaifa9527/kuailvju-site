#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""快旅居 · Chrome Canary CDP 操控工具
用法: python3 cdp_drive.py list|navigate|screenshot|eval|tabs|newtab <args>
连 127.0.0.1:9223 (CanaryDebugProfile2 调试实例)
"""
import json
import sys
import time
import urllib.request

import websocket

PORT = 9223
BASE = f"http://127.0.0.1:{PORT}"


def http_get(path):
    with urllib.request.urlopen(f"{BASE}{path}", timeout=5) as r:
        return json.loads(r.read().decode())


def find_page_target(url_part=None):
    targets = http_get("/json/list")
    pages = [t for t in targets if t.get("type") == "page"]
    if url_part:
        for t in pages:
            if url_part in t.get("url", ""):
                return t
    return pages[0] if pages else None


class CDP:
    def __init__(self, ws_url):
        self.ws = websocket.create_connection(ws_url, timeout=30)
        self._id = 0

    def call(self, method, params=None):
        self._id += 1
        self.ws.send(json.dumps({"id": self._id, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self._id:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def close(self):
        try:
            self.ws.close()
        except Exception:
            pass


def open_cdp_for_page(page):
    return CDP(page["webSocketDebuggerUrl"])


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "list"

    if cmd == "list":
        for t in http_get("/json/list"):
            if t.get("type") == "page":
                print(f"{t['id'][:8]} | {t.get('title','')[:40]} | {t.get('url','')[:80]}")
        return

    if cmd == "newtab":
        url = sys.argv[2] if len(sys.argv) > 2 else "about:blank"
        # 通过浏览器级 target 开新页
        ver = http_get("/json/version")
        cdp = CDP(ver["webSocketDebuggerUrl"])
        r = cdp.call("Target.createTarget", {"url": url})
        print(json.dumps(r))
        cdp.close()
        return

    page = find_page_target()
    if not page:
        print("NO_PAGE")
        return
    cdp = open_cdp_for_page(page)

    if cmd == "navigate":
        url = sys.argv[2]
        cdp.call("Page.enable")
        cdp.call("Page.navigate", {"url": url})
        time.sleep(float(sys.argv[3]) if len(sys.argv) > 3 else 4)
        print("NAV_OK", url)

    elif cmd == "screenshot":
        out = sys.argv[2]
        cdp.call("Page.enable")
        r = cdp.call("Page.captureScreenshot", {"format": "png"})
        with open(out, "wb") as f:
            f.write(__import__("base64").b64decode(r["data"]))
        print("SHOT_OK", out)

    elif cmd == "eval":
        expr = sys.argv[2]
        cdp.call("Runtime.enable")
        r = cdp.call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
        if r.get("exceptionDetails"):
            print("EVAL_ERR", json.dumps(r["exceptionDetails"].get("text", "")))
        else:
            print("EVAL_OK", json.dumps(r.get("result", {}).get("value"), ensure_ascii=False)[:500])

    elif cmd == "clickxy":
        x, y = int(sys.argv[2]), int(sys.argv[3])
        cdp.call("Input.dispatchMouseEvent", {"type": "mousePressed", "x": x, "y": y, "button": "left", "clickCount": 1})
        cdp.call("Input.dispatchMouseEvent", {"type": "mouseReleased", "x": x, "y": y, "button": "left", "clickCount": 1})
        print("CLICKED", x, y)

    elif cmd == "inserttext":
        text = sys.argv[2]
        cdp.call("Input.insertText", {"text": text})
        print("TEXT_INSERTED", len(text))

    elif cmd == "key":
        key = sys.argv[2]
        cdp.call("Input.dispatchKeyEvent", {"type": "keyDown", "key": key, "code": "Enter"})
        cdp.call("Input.dispatchKeyEvent", {"type": "keyUp", "key": key, "code": "Enter"})
        print("KEY", key)

    elif cmd == "keycombo":
        key, modifiers = sys.argv[2], int(sys.argv[3])
        cdp.call("Input.dispatchKeyEvent", {"type": "keyDown", "key": key, "code": key.upper(), "modifiers": modifiers})
        cdp.call("Input.dispatchKeyEvent", {"type": "keyUp", "key": key, "code": key.upper(), "modifiers": modifiers})
        print("KEYCOMBO", key, modifiers)

    elif cmd == "evalfile":
        with open(sys.argv[2], encoding="utf-8") as f:
            expr = f.read()
        cdp.call("Runtime.enable")
        r = cdp.call("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        if r.get("exceptionDetails"):
            print("EVAL_ERR", json.dumps(r["exceptionDetails"].get("text", "")))
        else:
            print("EVAL_OK", json.dumps(r.get("result", {}).get("value"), ensure_ascii=False)[:800])

    elif cmd == "tabs":
        for t in http_get("/json/list"):
            if t.get("type") == "page":
                print(f"{t['id'][:8]} | {t.get('title','')[:40]} | {t.get('url','')[:80]}")
    else:
        print("未知命令")

    cdp.close()


if __name__ == "__main__":
    main()
