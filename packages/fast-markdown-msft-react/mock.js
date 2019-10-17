// tslint:disable-next-line: typedef
window.matchMedia = jest.fn().mockImplementation(query => {
    return {
        matches: false,
        media: query,
    };
});
