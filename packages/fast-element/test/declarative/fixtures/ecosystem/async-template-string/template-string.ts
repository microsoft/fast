export const asyncTemplateString = `
<f-template name="async-template-card" data-source="dynamic-import">
    <template>
        <section data-message="{{message}}">
            <h2>{{message}}</h2>
            <p id="description">{{description}}</p>
            <button type="button" @click="{increment()}">Increment</button>
            <span id="count">Count: {{count}}</span>
        </section>
    </template>
</f-template>
`;
