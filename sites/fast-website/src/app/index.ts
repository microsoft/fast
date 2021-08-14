import { DesignSystem } from "@microsoft/fast-foundation";
import { allComponents } from "@microsoft/fast-components";
import "./css/style.css";

DesignSystem.getOrCreate().register(Object.values(allComponents).map(x => x()));

export * from "./components";
