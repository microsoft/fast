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
import { Contact, Person, User } from "@microsoft/microsoft-graph-types";
import { extractEmailAddress } from "../utils/Utils";
import { schemas } from "./cacheStores";
import { IDynamicPerson } from "./types";

/**
 * Person Type enum
 *
 * @export
 * @enum {number}
 */
export enum PersonType {
    /**
     * Any type
     */
    any = 0,

    /**
     * A Person such as User or Contact
     */
    person = "person",

    /**
     * A group
     */
    group = "group",
}

/**
 * Object to be stored in cache representing individual people
 */
interface CachePerson extends CacheItem {
    /**
     * json representing a person stored as string
     */
    person?: string;
}

/**
 * Stores results of queries (multiple people returned)
 */
interface CachePeopleQuery extends CacheItem {
    /**
     * max number of results the query asks for
     */
    maxResults?: number;
    /**
     * list of people returned by query (might be less than max results!)
     */
    results?: string[];
}

/**
 * Defines the expiration time
 */
const getPeopleInvalidationTime = (): number =>
    CacheService.config.people.invalidationPeriod ||
    CacheService.config.defaultInvalidationPeriod;

/**
 * Whether the people store is enabled
 */
const getIsPeopleCacheEnabled = (): boolean =>
    CacheService.config.people.isEnabled && CacheService.config.isEnabled;

/**
 * async promise, returns all Graph people who are most relevant contacts to the signed in user.
 *
 * @param {string} query
 * @param {number} [top=10] - number of people to return
 * @param {PersonType} [personType=PersonType.person] - the type of person to search for
 * @returns {(Promise<Person[]>)}
 */
export async function findPeople(
    graph: IGraph,
    query: string,
    top: number = 10,
    personType: PersonType = PersonType.person
): Promise<Person[]> {
    const scopes = "people.read";

    let cache: CacheStore<CachePeopleQuery>;

    if (getIsPeopleCacheEnabled()) {
        // @ts-ignore
        cache = CacheService.getCache<CachePeopleQuery>(
            schemas.people,
            schemas.people.stores.peopleQuery
        );
        const result: CachePeopleQuery = getIsPeopleCacheEnabled()
            ? await cache.getValue(query)
            : null;
        if (result && getPeopleInvalidationTime() > Date.now() - result.timeCached) {
            return result.results.map(peopleStr => JSON.parse(peopleStr));
        }
    }
    let filterQuery = "";

    if (personType !== PersonType.any) {
        // converts personType to capitalized case
        const personTypeString =
            personType.toString().charAt(0).toUpperCase() +
            personType.toString().slice(1);
        filterQuery = `personType/class eq '${personTypeString}'`;
    }

    const graphResult = await graph
        .api("/me/people")
        .search('"' + query + '"')
        .top(top)
        .filter(filterQuery)
        .middlewareOptions(prepScopes(scopes))
        .get();

    if (getIsPeopleCacheEnabled() && graphResult) {
        const item = { maxResults: top, results: null };
        item.results = graphResult.value.map(personStr => JSON.stringify(personStr));
        cache.putValue(query, item);
    }
    return graphResult ? graphResult.value : null;
}

/**
 * async promise to the Graph for People, by default, it will request the most frequent contacts for the signed in user.
 *
 * @returns {(Promise<Person[]>)}
 * @memberof Graph
 */
export async function getPeople(graph: IGraph): Promise<Person[]> {
    const scopes = "people.read";

    let cache: CacheStore<CachePeopleQuery>;
    if (getIsPeopleCacheEnabled()) {
        // @ts-ignore
        cache = CacheService.getCache<CachePeopleQuery>(
            schemas.people,
            schemas.people.stores.peopleQuery
        );
        const cacheRes = await cache.getValue("*");

        if (cacheRes && getPeopleInvalidationTime() > Date.now() - cacheRes.timeCached) {
            return cacheRes.results.map(ppl => JSON.parse(ppl));
        }
    }

    const uri = "/me/people";
    const people = await graph
        .api(uri)
        .middlewareOptions(prepScopes(scopes))
        .filter("personType/class eq 'Person'")
        .get();
    if (getIsPeopleCacheEnabled() && people) {
        cache.putValue("*", {
            maxResults: 10,
            results: people.value.map(ppl => JSON.stringify(ppl)),
        });
    }
    return people ? people.value : null;
}

/**
 * returns a promise that resolves after specified time
 * @param time in milliseconds
 */
export function getEmailFromGraphEntity(entity: IDynamicPerson): string {
    const person = entity as Person;
    const user = entity as User;
    const contact = entity as Contact;

    if (user.mail) {
        return extractEmailAddress(user.mail);
    } else if (person.scoredEmailAddresses && person.scoredEmailAddresses.length) {
        return extractEmailAddress(person.scoredEmailAddresses[0].address);
    } else if (contact.emailAddresses && contact.emailAddresses.length) {
        return extractEmailAddress(contact.emailAddresses[0].address);
    }
    return null;
}

/**
 * async promise, returns a Graph contact associated with the email provided
 *
 * @param {string} email
 * @returns {(Promise<Contact[]>)}
 * @memberof Graph
 */
export async function findContactsByEmail(
    graph: IGraph,
    email: string
): Promise<Contact[]> {
    const scopes = "contacts.read";
    let cache: CacheStore<CachePerson>;
    if (getIsPeopleCacheEnabled()) {
        // @ts-ignore
        cache = CacheService.getCache<CachePerson>(
            schemas.people,
            schemas.people.stores.contacts
        );
        const contact = await cache.getValue(email);

        if (contact && getPeopleInvalidationTime() > Date.now() - contact.timeCached) {
            return JSON.parse(contact.person);
        }
    }

    const result = await graph
        .api("/me/contacts")
        .filter(`emailAddresses/any(a:a/address eq '${email}')`)
        .middlewareOptions(prepScopes(scopes))
        .get();

    if (getIsPeopleCacheEnabled() && result) {
        cache.putValue(email, { person: JSON.stringify(result.value) });
    }

    return result ? result.value : null;
}
