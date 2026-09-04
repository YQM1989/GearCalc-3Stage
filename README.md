# GearCalc-3Stage

GearCalc-3Stage 是一个面向 1–3 级外啮合直齿轮方案前期估算的本地工具。它可以作为 Web 页面运行，也可以由 Tauri 打包为桌面应用。

## 工具解决什么问题

输入电机转速、扭矩和每级齿轮参数后，工具实时给出：

- 每级及总减速比；
- 每级输入/输出转速与扭矩；
- 总效率和输出方向；
- 中心距、节圆直径、齿顶圆直径、齿根圆直径和圆周齿距；
- 低齿数、大单级速比、小模数高扭矩等预设风险提示。

它不是完整的齿轮强度设计软件，不替代齿宽、材料、热处理、寿命、变位、齿隙、轴、轴承、箱体、润滑和制造公差校核。

## 第一版边界

- 只支持 1、2、3 级外啮合直齿轮；
- 压力角固定为标准 20°；
- 齿数必须是正整数；
- 模数必须大于 0；
- 每级效率必须在 0%–100% 之间；
- 输入错误会显示为红色校验信息，对应无效齿轮副不会继续产生貌似可信的速比、转速、扭矩或中心距。

完整字段和公式见 [docs/SCHEMA.md](docs/SCHEMA.md)，数据流和验收方式见 [docs/FLOW.md](docs/FLOW.md)。

## 技术结构

- React 19 + TypeScript：界面、输入状态和结果展示；
- Vite + Tailwind CSS：开发服务器、构建和样式；
- `src/lib/gearCalculations.ts`：与界面解耦的计算核心；
- Tauri 2 + Rust：macOS/Windows 本地桌面壳；
- 当前没有数据库、文件写入、自定义 Rust 命令或云端服务。

## 环境要求

### 通用

- Node.js 24 LTS；
- npm；
- 仓库包含 `package-lock.json`，只使用 npm，不混用 pnpm 或 yarn。

项目根目录的 `.node-version` 记录了本次验证使用的 Node 版本。

### macOS 桌面版

- Apple Silicon 或 Intel Mac；
- Xcode Command Line Tools；
- 通过 rustup 安装的 stable Rust/Cargo。

只开发 macOS 桌面目标时不要求完整 Xcode；iOS、Developer ID 签名和公证另行配置。

### Windows 桌面版

- Node.js 24 LTS 和 npm；
- Rust stable MSVC 工具链；
- Microsoft C++ Build Tools；
- WebView2 Runtime。

仓库提供手动触发的 GitHub Actions 构建流程，由 GitHub 的 Windows 环境生成 NSIS `.exe` 安装程序。

## Web 版运行与验证

```bash
npm ci
npm run check
npm run dev
```

开发页面默认地址为 `http://127.0.0.1:5173/`。

`npm run check` 会依次执行计算测试、TypeScript 检查和 Vite 生产构建。生产文件输出到 `dist/`，该目录不会提交到 Git。

## Tauri 验证

```bash
cargo fmt --manifest-path src-tauri/Cargo.toml -- --check
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings
npm run tauri -- info
```

macOS 本机 ad-hoc 验收包：

```bash
npm run tauri -- build --bundles app,dmg --ci --config '{"bundle":{"macOS":{"signingIdentity":"-"}}}'
```

输出位置：

- `.app`：`src-tauri/target/release/bundle/macos/`
- `.dmg`：`src-tauri/target/release/bundle/dmg/`

ad-hoc 签名只适合当前机器上的工程验收。公开分发必须使用 YQM 自己的 Apple Developer ID，并完成 hardened runtime、签名、公证和 stapling 验证；任何证书、密码、API Key 或私钥都不能写入仓库。

## 跨平台安装包

GitHub 仓库的 **Actions → Build desktop installers → Run workflow** 可以手动生成两份下载文件：

- `GearCalc-3Stage-0.1.0-macos-arm64.zip`，内含 Apple Silicon Mac 使用的 `.dmg`；
- `GearCalc-3Stage-0.1.0-windows-x64.zip`，内含 64 位 Windows 使用的 NSIS `.exe`。

该流程只在手动触发时运行，不会随每次提交自动打包，也不会自动创建 GitHub Release。Mac 包采用 ad-hoc 签名，Windows 包尚未做商业代码签名；它们适合当前阶段的内部测试，不等同于面向公众发布的正式签名版本。

## 已验证示例

两级参数：

- 电机：1450 rpm、0.5 N·m；
- 第一级：20 → 60 齿，效率 95%；
- 第二级：18 → 72 齿，效率 94%。

期望结果：总速比 12、总效率 89.3%、输出转速 120.83 rpm、输出扭矩 5.358 N·m、中心距分别为 40 mm 和 67.5 mm。该组结果已由自动化测试和计算核心核对，并保留为页面手动回归基准。

## 项目目录

```text
src/
  components/             React 界面组件
  lib/gearCalculations.ts 计算核心
  types/gear.ts           数据类型
src-tauri/                Tauri/Rust 桌面壳
tests/                    计算单元测试
.github/workflows/        手动生成 macOS/Windows 安装包
docs/
  SCHEMA.md               字段、单位、公式和校验规则
  FLOW.md                 数据流、风险流和验收顺序
```
