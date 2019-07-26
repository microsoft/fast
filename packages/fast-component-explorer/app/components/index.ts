import { TestComponentViewConfig } from "./data.props";
import glyphSchema from "./glyph/glyph.schema";
import Glyph from "./glyph/glyph";
import groupSchema from "./group/group.schema";
import { Group } from "./group/group";
import carouselHeroContentSchema from "./carousel/carousel-hero-content.schema";
import CarouselHeroContent from "./carousel/carousel-hero-content";

const glyph: TestComponentViewConfig = {
    schema: glyphSchema,
    component: Glyph,
};

const group: TestComponentViewConfig = {
    schema: groupSchema,
    component: Group,
};

const carouselHeroContent: TestComponentViewConfig = {
    schema: carouselHeroContentSchema,
    component: CarouselHeroContent,
};

export { carouselHeroContent, glyph, group };
