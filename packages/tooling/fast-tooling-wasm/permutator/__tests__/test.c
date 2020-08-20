#include <stdio.h>
#include "dbg.h"
#include "minunit.h"
#ifdef _WIN32
#include <dlfcn-win32.h>
#else
#include <dlfcn.h>
#endif
#include <stdbool.h>
#include <math.h>
#include "../cjson/cJSON.h"
#include "../permutate.h"
#include "../type.h"

typedef struct PermutatedType (*lib_function) (int iteration, struct cJSON *data);
char *lib_file = "libpermutate.so";
void *lib = NULL;

int check_number_type_exact_function(
    const char *func_to_run,
    const int iteration,
    cJSON *data,
    struct PermutatedType expected
)
{
    lib_function func = dlsym(lib, func_to_run);
    check(func != NULL,
        "Did not find %s function in the library %s: %s", func_to_run, lib_file, dlerror());

    struct PermutatedType rc = func(iteration, data);
    check(rc.t.number == expected.t.number, "Function %s return %d for data supplied",
        func_to_run, (int) rc.t.number);

    return 1;
error:
    return 0;
}

int check_number_type_random_function(
    const char *func_to_run,
    const int iteration,
    cJSON *data,
    bool (*tester)(double data)
)
{
    lib_function func = dlsym(lib, func_to_run);
    check(func != NULL,
        "Did not find %s function in the library %s: %s", func_to_run, lib_file, dlerror());

    struct PermutatedType rc = func(iteration, data);
    check(tester(rc.t.number), "Function %s return %d for data supplied",
        func_to_run, (int) rc.t.number);

    return 1;
error:
    return 0;
}

bool test_minimum(double data)
{
    return data >= 99;
}

bool test_exclusive_minimum(double data)
{
    return data > 99;
}

bool test_maximum(double data)
{
    return data <= 1;
}

bool test_exclusive_maximum(double data)
{
    return data < 1;
}

bool test_minimum_and_maximum(double data)
{
    return data >= 6 && data <= 7;
}

bool test_exclusive_minimum_and_maximum(double data)
{
    return data > 6 && data < 8;
}

bool test_multiple_of(double data)
{
    return fmod(data,10) == 0;
}

char *test_dlopen()
{
    lib = dlopen(lib_file, RTLD_NOW);
    mu_assert(lib != NULL, "Failed to open the library to test.");

    return NULL;
}

/**
 * Tests the function called when JSON schema is type "number"
 */
char *test_number_type()
{
    /**
     * Default provided 
     */
    cJSON *defaultConfig = cJSON_Parse("{\"default\": 5}");
    struct PermutatedType defaultConfigExpected = {0};
    defaultConfigExpected.t.number = 5;

    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            0,
            defaultConfig,
            defaultConfigExpected
        ),
        "Failed: should have supplied a default"
    );

    /**
     * Enum provided 
     */
    cJSON *enumConfig = cJSON_Parse("{\"enum\": [8,4,1]}");
    struct PermutatedType enumConfigExpected0 = {0};
    enumConfigExpected0.t.number = 8;
    struct PermutatedType enumConfigExpected1 = {0};
    enumConfigExpected1.t.number = 4;
    struct PermutatedType enumConfigExpected2 = {0};
    enumConfigExpected2.t.number = 1;
    struct PermutatedType enumConfigExpected3 = {0};
    enumConfigExpected3.t.number = 8;

    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            0,
            enumConfig,
            enumConfigExpected0
        ),
        "Failed: should have supplied a value from an enum"
    );
    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            1,
            enumConfig,
            enumConfigExpected1
        ),
        "Failed: should have supplied a value from an enum"
    );
    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            2,
            enumConfig,
            enumConfigExpected2
        ),
        "Failed: should have supplied a value from an enum"
    );
    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            3,
            enumConfig,
            enumConfigExpected3
        ),
        "Failed: should have supplied a value from an enum"
    );

    /**
     * Examples provided 
     */
    cJSON *examplesConfig = cJSON_Parse("{\"examples\": [9,40,13]}");
    struct PermutatedType examplesConfigExpected0 = {0};
    examplesConfigExpected0.t.number = 9;
    struct PermutatedType examplesConfigExpected1 = {0};
    examplesConfigExpected1.t.number = 40;
    struct PermutatedType examplesConfigExpected2 = {0};
    examplesConfigExpected2.t.number = 13;

    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            0,
            examplesConfig,
            examplesConfigExpected0
        ),
        "Failed: should have supplied a value from an enum"
    );
    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            1,
            examplesConfig,
            examplesConfigExpected1
        ),
        "Failed: should have supplied a value from an enum"
    );
    mu_assert(
        check_number_type_exact_function(
            "permutate_number",
            2,
            examplesConfig,
            examplesConfigExpected2
        ),
        "Failed: should have supplied a value from an enum"
    );

    /**
     * Minimum provided 
     */
    cJSON *minimumConfig = cJSON_Parse("{\"minimum\": 99}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            minimumConfig,
            test_minimum
        ),
        "Failed: should have supplied a random value above a minimum"
    );

    /**
     * Maximum provided 
     */
    cJSON *maximumConfig = cJSON_Parse("{\"maximum\": 1}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            maximumConfig,
            test_maximum
        ),
        "Failed: should have supplied a random value below a maximum"
    );

    /**
     * Minimum & Maximum provided 
     */
    cJSON *minimumAndMaximumConfig = cJSON_Parse("{\"minimum\": 6, \"maximum\": 7}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            minimumAndMaximumConfig,
            test_minimum_and_maximum
        ),
        "Failed: should have supplied a random value between a minimum and a maximum"
    );

    /**
     * Exclusive minimum provided
     */
    cJSON *exclusiveMinimumConfig = cJSON_Parse("{\"exclusiveMinimum\": 99}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            exclusiveMinimumConfig,
            test_exclusive_minimum
        ),
        "Failed: should have supplied a random value above an exclusive minimum"
    );

    /**
     * Exclusive maximum provided
     */
    cJSON *exclusiveMaximumConfig = cJSON_Parse("{\"exclusiveMaximum\": 1}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            exclusiveMaximumConfig,
            test_exclusive_maximum
        ),
        "Failed: should have supplied a random value below an exclusive maximum"
    );

    /**
     * Exclusive minimum & exclusive maximum provided
     */
    cJSON *exclusiveMinimumAndMaximumConfig = cJSON_Parse("{\"exclusiveMinimum\": 6, \"exclusiveMaximum\": 8}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            exclusiveMinimumAndMaximumConfig,
            test_exclusive_minimum_and_maximum
        ),
        "Failed: should have supplied a random value between an exclusive minimum and an exclusive maximum"
    );

    /**
     * Multiple of provided
     */
    cJSON *multipleOfConfig = cJSON_Parse("{\"multipleOf\": 10}");
    mu_assert(
        check_number_type_random_function(
            "permutate_number",
            0,
            multipleOfConfig,
            test_multiple_of
        ),
        "Failed: should have supplied a random value that was a multiple of"
    );

    return NULL;
}

char *all_tests()
{
    mu_suite_start();

    mu_run_test(test_dlopen);
    mu_run_test(test_number_type);

    return NULL;
}

RUN_TESTS(all_tests);
