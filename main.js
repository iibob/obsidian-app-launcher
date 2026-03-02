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
    this.ribbonIconEl = this.addRibbonIcon("rocket", `Launch ${displayName}`, (evt) => {
      this.launchApp();
    });
    this.addSettingTab(new LauncherSettingTab(this.app, this));
  }
  // Get the name to be displayed
  getCurrentDisplayName() {
    if (import_obsidian.Platform.isDesktopApp) {
      return this.settings.desktopName.trim() || "Application";
    } else {
      return this.settings.mobileName.trim() || "Application";
    }
  }
  // Update the tooltip of the ribbon icon
  updateRibbonTooltip() {
    if (this.ribbonIconEl) {
      const currentName = this.getCurrentDisplayName();
      this.ribbonIconEl.setAttribute("aria-label", `Launch ${currentName}`);
    }
  }
  async launchApp() {
    const { desktopPath, mobileUrlScheme } = this.settings;
    const displayName = this.getCurrentDisplayName();
    if (import_obsidian.Platform.isDesktopApp) {
      if (!desktopPath.trim()) {
        new import_obsidian.Notice("Please configure the application path in settings first.");
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
            new import_obsidian.Notice(`Failed to launch: Invalid path.`);
          } else {
            new import_obsidian.Notice(`Launching ${displayName}...`);
          }
        });
      } catch (e) {
        new import_obsidian.Notice("Command execution is not supported in this environment.");
      }
    } else if (import_obsidian.Platform.isMobile) {
      const scheme = mobileUrlScheme.trim();
      if (!scheme) {
        new import_obsidian.Notice("Please configure the URL Scheme in settings first.");
        return;
      }
      new import_obsidian.Notice(`Attempting to open ${displayName}...`);
      try {
        window.open(scheme, "_blank");
      } catch (e) {
        new import_obsidian.Notice("Failed to execute jump command.");
      }
    }
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
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
    containerEl.createEl("h2", { text: "Desktop Settings" });
    new import_obsidian.Setting(containerEl).setName("Application Name").setDesc("The tooltip text shown when hovering over the ribbon icon. Restart Obsidian if it doesn't update immediately.").addText((text) => text.setPlaceholder("e.g., Sync Tool").setValue(this.plugin.settings.desktopName).onChange(async (value) => {
      this.plugin.settings.desktopName = value;
      await this.plugin.saveSettings();
      this.plugin.updateRibbonTooltip();
    }));
    new import_obsidian.Setting(containerEl).setName("Application Path").setDesc("Windows example: C:\\Windows\\notepad.exe").addText((text) => text.setPlaceholder("Enter full path").setValue(this.plugin.settings.desktopPath).onChange(async (value) => {
      this.plugin.settings.desktopPath = value;
      await this.plugin.saveSettings();
    }));
    containerEl.createEl("br");
    containerEl.createEl("h2", { text: "Mobile Settings" });
    new import_obsidian.Setting(containerEl).setName("App Name").setDesc("The display name for the mobile version.").addText((text) => text.setPlaceholder("e.g., Shortcuts, Notion").setValue(this.plugin.settings.mobileName).onChange(async (value) => {
      this.plugin.settings.mobileName = value;
      await this.plugin.saveSettings();
      this.plugin.updateRibbonTooltip();
    }));
    new import_obsidian.Setting(containerEl).setName("URL Scheme").setDesc("Example: notion:// or shortcuts://run-shortcut?name=YourShortcutName").addText((text) => text.setPlaceholder("Enter URL Scheme").setValue(this.plugin.settings.mobileUrlScheme).onChange(async (value) => {
      this.plugin.settings.mobileUrlScheme = value;
      await this.plugin.saveSettings();
    }));
  }
};
