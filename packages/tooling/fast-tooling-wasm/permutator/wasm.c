#include <emscripten.h>

int main(int argc, char *argv[])
{
    return 0;
}

int permutate(int n){
    EM_ASM({
        console.log("supplied number", $0, "\n");
    }, n);

    return n * 2;
}
