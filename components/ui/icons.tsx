import type { ComponentPropsWithoutRef } from "react";

type IconProps = ComponentPropsWithoutRef<"svg">;

function base(props: IconProps) {
  return {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
    ...props,
  };
}

/** 站内跳转（右箭头） */
export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/** 外部链接（右上箭头） */
export function IconArrowUpRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3.5 3.5" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3.5 3.5 9 9m0-9-9 9" />
    </svg>
  );
}

export function IconRss(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 13a1 1 0 1 0 0-.01M3 8.5A4.5 4.5 0 0 1 7.5 13M3 4a9 9 0 0 1 9 9" />
    </svg>
  );
}
