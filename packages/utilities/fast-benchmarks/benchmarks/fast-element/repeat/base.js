export default {
    basic: {
        reverse: [
            {
                itemCount: 100,
            },
            {
                itemCount: 1000,
            },
        ],
        shift: [
            {
                itemCount: 100,
            },
            {
                itemCount: 1000,
            },
        ],
        sort: [
            {
                itemCount: 100,
            },
            {
                itemCount: 1000,
            },
        ],
        push: [
            {
                addCount: 1,
                itemCount: 10000,
            },
            {
                addCount: 1000,
                itemCount: 10000,
            },
            {
                addCount: 1,
                itemCount: 100,
            },
            {
                addCount: 1000,
                itemCount: 100,
            },
        ],
        unshift: [
            {
                addCount: 1,
                itemCount: 10000,
            },
            {
                addCount: 1000,
                itemCount: 10000,
            },
            {
                addCount: 1,
                itemCount: 100,
            },
            {
                addCount: 1000,
                itemCount: 100,
            },
        ],
        splice: [
            {
                deleteCount: 1,
                addCount: 1,
                itemCount: 1000,
            },
            {
                deleteCount: 100,
                addCount: 100,
                itemCount: 1000,
            },
            {
                deleteCount: 1,
                addCount: 100,
                itemCount: 1000,
            },
            {
                deleteCount: 100,
                addCount: 1,
                itemCount: 1000,
            },
            {
                deleteCount: 1,
                addCount: 1,
                itemCount: 1000,
                startIndex: 499,
            },
            {
                deleteCount: 100,
                addCount: 100,
                itemCount: 1000,
                startIndex: 499,
            },
        ],
    },
    nested: {
        reverse: [
            {
                loopCount: 10,
                itemCount: 50,
            },
            {
                loopCount: 10,
                itemCount: 100,
            },
        ],
        shift: [
            {
                loopCount: 10,
                itemCount: 50,
            },
            {
                loopCount: 10,
                itemCount: 100,
            },
        ],
        push: [
            {
                loopCount: 10,
                itemCount: 50,
            },
            {
                loopCount: 10,
                itemCount: 100,
            },
        ],
        sort: [
            {
                loopCount: 10,
                itemCount: 100,
            },
            {
                loopCount: 10,
                itemCount: 1000,
            },
        ],
        splice: [
            {
                loopCount: 10,
                deleteCount: 1,
                addCount: 1,
                itemCount: 50,
            },
            {
                loopCount: 10,
                deleteCount: 20,
                addCount: 20,
                itemCount: 50,
            },
            {
                loopCount: 10,
                deleteCount: 1,
                addCount: 1,
                itemCount: 100,
            },
            {
                loopCount: 10,
                deleteCount: 20,
                addCount: 20,
                itemCount: 100,
            },
            {
                loopCount: 10,
                deleteCount: 1,
                addCount: 20,
                itemCount: 100,
            },
            {
                loopCount: 10,
                deleteCount: 20,
                addCount: 1,
                itemCount: 100,
            },
            {
                loopCount: 10,
                deleteCount: 0,
                addCount: 10,
                itemCount: 50,
                startIndex: 24,
            },
            {
                loopCount: 10,
                deleteCount: 10,
                addCount: 0,
                itemCount: 50,
                startIndex: 24,
            },
            {
                loopCount: 10,
                deleteCount: 1,
                addCount: 1,
                itemCount: 50,
                startIndex: 24,
            },
            {
                loopCount: 10,
                deleteCount: 20,
                addCount: 20,
                itemCount: 50,
                startIndex: 24,
            },
        ],
    },
};
