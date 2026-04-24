import type { FASTElementDefinition } from "../components/fast-definitions.js";
import { FAST } from "../platform.js";
import type { ElementViewTemplate } from "../templating/template.js";
import { Message } from "./interfaces.js";

/**
 * Publishes a concrete template for a definition.
 * @internal
 */
export interface TemplatePublisher {
    publishTemplate(
        definition: FASTElementDefinition,
    ): ElementViewTemplate | Promise<ElementViewTemplate>;
}

interface TemplateRequest {
    definition: FASTElementDefinition;
    publisher?: TemplatePublisher;
    publishing?: Promise<void>;
    settled: boolean;
    resolve(template: ElementViewTemplate): void;
    reject(reason: unknown): void;
}

interface TemplateBucket {
    publishers: Set<TemplatePublisher>;
    requests: Set<TemplateRequest>;
}

/**
 * Coordinates declarative template publishers and FAST element definitions.
 * Requests are keyed by registry + element name so scoped registries can
 * resolve templates independently.
 * @internal
 */
export class DeclarativeTemplateBridge {
    private readonly buckets = new WeakMap<
        CustomElementRegistry,
        Map<string, TemplateBucket>
    >();

    public requestTemplate(
        definition: FASTElementDefinition,
    ): Promise<ElementViewTemplate> {
        return new Promise((resolve, reject) => {
            const bucket = this.getBucket(definition.registry, definition.name, true)!;
            const request: TemplateRequest = {
                definition,
                settled: false,
                resolve,
                reject,
            };

            bucket.requests.add(request);
            this.processBucket(definition.registry, definition.name);
        });
    }

    public registerPublisher(
        registry: CustomElementRegistry,
        name: string | undefined,
        publisher: TemplatePublisher,
    ): void {
        if (!name) {
            return;
        }

        const bucket = this.getBucket(registry, name, true)!;
        bucket.publishers.add(publisher);
        this.processBucket(registry, name);
    }

    public unregisterPublisher(
        registry: CustomElementRegistry,
        name: string | undefined,
        publisher: TemplatePublisher,
    ): void {
        if (!name) {
            return;
        }

        const bucket = this.getBucket(registry, name);

        if (!bucket) {
            return;
        }

        bucket.publishers.delete(publisher);
        this.resetPublisherRequests(bucket, publisher);
        this.processBucket(registry, name);
        this.cleanupBucket(registry, name, bucket);
    }

    public movePublisher(
        registry: CustomElementRegistry,
        previousName: string | undefined,
        nextName: string | undefined,
        publisher: TemplatePublisher,
    ): void {
        if (previousName === nextName) {
            return;
        }

        this.unregisterPublisher(registry, previousName, publisher);
        this.registerPublisher(registry, nextName, publisher);
    }

    private getBucket(
        registry: CustomElementRegistry,
        name: string,
        create = false,
    ): TemplateBucket | undefined {
        let bucketsByName = this.buckets.get(registry);

        if (!bucketsByName) {
            if (!create) {
                return void 0;
            }

            bucketsByName = new Map<string, TemplateBucket>();
            this.buckets.set(registry, bucketsByName);
        }

        let bucket = bucketsByName.get(name);

        if (!bucket && create) {
            bucket = {
                publishers: new Set<TemplatePublisher>(),
                requests: new Set<TemplateRequest>(),
            };
            bucketsByName.set(name, bucket);
        }

        return bucket;
    }

    private processBucket(registry: CustomElementRegistry, name: string): void {
        const bucket = this.getBucket(registry, name);

        if (!bucket) {
            return;
        }

        const publishers = [...bucket.publishers];

        if (publishers.length > 1) {
            const error = FAST.error(Message.moreThanOneMatchingTemplateProvided, {
                name,
            });

            for (const request of [...bucket.requests]) {
                this.rejectRequest(registry, name, bucket, request, error);
            }

            return;
        }

        if (publishers.length === 0) {
            return;
        }

        const [publisher] = publishers;

        for (const request of bucket.requests) {
            if (request.settled) {
                continue;
            }

            if (request.publisher === publisher && request.publishing) {
                continue;
            }

            request.publisher = publisher;
            request.publishing = Promise.resolve()
                .then(() => publisher.publishTemplate(request.definition))
                .then(template => {
                    if (request.settled) {
                        return;
                    }

                    const currentBucket = this.getBucket(registry, name);

                    if (!currentBucket?.publishers.has(publisher)) {
                        request.publisher = void 0;
                        request.publishing = void 0;
                        this.processBucket(registry, name);
                        return;
                    }

                    this.resolveRequest(registry, name, currentBucket, request, template);
                })
                .catch(error => {
                    if (request.settled) {
                        return;
                    }

                    const currentBucket = this.getBucket(registry, name);

                    if (!currentBucket) {
                        return;
                    }

                    this.rejectRequest(registry, name, currentBucket, request, error);
                });
        }
    }

    private resetPublisherRequests(
        bucket: TemplateBucket,
        publisher: TemplatePublisher,
    ): void {
        for (const request of bucket.requests) {
            if (request.publisher !== publisher) {
                continue;
            }

            request.publisher = void 0;
            request.publishing = void 0;
        }
    }

    private resolveRequest(
        registry: CustomElementRegistry,
        name: string,
        bucket: TemplateBucket,
        request: TemplateRequest,
        template: ElementViewTemplate,
    ): void {
        if (request.settled) {
            return;
        }

        request.settled = true;
        request.publisher = void 0;
        request.publishing = void 0;
        bucket.requests.delete(request);
        this.cleanupBucket(registry, name, bucket);
        request.resolve(template);
    }

    private rejectRequest(
        registry: CustomElementRegistry,
        name: string,
        bucket: TemplateBucket,
        request: TemplateRequest,
        error: unknown,
    ): void {
        if (request.settled) {
            return;
        }

        request.settled = true;
        request.publisher = void 0;
        request.publishing = void 0;
        bucket.requests.delete(request);
        this.cleanupBucket(registry, name, bucket);
        request.reject(error);
    }

    private cleanupBucket(
        registry: CustomElementRegistry,
        name: string,
        bucket: TemplateBucket,
    ): void {
        if (bucket.publishers.size > 0 || bucket.requests.size > 0) {
            return;
        }

        const bucketsByName = this.buckets.get(registry);
        bucketsByName?.delete(name);
    }
}

/**
 * Shared template bridge storage for the current FAST runtime.
 * @internal
 */
export const declarativeTemplateBridge = FAST.getById(
    "fast:declarative-template-bridge",
    () => new DeclarativeTemplateBridge(),
) as DeclarativeTemplateBridge;
