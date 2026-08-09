import * as React from "react";
import { createLink } from "@tanstack/react-router";
import type { LinkComponent } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "#/shared/components/ui/button";
import { cn } from "#/shared/lib/utils";

type RouterButtonAnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  VariantProps<typeof buttonVariants>;

const RouterButtonAnchor = React.forwardRef<HTMLAnchorElement, RouterButtonAnchorProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => (
    <a ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);
RouterButtonAnchor.displayName = "RouterButtonAnchor";

const CreatedRouterButton = createLink(RouterButtonAnchor);

export const RouterButton: LinkComponent<typeof RouterButtonAnchor> = (props) => (
  <CreatedRouterButton preload="intent" {...props} />
);
