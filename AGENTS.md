# GearCalc-3Stage AI 协作说明

## 拉取代码后必须重建（每次 pull 后必做）

每次执行 `git pull` 同步代码后，必须紧接着执行：

```bash
npm install
npm run tauri build
```

原因：`git pull` 只更新源代码，桌面应用 exe（`src-tauri/target/release/gearcalc-3stage.exe`）是编译产物，不会自动更新。不重建的话用户运行的仍是旧版本，会造成"代码已更新但程序没变化"的误判。

AI 助手帮用户 pull 之后，应主动完成上述重建，并报告新 exe 的生成时间，确认用户下次打开的是新版本。只想快速预览、不需要生成 exe 时可改用 `npm run tauri dev`。
