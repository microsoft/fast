import { Direction } from "@microsoft/fast-web-utilities";
import { create } from "./create.js";

/** @public */
export const direction = create<Direction>("direction").withDefault(Direction.ltr);
