/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import {
    IGraph,
    prepScopes,
    CacheItem,
    CacheService,
    CacheStore,
} from "@microsoft/mgt-element";
import { Group } from "@microsoft/microsoft-graph-types";
import { schemas } from "./cacheStores";

/**
 * Group Type enumeration
 *
 * @export
 * @enum {number}
 */
export enum GroupType {
    /**
     * Any group Type
     */
    any = 0,

    /**
     * Office 365 group
     */
    // tslint:disable-next-line:no-bitwise
    unified = 1 << 0,

    /**
     * Security group
     */
    // tslint:disable-next-line:no-bitwise
    security = 1 << 1,

    /**
     * Mail Enabled Security group
     */
    // tslint:disable-next-line:no-bitwise
    mailenabledsecurity = 1 << 2,

    /**
     * Distribution Group
     */
    // tslint:disable-next-line:no-bitwise
    distribution = 1 << 3,
}

/**
 * Object to be stored in cache representing individual people
 */
interface CacheGroupQuery extends CacheItem {
    /**
     * json representing a person stored as string
     */
    groups?: string[];
    /**
     * top number of results
     */
    top?: number;
}

/**
 * Defines the expiration time
 */
const getGroupsInvalidationTime = (): number =>
    CacheService.config.groups.invalidationPeriod ||
    CacheService.config.defaultInvalidationPeriod;

/**
 * Whether the groups store is enabled
 */
const getIsGroupsCacheEnabled = (): boolean =>
    CacheService.config.groups.isEnabled && CacheService.config.isEnabled;

/**
 * Searches the Graph for Groups
 *
 * @export
 * @param {IGraph} graph
 * @param {string} query - what to search for
 * @param {number} [top=10] - number of groups to return
 * @param {GroupType} [groupTypes=GroupType.any] - the type of group to search for
 * @returns {Promise<Group[]>} An array of Groups
 */
export async function findGroups(
    graph: IGraph,
    query: string,
    top: number = 10,
    groupTypes: GroupType = GroupType.any
): Promise<Group[]> {
    const scopes = "Group.Read.All";

    let cache: CacheStore<CacheGroupQuery>;
    const key = query || "*" + groupTypes;

    if (getIsGroupsCacheEnabled()) {
        // @ts-ignore
        cache = CacheService.getCache(schemas.groups, schemas.groups.stores.groupsQuery);
        const cacheGroupQuery = await cache.getValue(key);
        if (
            cacheGroupQuery &&
            getGroupsInvalidationTime() > Date.now() - cacheGroupQuery.timeCached
        ) {
            if (cacheGroupQuery.top >= top) {
                // if request is less than the cache's requests, return a slice of the results
                return cacheGroupQuery.groups.map(x => JSON.parse(x)).slice(0, top + 1);
            }
            // if the new request needs more results than what's presently in the cache, graph must be called again
        }
    }

    let filterQuery = "";
    if (query !== "") {
        filterQuery = `(startswith(displayName,'${query}') or startswith(mailNickname,'${query}') or startswith(mail,'${query}'))`;
    }

    if (groupTypes !== GroupType.any) {
        const filterGroups = [];

        // tslint:disable-next-line:no-bitwise
        if (GroupType.unified === (groupTypes & GroupType.unified)) {
            filterGroups.push("groupTypes/any(c:c+eq+'Unified')");
        }

        // tslint:disable-next-line:no-bitwise
        if (GroupType.security === (groupTypes & GroupType.security)) {
            filterGroups.push("(mailEnabled eq false and securityEnabled eq true)");
        }

        // tslint:disable-next-line:no-bitwise
        if (
            GroupType.mailenabledsecurity ===
            (groupTypes & GroupType.mailenabledsecurity)
        ) {
            filterGroups.push("(mailEnabled eq true and securityEnabled eq true)");
        }

        // tslint:disable-next-line:no-bitwise
        if (GroupType.distribution === (groupTypes & GroupType.distribution)) {
            filterGroups.push("(mailEnabled eq true and securityEnabled eq false)");
        }

        filterQuery += (query !== "" ? " and " : "") + filterGroups.join(" or ");
    }

    const result = await graph
        .api("groups")
        .filter(filterQuery)
        .top(top)
        .middlewareOptions(prepScopes(scopes))
        .get();

    if (getIsGroupsCacheEnabled() && result) {
        cache.putValue(key, {
            groups: result.value.map(x => JSON.stringify(x)),
            top: top,
        });
    }

    return result ? result.value : null;
}

/**
 * Searches the Graph for Groups
 *
 * @export
 * @param {IGraph} graph
 * @param {string} query - what to search for
 * @param {string} groupId - what to search for
 * @param {number} [top=10] - number of groups to return
 * @param {boolean} [transitive=false] - whether the return should contain a flat list of all nested members
 * @param {GroupType} [groupTypes=GroupType.any] - the type of group to search for
 * @returns {Promise<Group[]>} An array of Groups
 */
export async function findGroupsFromGroup(
    graph: IGraph,
    query: string,
    groupId: string,
    top: number = 10,
    transitive: boolean = false,
    groupTypes: GroupType = GroupType.any
): Promise<Group[]> {
    const scopes = "Group.Read.All";

    let cache: CacheStore<CacheGroupQuery>;
    const key = `${groupId}:${query || "*"}:${groupTypes}:${transitive}`;

    if (getIsGroupsCacheEnabled()) {
        // @ts-ignore
        cache = CacheService.getCache(schemas.groups, schemas.groups.stores.groupsQuery);
        const cacheGroupQuery = await cache.getValue(key);
        if (
            cacheGroupQuery &&
            getGroupsInvalidationTime() > Date.now() - cacheGroupQuery.timeCached
        ) {
            if (cacheGroupQuery.top >= top) {
                // if request is less than the cache's requests, return a slice of the results
                return cacheGroupQuery.groups.map(x => JSON.parse(x)).slice(0, top + 1);
            }
            // if the new request needs more results than what's presently in the cache, graph must be called again
        }
    }

    const apiUrl = `groups/${groupId}/${
        transitive ? "transitiveMembers" : "members"
    }/microsoft.graph.group`;
    let filterQuery = "";
    if (query !== "") {
        filterQuery = `(startswith(displayName,'${query}') or startswith(mailNickname,'${query}') or startswith(mail,'${query}'))`;
    }

    if (groupTypes !== GroupType.any) {
        const filterGroups = [];

        // tslint:disable-next-line:no-bitwise
        if (GroupType.unified === (groupTypes & GroupType.unified)) {
            filterGroups.push("groupTypes/any(c:c+eq+'Unified')");
        }

        // tslint:disable-next-line:no-bitwise
        if (GroupType.security === (groupTypes & GroupType.security)) {
            filterGroups.push("(mailEnabled eq false and securityEnabled eq true)");
        }

        // tslint:disable-next-line:no-bitwise
        if (
            GroupType.mailenabledsecurity ===
            (groupTypes & GroupType.mailenabledsecurity)
        ) {
            filterGroups.push("(mailEnabled eq true and securityEnabled eq true)");
        }

        // tslint:disable-next-line:no-bitwise
        if (GroupType.distribution === (groupTypes & GroupType.distribution)) {
            filterGroups.push("(mailEnabled eq true and securityEnabled eq false)");
        }

        filterQuery += (query !== "" ? " and " : "") + filterGroups.join(" or ");
    }

    const result = await graph
        .api(apiUrl)
        .filter(filterQuery)
        .count(true)
        .top(top)
        .header("ConsistencyLevel", "eventual")
        .middlewareOptions(prepScopes(scopes))
        .get();

    if (getIsGroupsCacheEnabled() && result) {
        cache.putValue(key, {
            groups: result.value.map(x => JSON.stringify(x)),
            top: top,
        });
    }

    return result ? result.value : null;
}
