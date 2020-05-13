import {
    FASTDesignSystemProvider as BASEDesignSystemProvider,
    designSystemProvider,
} from "@microsoft/fast-components";

// TODO: Do not extend this from fast-components once we update the design systems
// When we rebase this should create the MSFT package and pull from the fast-components-styles-msft package
@designSystemProvider("fast-design-system-provider")
export class FASTDesignSystemProvider extends BASEDesignSystemProvider {}
