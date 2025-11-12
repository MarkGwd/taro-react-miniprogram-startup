# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WeChat Mini Program for parents of ChunSun English (春笋英语) students, built with Taro 4.1.7 + React 18 + TypeScript. The app provides brand information, student learning reports, and parent profile management.

## Common Commands

### Development
```bash
npm run dev:weapp          # Start development server for WeChat
npm run build:weapp        # Build production bundle for WeChat
```

### Code Quality
```bash
tsc --noEmit              # Run TypeScript type checking
stylelint src/**/*.scss   # Lint Sass styles
```

### Other Platforms (if needed)
```bash
npm run dev:h5            # Development for H5
npm run dev:alipay        # Development for Alipay
npm run dev:swan          # Development for Baidu
```

## Architecture Overview

### State Management Strategy
- Uses **React Context + useReducer** (not Zustand as originally documented)
- Three main contexts: `UserContext`, `StudentContext`, `ReportContext`
- Each context provides:
  - State management via reducer pattern
  - Business logic hooks (e.g., `useUserStore()`)
  - Provider components for wrapping the app
- Contexts are exported from `src/stores/index.ts`

### API Service Layer
- Centralized in `src/services/`
- `request.ts`: Taro.request wrapper with error handling
- `services/api/`: Domain-specific API modules (auth, student, report)
- Type-safe with TypeScript interfaces from `src/types/api.ts`
- Mock data available in `src/mock/` for development

### TypeScript Usage Strategy
**Must use TypeScript:**
- API interfaces and types (`src/types/`)
- State management (`src/stores/`)
- Complex component Props
- Configuration constants

**Can use JavaScript:**
- Simple page components
- Simple utility functions
- Mock data files

### Page Architecture
Main pages (configured in `src/app.config.ts`):
1. `pages/index` - Home page (春笋英语) with video, student showcase, articles
2. `pages/reports` - Learning reports list (学情战报)
3. `pages/profile` - User profile (我的)
4. `pages/bind-student` - Student binding flow
5. `pages/report-detail` - Report detail (uses WebView for external content)

### Configuration System
- Static content stored in `src/config/home.json`
- Includes video URLs, student showcase data, article metadata
- Pages consume this config directly (e.g., `homeConfig.showcase.students`)

## Important Technical Constraints

### WeChat Mini Program Specifics
- Use `rpx` units for responsive design (not px)
- Avoid `position: fixed` (causes issues in mini programs)
- Pay attention to safe area adaptation
- Cannot use Tailwind CSS (compatibility issues)
- Use Taro's built-in components (`@tarojs/components`)

### Styling Guidelines
- Sass with custom design system (no Tailwind)
- BEM naming convention
- Design system variables in Sass files
- Responsive units: `rpx` for adaptation

### Performance Considerations
- Implement lazy loading for images
- Avoid frequent `setData` calls
- Use list virtualization for long lists
- Leverage caching appropriately

## File Structure Conventions

### Naming
- Components: `PascalCase.tsx` (e.g., `UserCard.tsx`)
- Utilities: `kebab-case.js` (e.g., `user-helper.js`)
- Styles: `kebab-case.scss` (e.g., `user-card.scss`)

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)
- Use absolute imports: `import { User } from '@/types'`

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: New features
- `fix`: Bug fixes
- `style`: Code formatting
- `refactor`: Code refactoring
- `docs`: Documentation updates
- `chore`: Build/tooling changes

Format: `<type>: <subject>` (e.g., `feat: 添加学情战报页面`)

## Key Development Patterns

### Opening WeChat Official Account Articles
Use the WeChat-specific API (not standard web navigation):
```typescript
(Taro as any).openOfficialAccountArticle({
  url: articleUrl,
  success: (res) => console.log('Success'),
  fail: (err) => console.error('Failed')
});
```

### Error Handling
The `Request` class in `src/services/request.ts` automatically shows toast messages for errors. All API calls return `ApiResponse<T>` with `success` flag.

### Component Organization
```
src/components/
├── common/      # Shared UI components (Loading, Empty, etc.)
├── business/    # Domain-specific components
└── layout/      # Layout components (CustomNavBar, etc.)
```
