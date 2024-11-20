import {forwardRef} from "react";
import {
	Button as MantineButton,
	NavLink as MantineNavLink,
	Anchor as MantineAnchor,
	ButtonProps as MantineButtonProps,
	NavLinkProps as MantineNavLinkProps,
	AnchorProps as MantineAnchorProps
} from "@mantine/core";
import {createLink, LinkComponent} from "@tanstack/react-router";

// This is a custom Mantine Button component with Tanstack Router integration
interface MantineButtonComponentProps extends Omit<MantineButtonProps, 'href'> {
}

const MantineButtonComponent = forwardRef<HTMLAnchorElement, MantineButtonComponentProps>((props, ref) => {
	return <MantineButton ref={ref} {...props} component="a"/>;
})

const CreatedLinkButtonComponent = createLink(MantineButtonComponent);

const Button: LinkComponent<typeof MantineButtonComponent> = (
	props
) => {
	return <CreatedLinkButtonComponent preload="intent" {...props} />;
}

// This is a custom Mantine NavLink component with Tanstack Router integration
interface MantineNavLinkComponentProps extends Omit<MantineNavLinkProps, 'href'> {
}

const MantineNavLinkComponent = forwardRef<HTMLAnchorElement, MantineNavLinkComponentProps>((props, ref) => {
	return <MantineNavLink ref={ref} {...props} component="a"/>;
})

const CreatedNavLinkComponent = createLink(MantineNavLinkComponent);

const NavLink: LinkComponent<typeof MantineNavLinkComponent> = (
	props
) => {
	return <CreatedNavLinkComponent preload="intent" {...props} />;
}

// This is a custom Mantine Anchor component with Tanstack Router integration
interface MantineAnchorComponentProps extends Omit<MantineAnchorProps, 'href'> {
}

const MantineAnchorComponent = forwardRef<HTMLAnchorElement, MantineAnchorComponentProps>((props, ref) => {
	return <MantineAnchor ref={ref} {...props} component="a"/>;
})

const CreatedAnchorComponent = createLink(MantineAnchorComponent);

const Anchor: LinkComponent<typeof MantineAnchorComponent> = (
	props
) => {
	return <CreatedAnchorComponent preload="intent" {...props} />;
}

export const Link = {
	Button,
	NavLink,
	Anchor
}