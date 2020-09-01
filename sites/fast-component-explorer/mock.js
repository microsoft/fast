window.matchMedia = jest.fn().mockImplementation(query => {
    return {
        matches: false,
        media: query,
    };
});
