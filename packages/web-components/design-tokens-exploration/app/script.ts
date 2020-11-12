import { ConfigurationImpl } from "@microsoft/fast-foundation";
import { FASTCard } from "../src/card";

const MyAppConfig = new ConfigurationImpl().register(FASTCard());
