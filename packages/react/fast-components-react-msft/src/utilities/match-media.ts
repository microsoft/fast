/* eslint-disable-next-line @typescript-eslint/typedef */
window.matchMedia = jest.fn().mockImplementation(query => {
    return {
        matches: false,
        media: query,
    };
});
