# GearCalc-3Stage AI 协作说明

## 拉取代码后必须重建（每次 pull 后必做）

每次执行 `git pull` 同步代码后，必须紧接着执行：

```bash
npm install
npm run tauri build
```

原因：`git pull` 只更新源代码，`src-tauri/target/` 中的桌面程序和安装包都是被 Git 忽略的编译产物，不会自动更新。不重建的话用户运行的仍是旧版本，会造成“代码已更新但程序没变化”的误判。

AI 助手帮用户 pull 之后，应主动完成上述重建，并报告当前平台产物的生成时间和正确入口：

- macOS：打开 `src-tauri/target/release/bundle/macos/GearCalc-3Stage.app`，或用 `bundle/dmg/*.dmg` 安装；不要让用户双击 `target/release/gearcalc-3stage`，否则 Finder 会通过终端运行底层 Unix 可执行文件。
- Windows：优先运行 `src-tauri/target/release/bundle/nsis/*-setup.exe` 安装，发布版已配置为不显示控制台窗口。

只想快速预览、不需要生成安装包时可改用 `npm run tauri dev`；开发模式由终端承载，终端需要保持运行。
