import { html, repeat } from "@microsoft/fast-element";
import { FastFrame } from "./fast-frame";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft";

export const FastFrameTemplate = html<FastFrame>`
    <template>
        <div class="wrapper">
            <fast-tabs orientation="vertical" id="myTab" activeId="TabTwo">
                <fast-tab id="TabOne" title="Mode">
                    <svg
                        class="icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM10 18.5V1.5C14.6944 1.5 18.5 5.30558 18.5 10C18.5 14.6944 14.6944 18.5 10 18.5Z"
                            fill="#C8C8C8"
                        />
                    </svg>
                </fast-tab>
                <fast-tab id="TabTwo" title="Color">
                    <svg
                        class="icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.77405 4.01413C4.72422 -0.0894092 10.8318 -1.28348 15.1796 1.54073C19.4728 4.32946 21.0517 9.69108 19.2933 14.7217C17.633 19.4719 13.2582 21.3539 10.1051 18.9644C8.92397 18.0694 8.46609 16.9473 8.24477 15.1248L8.13906 14.0894L8.0935 13.6729C7.9705 12.694 7.78149 12.2555 7.38699 12.0258C6.84973 11.7129 6.49199 11.7056 5.78653 11.9912L5.43433 12.1438L5.25504 12.2255C4.2381 12.6869 3.56161 12.849 2.70595 12.6617L2.50508 12.6123L2.34104 12.5634C-0.456623 11.6577 -0.871 7.69326 1.77405 4.01413ZM2.76134 11.0529L2.88463 11.0911L3.01899 11.1234C3.45944 11.2146 3.83586 11.1386 4.46049 10.87L5.06454 10.6004C6.27043 10.0838 7.05597 10.0333 8.11956 10.6527C9.04001 11.1887 9.39876 12.0125 9.58174 13.44L9.6351 13.9211L9.68948 14.4784L9.73676 14.9211C9.90937 16.3477 10.2232 17.1119 10.9886 17.692C13.271 19.4216 16.5403 18.0152 17.8799 14.1825C19.4009 9.83105 18.0546 5.25933 14.3851 2.87572C10.6995 0.481614 5.45895 1.50616 2.97716 4.9582C0.895903 7.85312 1.15117 10.4912 2.76134 11.0529ZM14.0208 8.96284C13.8416 8.264 14.2385 7.54568 14.9074 7.35843C15.5764 7.17118 16.2639 7.5859 16.4432 8.28474C16.6224 8.98357 16.2254 9.70189 15.5565 9.88914C14.8876 10.0764 14.2 9.66168 14.0208 8.96284ZM14.5169 12.6189C14.3377 11.9201 14.7347 11.2018 15.4036 11.0145C16.0725 10.8273 16.76 11.242 16.9393 11.9408C17.1185 12.6397 16.7216 13.358 16.0526 13.5452C15.3837 13.7325 14.6962 13.3178 14.5169 12.6189ZM12.0361 5.81604C11.8569 5.11721 12.2539 4.39889 12.9228 4.21163C13.5917 4.02438 14.2792 4.4391 14.4585 5.13794C14.6377 5.83678 14.2407 6.5551 13.5718 6.74235C12.9029 6.9296 12.2154 6.51488 12.0361 5.81604ZM12.0076 15.2463C11.8283 14.5475 12.2253 13.8291 12.8942 13.6419C13.5631 13.4546 14.2507 13.8694 14.4299 14.5682C14.6091 15.267 14.2122 15.9854 13.5433 16.1726C12.8744 16.3599 12.1868 15.9451 12.0076 15.2463ZM8.49974 4.79782C8.32051 4.09898 8.71747 3.38066 9.38638 3.19341C10.0553 3.00616 10.7428 3.42088 10.9221 4.11972C11.1013 4.81855 10.7044 5.53687 10.0354 5.72412C9.36653 5.91138 8.67898 5.49665 8.49974 4.79782Z"
                            fill="#C8C8C8"
                        />
                    </svg>
                </fast-tab>
                <fast-tab id="TabThree" title="Styles">
                    <svg
                        class="icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12.9163 0.108954C14.5978 -0.344806 16.3262 0.660165 16.7768 2.35362L19.8918 14.0612C20.3424 15.7547 19.3445 17.4953 17.6629 17.9491L10.4663 19.891C8.78473 20.3448 7.05629 19.3398 6.60572 17.6464L3.49072 5.9388C3.04015 4.24535 4.03806 2.50469 5.71962 2.05093L12.9163 0.108954ZM3.47925 10.36L5.49855 17.9451C5.70598 18.7248 6.11202 19.3974 6.64717 19.9226L6.13956 19.8951C4.40107 19.8033 3.0656 18.3097 3.15671 16.5589L3.47925 10.36ZM13.3613 1.78147L6.16462 3.72344C5.40028 3.92969 4.94668 4.7209 5.15149 5.49066L8.26648 17.1982C8.47129 17.968 9.25694 18.4248 10.0213 18.2185L17.2179 16.2766C17.9823 16.0703 18.4359 15.2791 18.231 14.5093L15.1161 2.80177C14.9112 2.03202 14.1256 1.57521 13.3613 1.78147ZM2.41945 8.65373L2.01205 16.4985C1.97008 17.305 2.15012 18.0715 2.49836 18.7378L2.02336 18.5524C0.398113 17.9242 -0.413661 16.088 0.210213 14.4512L2.41945 8.65373ZM7.99359 5.02249C8.60506 4.85749 9.23358 5.22293 9.39743 5.83874C9.56127 6.45454 9.19839 7.08751 8.58692 7.25251C7.97544 7.41751 7.34692 7.05207 7.18308 6.43627C7.01923 5.82047 7.38211 5.1875 7.99359 5.02249Z"
                            fill="#C8C8C8"
                        />
                    </svg>
                </fast-tab>
                <fast-tab id="TabFour" title="Density">
                    <svg
                        class="icon"
                        width="22"
                        height="20"
                        viewBox="0 0 22 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18.6825 0C19.9361 0 20.9621 0.973832 21.0455 2.20621L21.0509 2.36837V13.4231C21.0509 14.6766 20.0771 15.7027 18.8447 15.786L18.6825 15.7915L14.2091 15.7912V18.4206L16.0523 18.4211C16.4883 18.4211 16.8417 18.7745 16.8417 19.2105C16.8417 19.6102 16.5447 19.9405 16.1594 19.9928L16.0523 20H4.99988C4.56388 20 4.21043 19.6465 4.21043 19.2105C4.21043 18.8109 4.50743 18.4806 4.89276 18.4283L4.99988 18.4211L6.84089 18.4206V15.7912L2.36837 15.7915C1.11485 15.7915 0.0887928 14.8177 0.00546392 13.5853L0 13.4231V2.36837C0 1.11485 0.973832 0.0887928 2.20621 0.00546393L2.36837 0H18.6825ZM12.6292 15.7912H8.41875L8.4198 18.4211H12.6302L12.6292 15.7912ZM18.6825 1.57891H2.36837C1.9687 1.57891 1.63839 1.87591 1.58612 2.26124L1.57891 2.36837V13.4231C1.57891 13.8228 1.87591 14.1531 2.26124 14.2054L2.36837 14.2126H18.6825C19.0822 14.2126 19.4125 13.9156 19.4648 13.5303L19.472 13.4231V2.36837C19.472 1.9687 19.175 1.63839 18.7897 1.58612L18.6825 1.57891ZM17.3713 3.15782C17.6297 3.15782 17.8445 3.344 17.8891 3.58952L17.8976 3.68413V12.1076C17.8976 12.3659 17.7114 12.5808 17.4659 12.6254L17.3713 12.6339H7.89332C7.63495 12.6339 7.42006 12.4477 7.3755 12.2022L7.36702 12.1076V3.68413C7.36702 3.42575 7.5532 3.21086 7.79872 3.1663L7.89332 3.15782H17.3713ZM5.78742 3.15782C6.0458 3.15782 6.26068 3.344 6.30525 3.58952L6.31373 3.68413V12.1076C6.31373 12.3659 6.12755 12.5808 5.88203 12.6254L5.78742 12.6339H3.68228C3.42391 12.6339 3.20902 12.4477 3.16446 12.2022L3.15598 12.1076V3.68413C3.15598 3.42575 3.34216 3.21086 3.58768 3.1663L3.68228 3.15782H5.78742Z"
                            fill="#C8C8C8"
                        />
                    </svg>
                </fast-tab>
                <fast-tab-panel id="TabPanelOne">
                <fast-switch @change="${(x, c) =>
                    x.themeChange(c.event as MouseEvent)} checked="${x => x.darkMode}">
                    Dark Mode
                </fast-switch>
                </fast-tab-panel>
                <fast-tab-panel id="TabPanelTwo">
                    <div class="content">
                        <h1>FAST FRAME COLORS</h1>
                        <h2>Pre-existing color you can customize.</h2>
                        <p>
                            Ultrices nibh nunc vestibulum fames. At lacus nunc lacus eget
                            neque.
                        </p>
                        <fast-radio-group name="background color" @change="${(x, c) =>
                            x.backgroundChangeHandler(c.event as MouseEvent)}>
                            <label slot="label">Background color</label>
                            ${repeat(x => x.backgroundPalette, html<string>`
                                <site-color-swatch value="${x => x}" backgroundColor="${x => x}">Test</site-color-swatch>
                            `)}
                        </fast-radio-group>
                        <fast-radio-group name="accent color" @change="${(x, c) =>
                            x.accentChangeHandler(c.event as MouseEvent)}>
                            <label slot="label">Accent color</label>
                            ${repeat(x => x.accentPalette, html<string>`
                                <site-color-swatch value="${x => x}" backgroundColor="${x => x}"></site-color-swatch>
                            `)}
                        </fast-radio-group>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel id="TabPanelThree">
                    Tab three content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel id="TabPanelFour">
                    Tab four content. This is for testing.
                </fast-tab-panel>
            </fast-tabs>
            <website-design-system-provider
                use-defaults
                class="preview"
                base-layer-luminance="${x =>
                    x.darkMode
                        ? StandardLuminance.DarkMode
                        : StandardLuminance.LightMode}"
                background-color="${x => x.backgroundColor}"
                accent-base-color="${x => x.accentColor}"
            >
                <fast-card>
                    <div class="image-container">
                        <fast-badge fill="primary" color="primary" class="badge">
                            Badge
                        </fast-badge>
                    </div>
                    <div class="text-container">
                        <h3>Card Options</h3>
                        <p>
                            At purus lectus quis habitant commodo, cras. Aliquam malesuada
                            velit a tortor. Felis orci tellus netus risus et ultricies
                            augue aliquet. Suscipit mattis mus amet nibh...
                        </p>
                        <fast-divider></fast-divider>
                        <div class="sample-control">
                            <span class="sample-control-icon"></span>
                            <span class="sample-control-text">Label</span>
                            <div class="sample-control-actions">
                                <fast-button appearance="stealth">
                                    <svg
                                        class="icon"
                                        width="12"
                                        height="14"
                                        viewBox="0 0 12 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11.4857 6.17143C11.7461 6.17143 11.9613 6.36491 11.9953 6.61593L12 6.68571V11.4863C12 12.6747 11.0699 13.6458 9.89789 13.7114L9.77143 13.7149H2.22857C1.04021 13.7149 0.0690885 12.7847 0.00352789 11.6128L0 11.4863V6.68571C0 6.40168 0.230254 6.17143 0.514286 6.17143C0.774649 6.17143 0.989822 6.36491 1.02388 6.61593L1.02857 6.68571V11.4863C1.02857 12.1159 1.51345 12.6323 2.13015 12.6823L2.22857 12.6863H9.77143C10.401 12.6863 10.9174 12.2014 10.9675 11.5847L10.9714 11.4863V6.68571C10.9714 6.40168 11.2017 6.17143 11.4857 6.17143ZM2.20484 3.57689L5.63084 0.150644C5.81331 -0.0318436 6.09883 -0.0485494 6.30017 0.100608L6.35786 0.150331L9.78976 3.57658C9.99077 3.77726 9.99103 4.10288 9.79036 4.30389C9.60793 4.48662 9.32223 4.50346 9.12077 4.35424L9.06305 4.30449L6.51017 1.75611L6.51078 9.77482C6.51078 10.0352 6.3173 10.2504 6.06628 10.2844L5.99649 10.2891C5.73613 10.2891 5.52096 10.0956 5.4869 9.84461L5.48221 9.77482L5.4816 1.75406L2.93218 4.30418C2.7496 4.48677 2.46389 4.50337 2.26255 4.354L2.20487 4.3042C2.02228 4.12163 2.00567 3.83592 2.15505 3.63458L2.20484 3.57689L5.63084 0.150644L2.20484 3.57689Z"
                                        />
                                    </svg>
                                </fast-button>
                                <fast-button appearance="stealth">
                                    <svg
                                        class="icon"
                                        width="12"
                                        height="3"
                                        viewBox="0 0 12 3"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6 0C6.70595 0 7.27823 0.671573 7.27823 1.5C7.27823 2.32843 6.70595 3 6 3C5.29405 3 4.72177 2.32843 4.72177 1.5C4.72177 0.671573 5.29405 0 6 0ZM10.7218 0C11.4277 0 12 0.671573 12 1.5C12 2.32843 11.4277 3 10.7218 3C10.0158 3 9.44354 2.32843 9.44354 1.5C9.44354 0.671573 10.0158 0 10.7218 0ZM1.27823 0C1.98418 0 2.55646 0.671573 2.55646 1.5C2.55646 2.32843 1.98418 3 1.27823 3C0.572284 3 0 2.32843 0 1.5C0 0.671573 0.572284 0 1.27823 0Z"
                                        />
                                    </svg>
                                </fast-button>
                            </div>
                        </div>
                    </div>
                </fast-card>
                <div class="preview-controls">
                    <fast-progress></fast-progress>
                    <fast-menu>
                        <fast-menu-item role="menuitem">Menu item 1</fast-menu-item>
                        <fast-menu-item role="menuitem">Menu item 2</fast-menu-item>
                        <fast-menu-item role="menuitem">Menu item 3</fast-menu-item>
                        <hr/>
                        <fast-menu-item role="menuitem">Menu item 4</fast-menu-item>
                    </fast-menu>
                    <div class="control-container">
                        <div class="control-container-column">
                            <fast-radio>Radio 1</fast-radio>
                            <fast-radio>Radio 2</fast-radio>
                        </div>
                        <div class="control-container-grid">
                            <fast-switch></fast-switch>
                            <p>Toggle</p>
                            <fast-checkbox class="checkbox"></fast-checkbox>
                            <p class="checkbox-label">Checkbox</p>
                        </div>
                    </div>
                    <fast-text-field placeholder="Text field"></fast-text-field>
                    <div class="control-container-2">
                        <fast-flipper aria-hidden="false"></fast-flipper>
                        <fast-flipper disabled></fast-flipper>
                        <fast-slider></fast-slider>
                    </div>
                    <div class="control-container">
                        <fast-button appearance="accent">
                            Button
                            <svg
                                class="icon-cut"
                                slot="start"
                                width="11"
                                height="15"
                                viewBox="0 0 11 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.4309 13.8721C10.7451 13.872 11 14.1238 11 14.4345C11 14.7452 10.7454 14.9971 10.4312 14.9972L0.56913 15C0.254899 15.0001 0 14.7483 0 14.4376C0 14.127 0.25457 13.875 0.568801 13.8749L10.4309 13.8721ZM5.42279 0.0051353L5.5 0C5.78804 0 6.0261 0.211628 6.06377 0.486201L6.06897 0.562533L6.06821 10.8269L8.89165 8.03648C9.09367 7.83679 9.40976 7.81866 9.63248 7.98209L9.69629 8.03656C9.89827 8.23629 9.9166 8.54881 9.7513 8.76901L9.69621 8.8321L5.90489 12.5798C5.70299 12.7794 5.38711 12.7976 5.16438 12.6344L5.10057 12.58L1.30485 8.83233C1.08251 8.6128 1.08226 8.25662 1.3043 8.03679C1.50616 7.83694 1.82224 7.81857 2.04509 7.98182L2.10894 8.03625L4.93028 10.8216L4.93103 0.562533C4.93103 0.277745 5.14508 0.0423843 5.42279 0.0051353L5.5 0L5.42279 0.0051353Z"
                                />
                            </svg>
                        </fast-button>
                        <fast-button appearance="neutral">
                            Button
                            <svg
                                class="icon"
                                slot="start"
                                width="14"
                                height="16"
                                viewBox="0 0 14 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2.52634 1.20452C1.70406 0.753412 0.668346 1.04814 0.21302 1.86281C0.0733009 2.11279 0 2.39386 0 2.67961V14.307C0 15.2383 0.761969 15.9932 1.7019 15.9932C1.9904 15.9932 2.27415 15.9205 2.52652 15.782L13.1224 9.9675C13.9446 9.5163 14.242 8.49015 13.7866 7.67553C13.6318 7.39875 13.4016 7.17069 13.1222 7.01742L2.52634 1.20452ZM12.794 8.22018C12.9459 8.49172 12.8467 8.83377 12.5727 8.98417L1.97678 14.7987C1.89265 14.8449 1.79807 14.8691 1.7019 14.8691C1.38859 14.8691 1.1346 14.6174 1.1346 14.307V2.67961C1.1346 2.58436 1.15904 2.49067 1.20561 2.40734C1.35738 2.13579 1.70262 2.03754 1.97672 2.18791L12.5726 8.00081C12.6657 8.0519 12.7425 8.12792 12.794 8.22018Z"
                                />
                            </svg>
                        </fast-button>
                    </div>
                </div>
            </website-design-system-provider>
        </div>
    </template>
`;
