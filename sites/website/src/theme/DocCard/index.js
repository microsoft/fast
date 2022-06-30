/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import Link from "@docusaurus/Link";
import { findFirstCategoryLink, useDocById } from "@docusaurus/theme-common";
import clsx from "clsx";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

function CardContainer({ href, children }) {
    const className = clsx(
        "card margin-bottom--lg padding--lg",
        styles.cardContainer,
        href && styles.cardContainerLink
    );
    return href ? (
        <Link href={href} className={className}>
            {children}
        </Link>
    ) : (
        <div className={className}>{children}</div>
    );
}

export function CardLayout({ href, icon, title, description }) {
    return (
        <CardContainer href={href}>
            <h2 className={clsx("text--truncate", styles.cardTitle)} title={title}>
                {icon} {title}
            </h2>
            <div
                className={clsx("text", styles.cardDescription, styles.lineClamp)}
                title={description}
            >
                {description}
            </div>
        </CardContainer>
    );
}

function CardCategory({ item }) {
    const href = findFirstCategoryLink(item);
    return (
        <CardLayout
            href={href}
            icon=""
            title={item.label}
            description={translate(
                {
                    message: item.customProps?.description || "{count} items",
                    id: "theme.docs.DocCard.categoryDescription",
                    description:
                        "The default description for a category card in the generated index about how many items this category includes",
                },
                {
                    count: item.items.length,
                }
            )}
        />
    );
}

function CardLink({ item }) {
    const icon = isInternalUrl(item.href) ? "" : "🔗";
    const doc = useDocById(item.docId ?? undefined);
    return (
        <CardLayout
            href={item.href}
            icon={icon}
            title={item.label}
            description={item.customProps?.description || doc?.description}
        />
    );
}

export default function DocCard({ item }) {
    switch (item.type) {
        case "link":
            return <CardLink item={item} />;

        case "category":
            return <CardCategory item={item} />;

        default:
            throw new Error(`unknown item type ${JSON.stringify(item)}`);
    }
}
