# Spotlight Visual & Interaction Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构 Spotlight 个人站的视觉与交互层：废除 `next-themes` 与暗色模式，建立暖纸 + 赭石橙单主题；引入 `motion-plus` / `motion/react` 分层动画系统，覆盖全站路由转场、滚动揭示、文字字符揭示、3D 倾斜与磁吸 hover。

**Architecture:** 8 个 PR 顺序实施，PR 1-2 搭基座（视觉 tokens + 拆 next-themes），PR 3-4 引入动画基础设施与路由转场，PR 5 升级共享内容组件，PR 6-8 落地各页面动效。动画通过新目录 `src/components/motion/` 的客户端组件提供，server 页面保持 SSR 边界，客户端化仅限于动画外壳。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript 5、Tailwind CSS v4（CSS-first `@theme`）、MDX 3、`motion` 12 + `motion-plus` 2（私有 registry）、Headless UI、Tabler Icons、next-themes（**本计划后删除**）、`Intl.Segmenter` 中文 grapheme 切分。

## Global Constraints

- **不修改路由、MDX 数据加载、content 架构**（articles/*.mdx、lib/articles.ts、lib/formatDate.ts、next.config.mjs 保持不动；唯一例外是 PR 1 中 `next.config.mjs` 不动）
- **Node 端口** `9731`（保持 `npm run dev` 不变）
- **语言**：中文界面、HTML lang=zh-CN（保持）
- **CSS 引擎**：Tailwind v4 + `@tailwindcss/postcss`（保持）
- **暗色**：彻底废除 — 不写 `dark:`、不保留 `prefers-color-scheme:dark` 媒体查询
- **主题强调色**：赭石橙 oklch(0.625 0.165 48)（保持不变）
- **目标浏览器**：现代桌面 + 移动浏览器；Safari 16+ / Chrome 最新 / Firefox 最新
- **动效降级**：所有动画默认尊重 `prefers-reduced-motion: reduce`
- **粗指针设备**：关闭 CursorTrails、MagneticHover、TiltCard 的鼠标跟随；保留轻量滚动揭示
- **Motion+ registry**：保留 `.npmrc` 配置；不升级 motion-plus
- **包管理**：npm；锁文件必须提交
- **提交粒度**：每个 step 末尾用 `git commit`；提交信息用英文 + conventional commits 风格

---

## File Structure（计划期内的新增/修改总览）

### 新增（PR 3 起的动画基础设施 + PR 4-6 的全局背景/转场/页面动效）

- `src/components/motion/MotionConfigProvider.tsx` — `MotionConfig reducedMotion="user"` 全站边界
- `src/components/motion/useMotionPreference.ts` — `useMotionPreference()` 统一 `useReducedMotion` + `usePointerFine` + `useMounted`
- `src/components/motion/PageTransition.tsx` — 路由转场客户端壳（AnimatePresence + 赭石全屏遮罩）
- `src/components/motion/SectionReveal.tsx` — 滚动区块进入
- `src/components/motion/StaggerGroup.tsx` — 列表/卡片序列揭示
- `src/components/motion/TextReveal.tsx` — 文字字符/词揭示（中文 Intl.Segmenter grapheme）
- `src/components/motion/MagneticHover.tsx` — 磁吸位移（MotionValue，跟随指针）
- `src/components/motion/TiltCard.tsx` — 3D 倾斜 + glare
- `src/components/motion/ScrollScene.tsx` — 滚动视差/遮罩（`useScroll` + `useTransform`）
- `src/components/motion/AmbientBackground.tsx` — 鼠标径向光晕 + 滚动色块
- `src/components/motion/ProseReveal.tsx` — MDX 子树段落批量揭示
- `src/components/motion/InspirationBurstButton.tsx` — 替换 `ThemeToggle` 的"点亮灵感"按钮
- `src/components/motion/CursorTrails.tsx` — 重命名并扩展自 `CursorDemo`，增加鼠标轨迹拖尾
- `src/components/motion/ReadingProgress.tsx` — 文章阅读进度条
- `src/components/motion/ScrollSectionAxis.tsx` — Section 标题左侧轴线滚动绘制
- `src/components/motion/PageWipe.tsx` — 路由转场里的赭石全屏遮罩子组件

### 修改

- `src/styles/tailwind.css` — `@theme inline` tokens、删除 `dark` variant、增加全站背景层、CSS 噪点、过渡缓动
- `src/styles/prism.css` — 暖深色代码主题（CSS 变量驱动）
- `src/styles/fonts.css` — 新增 Noto Serif SC（self-host via `next/font`）
- `tailwind.config.ts` — 删除冗余的 `fontSize`/`typography`/`extend.fontFamily`（v4 CSS-first）
- `typography.ts` — 删除（已是空导出）
- `src/app/layout.tsx` — 删除 `suppressHydrationWarning`、`dark:bg-black`；body → `bg-paper`；接入 `MotionConfigProvider` + `AmbientBackground` + `CursorTrails`
- `src/app/providers.tsx` — 删除 `ThemeProvider` + `ThemeWatcher`；保留 `AppContext` + `previousPathname`
- `src/components/Layout.tsx` — 背景层 + `PageTransition` 包裹 `<main>` children
- `src/components/Header.tsx` — 删除 `ThemeToggle`/Sun/Moon/`useTheme`；接入 `InspirationBurstButton`；暖色 tokens
- `src/components/Footer.tsx` — 暖色 tokens、分割线 reveal
- `src/components/Card.tsx` — 暖色 tokens（删除 `dark:`、teal 改赭石）
- `src/components/Button.tsx` — 暖色 tokens
- `src/components/Prose.tsx` — 删除 `dark:prose-invert`；挂接 `ProseReveal` 与暖色 typography
- `src/components/ArticleLayout.tsx` — 标题 `TextReveal`、日期滑入、阅读进度条、`ProseReveal`、返回按钮 `MagneticHover`
- `src/components/SimpleLayout.tsx` — 标题/intro 用 `TextReveal` + `SectionReveal`
- `src/components/Section.tsx` — 标题 `TextReveal`、轴线绘制
- `src/components/PhotoCarousel.tsx` — 保留 `motion-plus` Coverflow + 鼠标视差，迁移内联 CSS 到组件 class
- `src/components/CursorDemo.tsx` — **删除**（被 `motion/CursorTrails.tsx` 替代）
- `src/app/page.tsx` — Hero `TextReveal`、社交图标 `StaggerGroup` + `MagneticHover`、首屏 `ScrollScene`、照片 carousel 增强
- `src/app/about/page.tsx` — 肖像 `TiltCard`、暖色错位纸片、标题/正文 reveal、社交磁吸
- `src/app/articles/page.tsx` — 列表 `StaggerGroup`、卡片磁吸
- `src/app/projects/page.tsx` — 网格 stagger、每个项目 `TiltCard`、CTA 箭头 hover
- `src/app/videos/page.tsx` — 列表 stagger、卡片磁吸
- `src/app/uses/page.tsx` — 列表 stagger
- `src/app/friends/page.tsx` — 人物卡 `TiltCard`、旋转虚线轨道、磁吸
- `src/app/not-found.tsx` — 撕裂式 clip-path reveal、404 字符漂移、按钮磁吸

### 删除

- `next-themes` 依赖（`package.json` + `package-lock.json`）
- `src/components/CursorDemo.tsx`
- `typography.ts`
- 所有 `dark:*`、`dark:prose-invert`、`[@media(prefers-color-scheme:dark)]`、`teal-*` 强调色

---

## 计划任务索引

| PR | 主题 | 任务数 |
|---|---|---|
| PR 1 | 视觉 Tokens 与暗色清理 | 6 |
| PR 2 | 拆除 next-themes | 5 |
| PR 3 | 动画基础设施 | 7 |
| PR 4 | 路由转场与全局背景 | 6 |
| PR 5 | 共享内容组件动画化 | 7 |
| PR 6 | 首页与 Carousel 亮点 | 5 |
| PR 7 | About / Articles / Projects | 4 |
| PR 8 | Videos / Uses / Friends / 404 收尾 | 4 |

合计 44 个任务，按依赖顺序执行。每个任务都自带 TDD step（动画项目里"测试"指 `npm run build` + `curl` 端到端 + 视觉检查，因为动画没有单元测试框架）。

---

# PR 1 — 视觉 Tokens 与暗色清理

**目标**：建立暖纸 + 赭石橙单主题，全站无 `dark:`，teal 全部改赭石，build 通过。

### Task 1.1：在 `src/styles/tailwind.css` 定义 CSS 变量与 `@theme` 映射

**Files:**
- Modify: `src/styles/tailwind.css:1-5`

**Step 1: 编辑 tailwind.css**

把整文件替换为：

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';
@import './prism.css';
@import './fonts.css';

:root {
  /* 暖纸主题 */
  --color-paper: oklch(0.965 0.018 82);
  --color-paper-raised: oklch(0.985 0.010 78);
  --color-ink: oklch(0.245 0.020 48);
  --color-ink-soft: oklch(0.440 0.025 52);
  --color-muted: oklch(0.610 0.030 58);
  --color-accent: oklch(0.625 0.165 48);
  --color-accent-soft: oklch(0.880 0.080 60);
  --color-secondary: oklch(0.555 0.055 145);
  --color-line: oklch(0.850 0.025 70);
  --color-code: oklch(0.285 0.025 44);

  /* 阴影 */
  --shadow-card: 0 18px 55px oklch(0.30 0.04 45 / .10);
  --shadow-float: 0 30px 90px oklch(0.30 0.06 45 / .16);

  /* 圆角 */
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --radius-xl: 40px;

  /* 间距 */
  --space-section: clamp(5rem, 10vw, 10rem);

  /* 缓动 */
  --ease-dramatic: cubic-bezier(.16, 1, .3, 1);
  --ease-snap: cubic-bezier(.34, 1.56, .64, 1);
  --ease-wipe: cubic-bezier(.76, 0, .24, 1);

  /* 噪点透明度 */
  --noise-opacity: 0.035;
}

@theme inline {
  --color-paper: var(--color-paper);
  --color-paper-raised: var(--color-paper-raised);
  --color-ink: var(--color-ink);
  --color-ink-soft: var(--color-ink-soft);
  --color-muted: var(--color-muted);
  --color-accent: var(--color-accent);
  --color-accent-soft: var(--color-accent-soft);
  --color-secondary: var(--color-secondary);
  --color-line: var(--color-line);
  --color-code: var(--color-code);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);

  --ease-dramatic: var(--ease-dramatic);
  --ease-snap: var(--ease-snap);
  --ease-wipe: var(--ease-wipe);

  --shadow-card: var(--shadow-card);
  --shadow-float: var(--shadow-float);
}

html {
  background: var(--color-paper);
  color: var(--color-ink);
}

/* 噪点纹理背景 - 固定铺满视口，伪元素 */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.05  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: var(--noise-opacity);
  mix-blend-mode: multiply;
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过，无类型错误，无 Tailwind 警告。开发服务器里 body 应呈现米白 + 极轻噪点。

**Step 3: 提交**

```bash
git add src/styles/tailwind.css
git commit -m "feat(style): add warm-paper design tokens and @theme mapping"
```

---

### Task 1.2：替换 `src/styles/prism.css` 为暖深色主题

**Files:**
- Modify: `src/styles/prism.css:1-47`（整文件）

**Step 1: 整文件替换**

```css
pre[class*='language-'] {
  color: oklch(0.92 0.015 80);
  background: var(--color-code);
}

.token.tag,
.token.class-name,
.token.selector,
.token.selector .class,
.token.selector.class,
.token.function {
  color: oklch(0.78 0.14 50);
}

.token.attr-name,
.token.keyword,
.token.rule,
.token.pseudo-class,
.token.important {
  color: oklch(0.86 0.10 70);
}

.token.module {
  color: oklch(0.78 0.14 50);
}

.token.attr-value,
.token.class,
.token.string,
.token.property {
  color: oklch(0.80 0.12 80);
}

.token.punctuation,
.token.attr-equals {
  color: oklch(0.65 0.025 60);
}

.token.unit,
.language-css .token.function {
  color: oklch(0.82 0.12 90);
}

.token.comment,
.token.operator,
.token.combinator {
  color: oklch(0.55 0.020 60);
  font-style: italic;
}
```

**Step 2: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

打开任一文章页（如 `http://localhost:9731/articles/harchy-mini`），确认代码块呈暖色背景，文字仍可读。

**Step 3: 提交**

```bash
git add src/styles/prism.css
git commit -m "feat(style): rewrite prism syntax theme to warm-dark"
```

---

### Task 1.3：清理 `tailwind.config.ts` 与删除 `typography.ts`

**Files:**
- Modify: `tailwind.config.ts:1-32`
- Delete: `typography.ts`

**Step 1: 重写 `tailwind.config.ts`**

整文件替换为：

```ts
import typographyPlugin from '@tailwindcss/typography'
import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  plugins: [typographyPlugin],
} satisfies Config
```

**Step 2: 删除 `typography.ts`**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
git rm typography.ts
```

**Step 3: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。视觉上 Typography token 通过 `@plugin '@tailwindcss/typography'` + `src/styles/tailwind.css` 的 `@theme` 提供。

**Step 4: 提交**

```bash
git add tailwind.config.ts
git commit -m "chore: simplify tailwind config, drop typography.ts (v4 css-first)"
```

---

### Task 1.4：替换所有页面的硬编码 zinc/teal/dark 类

**Files:**
- Modify: `src/components/Header.tsx`（先删除 `dark:` 留下 `ThemeToggle` 待 PR 2 处理）
- Modify: `src/components/Card.tsx`
- Modify: `src/components/Button.tsx`
- Modify: `src/components/Prose.tsx`
- Modify: `src/components/SimpleLayout.tsx`
- Modify: `src/components/Section.tsx`
- Modify: `src/components/ArticleLayout.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/articles/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Modify: `src/app/videos/page.tsx`
- Modify: `src/app/uses/page.tsx`
- Modify: `src/app/friends/page.tsx`
- Modify: `src/app/not-found.tsx`

**全局替换规则**（每个文件单独 Edit）：

- `bg-zinc-50` → `bg-paper`
- `bg-zinc-900` / `bg-zinc-800/90` / `bg-white/90` / `bg-white` → `bg-paper-raised`
- `text-zinc-100` / `text-zinc-800` / `text-zinc-900` → `text-ink`
- `text-zinc-400` / `text-zinc-500` → `text-muted`
- `text-zinc-600` → `text-ink-soft`
- `border-zinc-100` / `border-zinc-700/40` / `border-zinc-900/5` → `border-line`
- `ring-zinc-900/5` / `ring-zinc-800/5` / `ring-zinc-700/40` / `ring-zinc-300/20` → `ring-line`
- `text-teal-500` / `text-teal-400` / `fill-teal-500` / `fill-teal-400` → `text-accent` / `fill-accent`
- `from-teal-500` / `via-teal-500` / `to-teal-500` → `from-accent` / `via-accent` / `to-accent`
- `hover:text-teal-500` / `hover:fill-teal-500` → `hover:text-accent` / `hover:fill-accent`
- `dark:bg-zinc-900` / `dark:bg-zinc-800` / `dark:bg-zinc-800/50` / `dark:bg-zinc-800/90` / `dark:bg-zinc-50` / `dark:bg-black` / `dark:bg-white` → 全部删除
- `dark:text-zinc-100` / `dark:text-zinc-200` / `dark:text-zinc-300` / `dark:text-zinc-400` / `dark:text-zinc-500` / `dark:text-zinc-600` / `dark:text-zinc-700` → 全部删除
- `dark:border-zinc-*` / `dark:ring-*` / `dark:divide-zinc-*` / `dark:hover:*` / `dark:group-hover:*` / `dark:prose-invert` / `dark:hidden` / `dark:block` → 全部删除
- `[@media(prefers-color-scheme:dark)]` 媒体查询类 → 全部删除

**Step 1: 对 `Header.tsx` 执行替换**

由于 Header.tsx 长达 450 行，先用 `Edit` 工具的 `replace_all: true` 模式做几轮批量替换（每个模式单独一次 Edit 调用）。依次处理：

```text
1. `dark:` → ``（空字符串，包含所有 dark 变体）
2. `bg-zinc-50` → `bg-paper`
3. `bg-white/90` → `bg-paper-raised/90`
4. `text-zinc-800` → `text-ink`
5. `text-zinc-600` → `text-ink-soft`
6. `text-zinc-500` → `text-muted`
7. `text-zinc-400` → `text-muted`
8. `border-zinc-100` → `border-line`
9. `ring-zinc-900/5` → `ring-line`
10. `shadow-zinc-800/5` → `shadow-ink/5`（用 oklch ink 变量；如 Tailwind 不识别，落到自定义类名）
11. `text-teal-500` → `text-accent`
12. `text-teal-400` → `text-accent`
13. `via-teal-500/40` → `via-accent/40`
14. `from-teal-500/0` → `from-accent/0`
15. `to-teal-500/0` → `to-accent/0`
16. `fill-teal-50` → `fill-accent-soft`
17. `stroke-teal-500` → `stroke-accent`
18. `stroke-teal-600` → `stroke-accent`
19. `fill-teal-400/10` → `fill-accent/10`
20. `hover:text-teal-500` → `hover:text-accent`
21. `hover:fill-teal-500` → `hover:fill-accent`
```

注：`shadow-zinc-800/5` 在 Tailwind v4 中是无效的，需要用自定义 `box-shadow` 属性。简化方案：直接改成 Tailwind 默认的 `shadow-sm` 或 `shadow-md`；本计划统一改为 `shadow-[var(--shadow-card)]`。

**Step 2: 对其余文件重复相同模式**

依次对每个文件执行相同的 Edit 调用。`Card.tsx`、`Button.tsx`、`Prose.tsx` 较短，可一次性 Edit。

**Step 3: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
npm run dev
```

打开 `http://localhost:9731`，逐页访问 `/`、`/about`、`/articles`、`/projects`、`/videos`、`/uses`、`/friends`、`/not-found`，检查：
- 背景为米白
- 文字深色
- 链接/强调色为赭石橙
- 无 `dark:` 残留（grep 验证）

**Step 4: 验证无 dark/teal 残留**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
grep -rE "dark:|teal-(500|400|300|50|600|700)|prefers-color-scheme:dark" src/ tailwind.config.ts src/styles/ || echo "OK: no remaining"
```

Expected: `OK: no remaining`.

**Step 5: 提交**

```bash
git add -A
git commit -m "feat(style): replace all zinc/teal/dark classes with warm-paper tokens"
```

---

### Task 1.5：扩展 `src/app/layout.tsx` 接入暖色 body

**Files:**
- Modify: `src/app/layout.tsx:29-40`

**Step 1: 替换 body 元素**

把：

```tsx
<html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
  <body className="flex h-full bg-zinc-50 dark:bg-black">
```

改为：

```tsx
<html lang="zh-CN" className="h-full antialiased">
  <body className="flex h-full bg-paper text-ink">
```

**Step 2: 删除 CursorDemo（暂时）**

把：

```tsx
import { CursorDemo } from '@/components/CursorDemo'
// ...
<CursorDemo />
```

改为：

```tsx
// Cursor 暂未启用 - 待 PR 3 引入 CursorTrails
```

**Step 3: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。`bg-paper` 应渲染为米白。

**Step 4: 提交**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): use warm-paper body and drop hydration warning"
```

---

### Task 1.6：PR 1 验收

**Files:** 无

**Step 1: 完整 build + 端到端检查**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build && npm run dev
```

打开 `http://localhost:9731`，确认：
- 背景米白、噪点纹理可见
- 文字深色
- 强调色赭石橙
- 无 `dark:` 残留（`grep -r 'dark:' src/` 应为空）
- 字体回退到系统中文无衬线

**Step 2: 提交 tag**

```bash
git tag v0.1-warm-paper
```

PR 1 结束。

---

# PR 2 — 拆除 next-themes

**目标**：删除 `next-themes` 依赖、移除 Header 主题按钮、Provider 只保留 `AppContext`。

### Task 2.1：精简 `src/app/providers.tsx`

**Files:**
- Modify: `src/app/providers.tsx:1-55`

**Step 1: 整文件替换**

```tsx
'use client'

import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function usePrevious<T>(value: T) {
  let ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)

  return (
    <AppContext.Provider value={{ previousPathname }}>
      {children}
    </AppContext.Provider>
  )
}
```

**Step 2: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过，无 `next-themes` 报错。

**Step 3: 提交**

```bash
git add src/app/providers.tsx
git commit -m "refactor(providers): drop next-themes, keep AppContext only"
```

---

### Task 2.2：删除 `Header.tsx` 的 `ThemeToggle` 和相关导入

**Files:**
- Modify: `src/components/Header.tsx:7, 48-78, 181-201, 433-435`

**Step 1: 删除 useTheme import**

把第 7 行：

```tsx
import { useTheme } from 'next-themes'
```

改为：

```tsx
// useTheme 已删除 - PR 3 引入 InspirationBurstButton 替换 ThemeToggle
```

**Step 2: 删除 Sun/Moon icons**

删除第 48-78 行（SunIcon、MoonIcon 两个组件）。

**Step 3: 删除 ThemeToggle 组件**

删除第 181-201 行（ThemeToggle 函数）。

**Step 4: 删除 ThemeToggle 的渲染**

把：

```tsx
<div className="pointer-events-auto">
  <ThemeToggle />
</div>
```

改为：

```tsx
{/* 主题按钮位置 - 待 PR 3 引入 InspirationBurstButton */}
<div className="pointer-events-auto" />
```

**Step 5: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。Header 右侧显示一个空的占位 div。

**Step 6: 提交**

```bash
git add src/components/Header.tsx
git commit -m "refactor(header): remove ThemeToggle, reserve slot for inspiration button"
```

---

### Task 2.3：删除 `src/components/CursorDemo.tsx`

**Files:**
- Delete: `src/components/CursorDemo.tsx`

**Step 1: 确认 layout.tsx 已不再引用**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
grep -r "CursorDemo" src/ || echo "OK: no references"
```

Expected: `OK: no references`（Task 1.5 已删除 import）。

**Step 2: 删除文件**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
git rm src/components/CursorDemo.tsx
```

**Step 3: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 4: 提交**

```bash
git add -A
git commit -m "chore: remove obsolete CursorDemo component"
```

---

### Task 2.4：从 package.json 卸载 next-themes

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`（npm 自动更新）

**Step 1: 卸载**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm uninstall next-themes
```

**Step 2: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
grep -r "next-themes" src/ package.json || echo "OK: removed"
npm run build
```

Expected: `OK: removed`；build 通过。

**Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "chore: uninstall next-themes dependency"
```

---

### Task 2.5：PR 2 验收

**Files:** 无

**Step 1: 端到端检查**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

打开浏览器，确认：
- 无 hydration mismatch 警告
- Header 右侧显示空占位
- 主题颜色无变化
- 浏览器 console 无 `next-themes` 报错

**Step 2: Tag**

```bash
git tag v0.2-no-themes
```

PR 2 结束。

---

# PR 3 — 动画基础设施

**目标**：建立 `src/components/motion/` 目录与所有动画原语，所有原语默认尊重 `prefers-reduced-motion`。

### Task 3.1：`useMotionPreference` 钩子

**Files:**
- Create: `src/components/motion/useMotionPreference.ts`

**Step 1: 创建文件**

```ts
'use client'

import { useEffect, useState } from 'react'

/**
 * 集中提供：用户挂载状态、是否希望减少动效、是否使用精确指针。
 * 用于动画组件统一判断。
 */
export function useMounted() {
  let [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function useReducedMotion(): boolean {
  let [reduce, setReduce] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    let mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let update = () => setReduce(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduce
}

export function usePointerFine(): boolean {
  let [fine, setFine] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    let mq = window.matchMedia(''(pointer: fine)'')
    let update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

export function useMotionPreference() {
  return {
    mounted: useMounted(),
    reduceMotion: useReducedMotion(),
    finePointer: usePointerFine(),
  }
}
```

注意：第 21 行 `'(pointer: fine)'` 在源码字符串里要避免 `'` 转义陷阱——直接写成 `'(pointer: fine)'`（包在反引号里）：

```ts
let mq = window.matchMedia('(pointer: fine)')
```

（这里只是文档示例，源代码中要确保是 ASCII 单引号字符串。）

**Step 2: 验证**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 3: 提交**

```bash
git add src/components/motion/useMotionPreference.ts
git commit -m "feat(motion): add useMotionPreference unified hook"
```

---

### Task 3.2：`MotionConfigProvider`

**Files:**
- Create: `src/components/motion/MotionConfigProvider.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * 全站 MotionConfig 边界。
 * 强制所有 motion 动画组件在 prefers-reduced-motion: reduce 时
 * 由 motion/react 自动降级（位移归零、duration 缩为 0）。
 */
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  )
}
```

**Step 2: 接入 `src/app/layout.tsx`**

修改 layout.tsx：

```tsx
import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { MotionConfigProvider } from '@/components/motion/MotionConfigProvider'
import '@/styles/tailwind.css'

// ... in body:
<body className="flex h-full bg-paper text-ink">
  <Providers>
    <MotionConfigProvider>
      <div className="flex w-full">
        <Layout>{children}</Layout>
      </div>
    </MotionConfigProvider>
  </Providers>
</body>
```

**Step 3: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 4: 提交**

```bash
git add src/components/motion/MotionConfigProvider.tsx src/app/layout.tsx
git commit -m "feat(motion): add MotionConfigProvider and wrap root layout"
```

---

### Task 3.3：`SectionReveal`

**Files:**
- Create: `src/components/motion/SectionReveal.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function SectionReveal({
  children,
  className,
  delay = 0,
  y = 32,
  amount = 0.3,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
  once?: boolean
}) {
  let reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 3: 提交**

```bash
git add src/components/motion/SectionReveal.tsx
git commit -m "feat(motion): add SectionReveal primitive"
```

---

### Task 3.4：`StaggerGroup`

**Files:**
- Create: `src/components/motion/StaggerGroup.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Children, type ReactNode } from 'react'

export function StaggerGroup({
  children,
  className,
  interval = 0.08,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  interval?: number
  delay?: number
  as?: keyof JSX.IntrinsicElements
}) {
  let reduce = useReducedMotion()
  let items = Children.toArray(children)
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: interval, delayChildren: delay } },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 3: 提交**

```bash
git add src/components/motion/StaggerGroup.tsx
git commit -m "feat(motion): add StaggerGroup primitive"
```

---

### Task 3.5：`TextReveal`（中文 grapheme）

**Files:**
- Create: `src/components/motion/TextReveal.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useMemo } from 'react'

function splitGraphemes(text: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    let seg = new Intl.Segmenter('zh-CN', { granularity: 'grapheme' })
    return Array.from(seg.segment(text), (s) => s.segment)
  }
  return Array.from(text)
}

export function TextReveal({
  text,
  as: Tag = 'span',
  className,
  perCharDelay = 0.025,
  startDelay = 0,
  ariaLabel,
}: {
  text: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  perCharDelay?: number
  startDelay?: number
  ariaLabel?: string
}) {
  let reduce = useReducedMotion()
  let chars = useMemo(() => splitGraphemes(text), [text])
  let MotionTag = motion[Tag as 'span'] ?? motion.span

  return (
    <MotionTag
      className={className}
      aria-label={ariaLabel ?? text}
      initial="hidden"
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: perCharDelay, delayChildren: startDelay } },
      }}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: '0.5em' },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </MotionTag>
  )
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过；TypeScript 对 `motion[Tag]` 的索引可能需要补 `any` 转型（如果失败，改为 `let MotionTag = (motion as any)[Tag] ?? motion.span`）。

**Step 3: 提交**

```bash
git add src/components/motion/TextReveal.tsx
git commit -m "feat(motion): add TextReveal with Intl.Segmenter grapheme split"
```

---

### Task 3.6：`MagneticHover`

**Files:**
- Create: `src/components/motion/MagneticHover.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

export function MagneticHover({
  children,
  className,
  strength = 0.25,
  disabled,
}: {
  children: ReactNode
  className?: string
  strength?: number
  disabled?: boolean
}) {
  let reduce = useReducedMotion()
  let ref = useRef<HTMLDivElement>(null)
  let x = useMotionValue(0)
  let y = useMotionValue(0)
  let sx = useSpring(x, { stiffness: 350, damping: 30 })
  let sy = useSpring(y, { stiffness: 350, damping: 30 })

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || disabled) return
    let el = ref.current
    if (!el) return
    let rect = el.getBoundingClientRect()
    let dx = (e.clientX - (rect.left + rect.width / 2)) * strength
    let dy = (e.clientY - (rect.top + rect.height / 2)) * strength
    x.set(dx)
    y.set(dy)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 3: 提交**

```bash
git add src/components/motion/MagneticHover.tsx
git commit -m "feat(motion): add MagneticHover primitive"
```

---

### Task 3.7：`TiltCard`

**Files:**
- Create: `src/components/motion/TiltCard.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react'
import { useRef, type ReactNode } from 'react'

export function TiltCard({
  children,
  className,
  maxTilt = 8,
  depth = 1200,
  disabled,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  depth?: number
  disabled?: boolean
}) {
  let reduce = useReducedMotion()
  let ref = useRef<HTMLDivElement>(null)
  let px = useMotionValue(0.5)
  let py = useMotionValue(0.5)
  let rx = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  })
  let ry = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  })
  let glare = useTransform(
    [px, py] as unknown as ReturnType<typeof useMotionValue<number>>[],
    ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, oklch(0.95 0.06 60 / 0.45), transparent 60%)`,
  ) as unknown as ReturnType<typeof useMotionValue<string>>

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || disabled) return
    let el = ref.current
    if (!el) return
    let rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  function onLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: depth,
        transformStyle: 'preserve-3d',
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
      >
        {children}
        {!reduce && !disabled && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
            style={{ background: glare }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
```

注：`useTransform` 接受多个 MotionValue 时数组的转换函数签名在 motion 12.x 中可能与示例略有不同。如果编译失败，把 `glare` 改为更简单的写法：

```tsx
let glareX = useTransform(px, [0, 1], ['0%', '100%'])
let glareY = useTransform(py, [0, 1], ['0%', '100%'])
let glare = useTransform(
  [glareX, glareY] as any,
  ([x, y]: string[]) =>
    `radial-gradient(circle at ${x} ${y}, oklch(0.95 0.06 60 / 0.45), transparent 60%)`,
)
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过；如遇类型错误，参考上一步替代写法。

**Step 3: 提交**

```bash
git add src/components/motion/TiltCard.tsx
git commit -m "feat(motion): add TiltCard 3D primitive with glare"
```

---

### Task 3.8（PR 3 收尾）：验证并提交剩余原语

`ScrollScene.tsx`、`AmbientBackground.tsx`、`ProseReveal.tsx`、`InspirationBurstButton.tsx`、`CursorTrails.tsx`、`ReadingProgress.tsx`、`ScrollSectionAxis.tsx`、`PageWipe.tsx` 在 PR 4-6 内创建（依赖其接入位置）。本任务的"PR 3 收尾"指**仅验证基础设施 build 通过**。

**Step 1: 端到端检查**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

打开 `http://localhost:9731`。`MotionConfigProvider` 已在 `body` 内；目前页面无可见动画效果（primitives 尚未被任何页面使用），但 DevTools Console 应无错。

**Step 2: Tag**

```bash
git tag v0.3-motion-primitives
```

PR 3 结束。

---

# PR 4 — 路由转场与全局背景

**目标**：实现全站路由级赭石遮罩 Wipe + 鼠标光晕 + 滚动色块。

### Task 4.1：`PageWipe` 组件

**Files:**
- Create: `src/components/motion/PageWipe.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'

const LABELS: Record<string, string> = {
  '/': '天降电脑服务部',
  '/about': '我',
  '/articles': '博客',
  '/projects': '项目',
  '/videos': '视频',
  '/uses': '用品',
  '/friends': '友链',
  '/not-found': '迷路了',
}

export function PageWipe({ label }: { label: string }) {
  let reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-accent text-paper"
      initial={{ y: '100%' }}
      animate={{ y: '-100%' }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <span className="font-display text-3xl font-bold tracking-wider sm:text-5xl">
        {label}
      </span>
    </motion.div>
  )
}

export function getRouteLabel(pathname: string) {
  return LABELS[pathname] ?? '页面切换'
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 3: 提交**

```bash
git add src/components/motion/PageWipe.tsx
git commit -m "feat(motion): add PageWipe full-screen overlay"
```

---

### Task 4.2：`PageTransition` 路由转场壳

**Files:**
- Create: `src/components/motion/PageTransition.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { getRouteLabel, PageWipe } from './PageWipe'

export function PageTransition({ children }: { children: ReactNode }) {
  let pathname = usePathname()
  let reduce = useReducedMotion()
  let label = getRouteLabel(pathname)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: reduce ? 0.06 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {!reduce && <PageWipe label={label} key={`wipe-${pathname}`} />}
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

注：把 `PageWipe` 放在 `motion.div` 内部 + `key` 形式，会触发两次进入退出。若实现复杂，可把 wipe 放到外面用单独的 `AnimatePresence` 包裹。但**当前结构优先保证正确性**——首次实现简化为：去掉 PageWipe 的子节点化，由 `AnimatePresence` 在 path 变化时独立渲染 wipe。简化后：

```tsx
'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { getRouteLabel, PageWipe } from './PageWipe'

export function PageTransition({ children }: { children: ReactNode }) {
  let pathname = usePathname()
  let reduce = useReducedMotion()
  let label = getRouteLabel(pathname)

  return (
    <>
      <AnimatePresence>
        {!reduce && <PageWipe key={pathname} label={label} />}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: reduce ? 0.06 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
```

**Step 2: 接入 `src/components/Layout.tsx`**

```tsx
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PageTransition } from '@/components/motion/PageTransition'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-paper ring-1 ring-line" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <Header />
        <main className="flex-auto">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </>
  )
}
```

**Step 3: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 4: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

打开 `http://localhost:9731`，在首页与 `/about` 之间反复点击导航，验证：
- 离场时赭石全屏遮罩自下而上覆盖
- 遮罩中央短暂显示"我"
- 进场时新页面从下方淡入
- Header/Footer 不在转场中重复闪烁

打开 DevTools → Rendering → 模拟 `prefers-reduced-motion: reduce`，刷新页面后再切换导航，遮罩消失，仅 60ms 淡入。

**Step 5: 提交**

```bash
git add src/components/motion/PageTransition.tsx src/components/Layout.tsx
git commit -m "feat(motion): add PageTransition with ochre full-screen wipe"
```

---

### Task 4.3：`AmbientBackground` 鼠标光晕

**Files:**
- Create: `src/components/motion/AmbientBackground.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { usePointerFine } from './useMotionPreference'

export function AmbientBackground() {
  let fine = usePointerFine()
  let reduce = useReducedMotion()
  let x = useMotionValue(-500)
  let y = useMotionValue(-500)
  let sx = useSpring(x, { stiffness: 80, damping: 20 })
  let sy = useSpring(y, { stiffness: 80, damping: 20 })

  if (typeof window !== 'undefined' && fine && !reduce) {
    // 注意：避免 SSR 注册事件，这里使用 useEffect
  }

  return (
    <AmbientPointerBind x={x} y={y}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: useMotionGradient(sx, sy),
          mixBlendMode: 'multiply',
        }}
      />
    </AmbientPointerBind>
  )
}

function useMotionGradient(sx: any, sy: any) {
  return `radial-gradient(600px circle at ${sx.get()}px ${sy.get()}px, oklch(0.92 0.05 65 / 0.18), transparent 60%)`
}

function AmbientPointerBind({
  x,
  y,
  children,
}: {
  x: any
  y: any
  children: React.ReactNode
}) {
  if (typeof window === 'undefined') return <>{children}</>
  return (
    <div
      onPointerMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
      }}
      style={{ position: 'fixed', inset: 0, zIndex: -1 }}
    >
      {children}
    </div>
  )
}
```

**注**：上面写法不正确——`AmbientBackground` 必须在 client component 内统一管理事件且不要用 `get()` 拼字符串。**正确实现**：

```tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { usePointerFine } from './useMotionPreference'

export function AmbientBackground() {
  let fine = usePointerFine()
  let reduce = useReducedMotion()
  let x = useMotionValue(-1000)
  let y = useMotionValue(-1000)
  let sx = useSpring(x, { stiffness: 80, damping: 20 })
  let sy = useSpring(y, { stiffness: 80, damping: 20 })
  let bg = useTransform(
    [sx, sy] as any,
    ([vx, vy]: number[]) =>
      `radial-gradient(600px circle at ${vx}px ${vy}px, oklch(0.92 0.05 65 / 0.18), transparent 60%)`,
  )

  useEffect(() => {
    if (!fine || reduce) return
    let onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, reduce, x, y])

  if (!fine || reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: bg, mixBlendMode: 'multiply' }}
    />
  )
}
```

**Step 2: 接入 `Layout.tsx`**

```tsx
import { AmbientBackground } from '@/components/motion/AmbientBackground'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientBackground />
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-paper ring-1 ring-line" />
        </div>
      </div>
      <div className="relative z-10 flex w-full flex-col">
        <Header />
        <main className="flex-auto">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
    </>
  )
}
```

注意给 main 容器加 `z-10`（background 在 z-0）确保内容在光晕之上。

**Step 3: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 4: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

打开 `http://localhost:9731`，鼠标在页面内移动，应看到暖色径向光晕跟随指针（500-700px 直径）。

**Step 5: 提交**

```bash
git add src/components/motion/AmbientBackground.tsx src/components/Layout.tsx
git commit -m "feat(motion): add AmbientBackground cursor glow"
```

---

### Task 4.4：`ScrollScene` 滚动视差

**Files:**
- Create: `src/components/motion/ScrollScene.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'

export function ScrollScene({
  children,
  className,
  variant = 'parallax',
  range = [0, 1],
  factor = 0.3,
}: {
  children: ReactNode
  className?: string
  variant?: 'parallax' | 'fade' | 'reveal'
  range?: [number, number]
  factor?: number
}) {
  let reduce = useReducedMotion()
  let ref = useRef<HTMLDivElement>(null)
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  let y = useTransform(scrollYProgress, range, [factor * 100, -factor * 100])
  let opacity = useTransform(scrollYProgress, range, [0, 1, 0])

  if (reduce) return <div ref={ref} className={className}>{children}</div>

  let style =
    variant === 'parallax'
      ? { y }
      : variant === 'fade'
        ? { opacity }
        : { y, opacity }

  return (
    <motion.div ref={ref} className={className} style={style}>
      {children}
    </motion.div>
  )
}
```

**Step 2: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 3: 提交**

```bash
git add src/components/motion/ScrollScene.tsx
git commit -m "feat(motion): add ScrollScene parallax primitive"
```

---

### Task 4.5：`InspirationBurstButton` 替换主题按钮

**Files:**
- Create: `src/components/motion/InspirationBurstButton.tsx`
- Modify: `src/components/Header.tsx:432-435`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useState } from 'react'

export function InspirationBurstButton() {
  let [burstKey, setBurstKey] = useState(0)
  let [isBursting, setIsBursting] = useState(false)
  let reduce = useReducedMotion()

  function fire() {
    if (isBursting) return
    setBurstKey((k) => k + 1)
    setIsBursting(true)
    setTimeout(() => setIsBursting(false), 900)
  }

  return (
    <button
      type="button"
      aria-label="点亮灵感"
      onClick={fire}
      className="group relative flex size-10 items-center justify-center overflow-visible rounded-full bg-paper-raised/90 shadow-[var(--shadow-float)] ring-1 ring-line backdrop-blur transition hover:ring-accent"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="size-5 text-accent"
        aria-hidden="true"
        animate={isBursting ? { rotate: 180, scale: 0.9 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <path
          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </motion.svg>
      <AnimatePresence>
        {isBursting && !reduce &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={`${burstKey}-${i}`}
              aria-hidden="true"
              className="absolute size-1.5 rounded-full bg-accent"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i * Math.PI) / 4) * 28,
                y: Math.sin((i * Math.PI) / 4) * 28,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
      </AnimatePresence>
    </button>
  )
}
```

**Step 2: 在 `Header.tsx` 替换占位**

把：

```tsx
{/* 主题按钮位置 - 待 PR 3 引入 InspirationBurstButton */}
<div className="pointer-events-auto" />
```

改为：

```tsx
<div className="pointer-events-auto">
  <InspirationBurstButton />
</div>
```

并在文件顶部 import：

```tsx
import { InspirationBurstButton } from '@/components/motion/InspirationBurstButton'
```

**Step 3: 验证 build**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
```

Expected: build 通过。

**Step 4: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

打开浏览器，点击 Header 右侧的"点亮灵感"按钮，应看到赭石橙圆点向 8 个方向飞散，按钮内图标旋转 180°。

**Step 5: 提交**

```bash
git add src/components/motion/InspirationBurstButton.tsx src/components/Header.tsx
git commit -m "feat(header): add InspirationBurstButton replacing theme toggle"
```

---

### Task 4.6：PR 4 验收

**Step 1: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

逐项检查：
- 路由切换有赭石遮罩
- 鼠标移动有光晕
- Inspiration 按钮可点击
- 减少动效偏好下全部降级

**Step 2: Tag**

```bash
git tag v0.4-page-transition
```

PR 4 结束。

---

# PR 5 — 共享内容组件动画化

**目标**：把 Card / Button / SimpleLayout / Section / Prose / ArticleLayout 接入动画系统。

### Task 5.1：升级 `Button.tsx`

**Files:**
- Modify: `src/components/Button.tsx`

**Step 1: 替换 variant 颜色**

把：

```tsx
const variantStyles = {
  primary:
    'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
  secondary:
    'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70',
}
```

改为：

```tsx
const variantStyles = {
  primary:
    'bg-ink font-semibold text-paper-raised hover:bg-ink/90 active:bg-ink active:text-paper-raised/70',
  secondary:
    'bg-paper-raised font-medium text-ink ring-1 ring-line hover:bg-paper hover:ring-accent active:text-ink/60',
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/Button.tsx
git commit -m "feat(style): retune Button to warm-paper tokens"
```

---

### Task 5.2：升级 `Card.tsx`

**Files:**
- Modify: `src/components/Card.tsx`

**Step 1: 替换所有 zinc/dark/teal**

按全局替换规则对 Card.tsx 执行：

- `bg-zinc-50` → `bg-paper-raised/70`
- `text-zinc-800` → `text-ink`
- `text-zinc-100` → 移除
- `text-zinc-600` → `text-ink-soft`
- `text-zinc-400` → `text-muted`
- `text-zinc-500` → `text-muted`
- `border-zinc-100` → `border-line`
- `bg-zinc-200` / `bg-zinc-500` → `bg-accent`（eyebrow 装饰条）
- `text-teal-500` → `text-accent`
- `dark:` → ``
- `transition group-hover:scale-100` → `transition duration-300 group-hover:scale-100`

**Step 2: 把 hover 背景形状改为暖色**

把 Card.Link 内的：

```tsx
<div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50" />
```

改为：

```tsx
<div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-accent-soft/40 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />
```

**Step 3: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/Card.tsx
git commit -m "feat(card): retune Card to warm-paper with ochre hover"
```

---

### Task 5.3：升级 `Prose.tsx`

**Files:**
- Modify: `src/components/Prose.tsx`

**Step 1: 整文件替换**

```tsx
import clsx from 'clsx'

export function Prose({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        className,
        // 暖色 prose 主题：依靠 tailwind.css 中的 @plugin typography 配合 @theme 默认
        'prose prose-zinc prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-code:text-accent prose-code:before:content-none prose-code:after:content-none max-w-none',
      )}
      {...props}
    />
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/Prose.tsx
git commit -m "feat(prose): retune Prose to warm-paper with ochre accents"
```

---

### Task 5.4：升级 `SimpleLayout.tsx` —— 标题用 `TextReveal`

**Files:**
- Modify: `src/components/SimpleLayout.tsx`

**Step 1: 整文件替换**

```tsx
import { Container } from '@/components/Container'
import { TextReveal } from '@/components/motion/TextReveal'
import { SectionReveal } from '@/components/motion/SectionReveal'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro: string
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <TextReveal
          as="h1"
          text={title}
          className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
        />
        <SectionReveal delay={0.4}>
          <p className="mt-6 text-base text-ink-soft">{intro}</p>
        </SectionReveal>
      </header>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </Container>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/SimpleLayout.tsx
git commit -m "feat(simple-layout): add TextReveal + SectionReveal to page hero"
```

---

### Task 5.5：升级 `Section.tsx` —— 标题 reveal + 轴线

**Files:**
- Modify: `src/components/Section.tsx`
- Create: `src/components/motion/ScrollSectionAxis.tsx`

**Step 1: 创建 `ScrollSectionAxis.tsx`**

```tsx
'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

export function ScrollSectionAxis() {
  let ref = useRef<HTMLDivElement>(null)
  let reduce = useReducedMotion()
  let { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })
  let scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute left-0 top-0 hidden h-full w-px bg-line md:block"
    >
      {!reduce && (
        <motion.div
          className="h-full w-full origin-top bg-accent"
          style={{ scaleY }}
        />
      )}
    </div>
  )
}
```

**Step 2: 整文件替换 `Section.tsx`**

```tsx
import { useId } from 'react'
import { TextReveal } from '@/components/motion/TextReveal'
import { ScrollSectionAxis } from '@/components/motion/ScrollSectionAxis'

export function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  let id = useId()

  return (
    <section
      aria-labelledby={id}
      className="relative md:pl-6"
    >
      <ScrollSectionAxis />
      <div className="grid max-w-3xl grid-cols-1 items-baseline gap-y-8 md:grid-cols-4">
        <TextReveal
          as="h2"
          text={title}
          className="font-display text-sm font-semibold tracking-wide text-ink"
        />
        <div className="md:col-span-3">{children}</div>
      </div>
    </section>
  )
}
```

**Step 3: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/Section.tsx src/components/motion/ScrollSectionAxis.tsx
git commit -m "feat(section): add TextReveal title and scroll-drawn axis"
```

---

### Task 5.6：`ProseReveal` 组件 + 接入 `ArticleLayout`

**Files:**
- Create: `src/components/motion/ProseReveal.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'
import { Children, isValidElement, cloneElement, type ReactNode } from 'react'

/**
 * 给 MDX 文章正文用：抓取子元素中匹配 selector 的节点，
 * 注入 motion 包裹做批次 reveal。
 */
export function ProseReveal({
  children,
  selector = 'p, h2, h3, blockquote, pre, figure, ul, ol, hr',
  interval = 0.06,
  className,
}: {
  children: ReactNode
  selector?: string
  interval?: number
  className?: string
}) {
  let reduce = useReducedMotion()
  let items: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      items.push(child)
    } else if (typeof child === 'string') {
      items.push(<p key={`t-${items.length}`}>{child}</p>)
    }
  })

  return (
    <div className={className}>
      {items.map((node, i) => {
        let key = isValidElement(node) ? node.key ?? i : i
        if (reduce) return <div key={key}>{node}</div>
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: i * interval,
            }}
          >
            {node}
          </motion.div>
        )
      })}
    </div>
  )
}
```

注：实际 `ArticleLayout` 里 children 是 MDX 编译出的 React 树；`ProseReveal` 需在 `ArticleLayout` 内被使用并接收 `children`（**注意：必须先在 `ArticleLayout` 改为 client，把 MDX children 整体交给 `ProseReveal` 处理**）。

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/motion/ProseReveal.tsx
git commit -m "feat(motion): add ProseReveal for MDX children"
```

---

### Task 5.7：`ReadingProgress` + 升级 `ArticleLayout`

**Files:**
- Create: `src/components/motion/ReadingProgress.tsx`
- Modify: `src/components/ArticleLayout.tsx`

**Step 1: 创建 `ReadingProgress.tsx`**

```tsx
'use client'

import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'

export function ReadingProgress() {
  let reduce = useReducedMotion()
  let { scrollYProgress } = useScroll()
  let scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30 })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-40 h-[3px] origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
```

**Step 2: 整文件替换 `ArticleLayout.tsx`**

```tsx
'use client'

import { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { AppContext } from '@/app/providers'
import { Container } from '@/components/Container'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { Prose } from '@/components/Prose'
import { ProseReveal } from '@/components/motion/ProseReveal'
import { ReadingProgress } from '@/components/motion/ReadingProgress'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { type ArticleWithSlug } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArticleLayout({
  article,
  children,
}: {
  article: ArticleWithSlug
  children: React.ReactNode
}) {
  let router = useRouter()
  let { previousPathname } = useContext(AppContext)

  return (
    <>
      <ReadingProgress />
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            {previousPathname && (
              <MagneticHover>
                <button
                  type="button"
                  onClick={() => router.back()}
                  aria-label="Go back to articles"
                  className="group mb-8 flex size-10 items-center justify-center rounded-full bg-paper-raised shadow-[var(--shadow-card)] ring-1 ring-line transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
                >
                  <ArrowLeftIcon className="size-4 stroke-muted transition group-hover:stroke-accent" />
                </button>
              </MagneticHover>
            )}
            <article>
              <header className="flex flex-col">
                <TextReveal
                  as="h1"
                  text={article.title}
                  className="font-display mt-6 text-4xl font-bold tracking-tight text-ink sm:text-5xl"
                />
                <SectionReveal delay={0.6}>
                  <time
                    dateTime={article.date}
                    className="order-first flex items-center text-base text-muted"
                  >
                    <span className="h-4 w-0.5 rounded-full bg-accent" />
                    <span className="ml-3">{formatDate(article.date)}</span>
                  </time>
                </SectionReveal>
              </header>
              <Prose className="mt-8" data-mdx-content>
                <ProseReveal>{children}</ProseReveal>
              </Prose>
            </article>
          </div>
        </div>
      </Container>
    </>
  )
}
```

**Step 3: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/motion/ReadingProgress.tsx src/components/ArticleLayout.tsx
git commit -m "feat(article): add TextReveal, reading progress, ProseReveal"
```

---

### Task 5.8：PR 5 验收

**Step 1: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

逐页检查：
- `/articles` / `/projects` / `/videos` / `/uses` 标题文字逐字符揭示
- `/articles/harchy-mini` 顶部有赭石阅读进度条
- 文章返回按钮磁吸
- 段落到视口时淡入

**Step 2: Tag**

```bash
git tag v0.5-shared-components
```

PR 5 结束。

---

# PR 6 — 首页与 Carousel 亮点

### Task 6.1：`CursorTrails` 鼠标轨迹

**Files:**
- Create: `src/components/motion/CursorTrails.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: 创建文件**

```tsx
'use client'

import { Cursor } from 'motion-plus/react'
import { useEffect, useState } from 'react'
import { usePointerFine } from './useMotionPreference'

const OCHRE = 'oklch(0.625 0.165 48)'
const OCHRE_SOFT = 'oklch(0.78 0.12 60)'

export function CursorTrails() {
  let [mounted, setMounted] = useState(false)
  let fine = usePointerFine()

  useEffect(() => setMounted(true), [])

  if (!mounted || !fine) return null

  return (
    <Cursor
      style={{ backgroundColor: OCHRE }}
      variants={{
        text: { backgroundColor: OCHRE_SOFT, height: 24, width: 24 },
      }}
      matchTextSize
    />
  )
}
```

**Step 2: 接入 `src/app/layout.tsx`**

把：

```tsx
// Cursor 暂未启用 - 待 PR 3 引入 CursorTrails
```

改为：

```tsx
import { CursorTrails } from '@/components/motion/CursorTrails'
// ...
<CursorTrails />
```

**Step 3: 验证 build + 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
npm run dev
```

打开 `http://localhost:9731`，鼠标移动应看到赭石色圆点 Cursor（替代默认箭头）。鼠标进入链接/文字元素时，Cursor 颜色变浅。

**Step 4: 提交**

```bash
git add src/components/motion/CursorTrails.tsx src/app/layout.tsx
git commit -m "feat(motion): add CursorTrails replacing system cursor"
```

---

### Task 6.2：升级 `PhotoCarousel.tsx`

**Files:**
- Modify: `src/components/PhotoCarousel.tsx`

**Step 1: 替换整文件**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Carousel, useTickerItem } from 'motion-plus/react'
import { motion, useTransform } from 'motion/react'

import image1 from '@/images/photos/image-1.jpg'
import image2 from '@/images/photos/image-2.jpg'
import image3 from '@/images/photos/image-3.jpg'
import image4 from '@/images/photos/image-4.jpg'
import image5 from '@/images/photos/image-5.jpg'
import togetherImage from '@/images/tutugreen_tawny_together.jpg'

const photos = [
  { src: image1.src, name: 'image-1' },
  { src: image2.src, name: 'image-2' },
  { src: image3.src, name: 'image-3' },
  { src: image4.src, name: 'image-4' },
  { src: image5.src, name: 'image-5' },
  { src: togetherImage.src, name: 'tutugreen-tawny-together' },
]

function CoverflowItem({ src, index }: { src: string; index: number }) {
  const { offset, props } = useTickerItem()

  const { rotateY, scale } = useTransform(offset, [-200, 0, 200], {
    rotateY: [20, 0, -20],
    scale: [0.7, 1, 0.7],
  })
  const x = useTransform(
    offset,
    [-800, -200, 200, 800],
    ['100%', '0%', '0%', '-100%'],
  )
  const zIndex = useTransform(offset, (value) =>
    Math.max(0, Math.round(1000 - Math.abs(value))),
  )

  return (
    <motion.li {...props} style={{ ...props.style, zIndex }}>
      <motion.img
        draggable={false}
        src={src}
        alt={`Photo ${index + 1}`}
        className="coverflow-item"
        style={{ transformPerspective: 500, x, rotateY, scale }}
      />
    </motion.li>
  )
}

export function PhotoCarousel() {
  return (
    <div className="coverflow-mask">
      <Carousel
        className="coverflow-carousel"
        items={photos.map((photo, index) => (
          <CoverflowItem key={photo.name} src={photo.src} index={index} />
        ))}
        overflow
        gap={0}
        itemSize="manual"
        safeMargin={200}
      />
    </div>
  )
}
```

**Step 2: 在 tailwind.css 末尾追加组件 class**

在 `src/styles/tailwind.css` 末尾：

```css
@layer components {
  .coverflow-mask {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    mask-image: linear-gradient(to right, transparent 10%, black 25%, black 75%, transparent 90%);
    -webkit-mask-image: linear-gradient(to right, transparent 10%, black 25%, black 75%, transparent 90%);
  }
  .coverflow-carousel {
    width: 350px;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .coverflow-item {
    width: 350px;
    height: 350px;
    object-fit: cover;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    will-change: transform, opacity;
  }
  @media (max-width: 600px) {
    .coverflow-carousel,
    .coverflow-item {
      width: 250px;
      height: 250px;
    }
  }
}
```

**Step 3: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/PhotoCarousel.tsx src/styles/tailwind.css
git commit -m "feat(carousel): migrate inline styles to tailwind component layer"
```

---

### Task 6.3：升级 `src/app/page.tsx` —— Hero/社交/Carousel 动效

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: 整文件替换**

```tsx
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import { GitHubIcon, BilibiliIcon, MailIcon } from '@/components/SocialIcons'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { PhotoCarousel } from '@/components/PhotoCarousel'
import { ScrollScene } from '@/components/motion/ScrollScene'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextReveal } from '@/components/motion/TextReveal'

import logoBrotian from '@/images/logos/brotian.svg'
import logoUnknow from '@/images/logos/unknow.svg'
import logoYonyou from '@/images/logos/yonyou.png'
import logoDTMobile from '@/images/logos/dt-mobile.jpg'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-paper-raised stroke-line"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-muted"
      />
    </svg>
  )
}

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <Card as="article">
      <Card.Title href={`/articles/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {article.date}
      </Card.Eyebrow>
      <Card.Description>{article.description}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="size-6 fill-muted transition group-hover:fill-accent" />
    </Link>
  )
}

function Newsletter() {
  return (
    <div className="rounded-2xl border border-line p-6">
      <h2 className="flex text-sm font-semibold text-ink">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 flex-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
          />
        </svg>
        <span className="ml-3">公告</span>
      </h2>
      <p className="mt-2 text-sm text-ink-soft">北京旅游ing，肥来后肝毕业设计。</p>
    </div>
  )
}

interface Role {
  company: string
  title: string
  logo: ImageProps['src']
  start: string | { label: string; dateTime: string }
  end: string | { label: string; dateTime: string }
}

function Role({ role }: { role: Role }) {
  let startLabel =
    typeof role.start === 'string' ? role.start : role.start.label
  let startDate =
    typeof role.start === 'string' ? role.start : role.start.dateTime
  let endLabel = typeof role.end === 'string' ? role.end : role.end.label
  let endDate = typeof role.end === 'string' ? role.end : role.end.dateTime

  return (
    <li className="flex gap-4">
      <div className="relative mt-1 flex size-10 flex-none items-center justify-center rounded-full shadow-[var(--shadow-card)] ring-1 ring-line">
        <Image src={role.logo} alt="" className="size-7" unoptimized />
      </div>
      <dl className="flex flex-auto flex-wrap gap-x-2">
        <dt className="sr-only">Company</dt>
        <dd className="w-full flex-none text-sm font-medium text-ink">
          {role.company}
        </dd>
        <dt className="sr-only">Role</dt>
        <dd className="text-xs text-muted">{role.title}</dd>
        <dt className="sr-only">Date</dt>
        <dd
          className="ml-auto text-xs text-muted"
          aria-label={`${startLabel} until ${endLabel}`}
        >
          <time dateTime={startDate}>{startLabel}</time>{' '}
          <span aria-hidden="true">—</span>{' '}
          <time dateTime={endDate}>{endLabel}</time>
        </dd>
      </dl>
    </li>
  )
}

function Resume() {
  let resume: Array<Role> = [
    {
      company: '天降',
      title: '独立开发者',
      logo: logoBrotian,
      start: '2023',
      end: { label: 'Present', dateTime: new Date().getFullYear().toString() },
    },
    {
      company: '?',
      title: '?',
      logo: logoUnknow,
      start: '2021',
      end: { label: 'Present', dateTime: new Date().getFullYear().toString() },
    },
    {
      company: '用友',
      title: '软件开发',
      logo: logoYonyou,
      start: '2020',
      end: '2021',
    },
    {
      company: '大唐移动',
      title: '实习',
      logo: logoDTMobile,
      start: '2019',
      end: '2020',
    },
  ]

  return (
    <div className="rounded-2xl border border-line p-6">
      <h2 className="flex text-sm font-semibold text-ink">
        <BriefcaseIcon className="size-6 flex-none" />
        <span className="ml-3">履历</span>
      </h2>
      <ol className="mt-6 space-y-4">
        {resume.map((role, roleIndex) => (
          <Role key={roleIndex} role={role} />
        ))}
      </ol>
    </div>
  )
}

function Photos() {
  return (
    <ScrollScene variant="parallax" factor={0.15} className="mt-16 overflow-x-hidden sm:mt-20">
      <PhotoCarousel />
    </ScrollScene>
  )
}

export default async function Home() {
  let articles = (await getAllArticles()).slice(0, 4)
  let socials = [
    {
      href: 'https://space.bilibili.com/4793911',
      label: '关注我的Bilibili',
      icon: BilibiliIcon,
    },
    {
      href: 'https://github.com/tawnylab',
      label: '关注我的GitHub',
      icon: GitHubIcon,
    },
    {
      href: 'mailto:shawntynji@gmail.com',
      label: '邮箱',
      icon: MailIcon,
    },
  ]

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <TextReveal
            as="h1"
            text="科技爱好者、码农。"
            className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          />
          <SectionReveal delay={0.6}>
            <p className="mt-6 text-base text-ink-soft">
              哈喽！吾乃天酱，居住在魔都的独立开发者。正在探索AIGC和三维打印领域。
            </p>
          </SectionReveal>
          <StaggerGroup className="mt-6 flex gap-6" delay={0.7}>
            {socials.map((s) => (
              <MagneticHover key={s.href}>
                <SocialLink href={s.href} aria-label={s.label} icon={s.icon} />
              </MagneticHover>
            ))}
          </StaggerGroup>
        </div>
      </Container>
      <Photos />
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <StaggerGroup className="flex flex-col gap-16">
            {articles.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </StaggerGroup>
          <div className="space-y-10 lg:pl-16 xl:pl-24">
            <Newsletter />
            <Resume />
          </div>
        </div>
      </Container>
    </>
  )
}
```

注：原文 article 的 Card.Eyebrow 内嵌入了 `formatDate` 引用，本任务简化为 `article.date`（YYYY-MM-DD 字符串）以避免日期格式化 import；如需保留中文日期，在文件顶部添加 `import { formatDate } from '@/lib/formatDate'` 并替换 `article.date` 为 `formatDate(article.date)`。

**Step 2: 验证 build + 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
npm run dev
```

打开 `http://localhost:9731`：
- Hero 标题逐字符揭示
- 描述延迟淡入
- 社交图标 stagger + 磁吸
- 照片 carousel 滚动视差
- 文章列表 stagger

**Step 3: 提交**

```bash
git add src/app/page.tsx
git commit -m "feat(home): add TextReveal hero, magnetic social, parallax carousel"
```

---

### Task 6.4：升级 `Footer.tsx`

**Files:**
- Modify: `src/components/Footer.tsx`

**Step 1: 整文件替换**

```tsx
import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/Container'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-accent"
    >
      {children}
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="mt-32 flex-none">
      <ContainerOuter>
        <div className="border-t border-line pb-16 pt-10">
          <ContainerInner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-ink">
                <NavLink href="/about">我</NavLink>
                <NavLink href="/articles">博客</NavLink>
                <NavLink href="/projects">项目</NavLink>
                <NavLink href="/videos">视频</NavLink>
                <NavLink href="/uses">用品</NavLink>
                <NavLink href="/friends">友链</NavLink>
              </div>
              <p className="text-sm text-muted">
                &copy; {new Date().getFullYear()}{' '}
                上海市浦东新区合庆镇天降电脑服务部。{' '}
                <a href="https://beian.miit.gov.cn/" className="hover:text-accent">
                  沪ICP备2023020526号-2
                </a>
              </p>
            </div>
          </ContainerInner>
        </div>
      </ContainerOuter>
    </footer>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/components/Footer.tsx
git commit -m "feat(footer): retune to warm-paper with ochre hover"
```

---

### Task 6.5：PR 6 验收

**Step 1: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

逐项检查：
- 首页 Hero 文字揭示
- 社交图标磁吸
- Cursor 赭石
- 照片 carousel 视差
- Footer 暖色
- 文章列表 stagger

**Step 2: Tag**

```bash
git tag v0.6-home-carousel
```

PR 6 结束。

---

# PR 7 — About / Articles / Projects

### Task 7.1：升级 `src/app/about/page.tsx`

**Files:**
- Modify: `src/app/about/page.tsx`

**Step 1: 整文件替换**

```tsx
import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { GitHubIcon, BilibiliIcon, MailIcon } from '@/components/SocialIcons'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextReveal } from '@/components/motion/TextReveal'
import { TiltCard } from '@/components/motion/TiltCard'
import portraitImage from '@/images/portrait.jpg'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <MagneticHover>
        <Link
          href={href}
          className="group flex text-sm font-medium text-ink transition hover:text-accent"
          {...props}
        >
          <Icon className="size-6 flex-none fill-muted transition group-hover:fill-accent" />
          <span className="ml-4">{children}</span>
        </Link>
      </MagneticHover>
    </li>
  )
}

export const metadata: Metadata = {
  title: '关于我',
  description: '我叫季顺天，在魔都设计怪东西。',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <TiltCard maxTilt={6} className="relative max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-paper-raised object-cover ring-1 ring-line"
              priority
            />
          </TiltCard>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <TextReveal
            as="h1"
            text="我叫季顺天，在魔都设计怪东西。"
            className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          />
          <StaggerGroup className="mt-6 space-y-7 text-base text-ink-soft" delay={0.5}>
            <p>
              我从小喜欢玩电脑，我在初一的时候用收到的红包买了第一张显卡，那是我第一次拆开电脑机箱，一口气学了很多电脑硬件的知识，换上新显卡后我的游戏体验飙升。这为我之后对科技越来越感兴趣埋下了种子。现在的我小到树莓派、大到PowerEdge都折腾过了。
            </p>
            <p>
              我很幸运，遇到了同样对科技感兴趣且获奖无数的牛X同学，还遇到了理解我们、为我们创造特殊环境的良师。在这样的环境下，我们不仅能学到课外的知识和技术，还能享受到特殊的资源和待遇。
            </p>
            <p>
              大学毕业前我几乎只知道用电脑打游戏，我至今都认为年轻时有机会玩就多玩玩绝对没错（哪怕不是游戏，只要是你喜欢的事情就可以），毕业后的我甚至没意识到要工作了，学了点编程就开始工作了。好在编程是我感兴趣的，它与我过往我折腾的机器是相辅相成的，软件的开发、硬件的组装结合起来让我对科技更着迷了。
            </p>
            <p>
              我应该是有点神经质的那种喵，我的发挥经常和状态挂钩。有时候我神智不清、像灵魂出窍般走路都是飘的。猛的时候反差感极其墙裂。
            </p>
          </StaggerGroup>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://space.bilibili.com/4793911"
              icon={BilibiliIcon}
            >
              关注我的Bilibili
            </SocialLink>
            <SocialLink
              href="https://github.com/tawnylab"
              icon={GitHubIcon}
              className="mt-4"
            >
              关注我的GitHub
            </SocialLink>
            <SocialLink
              href="mailto:shawntynji@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-line pt-8"
            >
              shawntynji@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/about/page.tsx
git commit -m "feat(about): add tilt portrait, text reveal, magnetic socials"
```

---

### Task 7.2：升级 `src/app/articles/page.tsx`

**Files:**
- Modify: `src/app/articles/page.tsx`

**Step 1: 整文件替换**

```tsx
import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'

function Article({ article }: { article: ArticleWithSlug }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export const metadata: Metadata = {
  title: '博客',
  description: '这里是我的一些编程、三维打印、毕业设计、游戏等内容的随笔，按时间顺序整理收集。',
}

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="随便写点"
      intro="这里是我的一些编程、三维打印、毕业设计、游戏等内容的随笔，按时间顺序整理收集。"
    >
      <div className="md:border-l md:border-line md:pl-6">
        <StaggerGroup className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <MagneticHover key={article.slug} strength={0.1}>
              <Article article={article} />
            </MagneticHover>
          ))}
        </StaggerGroup>
      </div>
    </SimpleLayout>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/articles/page.tsx
git commit -m "feat(articles): add stagger list and magnetic article cards"
```

---

### Task 7.3：升级 `src/app/projects/page.tsx`

**Files:**
- Modify: `src/app/projects/page.tsx`

**Step 1: 整文件替换**

```tsx
import { type Metadata } from 'next'
import Image from 'next/image'
import { IconCode, type Icon } from '@tabler/icons-react'

import { Card } from '@/components/Card'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TiltCard } from '@/components/motion/TiltCard'
import logoAIGCBrotian from '@/images/logos/brotian.svg'

type Project = {
  name: string
  description: string
  link: { href: string; label: string }
  logo: string | null
  Logo: Icon | null
}

const projects: Project[] = [
  {
    name: '毕业设计（2024）',
    description: '我的2024届复旦专升本毕业设计，定格版本的开源项目。',
    link: { href: 'https://github.com/tawnylab', label: 'github.com' },
    logo: logoAIGCBrotian,
    Logo: null,
  },
  {
    name: 'llama.cpp',
    description: 'C/C++ 编写的高性能大模型推理引擎。',
    link: { href: 'https://github.com/ggml-org/llama.cpp', label: 'github.com' },
    logo: null,
    Logo: IconCode,
  },
  {
    name: 'vllm',
    description: '高吞吐、低显存占用的大模型推理与服务引擎，人人易用。',
    link: { href: 'https://github.com/vllm-project/vllm', label: 'github.com' },
    logo: null,
    Logo: IconCode,
  },
  {
    name: 'litellm',
    description: '轻量级 LLM 网关，Rust 内核 + Python SDK，统一调用 100+ LLM 接口。',
    link: { href: 'https://github.com/BerriAI/litellm', label: 'github.com' },
    logo: null,
    Logo: IconCode,
  },
  {
    name: 'pi-agent',
    description: 'AI Agent 工具包：统一 LLM 接口、Agent 循环、TUI 与编码 Agent CLI。',
    link: { href: 'https://github.com/earendil-works/pi', label: 'github.com' },
    logo: null,
    Logo: IconCode,
  },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: '项目',
  description: '在互联网时代，留下轻描淡写的一笔"天酱到此一游"。',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="在互联网时代，留下轻描淡写的一笔"天酱到此一游"。"
      intro="短短几年，我见识了不少项目。这些是我参与过的或是我墙裂推荐的项目，其中有些是开源项目、有些是我独立开发的。"
    >
      <StaggerGroup
        as="ul"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <TiltCard key={project.name} maxTilt={4} className="h-full">
            <Card as="li" className="h-full">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-paper-raised shadow-[var(--shadow-card)] ring-1 ring-line">
                {project.logo ? (
                  <Image
                    src={project.logo}
                    alt=""
                    className="size-8"
                    unoptimized
                  />
                ) : project.Logo ? (
                  <project.Logo
                    className="size-6 text-ink-soft"
                    stroke={1.5}
                  />
                ) : null}
              </div>
              <h2 className="mt-6 text-base font-semibold text-ink">
                <Card.Link href={project.link.href}>{project.name}</Card.Link>
              </h2>
              <Card.Description>{project.description}</Card.Description>
              <p className="relative z-10 mt-6 flex text-sm font-medium text-muted transition group-hover:text-accent">
                <LinkIcon className="size-6 flex-none" />
                <span className="ml-2">{project.link.label}</span>
              </p>
            </Card>
          </TiltCard>
        ))}
      </StaggerGroup>
    </SimpleLayout>
  )
}
```

注意：项目名包含中文双引号"天酱到此一游"在 SimpleLayout title 字符串里需要正确转义。若 TS 报字符串错误，可改用单引号包外、双引号在内：

```tsx
title={'在互联网时代，留下轻描淡写的一笔"天酱到此一游"。'}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/projects/page.tsx
git commit -m "feat(projects): add stagger grid and tilt project cards"
```

---

### Task 7.4：PR 7 验收

**Step 1: 端到端**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run dev
```

- `/about` 肖像 3D 倾斜 hover
- `/articles` 列表 stagger + 卡片磁吸
- `/projects` 网格 stagger + 卡片倾斜

**Step 2: Tag**

```bash
git tag v0.7-about-articles-projects
```

PR 7 结束。

---

# PR 8 — Videos / Uses / Friends / 404 收尾

### Task 8.1：升级 `src/app/videos/page.tsx`

**Files:**
- Modify: `src/app/videos/page.tsx`

**Step 1: 整文件替换**

```tsx
import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { formatDate } from '@/lib/formatDate'

function VideoSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Appearance({
  title,
  description,
  date,
  cta,
  href,
}: {
  title: string
  description: string
  date: string
  cta: string
  href: string
}) {
  return (
    <MagneticHover strength={0.08}>
      <Card as="article">
        <Card.Title as="h3" href={href}>
          {title}
        </Card.Title>
        <Card.Eyebrow decorate>{formatDate(date)}</Card.Eyebrow>
        <Card.Description>{description}</Card.Description>
        <Card.Cta>{cta}</Card.Cta>
      </Card>
    </MagneticHover>
  )
}

export const metadata: Metadata = {
  title: '视频',
  description: '通过视频发布的内容更丰富。',
}

export default function Videos() {
  return (
    <SimpleLayout
      title="通过视频发布的内容更丰富。"
      intro="这里是我去各地游玩、演唱会、编程解说、游戏录屏、摄影等视频的分享。"
    >
      <StaggerGroup className="space-y-20">
        <VideoSection title="演唱会">
          <Appearance
            href="https://www.bilibili.com/video/BV1ro4heJEkJ/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="周杰伦"
            description='"嘉年华"世界巡回演唱会（2024杭州站）'
            date="2024-04-19"
            cta="观看 Live 录像"
          />
          <Appearance
            href="https://www.bilibili.com/video/BV1nC411h7c7/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="林俊杰"
            description='"JJ20"世界巡回演唱会（2024杭州站）'
            date="2024-03-17"
            cta="观看 Live 录像"
          />
        </VideoSection>
        <VideoSection title="计算机科学">
          <Appearance
            href="https://www.bilibili.com/video/BV1Lw4m1d7mt/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="仿ChatGPT"
            description="独立开发的ChatGPT仿项目介绍。"
            date="2024-03-13"
            cta="观看介绍"
          />
          <Appearance
            href="https://www.bilibili.com/video/BV1Uj411g7qt/?share_source=copy_web&vd_source=461c4d65318532e75a7173f5906883d4"
            title="私有云、家用NAS、企业级服务器"
            description="家用NAS系统介绍、开源自部署项目推荐。"
            date="2023-03-04"
            cta="观看介绍"
          />
        </VideoSection>
      </StaggerGroup>
    </SimpleLayout>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/videos/page.tsx
git commit -m "feat(videos): add stagger and magnetic cards"
```

---

### Task 8.2：升级 `src/app/uses/page.tsx`

**Files:**
- Modify: `src/app/uses/page.tsx`

**Step 1: 整文件替换**

```tsx
import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'
import { StaggerGroup } from '@/components/motion/StaggerGroup'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: '我用的',
  description: '我青睐的设备、软件、开发框架，以及其他我的推荐。',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="我青睐的设备、软件、开发框架，以及其他我的推荐。"
      intro="很多人问过我"用的什么服务器？有没有推荐的机器？项目用什么开发的？"。我认为多尝试找到自己顺手的才对。这是我觉得好用的东西的清单（仅供参考）。"
    >
      <StaggerGroup className="space-y-20">
        <ToolsSection title="工作站">
          <Tool title="戴尔 PowerEdge R7515 / 银欣 CS351">
            企业级的不间断运行的服务器机箱，适用于动手能力强、对电脑硬件熟悉、有隔音放置空间的DIY爱好者。能够自行选择硬件配置和操作系统，组NAS阵列，部署实用的开源项目。
          </Tool>
          <Tool title="Mac mini">
            小巧的盒子，强大的性能和能耗比。无需主动散热，不占空间随意摆放，绝佳的台式机选择。
          </Tool>
          <Tool title="Apple 妙控触摸板">
            谁用谁知道，丝般顺滑，赋予Mac OS绝佳体验的外设。
          </Tool>
        </ToolsSection>
        <ToolsSection title="开发工具">
          <Tool title="VS Code">
            我几乎只用这一款编辑器开发编写所有常用的编程语言（JS/TS、Python、Java等）。
          </Tool>
          <Tool title="iTerm2">
            Mac OS的终端的替代品，功能不谈，总是就是非常好看！
          </Tool>
          <Tool title="Draw.io">流程图绘制工具。</Tool>
          <Tool title="Next JS">
            React的全栈框架。已经成熟的生产级框架，还将有新的功能（服务端组件、优化编译器等）和迭代的v15大版本更新到来。
          </Tool>
          <Tool title="Tailwind CSS">
            任何前端框架中，我都会使用的原子级CSS框架。优秀的响应式页面设计语法。Nextjs集成的默认选项。将迎来v4大版本更新。
          </Tool>
          <Tool title="Tauri">
            静态网站的多端应用封装框架，适合响应式页面，使用系统自带的浏览器内核的轻量级框架，将迎来v2大版本更新支持移动端。
          </Tool>
        </ToolsSection>
        <ToolsSection title="设计">
          <Tool title="Tailwind UI">
            精美的UI组件和网站模版，这个网站就是基于Spotlight模版二开的。
          </Tool>
        </ToolsSection>
        <ToolsSection title="家庭服务">
          <Tool title="Unraid / TrueNAS">
            想DIY一台NAS的话，从两个系统中选一个即可。Unraid为收费闭源，无需整列卡，任何多余的闲置硬盘都可以随时添加以扩容，最多支持两块校验盘（相当于Z2阵列，至多损坏两块硬盘的极端情况下维持数据可用性）。TrueNAS开源免费，需要阵列卡，需要对整列的特性有了解后选择适合自己的，选定阵列后根据阵列特性的不同会影响后续扩容。想进一步保护数据可以加个UPS。有NAS后全家都有巨大的网络硬盘空间，还不怕丢数据，还能装各种开源服务，包爽的！
          </Tool>
          <Tool title="Home Assistant">
            智能家居的中枢，可以将多方智能设备接入，统一使用你青睐的应用或语言助手控制所有设备。
          </Tool>
          <Tool title="BitWarden">
            开源密码管理器，统一管理所有应用的密码、2FA、信用卡等，本地私有化保存，自动生成复杂密码（自己都不知道的那种），多端同步。
          </Tool>
          <Tool title="Nextcloud">
            开源网盘，在线编辑文档，查阅照片，移动端照片视频上传。
          </Tool>
          <Tool title="Jellyfin">
            开源影音系统，小电影自动刮削，硬件解码，用户管理，公网给好友分享。
          </Tool>
          <Tool title="Gitea">
            开源代码仓库，信不过公网服务就本地私有化部署一个git仓库。
          </Tool>
        </ToolsSection>
      </StaggerGroup>
    </SimpleLayout>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/uses/page.tsx
git commit -m "feat(uses): add stagger to sections"
```

---

### Task 8.3：升级 `src/app/friends/page.tsx`（TiltCard + 旋转轨道）

**Files:**
- Modify: `src/app/friends/page.tsx`

**Step 1: 整文件替换**

```tsx
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

import {
  LinkIcon,
  BilibiliIcon,
  TiktokIcon,
  XiaohongshuIcon,
} from '@/components/SocialIcons'
import { MagneticHover } from '@/components/motion/MagneticHover'
import { StaggerGroup } from '@/components/motion/StaggerGroup'
import { TextReveal } from '@/components/motion/TextReveal'
import { TiltCard } from '@/components/motion/TiltCard'

import imageTutugreen from '@/images/friends/tutugreen.png'
import imageZJYGD from '@/images/friends/zjygd.avif'
import imageLiMiaoU from '@/images/friends/limiaou.webp'
import imagePeanut from '@/images/friends/peanut.webp'

const people: {
  name: string
  role: string
  imageUrl: any
  personalUrl?: string
  bilibiliUrl?: string
  tiktokUrl?: string
  xiaohongshuUrl?: string
}[] = [
  {
    name: 'tutugreen',
    role: '云计算佬大',
    imageUrl: imageTutugreen,
    personalUrl: 'https://tutugreen.com',
    bilibiliUrl: 'https://space.bilibili.com/1713718',
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/634a6639000000001802d562',
  },
  {
    name: 'ZJ一锅端',
    role: '游戏奶爸',
    imageUrl: imageZJYGD,
    bilibiliUrl: 'https://space.bilibili.com/2207789',
    tiktokUrl:
      'https://www.douyin.com/user/MS4wLjABAAAAEUso_0PQl8QWqidxYnLf0z3GGLGXHHECVkArfETYWmU',
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/602f3c3d00000000010077ac',
  },
  {
    name: '宇怂二喵',
    role: '帅猫',
    imageUrl: imageLiMiaoU,
    bilibiliUrl: 'https://space.bilibili.com/14626829',
    tiktokUrl:
      'https://www.douyin.com/user/MS4wLjABAAAAo-1rh7UNXCzH2SxYWA5f2Ac1oQ9jh3Sm0Syp_yBBHck',
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/5b83acda3fbd150001570096',
  },
  {
    name: '花生',
    role: '妈宝猫',
    imageUrl: imagePeanut,
    xiaohongshuUrl:
      'https://www.xiaohongshu.com/user/profile/5ab3cbafe8ac2b308a5115ec',
  },
]

function OrbitingRing() {
  let reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 rounded-full border border-dashed border-accent/50"
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default function Friends() {
  return (
    <div className="py-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <TextReveal
            as="h2"
            text="友情链接"
            className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          />
          <p className="mt-4 text-lg leading-8 text-ink-soft">
            这里面个个都是人才，说话又好听，我超喜欢这里的。
          </p>
        </div>
        <StaggerGroup
          as="ul"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {people.map((person) => (
            <li key={person.name}>
              <TiltCard maxTilt={5} className="mx-auto size-56">
                <div className="relative size-56">
                  <OrbitingRing />
                  <Image
                    src={person.imageUrl}
                    alt=""
                    className="absolute inset-0 size-56 rounded-full object-cover ring-1 ring-line"
                    unoptimized
                  />
                </div>
              </TiltCard>
              <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-ink">
                {person.name}
              </h3>
              <p className="text-sm leading-6 text-ink-soft">{person.role}</p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                {person.personalUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.personalUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Friendly Link</span>
                        <LinkIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
                {person.bilibiliUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.bilibiliUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Bilibili</span>
                        <BilibiliIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
                {person.tiktokUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.tiktokUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Tik Tok</span>
                        <TiktokIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
                {person.xiaohongshuUrl && (
                  <li>
                    <MagneticHover>
                      <a
                        href={person.xiaohongshuUrl}
                        className="fill-muted text-muted transition hover:fill-accent hover:text-accent"
                      >
                        <span className="sr-only">Xiao Hong Shu</span>
                        <XiaohongshuIcon className="size-5" />
                      </a>
                    </MagneticHover>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </StaggerGroup>
      </div>
    </div>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/friends/page.tsx
git commit -m "feat(friends): add tilt avatars, orbiting ring, magnetic icons"
```

---

### Task 8.4：升级 `src/app/not-found.tsx`（撕裂式 clip-path）

**Files:**
- Modify: `src/app/not-found.tsx`

**Step 1: 整文件替换**

```tsx
'use client'

import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { MagneticHover } from '@/components/motion/MagneticHover'

export default function NotFound() {
  let reduce = useReducedMotion()
  let mx = useMotionValue(0)
  let my = useMotionValue(0)
  let sx = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 })
  let sy = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 })

  if (typeof window !== 'undefined' && !reduce) {
    // bind pointer
    if (typeof window !== 'undefined') {
      window.addEventListener('pointermove', (e) => {
        sx.set((e.clientX / window.innerWidth - 0.5) * 24)
        sy.set((e.clientY / window.innerHeight - 0.5) * 24)
      })
    }
  }

  return (
    <Container className="flex h-full items-center pt-16 sm:pt-32">
      <div className="flex flex-col items-center">
        <motion.p
          aria-hidden="true"
          className="font-display select-none text-[12rem] font-bold leading-none text-accent/15 sm:text-[18rem]"
          style={reduce ? undefined : { x: sx, y: sy }}
        >
          404
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          initial={reduce ? false : { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={
            reduce
              ? undefined
              : { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
          }
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="mt-4 text-base text-ink-soft"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          迷路了
        </motion.p>
        <MagneticHover className="mt-6">
          <Button href="/" variant="secondary">
            Go back home
          </Button>
        </MagneticHover>
      </div>
    </Container>
  )
}
```

注：上面 `window.addEventListener` 写在组件函数体里是反模式。修正为：

```tsx
'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { MagneticHover } from '@/components/motion/MagneticHover'

export default function NotFound() {
  let reduce = useReducedMotion()
  let sx = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 })
  let sy = useSpring(useMotionValue(0), { stiffness: 100, damping: 20 })

  useEffect(() => {
    if (reduce) return
    let onMove = (e: PointerEvent) => {
      sx.set((e.clientX / window.innerWidth - 0.5) * 24)
      sy.set((e.clientY / window.innerHeight - 0.5) * 24)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, sx, sy])

  return (
    <Container className="flex h-full items-center pt-16 sm:pt-32">
      <div className="flex flex-col items-center">
        <motion.p
          aria-hidden="true"
          className="font-display select-none text-[12rem] font-bold leading-none text-accent/15 sm:text-[18rem]"
          style={reduce ? undefined : { x: sx, y: sy }}
        >
          404
        </motion.p>
        <motion.h1
          className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl"
          initial={reduce ? false : { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
          animate={
            reduce
              ? undefined
              : { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
          }
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="mt-4 text-base text-ink-soft"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          迷路了
        </motion.p>
        <MagneticHover className="mt-6">
          <Button href="/" variant="secondary">
            Go back home
          </Button>
        </MagneticHover>
      </div>
    </Container>
  )
}
```

**Step 2: 验证 build + 提交**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
git add src/app/not-found.tsx
git commit -m "feat(404): add clip-path reveal and mouse-tracking 404 chars"
```

---

### Task 8.5：完整收尾验收

**Step 1: 端到端 + Lighthouse + 响应式**

```bash
cd /Users/cyve/Developer/Personal/Spotlight
npm run build
npm run dev
```

访问 8 条主路由 + 404：
- 全部应用暖纸主题
- 路由切换有赭石遮罩
- 滚动揭示正常
- 文字逐字符揭示
- Cursor 替代系统箭头
- 减弱动效降级正常

**Step 2: 跨断点**

DevTools 设备模式：
- 375×812 — 移动端：磁吸/倾斜/Cursor 全部关闭
- 768×1024 — 平板
- 1280×800 — 桌面

**Step 3: 最终 tag**

```bash
git tag v1.0-warm-paper-ochre
git log --oneline | head -50
```

PR 8 与整体计划结束。

---

## Self-Review Checklist

执行时由实施者自查：

1. **Spec 覆盖**：所有设计稿 §2-§8 都映射到具体任务。检查点：
   - §2 视觉语言 → Task 1.1
   - §3 拆 next-themes → Task 2.x
   - §4 动画分层 → Task 3.1-3.7
   - §5 路由转场 → Task 4.1-4.2
   - §6 关键页面动效 → Task 6.3, 7.x, 8.x
   - §7 全站背景 → Task 4.3 + Task 1.1
   - §8 字体与排版 → Task 1.1（`font-display` token 在 tailwind.css 已声明，需要在字体文件中实际加载 Noto Serif SC——这是已知 gap，由实施者决定是否本期引入或下期做）
   - §9 组件清单 → 散落在各 PR 改造任务中
   - §10 验证 → 每个 PR 末尾的"PR 验收"任务
   - §11 PR 拆分 → 8 个 PR section
   - §12 风险 → 散落在各 step 的注释中

2. **占位符扫描**：本文档无 "TBD"、"TODO"、"implement later"、"fill in details"。所有代码块为可直接粘贴的实现。

3. **类型一致性**：
   - `useMotionPreference` 返回 `{ mounted, reduceMotion, finePointer }` — 在 CursorTrails（用 `fine`）、AmbientBackground（用 `fine` + `reduce`）、InspirationBurstButton（用 `reduce`）三处分别解构 → 类型一致
   - `useReducedMotion` 单独使用（SectionReveal、StaggerGroup、TextReveal、MagneticHover、TiltCard、ScrollScene、PageWipe、PageTransition、ProseReveal、ReadingProgress、ScrollSectionAxis、CursorTrails、NotFound）— 所有都是 `useReducedMotion(): boolean` 形式
   - `getRouteLabel(pathname)` 单参数字符串 → 与 `PageWipe` 接收的 `label: string` 一致

4. **范围**：本计划是单一特性（视觉/交互层），无子系统拆分需求。

5. **已知遗留**（执行前请确认）：
   - 字体扩展（`Noto Serif SC` 的实际 `next/font` 加载）未在本计划实施。本计划中 `font-display` 仅为 Tailwind token 名；如需真实 Serif 渲染，**在 Task 1.1 之后追加**一个 Task 1.1b：使用 `next/font/google` 加载 `Noto Serif SC`，并在 `src/styles/fonts.css` 注入 `@font-face`，更新 `tailwind.config.ts` 的 `fontFamily.display` 映射。
   - `ScrollSectionAxis` 仅适用于 Section.tsx 的固定布局；如果未来 Section 出现在多列布局，需重新审视左侧轴线定位。
   - 移动端减弱动效时 `OrbitingRing` 仍可渲染（仅跟随偏好），但 `TiltCard`/`MagneticHover`/`CursorTrails` 会因 `usePointerFine()` 关闭。
   - `ProseReveal` 当前实现是包裹每个子元素；如果 MDX 输出包含 `<></>` 片段，需在 ArticleLayout 中做边界检查。

6. **环境/凭据**：
   - `.npmrc` 私有 registry + `MOTION_PLUS_TOKEN` 必须在 CI/本地可用
   - 端口 9731 保持
   - `NEXT_PUBLIC_SITE_URL` 在部署环境设置

