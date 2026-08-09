import * as React from "react";
import { createLink } from "@tanstack/react-router";
import type { LinkComponent } from "@tanstack/react-router";

interface AppLinkAnchorProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {}

const AppLinkAnchor = React.forwardRef<HTMLAnchorElement, AppLinkAnchorProps>((props, ref) => (
  <a ref={ref} {...props} />
));
AppLinkAnchor.displayName = "AppLinkAnchor";

const CreatedAppLink = createLink(AppLinkAnchor);

export const AppLink: LinkComponent<typeof AppLinkAnchor> = (props) => (
  <CreatedAppLink preload="intent" {...props} />
);
