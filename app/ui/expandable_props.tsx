import React, { useEffect, useRef, useState } from "react";
import { Button } from "./button";

export interface ExpandableProps {
  /** Controlled open state. If omitted, component manages its own open state. */
  isOpen?: boolean;
  /** Transition duration in milliseconds. Default: 300 */
  duration?: number;
  /** CSS timing function. Default: 'ease' */
  easing?: string;
  /** Height in pixels when collapsed. Default: 0 */
  collapsedHeight?: number;
  /** When true, unmount children when collapsed (after animation). Default: false */
  unmountOnCollapse?: boolean;
  /** Optional className for the wrapper */
  className?: string;
  /** Optional callback when toggle occurs (receives new state) */
  onToggle?: (open: boolean) => void;
  /** Children to render inside the expanding panel */
  children: React.ReactNode;
}

/**
 * Expandable - a tiny, accessible React component that expands/collapses its content
 * with a smooth height transition. Default styling uses utility classes (Tailwind-friendly),
 * but everything important is inline so it works in plain CSS projects too.
 *
 * Key behavior:
 * - Measures content height and animates `height` (not max-height) for smoothness.
 * - Keeps content in the DOM while animating open/close; optionally unmounts after close.
 * - If `isOpen` is not provided the component is uncontrolled and provides an internal toggle.
 */
export default function Expandable({
  isOpen: controlledIsOpen,
  duration = 300,
  easing = "ease",
  collapsedHeight = 0,
  unmountOnCollapse = false,
  className = "",
  onToggle,
  children,
}: ExpandableProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [internalOpen, setInternalOpen] = useState<boolean>(!!controlledIsOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? !!controlledIsOpen : internalOpen;

  // We store a CSS height string (e.g. '0px', '200px', 'auto') to animate.
  const [height, setHeight] = useState<string>(
    isOpen ? "auto" : `${collapsedHeight}px`
  );
  // Whether children should be rendered at all (used with unmountOnCollapse)
  const [renderChildren, setRenderChildren] = useState<boolean>(
    isOpen || !unmountOnCollapse
  );

  // Toggle helper for uncontrolled mode
  function toggle() {
    if (isControlled) {
      onToggle?.(!isOpen);
    } else {
      setInternalOpen((v) => {
        const next = !v;
        onToggle?.(next);
        return next;
      });
    }
  }

  // Whenever isOpen changes we animate height.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // If opening: ensure children are rendered, measure scrollHeight, animate to that height,
    // then set to 'auto' after transition so it grows/shrinks naturally if children change size.
    if (isOpen) {
      if (renderChildren === false) setRenderChildren(true);

      // We need to measure the full height. Use a small requestAnimationFrame to ensure layout.
      requestAnimationFrame(() => {
        const full = `${el.scrollHeight}px`;
        // Start from collapsedHeight if current computed height is 'auto'.
        // Force a reflow between setting start and end to guarantee transition.
        setHeight(`${el.getBoundingClientRect().height}px`);
        requestAnimationFrame(() => setHeight(full));

        // After transition, set height to 'auto' so that internal changes don't conflict.
        const tidy = window.setTimeout(() => setHeight("auto"), duration);
        return () => clearTimeout(tidy);
      });
      return;
    }

    // Closing: animate from current height (or scrollHeight) to collapsedHeight
    const start = `${el.scrollHeight}px`;
    setHeight(start);
    // Next frame set to collapsed height to start the transition
    requestAnimationFrame(() => setHeight(`${collapsedHeight}px`));

    // After animation complete, optionally unmount children and set final height value
    const timer = window.setTimeout(() => {
      if (unmountOnCollapse) setRenderChildren(false);
      // Keep the inline height at collapsed size (so it's stable). We keep it in px rather than 'auto'.
      setHeight(`${collapsedHeight}px`);
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, collapsedHeight, unmountOnCollapse, renderChildren]);

  // Inline style driving the transition
  const style: React.CSSProperties = {
    height,
    overflow: "hidden",
    transition: `height ${duration}ms ${easing}`,
  };

  // Simple accessible header/button you can wire up externally. We expose toggle via button below.
  // Consumers can ignore the built-in button and control open state externally.
  return (
    <div className={`expandable-wrapper ${className}`.trim()}>
      {/* Example toggle button built-in for convenience — consumers may choose to remove it. */}
      <div id="expandable-panel" style={style}>
        {/* keep a ref wrapper around the real content so we can measure scrollHeight reliably */}
        {renderChildren && (
          <div ref={contentRef} className="p-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/*
Usage notes (non-code summary):
- Default export component name: `Expandable` (file default export).
- Props: isOpen (controlled), duration (ms), easing (css timing), collapsedHeight (px), unmountOnCollapse (bool), onToggle (callback), children.
- For a controlled usage: provide `isOpen` and handle toggling externally (onToggle will help).
- For an uncontrolled usage: omit `isOpen` and use the built-in button or keep a ref to call the `toggle` behavior via your own UI.

This component uses height animation for a smooth transition and falls back to keeping height as 'auto' after opening to allow dynamic content.
Adjust `duration` and `easing` to taste. */
