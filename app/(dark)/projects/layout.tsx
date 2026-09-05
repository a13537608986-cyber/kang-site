import type { ReactNode } from "react";
import styles from "./projectScope.module.css";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <div className={styles.scope}>{children}</div>;
}
