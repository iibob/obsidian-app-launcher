"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => MyLauncherPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  desktopName: "",
  desktopPath: "",
  mobileName: "",
  mobileUrlScheme: ""
};
var MyLauncherPlugin = class extends import_obsidian.Plugin {
  settings;
  ribbonIconEl;
  async onload() {
    await this.loadSettings();
    const displayName = this.getCurrentDisplayName();
    this.ribbonIconEl = this.addRibbonIcon("rocket", `\u542F\u52A8${displayName}`, (evt) => {
      this.launchApp();
    });
    this.addSettingTab(new LauncherSettingTab(this.app, this));
  }
  // 获取当前应显示的名称
  getCurrentDisplayName() {
    if (import_obsidian.Platform.isDesktopApp) {
      return this.settings.desktopName.trim() || "\u5E94\u7528\u7A0B\u5E8F";
    } else {
      return this.settings.mobileName.trim() || "APP";
    }
  }
  // 动态更新图标提示文字
  updateRibbonTooltip() {
    if (this.ribbonIconEl) {
      const currentName = this.getCurrentDisplayName();
      this.ribbonIconEl.setAttribute("aria-label", `\u542F\u52A8${currentName}`);
    }
  }
  async launchApp() {
    const { desktopPath, mobileUrlScheme } = this.settings;
    const displayName = this.getCurrentDisplayName();
    if (import_obsidian.Platform.isDesktopApp) {
      if (!desktopPath.trim()) {
        new import_obsidian.Notice("\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u914D\u7F6E\u8DEF\u5F84");
        return;
      }
      try {
        const { exec } = require("child_process");
        let cmd = "";
        if (process.platform === "win32") {
          cmd = `start "" "${desktopPath}"`;
        } else if (process.platform === "darwin") {
          cmd = `open "${desktopPath}"`;
        } else {
          cmd = `xdg-open "${desktopPath}"`;
        }
        exec(cmd, (err) => {
          if (err) {
            new import_obsidian.Notice(`\u8DEF\u5F84\u6709\u8BEF\uFF0C\u542F\u52A8\u5931\u8D25`);
          } else {
            new import_obsidian.Notice(`\u6B63\u5728\u542F\u52A8 ${displayName} ...`);
          }
        });
      } catch (e) {
        new import_obsidian.Notice("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u6267\u884C\u547D\u4EE4");
      }
    } else if (import_obsidian.Platform.isMobile) {
      const scheme = mobileUrlScheme.trim();
      if (!scheme) {
        new import_obsidian.Notice("\u8BF7\u5148\u5728\u8BBE\u7F6E\u4E2D\u914D\u7F6E URL Scheme");
        return;
      }
      new import_obsidian.Notice(`\u5C1D\u8BD5\u5524\u8D77 ${displayName} ...`);
      try {
        window.open(scheme, "_blank");
      } catch (e) {
        new import_obsidian.Notice("\u8DF3\u8F6C\u6307\u4EE4\u6267\u884C\u5F02\u5E38");
      }
    }
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // 卸载时清理图标
  onunload() {
    if (this.ribbonIconEl) {
      this.ribbonIconEl.remove();
    }
  }
};
var LauncherSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u7535\u8111\u7AEF\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u5E94\u7528\u540D\u79F0").setDesc("\u9F20\u6807\u60AC\u505C\u5728\u529F\u80FD\u533A\u56FE\u6807\u4E0A\u65F6\u663E\u793A\u7684\u6587\u5B57\u3002\u4FEE\u6539\u540E\u82E5\u672A\u66F4\u65B0\uFF0C\u8BF7\u91CD\u542F Obsidian").addText((text) => text.setPlaceholder("\u4F8B\u5982\uFF1A\u540C\u6B65\u5DE5\u5177").setValue(this.plugin.settings.desktopName).onChange(async (value) => {
      this.plugin.settings.desktopName = value;
      await this.plugin.saveSettings();
      this.plugin.updateRibbonTooltip();
    }));
    new import_obsidian.Setting(containerEl).setName("\u5E94\u7528\u7A0B\u5E8F\u8DEF\u5F84").setDesc("Windows \u8DEF\u5F84\u793A\u4F8B: C:\\Windows\\notepad.exe").addText((text) => text.setPlaceholder("\u8BF7\u8F93\u5165\u5B8C\u6574\u8DEF\u5F84").setValue(this.plugin.settings.desktopPath).onChange(async (value) => {
      this.plugin.settings.desktopPath = value;
      await this.plugin.saveSettings();
    }));
    containerEl.createEl("br");
    containerEl.createEl("h2", { text: "\u79FB\u52A8\u7AEF\u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u5E94\u7528\u540D\u79F0").setDesc("\u5728\u529F\u80FD\u533A\u663E\u793A\u7684\u6587\u5B57\u3002\u4FEE\u6539\u540E\u82E5\u672A\u66F4\u65B0\uFF0C\u8BF7\u91CD\u542F Obsidian").addText((text) => text.setPlaceholder("\u4F8B\u5982\uFF1A\u5FEB\u6377\u6307\u4EE4\u3001\u5FAE\u4FE1").setValue(this.plugin.settings.mobileName).onChange(async (value) => {
      this.plugin.settings.mobileName = value;
      await this.plugin.saveSettings();
      this.plugin.updateRibbonTooltip();
    }));
    new import_obsidian.Setting(containerEl).setName("URL Scheme").setDesc("\u793A\u4F8B: shortcuts:// \u6216 wechat://").addText((text) => text.setPlaceholder("\u8F93\u5165 URL Scheme").setValue(this.plugin.settings.mobileUrlScheme).onChange(async (value) => {
      this.plugin.settings.mobileUrlScheme = value;
      await this.plugin.saveSettings();
    }));
  }
};
