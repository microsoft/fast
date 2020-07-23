#include <stdio.h>
#include "dbg.h"
#include "minunit.h"
#include <dlfcn.h>

typedef int (*lib_function) (const char *data);
char *lib_file = "libpermutate.so";
void *lib = NULL;

int check_function(const char *func_to_run, const char *data, int expected)
{
    lib_function func = dlsym(lib, func_to_run);
    check(func != NULL,
        "Did not find %s function in the library %s: %s", func_to_run, lib_file, dlerror());

    int rc = func(data);
    check(rc == expected, "Function %s return %d for data: %s",
        func_to_run, rc, data);

    return 1;
error:
    return 0;
}

char *test_dlopen()
{
    lib = dlopen(lib_file, RTLD_NOW);
    mu_assert(lib != NULL, "Failed to open the library to test.");

    return NULL;
}

char *all_tests()
{
    mu_suite_start();

    mu_run_test(test_dlopen);

    return NULL;
}

RUN_TESTS(all_tests);
