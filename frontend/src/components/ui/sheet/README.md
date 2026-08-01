# Sheet

A compound slide-in panel component supporting four sides. Sub-components let you compose the layout yourself — trigger, header, title, description, content, and footer are all separate pieces. State is shared via React context.

## Import

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet/Sheet";
```

## Basic Usage

Right-side sheet (default).

```tsx
<Sheet>
  <SheetTrigger>Open Sheet</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Make changes to your profile here.</SheetDescription>
    </SheetHeader>
    <p>Your content goes here.</p>
    <SheetFooter>
      <button>Cancel</button>
      <button>Save</button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Side Variants

Pass a `side` prop to `Sheet` to control which edge the panel slides in from.

```tsx
// Right (default)
<Sheet side="right">...</Sheet>

// Left
<Sheet side="left">...</Sheet>

// Top
<Sheet side="top">...</Sheet>

// Bottom
<Sheet side="bottom">...</Sheet>
```

## Props

## Sheet

| Prop       | Type                                     | Default   | Description                                   |
| ---------- | ---------------------------------------- | --------- | --------------------------------------------- |
| `children` | `ReactNode`                              | Required  | `SheetTrigger` and `SheetContent` components. |
| `side`     | `"top" \| "bottom" \| "left" \| "right"` | `"right"` | The edge the sheet slides in from.            |

## SheetTrigger

| Prop        | Type        | Default     | Description                                |
| ----------- | ----------- | ----------- | ------------------------------------------ |
| `children`  | `ReactNode` | Required    | Content of the trigger button.             |
| `className` | `string`    | `undefined` | Adds custom classes to the trigger button. |

`SheetTrigger` also accepts all standard `button` props.

## SheetContent

| Prop        | Type        | Default     | Description                               |
| ----------- | ----------- | ----------- | ----------------------------------------- |
| `children`  | `ReactNode` | Required    | Content rendered inside the sheet panel.  |
| `className` | `string`    | `undefined` | Adds custom classes to the panel wrapper. |

`SheetContent` also accepts all standard `div` props.

## SheetHeader

| Prop        | Type        | Default     | Description                                     |
| ----------- | ----------- | ----------- | ----------------------------------------------- |
| `children`  | `ReactNode` | Required    | `SheetTitle` and `SheetDescription` components. |
| `className` | `string`    | `undefined` | Adds custom classes to the header wrapper.      |

`SheetHeader` also accepts all standard `div` props.

## SheetTitle

| Prop        | Type        | Default     | Description                               |
| ----------- | ----------- | ----------- | ----------------------------------------- |
| `children`  | `ReactNode` | Required    | The title text to display.                |
| `className` | `string`    | `undefined` | Adds custom classes to the title element. |

`SheetTitle` also accepts all standard `h3` props.

## SheetDescription

| Prop        | Type        | Default     | Description                                     |
| ----------- | ----------- | ----------- | ----------------------------------------------- |
| `children`  | `ReactNode` | Required    | The description text to display.                |
| `className` | `string`    | `undefined` | Adds custom classes to the description element. |

`SheetDescription` also accepts all standard `p` props.

## SheetFooter

| Prop        | Type        | Default     | Description                                |
| ----------- | ----------- | ----------- | ------------------------------------------ |
| `children`  | `ReactNode` | Required    | Footer actions, typically buttons.         |
| `className` | `string`    | `undefined` | Adds custom classes to the footer wrapper. |

`SheetFooter` also accepts all standard `div` props.

## Close Behavior

The sheet can be closed in two ways — clicking the backdrop overlay, or clicking the `X` button inside the panel.

```tsx
// Backdrop overlay — clicking anywhere outside the panel
<div onClick={() => setOpen(false)} className="fixed inset-0 ..." />

// X button — top right of the panel
<button onClick={() => setOpen(false)}>
  <X size={20} />
</button>
```

## Panel Dimensions per Side

| Side     | Panel size                                    |
| -------- | --------------------------------------------- |
| `right`  | `h-full w-full sm:w-96`, slides in from right |
| `left`   | `h-full w-full sm:w-96`, slides in from left  |
| `top`    | `w-full max-h-[80vh]`, slides in from top     |
| `bottom` | `w-full max-h-[80vh]`, slides in from bottom  |

## Styling

The component uses design tokens from `globals.css`, such as:

- `--color-surface`
- `--color-border`
- `--color-fg`
- `--color-fg-muted`
- `--color-fg-inverse`
- `--color-primary`
- `--shadow-md`

The backdrop uses `bg-black/50` and fades in/out with `transition-opacity duration-200`. The panel slides in/out with `transition-transform duration-300 ease-out`.

```tsx
// To change the side panel width (left/right)
<SheetContent className="sm:w-[500px]">

// To change the max height (top/bottom)
<SheetContent className="max-h-[60vh]">
```

## Notes

- `Sheet` is a `"use client"` component and must run in the browser.
- All sub-components must be rendered inside a `<Sheet>` wrapper — they read open state and side via React context and will throw if used outside.
- Open/close state is managed internally by `Sheet`. There is no controlled `open` or `onOpenChange` prop — extend the component with context if you need external control.
- `SheetFooter` uses `mt-auto` to push itself to the bottom of the panel. It requires the panel to be a flex column, which is already set in `SheetContent`.
- `lucide-react` is required for the `X` close icon inside `SheetContent`.
- The `cn()` utility from `@/lib/utils` is required.
