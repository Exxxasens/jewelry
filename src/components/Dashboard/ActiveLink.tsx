"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ActiveLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "children"> {
  children: (isActive: boolean) => React.ReactNode | React.ReactNode[];
  exact?: boolean;
}

const ActiveLink: React.FC<ActiveLinkProps> = ({
  children,
  exact = true,
  ...props
}) => {
  const asPath = usePathname();

  // if exact, then compare exactly, otherwise checks substring entry
  const isActive = exact
    ? asPath === props.href || asPath === props.as
    : asPath.includes(props.href.toString()) ||
      !!(props.as && asPath.includes(props.as.toString()));

  return <Link {...props}>{children(isActive)}</Link>;
};

export default ActiveLink;
