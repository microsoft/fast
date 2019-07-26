import { TestComponentViewConfig } from "./data.props";
import glyphSchema from "./glyph/glyph.schema";
import Glyph from "./glyph/glyph";
import groupSchema from "./group/group.schema";
import { Group } from "./group/group";
import carouselDarkImageContentSchema from "./carousel/carousel-dark-image-content.schema";
import CarouselDarkImageContent from "./carousel/carousel-dark-image-content";
import carouselHeroContentSchema from "./carousel/carousel-hero-content.schema";
import CarouselHeroContent from "./carousel/carousel-hero-content";
import carouselLightImageContentSchema from "./carousel/carousel-light-image-content.schema";
import CarouselLightImageContent from "./carousel/carousel-light-image-content";

const glyph: TestComponentViewConfig = {
    schema: glyphSchema,
    component: Glyph,
};

const group: TestComponentViewConfig = {
    schema: groupSchema,
    component: Group,
};

const carouselDarkImageContent: TestComponentViewConfig = {
    schema: carouselDarkImageContentSchema,
    component: CarouselDarkImageContent,
};

const carouselHeroContent: TestComponentViewConfig = {
    schema: carouselHeroContentSchema,
    component: CarouselHeroContent,
};

const carouselLightImageContent: TestComponentViewConfig = {
    schema: carouselLightImageContentSchema,
    component: CarouselLightImageContent,
};

export {
    carouselDarkImageContent,
    carouselHeroContent,
    carouselLightImageContent,
    glyph,
    group,
};
