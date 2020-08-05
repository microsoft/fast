#include <emscripten.h>
#include "permutate.h"

/**
 * Define the callback function on the Module object
 * TODO: this should be changed to use custom messages or
 * a global var assigned by the user
 */
EM_JS(void, permutate_callback, (char* permutation),
    {
        Module.onPermutate(UTF8ToString(permutation));
    }
);

/**
 * Calls the permutator function
 */
void permutate(char* permutatorConfig)
{
    permutator(permutatorConfig, permutate_callback);
}
